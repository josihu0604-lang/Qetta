# 🎯 Hephaitos 모바일 버전 통합 계획

**작성일**: 2025-10-28  
**목표**: Pocket 템플릿 + Catalyst UI Kit을 활용한 모바일 최적화 버전 구축

---

## 📋 현재 상황 분석

### 사용 가능한 리소스

#### 1. Pocket Template (TypeScript)
- **위치**: `/home/user/webapp/pocket/tailwind-plus-pocket/pocket-ts/`
- **스택**: Next.js 15 + React 19 + TypeScript 5.8 + Tailwind CSS 4.1.11
- **특징**: 
  - 모바일 우선 디자인
  - 인증 레이아웃 (login, register)
  - 앱 데모 컴포넌트
  - 반응형 레이아웃

#### 2. Catalyst UI Kit
- **위치**: `/home/user/webapp/catalyst-ui-kit-new/catalyst-ui-kit/`
- **포함 컴포넌트**: 
  - Button, Input, Select, Textarea
  - Dialog, Dropdown, Listbox
  - Table, Pagination
  - Navbar, Sidebar
  - Alert, Badge
  - 등 30+ 컴포넌트

#### 3. Hephaitos (현재 프로젝트)
- **위치**: `/home/user/webapp/hephaitos/`
- **진행률**: 35% (Day 3-4 완료)
- **구현 완료**:
  - Backend OAuth (Toss, KFTC)
  - Frontend OAuth 컴포넌트
  - Idempotency, Metrics, Security Gates
  - Prisma 11 models

---

## 🎨 모바일 버전 설계

### 아키텍처 방향

```
hephaitos/
├── services/
│   ├── api/              # 기존 백엔드 (변경 없음)
│   ├── web/              # 데스크톱 웹 (기존)
│   └── mobile/           # 신규 모바일 앱 (Pocket 기반)
│       ├── src/
│       │   ├── app/
│       │   │   ├── (auth)/
│       │   │   │   ├── login/
│       │   │   │   └── register/
│       │   │   ├── (main)/
│       │   │   │   ├── dashboard/
│       │   │   │   ├── oauth/
│       │   │   │   ├── accounts/
│       │   │   │   ├── analysis/
│       │   │   │   └── policies/
│       │   │   └── layout.tsx
│       │   ├── components/
│       │   │   ├── catalyst/  # Catalyst UI 컴포넌트
│       │   │   ├── oauth/     # TossAuthButton, KFTCAuthButton
│       │   │   ├── mobile/    # 모바일 전용 컴포넌트
│       │   │   └── shared/    # 공통 컴포넌트
│       │   ├── hooks/
│       │   │   └── useOAuth.ts
│       │   └── styles/
│       │       └── globals.css
│       ├── package.json
│       └── tailwind.config.ts
```

---

## 🚀 구현 단계

### Phase 1: 모바일 서비스 초기 설정 (30분)
1. ✅ Pocket TypeScript 템플릿 복사
2. ✅ `services/mobile/` 디렉토리 생성
3. ✅ package.json 업데이트 (`@hephaitos/mobile`)
4. ✅ Turborepo 설정 업데이트
5. ✅ 의존성 설치

### Phase 2: Catalyst UI Kit 통합 (45분)
1. ✅ Catalyst 컴포넌트 복사 (`src/components/catalyst/`)
2. ✅ TypeScript 타입 정의 작성
3. ✅ Tailwind CSS 설정 통합
4. ✅ 테마 커스터마이징 (Hephaitos 브랜드)

### Phase 3: OAuth 컴포넌트 모바일 최적화 (30분)
1. ✅ `useOAuth` hook 공유 (`@hephaitos/shared`)
2. ✅ TossAuthButton 모바일 버전
3. ✅ KFTCAuthButton 모바일 버전
4. ✅ OAuth Success/Error 페이지 모바일 레이아웃

### Phase 4: 핵심 페이지 구현 (60분)
1. ✅ Login/Register 페이지 (Pocket 기반)
2. ✅ Dashboard (계좌 연결 상태)
3. ✅ OAuth 연결 페이지
4. ✅ 계좌 목록 페이지
5. ✅ 채무 분석 결과 페이지
6. ✅ 정책 추천 페이지

### Phase 5: 반응형 레이아웃 (30분)
1. ✅ 하단 네비게이션 바
2. ✅ 스와이프 제스처
3. ✅ Pull-to-refresh
4. ✅ 모바일 최적화 폼

### Phase 6: 테스트 및 최적화 (30분)
1. ✅ 다양한 화면 크기 테스트
2. ✅ Touch 이벤트 최적화
3. ✅ 로딩 성능 개선
4. ✅ PWA 설정 (선택 사항)

---

## 📱 모바일 UX 특징

### 1. 인증 플로우
```
Splash Screen
    ↓
Login/Register (Pocket 디자인)
    ↓
OAuth 연결 선택 (큰 터치 영역)
    ↓
Toss/KFTC 인증
    ↓
Dashboard
```

### 2. 주요 화면

#### Dashboard (홈)
- **상단**: 사용자 정보 + 알림
- **중앙**: 연결된 계좌 카드 (스와이프 가능)
- **하단**: "채무 분석 시작" CTA
- **네비게이션**: 하단 탭 바 (5개 메뉴)

#### OAuth 연결
- **카드 레이아웃**: Toss, KFTC 각각 큰 카드
- **브랜드 컬러**: 명확한 시각적 구분
- **상태 표시**: 연결됨/미연결 명확히 표시

#### 계좌 목록
- **리스트뷰**: 은행 로고 + 계좌번호 + 잔액
- **Pull-to-refresh**: 최신 데이터 갱신
- **스와이프 액션**: 상세보기/연결해제

#### 채무 분석 결과
- **프로그레스 바**: DTI, DSR 시각화
- **카드 레이아웃**: 위험도별 색상 구분
- **차트**: 간단한 막대/원형 차트

#### 정책 추천
- **스와이프 카드**: 추천 정책 카드
- **필터**: 신복위/새출발/개인회생
- **상세 모달**: 정책 상세 정보

---

## 🎨 디자인 시스템

### 색상 팔레트 (Hephaitos 브랜드)
```css
/* Primary Colors */
--primary-500: #0064FF;      /* Toss Blue */
--primary-600: #0052D9;
--primary-700: #004BB8;

/* Secondary Colors */
--secondary-500: #00A86B;    /* KFTC Green */
--secondary-600: #008C5A;
--secondary-700: #007649;

/* Neutral Colors */
--neutral-50: #F9FAFB;
--neutral-100: #F3F4F6;
--neutral-500: #6B7280;
--neutral-900: #111827;

/* Status Colors */
--success-500: #10B981;
--warning-500: #F59E0B;
--danger-500: #EF4444;
```

### 타이포그래피
```css
/* Headings */
h1: 32px / 40px (mobile)
h2: 24px / 32px
h3: 20px / 28px
h4: 18px / 26px

/* Body */
body-lg: 18px / 28px
body: 16px / 24px
body-sm: 14px / 20px

/* Weights */
bold: 700
semibold: 600
medium: 500
regular: 400
```

### 간격 시스템 (Tailwind 기반)
```
xs: 4px
sm: 8px
md: 16px
lg: 24px
xl: 32px
2xl: 48px
```

---

## 🔧 기술 스택

### Frontend (Mobile)
- **Framework**: Next.js 15 (App Router)
- **UI Library**: React 19
- **Language**: TypeScript 5.8
- **Styling**: Tailwind CSS 4.1.11
- **Components**: Catalyst UI Kit + Headless UI
- **Animations**: Framer Motion
- **State**: React Query + Zustand
- **Forms**: React Hook Form + Zod

### Backend (공유)
- **API**: Fastify 5.0 (기존)
- **Database**: PostgreSQL + Prisma
- **Cache**: Redis
- **Queue**: BullMQ

---

## 📦 의존성 추가

### services/mobile/package.json
```json
{
  "name": "@hephaitos/mobile",
  "dependencies": {
    "@hephaitos/shared": "workspace:*",
    "@headlessui/react": "^2.2.6",
    "@tanstack/react-query": "^5.62.7",
    "@tailwindcss/forms": "^0.5.10",
    "clsx": "^2.1.1",
    "framer-motion": "^12.23.11",
    "next": "^15.1.5",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "react-hook-form": "^7.54.2",
    "tailwindcss": "^4.1.11",
    "use-debounce": "^10.0.5",
    "zod": "^3.24.1",
    "zustand": "^5.0.6"
  }
}
```

---

## 🎯 성공 기준

### 기능 완성도
- ✅ 모든 핵심 페이지 구현
- ✅ OAuth 플로우 정상 작동
- ✅ 반응형 디자인 (320px ~ 768px)
- ✅ 접근성 준수 (WCAG 2.1 AA)

### 성능 목표
- **FCP**: < 1.5초
- **LCP**: < 2.5초
- **TTI**: < 3.0초
- **CLS**: < 0.1

### 브라우저 지원
- **iOS Safari**: 15+
- **Chrome Mobile**: 100+
- **Samsung Internet**: 15+

---

## 📅 일정

### 총 소요 시간: ~3.5시간

- **Phase 1**: 30분 (설정)
- **Phase 2**: 45분 (Catalyst 통합)
- **Phase 3**: 30분 (OAuth 모바일)
- **Phase 4**: 60분 (핵심 페이지)
- **Phase 5**: 30분 (반응형)
- **Phase 6**: 30분 (테스트)

### 우선순위
1. **High**: Phase 1-3 (기본 기능)
2. **Medium**: Phase 4 (핵심 페이지)
3. **Low**: Phase 5-6 (최적화)

---

## 🚀 다음 단계

### 즉시 시작
1. ✅ Pocket 템플릿 복사
2. ✅ services/mobile 디렉토리 생성
3. ✅ package.json 설정
4. ✅ Turborepo 업데이트

### 단계별 진행
- **현재**: Phase 1 시작 준비
- **목표**: 오늘 Phase 1-3 완료
- **최종**: 모바일 베타 버전 배포

---

**문서 버전**: 1.0  
**작성자**: Hephaitos Development Team  
**다음 업데이트**: Phase 1 완료 후
