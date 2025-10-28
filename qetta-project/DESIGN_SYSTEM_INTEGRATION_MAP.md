# QETTA Design System Integration Map
## Catalyst UI + Protocol Template → QETTA UI 완전 매핑

**생성일**: 2025-10-28  
**목적**: Catalyst UI Kit 분석 결과와 Protocol Template을 QETTA 요구사항에 100% 매핑  
**제약**: 커스텀 CSS 절대 금지 - 100% Tailwind 4.1.11 + Protocol CSS

---

## 📊 3-Way Cross Analysis

### 1. Catalyst UI Kit (디자인 시스템)
- **위치**: `/home/user/webapp/CATALYST_UI_*.md` (3개 분석 문서)
- **핵심**: Headless UI 2.2.6 기반 32개 컴포넌트
- **특징**: 3-layer CSS (border, ::before bg, ::after overlay), data-slot pattern, CSS variables

### 2. Protocol Template (구현 템플릿)
- **위치**: `/home/user/webapp/qetta-project/tailwind-plus-protocol/protocol-ts/`
- **핵심**: Next.js 15 + React 19 + Tailwind 4.1.11 실제 구현
- **특징**: Documentation site 구조 (Layout + Sidebar + Content)

### 3. QETTA Requirements (프로젝트 요구사항)
- **위치**: `MASTER_PROMPT_V2_FINAL.md`, `FRONTEND_COMPONENTS.md`
- **핵심**: 채무조정 플랫폼 UI (Dashboard, Consent, Upload, Verify, Result)
- **특징**: Data-heavy interface, Multi-step flow, Real-time updates

---

## 🎨 Color System Integration

### Protocol Template Colors (from tailwind.css)
```css
/* Zinc scale (neutral) */
--color-zinc-50: #fafafa
--color-zinc-100: #f4f4f5
--color-zinc-900: #18181b
--color-zinc-800: #27272a

/* Emerald scale (primary/success) */
--color-emerald-300: #6ee7b7
--color-emerald-400: #34d399
--color-emerald-500: #10b981

/* Sky scale (info) */
--color-sky-300: #7dd3fc
--color-sky-500: #0ea5e9

/* Pink scale (error) */
--color-pink-300: #f9a8d4
--color-pink-500: #ec4899

/* Violet scale (accent) */
--color-violet-300: #c4b5fd
--color-violet-500: #8b5cf6
```

### QETTA Color Mapping
| QETTA 용도 | Protocol Color | Tailwind Class | 사용 위치 |
|-----------|---------------|---------------|---------|
| Primary Action | Emerald 500 | `bg-emerald-500` | "분석 시작" 버튼 |
| Secondary Action | Zinc 800/40 | `bg-zinc-800/40` | "취소" 버튼 |
| Success State | Emerald 400 | `text-emerald-400` | 검증 성공 메시지 |
| Error State | Pink 500 | `text-pink-500` | 검증 실패 메시지 |
| Info State | Sky 500 | `text-sky-500` | 정보 안내 |
| Background (Light) | Zinc 50 | `bg-zinc-50` | Card background |
| Background (Dark) | Zinc 900 | `bg-zinc-900` | App background |
| Border | Zinc 900/10 | `ring-1 ring-zinc-900/10` | Input, Card border |

---

## 🧩 Component Mapping Matrix

### Core UI Components

| QETTA Component | Catalyst UI | Protocol Template | Implementation |
|----------------|-------------|------------------|----------------|
| **Button** | `<Button>` (5 variants) | `Button.tsx` | ✅ 직접 사용 |
| **Input** | `<Input>` + `<Field>` | ❌ 없음 | 🆕 생성 (Protocol 스타일 기반) |
| **Checkbox** | `<Checkbox>` | ❌ 없음 | 🆕 생성 (Headless UI) |
| **Select** | `<Select>` + `<Listbox>` | ❌ 없음 | 🆕 생성 (Headless UI) |
| **Radio** | `<Radio>` + `<RadioGroup>` | ❌ 없음 | 🆕 생성 (Headless UI) |
| **Switch** | `<Switch>` | ❌ 없음 | 🆕 생성 (Headless UI) |
| **Textarea** | `<Textarea>` | ❌ 없음 | 🆕 생성 (Protocol 스타일) |
| **Card** | `<Div>` + styling | ❌ 없음 | 🆕 생성 (Protocol colors) |
| **Badge/Tag** | `<Badge>` | `Tag.tsx` | ✅ 직접 사용 |
| **Modal/Dialog** | `<Dialog>` | ❌ 없음 | 🆕 생성 (Headless UI) |
| **Dropdown** | `<Menu>` | ❌ 없음 | 🆕 생성 (Headless UI) |
| **Alert** | `<Alert>` | ❌ 없음 | 🆕 생성 (Protocol colors) |

### Layout Components

| QETTA Component | Protocol Template | Customization |
|----------------|------------------|---------------|
| **AppLayout** | `Layout.tsx` | Navigation items 교체 |
| **Header** | `Header.tsx` | Logo, menu items 교체 |
| **Sidebar** | `Navigation.tsx` | Navigation structure 교체 |
| **Footer** | `Footer.tsx` | Links 교체 |
| **PageContainer** | `<main className="flex-auto">` | ✅ 직접 사용 |

### QETTA-Specific Components

| QETTA Component | Base Component | Additional Logic |
|----------------|---------------|------------------|
| **ConsentToggle** | Checkbox | + Terms modal trigger |
| **TossAuthButton** | Button | + OAuth popup handler |
| **FileDropzone** | Card | + react-dropzone integration |
| **AccountSelector** | Checkbox + Card grid | + Multi-select state |
| **ProgressBar** | Div + Framer Motion | + Real-time updates (SSE) |
| **DebtSummary** | Card grid | + Chart.js integration |
| **PlanComparison** | Card grid (3 cols) | + Comparison table |
| **AccountCard** | Card | + Account data display |

---

## 🎯 Page-Level Component Breakdown

### 1. Home Page (`/`)

#### Layout
```tsx
<div className="relative overflow-hidden">
  <HeroPattern />  {/* Protocol */}
  <div className="relative px-6 lg:px-8">
    <div className="mx-auto max-w-3xl pt-20 pb-32 sm:pt-48 sm:pb-40">
      <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
        3분 만에 채무조정 신청서 완성
      </h1>
      <p className="mt-6 text-lg leading-8 text-zinc-600 dark:text-zinc-400">
        QETTA는 Toss와 오픈뱅킹을 통해 자동으로 금융 데이터를 수집하고,
        AI가 최적의 채무조정 방안을 추천합니다.
      </p>
      <div className="mt-10 flex gap-4">
        <Button href="/register" variant="filled">지금 시작하기</Button>
        <Button href="/about" variant="outline">자세히 알아보기</Button>
      </div>
    </div>
  </div>
</div>
```

#### Components Used
- `HeroPattern` (Protocol) ✅
- `Button` (Protocol) ✅
- Typography (Protocol theme) ✅

---

### 2. Login/Register Pages (`/login`, `/register`)

#### Layout
```tsx
<div className="flex min-h-screen items-center justify-center px-4">
  <Card className="w-full max-w-md">
    <h2 className="text-2xl font-bold mb-6">로그인</h2>
    <form>
      <Field>
        <Label>이메일</Label>
        <Input type="email" name="email" />
      </Field>
      <Field className="mt-4">
        <Label>비밀번호</Label>
        <Input type="password" name="password" />
      </Field>
      <Button type="submit" variant="filled" className="mt-6 w-full">
        로그인
      </Button>
    </form>
    <div className="mt-4 text-center text-sm">
      계정이 없으신가요?{' '}
      <Link href="/register" className="text-emerald-500 hover:text-emerald-600">
        회원가입
      </Link>
    </div>
  </Card>
</div>
```

#### New Components to Create
```tsx
// components/ui/Card.tsx
export function Card({ children, className, ...props }) {
  return (
    <div 
      className={clsx(
        'rounded-2xl bg-white p-8',
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

// components/ui/Input.tsx
export function Input({ className, ...props }) {
  return (
    <input
      className={clsx(
        'block w-full appearance-none rounded-lg px-4 py-3',
        'text-zinc-900 dark:text-white',
        'bg-white dark:bg-zinc-900',
        'ring-1 ring-zinc-900/10 dark:ring-white/10',
        'placeholder:text-zinc-400',
        'focus:outline-none focus:ring-2 focus:ring-emerald-500',
        'disabled:bg-zinc-100 dark:disabled:bg-zinc-800',
        className
      )}
      {...props}
    />
  )
}

// components/ui/Field.tsx
export function Field({ children, className, ...props }) {
  return (
    <div className={clsx('space-y-2', className)} {...props}>
      {children}
    </div>
  )
}

// components/ui/Label.tsx
export function Label({ children, className, ...props }) {
  return (
    <label 
      className={clsx(
        'block text-sm font-medium text-zinc-700 dark:text-zinc-300',
        className
      )}
      {...props}
    >
      {children}
    </label>
  )
}
```

---

### 3. Consent Page (`/consent`)

#### Layout
```tsx
<div className="max-w-3xl mx-auto py-12 px-4">
  <h1 className="text-3xl font-bold mb-8">서비스 이용 동의</h1>
  
  <Card className="mb-6">
    <ConsentToggle
      name="privacy"
      label="개인정보 처리방침 동의 (필수)"
      onViewTerms={() => setShowPrivacyModal(true)}
    />
  </Card>
  
  <Card className="mb-6">
    <ConsentToggle
      name="terms"
      label="서비스 이용약관 동의 (필수)"
      onViewTerms={() => setShowTermsModal(true)}
    />
  </Card>
  
  <Card className="mb-6">
    <ConsentToggle
      name="marketing"
      label="마케팅 정보 수신 동의 (선택)"
    />
  </Card>
  
  <Button 
    variant="filled" 
    className="w-full"
    disabled={!allRequiredConsentsChecked}
  >
    다음 단계로
  </Button>
  
  <TermsModal
    isOpen={showPrivacyModal}
    onClose={() => setShowPrivacyModal(false)}
    title="개인정보 처리방침"
    content={privacyContent}
  />
</div>
```

#### New Components to Create
```tsx
// components/consent/ConsentToggle.tsx
import { Checkbox } from '@headlessui/react'
import { CheckIcon } from '@/components/ui/icons/CheckIcon'

export function ConsentToggle({ name, label, onViewTerms }) {
  const [checked, setChecked] = useState(false)
  
  return (
    <div className="flex items-start gap-4">
      <Checkbox
        checked={checked}
        onChange={setChecked}
        className={clsx(
          'group size-6 rounded-md',
          'bg-white dark:bg-zinc-900',
          'ring-1 ring-zinc-900/10 dark:ring-white/10',
          'data-[checked]:bg-emerald-500',
          'flex items-center justify-center'
        )}
      >
        <CheckIcon className="size-4 text-white opacity-0 group-data-[checked]:opacity-100" />
      </Checkbox>
      
      <div className="flex-1">
        <label className="text-sm font-medium text-zinc-900 dark:text-white">
          {label}
        </label>
        {onViewTerms && (
          <button 
            type="button"
            onClick={onViewTerms}
            className="mt-1 text-xs text-emerald-500 hover:text-emerald-600"
          >
            약관 보기
          </button>
        )}
      </div>
    </div>
  )
}

// components/consent/TermsModal.tsx
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'

export function TermsModal({ isOpen, onClose, title, content }) {
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="max-w-2xl w-full rounded-2xl bg-white dark:bg-zinc-800 p-8 shadow-xl">
          <DialogTitle className="text-2xl font-bold mb-4 text-zinc-900 dark:text-white">
            {title}
          </DialogTitle>
          
          <div className="max-h-96 overflow-y-auto prose prose-zinc dark:prose-invert">
            {content}
          </div>
          
          <Button 
            variant="filled" 
            className="mt-6 w-full"
            onClick={onClose}
          >
            확인
          </Button>
        </DialogPanel>
      </div>
    </Dialog>
  )
}
```

---

### 4. Upload Page (`/upload`)

#### Layout
```tsx
<div className="max-w-5xl mx-auto py-12 px-4">
  <h1 className="text-3xl font-bold mb-8">서류 업로드</h1>
  
  <div className="grid gap-8 lg:grid-cols-2">
    {/* Left: Account Connection */}
    <Card>
      <h2 className="text-xl font-semibold mb-4">계좌 연동</h2>
      <div className="space-y-4">
        <TossAuthButton />
        <KFTCAuthButton />
      </div>
      
      {accounts.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-medium mb-3">연동된 계좌 ({accounts.length}개)</h3>
          <AccountSelector accounts={accounts} />
        </div>
      )}
    </Card>
    
    {/* Right: Document Upload */}
    <Card>
      <h2 className="text-xl font-semibold mb-4">서류 업로드</h2>
      <FileDropzone
        accept={{ 'application/pdf': ['.pdf'], 'image/*': ['.jpg', '.jpeg', '.png'] }}
        maxFiles={10}
        onDrop={handleFileDrop}
      />
      
      {files.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-medium mb-3">업로드된 파일 ({files.length}개)</h3>
          <FileList files={files} onRemove={handleFileRemove} />
        </div>
      )}
    </Card>
  </div>
  
  <Button 
    variant="filled" 
    className="mt-8 w-full"
    disabled={accounts.length === 0 || files.length === 0}
  >
    검증 시작
  </Button>
</div>
```

#### New Components to Create
```tsx
// components/upload/TossAuthButton.tsx
export function TossAuthButton() {
  const { initiateOAuth } = useOAuth('toss')
  
  return (
    <button
      onClick={initiateOAuth}
      className={clsx(
        'w-full flex items-center justify-center gap-3 px-6 py-4',
        'rounded-lg bg-blue-500 hover:bg-blue-600',
        'text-white font-medium transition'
      )}
    >
      <TossIcon className="size-6" />
      Toss로 연동하기
    </button>
  )
}

// components/upload/FileDropzone.tsx
import { useDropzone } from 'react-dropzone'
import { DocumentIcon, PaperClipIcon } from '@/components/ui/icons'

export function FileDropzone({ accept, maxFiles, onDrop }) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept,
    maxFiles,
    onDrop
  })
  
  return (
    <div
      {...getRootProps()}
      className={clsx(
        'relative rounded-lg border-2 border-dashed p-12',
        'transition-colors cursor-pointer',
        isDragActive
          ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10'
          : 'border-zinc-300 dark:border-zinc-700 hover:border-emerald-400'
      )}
    >
      <input {...getInputProps()} />
      <div className="text-center">
        <DocumentIcon className="mx-auto size-12 text-zinc-400" />
        <p className="mt-4 text-sm font-medium text-zinc-700 dark:text-zinc-300">
          {isDragActive ? '파일을 놓으세요' : '파일을 드래그하거나 클릭하세요'}
        </p>
        <p className="mt-2 text-xs text-zinc-500">
          PDF, JPG, PNG (최대 {maxFiles}개)
        </p>
      </div>
    </div>
  )
}

// components/upload/AccountSelector.tsx
export function AccountSelector({ accounts }) {
  const [selected, setSelected] = useState<string[]>([])
  
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {accounts.map((account) => (
        <label
          key={account.id}
          className={clsx(
            'relative flex items-center gap-3 p-4 rounded-lg cursor-pointer',
            'ring-1 ring-zinc-900/10 dark:ring-white/10',
            'transition-colors',
            selected.includes(account.id)
              ? 'bg-emerald-50 dark:bg-emerald-500/10 ring-emerald-500'
              : 'bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800'
          )}
        >
          <input
            type="checkbox"
            checked={selected.includes(account.id)}
            onChange={(e) => {
              if (e.target.checked) {
                setSelected([...selected, account.id])
              } else {
                setSelected(selected.filter(id => id !== account.id))
              }
            }}
            className="sr-only"
          />
          <div className="flex-1">
            <div className="text-sm font-medium text-zinc-900 dark:text-white">
              {account.bankName}
            </div>
            <div className="text-xs text-zinc-500">
              {account.accountNumber}
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm font-semibold text-zinc-900 dark:text-white">
              {formatCurrency(account.balance)}
            </div>
          </div>
        </label>
      ))}
    </div>
  )
}
```

---

### 5. Result Page (`/result`)

#### Layout
```tsx
<div className="max-w-7xl mx-auto py-12 px-4">
  <h1 className="text-3xl font-bold mb-8">분석 결과</h1>
  
  {/* Debt Summary */}
  <DebtSummary data={analysisResult} />
  
  {/* Policy Comparison */}
  <div className="mt-12">
    <h2 className="text-2xl font-bold mb-6">추천 채무조정 방안</h2>
    <PlanComparison plans={matchedPolicies} />
  </div>
  
  {/* Recommendations */}
  <div className="mt-12">
    <h2 className="text-2xl font-bold mb-6">상세 분석</h2>
    <div className="grid gap-6 lg:grid-cols-2">
      <RecommendationCard
        title="단기 조치 (3개월)"
        items={analysisResult.shortTermActions}
      />
      <RecommendationCard
        title="장기 전략 (1-2년)"
        items={analysisResult.longTermStrategy}
      />
    </div>
  </div>
  
  <div className="mt-12 flex gap-4">
    <Button variant="filled" className="flex-1">
      신청서 작성하기
    </Button>
    <Button variant="outline" className="flex-1">
      결과 다운로드 (PDF)
    </Button>
  </div>
</div>
```

#### New Components to Create
```tsx
// components/result/DebtSummary.tsx
export function DebtSummary({ data }) {
  const metrics = [
    { label: '총 채무', value: formatCurrency(data.totalDebt), color: 'pink' },
    { label: '총 자산', value: formatCurrency(data.totalAssets), color: 'emerald' },
    { label: 'DTI', value: `${data.dti}%`, color: data.dti > 40 ? 'pink' : 'sky' },
    { label: '신용등급', value: data.creditGrade, color: 'violet' },
  ]
  
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric) => (
        <Card key={metric.label}>
          <div className="text-sm font-medium text-zinc-500 mb-2">
            {metric.label}
          </div>
          <div className={clsx(
            'text-3xl font-bold',
            `text-${metric.color}-500`
          )}>
            {metric.value}
          </div>
        </Card>
      ))}
    </div>
  )
}

// components/result/PlanComparison.tsx
export function PlanComparison({ plans }) {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {plans.map((plan) => (
        <Card 
          key={plan.id}
          className={clsx(
            plan.recommended && 'ring-2 ring-emerald-500'
          )}
        >
          {plan.recommended && (
            <Tag className="mb-4 bg-emerald-500 text-white">추천</Tag>
          )}
          
          <h3 className="text-xl font-bold mb-4 text-zinc-900 dark:text-white">
            {plan.name}
          </h3>
          
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-zinc-500">감면액</dt>
              <dd className="font-semibold text-emerald-500">
                {formatCurrency(plan.reductionAmount)}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-zinc-500">상환기간</dt>
              <dd className="font-semibold">{plan.repaymentPeriod}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-zinc-500">월 상환액</dt>
              <dd className="font-semibold">{formatCurrency(plan.monthlyPayment)}</dd>
            </div>
          </dl>
          
          <div className="mt-6 pt-6 border-t border-zinc-900/10 dark:border-white/10">
            <div className="text-xs text-zinc-500 mb-2">자격 요건</div>
            <ul className="space-y-1 text-xs text-zinc-600 dark:text-zinc-400">
              {plan.requirements.map((req, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckIcon className="size-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <Button 
            variant={plan.recommended ? 'filled' : 'outline'}
            className="mt-6 w-full"
          >
            이 플랜 선택하기
          </Button>
        </Card>
      ))}
    </div>
  )
}
```

---

### 6. Dashboard Page (`/dashboard`)

#### Layout (Protocol Layout 활용)
```tsx
// Using Protocol Layout.tsx structure
<Layout allSections={{}}>
  <div className="max-w-7xl mx-auto">
    <div className="flex items-center justify-between mb-8">
      <h1 className="text-3xl font-bold">대시보드</h1>
      <Button variant="filled">새 분석 시작</Button>
    </div>
    
    {/* Quick Stats */}
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-12">
      <StatCard label="연동 계좌" value={accounts.length} icon={<BankIcon />} />
      <StatCard label="총 자산" value={formatCurrency(totalAssets)} icon={<CoinIcon />} />
      <StatCard label="총 채무" value={formatCurrency(totalDebt)} icon={<DocumentIcon />} />
      <StatCard label="DTI" value={`${dti}%`} icon={<ChartIcon />} />
    </div>
    
    {/* Accounts Grid */}
    <div className="mb-12">
      <h2 className="text-2xl font-bold mb-6">연동된 계좌</h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {accounts.map(account => (
          <AccountCard key={account.id} account={account} />
        ))}
      </div>
    </div>
    
    {/* Debt Trend Chart */}
    <div className="mb-12">
      <h2 className="text-2xl font-bold mb-6">채무 추이</h2>
      <Card>
        <DebtTrend data={debtHistory} />
      </Card>
    </div>
    
    {/* Recent Applications */}
    <div>
      <h2 className="text-2xl font-bold mb-6">최근 신청서</h2>
      <ApplicationList applications={recentApplications} />
    </div>
  </div>
</Layout>
```

#### Navigation Configuration
```tsx
// services/web/src/app/(app)/layout.tsx
const navigation = [
  {
    title: '대시보드',
    links: [
      { title: '홈', href: '/dashboard' },
      { title: '계좌 관리', href: '/dashboard/accounts' },
      { title: '거래 내역', href: '/dashboard/transactions' },
    ],
  },
  {
    title: '채무 조정',
    links: [
      { title: '새 분석', href: '/consent' },
      { title: '분석 이력', href: '/dashboard/analyses' },
      { title: '신청서 관리', href: '/dashboard/applications' },
    ],
  },
  {
    title: '설정',
    links: [
      { title: '프로필', href: '/settings/profile' },
      { title: '보안', href: '/settings/security' },
      { title: '구독', href: '/settings/subscription' },
    ],
  },
]
```

---

## 🎨 CSS Architecture

### 1. Tailwind Config (tailwind.config.ts)
```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      // Import Protocol theme variables
      fontSize: {
        '2xs': 'var(--text-2xs)',
        xs: 'var(--text-xs)',
        sm: 'var(--text-sm)',
        base: 'var(--text-base)',
        lg: 'var(--text-lg)',
        xl: 'var(--text-xl)',
        '2xl': 'var(--text-2xl)',
        '3xl': 'var(--text-3xl)',
        '4xl': 'var(--text-4xl)',
        '5xl': 'var(--text-5xl)',
      },
      boxShadow: {
        glow: 'var(--shadow-glow)',
      },
      maxWidth: {
        lg: 'var(--container-lg)',
        '2xl': 'var(--container-2xl)',
        '3xl': 'var(--container-3xl)',
        '5xl': 'var(--container-5xl)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}

export default config
```

### 2. Global CSS (src/styles/tailwind.css)
```css
/* Copy from Protocol Template */
@import 'tailwindcss';
@plugin '@tailwindcss/typography';

@theme {
  /* ... all Protocol theme variables ... */
}

@layer base {
  :root {
    /* ... Shiki color tokens for code highlighting ... */
  }
}

/* NO CUSTOM CSS BEYOND THIS POINT */
```

### 3. Component CSS Strategy

#### ❌ FORBIDDEN (Custom CSS)
```css
/* NEVER do this */
.custom-button {
  background: linear-gradient(...);
  border-radius: 12px;
}
```

#### ✅ ALLOWED (Tailwind Utilities)
```tsx
// ALWAYS do this
<button className="bg-gradient-to-r from-emerald-500 to-sky-500 rounded-xl">
  Submit
</button>
```

#### ✅ ALLOWED (Catalyst Pattern - Data Slots)
```tsx
// Use data attributes for dynamic styling
<Button data-slot="icon">
  <PlusIcon />
  Add Account
</Button>

// CSS in Tailwind
// [&>[data-slot=icon]]:size-5
```

---

## 🔄 Animation Strategy

### Protocol Template Animations (Framer Motion)

#### 1. Page Transitions
```tsx
// app/layout.tsx
import { motion } from 'framer-motion'

export default function Layout({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  )
}
```

#### 2. Header Scroll Effect
```tsx
// Already implemented in Protocol Header.tsx
const { scrollY } = useScroll()
const bgOpacityLight = useTransform(scrollY, [0, 72], ['50%', '90%'])
const bgOpacityDark = useTransform(scrollY, [0, 72], ['20%', '80%'])
```

#### 3. Card Entrance
```tsx
<motion.div
  initial={{ opacity: 0, scale: 0.95 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ duration: 0.2 }}
>
  <Card>...</Card>
</motion.div>
```

#### 4. Progress Bar Animation
```tsx
<motion.div
  className="h-2 bg-emerald-500 rounded-full"
  initial={{ width: 0 }}
  animate={{ width: `${progress}%` }}
  transition={{ duration: 0.5, ease: 'easeOut' }}
/>
```

---

## 📱 Responsive Design Patterns

### Breakpoints (Tailwind Default)
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

### Mobile-First Approach
```tsx
// Default: Mobile
// sm: Tablet
// lg: Desktop

<div className="
  px-4              {/* Mobile: 16px padding */}
  sm:px-6           {/* Tablet: 24px padding */}
  lg:px-8           {/* Desktop: 32px padding */}
">
  <div className="
    grid
    gap-4           {/* Mobile: 16px gap */}
    sm:grid-cols-2  {/* Tablet: 2 columns */}
    lg:grid-cols-3  {/* Desktop: 3 columns */}
  ">
    {items.map(item => <Card key={item.id}>{item.content}</Card>)}
  </div>
</div>
```

### Protocol Layout Breakpoints
```tsx
// Sidebar visibility
<aside className="
  hidden          {/* Hidden on mobile */}
  lg:block        {/* Visible on desktop */}
  lg:fixed lg:inset-y-0 lg:left-0
  lg:w-72 xl:w-80 {/* 288px on lg, 320px on xl */}
">
  <Navigation />
</aside>

// Main content offset
<main className="
  w-full
  lg:ml-72 xl:ml-80  {/* Offset by sidebar width */}
">
  {children}
</main>
```

---

## 🧪 Component Testing Strategy

### Unit Tests (Vitest + React Testing Library)
```typescript
// components/ui/Button.test.tsx
import { render, screen } from '@testing-library/react'
import { Button } from './Button'

describe('Button', () => {
  it('renders with primary variant', () => {
    render(<Button variant="primary">Click me</Button>)
    expect(screen.getByRole('button')).toHaveClass('bg-zinc-900')
  })
  
  it('renders as link when href provided', () => {
    render(<Button href="/test">Link</Button>)
    expect(screen.getByRole('link')).toHaveAttribute('href', '/test')
  })
})
```

### E2E Tests (Playwright)
```typescript
// tests/e2e/result-page.spec.ts
import { test, expect } from '@playwright/test'

test('displays debt analysis result', async ({ page }) => {
  await page.goto('/result?analysisId=123')
  
  // Check DebtSummary
  await expect(page.locator('text=총 채무')).toBeVisible()
  await expect(page.locator('text=DTI')).toBeVisible()
  
  // Check PlanComparison
  await expect(page.locator('text=신복위')).toBeVisible()
  await expect(page.locator('text=새출발기금')).toBeVisible()
  await expect(page.locator('text=개인회생')).toBeVisible()
  
  // Check responsive design
  await page.setViewportSize({ width: 375, height: 667 }) // Mobile
  await expect(page.locator('[class*="grid-cols-3"]')).toHaveCSS('grid-template-columns', 'none')
})
```

---

## 📊 Performance Optimization

### 1. Image Optimization
```tsx
import Image from 'next/image'

<Image
  src="/images/hero.jpg"
  alt="QETTA Hero"
  width={1200}
  height={600}
  priority  // Above-the-fold images
  placeholder="blur"
/>
```

### 2. Code Splitting
```tsx
// Dynamic imports for heavy components
const Chart = dynamic(() => import('@/components/dashboard/DebtTrend'), {
  loading: () => <Skeleton />,
  ssr: false  // Client-side only
})
```

### 3. React Query Cache
```typescript
// lib/queryClient.ts
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,     // 5 minutes
      cacheTime: 1000 * 60 * 30,    // 30 minutes
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})
```

### 4. Bundle Size Targets
- **First Load JS**: < 100 KB (gzipped)
- **Total Page Weight**: < 500 KB (with images)
- **Lighthouse Score**: 90+ (all metrics)

---

## 🎯 Accessibility (WCAG 2.1 AA)

### Protocol Template Built-in Features
- ✅ Semantic HTML (`<button>`, `<nav>`, `<main>`)
- ✅ ARIA attributes (Headless UI components)
- ✅ Keyboard navigation (Tab, Enter, Esc)
- ✅ Focus indicators (Protocol Button has `:focus-visible`)
- ✅ Color contrast 4.5:1+ (Zinc scale ensures this)

### Additional QETTA Requirements
```tsx
// Form labels
<label htmlFor="email">이메일</label>
<input id="email" type="email" aria-required="true" />

// Error messages
<input aria-invalid={hasError} aria-describedby="email-error" />
{hasError && <p id="email-error" role="alert">유효한 이메일을 입력하세요</p>}

// Loading states
<Button aria-busy={isLoading} disabled={isLoading}>
  {isLoading ? '처리 중...' : '제출'}
</Button>

// Screen reader text
<span className="sr-only">새 창에서 열림</span>
```

---

## 🚀 Implementation Checklist

### Phase 1: Setup (Day 1-2)
- [ ] Copy Protocol Template files to `services/web/src/components/ui/`
- [ ] Copy `tailwind.css` to `services/web/src/styles/`
- [ ] Configure `tailwind.config.ts` with Protocol theme
- [ ] Test Button, Tag, ThemeToggle components

### Phase 2: Create New Components (Day 3-6)
- [ ] Input, Label, Field
- [ ] Checkbox, Radio, Switch (Headless UI)
- [ ] Card (Protocol styles)
- [ ] Modal/Dialog (Headless UI)
- [ ] Alert (Protocol colors)

### Phase 3: QETTA-Specific Components (Day 7-10)
- [ ] ConsentToggle + TermsModal
- [ ] TossAuthButton + KFTCAuthButton
- [ ] FileDropzone (react-dropzone)
- [ ] AccountSelector
- [ ] ProgressBar (Framer Motion)
- [ ] DebtSummary
- [ ] PlanComparison

### Phase 4: Pages (Day 11-13)
- [ ] Home (`/`)
- [ ] Login/Register (`/login`, `/register`)
- [ ] Consent (`/consent`)
- [ ] Upload (`/upload`)
- [ ] Verify (`/verify`)
- [ ] Result (`/result`)
- [ ] Dashboard (`/dashboard`)
- [ ] Settings (`/settings`)

### Phase 5: Testing (Day 14)
- [ ] Unit tests for all UI components
- [ ] E2E tests for critical user flows
- [ ] Accessibility audit (axe-core)
- [ ] Responsive design check (mobile, tablet, desktop)
- [ ] Lighthouse audit (90+ score)

---

## 📝 Design System Documentation

### Component Library Structure
```
services/web/src/components/
├── ui/                      ← Protocol Template (직접 사용)
│   ├── Button.tsx
│   ├── Tag.tsx
│   ├── Header.tsx
│   ├── Layout.tsx
│   ├── Navigation.tsx
│   ├── Footer.tsx
│   ├── ThemeToggle.tsx
│   └── icons/
├── forms/                   ← 신규 생성 (Protocol 스타일 기반)
│   ├── Input.tsx
│   ├── Label.tsx
│   ├── Field.tsx
│   ├── Checkbox.tsx
│   ├── Radio.tsx
│   ├── Switch.tsx
│   ├── Select.tsx
│   └── Textarea.tsx
├── feedback/                ← 신규 생성
│   ├── Alert.tsx
│   ├── Modal.tsx
│   └── Toast.tsx
├── data-display/            ← 신규 생성
│   ├── Card.tsx
│   ├── Table.tsx
│   └── Badge.tsx (alias to Tag)
├── auth/                    ← QETTA 특화
│   ├── LoginForm.tsx
│   ├── RegisterForm.tsx
│   └── TossAuthButton.tsx
├── consent/                 ← QETTA 특화
│   ├── ConsentToggle.tsx
│   └── TermsModal.tsx
├── upload/                  ← QETTA 특화
│   ├── FileDropzone.tsx
│   ├── AccountSelector.tsx
│   └── FileList.tsx
├── result/                  ← QETTA 특화
│   ├── DebtSummary.tsx
│   ├── PlanComparison.tsx
│   └── RecommendationCard.tsx
└── dashboard/               ← QETTA 특화
    ├── AccountCard.tsx
    ├── DebtTrend.tsx
    └── ApplicationList.tsx
```

---

**최종 업데이트**: 2025-10-28  
**Next Step**: Day 1 프로젝트 초기 설정 시작
