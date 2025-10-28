# QETTA 구현 계획 교차 검증 보고서

**검증일**: 2025-10-28  
**검증 방식**: Multi-Agent Deep-Dive Cross-Verification  
**검증 범위**: 아키텍처, 기술 스택, 일정, 보안, 성능, 통합성

---

## 🔍 Agent 1: Architecture Validator (아키텍처 검증)

### ✅ 검증 통과 항목

1. **Monorepo 구조**
   - ✅ Turborepo 선택 적절 (패키지 간 의존성 관리 용이)
   - ✅ packages/ 와 services/ 분리 명확
   - ✅ shared 패키지로 타입/유틸 공유 설계 우수

2. **기술 스택 일관성**
   - ✅ TypeScript 전체 적용 (5.3+ backend, 5.8+ frontend)
   - ✅ Fastify (backend) + Next.js (frontend) 명확한 역할 분리
   - ✅ Prisma ORM + PostgreSQL 조합 안정적

3. **확장성 설계**
   - ✅ BullMQ workers 분리 (account-sync, document-ocr, verification)
   - ✅ 패키지 분리 (verifier, debt-analyzer) 재사용 가능

### ⚠️ 발견된 문제점

#### 🔴 Critical Issue 1: Prisma Schema 누락
**문제**: Day 1-2에 "Prisma schema 작성"만 명시, 실제 스키마 정의 없음

**영향**: 
- DB 마이그레이션 불가
- 타입 안정성 부족
- Day 3-4부터 개발 블로킹

**해결책**: Prisma schema 완전 정의 필요
```prisma
// prisma/schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id            String    @id @default(cuid())
  email         String    @unique
  passwordHash  String
  name          String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  oauthConnections OAuthConnection[]
  accounts         Account[]
  documents        Document[]
  debtAnalyses     DebtAnalysis[]
  applications     Application[]
  
  @@map("users")
}

model OAuthConnection {
  id           String    @id @default(cuid())
  userId       String
  provider     String    // 'toss' | 'kftc'
  accessToken  String    @db.Text
  refreshToken String?   @db.Text
  expiresAt    DateTime?
  userSeqNo    String?   // KFTC user sequence number
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt
  
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@unique([userId, provider])
  @@map("oauth_connections")
}

model Account {
  id              String    @id @default(cuid())
  userId          String
  provider        String    // 'toss' | 'kftc'
  bankCode        String    // 은행 코드
  bankName        String
  accountNumber   String    // 마스킹 처리된 계좌번호
  fintechUseNum   String?   // KFTC fintech use number
  accountType     String    // 'savings' | 'checking' | 'investment'
  balance         Decimal   @db.Decimal(15, 2)
  currency        String    @default("KRW")
  isActive        Boolean   @default(true)
  lastSyncedAt    DateTime?
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  
  user         User          @relation(fields: [userId], references: [id], onDelete: Cascade)
  transactions Transaction[]
  
  @@index([userId])
  @@map("accounts")
}

model Transaction {
  id              String    @id @default(cuid())
  accountId       String
  transactionDate DateTime
  description     String
  amount          Decimal   @db.Decimal(15, 2)
  balance         Decimal   @db.Decimal(15, 2)
  type            String    // 'debit' | 'credit'
  category        String?   // 'salary' | 'expense' | 'transfer' | etc
  counterparty    String?   // 거래 상대방
  memo            String?
  createdAt       DateTime  @default(now())
  
  account Account @relation(fields: [accountId], references: [id], onDelete: Cascade)
  
  @@index([accountId, transactionDate])
  @@map("transactions")
}

model Document {
  id            String    @id @default(cuid())
  userId        String
  type          String    // 'salary_statement' | 'employment_certificate' | 'debt_certificate'
  fileName      String
  fileSize      Int
  mimeType      String
  s3Key         String    @unique
  s3Url         String
  ocrStatus     String    @default("pending") // 'pending' | 'processing' | 'completed' | 'failed'
  ocrResult     Json?     // OCR 결과 (Clova OCR response)
  uploadedAt    DateTime  @default(now())
  
  user         User                  @relation(fields: [userId], references: [id], onDelete: Cascade)
  verifications DocumentVerification[]
  
  @@index([userId, type])
  @@map("documents")
}

model DocumentVerification {
  id            String    @id @default(cuid())
  documentId    String
  status        String    // 'pending' | 'verified' | 'rejected' | 'suspicious'
  confidence    Float     // 0.0 ~ 1.0
  matchedData   Json?     // 매칭된 거래 내역 데이터
  anomalies     Json[]    // 발견된 이상 항목들
  verifiedAt    DateTime  @default(now())
  
  document Document @relation(fields: [documentId], references: [id], onDelete: Cascade)
  
  @@index([documentId])
  @@map("document_verifications")
}

model DebtAnalysis {
  id              String    @id @default(cuid())
  userId          String
  totalDebt       Decimal   @db.Decimal(15, 2)
  totalAssets     Decimal   @db.Decimal(15, 2)
  annualIncome    Decimal   @db.Decimal(15, 2)
  dti             Float     // Debt-to-Income ratio
  dsr             Float     // Debt Service Ratio
  creditGrade     String    // '1' ~ '10'
  riskLevel       String    // 'low' | 'medium' | 'high'
  debtBreakdown   Json      // 채무 유형별 분류
  recommendations Json[]    // 추천 사항들
  analyzedAt      DateTime  @default(now())
  
  user         User             @relation(fields: [userId], references: [id], onDelete: Cascade)
  policyMatches PolicyMatch[]
  
  @@index([userId, analyzedAt])
  @@map("debt_analyses")
}

model PolicyMatch {
  id               String    @id @default(cuid())
  debtAnalysisId   String
  policyType       String    // 'sinbokwi' | 'saechulbal' | 'gaein_hoesaeng'
  policyName       String
  eligible         Boolean
  reductionAmount  Decimal   @db.Decimal(15, 2)
  repaymentPeriod  String    // '5 years' | '10 years'
  monthlyPayment   Decimal   @db.Decimal(15, 2)
  requirements     String[]  // 자격 요건 리스트
  recommended      Boolean   @default(false)
  matchedAt        DateTime  @default(now())
  
  debtAnalysis DebtAnalysis @relation(fields: [debtAnalysisId], references: [id], onDelete: Cascade)
  applications Application[]
  
  @@index([debtAnalysisId])
  @@map("policy_matches")
}

model Application {
  id             String    @id @default(cuid())
  userId         String
  policyMatchId  String
  status         String    @default("draft") // 'draft' | 'submitted' | 'approved' | 'rejected'
  pdfS3Key       String?
  pdfUrl         String?
  submittedAt    DateTime?
  createdAt      DateTime  @default(now())
  updatedAt      DateTime  @updatedAt
  
  user        User         @relation(fields: [userId], references: [id], onDelete: Cascade)
  policyMatch PolicyMatch  @relation(fields: [policyMatchId], references: [id])
  
  @@index([userId, status])
  @@map("applications")
}
```

#### 🟡 Medium Issue 1: Worker Queue 초기화 로직 누락
**문제**: BullMQ worker 파일만 언급, Queue 연결 및 초기화 코드 미정의

**해결책**:
```typescript
// services/api/src/config/queue.ts
import { Queue, Worker, QueueScheduler } from 'bullmq';
import { Redis } from 'ioredis';

const redisConnection = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  maxRetriesPerRequest: null,
});

// Queues
export const accountSyncQueue = new Queue('account-sync', { connection: redisConnection });
export const documentOCRQueue = new Queue('document-ocr', { connection: redisConnection });
export const verificationQueue = new Queue('verification', { connection: redisConnection });

// Schedulers (for recurring jobs)
export const accountSyncScheduler = new QueueScheduler('account-sync', { connection: redisConnection });

// Cron job: 매일 새벽 2시 계좌 동기화
accountSyncQueue.add('sync-all-accounts', {}, {
  repeat: {
    pattern: '0 2 * * *', // Every day at 2 AM
  },
});
```

#### 🟡 Medium Issue 2: Next.js API Routes 불필요
**문제**: `services/web/src/app/api/auth/[...nextauth]/route.ts` 언급

**분석**:
- QETTA는 Fastify backend에서 모든 API 처리
- Next.js API routes는 불필요 (serverless functions 사용 X)
- NextAuth 사용 안 함 (커스텀 JWT 인증)

**해결책**: API routes 디렉토리 제거, 모든 API는 Fastify로 통합

---

## 🔍 Agent 2: Security Auditor (보안 검증)

### ✅ 검증 통과 항목

1. **인증/인가**
   - ✅ JWT 토큰 만료 시간 15분 (적절)
   - ✅ Refresh token rotation 명시
   - ✅ OAuth state parameter CSRF 방지

2. **데이터 암호화**
   - ✅ AES-256-GCM 명시
   - ✅ HTTPS only 강제

3. **Rate Limiting**
   - ✅ 100 req/min per IP 설정

### ⚠️ 발견된 문제점

#### 🔴 Critical Issue 2: OAuth Token 저장 보안 취약
**문제**: OAuth accessToken/refreshToken을 DB에 평문 저장 가능성

**해결책**: 토큰 암호화 후 저장
```typescript
// packages/shared/src/utils/encryption.ts
import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const KEY = Buffer.from(process.env.ENCRYPTION_KEY!, 'hex'); // 32 bytes
const IV_LENGTH = 16;
const AUTH_TAG_LENGTH = 16;

export function encrypt(text: string): string {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv);
  
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  const authTag = cipher.getAuthTag();
  
  // iv + authTag + encrypted (hex format)
  return iv.toString('hex') + authTag.toString('hex') + encrypted;
}

export function decrypt(encrypted: string): string {
  const iv = Buffer.from(encrypted.slice(0, IV_LENGTH * 2), 'hex');
  const authTag = Buffer.from(encrypted.slice(IV_LENGTH * 2, (IV_LENGTH + AUTH_TAG_LENGTH) * 2), 'hex');
  const cipherText = encrypted.slice((IV_LENGTH + AUTH_TAG_LENGTH) * 2);
  
  const decipher = crypto.createDecipheriv(ALGORITHM, KEY, iv);
  decipher.setAuthTag(authTag);
  
  let decrypted = decipher.update(cipherText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}

// Usage
const encryptedToken = encrypt(accessToken);
// Save to DB: encryptedToken
```

#### 🔴 Critical Issue 3: KFTC userSeqNo 보안
**문제**: KFTC의 userSeqNo는 개인 식별 정보, 로그/에러에 노출 위험

**해결책**: 
1. userSeqNo 암호화 저장
2. 로깅 시 마스킹 처리
```typescript
// services/api/src/utils/logger.ts
import pino from 'pino';

const sensitiveKeys = ['accessToken', 'refreshToken', 'password', 'userSeqNo', 'accountNumber'];

export const logger = pino({
  serializers: {
    req: (req) => ({
      method: req.method,
      url: req.url,
      // body에서 민감 정보 제거
      body: maskSensitiveData(req.body),
    }),
  },
});

function maskSensitiveData(obj: any): any {
  if (!obj || typeof obj !== 'object') return obj;
  
  const masked = { ...obj };
  for (const key of sensitiveKeys) {
    if (masked[key]) {
      masked[key] = '***REDACTED***';
    }
  }
  return masked;
}
```

#### 🟡 Medium Issue 3: CORS 설정 미흡
**문제**: CORS origin 환경 변수만 명시, 구체적 설정 부족

**해결책**:
```typescript
// services/api/src/app.ts
import cors from '@fastify/cors';

fastify.register(cors, {
  origin: (origin, cb) => {
    const allowedOrigins = [
      process.env.FRONTEND_URL!, // https://qetta.vercel.app
      'http://localhost:3000',   // Local development
    ];
    
    if (!origin || allowedOrigins.includes(origin)) {
      cb(null, true);
    } else {
      cb(new Error('Not allowed by CORS'), false);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400, // 24 hours
});
```

#### 🟡 Medium Issue 4: XSS 방지 누락
**문제**: Fastify Helmet 언급만, 구체적 CSP 설정 없음

**해결책**:
```typescript
import helmet from '@fastify/helmet';

fastify.register(helmet, {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'https:'],
      connectSrc: ["'self'", process.env.FRONTEND_URL!],
      fontSrc: ["'self'", 'https:', 'data:'],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: false, // For development
});
```

---

## 🔍 Agent 3: API Design Reviewer (API 설계 검증)

### ✅ 검증 통과 항목

1. **RESTful 규칙 준수**
   - ✅ `/api/v1` 버전 관리
   - ✅ HTTP 메소드 적절 사용 (GET, POST, PATCH, DELETE)
   - ✅ 리소스 네이밍 일관성

2. **OAuth 플로우**
   - ✅ Authorization Code Flow 정확
   - ✅ Callback 처리 명확

### ⚠️ 발견된 문제점

#### 🔴 Critical Issue 4: Pagination 누락
**문제**: `GET /api/v1/transactions?accountId=` 페이지네이션 없음

**영향**: 
- 거래 내역이 수천 건일 경우 성능 저하
- 메모리 초과 가능성

**해결책**:
```typescript
// GET /api/v1/transactions?accountId={id}&page=1&limit=50&startDate=2024-01-01&endDate=2024-12-31

interface TransactionsQuery {
  accountId: string;
  page?: number;      // default: 1
  limit?: number;     // default: 50, max: 100
  startDate?: string; // ISO 8601
  endDate?: string;   // ISO 8601
}

interface TransactionsResponse {
  data: Transaction[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
```

#### 🟡 Medium Issue 5: Error Response 표준화 부족
**문제**: 에러 코드만 언급, 구체적 응답 형식 미정의

**해결책**:
```typescript
// packages/shared/src/types/api.ts
export interface ApiError {
  error: {
    code: string;           // 'AUTH_TOKEN_EXPIRED'
    message: string;        // '토큰이 만료되었습니다'
    details?: any;          // Additional context
    timestamp: string;      // ISO 8601
    path: string;           // '/api/v1/oauth/toss/callback'
    requestId: string;      // Unique request ID for tracking
  };
}

// Example
{
  "error": {
    "code": "OAUTH_INVALID_CODE",
    "message": "Invalid authorization code",
    "details": {
      "provider": "toss"
    },
    "timestamp": "2025-10-28T10:30:00.000Z",
    "path": "/api/v1/oauth/toss/callback",
    "requestId": "req_abc123"
  }
}
```

#### 🟡 Medium Issue 6: Idempotency Key 누락
**문제**: `POST /api/v1/applications` 중복 생성 방지 없음

**해결책**:
```typescript
// Header: Idempotency-Key: <uuid>
// 동일한 key로 재요청 시 기존 결과 반환

import { FastifyRequest } from 'fastify';

interface IdempotencyCache {
  [key: string]: {
    response: any;
    createdAt: Date;
  };
}

const idempotencyCache: IdempotencyCache = {};

async function handleIdempotentRequest(request: FastifyRequest, handler: () => Promise<any>) {
  const idempotencyKey = request.headers['idempotency-key'] as string;
  
  if (!idempotencyKey) {
    return handler();
  }
  
  // Check cache
  if (idempotencyCache[idempotencyKey]) {
    const cached = idempotencyCache[idempotencyKey];
    
    // Cache for 24 hours
    if (Date.now() - cached.createdAt.getTime() < 86400000) {
      return cached.response;
    }
  }
  
  // Execute and cache
  const response = await handler();
  idempotencyCache[idempotencyKey] = {
    response,
    createdAt: new Date(),
  };
  
  return response;
}
```

---

## 🔍 Agent 4: Performance Engineer (성능 검증)

### ✅ 검증 통과 항목

1. **캐싱 전략**
   - ✅ React Query cache 5분 staleTime
   - ✅ Redis 사용

2. **번들 최적화**
   - ✅ Next.js Image 최적화
   - ✅ Dynamic imports 언급

### ⚠️ 발견된 문제점

#### 🔴 Critical Issue 5: N+1 Query Problem
**문제**: `GET /api/v1/accounts` 시 각 계좌별 최근 거래 조회 N+1 발생 가능

**해결책**: Prisma include 사용
```typescript
// services/api/src/services/accounts/AccountService.ts
async getAccounts(userId: string): Promise<Account[]> {
  return prisma.account.findMany({
    where: { userId, isActive: true },
    include: {
      transactions: {
        take: 5,
        orderBy: { transactionDate: 'desc' },
      },
    },
  });
}
```

#### 🟡 Medium Issue 7: Database Index 누락
**문제**: Prisma schema에 일부 index만 명시

**해결책**: 추가 인덱스 정의
```prisma
model Transaction {
  // ...
  
  @@index([accountId, transactionDate(sort: Desc)])  // 거래 내역 조회 최적화
  @@index([category])                                // 카테고리별 필터링
  @@index([transactionDate])                         // 날짜 범위 검색
}

model DebtAnalysis {
  // ...
  
  @@index([userId, analyzedAt(sort: Desc)])  // 사용자별 최근 분석 조회
}

model Application {
  // ...
  
  @@index([userId, status, createdAt(sort: Desc)])  // 복합 인덱스
}
```

#### 🟡 Medium Issue 8: Redis Caching 전략 미정의
**문제**: Redis 사용만 언급, 구체적 캐싱 대상 없음

**해결책**:
```typescript
// services/api/src/utils/cache.ts
import { Redis } from 'ioredis';

const redis = new Redis(process.env.REDIS_URL!);

export async function cacheGet<T>(key: string): Promise<T | null> {
  const cached = await redis.get(key);
  return cached ? JSON.parse(cached) : null;
}

export async function cacheSet(key: string, value: any, ttl: number = 300): Promise<void> {
  await redis.setex(key, ttl, JSON.stringify(value));
}

// 캐싱 대상
// 1. OAuth tokens (TTL: token expires_in - 60s)
// 2. User profile (TTL: 5 minutes)
// 3. Account list (TTL: 1 minute)
// 4. Policy constants (TTL: 1 hour)

// Example
async function getUserAccounts(userId: string): Promise<Account[]> {
  const cacheKey = `user:${userId}:accounts`;
  
  // Try cache first
  const cached = await cacheGet<Account[]>(cacheKey);
  if (cached) return cached;
  
  // Fetch from DB
  const accounts = await prisma.account.findMany({ where: { userId } });
  
  // Cache for 1 minute
  await cacheSet(cacheKey, accounts, 60);
  
  return accounts;
}
```

---

## 🔍 Agent 5: Frontend Architect (프론트엔드 검증)

### ✅ 검증 통과 항목

1. **컴포넌트 설계**
   - ✅ Protocol Template 재사용 전략 우수
   - ✅ Atomic design 계층 명확
   - ✅ Headless UI 접근성 확보

2. **상태 관리**
   - ✅ Zustand (auth) + React Query (server state) 분리 적절

### ⚠️ 발견된 문제점

#### 🟡 Medium Issue 9: React Query Key 관리 부재
**문제**: Query key 표준화 없음

**해결책**:
```typescript
// services/web/src/lib/queryKeys.ts
export const queryKeys = {
  auth: {
    me: () => ['auth', 'me'] as const,
  },
  accounts: {
    all: () => ['accounts'] as const,
    list: () => ['accounts', 'list'] as const,
    detail: (id: string) => ['accounts', 'detail', id] as const,
  },
  transactions: {
    list: (accountId: string, filters: any) => 
      ['transactions', 'list', accountId, filters] as const,
  },
  debt: {
    analyses: () => ['debt', 'analyses'] as const,
    latest: () => ['debt', 'analyses', 'latest'] as const,
  },
} as const;

// Usage
const { data: accounts } = useQuery({
  queryKey: queryKeys.accounts.list(),
  queryFn: () => api.get('/accounts'),
});
```

#### 🟡 Medium Issue 10: Error Boundary 누락
**문제**: 에러 처리 전략 미흡

**해결책**:
```typescript
// services/web/src/components/ErrorBoundary.tsx
'use client';

import { Component, ReactNode } from 'react';
import * as Sentry from '@sentry/nextjs';
import { Button } from '@/components/ui/Button';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    Sentry.captureException(error, { extra: errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-zinc-900 dark:text-white mb-4">
              문제가 발생했습니다
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400 mb-8">
              잠시 후 다시 시도해주세요
            </p>
            <Button
              variant="filled"
              onClick={() => window.location.reload()}
            >
              페이지 새로고침
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// app/layout.tsx
export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <ErrorBoundary>
          <Providers>{children}</Providers>
        </ErrorBoundary>
      </body>
    </html>
  );
}
```

#### 🟡 Medium Issue 11: Loading States 표준화 부재
**문제**: 로딩 UI 컴포넌트 미정의

**해결책**:
```typescript
// services/web/src/components/ui/Skeleton.tsx
export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={clsx(
        'animate-pulse rounded-lg bg-zinc-200 dark:bg-zinc-800',
        className
      )}
      {...props}
    />
  );
}

// services/web/src/components/ui/LoadingSpinner.tsx
export function LoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'size-4',
    md: 'size-8',
    lg: 'size-12',
  };
  
  return (
    <div
      className={clsx(
        'animate-spin rounded-full border-2 border-zinc-300 border-t-emerald-500',
        sizeClasses[size]
      )}
    />
  );
}

// Usage in pages
// app/(app)/dashboard/loading.tsx
export default function Loading() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-32 w-full" />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-24" />
        ))}
      </div>
    </div>
  );
}
```

---

## 🔍 Agent 6: DevOps Engineer (배포 검증)

### ✅ 검증 통과 항목

1. **배포 플랫폼**
   - ✅ Vercel (Frontend) + Railway (Backend) 조합 안정적
   - ✅ Supabase/Railway PostgreSQL 선택지 적절

### ⚠️ 발견된 문제점

#### 🔴 Critical Issue 6: Environment Variables 관리 미흡
**문제**: `.env.example` 작성만 언급, 구체적 변수 목록 없음

**해결책**:
```bash
# services/api/.env.example
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/qetta
DIRECT_URL=postgresql://user:password@localhost:5432/qetta # Prisma migrations

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your-secret-key-min-32-chars
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_SECRET=your-refresh-secret-key
REFRESH_TOKEN_EXPIRES_IN=7d

# Encryption
ENCRYPTION_KEY=64-char-hex-string # 32 bytes

# OAuth - Toss
TOSS_CLIENT_ID=your-toss-client-id
TOSS_CLIENT_SECRET=your-toss-client-secret
TOSS_REDIRECT_URI=https://api.qetta.com/api/v1/oauth/toss/callback

# OAuth - KFTC OpenBanking
KFTC_CLIENT_ID=your-kftc-client-id
KFTC_CLIENT_SECRET=your-kftc-client-secret
KFTC_REDIRECT_URI=https://api.qetta.com/api/v1/oauth/kftc/callback
KFTC_API_URL=https://testapi.openbanking.or.kr

# AWS S3
AWS_REGION=ap-northeast-2
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
S3_BUCKET=qetta-documents

# OCR - Clova
CLOVA_OCR_API_URL=https://...
CLOVA_OCR_SECRET_KEY=your-clova-secret

# Monitoring
SENTRY_DSN=https://...@sentry.io/...
DATADOG_API_KEY=your-datadog-key

# App
NODE_ENV=production
PORT=3001
FRONTEND_URL=https://qetta.vercel.app
```

```bash
# services/web/.env.example
NEXT_PUBLIC_API_URL=https://api.qetta.com
NEXT_PUBLIC_TOSS_AUTH_URL=https://qetta.vercel.app/oauth/toss
NEXT_PUBLIC_KFTC_AUTH_URL=https://qetta.vercel.app/oauth/kftc

# Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Monitoring
NEXT_PUBLIC_SENTRY_DSN=https://...@sentry.io/...
```

#### 🟡 Medium Issue 12: Health Check Endpoint 누락
**문제**: 모니터링용 health check 미정의

**해결책**:
```typescript
// services/api/src/routes/health.routes.ts
import { FastifyInstance } from 'fastify';
import { prisma } from '@/config/database';
import { Redis } from 'ioredis';

export default async function healthRoutes(fastify: FastifyInstance) {
  // Basic health check
  fastify.get('/health', async (request, reply) => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  });
  
  // Detailed health check (for monitoring)
  fastify.get('/health/detailed', async (request, reply) => {
    const checks = await Promise.allSettled([
      // Database
      prisma.$queryRaw`SELECT 1`,
      
      // Redis
      new Promise((resolve, reject) => {
        const redis = new Redis(process.env.REDIS_URL!);
        redis.ping((err, result) => {
          redis.disconnect();
          if (err) reject(err);
          else resolve(result);
        });
      }),
    ]);
    
    return {
      status: checks.every(c => c.status === 'fulfilled') ? 'healthy' : 'degraded',
      checks: {
        database: checks[0].status === 'fulfilled' ? 'ok' : 'error',
        redis: checks[1].status === 'fulfilled' ? 'ok' : 'error',
      },
      timestamp: new Date().toISOString(),
    };
  });
}
```

#### 🟡 Medium Issue 13: CI/CD Pipeline 구체화 부족
**문제**: "GitHub Actions" 언급만, 워크플로우 미정의

**해결책**:
```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
      
      redis:
        image: redis:7
        options: >-
          --health-cmd "redis-cli ping"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run linter
        run: npm run lint
      
      - name: Run type check
        run: npm run type-check
      
      - name: Run unit tests
        run: npm run test
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test
          REDIS_URL: redis://localhost:6379
      
      - name: Run E2E tests
        run: npm run test:e2e
      
      - name: Build
        run: npm run build

  deploy:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Deploy to Vercel (Frontend)
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
      
      - name: Deploy to Railway (Backend)
        uses: bervProject/railway-deploy@main
        with:
          railway_token: ${{ secrets.RAILWAY_TOKEN }}
          service: api
```

---

## 🔍 Agent 7: Testing Strategist (테스트 검증)

### ✅ 검증 통과 항목

1. **테스트 프레임워크**
   - ✅ Vitest (Unit) + Playwright (E2E) 조합 적절
   - ✅ Unit test coverage 목표 명확 (90%+)

### ⚠️ 발견된 문제점

#### 🟡 Medium Issue 14: Integration Tests 누락
**문제**: Unit + E2E만 있고, Integration tests 없음

**영향**:
- API layer 테스트 부족
- Service 간 통합 테스트 누락

**해결책**:
```typescript
// services/api/tests/integration/auth.test.ts
import { test, expect, beforeAll, afterAll } from 'vitest';
import { build } from '@/app';
import { FastifyInstance } from 'fastify';

let app: FastifyInstance;

beforeAll(async () => {
  app = await build({ logger: false });
  await app.ready();
});

afterAll(async () => {
  await app.close();
});

test('POST /api/v1/auth/register - success', async () => {
  const response = await app.inject({
    method: 'POST',
    url: '/api/v1/auth/register',
    payload: {
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User',
    },
  });
  
  expect(response.statusCode).toBe(201);
  expect(response.json()).toMatchObject({
    user: {
      email: 'test@example.com',
      name: 'Test User',
    },
    accessToken: expect.any(String),
  });
});

test('POST /api/v1/auth/login - invalid credentials', async () => {
  const response = await app.inject({
    method: 'POST',
    url: '/api/v1/auth/login',
    payload: {
      email: 'test@example.com',
      password: 'wrong-password',
    },
  });
  
  expect(response.statusCode).toBe(401);
  expect(response.json()).toMatchObject({
    error: {
      code: 'AUTH_INVALID_CREDENTIALS',
    },
  });
});
```

#### 🟡 Medium Issue 15: Test Database Seeding 미정의
**문제**: 테스트용 seed 데이터 전략 없음

**해결책**:
```typescript
// services/api/prisma/seed.test.ts
import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

export async function seedTestData() {
  // Clean existing data
  await prisma.application.deleteMany();
  await prisma.policyMatch.deleteMany();
  await prisma.debtAnalysis.deleteMany();
  await prisma.documentVerification.deleteMany();
  await prisma.document.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.account.deleteMany();
  await prisma.oAuthConnection.deleteMany();
  await prisma.user.deleteMany();
  
  // Create test user
  const user = await prisma.user.create({
    data: {
      email: 'test@example.com',
      passwordHash: await hash('password123', 10),
      name: 'Test User',
    },
  });
  
  // Create test account
  const account = await prisma.account.create({
    data: {
      userId: user.id,
      provider: 'kftc',
      bankCode: '004',
      bankName: '국민은행',
      accountNumber: '****1234',
      fintechUseNum: 'test_fintech_num',
      accountType: 'checking',
      balance: 1000000,
    },
  });
  
  // Create test transactions
  await prisma.transaction.createMany({
    data: [
      {
        accountId: account.id,
        transactionDate: new Date('2024-10-01'),
        description: '급여',
        amount: 3000000,
        balance: 1000000,
        type: 'credit',
        category: 'salary',
      },
      // ... more transactions
    ],
  });
  
  return { user, account };
}

// Usage in tests
beforeAll(async () => {
  const { user } = await seedTestData();
  testUserId = user.id;
});
```

---

## 📊 검증 결과 요약

### Critical Issues (반드시 수정)
| # | Issue | Priority | Status |
|---|-------|----------|--------|
| 1 | Prisma Schema 누락 | 🔴 Critical | ⏳ To Fix |
| 2 | OAuth Token 암호화 누락 | 🔴 Critical | ⏳ To Fix |
| 3 | KFTC userSeqNo 보안 취약 | 🔴 Critical | ⏳ To Fix |
| 4 | Pagination 누락 | 🔴 Critical | ⏳ To Fix |
| 5 | N+1 Query Problem | 🔴 Critical | ⏳ To Fix |
| 6 | Environment Variables 목록 미정의 | 🔴 Critical | ⏳ To Fix |

### Medium Issues (권장 수정)
| # | Issue | Priority | Status |
|---|-------|----------|--------|
| 1 | Worker Queue 초기화 로직 | 🟡 Medium | ⏳ To Fix |
| 2 | Next.js API Routes 불필요 | 🟡 Medium | ⏳ To Fix |
| 3 | CORS 설정 미흡 | 🟡 Medium | ⏳ To Fix |
| 4 | XSS 방지 CSP 누락 | 🟡 Medium | ⏳ To Fix |
| 5 | Error Response 표준화 | 🟡 Medium | ⏳ To Fix |
| 6 | Idempotency Key 누락 | 🟡 Medium | ⏳ To Fix |
| 7 | Database Index 부족 | 🟡 Medium | ⏳ To Fix |
| 8 | Redis Caching 전략 미정의 | 🟡 Medium | ⏳ To Fix |
| 9 | React Query Key 관리 부재 | 🟡 Medium | ⏳ To Fix |
| 10 | Error Boundary 누락 | 🟡 Medium | ⏳ To Fix |
| 11 | Loading States 표준화 | 🟡 Medium | ⏳ To Fix |
| 12 | Health Check Endpoint | 🟡 Medium | ⏳ To Fix |
| 13 | CI/CD Pipeline 구체화 | 🟡 Medium | ⏳ To Fix |
| 14 | Integration Tests 누락 | 🟡 Medium | ⏳ To Fix |
| 15 | Test Database Seeding | 🟡 Medium | ⏳ To Fix |

### 통계
- **Total Issues**: 21개
- **Critical (🔴)**: 6개 (28.6%)
- **Medium (🟡)**: 15개 (71.4%)
- **Low (🟢)**: 0개

---

## ✅ 검증 통과 항목

### Architecture ✅
- Turborepo monorepo 구조 우수
- packages/ 분리 (shared, verifier, debt-analyzer) 재사용성 높음
- BullMQ workers 비동기 처리 설계 적절

### Technology Stack ✅
- Fastify + Prisma + PostgreSQL (Backend) 안정적
- Next.js 15 + React 19 + Tailwind 4.1.11 (Frontend) 최신 버전
- Headless UI + Framer Motion 접근성 + UX 우수

### Design System ✅
- Protocol Template 재사용 전략 효율적
- 100% Tailwind CSS 정책 일관성 확보
- 컴포넌트 atomic design 계층 명확

### Security ✅
- JWT + Refresh Token 인증 설계 적절
- OAuth Authorization Code Flow 정확
- Rate limiting 100 req/min 적절

### Performance ✅
- React Query cache 5분 staleTime 적절
- Next.js Image 최적화 언급
- Dynamic imports 전략 우수

---

## 🎯 최종 권장사항

### 1. Day 1-2 수정사항 추가
- ✅ Prisma schema 완전 정의
- ✅ Environment variables 전체 목록 작성
- ✅ BullMQ queue 초기화 로직
- ✅ Health check endpoints
- ✅ Error handling 표준화

### 2. Day 3-6 보안 강화
- ✅ OAuth token 암호화 저장
- ✅ Sensitive data 로깅 마스킹
- ✅ CORS 구체적 설정
- ✅ CSP headers 추가

### 3. Day 7-11 성능 최적화
- ✅ Database index 추가
- ✅ Prisma include로 N+1 방지
- ✅ Redis caching 전략 구현
- ✅ Pagination 모든 list APIs

### 4. Day 12-13 프론트엔드 개선
- ✅ Error Boundary 추가
- ✅ Loading Skeleton 컴포넌트
- ✅ React Query key 관리
- ✅ Idempotency key 지원

### 5. Day 14 테스트 강화
- ✅ Integration tests 추가
- ✅ Test database seeding
- ✅ CI/CD pipeline 완성
- ✅ E2E test coverage 확대

---

## 📝 다음 단계

### Immediate (지금 즉시)
1. ✅ Prisma schema 완전 정의 작성
2. ✅ Environment variables 전체 목록 작성
3. ✅ 보안 관련 critical issues 해결

### Before Day 1 (개발 시작 전)
1. ✅ 수정된 구현 계획 최종 확인
2. ✅ 모든 critical issues 해결 완료
3. ✅ Medium issues 우선순위 결정

### During Development (개발 중)
1. ✅ 각 day별 체크포인트 엄격히 준수
2. ✅ 코드 리뷰 시 검증 항목 확인
3. ✅ 지속적 통합 테스트 실행

---

**검증 완료일**: 2025-10-28  
**다음 작업**: 수정된 최종 구현 계획 생성  
**예상 소요 시간**: Critical issues 수정 2-3시간
