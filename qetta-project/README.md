# QETTA 프로젝트 문서 모음 (최종 버전 v2.0)

**생성일**: 2025-10-26  
**상태**: ✅ 교차 검수 완료  
**총 문서 수**: 10개  
**총 용량**: ~200KB

---

## 📚 문서 목록 및 용도

### 🎯 필수 문서 (개발 시작 전 필독)

#### 1. **MASTER_PROMPT_V2_FINAL.md** (46KB) ⭐⭐⭐
**대상**: AI 개발 에이전트, 신규 개발자  
**용도**: 개발 에이전트용 최종 마스터 프롬프트 (교차 검수 완료)

**내용**:
- ✅ 프로젝트 정체성 (5대 핵심 기능)
- ✅ 아키텍처 준수 사항 (기술 스택, 디렉토리 구조)
- ✅ Phase 1: OAuth & 계좌 동기화 (Toss, KFTC) - 상세 구현 코드
- ✅ Phase 2: 채무 분석 엔진 (analyzer, policy-matcher, simulator) - 상세 구현 코드
- ✅ API 엔드포인트 구현 예시
- ✅ 테스트 조건

**사용법**:
```bash
# AI 에이전트에게 전달
cat MASTER_PROMPT_V2_FINAL.md | pbcopy

# 또는 직접 읽기
open MASTER_PROMPT_V2_FINAL.md
```

**개선 사항** (v1.0 → v2.0):
- ❌ Toss Client Credentials Flow → ✅ Authorization Code Flow 수정
- ❌ KFTC GET /transactions → ✅ POST /transactions 수정
- ✅ 실제 코드 예시 추가 (TossAuthClient, KFTCClient 클래스)
- ✅ 에러 핸들링 상세화
- ✅ 테스트 조건 구체화

---

#### 2. **API_SPECIFICATION.md** (23KB)
**대상**: Backend 개발자, AI 에이전트  
**용도**: API 엔드포인트 완전 명세

**내용**:
- ✅ 10개 카테고리 (인증, OAuth, 계좌, 거래, 문서, 검증, 채무 분석, 신청서, 사용자, 구독)
- ✅ 40+ 엔드포인트 상세 (Request/Response 예시)
- ✅ 에러 코드 정의
- ✅ Rate Limiting 규칙

**사용법**:
```bash
# Backend 개발 시 참고
grep "POST /api/v1" API_SPECIFICATION.md

# 특정 엔드포인트 검색
grep -A 20 "POST /api/v1/debt/analyze" API_SPECIFICATION.md
```

---

#### 3. **FRONTEND_COMPONENTS.md** (25KB)
**대상**: Frontend 개발자  
**용도**: UI 컴포넌트 설계 및 구현 가이드

**내용**:
- ✅ 컴포넌트 계층 구조 (50+ 컴포넌트)
- ✅ 디자인 시스템 (컬러, 타이포그래피, 간격)
- ✅ 핵심 컴포넌트 코드 (TypeScript/React)
  - Layout (Header, Footer)
  - Consent (ConsentToggle, TossAuthButton)
  - Upload (FileDropzone, AccountSelector)
  - Result (DebtSummary, PlanComparison) ⭐
  - Dashboard (AccountCard, DebtTrend)
- ✅ Custom Hooks (useAuth, useAccounts)
- ✅ 반응형 디자인 가이드

**사용법**:
```bash
# 컴포넌트 코드 참고
grep -A 50 "export function Header" FRONTEND_COMPONENTS.md

# Hooks 코드 참고
grep -A 30 "export const useAuth" FRONTEND_COMPONENTS.md
```

---

#### 4. **DEVELOPMENT_SETUP.md** (11KB)
**대상**: 신규 개발자  
**용도**: 개발 환경 설정 가이드 (30-60분)

**내용**:
- ✅ 빠른 시작 (5단계)
- ✅ 사전 요구사항 (Node.js, Docker, PostgreSQL)
- ✅ 데이터베이스 설정 (Docker or 로컬)
- ✅ 환경 변수 설정 (.env 예시)
- ✅ Turborepo 설정
- ✅ 테스트 환경 설정 (Vitest, Playwright)
- ✅ Docker 개발 환경 (docker-compose.yml)
- ✅ 트러블슈팅

**사용법**:
```bash
# 처음 시작할 때
open DEVELOPMENT_SETUP.md

# 환경 변수 설정
grep -A 30 "services/api/.env" DEVELOPMENT_SETUP.md > .env.example
```

---

#### 5. **DEVELOPMENT_CHECKLIST.md** (14KB)
**대상**: 모든 개발자, 프로젝트 매니저  
**용도**: 개발 진행 상황 추적

**내용**:
- ✅ Phase 0: 개발 환경 설정 (10개 항목)
- ✅ Phase 1: OAuth & 계좌 동기화 (40개 항목)
- ✅ Phase 2: 채무 분석 엔진 (30개 항목)
- ✅ Phase 3: 신청서 자동 생성 (15개 항목)
- ✅ Phase 4: 프론트엔드 완성 (25개 항목)
- ✅ 보안 체크리스트 (15개 항목)
- ✅ 성능 체크리스트 (10개 항목)
- ✅ 테스트 체크리스트 (10개 항목)
- ✅ 배포 체크리스트 (15개 항목)

**사용법**:
```bash
# 진행 상황 확인
grep "□" DEVELOPMENT_CHECKLIST.md | wc -l  # 미완료 항목 수
grep "✅" DEVELOPMENT_CHECKLIST.md | wc -l # 완료 항목 수

# 특정 Phase 체크리스트만 보기
grep -A 50 "Phase 1:" DEVELOPMENT_CHECKLIST.md
```

---

#### 6. **ERROR_HANDLING_GUIDE.md** (15KB)
**대상**: Backend 개발자  
**용도**: 에러 코드 표준 및 핸들링 가이드

**내용**:
- ✅ 에러 코드 구조 ({PREFIX}_{CATEGORY}_{SPECIFIC_ERROR})
- ✅ 에러 코드 정의 (10개 카테고리, 50+ 에러 코드)
  - AUTH_*, OAUTH_*, ACCOUNT_*, TRANSACTION_*
  - DOCUMENT_*, VERIFICATION_*, DEBT_*
  - APPLICATION_*, BILLING_*, GENERAL_*
- ✅ 에러 응답 형식 (JSON 스키마)
- ✅ 에러 핸들링 구현 (Backend, Frontend)
- ✅ Sentry 통합

**사용법**:
```bash
# 에러 코드 검색
grep "AUTH_TOKEN" ERROR_HANDLING_GUIDE.md

# 구현 예시 참고
grep -A 50 "export class AppError" ERROR_HANDLING_GUIDE.md
```

---

### 💼 비즈니스 문서

#### 7. **PITCH_DECK.md** (12KB)
**대상**: 투자자, 경영진  
**용도**: 투자 피치덱 아웃라인 (10분 피칭)

**내용**:
- ✅ 12개 슬라이드 구성
  1. 커버
  2. 문제 (Problem) - 300만 다중채무자
  3. 솔루션 (Solution) - 3분 채무조정
  4. 시장 (Market) - TAM ₩6,112억
  5. 비즈니스 모델 - B2C 구독 + B2B 화이트라벨
  6. 경쟁 우위 - OAuth 자동화
  7. 트랙션
  8. 로드맵
  9. 팀
  10. 재무 전망
  11. 투자 요청 - ₩500M @ 10%
  12. Q&A
- ✅ Appendix (5개 백업 슬라이드)
- ✅ 디자인 가이드
- ✅ 데모 스크립트 (3분)

**사용법**:
```bash
# PowerPoint로 제작
open PITCH_DECK.md
# 각 슬라이드 내용을 복사하여 PPT에 붙여넣기
```

---

#### 8. **GTM_STRATEGY.md** (15KB)
**대상**: 마케팅 팀, 영업 팀  
**용도**: Go-to-Market 전략 (0-24개월)

**내용**:
- ✅ 3단계 론칭 전략
  - Phase 1 (0-6개월): Closed Beta - 법무사 10개소, 개인 100명
  - Phase 2 (6-12개월): Public Launch - 개인 1,000명, MRR ₩10M
  - Phase 3 (12-24개월): Scale - 개인 20,000명, MRR ₩50M
- ✅ 9개 고객 획득 채널
  - 직접 영업, 콘텐츠 마케팅, 커뮤니티, 페이드 광고
  - 파트너십, 리퍼럴, TV/라디오, B2B 영업, 이벤트
- ✅ 마케팅 예산 (총 ₩300M)
- ✅ 성공 지표 (North Star Metrics)
- ✅ 리스크 및 대응

**사용법**:
```bash
# Phase별 전략 확인
grep -A 30 "Phase 1:" GTM_STRATEGY.md

# 마케팅 채널 참고
grep -A 20 "채널" GTM_STRATEGY.md
```

---

### 📊 분석 문서

#### 9. **qetta_deepdive_analysis_2025.md** (29KB)
**대상**: 경영진, 전략 기획팀  
**용도**: 최초 상세 분석 보고서

**내용**:
- ✅ Executive Summary (3.5/5.0 평가)
- ✅ 비즈니스 모델 분석
- ✅ 기술성 평가 (코드베이스 리뷰)
- ✅ 경쟁 분석 (SWOT)
- ✅ 개선 로드맵 (Phase 1-3)
- ✅ 즉시 실행 가능한 개선안 (코드 예시)
- ✅ 투자 유치 전략
- ✅ 위험 요소

**사용법**:
```bash
# 경영진 보고용
open qetta_deepdive_analysis_2025.md
```

---

#### 10. **MASTER_PROMPT_FOR_AGENT.md** (21KB) [구 버전]
**대상**: 참고용  
**용도**: v1.0 마스터 프롬프트 (교차 검수 이전)

**내용**:
- ⚠️ 일부 오류 포함 (Toss, KFTC API)
- ✅ 전체적인 구조는 유효

**사용법**:
```bash
# v2.0과 비교용
diff MASTER_PROMPT_FOR_AGENT.md MASTER_PROMPT_V2_FINAL.md
```

---

## 🚀 빠른 시작 가이드

### 1. 개발자 (처음 시작)
```bash
# 1단계: 환경 설정
open DEVELOPMENT_SETUP.md
# 가이드 따라 환경 설정 (30분)

# 2단계: 마스터 프롬프트 읽기
open MASTER_PROMPT_V2_FINAL.md
# Phase 1부터 순서대로 읽기

# 3단계: 체크리스트로 진행 상황 추적
open DEVELOPMENT_CHECKLIST.md
# 완료할 때마다 ✅ 표시

# 4단계: API 스펙 참고하며 개발
open API_SPECIFICATION.md

# 5단계: 에러 핸들링 구현
open ERROR_HANDLING_GUIDE.md
```

### 2. AI 에이전트 (코드 생성)
```bash
# 1단계: 마스터 프롬프트 주입
cat MASTER_PROMPT_V2_FINAL.md

# 2단계: API 스펙 참고
cat API_SPECIFICATION.md

# 3단계: 프론트엔드 컴포넌트 참고
cat FRONTEND_COMPONENTS.md

# 개발 시작:
"Please implement Phase 1.1 (Toss OAuth integration) according to MASTER_PROMPT_V2_FINAL.md"
```

### 3. 투자자/경영진
```bash
# 1단계: 피치덱 확인
open PITCH_DECK.md

# 2단계: 시장 진출 전략
open GTM_STRATEGY.md

# 3단계: 상세 분석 보고서
open qetta_deepdive_analysis_2025.md
```

---

## 📁 디렉토리 구조

```
qetta/
├── docs/
│   ├── MASTER_PROMPT_V2_FINAL.md      ← 최우선 읽기 ⭐⭐⭐
│   ├── API_SPECIFICATION.md
│   ├── FRONTEND_COMPONENTS.md
│   ├── DEVELOPMENT_SETUP.md
│   ├── DEVELOPMENT_CHECKLIST.md
│   ├── ERROR_HANDLING_GUIDE.md
│   ├── PITCH_DECK.md
│   ├── GTM_STRATEGY.md
│   ├── qetta_deepdive_analysis_2025.md
│   └── MASTER_PROMPT_FOR_AGENT.md (구 버전)
│
├── packages/
│   ├── shared/
│   ├── verifier/
│   └── debt-analyzer/         ← Phase 2에서 구현
│
├── services/
│   ├── api/                   ← Phase 1-3에서 구현
│   └── web/                   ← Phase 4에서 구현
│
└── README.md                  ← 이 파일
```

---

## ✅ 문서 검증 상태

| 문서 | 교차 검증 | API 일관성 | 코드 예시 | 완성도 |
|------|----------|-----------|---------|--------|
| MASTER_PROMPT_V2_FINAL.md | ✅ | ✅ | ✅ | 95% |
| API_SPECIFICATION.md | ✅ | ✅ | ✅ | 100% |
| FRONTEND_COMPONENTS.md | ✅ | ✅ | ✅ | 100% |
| DEVELOPMENT_SETUP.md | ✅ | N/A | ✅ | 100% |
| DEVELOPMENT_CHECKLIST.md | ✅ | N/A | N/A | 100% |
| ERROR_HANDLING_GUIDE.md | ✅ | ✅ | ✅ | 100% |
| PITCH_DECK.md | ✅ | N/A | N/A | 100% |
| GTM_STRATEGY.md | ✅ | N/A | N/A | 100% |

**총 완성도**: 98%

**미완성 섹션** (MASTER_PROMPT_V2_FINAL.md):
- Phase 2.3 시뮬레이션 엔진 (상세 구현 코드 추가 필요)
- Phase 3.1 PDF 생성기 (PDFKit 예시 추가 필요)
- Phase 4 프론트엔드 (일부 컴포넌트 코드 추가 필요)

→ 이 부분은 실제 개발 시 참고하여 구현하면 됩니다.

---

## 🔄 업데이트 히스토리

### v2.0 (2025-10-26) - 교차 검수 완료
- ✅ MASTER_PROMPT_V2_FINAL.md 생성 (46KB)
- ✅ Toss OAuth 플로우 수정 (Client Credentials → Authorization Code)
- ✅ KFTC 거래 내역 조회 수정 (GET → POST)
- ✅ 실제 코드 예시 추가 (TossAuthClient, KFTCClient)
- ✅ 에러 핸들링 상세화
- ✅ DEVELOPMENT_SETUP.md 추가
- ✅ ERROR_HANDLING_GUIDE.md 추가
- ✅ DEVELOPMENT_CHECKLIST.md 추가

### v1.0 (2025-10-26) - 초안
- ✅ MASTER_PROMPT_FOR_AGENT.md 생성
- ✅ API_SPECIFICATION.md 생성
- ✅ FRONTEND_COMPONENTS.md 생성
- ✅ PITCH_DECK.md 생성
- ✅ GTM_STRATEGY.md 생성
- ✅ qetta_deepdive_analysis_2025.md 생성

---

## 🎯 다음 단계

### 즉시 (오늘)
1. ✅ MASTER_PROMPT_V2_FINAL.md를 개발 에이전트에게 주입
2. ✅ DEVELOPMENT_SETUP.md 따라 환경 설정
3. ✅ Phase 1.1 (Toss 인증) 개발 시작

### 1주일 내
1. ✅ Phase 1 완료 (OAuth + 계좌 동기화)
2. ✅ Phase 2 시작 (채무 분석 엔진)

### 1개월 내
1. ✅ Phase 1-2 완료
2. ✅ Phase 3 시작 (신청서 생성)
3. ✅ Alpha 출시 준비

---

## 📞 문의

**프로젝트**: qetta  
**팀**: qetta 개발팀  
**이메일**: dev@qetta.io  
**문서 버전**: v2.0  
**최종 업데이트**: 2025-10-26

---

**중요**: 모든 문서는 실제 개발 과정에서 계속 업데이트됩니다. 최신 버전을 항상 참고하세요!
