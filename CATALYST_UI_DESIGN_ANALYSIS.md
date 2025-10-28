# 🎨 Catalyst UI Kit - 나노 단위 디자인 분석

## 📋 프로젝트 개요

**프레임워크**: Next.js 15 (React 19)  
**스타일링**: Tailwind CSS 4.1.13  
**UI 라이브러리**: Headless UI 2.2.6  
**애니메이션**: Motion (Framer Motion) 12.23.11  
**아이콘**: Heroicons 2.2.0  
**타입**: JavaScript/TypeScript 지원

---

## 🏗️ 아키텍처 구조

### 디렉토리 구조
```
catalyst-ui-kit/
├── demo/
│   ├── javascript/          # JavaScript 데모
│   │   ├── src/
│   │   │   ├── app/         # Next.js App Router
│   │   │   ├── components/  # 재사용 가능한 UI 컴포넌트
│   │   │   ├── data.js      # Mock 데이터
│   │   │   └── styles/      # 전역 스타일
│   │   └── public/          # 정적 파일 (이미지, SVG)
│   └── typescript/          # TypeScript 데모
├── javascript/              # JavaScript 컴포넌트 소스
└── typescript/              # TypeScript 컴포넌트 소스
```

---

## 🎨 디자인 시스템 분석

### 1️⃣ 색상 팔레트 (Color System)

#### 기본 색상 변수
```css
--color-zinc-[50-950]     # 주요 UI 요소
--color-white/black       # 기본 배경/텍스트
```

#### 다크 모드 지원
- 모든 컴포넌트는 `dark:` 프리픽스를 통한 다크 모드 변형 포함
- 배경: `dark:bg-zinc-900`, `dark:bg-white/5`
- 텍스트: `dark:text-white`, `dark:text-zinc-400`
- 보더: `dark:border-white/10`

#### 의미론적 색상 (22가지 컬러 팔레트)
```javascript
colors = {
  // Neutral
  'dark/zinc', 'light', 'dark/white', 'dark', 'white', 'zinc',
  
  // Primary
  'indigo', 'blue', 'sky', 'cyan',
  
  // Success/Info
  'green', 'emerald', 'teal', 'lime',
  
  // Warning
  'yellow', 'amber', 'orange',
  
  // Danger
  'red', 'rose', 'pink',
  
  // Special
  'violet', 'purple', 'fuchsia'
}
```

---

### 2️⃣ 타이포그래피 (Typography)

#### 폰트 패밀리
```css
--font-sans: Inter, sans-serif
--font-sans--font-feature-settings: 'cv11'  /* OpenType features */
```

#### 텍스트 크기 시스템
```
text-xs/5    → 12px / line-height: 1.25rem
text-sm/6    → 14px / line-height: 1.5rem
text-base/6  → 16px / line-height: 1.5rem
text-lg/6    → 18px / line-height: 1.5rem
```

#### 반응형 타이포그래피
```jsx
// 모바일: text-base/6, 데스크톱: text-sm/6
className="text-base/6 sm:text-sm/6"
```

---

### 3️⃣ 간격 시스템 (Spacing)

#### CSS 변수 기반 Gutter
```css
--gutter: --spacing(8)     /* 기본 32px */
--spacing(2)    → 8px
--spacing(3)    → 12px
--spacing(4)    → 16px
--spacing(6)    → 24px
--spacing(8)    → 32px
--spacing(10)   → 40px
```

#### 패딩 계산 패턴
```jsx
// Border를 고려한 정확한 패딩
px-[calc(--spacing(3.5)-1px)]  // 13px (14px - 1px border)
py-[calc(--spacing(2.5)-1px)]  // 9px (10px - 1px border)
```

---

### 4️⃣ 모서리 반경 (Border Radius)

```css
--radius-lg: 0.75rem      /* 12px - 대부분의 컴포넌트 */
--radius-md: 0.5rem       /* 8px - 작은 요소 */
--avatar-radius: 20%      /* 아바타 */

rounded-lg     → 12px
rounded-md     → 8px
rounded-full   → 50% (원형)
rounded-xl     → 16px (드롭다운)
rounded-2xl    → 24px (다이얼로그)
rounded-3xl    → 32px (모바일 다이얼로그 상단)
```

---

## 🧩 컴포넌트 나노 분석

### 🔘 Button Component

#### 구조 분해
```jsx
<Button>
  <TouchTarget>    {/* 터치 영역 확장 (44x44px) */}
    {children}
  </TouchTarget>
</Button>
```

#### 스타일 레이어링 (3-Layer System)
```
1. Base Layer (border + base styles)
   - border-transparent
   - rounded-lg
   - relative isolate

2. Background Layer (::before pseudo-element)
   - 실제 배경 색상
   - 그림자 효과
   - before:absolute before:inset-0 before:-z-10

3. Overlay Layer (::after pseudo-element)
   - 호버 오버레이
   - 내부 하이라이트 그림자
   - after:absolute after:inset-0 after:-z-10
```

#### 버튼 변형 (3가지)
```jsx
// 1. Solid (기본)
<Button color="blue">Save</Button>

// 2. Outline
<Button outline>Cancel</Button>

// 3. Plain
<Button plain>Skip</Button>
```

#### 아이콘 처리
```css
/* 아이콘 자동 스타일링 (data-slot 기반) */
*:data-[slot=icon]:size-5           /* 20px */
*:data-[slot=icon]:shrink-0         /* 축소 방지 */
*:data-[slot=icon]:self-center      /* 수직 중앙 정렬 */
*:data-[slot=icon]:text-(--btn-icon) /* 동적 색상 */
```

#### 터치 타겟 (접근성)
```jsx
// 터치 디바이스에서 최소 44x44px 영역 확보
<span className="
  absolute top-1/2 left-1/2 
  size-[max(100%,2.75rem)]     /* 44px */
  -translate-x-1/2 -translate-y-1/2 
  pointer-fine:hidden           /* 마우스 환경에서는 숨김 */
" />
```

---

### 📝 Input Component

#### 구조
```jsx
<span data-slot="control">   {/* 래퍼 */}
  <Headless.Input>           {/* 실제 입력 필드 */}
</span>
```

#### 포커스 링 시스템
```css
/* 외부 포커스 링 (::after) */
after:absolute after:inset-0 
after:rounded-lg 
after:ring-transparent
sm:focus-within:after:ring-2 
sm:focus-within:after:ring-blue-500
```

#### 아이콘 통합 (InputGroup)
```jsx
<InputGroup>
  <MagnifyingGlassIcon />  {/* 왼쪽 아이콘 */}
  <Input />
  <XMarkIcon />            {/* 오른쪽 아이콘 */}
</InputGroup>

// 자동 패딩 조정
has-[[data-slot=icon]:first-child]:[&_input]:pl-10  /* 아이콘 있을 때 */
```

#### 날짜 입력 최적화
```css
/* 브라우저 기본 날짜 피커 스타일 제거 */
[&::-webkit-datetime-edit-fields-wrapper]:p-0
[&::-webkit-date-and-time-value]:min-h-[1.5em]
```

#### 상태별 스타일
```
Default:      border-zinc-950/10
Hover:        data-hover:border-zinc-950/20
Focus:        ring-2 ring-blue-500 (outline 없음)
Invalid:      data-invalid:border-red-500
Disabled:     data-disabled:opacity-50
```

---

### 👤 Avatar Component

#### 크기 시스템
```jsx
// 기본 크기는 부모에서 설정
className="size-6"   // 24px
className="size-7"   // 28px
className="size-12"  // 48px
```

#### 이니셜 렌더링 (SVG)
```jsx
<svg viewBox="0 0 100 100" className="
  size-full 
  fill-current 
  text-[48px]        /* 글자 크기 */
  font-medium 
  uppercase
">
  <text 
    x="50%" y="50%" 
    textAnchor="middle" 
    alignmentBaseline="middle"
  >
    {initials}
  </text>
</svg>
```

#### 모양 변형
```jsx
// 원형 (기본)
<Avatar src={url} />

// 사각형 (rounded 20%)
<Avatar src={url} square />
```

#### 아웃라인 (접근성)
```css
outline -outline-offset-1 
outline-black/10 
dark:outline-white/10
```

---

### 🏷️ Badge Component

#### 색상 시스템 (17가지)
```jsx
const colors = {
  red: 'bg-red-500/15 text-red-700 ...',
  zinc: 'bg-zinc-600/10 text-zinc-700 ...',
  // ... 15가지 더
}
```

#### 알파 채널 활용
```
배경: bg-{color}-500/15      (15% 투명도)
텍스트: text-{color}-700       (진한 색상)
호버: bg-{color}-500/25       (25% 투명도)
```

#### 강제 색상 모드 (접근성)
```css
forced-colors:outline  /* 고대비 모드에서 아웃라인 표시 */
```

---

### 📊 Table Component

#### Context API 활용
```jsx
<TableContext.Provider value={{ bleed, dense, grid, striped }}>
  <Table>...</Table>
</TableContext.Provider>
```

#### 반응형 오버플로우
```jsx
<div className="overflow-x-auto whitespace-nowrap">
  <table className="min-w-full">
```

#### 클릭 가능한 행 (Row Link)
```jsx
<TableRow href="/order/123">
  <TableCell>...</TableCell>
</TableRow>

// 내부 구현
<Link 
  data-row-link 
  className="absolute inset-0"  /* 전체 행 클릭 가능 */
  tabIndex={첫번째셀 ? 0 : -1}    /* 키보드 접근성 */
/>
```

#### 스트라이프 패턴
```css
even:bg-zinc-950/2.5           /* 짝수 행 배경 */
dark:even:bg-white/2.5         /* 다크 모드 */
```

#### Grid 모드 (세로 구분선)
```css
border-l border-l-zinc-950/5 
first:border-l-0               /* 첫 번째 셀은 보더 없음 */
```

---

### 📱 Dropdown Component

#### Anchor 포지셔닝 (Headless UI 2.0)
```jsx
<DropdownMenu anchor="bottom">
  {/* 
    자동으로 트리거 요소 하단에 위치 
    뷰포트 넘어가면 자동 조정
  */}
</DropdownMenu>
```

#### Subgrid 레이아웃 (최신 CSS)
```css
/* 부모 그리드 */
grid-cols-[auto_1fr_1.5rem_0.5rem_auto]

/* 자식 아이템 */
supports-[grid-template-columns:subgrid]:grid-cols-subgrid
```

#### 블러 배경 (Glass Morphism)
```css
bg-white/75 
backdrop-blur-xl 
dark:bg-zinc-800/75
```

#### 키보드 단축키 표시
```jsx
<DropdownShortcut keys="⌘K" />
<DropdownShortcut keys={['⌘', 'K']} />

// 렌더링
<kbd>⌘</kbd><kbd>K</kbd>
```

---

### 🪟 Dialog Component

#### 크기 프리셋 (8가지)
```jsx
<Dialog size="xs" />   // sm:max-w-xs (320px)
<Dialog size="sm" />   // sm:max-w-sm (384px)
<Dialog size="md" />   // sm:max-w-md (448px)
<Dialog size="lg" />   // sm:max-w-lg (512px) - 기본
<Dialog size="xl" />   // sm:max-w-xl (576px)
<Dialog size="2xl" />  // sm:max-w-2xl (672px)
<Dialog size="3xl" />  // sm:max-w-3xl (768px)
<Dialog size="4xl" />  // sm:max-w-4xl (896px)
```

#### 레이아웃 그리드
```css
/* 수직 중앙 정렬 */
grid-rows-[1fr_auto_3fr]  /* 상단 여백 : 다이얼로그 : 하단 여백 (1:auto:3 비율) */
justify-items-center       /* 수평 중앙 */
```

#### 모바일 최적화
```css
/* 모바일: 하단 고정 + 상단 둥근 모서리 */
row-start-2
rounded-t-3xl             /* 상단만 32px 라운드 */

/* 데스크톱: 중앙 + 전체 둥근 모서리 */
sm:rounded-2xl            /* 전체 24px 라운드 */
```

#### 트랜지션 (등장/퇴장 애니메이션)
```css
/* 등장 */
duration-100 ease-out
data-closed:translate-y-12 data-closed:opacity-0

/* 퇴장 */
ease-in
data-closed:data-enter:scale-95  /* 데스크톱만 스케일 효과 */
```

---

### 🧭 Navbar Component

#### 현재 페이지 인디케이터 (Motion)
```jsx
{current && (
  <motion.span 
    layoutId="current-indicator"  // 자동 애니메이션
    className="
      absolute inset-x-2 -bottom-2.5 
      h-0.5 rounded-full 
      bg-zinc-950 dark:bg-white
    "
  />
)}
```

#### LayoutGroup (페이지 전환 애니메이션)
```jsx
<LayoutGroup id={uniqueId}>
  {/* 같은 그룹 내 요소들끼리 자동 모핑 */}
  <NavbarItem current>Home</NavbarItem>
  <NavbarItem>About</NavbarItem>
</LayoutGroup>
```

#### 아이콘 우선순위
```css
/* 선행 아이콘 */
*:data-[slot=icon]:size-6

/* 후행 아이콘 (드롭다운 화살표 등) */
*:not-nth-2:last:data-[slot=icon]:ml-auto
*:not-nth-2:last:data-[slot=icon]:size-5
```

---

### 📂 Sidebar Component

#### 스크롤 영역
```jsx
<SidebarBody className="
  flex-1                  /* 가능한 모든 높이 차지 */
  overflow-y-auto         /* 내용 많으면 스크롤 */
">
```

#### 현재 페이지 인디케이터 (왼쪽 바)
```jsx
<motion.span 
  layoutId="current-indicator"
  className="
    absolute inset-y-2 -left-4  /* 사이드바 밖으로 4px */
    w-0.5 rounded-full           /* 2px 두께 */
    bg-zinc-950 dark:bg-white
  "
/>
```

#### 구분선
```jsx
<SidebarDivider className="
  my-4                          /* 상하 16px 간격 */
  border-t border-zinc-950/5 
  lg:-mx-4                      /* 큰 화면에서 좌우 확장 */
" />
```

---

## 🎯 디자인 패턴

### 1️⃣ Data Slot System

모든 아이콘, 아바타, 레이블은 `data-slot` 속성으로 식별:

```jsx
<Button>
  <MagnifyingGlassIcon data-slot="icon" />
  <span data-slot="label">Search</span>
</Button>
```

CSS에서 자동 스타일링:
```css
*:data-[slot=icon]:size-5
*:data-[slot=icon]:text-zinc-500
*:data-[slot=label]:truncate
```

**장점**: 
- 명시적 클래스 불필요
- 일관된 스타일링
- 리팩토링 용이

---

### 2️⃣ Compound Components (복합 컴포넌트)

```jsx
<Table>
  <TableHead>
    <TableRow>
      <TableHeader>Name</TableHeader>
    </TableRow>
  </TableHead>
  <TableBody>
    <TableRow>
      <TableCell>John</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

Context API로 상태 공유:
```jsx
const TableContext = createContext({ dense, striped })
// 자식 컴포넌트들이 자동으로 부모 설정 상속
```

---

### 3️⃣ Polymorphic Components (다형성 컴포넌트)

동일 컴포넌트가 여러 HTML 요소로 렌더링:

```jsx
// Link로 렌더링
<Button href="/profile">Profile</Button>

// Button 요소로 렌더링
<Button onClick={handleClick}>Save</Button>

// 내부 구현
typeof props.href === 'string' 
  ? <Link {...props} /> 
  : <Headless.Button {...props} />
```

---

### 4️⃣ CSS Variables for Theming

동적 색상 시스템:

```css
[--btn-bg:var(--color-blue-600)]
[--btn-icon:var(--color-blue-400)]
[--btn-hover-overlay:var(--color-white)]/10

/* 사용 */
bg-(--btn-bg)
text-(--btn-icon)
data-hover:bg-(--btn-hover-overlay)
```

---

### 5️⃣ Forced Colors Mode (접근성)

고대비 모드 자동 대응:

```css
forced-colors:outline                  /* 아웃라인 표시 */
forced-colors:[--btn-icon:ButtonText]  /* 시스템 색상 사용 */
forced-colors:bg-[CanvasText]          /* 캔버스 텍스트 색상 */
```

---

## 🔍 반응형 전략

### Breakpoint 시스템
```
sm:   640px  (모바일 → 태블릿)
md:   768px  (태블릿)
lg:   1024px (데스크톱)
xl:   1280px (대형 데스크톱)
2xl:  1536px (초대형)
```

### Mobile-First 접근
```jsx
// 기본(모바일)
px-4 py-3 text-base

// 데스크톱
sm:px-3 sm:py-2 sm:text-sm
```

### 조건부 레이아웃
```jsx
// 모바일: 세로 배치
className="flex flex-col"

// 데스크톱: 가로 배치
sm:flex-row
```

---

## 🎨 애니메이션 시스템

### Framer Motion 통합

#### Layout Animations
```jsx
<motion.span layoutId="indicator" />
// 자동으로 위치/크기 변화 애니메이션
```

#### Shared Layout
```jsx
<LayoutGroup id="tabs">
  <Tab>Home</Tab>
  <Tab current>About</Tab>  // 인디케이터 자동 이동
</LayoutGroup>
```

### Tailwind Transitions

#### Duration
```
duration-75    → 75ms
duration-100   → 100ms
duration-150   → 150ms
duration-200   → 200ms
duration-300   → 300ms
```

#### Easing
```
ease-in        → cubic-bezier(0.4, 0, 1, 1)
ease-out       → cubic-bezier(0, 0, 0.2, 1)
ease-in-out    → cubic-bezier(0.4, 0, 0.2, 1)
```

#### Data States
```css
data-enter:ease-out     /* 등장 시 */
data-leave:ease-in      /* 퇴장 시 */
data-closed:opacity-0   /* 닫힌 상태 */
```

---

## 🧪 상태 관리 패턴

### Headless UI Data Attributes

```jsx
data-active     // 클릭 중
data-hover      // 호버 중
data-focus      // 포커스 중
data-disabled   // 비활성화
data-invalid    // 유효성 검사 실패
data-current    // 현재 선택됨
data-closed     // 닫힘
```

사용 예:
```css
data-hover:bg-zinc-100
data-active:bg-zinc-200
data-disabled:opacity-50
```

---

## 📐 레이아웃 시스템

### Container Queries (미래 대비)
```jsx
// 부모 요소 크기에 따라 반응
@container (min-width: 400px) {
  .item { ... }
}
```

### Grid Auto-Placement
```jsx
// Stats 그리드
className="grid gap-8 sm:grid-cols-2 xl:grid-cols-4"
// 모바일: 1열, 태블릿: 2열, 데스크톱: 4열
```

### Flexbox 우선순위
```jsx
// 왼쪽: 고정, 가운데: 확장, 오른쪽: 고정
<div className="flex">
  <div>Logo</div>
  <div className="flex-1">Search</div>  {/* 남은 공간 차지 */}
  <div>Profile</div>
</div>
```

---

## 🔐 접근성 (A11y)

### ARIA 속성 자동 처리

Headless UI가 자동 추가:
```html
<button
  role="button"
  aria-expanded="true"
  aria-controls="menu-1"
  aria-haspopup="true"
>
```

### 키보드 네비게이션

- **Tab**: 포커스 이동
- **Enter/Space**: 활성화
- **Escape**: 다이얼로그/드롭다운 닫기
- **Arrow Keys**: 메뉴 항목 이동

### 스크린 리더 지원

```jsx
// 숨겨진 레이블
<span className="sr-only">Close</span>

// aria-label 자동 설정
<Link aria-label={title} />

// aria-hidden으로 장식 요소 숨김
<div aria-hidden="true" />
```

---

## 🎭 다크 모드 구현

### 전략

#### 클래스 기반 토글
```html
<html class="dark">
  <!-- 모든 dark: 변형 활성화 -->
</html>
```

#### CSS 변수 오버라이드
```css
:root {
  --color-background: white;
}

.dark {
  --color-background: #0f172a;
}
```

#### 투명도 활용
```css
/* 라이트 모드 */
bg-zinc-950/10        /* 검정 10% */

/* 다크 모드 */
dark:bg-white/10      /* 흰색 10% */
```

---

## 📦 데이터 구조

### Mock Data 스키마

#### Order
```javascript
{
  id: 3000,
  url: '/orders/3000',
  date: 'May 9, 2024',
  amount: {
    usd: '$80.00',
    cad: '$109.47',
    fee: '$3.28',
    net: '$106.19'
  },
  payment: {
    transactionId: 'ch_...',
    card: {
      number: '1254',  // 마지막 4자리
      type: 'American Express',
      expiry: '01 / 2025'
    }
  },
  customer: {
    name: 'Leslie Alexander',
    email: 'leslie.alexander@example.com',
    address: '123 Main St. Toronto, ON',
    country: 'Canada',
    countryFlagUrl: '/flags/ca.svg'
  },
  event: { /* Event 객체 */ }
}
```

#### Event
```javascript
{
  id: 1000,
  name: 'Bear Hug: Live in Concert',
  url: '/events/1000',
  date: 'May 20, 2024',
  time: '10 PM',
  location: 'Harmony Theater, Winnipeg, MB',
  totalRevenue: '$102,552',
  totalRevenueChange: '+3.2%',
  ticketsAvailable: 500,
  ticketsSold: 350,
  ticketsSoldChange: '+8.1%',
  pageViews: '24,300',
  pageViewsChange: '-0.75%',
  status: 'On Sale',
  imgUrl: '/events/bear-hug.jpg',
  thumbUrl: '/events/bear-hug-thumb.jpg'
}
```

---

## 🔧 유틸리티 함수

### clsx 패턴
```jsx
import clsx from 'clsx'

clsx(
  'base-class',
  condition && 'conditional-class',
  {
    'class-a': conditionA,
    'class-b': conditionB
  },
  props.className  // 외부 클래스 병합
)
```

---

## 🚀 성능 최적화

### 1. 코드 스플리팅
```jsx
// App Router 자동 코드 스플리팅
app/
  (app)/
    page.jsx         → /
    orders/page.jsx  → /orders
    events/page.jsx  → /events
```

### 2. 이미지 최적화
```
/public/events/
  bear-hug.jpg        # 원본 (상세 페이지)
  bear-hug-thumb.jpg  # 썸네일 (목록)
  bear-hug.webp       # WebP (최신 브라우저)
```

### 3. CSS 최적화
- Tailwind CSS 4.0 JIT 모드
- 사용되지 않는 스타일 자동 제거
- 프로덕션 빌드 시 최소화

---

## 📱 컴포넌트 사용 예제

### 버튼 조합
```jsx
import { Button } from '@/components/button'
import { PlusIcon } from '@heroicons/react/20/solid'

// 기본 버튼
<Button>Click me</Button>

// 색상 변형
<Button color="blue">Save</Button>
<Button color="red">Delete</Button>

// 아웃라인
<Button outline>Cancel</Button>

// 아이콘 포함
<Button>
  <PlusIcon />
  Add Event
</Button>

// 링크 버튼
<Button href="/events/new">Create Event</Button>
```

### 폼 구성
```jsx
import { Input, InputGroup } from '@/components/input'
import { Select } from '@/components/select'
import { Textarea } from '@/components/textarea'
import { Checkbox } from '@/components/checkbox'
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid'

<form>
  {/* 검색 입력 */}
  <InputGroup>
    <MagnifyingGlassIcon />
    <Input name="search" placeholder="Search..." />
  </InputGroup>

  {/* 선택 */}
  <Select name="country">
    <option>Canada</option>
    <option>United States</option>
  </Select>

  {/* 긴 텍스트 */}
  <Textarea name="description" rows={4} />

  {/* 체크박스 */}
  <Checkbox name="agree">
    I agree to the terms
  </Checkbox>

  {/* 제출 */}
  <Button type="submit" color="blue">
    Submit
  </Button>
</form>
```

### 테이블 구성
```jsx
import { 
  Table, TableHead, TableBody, 
  TableRow, TableHeader, TableCell 
} from '@/components/table'
import { Badge } from '@/components/badge'

<Table striped>
  <TableHead>
    <TableRow>
      <TableHeader>Order</TableHeader>
      <TableHeader>Status</TableHeader>
      <TableHeader>Amount</TableHeader>
    </TableRow>
  </TableHead>
  <TableBody>
    <TableRow href="/orders/1">
      <TableCell>#3000</TableCell>
      <TableCell>
        <Badge color="green">Paid</Badge>
      </TableCell>
      <TableCell>$80.00</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

### 다이얼로그 구성
```jsx
import { 
  Dialog, DialogTitle, DialogDescription, 
  DialogBody, DialogActions 
} from '@/components/dialog'
import { Button } from '@/components/button'

<Dialog open={isOpen} onClose={setIsOpen}>
  <DialogTitle>Confirm deletion</DialogTitle>
  <DialogDescription>
    Are you sure you want to delete this item? 
    This action cannot be undone.
  </DialogDescription>
  <DialogBody>
    {/* 추가 내용 */}
  </DialogBody>
  <DialogActions>
    <Button outline onClick={() => setIsOpen(false)}>
      Cancel
    </Button>
    <Button color="red" onClick={handleDelete}>
      Delete
    </Button>
  </DialogActions>
</Dialog>
```

---

## 🎨 컬러 팔레트 활용 가이드

### 용도별 색상 선택

#### ✅ 성공/완료
```jsx
<Badge color="green">Completed</Badge>
<Button color="green">Confirm</Button>
```

#### ⚠️ 경고
```jsx
<Badge color="yellow">Pending</Badge>
<Button color="amber">Review</Button>
```

#### ❌ 오류/삭제
```jsx
<Badge color="red">Failed</Badge>
<Button color="red">Delete</Button>
```

#### ℹ️ 정보
```jsx
<Badge color="blue">Info</Badge>
<Button color="sky">Learn More</Button>
```

#### 🎭 중립
```jsx
<Badge color="zinc">Draft</Badge>
<Button color="dark/zinc">Default</Button>
```

---

## 🔬 고급 CSS 기법

### 1. Subgrid (최신 CSS)
```css
/* 부모 그리드 정의 */
.dropdown-menu {
  display: grid;
  grid-template-columns: auto 1fr 1.5rem 0.5rem auto;
}

/* 자식이 부모 그리드 상속 */
.dropdown-item {
  grid-column: span 5;
  display: grid;
  grid-template-columns: subgrid;  /* 부모와 동일한 열 구조 */
}
```

**장점**: 모든 아이템의 열이 자동 정렬

### 2. Container Queries (준비 중)
```css
@container (min-width: 400px) {
  .stat {
    font-size: 1.5rem;
  }
}
```

### 3. CSS Layers (@layer)
```css
@layer base, components, utilities;

@layer base {
  /* 기본 스타일 */
}

@layer components {
  /* 컴포넌트 스타일 */
}
```

### 4. 동적 Viewport Units
```css
height: 100dvh;  /* Dynamic Viewport Height */
/* 모바일 브라우저 주소창 고려 */
```

---

## 📊 성능 메트릭

### Lighthouse 목표
- **Performance**: 95+
- **Accessibility**: 100
- **Best Practices**: 95+
- **SEO**: 100

### 최적화 체크리스트
- ✅ Tree-shaking (사용 안 하는 코드 제거)
- ✅ Code splitting (페이지별 분할)
- ✅ Image optimization (WebP, 썸네일)
- ✅ CSS purging (미사용 스타일 제거)
- ✅ Lazy loading (필요 시 로딩)
- ✅ Prefetching (링크 사전 로딩)

---

## 🛠️ 개발 도구

### ESLint 규칙
```json
{
  "extends": ["next/core-web-vitals"],
  "rules": {
    "react/prop-types": "off",  // TypeScript 사용 시
    "react/react-in-jsx-scope": "off"  // Next.js 자동 import
  }
}
```

### Prettier 설정
```json
{
  "semi": false,
  "singleQuote": true,
  "printWidth": 120,
  "tabWidth": 2,
  "plugins": [
    "prettier-plugin-organize-imports",
    "prettier-plugin-tailwindcss"
  ]
}
```

---

## 🎓 학습 포인트

### 초보자를 위한 핵심 개념

1. **Compound Components**: 서로 협력하는 컴포넌트 그룹
2. **Render Props**: 함수를 통한 렌더링 제어
3. **Headless UI**: 스타일 없는 접근성 컴포넌트
4. **CSS-in-JS의 대안**: Tailwind의 유틸리티 우선 접근
5. **Context API**: 전역 상태 없는 상태 공유
6. **Polymorphic Components**: 하나의 컴포넌트, 여러 HTML 요소

---

## 🚀 확장 가능성

### 추가 가능한 컴포넌트
- **DatePicker**: 달력 선택기
- **TimePicker**: 시간 선택기
- **ColorPicker**: 색상 선택기
- **FileUpload**: 파일 업로드
- **Tooltip**: 툴팁
- **Toast**: 알림 메시지
- **Tabs**: 탭 네비게이션
- **Accordion**: 아코디언
- **Slider**: 슬라이더
- **Progress**: 진행 표시줄

### 통합 가능 라이브러리
- **React Hook Form**: 폼 관리
- **Zod**: 스키마 검증
- **TanStack Query**: 서버 상태 관리
- **Zustand**: 클라이언트 상태 관리
- **Day.js**: 날짜 처리
- **Chart.js**: 차트 시각화

---

## 📝 베스트 프랙티스

### 1. 컴포넌트 작성
```jsx
// ✅ 좋음
export function MyComponent({ 
  variant = 'primary',  // 기본값
  className,            // 외부 스타일 허용
  children,
  ...props              // 나머지 props 전달
}) {
  return (
    <div 
      {...props}
      className={clsx('base-class', variantStyles[variant], className)}
    >
      {children}
    </div>
  )
}

// ❌ 나쁨
export function MyComponent(props) {
  return <div className="hard-coded-only">{props.children}</div>
}
```

### 2. 스타일 조직화
```jsx
// ✅ 좋음 (스타일 분리)
const styles = {
  base: 'rounded-lg p-4',
  variants: {
    primary: 'bg-blue-500 text-white',
    secondary: 'bg-gray-200 text-gray-900'
  }
}

// ❌ 나쁨 (하드코딩)
<div className="rounded-lg p-4 bg-blue-500 text-white">
```

### 3. 접근성 우선
```jsx
// ✅ 좋음
<button aria-label="Close dialog" onClick={onClose}>
  <XMarkIcon aria-hidden="true" />
</button>

// ❌ 나쁨
<div onClick={onClose}>
  <XMarkIcon />
</div>
```

---

## 🎯 결론

**Catalyst UI Kit**는 현대적인 웹 애플리케이션을 위한 **완벽한 디자인 시스템**입니다.

### 핵심 강점

1. ✅ **접근성 우선** (WCAG 2.1 AA 준수)
2. ✅ **반응형 설계** (모바일 → 데스크톱)
3. ✅ **다크 모드 완벽 지원**
4. ✅ **타입 안전성** (TypeScript)
5. ✅ **성능 최적화** (Tree-shaking, Code splitting)
6. ✅ **확장 가능** (컴포넌트 조합 자유)
7. ✅ **개발자 경험** (직관적 API)
8. ✅ **프로덕션 준비** (검증된 패턴)

### 적합한 프로젝트
- 대시보드 / Admin 패널
- SaaS 애플리케이션
- 내부 도구
- 데이터 중심 애플리케이션
- B2B 플랫폼

---

**작성일**: 2025-10-28  
**버전**: Catalyst UI Kit 1.0  
**분석자**: GenSpark AI Developer
