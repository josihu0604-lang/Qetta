# Hephaitos (헤파이스토스 - 채무분석 자동화 플랫폼)

AI 기반 채무분석 자동화 플랫폼. Toss 및 KFTC OpenBanking OAuth 연동으로 금융 데이터를 자동 수집하고, DTI/DSR 분석을 통해 맞춤형 채무조정 방안을 제시합니다.

> **이전 명칭**: QETTA → **현재**: Hephaitos (2025-10-28 리브랜딩)

## 📋 프로젝트 개요

- **목적**: 채무조정 절차 자동화 및 간소화
- **기술 스택**: Next.js 15 + Fastify 5 + PostgreSQL 16 + Redis 7
- **배포 목표**: 2주 내 프로덕션 배포 (App Store + Play Store 준비)
- **디자인 제약**: 100% Tailwind CSS (커스텀 CSS 금지)
- **현재 진행도**: 40% (Phase 1 완료)

## 🏗️ 아키텍처

### Monorepo 구조 (Turborepo)

```
hephaitos/
├── packages/
│   ├── shared/           # 공통 타입, 유틸리티, 상수
│   ├── verifier/         # 문서 검증 엔진
│   └── debt-analyzer/    # 부채 분석 엔진
├── services/
│   ├── api/              # Fastify 백엔드 (포트 3001)
│   ├── web/              # Next.js 15 Web (포트 3000)
│   └── mobile/           # Next.js 15 Mobile (포트 3002)
└── docker-compose.yml    # PostgreSQL + Redis
```

### 기술 스택

| 영역 | 기술 | 버전 |
|------|------|------|
| 프론트엔드 | Next.js | 15.1.5 |
| 프론트엔드 | React | 19.0.0 |
| 프론트엔드 | TypeScript | 5.8.0 |
| 프론트엔드 | Tailwind CSS | 4.1.11 |
| 백엔드 | Fastify | 5.2.1 |
| 백엔드 | TypeScript | 5.3.3 |
| 백엔드 | Prisma | 5.22.0 |
| 데이터베이스 | PostgreSQL | 16 |
| 캐시 | Redis | 7 |
| 큐 | BullMQ | 5.35.3 |
| 상태 관리 | Zustand | 5.0.6 |
| 서버 상태 | React Query | 5.62.7 |
| 폼 | React Hook Form | 7.54.2 |
| 검증 | Zod | 3.24.1 |
| 테스트 | Vitest | 2.1.8 |
| E2E 테스트 | Playwright | 1.49.1 |

## 🚀 빠른 시작

### 1. 사전 요구사항

- Node.js 20+
- pnpm 8+ (필수)
- Docker & Docker Compose

### 2. 프로젝트 설정

```bash
# 1. 저장소 클론
git clone https://github.com/your-org/hephaitos.git
cd hephaitos

# 2. 의존성 설치 (pnpm 사용)
pnpm install

# 3. 환경 변수 설정
cp services/api/.env.example services/api/.env
cp services/web/.env.example services/web/.env
cp services/mobile/.env.local.example services/mobile/.env.local

# 환경 변수 편집 (데이터베이스, OAuth 클라이언트 ID/Secret 등)
nano services/api/.env

# 4. Docker 서비스 시작 (PostgreSQL + Redis)
docker-compose up -d

# 5. Prisma 마이그레이션
cd services/api
pnpm prisma db push
pnpm prisma generate
cd ../..

# 6. 개발 서버 시작 (Turborepo)
pnpm dev
```

개발 서버가 시작되면:
- **Web Frontend**: http://localhost:3000
- **Mobile Frontend**: http://localhost:3002
- **Backend API**: http://localhost:3001/api/v1

### 3. 개별 서비스 실행

```bash
# API 서버만 실행
pnpm --filter @hephaitos/api dev

# Web 서비스만 실행
pnpm --filter @hephaitos/web dev

# Mobile 서비스만 실행
pnpm --filter @hephaitos/mobile dev
```

### 4. 헬스 체크

```bash
# API 서버 상태 확인
curl http://localhost:3001/health

# 데이터베이스 + Redis 확인
curl http://localhost:3001/health/ready

# Prometheus 메트릭
curl http://localhost:3001/metrics
```

## 📦 주요 기능 (5대 핵심 기능)

### 1. OAuth 데이터 수집 (✅ 구현 완료)
- **Toss**: Client Credentials Grant
- **KFTC OpenBanking**: Authorization Code Grant + 계좌 조회 API
- **자동 동기화**: BullMQ worker (6시간마다) - 준비 완료
- **보안**: AES-256-GCM 토큰 암호화

### 2. 거래내역 검증 (⏳ 진행 예정)
- **문서 파싱**: PDF + 이미지 OCR
- **교차 검증**: OAuth 거래 vs. 업로드 문서 비교
- **허용 오차**: 금액 ±5%, 날짜 ±3일
- **사기 탐지**: ML 기반 이상 패턴 감지

### 3. DTI/DSR 계산 (⏳ 진행 예정)
- **DTI (총부채상환비율)**: (총 부채 / 연소득) × 100
- **DSR (부채원리금상환비율)**: (연간 상환액 / 연소득) × 100
- **신용 등급**: EXCELLENT / GOOD / FAIR / POOR
- **임계값**: DTI 40% / 100% / 200%

### 4. 정책 매칭 (⏳ 진행 예정)
- **신용회복위원회**: DTI > 100%, 부채 < 10억
- **새출발기금**: DTI > 150%, 소득 < 300만원, 부채 < 5000만원
- **개인회생**: DTI > 200%, 부채 5000만~20억
- **적합도 점수**: 0-100 (높을수록 적합)

### 5. PDF 생성 (⏳ 진행 예정)
- **3가지 템플릿**: 신복위 / 새출발 / 개인회생 신청서
- **자동 기입**: 개인정보, 금융 정보, 거래내역
- **S3 저장**: AWS S3 업로드 + 다운로드 URL
- **멱등성**: Idempotency-Key 헤더 지원

## 🔐 보안

### 토큰 암호화 (AES-256-GCM)
```typescript
// OAuth 토큰은 DB 저장 전 AES-256-GCM으로 암호화
accessToken: encrypt(tokenData.access_token)
refreshToken: encrypt(tokenData.refresh_token)
userSeqNo: encrypt(kftcData.user_seq_no)
```

### 로깅 보안
민감한 데이터는 자동으로 마스킹됩니다:
- `accessToken` → `***REDACTED***`
- `accountNumber` → `***REDACTED***`
- `userSeqNo` → `***REDACTED***`

### CORS & CSP
```typescript
// CORS: Origin validation
origin: [
  'http://localhost:3000',
  'http://localhost:3002',
  'https://hephaitos.vercel.app'
]

// CSP: XSS prevention
contentSecurityPolicy: {
  defaultSrc: ["'self'"],
  scriptSrc: ["'self'", "'unsafe-inline'"],
}
```

### Rate Limiting
- **제한**: 100 requests/minute per IP
- **저장소**: Redis (분산 환경 지원)

### JWT
- **Access Token**: 15분 (짧은 만료 시간)
- **Refresh Token**: 7일
- **알고리즘**: HS256

## 🧪 테스트

### 단위 테스트 (Vitest)
```bash
# 모든 단위 테스트 실행
pnpm test

# 커버리지 포함
pnpm test -- --coverage

# 특정 패키지만 테스트
pnpm test --filter=@hephaitos/shared
```

**목표 커버리지**: 95%+

### E2E 테스트 (Playwright)
```bash
# E2E 테스트 실행
pnpm test:e2e

# Playwright UI 모드
npx playwright test --ui
```

## 📊 데이터베이스 스키마

### 11개 모델
1. **User** - 사용자 정보
2. **OAuthConnection** - OAuth 연결 정보 (암호화된 토큰)
3. **Account** - 계좌 정보
4. **Transaction** - 거래내역
5. **Document** - 업로드 문서 (S3 키)
6. **DocumentVerification** - 검증 결과
7. **DebtAnalysis** - 부채 분석 결과 (DTI, DSR)
8. **PolicyMatch** - 정책 매칭 결과
9. **Application** - 신청서 (PDF)
10. **Job** - BullMQ 작업 관리
11. **AuditLog** - 감사 로그

### 주요 인덱스
```prisma
@@index([userId, isActive])           // Account 조회
@@index([accountId, transactionDate]) // Transaction 페이지네이션
@@index([userId, analysisDate])       // DebtAnalysis 최신 순
```

## 🌐 API 엔드포인트

### 인증
- `POST /api/v1/auth/register` - 회원가입
- `POST /api/v1/auth/login` - 로그인
- `POST /api/v1/auth/refresh` - 토큰 갱신

### OAuth
- `POST /api/v1/oauth/toss/token` - Toss OAuth 토큰 발급
- `GET /api/v1/oauth/kftc/authorize` - KFTC OAuth 시작
- `GET /api/v1/oauth/kftc/callback` - KFTC 콜백

### 계좌
- `GET /api/v1/accounts` - 계좌 목록
- `POST /api/v1/accounts/sync` - 수동 동기화

### 거래내역
- `GET /api/v1/transactions?accountId=xxx&page=1&limit=50` - 거래내역 (페이지네이션)

### 부채 분석
- `POST /api/v1/debt/analyze` - 분석 실행
- `GET /api/v1/debt/latest` - 최신 분석 결과

### 신청서
- `POST /api/v1/applications` - 신청서 생성 (PDF)
- `POST /api/v1/applications/:id/submit` - 신청서 제출

### 시스템
- `GET /health` - 헬스 체크
- `GET /metrics` - Prometheus 메트릭

## 🎨 디자인 시스템

### UI Kit
- **Catalyst UI Kit**: 30+ 프로페셔널 컴포넌트 (Button, Input, Dialog, Table, Card 등)
- **Pocket Template**: 22개 모바일 최적화 컴포넌트 (Hero, Features, Pricing, FAQ 등)

### Tailwind CSS 100%
- **제약 사항**: 커스텀 CSS 파일 금지
- **허용**: Tailwind utility classes + `globals.css` @theme 변수만 사용

### 색상 팔레트
- **Primary**: Blue (#0064FF - Toss Blue)
- **Secondary**: Green (#00A86B - KFTC Green)
- **Zinc**: 텍스트 및 배경
- **Semantic**: Success (green), Warning (yellow), Error (red)

### 컴포넌트 구조
- **Catalyst 기반 (30+개)**: 데스크톱 및 웹 인터페이스용
- **Pocket 기반 (22개)**: 모바일 랜딩 페이지용
- **Hephaitos 전용 (15개)**: TossAuthButton, KFTCAuthButton, AccountSelector, DebtSummary 등

## 📅 개발 로드맵

### Phase 1: 프로젝트 초기 설정 (✅ 100% 완료)
- ✅ Day 1-2: Turborepo 모노레포 설정
- ✅ Day 3-4: OAuth 통합 (Toss + KFTC)
- ✅ Mobile Integration: Pocket 템플릿 통합
- ✅ 보안 플러그인: Idempotency, Metrics, Security Headers

### Phase 2: Catalyst UI Kit 통합 (⏳ 다음 단계 - 10% 예상)
- □ Catalyst 컴포넌트 복사 및 통합
- □ TypeScript 타입 정의
- □ Tailwind 설정 병합
- □ Hephaitos 테마 커스터마이징

### Phase 3: 핵심 페이지 구현 (⏳ 진행 예정 - 25% 예상)
- □ Dashboard 페이지 (/dashboard)
- □ Accounts 페이지 (/accounts)
- □ Debt Analysis 페이지 (/debt-analysis)
- □ Policy Recommendation 페이지 (/policy)

### Phase 4: 모바일 최적화 (⏳ 진행 예정 - 15% 예상)
- □ 하단 네비게이션 바
- □ 스와이프 제스처
- □ Pull-to-refresh
- □ PWA 설정 (선택 사항)

### Phase 5: 테스트 및 배포 (⏳ 진행 예정 - 10% 예상)
- □ 다양한 화면 크기 테스트
- □ 터치 이벤트 최적화
- □ 로딩 성능 개선
- □ 프로덕션 배포

**현재 진행도**: [████████████░░░░░░░░░░░░░░░░░░░] 40%

## 📈 성능 목표

| 지표 | 목표 | 현재 |
|------|------|------|
| Lighthouse (Performance) | 90+ | - |
| Lighthouse (Accessibility) | 90+ | - |
| Lighthouse (Best Practices) | 90+ | - |
| Lighthouse (SEO) | 90+ | - |
| Unit Test Coverage | 95%+ | - |
| API Response Time (p95) | < 500ms | - |
| Frontend FCP | < 1.5s | - |
| Error Rate | < 0.1% | - |

## 🚢 배포

### 프론트엔드 (Vercel)
```bash
# Vercel CLI 설치
npm i -g vercel

# Web 서비스 배포
cd services/web
vercel --prod

# Mobile 서비스 배포
cd services/mobile
vercel --prod
```

### 백엔드 (Railway/Fly.io)
```bash
# Railway CLI 설치
npm i -g @railway/cli

# 배포
cd services/api
railway up
```

### 환경 변수 설정
프로덕션 환경에서 다음 환경 변수를 설정해야 합니다:
- `DATABASE_URL` (Supabase/Railway PostgreSQL)
- `REDIS_URL` (Upstash Redis)
- `JWT_SECRET` (32+ characters)
- `ENCRYPTION_KEY` (64 hex characters)
- `TOSS_CLIENT_ID` / `TOSS_CLIENT_SECRET`
- `KFTC_CLIENT_ID` / `KFTC_CLIENT_SECRET`
- AWS S3 credentials (선택 사항)
- Sentry DSN (모니터링, 선택 사항)

자세한 배포 가이드: [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

## 📚 참고 문서

### 프로젝트 문서
- [완료 상태 보고서](../HEPHAITOS_COMPLETE_STATUS.md)
- [모바일 통합 완료](../HEPHAITOS_MOBILE_INTEGRATION_완료보고서.md)
- [배포 가이드](./DEPLOYMENT_GUIDE.md)
- [Tailwind CSS 분석](./TAILWIND_CSS_ANALYSIS.md)
- [Phase 3 모바일 페이지 계획](./PHASE_3_MOBILE_PAGES.md)

### 외부 API 문서
- [Toss Developers](https://developers.toss.im/)
- [KFTC OpenBanking](https://www.open-platform.or.kr/)
- [신용회복위원회](https://www.ccrs.or.kr/)
- [새출발기금](https://www.ssgfund.or.kr/)

### 기술 문서
- [Next.js 15 문서](https://nextjs.org/docs)
- [Fastify 문서](https://fastify.dev)
- [Turborepo 문서](https://turbo.build/repo/docs)
- [Prisma 문서](https://www.prisma.io/docs)
- [Tailwind CSS 4 문서](https://tailwindcss.com/docs)

## 🤝 기여

프로젝트 기여는 환영합니다! 다음 절차를 따라주세요:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 라이센스

이 프로젝트는 MIT 라이센스 하에 배포됩니다.

## 📧 연락처

- 프로젝트 관리자: [your-email@example.com]
- 이슈 트래커: [GitHub Issues](https://github.com/your-org/hephaitos/issues)

---

**현재 진행 상태**: Phase 1 완료 (40%) - OAuth 통합 및 모바일 기반 구축 완료  
**다음 단계**: Phase 2 - Catalyst UI Kit 통합 시작  
**최종 커밋**: `904e569`
