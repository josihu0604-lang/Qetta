# 🚀 Hephaitos 앞으로의 작업 설계

**작성일**: 2025-10-28 21:30 UTC  
**현재 진행도**: 40%  
**목표 진행도**: 100%  
**예상 소요 시간**: 11-16시간 (4-7일)

---

## 📊 전체 로드맵 개요

```
현재: 40%  [████████████████░░░░░░░░░░░░░░░░░░░░░░░]
목표: 100% [████████████████████████████████████████]

Phase 1: ✅ 완료 (0% → 40%)
Phase 2: ⏳ 대기 (40% → 50%) — 2-3시간
Phase 3: ⏳ 대기 (50% → 75%) — 4-6시간
Phase 4: ⏳ 대기 (75% → 90%) — 3-4시간
Phase 5: ⏳ 대기 (90% → 100%) — 2-3시간
```

---

## 🎯 Phase 2: Catalyst UI Kit 통합 (40% → 50%)

**목표**: 모바일 서비스에 30+ UI 컴포넌트 통합  
**예상 소요**: 2-3시간  
**우선순위**: ⭐⭐⭐⭐⭐ (높음)

### 작업 1: Catalyst 컴포넌트 복사 (45분)

**입력**:
```bash
원본 경로: /home/user/webapp/catalyst-ui-kit-new/
대상 경로: /home/user/webapp/hephaitos/services/mobile/src/components/catalyst/
```

**작업 내용**:
```bash
# 1. 디렉토리 생성
mkdir -p services/mobile/src/components/catalyst

# 2. 주요 컴포넌트 복사 (30+ 파일)
cp -r catalyst-ui-kit-new/components/* services/mobile/src/components/catalyst/

# 3. 파일 구조 확인
find services/mobile/src/components/catalyst -type f -name "*.tsx" | wc -l
```

**복사할 주요 컴포넌트**:
```
기본 컴포넌트 (10개):
  - Button.tsx          # 버튼 (primary, secondary, outline)
  - Input.tsx           # 입력 필드
  - Select.tsx          # 드롭다운
  - Checkbox.tsx        # 체크박스
  - Radio.tsx           # 라디오 버튼
  - Switch.tsx          # 토글 스위치
  - Textarea.tsx        # 텍스트 영역
  - Label.tsx           # 라벨
  - Badge.tsx           # 배지
  - Avatar.tsx          # 아바타

레이아웃 컴포넌트 (8개):
  - Card.tsx            # 카드
  - Dialog.tsx          # 모달/다이얼로그
  - Dropdown.tsx        # 드롭다운 메뉴
  - Popover.tsx         # 팝오버
  - Tabs.tsx            # 탭
  - Accordion.tsx       # 아코디언
  - Divider.tsx         # 구분선
  - Heading.tsx         # 제목

데이터 표시 (7개):
  - Table.tsx           # 테이블
  - List.tsx            # 리스트
  - Alert.tsx           # 알림
  - Toast.tsx           # 토스트 알림
  - Progress.tsx        # 진행 표시줄
  - Skeleton.tsx        # 로딩 스켈레톤
  - Spinner.tsx         # 스피너

폼 컴포넌트 (5개):
  - Form.tsx            # 폼 래퍼
  - FormField.tsx       # 폼 필드
  - FieldGroup.tsx      # 필드 그룹
  - ErrorMessage.tsx    # 에러 메시지
  - Description.tsx     # 설명 텍스트
```

**산출물**:
- `services/mobile/src/components/catalyst/` (30+ 파일)
- 총 예상 라인 수: ~5,000 라인

---

### 작업 2: TypeScript 타입 정의 생성 (30분)

**파일 생성**:
```typescript
// services/mobile/src/types/catalyst.d.ts

import { ReactNode, ButtonHTMLAttributes, InputHTMLAttributes } from 'react';

// Button 타입
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

// Input 타입
export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  description?: string;
  leftAddon?: ReactNode;
  rightAddon?: ReactNode;
}

// Card 타입
export interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'outlined' | 'elevated';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

// Dialog 타입
export interface DialogProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

// Alert 타입
export interface AlertProps {
  variant: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  children: ReactNode;
  onClose?: () => void;
}

// ... 나머지 컴포넌트 타입 (총 30개)
```

**산출물**:
- `services/mobile/src/types/catalyst.d.ts` (~500 라인)
- 모든 Catalyst 컴포넌트 타입 정의

---

### 작업 3: Tailwind 설정 병합 (30분)

**파일 수정**: `services/mobile/tailwind.config.js`

```javascript
// services/mobile/tailwind.config.js

import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // 🆕 Hephaitos 브랜드 컬러
      colors: {
        brand: {
          primary: '#2563EB',      // Primary Blue
          secondary: '#4F46E5',    // Indigo
          toss: '#0064FF',         // Toss Blue
          kftc: '#00A86B',         // KFTC Green
        },
        // Catalyst 기본 컬러 팔레트
        gray: {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
          950: '#030712',
        },
      },
      // 🆕 커스텀 폰트
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      // 🆕 커스텀 간격
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      // 🆕 커스텀 그림자
      boxShadow: {
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
      // 🆕 커스텀 애니메이션
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'bounce-gentle': 'bounceGentle 1s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
};

export default config;
```

**산출물**:
- 업데이트된 `tailwind.config.js` (~100 라인)
- Hephaitos 브랜드 컬러 통합
- Catalyst 스타일 시스템 병합

---

### 작업 4: 테마 커스터마이징 (30분)

**파일 생성**: `services/mobile/src/styles/theme.ts`

```typescript
// services/mobile/src/styles/theme.ts

export const theme = {
  colors: {
    // 브랜드 컬러
    brand: {
      primary: '#2563EB',
      secondary: '#4F46E5',
      toss: '#0064FF',
      kftc: '#00A86B',
    },
    // 상태 컬러
    status: {
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
      info: '#3B82F6',
    },
    // 중립 컬러
    neutral: {
      50: '#F9FAFB',
      100: '#F3F4F6',
      200: '#E5E7EB',
      300: '#D1D5DB',
      400: '#9CA3AF',
      500: '#6B7280',
      600: '#4B5563',
      700: '#374151',
      800: '#1F2937',
      900: '#111827',
    },
  },
  typography: {
    fontSizes: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px
      base: '1rem',     // 16px
      lg: '1.125rem',   // 18px
      xl: '1.25rem',    // 20px
      '2xl': '1.5rem',  // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem', // 36px
    },
    fontWeights: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
    lineHeights: {
      tight: '1.25',
      normal: '1.5',
      relaxed: '1.75',
    },
  },
  spacing: {
    xs: '0.25rem',   // 4px
    sm: '0.5rem',    // 8px
    md: '1rem',      // 16px
    lg: '1.5rem',    // 24px
    xl: '2rem',      // 32px
    '2xl': '3rem',   // 48px
    '3xl': '4rem',   // 64px
  },
  borderRadius: {
    none: '0',
    sm: '0.25rem',   // 4px
    md: '0.375rem',  // 6px
    lg: '0.5rem',    // 8px
    xl: '0.75rem',   // 12px
    '2xl': '1rem',   // 16px
    full: '9999px',
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
  },
  transitions: {
    fast: '150ms',
    normal: '200ms',
    slow: '300ms',
  },
};

export type Theme = typeof theme;
```

**산출물**:
- `services/mobile/src/styles/theme.ts` (~150 라인)
- 중앙 집중식 테마 관리
- TypeScript 타입 안전성

---

### Phase 2 체크리스트

```
□ Catalyst 컴포넌트 30+ 복사 완료
□ TypeScript 타입 정의 생성 완료
□ Tailwind 설정 병합 완료
□ 테마 파일 생성 및 적용 완료
□ 컴포넌트 import 테스트 완료
□ TypeScript 컴파일 오류 0개
□ Git 커밋 생성
```

---

## 🎨 Phase 3: 핵심 모바일 페이지 구현 (50% → 75%)

**목표**: 4개 주요 페이지 구현 (Dashboard, Accounts, Debt, Policy)  
**예상 소요**: 4-6시간  
**우선순위**: ⭐⭐⭐⭐⭐ (높음)

---

### 페이지 1: Dashboard (대시보드) — 90분

**파일 경로**: `services/mobile/src/app/(main)/dashboard/page.tsx`

**기능 요구사항**:
1. 계좌 연결 상태 요약 카드
2. 총 채무 금액 표시 (그래프)
3. 최근 거래 내역 목록 (5개)
4. 빠른 액션 버튼 (4개)

**컴포넌트 구조**:
```typescript
export default function DashboardPage() {
  const { connections } = useOAuth();
  const { data: debtSummary } = useDebtSummary();
  const { data: recentTransactions } = useRecentTransactions(5);

  return (
    <div className="min-h-screen bg-neutral-50 pb-20">
      <Container className="py-6">
        {/* 1. 헤더 섹션 */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold">대시보드</h1>
          <p className="text-neutral-600">
            {format(new Date(), 'yyyy년 M월 d일')}
          </p>
        </div>

        {/* 2. 계좌 연결 상태 카드 */}
        <Card className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">연결된 계좌</h2>
              <p className="text-2xl font-bold text-brand-primary">
                {connections.length}개
              </p>
            </div>
            <Button variant="outline" href="/connect">
              계좌 추가
            </Button>
          </div>
        </Card>

        {/* 3. 총 채무 요약 카드 */}
        <Card className="mb-6">
          <h2 className="mb-4 text-lg font-semibold">총 채무 현황</h2>
          <div className="mb-4">
            <p className="text-sm text-neutral-600">총 채무 금액</p>
            <p className="text-3xl font-bold text-red-600">
              {formatCurrency(debtSummary?.totalDebt ?? 0)}
            </p>
          </div>
          {/* 도넛 차트 */}
          <DebtDonutChart data={debtSummary?.breakdown} />
        </Card>

        {/* 4. 최근 거래 내역 */}
        <Card className="mb-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">최근 거래</h2>
            <Button variant="ghost" href="/accounts">
              전체 보기
            </Button>
          </div>
          <TransactionList transactions={recentTransactions} />
        </Card>

        {/* 5. 빠른 액션 버튼 */}
        <div className="grid grid-cols-2 gap-4">
          <QuickActionButton
            icon={<CreditCard />}
            label="채무 분석"
            href="/debt-analysis"
          />
          <QuickActionButton
            icon={<FileText />}
            label="정책 추천"
            href="/policy"
          />
          <QuickActionButton
            icon={<Upload />}
            label="문서 업로드"
            href="/documents"
          />
          <QuickActionButton
            icon={<Settings />}
            label="설정"
            href="/settings"
          />
        </div>
      </Container>
    </div>
  );
}
```

**필요한 컴포넌트**:
- `Card` (Catalyst)
- `Button` (Catalyst)
- `DebtDonutChart` (신규 생성)
- `TransactionList` (신규 생성)
- `QuickActionButton` (신규 생성)

**필요한 훅**:
- `useOAuth()` (기존)
- `useDebtSummary()` (신규 생성)
- `useRecentTransactions()` (신규 생성)

**예상 라인 수**: ~250 라인

---

### 페이지 2: Accounts (계좌 목록) — 90분

**파일 경로**: `services/mobile/src/app/(main)/accounts/page.tsx`

**기능 요구사항**:
1. 연결된 계좌 목록 (카드 형식)
2. 계좌별 잔액 표시
3. 거래 내역 타임라인
4. 필터 및 검색 기능

**컴포넌트 구조**:
```typescript
export default function AccountsPage() {
  const { connections } = useOAuth();
  const { data: accounts } = useAccounts();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'toss' | 'kftc'>('all');

  const filteredAccounts = useMemo(() => {
    return accounts?.filter((account) => {
      const matchesSearch = account.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = filterType === 'all' || account.provider === filterType;
      return matchesSearch && matchesType;
    });
  }, [accounts, searchQuery, filterType]);

  return (
    <div className="min-h-screen bg-neutral-50 pb-20">
      <Container className="py-6">
        {/* 1. 헤더 */}
        <h1 className="mb-6 text-3xl font-bold">계좌 목록</h1>

        {/* 2. 검색 및 필터 */}
        <div className="mb-6 space-y-4">
          <Input
            placeholder="계좌 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftAddon={<Search />}
          />
          <div className="flex gap-2">
            <Button
              variant={filterType === 'all' ? 'primary' : 'outline'}
              onClick={() => setFilterType('all')}
            >
              전체
            </Button>
            <Button
              variant={filterType === 'toss' ? 'primary' : 'outline'}
              onClick={() => setFilterType('toss')}
            >
              Toss
            </Button>
            <Button
              variant={filterType === 'kftc' ? 'primary' : 'outline'}
              onClick={() => setFilterType('kftc')}
            >
              오픈뱅킹
            </Button>
          </div>
        </div>

        {/* 3. 계좌 카드 목록 */}
        <div className="space-y-4">
          {filteredAccounts?.map((account) => (
            <AccountCard key={account.id} account={account} />
          ))}
        </div>

        {/* 4. 빈 상태 */}
        {filteredAccounts?.length === 0 && (
          <EmptyState
            icon={<Wallet />}
            title="계좌가 없습니다"
            description="금융 계좌를 연결하여 시작하세요"
            action={
              <Button href="/connect">계좌 연결하기</Button>
            }
          />
        )}
      </Container>
    </div>
  );
}
```

**필요한 컴포넌트**:
- `Input` (Catalyst)
- `Button` (Catalyst)
- `AccountCard` (신규 생성)
- `EmptyState` (신규 생성)

**필요한 훅**:
- `useAccounts()` (신규 생성)

**예상 라인 수**: ~200 라인

---

### 페이지 3: Debt Analysis (채무 분석) — 90분

**파일 경로**: `services/mobile/src/app/(main)/debt-analysis/page.tsx`

**기능 요구사항**:
1. 채무 분석 결과 그래프
2. 부채 비율 차트 (도넛 차트)
3. 상환 시뮬레이션
4. PDF 리포트 다운로드

**컴포넌트 구조**:
```typescript
export default function DebtAnalysisPage() {
  const { data: debtAnalysis } = useDebtAnalysis();
  const [showSimulator, setShowSimulator] = useState(false);

  return (
    <div className="min-h-screen bg-neutral-50 pb-20">
      <Container className="py-6">
        {/* 1. 헤더 */}
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold">채무 분석</h1>
          <Button variant="outline" onClick={downloadPDF}>
            <Download /> PDF 다운로드
          </Button>
        </div>

        {/* 2. 총 채무 요약 */}
        <Card className="mb-6 bg-gradient-to-br from-red-50 to-orange-50">
          <div className="text-center">
            <p className="text-sm text-neutral-600">총 채무 금액</p>
            <p className="text-4xl font-bold text-red-600">
              {formatCurrency(debtAnalysis?.totalDebt)}
            </p>
            <p className="mt-2 text-sm text-neutral-600">
              월 상환액: {formatCurrency(debtAnalysis?.monthlyPayment)}
            </p>
          </div>
        </Card>

        {/* 3. 부채 비율 차트 */}
        <Card className="mb-6">
          <h2 className="mb-4 text-lg font-semibold">부채 구성</h2>
          <DebtDonutChart data={debtAnalysis?.breakdown} />
          <div className="mt-4 space-y-2">
            {debtAnalysis?.breakdown.map((item) => (
              <DebtBreakdownItem key={item.type} item={item} />
            ))}
          </div>
        </Card>

        {/* 4. AI 분석 결과 */}
        <Card className="mb-6">
          <h2 className="mb-4 text-lg font-semibold">AI 분석 결과</h2>
          <Alert variant="info" className="mb-4">
            <p>{debtAnalysis?.aiInsight}</p>
          </Alert>
          <div className="space-y-3">
            {debtAnalysis?.recommendations.map((rec, idx) => (
              <RecommendationItem key={idx} recommendation={rec} />
            ))}
          </div>
        </Card>

        {/* 5. 상환 시뮬레이터 */}
        <Card className="mb-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">상환 시뮬레이션</h2>
            <Button
              variant="ghost"
              onClick={() => setShowSimulator(!showSimulator)}
            >
              {showSimulator ? '닫기' : '열기'}
            </Button>
          </div>
          {showSimulator && <RepaymentSimulator data={debtAnalysis} />}
        </Card>

        {/* 6. 다음 액션 */}
        <Button fullWidth href="/policy">
          추천 정책 보기 →
        </Button>
      </Container>
    </div>
  );
}
```

**필요한 컴포넌트**:
- `Card`, `Button`, `Alert` (Catalyst)
- `DebtDonutChart` (재사용)
- `DebtBreakdownItem` (신규)
- `RecommendationItem` (신규)
- `RepaymentSimulator` (신규)

**필요한 훅**:
- `useDebtAnalysis()` (신규 생성)

**예상 라인 수**: ~280 라인

---

### 페이지 4: Policy Recommendation (정책 추천) — 90분

**파일 경로**: `services/mobile/src/app/(main)/policy/page.tsx`

**기능 요구사항**:
1. AI 추천 정책 목록
2. 정책별 혜택 비교
3. 신청 자격 체크리스트
4. 신청 바로가기 버튼

**컴포넌트 구조**:
```typescript
export default function PolicyPage() {
  const { data: policies } = usePolicyRecommendations();
  const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null);

  return (
    <div className="min-h-screen bg-neutral-50 pb-20">
      <Container className="py-6">
        {/* 1. 헤더 */}
        <h1 className="mb-6 text-3xl font-bold">추천 정책</h1>

        {/* 2. AI 추천 배너 */}
        <Card className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 rounded-full bg-blue-100 p-3">
              <Sparkles className="text-blue-600" />
            </div>
            <div>
              <h2 className="font-semibold text-blue-900">
                AI가 분석한 맞춤 정책
              </h2>
              <p className="text-sm text-blue-700">
                귀하의 채무 상황에 가장 적합한 {policies?.length}개의 정책을 찾았습니다
              </p>
            </div>
          </div>
        </Card>

        {/* 3. 정책 카드 목록 */}
        <div className="space-y-4">
          {policies?.map((policy) => (
            <PolicyCard
              key={policy.id}
              policy={policy}
              onSelect={() => setSelectedPolicy(policy)}
            />
          ))}
        </div>

        {/* 4. 정책 상세 다이얼로그 */}
        <Dialog
          open={!!selectedPolicy}
          onClose={() => setSelectedPolicy(null)}
          size="lg"
        >
          {selectedPolicy && (
            <PolicyDetailDialog
              policy={selectedPolicy}
              onApply={() => handleApply(selectedPolicy)}
            />
          )}
        </Dialog>
      </Container>
    </div>
  );
}
```

**PolicyCard 컴포넌트**:
```typescript
function PolicyCard({ policy, onSelect }: PolicyCardProps) {
  return (
    <Card className="cursor-pointer transition-shadow hover:shadow-lg" onClick={onSelect}>
      <div className="flex items-start gap-4">
        {/* 아이콘 */}
        <div className="flex-shrink-0 rounded-lg bg-green-100 p-3">
          <FileText className="text-green-600" />
        </div>

        {/* 정보 */}
        <div className="flex-1">
          <div className="mb-2 flex items-start justify-between">
            <h3 className="font-semibold">{policy.name}</h3>
            <Badge variant="success">추천</Badge>
          </div>
          <p className="mb-3 text-sm text-neutral-600">{policy.description}</p>

          {/* 혜택 */}
          <div className="mb-3 space-y-1">
            <div className="flex items-center gap-2 text-sm">
              <DollarSign className="h-4 w-4 text-green-600" />
              <span>최대 {formatCurrency(policy.maxBenefit)} 지원</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-blue-600" />
              <span>신청 기간: {policy.applicationPeriod}</span>
            </div>
          </div>

          {/* 매치율 */}
          <div className="flex items-center gap-2">
            <Progress value={policy.matchRate} className="flex-1" />
            <span className="text-sm font-semibold text-brand-primary">
              {policy.matchRate}% 일치
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}
```

**필요한 컴포넌트**:
- `Card`, `Button`, `Dialog`, `Badge`, `Progress` (Catalyst)
- `PolicyCard` (신규)
- `PolicyDetailDialog` (신규)

**필요한 훅**:
- `usePolicyRecommendations()` (신규 생성)

**예상 라인 수**: ~300 라인

---

### Phase 3 체크리스트

```
□ Dashboard 페이지 구현 완료 (250 라인)
□ Accounts 페이지 구현 완료 (200 라인)
□ Debt Analysis 페이지 구현 완료 (280 라인)
□ Policy 페이지 구현 완료 (300 라인)
□ 필요한 커스텀 훅 구현 완료 (5개)
□ 페이지 간 네비게이션 테스트 완료
□ 반응형 디자인 검증 완료
□ Git 커밋 생성
```

**총 라인 수**: ~1,030 라인 (4개 페이지)

---

## 📱 Phase 4: 모바일 최적화 (75% → 90%)

**목표**: 모바일 UX 향상 (네비게이션, 제스처, PWA)  
**예상 소요**: 3-4시간  
**우선순위**: ⭐⭐⭐⭐ (중간-높음)

---

### 작업 1: 하단 네비게이션 바 (60분)

**파일 생성**: `services/mobile/src/components/BottomNavigation.tsx`

```typescript
// services/mobile/src/components/BottomNavigation.tsx

'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  Home, 
  Wallet, 
  BarChart3, 
  FileText, 
  User 
} from 'lucide-react';
import clsx from 'clsx';

const navigationItems = [
  { href: '/dashboard', icon: Home, label: '홈' },
  { href: '/accounts', icon: Wallet, label: '계좌' },
  { href: '/debt-analysis', icon: BarChart3, label: '분석' },
  { href: '/policy', icon: FileText, label: '정책' },
  { href: '/profile', icon: User, label: '프로필' },
];

export function BottomNavigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-neutral-200 pb-safe">
      <div className="flex items-center justify-around h-16">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                'flex flex-col items-center justify-center',
                'min-w-[64px] min-h-[48px]', // 터치 타겟 최소 크기
                'transition-colors duration-200',
                isActive
                  ? 'text-brand-primary'
                  : 'text-neutral-600 hover:text-neutral-900'
              )}
            >
              <Icon className={clsx('h-6 w-6', isActive && 'animate-bounce-gentle')} />
              <span className={clsx(
                'mt-1 text-xs',
                isActive ? 'font-semibold' : 'font-normal'
              )}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
```

**레이아웃 통합**: `services/mobile/src/app/(main)/layout.tsx`

```typescript
export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative">
      {children}
      <BottomNavigation />
    </div>
  );
}
```

**예상 라인 수**: ~80 라인

---

### 작업 2: 스와이프 제스처 (90분)

**파일 생성**: `services/mobile/src/components/SwipeableCard.tsx`

```typescript
// services/mobile/src/components/SwipeableCard.tsx

'use client';

import { ReactNode, useState } from 'react';
import { motion, PanInfo, useAnimation } from 'framer-motion';
import { Trash2, Eye } from 'lucide-react';
import clsx from 'clsx';

interface SwipeableCardProps {
  children: ReactNode;
  onDelete?: () => void;
  onViewDetails?: () => void;
  className?: string;
}

export function SwipeableCard({
  children,
  onDelete,
  onViewDetails,
  className,
}: SwipeableCardProps) {
  const controls = useAnimation();
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);

  const handleDragEnd = async (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 100;
    const velocity = info.velocity.x;
    const offset = info.offset.x;

    // 왼쪽 스와이프 (삭제)
    if (offset < -threshold || velocity < -500) {
      setSwipeDirection('left');
      await controls.start({ x: -300, opacity: 0 });
      onDelete?.();
    }
    // 오른쪽 스와이프 (상세 보기)
    else if (offset > threshold || velocity > 500) {
      setSwipeDirection('right');
      await controls.start({ x: 300, opacity: 0 });
      onViewDetails?.();
    }
    // 원위치
    else {
      controls.start({ x: 0, opacity: 1 });
      setSwipeDirection(null);
    }
  };

  return (
    <div className="relative overflow-hidden">
      {/* 배경 액션 버튼 */}
      <div className="absolute inset-0 flex items-center justify-between px-4">
        <div className="flex items-center gap-2 text-red-600">
          <Trash2 className="h-5 w-5" />
          <span className="font-semibold">삭제</span>
        </div>
        <div className="flex items-center gap-2 text-blue-600">
          <span className="font-semibold">상세</span>
          <Eye className="h-5 w-5" />
        </div>
      </div>

      {/* 스와이프 가능한 카드 */}
      <motion.div
        className={clsx('relative z-10 cursor-grab active:cursor-grabbing', className)}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
        animate={controls}
        whileTap={{ scale: 0.98 }}
      >
        {children}
      </motion.div>
    </div>
  );
}
```

**사용 예시**:
```typescript
<SwipeableCard
  onDelete={() => handleDeleteAccount(account.id)}
  onViewDetails={() => router.push(`/accounts/${account.id}`)}
>
  <AccountCard account={account} />
</SwipeableCard>
```

**예상 라인 수**: ~120 라인

---

### 작업 3: Pull-to-refresh (60분)

**파일 생성**: `services/mobile/src/components/PullToRefresh.tsx`

```typescript
// services/mobile/src/components/PullToRefresh.tsx

'use client';

import { ReactNode, useState, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { RefreshCw } from 'lucide-react';
import clsx from 'clsx';

interface PullToRefreshProps {
  children: ReactNode;
  onRefresh: () => Promise<void>;
}

export function PullToRefresh({ children, onRefresh }: PullToRefreshProps) {
  const [isPulling, setIsPulling] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const controls = useAnimation();
  const startY = useRef(0);
  const currentY = useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (window.scrollY === 0) {
      startY.current = e.touches[0].clientY;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (window.scrollY === 0 && !isRefreshing) {
      currentY.current = e.touches[0].clientY;
      const pullDistance = currentY.current - startY.current;

      if (pullDistance > 0 && pullDistance < 150) {
        setIsPulling(true);
        controls.start({ y: pullDistance / 2 });
      }
    }
  };

  const handleTouchEnd = async () => {
    const pullDistance = currentY.current - startY.current;

    if (pullDistance > 80) {
      setIsRefreshing(true);
      await onRefresh();
      setIsRefreshing(false);
    }

    setIsPulling(false);
    controls.start({ y: 0 });
    startY.current = 0;
    currentY.current = 0;
  };

  return (
    <div
      className="relative"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Pull indicator */}
      <motion.div
        className={clsx(
          'absolute left-0 right-0 top-0 z-10',
          'flex items-center justify-center',
          'h-16 -translate-y-16',
          'bg-gradient-to-b from-white to-transparent'
        )}
        animate={controls}
      >
        <div className="flex items-center gap-2 text-neutral-600">
          <RefreshCw
            className={clsx(
              'h-5 w-5',
              (isPulling || isRefreshing) && 'animate-spin'
            )}
          />
          <span className="text-sm font-medium">
            {isRefreshing ? '새로고침 중...' : '당겨서 새로고침'}
          </span>
        </div>
      </motion.div>

      {/* Content */}
      {children}
    </div>
  );
}
```

**사용 예시**:
```typescript
<PullToRefresh onRefresh={async () => {
  await refetchAccounts();
  await refetchTransactions();
}}>
  <AccountsList accounts={accounts} />
</PullToRefresh>
```

**예상 라인 수**: ~100 라인

---

### 작업 4: PWA 설정 (선택 사항, 60분)

**파일 생성**: `services/mobile/public/manifest.json`

```json
{
  "name": "Hephaitos - 채무 분석 플랫폼",
  "short_name": "Hephaitos",
  "description": "AI 기반 채무 분석 및 정책 추천 서비스",
  "start_url": "/dashboard",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#2563EB",
  "orientation": "portrait-primary",
  "icons": [
    {
      "src": "/icons/icon-72x72.png",
      "sizes": "72x72",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-96x96.png",
      "sizes": "96x96",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-128x128.png",
      "sizes": "128x128",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-144x144.png",
      "sizes": "144x144",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-152x152.png",
      "sizes": "152x152",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-384x384.png",
      "sizes": "384x384",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ],
  "categories": ["finance", "productivity"],
  "shortcuts": [
    {
      "name": "계좌 연결",
      "url": "/connect",
      "description": "금융 계좌 연결하기"
    },
    {
      "name": "채무 분석",
      "url": "/debt-analysis",
      "description": "채무 현황 분석 보기"
    }
  ]
}
```

**Service Worker**: `services/mobile/public/sw.js`

```javascript
// services/mobile/public/sw.js

const CACHE_NAME = 'hephaitos-v1';
const urlsToCache = [
  '/',
  '/dashboard',
  '/accounts',
  '/debt-analysis',
  '/policy',
  '/offline',
];

// Install event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

// Fetch event (Cache-first strategy)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

// Activate event
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
});
```

**manifest 등록**: `services/mobile/src/app/layout.tsx`

```typescript
export const metadata: Metadata = {
  title: 'Hephaitos',
  description: 'AI 기반 채무 분석 및 정책 추천 서비스',
  manifest: '/manifest.json',
  themeColor: '#2563EB',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  appleWebApp: {
    capable: true,
    title: 'Hephaitos',
    statusBarStyle: 'default',
  },
};
```

**예상 라인 수**: ~150 라인 (manifest + SW + 설정)

---

### Phase 4 체크리스트

```
□ 하단 네비게이션 바 구현 완료
□ 5개 탭 네비게이션 작동 확인
□ 스와이프 제스처 구현 완료
□ 삭제/상세 액션 테스트 완료
□ Pull-to-refresh 구현 완료
□ PWA manifest 생성 완료
□ Service Worker 등록 완료
□ 오프라인 모드 테스트 완료
□ Git 커밋 생성
```

**총 라인 수**: ~450 라인

---

## 🧪 Phase 5: 테스트 및 배포 (90% → 100%)

**목표**: 프로덕션 준비 완료  
**예상 소요**: 2-3시간  
**우선순위**: ⭐⭐⭐⭐⭐ (최우선)

---

### 작업 1: 다양한 화면 크기 테스트 (45분)

**테스트 기기 목록**:
```
1. iPhone SE (320px × 568px)
2. iPhone 12/13 (390px × 844px)
3. iPhone 12 Pro Max (428px × 926px)
4. iPad (768px × 1024px)
5. Desktop (1920px × 1080px)
```

**테스트 체크리스트**:
```
□ 320px: 모든 UI 요소 정상 표시
□ 390px: 카드 레이아웃 정상
□ 428px: 터치 타겟 크기 44px 이상
□ 768px: 태블릿 레이아웃 적용
□ 1920px: 데스크톱 max-width 제한
```

**테스트 도구**:
- Chrome DevTools (Device Mode)
- Firefox Responsive Design Mode
- BrowserStack (실제 기기)

---

### 작업 2: 터치 이벤트 최적화 (30분)

**터치 타겟 검증**:
```typescript
// services/mobile/src/utils/touchTargetValidator.ts

export function validateTouchTargets() {
  const interactiveElements = document.querySelectorAll('button, a, input, select');
  const violations: Element[] = [];

  interactiveElements.forEach((element) => {
    const rect = element.getBoundingClientRect();
    const minSize = 44; // 44x44px minimum

    if (rect.width < minSize || rect.height < minSize) {
      violations.push(element);
      console.warn('Touch target too small:', element, rect);
    }
  });

  return violations;
}
```

**제스처 충돌 방지**:
```typescript
// services/mobile/src/utils/gestureConflictPrevention.ts

export function preventGestureConflicts() {
  // Prevent double-tap zoom
  document.addEventListener('touchstart', (e) => {
    if (e.touches.length > 1) {
      e.preventDefault();
    }
  }, { passive: false });

  // Prevent pinch zoom
  document.addEventListener('touchmove', (e) => {
    if (e.touches.length > 1) {
      e.preventDefault();
    }
  }, { passive: false });
}
```

---

### 작업 3: 로딩 성능 개선 (45분)

**Code Splitting**:
```typescript
// services/mobile/src/app/(main)/dashboard/page.tsx

import dynamic from 'next/dynamic';

// Dynamic imports for heavy components
const DebtDonutChart = dynamic(() => import('@/components/charts/DebtDonutChart'), {
  loading: () => <ChartSkeleton />,
  ssr: false,
});

const RepaymentSimulator = dynamic(() => import('@/components/RepaymentSimulator'), {
  loading: () => <SimulatorSkeleton />,
});
```

**Image Optimization**:
```typescript
// services/mobile/next.config.js

const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [320, 420, 640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
  },
};
```

**Lazy Loading**:
```typescript
// services/mobile/src/components/LazyLoad.tsx

export function LazyLoad({ children }: { children: ReactNode }) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '50px' }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref}>
      {isVisible ? children : <div style={{ minHeight: '200px' }} />}
    </div>
  );
}
```

**Lighthouse 목표**:
```
Performance: 90+
Accessibility: 95+
Best Practices: 95+
SEO: 90+
```

---

### 작업 4: 프로덕션 배포 (30분)

**Vercel 배포**:
```bash
# 1. Vercel 설치
npm install -g vercel

# 2. 프로젝트 초기화
cd services/mobile
vercel init

# 3. 환경 변수 설정
vercel env add API_BASE_URL production
vercel env add NEXT_PUBLIC_SITE_URL production

# 4. 배포
vercel --prod
```

**환경 변수 설정**:
```bash
# Production
API_BASE_URL=https://api.hephaitos.com
NEXT_PUBLIC_SITE_URL=https://mobile.hephaitos.com
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Staging
API_BASE_URL=https://api.staging.hephaitos.com
NEXT_PUBLIC_SITE_URL=https://mobile.staging.hephaitos.com
```

**도메인 연결**:
```bash
# Vercel CLI
vercel domains add mobile.hephaitos.com

# HTTPS 자동 설정 (Let's Encrypt)
# Vercel이 자동으로 처리
```

---

### Phase 5 체크리스트

```
□ 5개 화면 크기에서 테스트 완료
□ 터치 타겟 44px 이상 검증 완료
□ 제스처 충돌 방지 구현 완료
□ Code splitting 적용 완료
□ Image optimization 완료
□ Lazy loading 구현 완료
□ Lighthouse 점수 90+ 달성
□ Vercel 배포 완료
□ 도메인 연결 및 HTTPS 설정 완료
□ 프로덕션 환경 변수 설정 완료
□ 최종 Git 커밋 생성
□ 배포 문서 작성 완료
```

---

## 📊 전체 작업 요약

### 시간 추정

| Phase | 작업 내용 | 예상 시간 | 진행도 변화 |
|-------|-----------|-----------|-------------|
| Phase 2 | Catalyst UI Kit 통합 | 2-3시간 | 40% → 50% |
| Phase 3 | 핵심 페이지 4개 구현 | 4-6시간 | 50% → 75% |
| Phase 4 | 모바일 최적화 | 3-4시간 | 75% → 90% |
| Phase 5 | 테스트 및 배포 | 2-3시간 | 90% → 100% |
| **총계** | **전체 작업** | **11-16시간** | **40% → 100%** |

### 라인 수 추정

| Phase | 라인 수 | 파일 수 |
|-------|---------|---------|
| Phase 2 | ~5,650 | ~35 |
| Phase 3 | ~1,030 | ~15 |
| Phase 4 | ~450 | ~5 |
| Phase 5 | ~200 | ~3 |
| **총계** | **~7,330** | **~58** |

### 우선순위 매트릭스

```
높음 (⭐⭐⭐⭐⭐):
  - Phase 2: Catalyst UI Kit 통합
  - Phase 3: 핵심 페이지 구현
  - Phase 5: 테스트 및 배포

중간 (⭐⭐⭐⭐):
  - Phase 4: 모바일 최적화

낮음 (⭐⭐⭐):
  - PWA 설정 (선택 사항)
```

---

## 🎯 마일스톤 및 체크포인트

### Milestone 1: UI 기반 구조 (50%)
```
완료 조건:
✓ Catalyst 컴포넌트 30+ 통합
✓ Tailwind 설정 병합
✓ 테마 시스템 구축
✓ TypeScript 타입 안전성 확보

체크포인트:
  HEPHAITOS_PHASE2_CHECKPOINT.tar.gz
```

### Milestone 2: 핵심 기능 (75%)
```
완료 조건:
✓ Dashboard 페이지 완성
✓ Accounts 페이지 완성
✓ Debt Analysis 페이지 완성
✓ Policy 페이지 완성
✓ 페이지 간 네비게이션 작동

체크포인트:
  HEPHAITOS_PHASE3_CHECKPOINT.tar.gz
```

### Milestone 3: 모바일 최적화 (90%)
```
완료 조건:
✓ 하단 네비게이션 바 작동
✓ 스와이프 제스처 구현
✓ Pull-to-refresh 구현
✓ PWA 설정 (선택)

체크포인트:
  HEPHAITOS_PHASE4_CHECKPOINT.tar.gz
```

### Milestone 4: 프로덕션 배포 (100%)
```
완료 조건:
✓ 모든 화면 크기 테스트 통과
✓ Lighthouse 점수 90+
✓ Vercel 배포 성공
✓ HTTPS 설정 완료
✓ 프로덕션 환경 안정

최종 체크포인트:
  HEPHAITOS_V1.0_PRODUCTION.tar.gz
```

---

## 🚨 리스크 및 대응 방안

### 리스크 1: Catalyst 컴포넌트 호환성 문제
**확률**: 중간  
**영향**: 중간  
**대응**:
- 각 컴포넌트 개별 테스트
- 호환되지 않는 컴포넌트는 자체 구현
- Fallback 컴포넌트 준비

### 리스크 2: 성능 저하 (Lighthouse 90 미달)
**확률**: 중간  
**영향**: 높음  
**대응**:
- Code splitting 적극 활용
- Image lazy loading
- Bundle size 최적화
- Server-side rendering 고려

### 리스크 3: API 연동 지연
**확률**: 낮음  
**영향**: 높음  
**대응**:
- Mock API 사용 (개발 단계)
- Error boundary 구현
- Retry logic 추가
- Loading states 명확히 표시

### 리스크 4: 배포 실패
**확률**: 낮음  
**영향**: 중간  
**대응**:
- 스테이징 환경 먼저 배포
- 롤백 계획 수립
- Health check endpoint 구현
- CI/CD 파이프라인 검증

---

## 📝 추가 권장 사항

### 단기 (1주 내)
1. **단위 테스트 작성** (Jest + React Testing Library)
   - 주요 컴포넌트 테스트 커버리지 80% 목표
   - 예상 시간: 4-6시간

2. **E2E 테스트 작성** (Playwright)
   - 핵심 사용자 플로우 테스트
   - 예상 시간: 2-3시간

3. **에러 모니터링** (Sentry 통합)
   - 프로덕션 에러 추적
   - 예상 시간: 1시간

### 중기 (1개월 내)
1. **API 문서화** (Swagger/OpenAPI)
2. **사용자 분석** (Google Analytics 4)
3. **A/B 테스트 프레임워크**
4. **접근성 개선** (WCAG 2.1 AA 준수)

### 장기 (3개월 내)
1. **다국어 지원** (i18n)
2. **오프라인 모드 강화**
3. **Push 알림**
4. **고급 분석 대시보드**

---

## 🎓 학습 자료 및 참고 문서

### Catalyst UI Kit
- Documentation: (프로젝트 내 docs/ 폴더 참고)
- Storybook: (로컬에서 `pnpm storybook` 실행)

### Next.js 15
- App Router: https://nextjs.org/docs/app
- Server Components: https://nextjs.org/docs/app/building-your-application/rendering/server-components
- Image Optimization: https://nextjs.org/docs/app/building-your-application/optimizing/images

### Framer Motion
- Gestures: https://www.framer.com/motion/gestures/
- Animations: https://www.framer.com/motion/animation/

### PWA
- manifest.json: https://web.dev/add-manifest/
- Service Workers: https://web.dev/service-workers-cache-storage/

---

## ✅ 최종 체크리스트

### 개발 환경
```
□ Node.js 18+ 설치 확인
□ pnpm 10.20.0 설치 확인
□ PostgreSQL 16 실행 확인
□ Redis 7 실행 확인
□ Git 설정 확인
```

### 코드 품질
```
□ TypeScript strict mode 통과
□ ESLint 오류 0개
□ Prettier 포맷팅 일관성
□ 주석 및 문서화 완료
```

### 보안
```
□ 환경 변수 .gitignore 확인
□ API 키 암호화 확인
□ HTTPS 설정 확인
□ CORS 정책 설정 확인
```

### 성능
```
□ Lighthouse 점수 90+
□ First Contentful Paint < 1.5s
□ Time to Interactive < 3s
□ Bundle size < 250KB (gzipped)
```

### 배포
```
□ 프로덕션 빌드 성공
□ Vercel 배포 성공
□ 도메인 연결 완료
□ SSL/TLS 인증서 확인
□ 프로덕션 환경 변수 설정
```

---

**문서 작성**: 2025-10-28 21:30 UTC  
**작성자**: Claude (Anthropic AI Assistant)  
**버전**: 1.0.0  
**다음 업데이트**: Phase 2 완료 시
