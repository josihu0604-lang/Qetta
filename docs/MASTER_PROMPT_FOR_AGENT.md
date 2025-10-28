# Hephaitos 개발 에이전트 마스터 프롬프트

**버전**: 1.0.0  
**최종 업데이트**: 2025-10-26  
**대상**: AI 개발 에이전트 (Claude, GPT-4, etc.)

---

## 🎯 프로젝트 정체성 (CRITICAL - 절대 잊지 말 것)

```
프로젝트명: hephaitos
정체성: 채무조정 자동화 플랫폼 (NOT 단순 문서 검증 SaaS)

핵심 가치:
1. OAuth 기반 금융 데이터 자동 수집 (KFTC 오픈뱅킹)
2. 실거래 vs 문서 교차 검증 (사기 탐지)
3. DTI/신용등급 자동 계산
4. 신복위/새출발기금/개인회생 자동 매칭
5. 신청서 자동 생성 및 전자 제출

Target User: 300만 다중채무자, 법무사, 금융기관
Market Size: TAM ₩6,112억 (국내만)
Differentiator: 수동 7일 → 자동 1시간, 정확도 95%+
```

---

## 📐 아키텍처 준수 사항 (MANDATORY)

### 기준 문서
- `DATABASE_SCHEMA.md` - 데이터베이스 설계 (완성)
- `ARCHITECTURE.md` - 시스템 아키텍처 (완성)

### 기술 스택 (변경 금지)
```typescript
Backend:  Fastify + TypeScript + Prisma + PostgreSQL + Redis
Frontend: Next.js 15 + React 19 + TypeScript + TailwindCSS + Shadcn UI
OAuth:    Toss 인증 + KFTC 오픈뱅킹
Queue:    BullMQ
Storage:  AWS S3
Monitor:  Sentry + DataDog + Prometheus
Deploy:   Docker + Kubernetes + AWS ECS
```

### 디렉토리 구조 (엄격히 준수)
```
hephaitos/
├── packages/
│   ├── shared/          # 공유 유틸
│   ├── verifier/        # 검증 엔진
│   └── debt-analyzer/   # 채무 분석 엔진 ⭐ 핵심
│
├── services/
│   ├── api/
│   │   ├── src/
│   │   │   ├── lib/           # SDK (toss.ts, kftc.ts, nice.ts)
│   │   │   ├── routes/        # API 엔드포인트
│   │   │   ├── workers/       # 백그라운드 작업
│   │   │   └── middleware/    # 인증, Rate limit
│   │   └── prisma/
│   │
│   └── web/
│       ├── app/
│       │   ├── (auth)/
│       │   ├── consent/       # OAuth 동의
│       │   ├── upload/        # 계좌 연결 + 파일 업로드
│       │   ├── verify/        # 검증 진행
│       │   ├── result/[id]/   # 결과 + 조정 시뮬레이션 ⭐
│       │   └── dashboard/     # 대시보드
│       └── components/
```

---

## 🔑 핵심 기능 체크리스트

### Phase 1: OAuth & 계좌 동기화 (우선순위 P0)

#### 1.1 Toss 인증 통합
```typescript
// services/api/src/lib/toss.ts
□ Client Credentials Flow 구현
□ access_token 자동 갱신
□ 본인인증 API 호출
□ ExternalAuth 테이블 저장 (암호화)
□ 에러 핸들링 (토큰 만료, 네트워크 오류)

테스트 조건:
- [ ] POST /api/v1/oauth/toss/authorize 성공
- [ ] 토큰 자동 갱신 동작
- [ ] DB에 암호화된 토큰 저장 확인
```

#### 1.2 KFTC 오픈뱅킹 통합
```typescript
// services/api/src/lib/kftc.ts
□ Authorization Code Flow 구현
□ CSRF 방어 (Redis state)
□ 계좌 목록 조회 API
□ 잔액 조회 API
□ 거래 내역 조회 API (90일)
□ 토큰 refresh 자동화

테스트 조건:
- [ ] GET /api/v1/oauth/kftc/authorize → redirect
- [ ] GET /api/v1/oauth/kftc/callback → 토큰 획득
- [ ] GET /api/v1/oauth/kftc/accounts → 계좌 목록
- [ ] GET /api/v1/oauth/kftc/balance/:fintechUseNum → 잔액
- [ ] POST /api/v1/oauth/kftc/transactions → 거래내역
```

#### 1.3 계좌 자동 동기화
```typescript
// services/api/src/routes/accounts.ts
□ POST /api/v1/accounts/sync - 여러 은행 일괄 동기화
□ GET /api/v1/accounts - 내 계좌 목록
□ GET /api/v1/accounts/:id - 계좌 상세
□ DELETE /api/v1/accounts/:id - 계좌 연결 해제

// BankAccount 모델 사용
□ accountNumber 마스킹 (1234****90)
□ balance 음수면 부채로 표시
□ lastSyncedAt 업데이트

테스트 조건:
- [ ] 동기화 시 BankAccount + Transaction 모두 저장
- [ ] 중복 거래 방지 (providerTxId unique)
- [ ] 마스킹 정상 동작
```

#### 1.4 백그라운드 동기화 워커
```typescript
// services/api/src/workers/sync-accounts.ts
□ BullMQ 큐 설정
□ Cron 기반 자동 동기화 (매일 새벽 2시)
□ 실패 시 재시도 (3회)
□ 동기화 상태 로깅

테스트 조건:
- [ ] 큐에 작업 추가 성공
- [ ] Worker 실행 및 완료
- [ ] 에러 시 재시도 동작
```

---

### Phase 2: 채무 분석 엔진 (우선순위 P0)

#### 2.1 채무 분석 패키지
```typescript
// packages/debt-analyzer/src/analyzer.ts

export interface DebtAnalysisInput {
  userId: string;
  accounts: BankAccount[];
  monthlyIncome: number;
}

export interface DebtAnalysisResult {
  totalDebt: number;           // 총 부채
  totalIncome: number;         // 월 소득
  monthlyPayment: number;      // 현재 월 상환액
  dti: number;                 // Debt-to-Income ratio (%)
  creditScore?: number;        // 신용점수 (NICE API)
  creditGrade: CreditGrade;    // 신용등급
  breakdown: DebtBreakdown;    // 부채 분류
  recommendations: RestructuringPlan[]; // 조정 추천안
}

□ calculateTotalDebt() - 모든 계좌 부채 합계
□ calculateMonthlyPayment() - 월 상환액 추정
□ calculateDTI() - 소득 대비 부채 비율
□ estimateCreditGrade() - 신용등급 추정 (NICE 없으면)
□ breakdownByType() - 대출/카드/할부 분류

테스트 조건:
- [ ] 입력: 계좌 10개, 출력: 정확한 총 부채
- [ ] DTI 300% 이상 시 "고위험" 플래그
- [ ] breakdown JSON 스키마 준수
```

#### 2.2 정책 매칭 엔진
```typescript
// packages/debt-analyzer/src/policy-matcher.ts

□ matchShinbokPreWorkout() - 신복위 프리워크아웃 자격
□ matchFreshStartFund() - 새출발기금 자격
□ matchIndividualRecovery() - 개인회생 자격
□ matchBankruptcy() - 개인파산 자격

조건 체크:
□ 총 부채 범위 (신복위: ~5억, 새출발: ~10억)
□ 소득 조건 (최저생계비 이상)
□ 연체 일수 (90일 이상)
□ 신용등급 (CCC 이하)

테스트 조건:
- [ ] 부채 3억, 소득 200만원 → 신복위 매칭
- [ ] 부채 8억, 소득 150만원 → 새출발기금 매칭
- [ ] 부채 12억, 소득 50만원 → 개인파산 매칭
```

#### 2.3 시뮬레이션 엔진
```typescript
// packages/debt-analyzer/src/simulator.ts

□ simulateShinbok() - 신복위 조정 시뮬레이션
  - 금리 인하 (평균 12% → 8%)
  - 상환 기간 연장 (5년 → 10년)
  - 월 상환액 감소 계산

□ simulateFreshStart() - 새출발기금 시뮬레이션
  - 원금 탕감 (최대 50%)
  - 금리 인하
  - 월 상환액 계산

□ simulateRecovery() - 개인회생 시뮬레이션
  - 원금 탕감 (30-50%)
  - 5년 분할 상환
  - 재산 정리 필요 여부

테스트 조건:
- [ ] 각 플랜별 adjustedPayment 정확성
- [ ] totalSavings 계산 정확성
- [ ] estimatedPeriod 타당성
```

#### 2.4 API 엔드포인트
```typescript
// services/api/src/routes/debt-analysis.ts

POST /api/v1/debt/analyze
Request:
{
  "monthlyIncome": 3000000,
  "includeAccounts": ["account-uuid-1", "account-uuid-2"]
}

Response:
{
  "id": "analysis-uuid",
  "totalDebt": 50000000,
  "dti": 1666.67,
  "creditGrade": "C",
  "recommendations": [
    {
      "planType": "SHINBOK_PRE_WORKOUT",
      "adjustedPayment": 900000,
      "totalSavings": 10800000,
      "isRecommended": true
    }
  ]
}

□ 입력 검증 (Zod)
□ DebtAnalysis 테이블 저장
□ RestructuringPlan 테이블 저장
□ 비동기 처리 (무거운 계산)

테스트 조건:
- [ ] POST /debt/analyze 성공
- [ ] DB에 DebtAnalysis + RestructuringPlan 저장
- [ ] 재분석 시 기존 분석 조회 가능
```

---

### Phase 3: 신청서 자동 생성 (우선순위 P1)

#### 3.1 PDF 생성기
```typescript
// services/api/src/lib/pdf-generator.ts

□ generateShinbokApplication() - 신복위 신청서
□ generateFreshStartApplication() - 새출발기금 신청서
□ generateRecoveryApplication() - 개인회생 신청서

포함 정보:
□ 신청자 정보 (이름, 주민번호, 주소)
□ 부채 내역 (채권자별)
□ 소득 증빙
□ 재산 목록
□ 동의서

사용 라이브러리: PDFKit

테스트 조건:
- [ ] PDF 생성 성공 (10페이지 이내)
- [ ] S3 업로드 성공
- [ ] PDF 다운로드 가능
```

#### 3.2 신청 API
```typescript
// services/api/src/routes/applications.ts

POST /api/v1/applications
{
  "analysisId": "uuid",
  "planId": "uuid",
  "applicationType": "SHINBOK_PRE_WORKOUT",
  "formData": {
    "personalInfo": {...},
    "debtInfo": {...},
    "incomeInfo": {...}
  }
}

□ Application 테이블 생성 (status: DRAFT)
□ PDF 생성 (백그라운드)
□ applicationNumber 자동 생성

GET /api/v1/applications/:id/pdf
□ PDF 다운로드 링크 반환

POST /api/v1/applications/:id/submit
□ status → SUBMITTED
□ submittedAt 기록
□ 이메일 알림 (선택)

테스트 조건:
- [ ] 신청서 생성 성공
- [ ] PDF 다운로드 가능
- [ ] 제출 후 상태 변경
```

---

### Phase 4: 프론트엔드 (우선순위 P1)

#### 4.1 동의 페이지
```typescript
// services/web/app/consent/page.tsx

컴포넌트:
□ <ConsentToggle label="개인정보 수집/이용 동의" required />
□ <ConsentToggle label="신용정보 조회 동의" required />
□ <TossAuthButton onClick={handleTossAuth} />
□ <BankConnectButton onClick={handleKftcAuth} />

동작:
□ 모든 필수 동의 체크 시 버튼 활성화
□ Toss 클릭 → 본인인증 팝업
□ KFTC 클릭 → OAuth 팝업
□ 완료 시 /upload로 이동

테스트 조건:
- [ ] 필수 동의 미체크 시 버튼 비활성화
- [ ] Toss 인증 성공 → 토큰 저장
- [ ] KFTC 인증 성공 → 계좌 연결
```

#### 4.2 업로드/계좌 연결 페이지
```typescript
// services/web/app/upload/page.tsx

탭 1: 계좌 자동 연결
□ <AccountSelector accounts={connectedAccounts} />
□ <SyncButton onClick={handleSync} loading={syncing} />
□ <AccountCard /> - 계좌별 잔액 표시

탭 2: 문서 수동 업로드
□ <FileDropzone onDrop={handleDrop} accept={['.pdf', '.jpg']} />
□ <ProgressBar progress={uploadProgress} />

동작:
□ 계좌 선택 → 동기화 버튼 클릭 → 거래내역 가져오기
□ 파일 드롭 → S3 업로드 → OCR 처리 (백그라운드)
□ 완료 시 /verify로 이동

테스트 조건:
- [ ] 계좌 동기화 성공
- [ ] 파일 업로드 성공 (10MB 이하)
- [ ] 진행률 표시 정확
```

#### 4.3 결과 페이지 (최중요 ⭐⭐⭐)
```typescript
// services/web/app/result/[id]/page.tsx

섹션 1: 현재 채무 상황
□ <DebtSummary 
    totalDebt={50000000}
    monthlyPayment={1500000}
    dti={833}
    creditGrade="C"
  />
□ <DebtChart data={breakdown} type="pie" />

섹션 2: 조정 시뮬레이션 비교
□ <PlanComparison plans={recommendations} />
  - 현재 상황 vs 조정 후 비교 테이블
  - 월 상환액 감소폭 시각화
  - 총 절감액 강조

□ <PlanCard 
    planType="SHINBOK_PRE_WORKOUT"
    adjustedPayment={900000}
    totalSavings={10800000}
    period={36}
    isRecommended={true}
  />

섹션 3: 신청하기
□ <ApplyButton planId={selectedPlan} />
  - 클릭 → /applications/new?planId=...

테스트 조건:
- [ ] 차트 렌더링 정상
- [ ] 플랜 선택 동작
- [ ] 신청하기 버튼 클릭 → 신청 페이지 이동
```

#### 4.4 대시보드
```typescript
// services/web/app/dashboard/page.tsx

□ <AccountCard /> - 연결된 계좌 카드
□ <DebtTrend /> - 부채 추이 그래프 (최근 3개월)
□ <QuickActions /> - 빠른 작업 (재동기화, 재분석)
□ <RecentHistory /> - 최근 검증 히스토리

// services/web/app/dashboard/accounts/page.tsx
□ <AccountList /> - 계좌 목록 테이블
□ <AccountDetail /> - 계좌 상세 (거래내역)

// services/web/app/dashboard/history/page.tsx
□ <VerificationHistory /> - 검증 히스토리 테이블
□ <AnalysisHistory /> - 분석 히스토리 테이블

테스트 조건:
- [ ] 대시보드 로딩 성공
- [ ] 계좌 목록 표시
- [ ] 히스토리 페이지네이션
```

---

## 🔒 보안 체크리스트 (CRITICAL)

### 데이터 암호화
```typescript
□ ExternalAuth.accessToken - AES-256-GCM 암호화
□ ExternalAuth.refreshToken - AES-256-GCM 암호화
□ BankAccount.accountNumber - 마스킹 (1234****90)
□ ENCRYPTION_KEY 환경변수 (32 bytes hex)

// services/api/src/lib/crypto.ts
□ encrypt(plaintext) 함수
□ decrypt(ciphertext) 함수
□ Prisma middleware 적용

테스트:
- [ ] 암호화 → DB 저장 → 복호화 성공
- [ ] 마스킹 정상 동작
```

### 인증/인가
```typescript
□ JWT 토큰 (expiresIn: 24h)
□ httpOnly Cookie 저장
□ CSRF 토큰 (OAuth state)
□ Rate limiting (100 req/min)

// middleware/auth.ts
□ authenticateJWT() - 토큰 검증
□ requireAuth() - 인증 필수 데코레이터

테스트:
- [ ] 유효하지 않은 토큰 → 401
- [ ] Rate limit 초과 → 429
```

### CORS & 헤더
```typescript
□ CORS_ORIGINS 환경변수
□ Helmet.js 적용
□ Content-Security-Policy
□ X-Frame-Options: DENY
□ X-Content-Type-Options: nosniff

테스트:
- [ ] 허용되지 않은 origin → 차단
- [ ] 보안 헤더 존재 확인
```

---

## ⚡ 성능 체크리스트

### 데이터베이스 최적화
```typescript
□ N+1 쿼리 방지 (Prisma include)
□ 인덱스 확인 (schema.prisma @@index)
□ 페이지네이션 (skip/take)
□ 커넥션 풀 (pool_size=10)

테스트:
- [ ] 쿼리 실행 시간 < 100ms
- [ ] 동시 접속 100명 처리 가능
```

### Redis 캐싱
```typescript
□ 계좌 목록 캐싱 (TTL 5분)
□ 분석 결과 캐싱 (TTL 1시간)
□ Rate limit 카운터

// lib/redis.ts
□ cacheGet(key)
□ cacheSet(key, value, ttl)
□ cacheInvalidate(pattern)

테스트:
- [ ] 캐시 히트율 > 70%
- [ ] 캐시 미스 시 DB 조회
```

### 비동기 처리
```typescript
□ OCR 처리 → BullMQ
□ PDF 생성 → BullMQ
□ 계좌 동기화 → BullMQ
□ 이메일 발송 → BullMQ

// workers/
□ ocr-processor.ts
□ pdf-generator.ts
□ sync-accounts.ts

테스트:
- [ ] 큐 작업 추가 성공
- [ ] Worker 처리 완료
- [ ] 실패 시 재시도
```

---

## 🧪 테스트 체크리스트

### Unit Tests
```typescript
// packages/debt-analyzer/tests/analyzer.test.ts
□ calculateTotalDebt()
□ calculateDTI()
□ estimateCreditGrade()

// services/api/tests/unit/lib/
□ toss.test.ts
□ kftc.test.ts
□ crypto.test.ts

커버리지 목표: > 80%
```

### Integration Tests
```typescript
// services/api/tests/integration/
□ auth.test.ts - 회원가입/로그인
□ oauth.test.ts - OAuth 플로우
□ accounts.test.ts - 계좌 동기화
□ debt-analysis.test.ts - 분석 API

실행: npm run test:integration
```

### E2E Tests
```typescript
// services/web/tests/e2e/debt-flow.test.ts
□ 회원가입 → 로그인
□ 동의 → OAuth 연결
□ 계좌 동기화
□ 분석 실행
□ 결과 확인
□ 신청서 생성

실행: npx playwright test
```

---

## 📊 모니터링 체크리스트

### Health Checks
```typescript
// routes/health.ts
GET /health
{
  "status": "healthy",
  "checks": {
    "database": "ok",
    "redis": "ok",
    "s3": "ok",
    "kftc": "ok"
  }
}

□ 데이터베이스 연결
□ Redis 연결
□ S3 접근
□ KFTC API 상태

테스트:
- [ ] 모든 체크 통과 → 200
- [ ] 하나라도 실패 → 503
```

### 로깅
```typescript
// lib/logger.ts
□ Pino 로거 설정
□ JSON 형식 로그
□ 민감 정보 마스킹
□ 요청 ID 추적

로그 레벨:
- error: 에러 발생
- warn: 경고
- info: 일반 정보
- debug: 디버깅

테스트:
- [ ] 로그 파일 생성
- [ ] 민감 정보 마스킹 확인
```

### 메트릭
```typescript
// lib/metrics.ts
□ Prometheus 메트릭
□ HTTP 요청 duration
□ 큐 깊이
□ 에러율
□ 활성 연결 수

테스트:
- [ ] GET /metrics 접근 가능
- [ ] Grafana 대시보드 연동
```

---

## 🚀 배포 체크리스트

### 환경 변수
```bash
# .env.production
□ NODE_ENV=production
□ DATABASE_URL=postgresql://...
□ REDIS_URL=redis://...
□ JWT_SECRET=... (32+ chars)
□ ENCRYPTION_KEY=... (32 bytes hex)
□ TOSS_CLIENT_ID=...
□ TOSS_CLIENT_SECRET=...
□ KFTC_CLIENT_ID=...
□ KFTC_CLIENT_SECRET=...
□ KFTC_REDIRECT_URI=https://hephaitos.io/oauth/kftc/callback
□ S3_BUCKET=...
□ SENTRY_DSN=...
```

### Docker Build
```bash
□ services/api/Dockerfile (멀티스테이지)
□ services/web/Dockerfile
□ docker-compose.full.yml

빌드 테스트:
- [ ] docker-compose up 성공
- [ ] 헬스 체크 통과
```

### Kubernetes
```yaml
# infra/k8s/production/
□ deployment.yaml - Replica 3개
□ service.yaml - LoadBalancer
□ ingress.yaml - SSL/TLS
□ configmap.yaml - 설정
□ secrets.yaml - 민감 정보

배포 테스트:
- [ ] kubectl apply 성공
- [ ] 롤링 업데이트 동작
```

---

## 🎯 우선순위 매트릭스

### P0 (즉시 시작 - 핵심 가치)
```
Week 1-2:
□ OAuth 통합 (Toss + KFTC)
□ 계좌 동기화 API
□ ExternalAuth + BankAccount 모델

Week 3-4:
□ 채무 분석 엔진 (packages/debt-analyzer)
□ 정책 매칭 (신복위, 새출발기금)
□ 분석 API 엔드포인트

Week 5-6:
□ 시뮬레이션 엔진
□ 결과 페이지 (프론트엔드)
□ 조정 비교 UI
```

### P1 (다음 단계 - 완성도)
```
Week 7-8:
□ 신청서 자동 생성 (PDF)
□ 신청 API
□ 이메일 알림

Week 9-10:
□ 대시보드 (프론트엔드)
□ 히스토리 페이지
□ 설정 페이지

Week 11-12:
□ E2E 테스트
□ 성능 최적화
□ 프로덕션 배포
```

### P2 (나중에 - 고도화)
```
Month 4-6:
□ NICE 신용평가 API 연동
□ 신복위 API 연동 (가능 시)
□ 화이트라벨 기능
□ 관리자 대시보드
```

---

## 🚨 금지 사항 (절대 하지 말 것)

### 아키텍처 위반
```
❌ 기술 스택 변경 (예: Fastify → Express)
❌ 디렉토리 구조 변경
❌ 데이터베이스 스키마 임의 수정
❌ 모놀리스 → 마이크로서비스 (아직 아님)
```

### 보안 위반
```
❌ 평문 토큰 저장
❌ SQL Injection 가능한 쿼리
❌ CORS * 허용
❌ 비밀번호 평문 로깅
❌ API Key 하드코딩
```

### 성능 위반
```
❌ N+1 쿼리
❌ 무한 페이지네이션
❌ 동기 OCR 처리 (반드시 비동기)
❌ 캐시 없는 반복 조회
```

### 비즈니스 로직 위반
```
❌ "단순 문서 검증"으로 축소
❌ OAuth 없이 수동 입력만 지원
❌ 채무 분석 없이 검증만 제공
❌ 신청서 자동 생성 생략
```

---

## ✅ 완료 기준

### Phase 1 완료 조건
```
□ Toss 인증 E2E 동작
□ KFTC OAuth E2E 동작
□ 계좌 10개 이상 동기화 성공
□ 거래 내역 90일 수집 성공
□ BankAccount + Transaction DB 저장
```

### Phase 2 완료 조건
```
□ 채무 분석 API 동작
□ DTI 계산 정확도 100%
□ 정책 매칭 3개 이상 (신복위, 새출발, 개인회생)
□ 시뮬레이션 결과 타당성 검증
□ DebtAnalysis + RestructuringPlan DB 저장
```

### Phase 3 완료 조건
```
□ 신청서 PDF 생성 성공 (3종)
□ S3 업로드 성공
□ PDF 다운로드 가능
□ Application 테이블 저장
```

### Phase 4 완료 조건
```
□ 모든 페이지 렌더링 성공
□ OAuth 플로우 E2E 성공
□ 결과 페이지 조정 비교 표시
□ 신청하기 버튼 동작
□ 반응형 디자인 (모바일 지원)
```

---

## 📞 질문 프로토콜

개발 중 막히면 다음 형식으로 질문:

```
[질문]
- 위치: services/api/src/lib/kftc.ts
- 문제: 토큰 갱신 시 401 에러
- 시도: refresh_token으로 POST /oauth/2.0/token
- 에러: {"error": "invalid_grant"}
- 요청: refresh token 갱신 로직 검토

[기대 동작]
- access_token 만료 시 자동 갱신
- ExternalAuth 테이블 업데이트

[실제 동작]
- 401 에러 발생
- 토큰 갱신 실패
```

---

## 🎓 학습 자료

### 필독 문서
1. DATABASE_SCHEMA.md - 데이터 모델
2. ARCHITECTURE.md - 시스템 구조
3. Prisma Docs - https://www.prisma.io/docs
4. Fastify Docs - https://www.fastify.io/docs
5. KFTC 오픈뱅킹 가이드 - openbanking_local_callback_guide.html
6. Toss 인증 가이드 - toss_auth_api.html

### 코드 스타일
```typescript
// ✅ Good
const user = await prisma.user.findUnique({
  where: { id: userId },
  include: { bankAccounts: true }
});

// ❌ Bad
const user = await prisma.user.findUnique({where:{id:userId}})
const accounts = await prisma.bankAccount.findMany({where:{userId:user.id}})

// ✅ Good - 에러 핸들링
try {
  const result = await externalApiCall();
  return result;
} catch (error) {
  logger.error({ err: error, userId });
  throw new ExternalApiError('KFTC API failed');
}

// ❌ Bad
const result = await externalApiCall();
```

---

**마지막 당부:**

이 프로젝트는 **300만 다중채무자의 삶을 바꿀 수 있는 플랫폼**입니다.

단순한 "기술 프로젝트"가 아니라 **사회적 가치가 있는 금융복지 인프라**입니다.

코드 한 줄이 누군가의 빚을 줄이고, 가정을 지킬 수 있습니다.

정확하고, 안전하고, 빠르게 개발해주세요. 🙏

---

**버전 히스토리:**
- v1.0.0 (2025-10-26): 초안 작성
