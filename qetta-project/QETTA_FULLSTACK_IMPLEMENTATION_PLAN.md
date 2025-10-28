# QETTA 풀스택 웹앱 완전 구현 계획서

**생성일**: 2025-10-28  
**목표**: 2주 내 프로덕션 레디 (App Store & Play Store 배포 가능)  
**기간**: Day 1 ~ Day 14  
**CSS 정책**: 100% Tailwind CSS 4.1.11 + Protocol Template - **커스텀 CSS 절대 금지**

---

## 🎯 프로젝트 정체성 (5대 핵심 기능)

QETTA는 다음 5가지 기능을 **반드시** 구현해야 합니다:

1. **OAuth 기반 자동 금융 데이터 수집** (Toss + KFTC OpenBanking)
2. **거래 내역 vs. 서류 교차 검증** (사기 탐지)
3. **DTI 및 신용 등급 자동 계산**
4. **정책 매칭** (신복위/새출발기금/개인회생)
5. **자동 신청서 생성 및 전자 제출**

---

## 📐 아키텍처 개요

### 기술 스택 (강제 사항)

#### Backend
- **Framework**: Fastify 5.0+
- **Language**: TypeScript 5.3+
- **ORM**: Prisma 5.0+
- **Database**: PostgreSQL 16+
- **Queue**: BullMQ + Redis
- **Storage**: AWS S3 (문서 저장)
- **Monitoring**: Sentry + DataDog + Prometheus + Grafana

#### Frontend
- **Framework**: Next.js 15+ (App Router)
- **UI Library**: React 19+
- **Language**: TypeScript 5.8+
- **Styling**: Tailwind CSS 4.1.11 + Protocol Template CSS (100%)
- **Components**: Headless UI 2.2.6 + Framer Motion 12.23.11
- **State**: Zustand 5.0.6
- **Forms**: React Hook Form + Zod
- **HTTP**: React Query (TanStack Query)

#### 인프라
- **Monorepo**: Turborepo
- **Testing**: Vitest (Unit) + Playwright (E2E)
- **CI/CD**: GitHub Actions
- **Deployment**: Vercel (Frontend) + Railway/Fly.io (Backend)

---

## 🎨 디자인 시스템 분석 결과

### Protocol Template 구조 이해

**위치**: `/home/user/webapp/qetta-project/tailwind-plus-protocol/protocol-ts/`

#### 핵심 컴포넌트 (재사용 가능)
```
src/components/
├── Button.tsx              ← 5가지 variant (primary, secondary, filled, outline, text)
├── Header.tsx              ← Fixed header with scroll opacity transition
├── Layout.tsx              ← App layout with sidebar (lg:ml-72 xl:ml-80)
├── Navigation.tsx          ← Sidebar navigation with sections
├── Search.tsx              ← Full-text search with Algolia
├── Footer.tsx              ← Footer with links
├── Prose.tsx               ← MDX content wrapper
├── Code.tsx                ← Syntax-highlighted code blocks
├── Tag.tsx                 ← Badge/pill component
├── ThemeToggle.tsx         ← Dark mode toggle
├── GridPattern.tsx         ← Decorative grid background
├── HeroPattern.tsx         ← Hero section pattern
└── icons/                  ← 25+ icons (Bell, Cart, User, Document, etc.)
```

#### 스타일 구조
```css
/* src/styles/tailwind.css */
@import 'tailwindcss';
@plugin '@tailwindcss/typography';

@theme {
  /* Custom typography scale */
  --text-2xs: 0.75rem;  --text-2xs--line-height: 1.25rem;
  --text-xs:  0.8125rem; --text-xs--line-height: 1.5rem;
  /* ... up to 9xl */
  
  /* Custom shadows */
  --shadow-glow: 0 0 4px rgb(0 0 0 / 0.1);
  
  /* Custom container sizes */
  --container-lg: 33rem;
  --container-2xl: 40rem;
  --container-3xl: 50rem;
  --container-5xl: 66rem;
}

/* Dark mode: custom variant */
@custom-variant dark (&:where(.dark, .dark *));
```

#### Layout Pattern
- **Sidebar**: Fixed left sidebar (w-72 on lg, w-80 on xl)
- **Header**: Fixed top with backdrop blur + dynamic opacity on scroll
- **Content**: Main content area with responsive padding
- **Mobile**: Hamburger menu with slide-in navigation

---

## 🗂️ 디렉토리 구조 (강제 - 변경 금지)

```
qetta/
├── packages/
│   ├── shared/                          ← 공통 유틸리티 & 타입
│   │   ├── src/
│   │   │   ├── types/
│   │   │   │   ├── index.ts
│   │   │   │   ├── auth.ts              ← User, Session, Token 타입
│   │   │   │   ├── account.ts           ← Account, Transaction 타입
│   │   │   │   ├── debt.ts              ← Debt, Analysis, Policy 타입
│   │   │   │   └── application.ts       ← Application 타입
│   │   │   ├── utils/
│   │   │   │   ├── validation.ts        ← Zod schemas
│   │   │   │   ├── formatting.ts        ← 날짜, 금액 포맷팅
│   │   │   │   └── encryption.ts        ← AES-256 암호화
│   │   │   └── constants/
│   │   │       ├── policies.ts          ← 정책 상수 (신복위, 새출발, 개인회생)
│   │   │       └── banks.ts             ← 은행 코드
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── verifier/                        ← 거래 vs. 서류 교차 검증 패키지
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   ├── TransactionVerifier.ts   ← 거래 내역 검증
│   │   │   ├── DocumentParser.ts        ← OCR 결과 파싱
│   │   │   ├── CrossVerifier.ts         ← 교차 검증 엔진
│   │   │   └── FraudDetector.ts         ← 사기 탐지 알고리즘
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── debt-analyzer/                   ← 채무 분석 패키지
│       ├── src/
│       │   ├── index.ts
│       │   ├── DebtAnalyzer.ts          ← 메인 분석 엔진
│       │   ├── DTICalculator.ts         ← DTI/DSR 계산
│       │   ├── CreditScorer.ts          ← 신용 등급 추정
│       │   ├── PolicyMatcher.ts         ← 정책 매칭 로직
│       │   └── DebtSimulator.ts         ← 시뮬레이션
│       ├── package.json
│       └── tsconfig.json
│
├── services/
│   ├── api/                             ← Backend API (Fastify)
│   │   ├── src/
│   │   │   ├── index.ts                 ← Fastify 서버 엔트리
│   │   │   ├── app.ts                   ← Fastify app factory
│   │   │   ├── config/
│   │   │   │   ├── env.ts               ← 환경 변수 로드 (dotenv)
│   │   │   │   └── database.ts          ← Prisma client 초기화
│   │   │   ├── routes/
│   │   │   │   ├── index.ts             ← 라우트 등록
│   │   │   │   ├── auth.routes.ts       ← POST /api/v1/auth/*
│   │   │   │   ├── oauth.routes.ts      ← GET /api/v1/oauth/toss, /kftc
│   │   │   │   ├── accounts.routes.ts   ← GET/POST /api/v1/accounts/*
│   │   │   │   ├── transactions.routes.ts ← GET /api/v1/transactions
│   │   │   │   ├── documents.routes.ts  ← POST /api/v1/documents/upload
│   │   │   │   ├── debt.routes.ts       ← POST /api/v1/debt/analyze
│   │   │   │   ├── applications.routes.ts ← POST /api/v1/applications
│   │   │   │   └── users.routes.ts      ← GET/PATCH /api/v1/users/me
│   │   │   ├── services/
│   │   │   │   ├── auth/
│   │   │   │   │   ├── AuthService.ts   ← JWT 발급, 검증
│   │   │   │   │   ├── TossAuthClient.ts ← Toss OAuth 클라이언트
│   │   │   │   │   └── KFTCClient.ts    ← KFTC OpenBanking 클라이언트
│   │   │   │   ├── accounts/
│   │   │   │   │   ├── AccountService.ts ← 계좌 CRUD
│   │   │   │   │   └── TransactionService.ts ← 거래 내역 CRUD
│   │   │   │   ├── documents/
│   │   │   │   │   ├── DocumentService.ts ← S3 업로드/다운로드
│   │   │   │   │   └── OCRService.ts    ← Clova OCR 통합
│   │   │   │   ├── debt/
│   │   │   │   │   ├── DebtService.ts   ← DebtAnalyzer 래퍼
│   │   │   │   │   └── PolicyService.ts ← PolicyMatcher 래퍼
│   │   │   │   └── applications/
│   │   │   │       ├── ApplicationService.ts ← 신청서 생성
│   │   │   │       └── PDFGenerator.ts  ← PDF 생성 (PDFKit)
│   │   │   ├── workers/
│   │   │   │   ├── account-sync.worker.ts ← BullMQ: 계좌 동기화
│   │   │   │   ├── document-ocr.worker.ts ← BullMQ: OCR 처리
│   │   │   │   └── verification.worker.ts ← BullMQ: 교차 검증
│   │   │   ├── middleware/
│   │   │   │   ├── auth.middleware.ts   ← JWT 검증
│   │   │   │   ├── error.middleware.ts  ← 에러 핸들링
│   │   │   │   └── rate-limit.middleware.ts ← Rate limiting
│   │   │   └── utils/
│   │   │       ├── logger.ts            ← Pino logger
│   │   │       └── sentry.ts            ← Sentry 초기화
│   │   ├── prisma/
│   │   │   ├── schema.prisma            ← Prisma schema
│   │   │   └── migrations/
│   │   ├── .env.example
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── web/                             ← Frontend (Next.js 15)
│       ├── src/
│       │   ├── app/
│       │   │   ├── layout.tsx           ← Root layout (Protocol Layout 기반)
│       │   │   ├── page.tsx             ← 홈 (랜딩)
│       │   │   ├── providers.tsx        ← ThemeProvider, QueryClientProvider
│       │   │   ├── (auth)/              ← 인증 그룹
│       │   │   │   ├── login/page.tsx
│       │   │   │   └── register/page.tsx
│       │   │   ├── (app)/               ← 메인 앱 그룹 (인증 필요)
│       │   │   │   ├── layout.tsx       ← App layout with sidebar
│       │   │   │   ├── dashboard/page.tsx ← 대시보드
│       │   │   │   ├── consent/page.tsx ← 동의서
│       │   │   │   ├── upload/page.tsx  ← 서류 업로드
│       │   │   │   ├── verify/page.tsx  ← 검증 진행
│       │   │   │   ├── result/page.tsx  ← 분석 결과
│       │   │   │   └── settings/page.tsx ← 설정
│       │   │   └── api/                 ← API routes (proxy to backend)
│       │   │       └── auth/[...nextauth]/route.ts
│       │   ├── components/
│       │   │   ├── ui/                  ← Protocol Template 컴포넌트 (복사)
│       │   │   │   ├── Button.tsx
│       │   │   │   ├── Header.tsx
│       │   │   │   ├── Layout.tsx
│       │   │   │   ├── Navigation.tsx
│       │   │   │   ├── ThemeToggle.tsx
│       │   │   │   └── icons/
│       │   │   ├── auth/
│       │   │   │   ├── LoginForm.tsx
│       │   │   │   ├── RegisterForm.tsx
│       │   │   │   └── TossAuthButton.tsx ← OAuth 팝업
│       │   │   ├── consent/
│       │   │   │   ├── ConsentToggle.tsx ← Checkbox with terms
│       │   │   │   └── TermsModal.tsx
│       │   │   ├── upload/
│       │   │   │   ├── FileDropzone.tsx  ← Drag & drop
│       │   │   │   ├── AccountSelector.tsx ← Multi-select accounts
│       │   │   │   └── ProgressBar.tsx
│       │   │   ├── verify/
│       │   │   │   ├── VerificationStatus.tsx ← 실시간 진행 상태
│       │   │   │   └── MatchingResult.tsx
│       │   │   ├── result/
│       │   │   │   ├── DebtSummary.tsx   ← 현재 채무 상황
│       │   │   │   ├── PlanComparison.tsx ← 3개 정책 비교
│       │   │   │   └── RecommendationCard.tsx
│       │   │   └── dashboard/
│       │   │       ├── AccountCard.tsx   ← 계좌 카드
│       │   │       ├── DebtTrend.tsx     ← 채무 추이 차트
│       │   │       └── QuickActions.tsx
│       │   ├── hooks/
│       │   │   ├── useAuth.ts           ← Zustand store
│       │   │   ├── useAccounts.ts       ← React Query
│       │   │   ├── useDebt.ts           ← React Query
│       │   │   └── useOAuth.ts          ← OAuth popup handler
│       │   ├── lib/
│       │   │   ├── api.ts               ← Axios instance
│       │   │   └── queryClient.ts       ← React Query config
│       │   └── styles/
│       │       └── tailwind.css          ← Protocol Template CSS (복사)
│       ├── public/
│       │   └── images/
│       ├── .env.example
│       ├── next.config.mjs
│       ├── package.json
│       ├── postcss.config.js
│       ├── tailwind.config.ts
│       └── tsconfig.json
│
├── turbo.json                           ← Turborepo config
├── package.json                         ← Root package.json
├── .gitignore
└── README.md
```

---

## 📅 2주 구현 일정 (Day 1 ~ Day 14)

### **Week 1: Backend Core + OAuth + Debt Analysis**

#### **Day 1-2: 프로젝트 초기 설정**
- [ ] Turborepo 초기화
- [ ] `packages/shared` 패키지 생성 (types, utils, constants)
- [ ] `services/api` Fastify 서버 설정
- [ ] PostgreSQL + Redis Docker Compose 설정
- [ ] Prisma schema 작성 (User, Account, Transaction, Document, DebtAnalysis, Application)
- [ ] `services/web` Next.js 15 초기화
- [ ] Protocol Template CSS 복사 및 Tailwind 4.1.11 설정
- [ ] Git repository 초기화 및 첫 커밋

**체크포인트**: `npm run dev` 시 backend (localhost:3001) + frontend (localhost:3000) 정상 실행

---

#### **Day 3-4: Phase 1.1 - Toss OAuth 통합**
- [ ] `TossAuthClient` 클래스 구현 (Authorization Code Flow)
  - `getAuthorizationUrl(state: string): string`
  - `exchangeCodeForToken(code: string): Promise<tokens>`
  - `getUserInfo(accessToken: string): Promise<userInfo>`
  - `refreshToken(refreshToken: string): Promise<tokens>`
- [ ] Backend 라우트 구현
  - `GET /api/v1/oauth/toss/authorize` - redirect to Toss
  - `GET /api/v1/oauth/toss/callback` - exchange code, save tokens
- [ ] Frontend 컴포넌트
  - `TossAuthButton.tsx` - OAuth popup handler (500x700)
  - `useOAuth.ts` hook - window.postMessage 통신
- [ ] Database: `oauth_connections` 테이블 (userId, provider, accessToken, refreshToken)

**체크포인트**: Toss 로그인 팝업 → 콜백 처리 → 토큰 저장 → 사용자 정보 표시

---

#### **Day 5-6: Phase 1.2 - KFTC OpenBanking 통합**
- [ ] `KFTCClient` 클래스 구현
  - `getAuthorizationUrl(state: string, scope: 'inquiry'): string`
  - `exchangeCodeForToken(code: string): Promise<tokens>`
  - `getAccountList(accessToken, userSeqNo): Promise<accounts>`
  - `getBalance(accessToken, fintechUseNum, userSeqNo): Promise<balance>`
  - `getTransactionList(...): Promise<transactions>` ← **POST method**
  - `refreshToken(refreshToken: string): Promise<tokens>`
- [ ] Backend 라우트 구현
  - `GET /api/v1/oauth/kftc/authorize`
  - `GET /api/v1/oauth/kftc/callback`
  - `POST /api/v1/accounts/sync` - trigger account sync job
  - `GET /api/v1/accounts` - list synced accounts
  - `GET /api/v1/transactions?accountId=` - list transactions
- [ ] BullMQ Worker: `account-sync.worker.ts`
  - 계좌 목록 조회 → DB 저장
  - 각 계좌별 잔액 조회 → DB 업데이트
  - 각 계좌별 거래 내역 조회 (최근 3개월) → DB 저장
  - Progress tracking: 0% → 33% → 66% → 100%
  - Cron job: 매일 새벽 2시 자동 동기화
- [ ] Frontend 컴포넌트
  - `AccountSelector.tsx` - Grid layout with checkboxes
  - `ProgressBar.tsx` - 실시간 진행 상태 (SSE or polling)

**체크포인트**: KFTC 인증 → 계좌 동기화 → 거래 내역 조회 성공

---

#### **Day 7: Phase 2.1 - Debt Analyzer 패키지**
- [ ] `packages/debt-analyzer` 생성
- [ ] `DebtAnalyzer` 클래스 구현
  ```typescript
  class DebtAnalyzer {
    analyze(input: DebtAnalysisInput): Promise<DebtAnalysisResult>
    private calculateTotalDebt(): number
    private calculateTotalAssets(): number
    private calculateDTI(): number  // Debt-to-Income ratio
    private calculateDSR(): number  // Debt Service Ratio
    private estimateCreditGrade(): string  // 1-10등급
    private assessRiskLevel(): 'low' | 'medium' | 'high'
    private breakdownByType(): DebtBreakdown
    private generateRecommendations(): Recommendation[]
  }
  ```
- [ ] Unit tests (Vitest): 10+ test cases

**체크포인트**: DebtAnalyzer unit tests 100% pass

---

### **Week 2: Frontend + Verification + Application Generation**

#### **Day 8-9: Phase 2.2 - Policy Matcher + Frontend Result 페이지**
- [ ] `PolicyMatcher` 클래스 구현
  ```typescript
  class PolicyMatcher {
    match(debt: DebtAnalysisResult): PolicyMatch[]
    private matchSinbokwi(): PolicyMatch | null  // 신복위
    private matchSaechulbal(): PolicyMatch | null  // 새출발기금
    private matchGaeinHoesaeng(): PolicyMatch | null  // 개인회생
  }
  ```
- [ ] Backend 라우트: `POST /api/v1/debt/analyze`
  - DebtAnalyzer + PolicyMatcher 실행
  - 결과 DB 저장 → 반환
- [ ] Frontend 페이지: `/result`
  - `DebtSummary.tsx` - 현재 채무 총액, DTI, DSR, 신용등급
  - `PlanComparison.tsx` - 3개 정책 side-by-side 비교
    - Card grid layout (md:grid-cols-3)
    - 각 카드: 정책명, 감면액, 상환기간, 월 상환액, 자격 여부
    - Protocol Button: "이 플랜 선택하기" (variant="filled")
  - `RecommendationCard.tsx` - AI 추천 사유

**체크포인트**: 분석 결과 페이지 완성 + Protocol CSS 100% 적용

---

#### **Day 10: Phase 1.3 - Verification (거래 vs. 서류 교차 검증)**
- [ ] `packages/verifier` 패키지 생성
- [ ] `DocumentParser` - OCR 결과 파싱 (급여명세서, 재직증명서)
- [ ] `TransactionVerifier` - 거래 내역에서 급여 입금 패턴 추출
- [ ] `CrossVerifier` - 서류와 거래 내역 비교
  ```typescript
  class CrossVerifier {
    verify(transactions: Transaction[], documents: Document[]): VerificationResult
    private extractSalaryFromTransactions(): SalaryInfo[]
    private extractSalaryFromDocuments(): SalaryInfo[]
    private compareAmounts(): boolean  // ±5% 허용
    private compareFrequency(): boolean  // 월급 vs. 연봉
    private detectAnomalies(): Anomaly[]  // 사기 탐지
  }
  ```
- [ ] BullMQ Worker: `verification.worker.ts`
- [ ] Backend 라우트: `POST /api/v1/verification/start`
- [ ] Frontend 페이지: `/verify`
  - `VerificationStatus.tsx` - 실시간 진행 상태 (SSE)
  - `MatchingResult.tsx` - 검증 결과 (일치/불일치/의심)

**체크포인트**: 서류 업로드 → 거래 내역과 교차 검증 → 결과 표시

---

#### **Day 11: Phase 3 - Application Generation (신청서 자동 생성)**
- [ ] `PDFGenerator` 클래스 (PDFKit)
  ```typescript
  class PDFGenerator {
    generateSinbokwiApplication(data: ApplicationData): Promise<Buffer>
    generateSaechulbalApplication(data: ApplicationData): Promise<Buffer>
    generateGaeinHoesaengApplication(data: ApplicationData): Promise<Buffer>
    private renderHeader()
    private renderPersonalInfo()
    private renderDebtInfo()
    private renderDocumentList()
    private renderSignature()
  }
  ```
- [ ] Backend 라우트: `POST /api/v1/applications`
  - 신청서 PDF 생성 → S3 업로드 → DB 저장
  - Response: `{ applicationId, pdfUrl, status: 'draft' }`
- [ ] Backend 라우트: `POST /api/v1/applications/:id/submit`
  - 전자 제출 (이메일 발송 or API 연동)
  - Status: 'draft' → 'submitted'
- [ ] Frontend: 신청서 다운로드 버튼

**체크포인트**: 신청서 PDF 생성 → S3 업로드 → 다운로드 성공

---

#### **Day 12-13: Phase 4 - Frontend 완성**
- [ ] 홈페이지 (`/`) - Hero section + 기능 소개
- [ ] 로그인/회원가입 (`/login`, `/register`)
- [ ] 동의서 페이지 (`/consent`)
  - `ConsentToggle.tsx` - Checkbox with terms
  - `TermsModal.tsx` - Modal with full terms (Headless UI)
- [ ] 서류 업로드 페이지 (`/upload`)
  - `FileDropzone.tsx` - Drag & drop (react-dropzone)
  - Multi-file support (급여명세서 3개월, 재직증명서, etc.)
- [ ] 대시보드 (`/dashboard`)
  - `AccountCard.tsx` - Grid of connected accounts
  - `DebtTrend.tsx` - Chart.js line chart
  - `QuickActions.tsx` - "새 분석 시작", "신청서 조회"
- [ ] 설정 페이지 (`/settings`)
  - 프로필 편집
  - 연동 계좌 관리 (삭제)
  - 구독 관리 (Stripe)
- [ ] Header + Navigation (Protocol Layout)
  - Logo, 메뉴, 검색, 다크모드 토글, 로그인/로그아웃
- [ ] Footer - 회사 정보, 약관, 개인정보처리방침
- [ ] 반응형 디자인 확인 (mobile, tablet, desktop)

**체크포인트**: 모든 페이지 완성 + Protocol CSS 100% 적용 + 반응형 확인

---

#### **Day 14: 테스트 + 배포 준비**
- [ ] E2E 테스트 (Playwright)
  - User flow: 회원가입 → 로그인 → Toss 인증 → KFTC 인증 → 계좌 동기화 → 서류 업로드 → 분석 → 신청서 생성
- [ ] 성능 최적화
  - Next.js Image 최적화
  - React Query cache 설정
  - Lighthouse 점수 90+ 확보
- [ ] 보안 체크
  - JWT 만료 시간 설정 (15분)
  - Refresh token rotation
  - Rate limiting 설정 (100 req/min per IP)
  - CORS 설정
  - Helmet.js (Fastify)
- [ ] 환경 변수 정리
  - `.env.example` 파일 작성
  - Secrets 분리 (Toss, KFTC API keys)
- [ ] 배포
  - Frontend: Vercel 배포
  - Backend: Railway or Fly.io 배포
  - Database: Supabase or Railway PostgreSQL
  - Redis: Upstash Redis
- [ ] 모니터링 설정
  - Sentry error tracking
  - DataDog APM
  - Prometheus + Grafana dashboards

**체크포인트**: Production 배포 완료 + 모니터링 대시보드 확인

---

## 🎨 Protocol Template → QETTA UI 매핑

### 페이지별 CSS 컴포넌트 사용

| QETTA 페이지 | Protocol 컴포넌트 | 커스터마이징 |
|-------------|------------------|------------|
| `/` (홈) | HeroPattern, Button, GridPattern | 텍스트 교체 |
| `/login` | Button (variant="primary"), Input | Form layout |
| `/register` | Button, Input, Checkbox | Multi-step form |
| `/consent` | Checkbox, Button, Modal (Headless UI) | Terms content |
| `/upload` | Button, ProgressBar, FileDropzone | Custom Dropzone (react-dropzone + Protocol styles) |
| `/verify` | ProgressBar, Tag (status badge) | Real-time updates |
| `/result` | Card grid, Button, Tag, Prose | DebtSummary, PlanComparison |
| `/dashboard` | Layout (sidebar), Navigation, AccountCard | Grid layout |
| `/settings` | Layout, Navigation, Button, Input | Form sections |

### Protocol Template 컴포넌트 변형 전략

#### 1. Button 변형
```tsx
// Protocol Button variants 재사용
<Button variant="primary">분석 시작</Button>
<Button variant="secondary">취소</Button>
<Button variant="filled">신청서 제출</Button>
<Button variant="outline">자세히 보기</Button>
<Button variant="text" arrow="right">다음 단계</Button>
```

#### 2. Card 컴포넌트 (신규 생성 - Protocol 스타일 기반)
```tsx
// Protocol의 색상 시스템 사용
export function Card({ children, className, ...props }) {
  return (
    <div 
      className={clsx(
        'rounded-2xl bg-zinc-50 p-6',
        'dark:bg-zinc-800/50',
        'ring-1 ring-zinc-900/10 dark:ring-white/10',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
```

#### 3. Input 컴포넌트 (신규 생성 - Protocol 스타일 기반)
```tsx
export function Input({ className, ...props }) {
  return (
    <input
      className={clsx(
        'block w-full appearance-none rounded-md px-3 py-2',
        'text-zinc-900 dark:text-white',
        'bg-white dark:bg-zinc-900',
        'ring-1 ring-zinc-900/10 dark:ring-white/10',
        'placeholder:text-zinc-400',
        'focus:outline-none focus:ring-2 focus:ring-emerald-500',
        className
      )}
      {...props}
    />
  )
}
```

#### 4. Layout 적용
```tsx
// Protocol Layout 그대로 사용
import { Layout } from '@/components/ui/Layout'

export default function AppLayout({ children }) {
  const navigation = [
    { title: '대시보드', href: '/dashboard' },
    { title: '분석하기', href: '/consent' },
    { title: '신청서', href: '/applications' },
    { title: '설정', href: '/settings' },
  ]
  
  return (
    <Layout allSections={{}} navigation={navigation}>
      {children}
    </Layout>
  )
}
```

---

## 🔒 보안 요구사항

### 1. 인증/인가
- JWT 토큰: Access (15분) + Refresh (7일)
- Refresh token rotation: 한 번 사용 후 폐기
- OAuth state parameter: CSRF 방지
- Session 저장: Redis (key: `session:{userId}`)

### 2. 데이터 암호화
- Database: 민감 데이터 AES-256-GCM 암호화 (급여, 계좌번호)
- Transit: HTTPS only (TLS 1.3)
- Secrets: AWS Secrets Manager or environment variables

### 3. Rate Limiting
```typescript
// Fastify rate limit plugin
fastify.register(import('@fastify/rate-limit'), {
  max: 100,          // 100 requests
  timeWindow: 60000, // per 1 minute
  cache: 10000,      // cache size
  redis: redisClient // use Redis
})
```

### 4. CORS
```typescript
fastify.register(import('@fastify/cors'), {
  origin: process.env.FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
})
```

---

## 🧪 테스트 전략

### Unit Tests (Vitest)
- `packages/shared`: 90% coverage
- `packages/debt-analyzer`: 95% coverage (핵심 로직)
- `packages/verifier`: 95% coverage
- `services/api/services`: 80% coverage

### E2E Tests (Playwright)
```typescript
// tests/e2e/user-flow.spec.ts
test('complete user flow', async ({ page }) => {
  // 1. 회원가입
  await page.goto('/register')
  await page.fill('input[name="email"]', 'test@example.com')
  await page.fill('input[name="password"]', 'password123')
  await page.click('button[type="submit"]')
  
  // 2. 동의서
  await page.goto('/consent')
  await page.check('input[name="privacy"]')
  await page.check('input[name="terms"]')
  await page.click('text=다음')
  
  // 3. Toss 인증 (mock)
  await page.goto('/dashboard')
  await expect(page.locator('text=토스 인증 완료')).toBeVisible()
  
  // 4. KFTC 인증 (mock)
  // 5. 계좌 동기화
  // 6. 서류 업로드
  // 7. 분석 결과 확인
  // 8. 신청서 생성
})
```

---

## 📊 모니터링 지표

### Backend (DataDog APM)
- API 응답 시간 (p50, p95, p99)
- 에러율 (target: < 0.1%)
- BullMQ job 처리 시간
- Database query 성능

### Frontend (Vercel Analytics)
- Core Web Vitals (LCP, FID, CLS)
- Page load time
- Bounce rate
- Conversion rate (회원가입 → 첫 분석 완료)

### Prometheus Metrics
```
# API 요청 수
http_requests_total{method="POST", endpoint="/api/v1/debt/analyze", status="200"}

# 계좌 동기화 성공률
account_sync_success_rate

# 검증 정확도
verification_accuracy_rate
```

---

## 🚀 배포 체크리스트

### Pre-deployment
- [ ] 모든 환경 변수 설정 (.env.production)
- [ ] Database migration 실행 (Prisma migrate deploy)
- [ ] Secrets 등록 (Vercel, Railway)
- [ ] CORS origin 설정
- [ ] Rate limiting 활성화
- [ ] Sentry DSN 설정
- [ ] Stripe webhook endpoint 등록

### Deployment
- [ ] Frontend: `cd services/web && vercel --prod`
- [ ] Backend: `cd services/api && railway up`
- [ ] Database: Prisma migrate 실행
- [ ] Redis: Upstash Redis 연결 확인

### Post-deployment
- [ ] Health check: `GET /health` → 200 OK
- [ ] Smoke test: 주요 API 엔드포인트 테스트
- [ ] Monitoring dashboard 확인 (Sentry, DataDog)
- [ ] Rollback plan 준비

---

## 🎯 성공 지표 (2주 후)

### 기술 지표
- ✅ Lighthouse 점수: Performance 90+, Accessibility 100, Best Practices 100, SEO 100
- ✅ API 응답 시간: p95 < 500ms
- ✅ Test coverage: Unit 90%+, E2E 80%+
- ✅ Zero custom CSS (100% Tailwind + Protocol)
- ✅ Mobile responsive (iOS Safari, Android Chrome)

### 비즈니스 지표
- ✅ 5대 핵심 기능 100% 구현
- ✅ End-to-end user flow 완성 (회원가입 → 신청서 생성)
- ✅ App Store / Play Store 제출 가능 상태

---

## 📝 주요 참고 문서

1. **MASTER_PROMPT_V2_FINAL.md** - 필수 구현 가이드 (Phase 1-3 상세 코드)
2. **API_SPECIFICATION.md** - 40+ API 엔드포인트 명세
3. **FRONTEND_COMPONENTS.md** - 50+ 컴포넌트 설계
4. **CATALYST_UI_DESIGN_ANALYSIS.md** - Catalyst UI 디자인 시스템
5. **Protocol Template** - `tailwind-plus-protocol/protocol-ts/`

---

## ⚠️ 중요 제약사항 (반드시 준수)

1. **CSS**: 100% Tailwind CSS + Protocol Template - 커스텀 CSS 절대 금지
2. **디렉토리 구조**: 위 구조 변경 금지
3. **기술 스택**: 명시된 라이브러리 버전 사용 (Next.js 15, React 19, Tailwind 4.1.11)
4. **5대 핵심 기능**: 모두 구현 필수
5. **OAuth 플로우**: Authorization Code Flow (Client Credentials X)
6. **KFTC API**: POST method 사용 (GET X)

---

## 🎉 완료 조건

### 최종 제출물
- [ ] GitHub repository (public or private)
- [ ] Live demo URL (Vercel + Railway)
- [ ] API documentation (Swagger/Redoc)
- [ ] User guide (README.md)
- [ ] Video demo (3분, 5대 핵심 기능 시연)

### 검증 방법
```bash
# 1. 클론 및 설치
git clone <repo-url>
cd qetta
npm install

# 2. 환경 변수 설정
cp .env.example .env
# 환경 변수 입력

# 3. 데이터베이스 마이그레이션
cd services/api
npx prisma migrate dev

# 4. 실행
cd ../..
npm run dev

# 5. 테스트
npm run test        # Unit tests
npm run test:e2e    # E2E tests

# 6. 빌드
npm run build

# 7. Production 실행
npm run start
```

---

**최종 업데이트**: 2025-10-28  
**Next Step**: Day 1 개발 시작 (Turborepo 초기화 + 프로젝트 구조 생성)

---

## 🤝 Git Workflow (GenSpark AI Developer)

### Branch Strategy
- **main**: Production-ready code
- **genspark_ai_developer**: AI development branch (모든 개발은 이 브랜치에서)

### Commit Policy (🔴 엄격 준수)
1. **AFTER EVERY CODE CHANGE**: 즉시 커밋 필수
2. **Conventional Commits**: `type(scope): description`
   - `feat(auth): implement Toss OAuth client`
   - `fix(debt): correct DTI calculation formula`
   - `refactor(ui): migrate to Protocol Button component`
3. **NO EXCEPTIONS**: 코드 수정 후 미커밋 상태 절대 금지

### Pull Request Policy (🔴 엄격 준수)
1. **PRE-PR SYNC**: PR 생성/업데이트 전 반드시 최신 main 브랜치와 동기화
   ```bash
   git fetch origin main
   git rebase origin/main
   # 충돌 시: 원격(main) 코드 우선 적용
   git push -f origin genspark_ai_developer
   ```

2. **SQUASH COMMITS**: PR 전 모든 커밋을 하나로 압축
   ```bash
   # 비대화형 방식 (권장)
   git reset --soft HEAD~N  # N = 커밋 개수
   git commit -m "feat(phase1): implement Toss + KFTC OAuth integration"
   git push -f origin genspark_ai_developer
   ```

3. **PR CREATION**: 매 개발 사이클마다 PR 생성/업데이트 필수
   - Title: 명확한 기능 설명
   - Description: 변경 사항, 테스트 결과, 스크린샷
   - Labels: `enhancement`, `bug`, `documentation` 등

4. **PR LINK SHARING**: PR 생성 후 즉시 URL을 사용자에게 공유

### Conflict Resolution
- **원칙**: 원격(main) 코드 우선 적용
- **예외**: 로컬 변경사항이 핵심 기능인 경우에만 협의 후 적용
- **도구**: `git status` → 충돌 파일 확인 → 수동 해결 → `git add` → `git rebase --continue`

---

**이 계획서는 2주 내 프로덕션 레디 QETTA 앱 개발을 위한 완전한 로드맵입니다.**
