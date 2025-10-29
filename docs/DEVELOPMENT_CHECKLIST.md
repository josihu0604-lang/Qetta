# Hephaitos 개발 체크리스트 요약

**목적**: 빠른 진행 상황 확인 및 완료 여부 추적  
**사용법**: 각 Phase 완료 시 체크 표시

---

## 🎯 Phase 0: 개발 환경 설정 (사전 작업)

### 환경 설정
```
□ Node.js 20+ 설치
□ Docker & Docker Compose 설치
□ PostgreSQL 16 실행 (Docker 또는 로컬)
□ Redis 실행
□ 저장소 클론 및 npm install
□ .env 파일 설정 (TOSS, KFTC 키 포함)
□ Prisma 마이그레이션 완료
□ 개발 서버 실행 확인 (API + Web)
□ http://localhost:3000/health → 200 OK
□ http://localhost:3001 → Next.js 페이지 로드
```

### 문서 읽기
```
□ DATABASE_SCHEMA.md 읽음
□ ARCHITECTURE.md 읽음
□ API_SPECIFICATION.md 읽음
□ FRONTEND_COMPONENTS.md 읽음
□ MASTER_PROMPT_V2_FINAL.md 읽음
□ DEVELOPMENT_SETUP.md 참고
□ ERROR_HANDLING_GUIDE.md 참고
```

---

## 🚀 Phase 1: OAuth & 계좌 동기화 (P0 - 최우선)

### 1.1 Toss 인증 (Week 1)
```
Backend:
□ services/api/src/lib/toss.ts 작성
  □ TossAuthClient 클래스 구현
  □ getAuthorizationUrl() 구현
  □ exchangeCodeForToken() 구현
  □ getUserInfo() 구현
  □ refreshToken() 구현
□ services/api/src/routes/oauth.ts 작성
  □ GET /oauth/toss/authorize 구현
  □ GET /oauth/toss/callback 구현
□ ExternalAuth 테이블 저장 (암호화)
□ CSRF state 검증 (Redis)

Frontend:
□ services/web/app/consent/page.tsx 작성
  □ ConsentToggle 컴포넌트
  □ TossAuthButton 컴포넌트
  □ OAuth 팝업 처리

테스트:
□ Toss 인증 E2E 동작
□ 토큰 DB 저장 확인 (암호화)
□ 토큰 자동 갱신 동작
□ CI (Connecting Information) 저장
```

### 1.2 KFTC 오픈뱅킹 (Week 1-2)
```
Backend:
□ services/api/src/lib/kftc.ts 작성
  □ KFTCClient 클래스 구현
  □ getAuthorizationUrl() 구현
  □ exchangeCodeForToken() 구현
  □ getAccountList() 구현
  □ getBalance() 구현
  □ getTransactionList() 구현 (POST)
  □ refreshToken() 구현
□ services/api/src/routes/oauth.ts 확장
  □ GET /oauth/kftc/authorize 구현
  □ GET /oauth/kftc/callback 구현
□ ExternalAuth 테이블 저장 (암호화)

Frontend:
□ BankConnectButton 컴포넌트
□ OAuth 콜백 처리

테스트:
□ KFTC 인증 E2E 동작
□ 계좌 목록 조회 성공 (10개+)
□ 잔액 조회 성공
□ 거래 내역 조회 성공 (90일)
□ 토큰 갱신 동작
```

### 1.3 계좌 자동 동기화 (Week 2)
```
Backend:
□ services/api/src/routes/accounts.ts 작성
  □ POST /accounts/sync 구현
  □ GET /accounts 구현
  □ GET /accounts/:id 구현
  □ DELETE /accounts/:id 구현
□ BankAccount 모델 사용
  □ accountNumber 마스킹 구현
  □ balance 음수 = 부채 처리
  □ lastSyncedAt 업데이트
□ JWT 인증 미들웨어 적용
□ 입력 검증 (Zod)
□ 에러 핸들링

Frontend:
□ services/web/app/upload/page.tsx 작성
  □ AccountSelector 컴포넌트
  □ SyncButton 컴포넌트
  □ AccountCard 컴포넌트

테스트:
□ 계좌 동기화 성공
□ BankAccount + Transaction 저장
□ 중복 거래 방지 (providerTxId unique)
□ 마스킹 정상 동작
□ 페이지네이션 동작
```

### 1.4 백그라운드 동기화 워커 (Week 2)
```
Backend:
□ services/api/src/workers/sync-accounts.ts 작성
  □ BullMQ 워커 구현
  □ 계좌 목록 조회
  □ 잔액 조회
  □ 거래 내역 조회 (90일)
  □ BankAccount + Transaction 저장
  □ 진행률 업데이트
  □ 에러 핸들링
□ Cron 작업 설정 (매일 새벽 2시)
□ 실패 시 재시도 (3회)

테스트:
□ 큐에 작업 추가 성공
□ Worker 실행 및 완료
□ 진행률 추적
□ 에러 시 재시도 동작
□ Cron 실행 확인
```

### Phase 1 완료 기준 ✅
```
□ Toss 인증 E2E 동작
□ KFTC OAuth E2E 동작
□ 계좌 10개 이상 동기화 성공
□ 거래 내역 90일 수집 성공
□ BankAccount + Transaction DB 저장
□ 토큰 자동 갱신 동작
□ 백그라운드 워커 동작
```

---

## 📊 Phase 2: 채무 분석 엔진 (P0 - 핵심 가치)

### 2.1 채무 분석 패키지 (Week 3)
```
Backend:
□ packages/debt-analyzer/src/types.ts 작성
  □ DebtAnalysisInput 인터페이스
  □ DebtAnalysisResult 인터페이스
  □ DebtBreakdown 인터페이스
  □ CreditGrade 타입
  □ RiskLevel 타입
□ packages/debt-analyzer/src/analyzer.ts 작성
  □ DebtAnalyzer 클래스
  □ analyze() 메인 함수
  □ calculateTotalDebt()
  □ calculateTotalAssets()
  □ calculateDTI()
  □ calculateDSR()
  □ estimateCreditGrade()
  □ assessRiskLevel()
  □ breakdownByType()
  □ generateRecommendations()

테스트:
□ packages/debt-analyzer/tests/analyzer.test.ts 작성
  □ calculateTotalDebt() 테스트
  □ calculateDTI() 테스트
  □ estimateCreditGrade() 테스트
  □ breakdownByType() 테스트
□ 커버리지 > 80%
```

### 2.2 정책 매칭 엔진 (Week 3)
```
Backend:
□ packages/debt-analyzer/src/policy-matcher.ts 작성
  □ PolicyMatcher 클래스
  □ matchShinbokPreWorkout()
  □ matchFreshStartFund()
  □ matchIndividualRecovery()
  □ matchBankruptcy()

테스트:
□ 부채 3억, 소득 200만원 → 신복위 TRUE
□ 부채 8억, 소득 150만원 → 새출발 TRUE
□ 부채 12억 → 개인회생 FALSE
```

### 2.3 시뮬레이션 엔진 (Week 4)
```
Backend:
□ packages/debt-analyzer/src/simulator.ts 작성
  □ DebtSimulator 클래스
  □ simulateShinbok()
  □ simulateFreshStart()
  □ simulateRecovery()
  □ 월 상환액 계산
  □ 총 절감액 계산
  □ 상환 기간 추정

테스트:
□ 각 플랜별 adjustedPayment 정확성
□ totalSavings 계산 정확성
□ estimatedPeriod 타당성
```

### 2.4 API 엔드포인트 (Week 4)
```
Backend:
□ services/api/src/routes/debt-analysis.ts 작성
  □ POST /debt/analyze 구현
  □ GET /debt/analyses/:id 구현
  □ GET /debt/analyses 구현
  □ POST /debt/simulate 구현
□ DebtAnalysis 테이블 저장
□ RestructuringPlan 테이블 저장
□ 비동기 처리 (BullMQ)
□ 입력 검증 (Zod)

Frontend:
□ services/web/app/result/[id]/page.tsx 작성 ⭐⭐⭐
  □ DebtSummary 컴포넌트
  □ DebtChart 컴포넌트 (Recharts)
  □ PlanComparison 컴포넌트
  □ PlanCard 컴포넌트
  □ ApplyButton 컴포넌트
□ 차트 렌더링 (pie, bar)
□ 플랜 선택 기능

테스트:
□ POST /debt/analyze 성공
□ DB에 DebtAnalysis + RestructuringPlan 저장
□ 결과 페이지 렌더링 성공
□ 차트 표시 정상
□ 플랜 비교 표시 정상
```

### Phase 2 완료 기준 ✅
```
□ 채무 분석 API 동작
□ DTI, DSR 계산 정확도 100%
□ 정책 매칭 3개 이상 (신복위, 새출발, 개인회생)
□ 시뮬레이션 결과 타당성 검증
□ DebtAnalysis + RestructuringPlan DB 저장
□ 결과 페이지 렌더링 성공
□ 조정 시뮬레이션 비교 표시
```

---

## 📄 Phase 3: 신청서 자동 생성 (P1 - 완성도)

### 3.1 PDF 생성기 (Week 7)
```
Backend:
□ services/api/src/lib/pdf-generator.ts 작성
  □ generateShinbokApplication()
  □ generateFreshStartApplication()
  □ generateRecoveryApplication()
  □ PDFKit 사용
  □ S3 업로드
□ 신청자 정보 포함
□ 부채 내역 포함
□ 소득 증빙 포함
□ 재산 목록 포함
□ 동의서 포함

테스트:
□ PDF 생성 성공 (10페이지 이내)
□ S3 업로드 성공
□ PDF 다운로드 가능
```

### 3.2 신청 API (Week 7-8)
```
Backend:
□ services/api/src/routes/applications.ts 작성
  □ POST /applications 구현
  □ PATCH /applications/:id 구현
  □ POST /applications/:id/generate-pdf 구현
  □ POST /applications/:id/submit 구현
  □ GET /applications/:id 구현
  □ GET /applications 구현
  □ POST /applications/:id/withdraw 구현
□ Application 테이블 생성
□ applicationNumber 자동 생성
□ PDF 생성 (백그라운드)
□ 이메일 알림 (선택)

Frontend:
□ 신청서 폼 페이지
□ PDF 다운로드 버튼
□ 제출 버튼

테스트:
□ 신청서 생성 성공
□ PDF 생성 성공
□ PDF 다운로드 가능
□ 제출 후 상태 변경 (SUBMITTED)
```

### Phase 3 완료 기준 ✅
```
□ 신청서 PDF 생성 성공 (3종)
□ S3 업로드 성공
□ PDF 다운로드 가능
□ Application 테이블 저장
□ 제출 프로세스 동작
```

---

## 🎨 Phase 4: 프론트엔드 완성 (P1)

### 4.1 동의 페이지 (Week 5-6)
```
□ services/web/app/consent/page.tsx 완성
□ ConsentToggle 컴포넌트
□ TossAuthButton 컴포넌트
□ BankConnectButton 컴포넌트
□ 필수 동의 체크 시 버튼 활성화
□ OAuth 팝업 처리
□ /upload로 이동
```

### 4.2 업로드/계좌 연결 페이지 (Week 5-6)
```
□ services/web/app/upload/page.tsx 완성
□ 탭 1: 계좌 자동 연결
  □ AccountSelector
  □ SyncButton
  □ AccountCard
□ 탭 2: 문서 수동 업로드
  □ FileDropzone
  □ ProgressBar
□ 동기화 완료 시 /result로 이동
```

### 4.3 결과 페이지 (Week 6) ⭐⭐⭐
```
□ services/web/app/result/[id]/page.tsx 완성
□ 섹션 1: 현재 채무 상황
  □ DebtSummary
  □ DebtChart (pie)
□ 섹션 2: 조정 시뮬레이션 비교
  □ PlanComparison
  □ PlanCard (3개)
□ 섹션 3: 신청하기
  □ ApplyButton
□ 차트 렌더링 정상
□ 플랜 선택 동작
□ 반응형 디자인
```

### 4.4 대시보드 (Week 9-10)
```
□ services/web/app/dashboard/page.tsx
  □ AccountCard
  □ DebtTrend
  □ QuickActions
  □ RecentHistory
□ services/web/app/dashboard/accounts/page.tsx
  □ AccountList
  □ AccountDetail
□ services/web/app/dashboard/history/page.tsx
  □ VerificationHistory
  □ AnalysisHistory
□ 페이지네이션 동작
□ 데이터 로딩 상태 표시
```

### Phase 4 완료 기준 ✅
```
□ 모든 페이지 렌더링 성공
□ OAuth 플로우 E2E 성공
□ 결과 페이지 조정 비교 표시
□ 신청하기 버튼 동작
□ 반응형 디자인 (모바일 지원)
□ 로딩 상태 처리
□ 에러 상태 처리
```

---

## 🔒 보안 체크리스트

```
데이터 암호화:
□ ExternalAuth.accessToken - AES-256-GCM 암호화
□ ExternalAuth.refreshToken - AES-256-GCM 암호화
□ services/api/src/lib/crypto.ts 작성
  □ encrypt() 함수
  □ decrypt() 함수
□ Prisma middleware 적용
□ ENCRYPTION_KEY 환경변수 설정

인증/인가:
□ JWT 토큰 (expiresIn: 24h)
□ httpOnly Cookie 저장
□ services/api/src/middleware/auth.ts 작성
  □ authenticateJWT()
  □ requireAuth()
□ Rate limiting (100 req/min)
  □ services/api/src/middleware/rate-limit.ts

CORS & 헤더:
□ CORS_ORIGINS 환경변수
□ Helmet.js 적용
□ Content-Security-Policy
□ X-Frame-Options: DENY
□ X-Content-Type-Options: nosniff

테스트:
□ 암호화 → DB 저장 → 복호화 성공
□ 유효하지 않은 토큰 → 401
□ Rate limit 초과 → 429
□ 허용되지 않은 origin → 차단
```

---

## ⚡ 성능 체크리스트

```
데이터베이스:
□ N+1 쿼리 방지 (Prisma include)
□ 인덱스 확인 (schema.prisma @@index)
□ 페이지네이션 (skip/take)
□ 커넥션 풀 (pool_size=10)

Redis 캐싱:
□ services/api/src/lib/redis.ts 작성
  □ cacheGet()
  □ cacheSet()
  □ cacheInvalidate()
□ 계좌 목록 캐싱 (TTL 5분)
□ 분석 결과 캐싱 (TTL 1시간)
□ Rate limit 카운터

비동기 처리:
□ services/api/src/workers/
  □ ocr-processor.ts
  □ pdf-generator.ts
  □ sync-accounts.ts
  □ email-sender.ts
□ BullMQ 큐 설정
□ 실패 시 재시도

테스트:
□ 쿼리 실행 시간 < 100ms
□ 캐시 히트율 > 70%
□ 동시 접속 100명 처리 가능
```

---

## 🧪 테스트 체크리스트

```
Unit Tests:
□ packages/debt-analyzer/tests/ 작성
  □ analyzer.test.ts
  □ policy-matcher.test.ts
  □ simulator.test.ts
□ services/api/tests/unit/ 작성
  □ lib/toss.test.ts
  □ lib/kftc.test.ts
  □ lib/crypto.test.ts
□ 커버리지 > 80%

Integration Tests:
□ services/api/tests/integration/ 작성
  □ auth.test.ts
  □ oauth.test.ts
  □ accounts.test.ts
  □ debt-analysis.test.ts

E2E Tests:
□ services/web/tests/e2e/debt-flow.test.ts
  □ 회원가입 → 로그인
  □ 동의 → OAuth 연결
  □ 계좌 동기화
  □ 분석 실행
  □ 결과 확인
  □ 신청서 생성
```

---

## 🚀 배포 체크리스트

```
환경 변수:
□ .env.production 설정
  □ NODE_ENV=production
  □ DATABASE_URL (운영)
  □ REDIS_URL (운영)
  □ JWT_SECRET (강력한 키)
  □ ENCRYPTION_KEY (32 bytes)
  □ TOSS/KFTC 운영 키
  □ S3_BUCKET (운영)
  □ SENTRY_DSN

Docker:
□ services/api/Dockerfile 작성
□ services/web/Dockerfile 작성
□ docker-compose.full.yml 작성
□ 빌드 테스트 성공

Kubernetes:
□ infra/k8s/production/
  □ deployment.yaml
  □ service.yaml
  □ ingress.yaml
  □ configmap.yaml
  □ secrets.yaml
□ kubectl apply 성공
□ 롤링 업데이트 동작

모니터링:
□ Sentry 연동
□ DataDog 연동
□ Prometheus 메트릭
□ Grafana 대시보드
□ GET /health 정상
□ GET /metrics 접근 가능
```

---

## 📊 전체 진행률

```
Phase 0: 개발 환경 [    ] 0/10
Phase 1: OAuth & 계좌 [    ] 0/40
Phase 2: 채무 분석    [    ] 0/30
Phase 3: 신청서 생성  [    ] 0/15
Phase 4: 프론트엔드   [    ] 0/25
보안                 [    ] 0/15
성능                 [    ] 0/10
테스트               [    ] 0/10
배포                 [    ] 0/15

총 진행률: [    ] 0/170 (0%)
```

---

## 🎯 우선순위 요약

### 즉시 시작 (Week 1-2)
```
1. Toss 인증 통합
2. KFTC 오픈뱅킹 통합
3. 계좌 동기화 API
```

### 핵심 가치 (Week 3-6)
```
4. 채무 분석 엔진
5. 정책 매칭
6. 시뮬레이션
7. 결과 페이지 (프론트엔드)
```

### 완성도 (Week 7-12)
```
8. 신청서 자동 생성
9. 대시보드
10. E2E 테스트
11. 프로덕션 배포
```

---

**업데이트**: 진행하면서 체크 표시 (✅) 하세요!
