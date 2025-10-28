# Hephaitos 프론트엔드 컴포넌트 설계

**프레임워크**: Next.js 15 + React 19 + TypeScript  
**스타일링**: TailwindCSS 4 + Shadcn UI  
**상태 관리**: React Query + Zustand

---

## 📋 컴포넌트 계층 구조

```
app/
├── layout.tsx              # 루트 레이아웃
├── page.tsx                # 메인 (랜딩)
│
├── (auth)/                 # 인증 그룹
│   ├── login/
│   └── register/
│
├── consent/                # 동의 페이지
├── upload/                 # 업로드/계좌 연결
├── verify/                 # 검증 진행
├── result/[id]/            # 결과 + 조정 시뮬레이션 ⭐
│
├── dashboard/              # 대시보드
│   ├── page.tsx            # 홈
│   ├── accounts/           # 계좌 관리
│   ├── history/            # 히스토리
│   └── settings/           # 설정
│
└── oauth/                  # OAuth 관리

components/
├── ui/                     # Shadcn UI 기본 컴포넌트
│   ├── button.tsx
│   ├── card.tsx
│   ├── dialog.tsx
│   ├── input.tsx
│   ├── select.tsx
│   ├── table.tsx
│   └── ... (30+ 컴포넌트)
│
├── layout/                 # 레이아웃
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── Sidebar.tsx
│   └── AuthGuard.tsx
│
├── consent/                # 동의 관련
│   ├── ConsentToggle.tsx
│   ├── TossAuthButton.tsx
│   └── BankConnectButton.tsx
│
├── upload/                 # 업로드 관련
│   ├── FileDropzone.tsx
│   ├── AccountSelector.tsx
│   ├── SyncButton.tsx
│   └── ProgressBar.tsx
│
├── verify/                 # 검증 관련
│   ├── VerifyCard.tsx
│   ├── SeverityPill.tsx
│   └── IssueList.tsx
│
├── result/                 # 결과 관련 ⭐⭐⭐
│   ├── DebtSummary.tsx
│   ├── DebtChart.tsx
│   ├── PlanComparison.tsx
│   ├── PlanCard.tsx
│   └── ApplyButton.tsx
│
└── dashboard/              # 대시보드 관련
    ├── AccountCard.tsx
    ├── DebtTrend.tsx
    ├── QuickActions.tsx
    ├── HistoryTable.tsx
    └── StatCard.tsx
```

---

## 🎨 디자인 시스템

### 컬러 팔레트
```typescript
// tailwind.config.ts
const colors = {
  // 브랜드 컬러
  primary: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    500: '#0ea5e9',  // 메인 브랜드
    600: '#0284c7',
    700: '#0369a1',
  },
  
  // 시맨틱 컬러
  success: {
    500: '#10b981',  // 녹색 (성공)
    600: '#059669',
  },
  warning: {
    500: '#f59e0b',  // 주황 (경고)
    600: '#d97706',
  },
  danger: {
    500: '#ef4444',  // 빨강 (위험)
    600: '#dc2626',
  },
  
  // Severity 매핑
  severity: {
    INFO: '#3b82f6',    // 파랑
    WARN: '#f59e0b',    // 주황
    CRIT: '#ef4444',    // 빨강
  }
};
```

### 타이포그래피
```typescript
// 폰트
fonts: {
  sans: ['Pretendard', 'system-ui', 'sans-serif'],
  mono: ['JetBrains Mono', 'monospace'],
}

// 폰트 크기
fontSize: {
  xs: '0.75rem',    // 12px
  sm: '0.875rem',   // 14px
  base: '1rem',     // 16px
  lg: '1.125rem',   // 18px
  xl: '1.25rem',    // 20px
  '2xl': '1.5rem',  // 24px
  '3xl': '1.875rem', // 30px
  '4xl': '2.25rem',  // 36px
}

// 폰트 굵기
fontWeight: {
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
}
```

### 간격 시스템
```typescript
// 8px 베이스
spacing: {
  0: '0',
  1: '0.25rem',  // 4px
  2: '0.5rem',   // 8px
  3: '0.75rem',  // 12px
  4: '1rem',     // 16px
  6: '1.5rem',   // 24px
  8: '2rem',     // 32px
  12: '3rem',    // 48px
  16: '4rem',    // 64px
}
```

---

## 🧩 핵심 컴포넌트 상세

### 1. Layout 컴포넌트

#### Header.tsx
```typescript
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function Header() {
  const { user, logout } = useAuth()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-primary-600">
            hephaitos
          </span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center space-x-6">
          {user ? (
            <>
              <Link href="/dashboard" className="text-sm font-medium">
                대시보드
              </Link>
              <Link href="/upload" className="text-sm font-medium">
                분석하기
              </Link>
              <Link href="/dashboard/history" className="text-sm font-medium">
                히스토리
              </Link>
              
              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar>
                      <AvatarFallback>
                        {user.name?.[0] || user.email[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/settings">설정</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={logout}>
                    로그아웃
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost">로그인</Button>
              </Link>
              <Link href="/register">
                <Button>시작하기</Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
```

#### Footer.tsx
```typescript
export function Footer() {
  return (
    <footer className="border-t bg-gray-50">
      <div className="container py-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Company */}
          <div>
            <h3 className="font-semibold mb-3">hephaitos</h3>
            <p className="text-sm text-gray-600">
              채무조정 자동화 플랫폼
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-semibold mb-3">제품</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link href="/features">기능</Link></li>
              <li><Link href="/pricing">가격</Link></li>
              <li><Link href="/docs">문서</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold mb-3">회사</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link href="/about">소개</Link></li>
              <li><Link href="/contact">문의</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold mb-3">법적 고지</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link href="/privacy">개인정보처리방침</Link></li>
              <li><Link href="/terms">이용약관</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t pt-8 text-center text-sm text-gray-600">
          © 2025 hephaitos. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
```

---

### 2. Consent 페이지 컴포넌트

#### ConsentToggle.tsx
```typescript
'use client'

import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'

interface ConsentToggleProps {
  id: string
  label: string
  description?: string
  required?: boolean
  checked: boolean
  onCheckedChange: (checked: boolean) => void
}

export function ConsentToggle({
  id,
  label,
  description,
  required,
  checked,
  onCheckedChange,
}: ConsentToggleProps) {
  return (
    <div className="flex items-start space-x-3 rounded-lg border p-4">
      <Checkbox
        id={id}
        checked={checked}
        onCheckedChange={onCheckedChange}
      />
      <div className="flex-1">
        <Label
          htmlFor={id}
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
        {description && (
          <p className="text-sm text-gray-500 mt-1">{description}</p>
        )}
      </div>
    </div>
  )
}
```

#### TossAuthButton.tsx
```typescript
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/useToast'

export function TossAuthButton() {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleAuth = async () => {
    setLoading(true)
    try {
      // OAuth 팝업 열기
      const width = 500
      const height = 600
      const left = (window.screen.width - width) / 2
      const top = (window.screen.height - height) / 2

      const popup = window.open(
        '/api/v1/oauth/toss/authorize',
        'toss_auth',
        `width=${width},height=${height},left=${left},top=${top}`
      )

      // 팝업 메시지 리스너
      const handleMessage = (event: MessageEvent) => {
        if (event.data.type === 'TOSS_AUTH_SUCCESS') {
          toast({
            title: '본인인증 완료',
            description: '본인인증이 성공적으로 완료되었습니다.',
          })
          popup?.close()
          window.removeEventListener('message', handleMessage)
        }
      }

      window.addEventListener('message', handleMessage)
    } catch (error) {
      toast({
        title: '인증 실패',
        description: '본인인증에 실패했습니다. 다시 시도해주세요.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      onClick={handleAuth}
      disabled={loading}
      className="w-full"
      size="lg"
    >
      {loading ? '인증 중...' : '토스 본인인증'}
    </Button>
  )
}
```

---

### 3. Upload/Sync 컴포넌트

#### AccountSelector.tsx
```typescript
'use client'

import { useState } from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatCurrency } from '@/lib/format'

interface Account {
  id: string
  bankName: string
  accountNumber: string
  accountType: string
  balance: number
  lastSyncedAt: string | null
}

interface AccountSelectorProps {
  accounts: Account[]
  selectedAccounts: string[]
  onSelectionChange: (selected: string[]) => void
}

export function AccountSelector({
  accounts,
  selectedAccounts,
  onSelectionChange,
}: AccountSelectorProps) {
  const toggleAccount = (accountId: string) => {
    if (selectedAccounts.includes(accountId)) {
      onSelectionChange(selectedAccounts.filter((id) => id !== accountId))
    } else {
      onSelectionChange([...selectedAccounts, accountId])
    }
  }

  const toggleAll = () => {
    if (selectedAccounts.length === accounts.length) {
      onSelectionChange([])
    } else {
      onSelectionChange(accounts.map((a) => a.id))
    }
  }

  return (
    <div className="space-y-4">
      {/* 전체 선택 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Checkbox
            checked={selectedAccounts.length === accounts.length}
            onCheckedChange={toggleAll}
          />
          <span className="text-sm font-medium">전체 선택</span>
        </div>
        <Badge variant="secondary">
          {selectedAccounts.length} / {accounts.length} 선택
        </Badge>
      </div>

      {/* 계좌 목록 */}
      <div className="grid gap-3">
        {accounts.map((account) => (
          <Card
            key={account.id}
            className={`p-4 cursor-pointer transition-colors ${
              selectedAccounts.includes(account.id)
                ? 'border-primary-500 bg-primary-50'
                : 'hover:border-gray-300'
            }`}
            onClick={() => toggleAccount(account.id)}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <Checkbox
                  checked={selectedAccounts.includes(account.id)}
                  onCheckedChange={() => toggleAccount(account.id)}
                />
                <div>
                  <div className="font-medium">{account.bankName}</div>
                  <div className="text-sm text-gray-500">
                    {account.accountNumber}
                  </div>
                  <Badge variant="outline" className="mt-1">
                    {account.accountType}
                  </Badge>
                </div>
              </div>

              <div className="text-right">
                <div
                  className={`font-semibold ${
                    account.balance < 0 ? 'text-red-600' : 'text-gray-900'
                  }`}
                >
                  {formatCurrency(account.balance)}
                </div>
                {account.lastSyncedAt && (
                  <div className="text-xs text-gray-500 mt-1">
                    최근 동기화: {new Date(account.lastSyncedAt).toLocaleDateString()}
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
```

#### FileDropzone.tsx
```typescript
'use client'

import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { UploadIcon } from 'lucide-react'

interface FileDropzoneProps {
  onDrop: (files: File[]) => void
  accept?: Record<string, string[]>
  maxSize?: number
  disabled?: boolean
}

export function FileDropzone({
  onDrop,
  accept = {
    'application/pdf': ['.pdf'],
    'image/*': ['.jpg', '.jpeg', '.png'],
  },
  maxSize = 10 * 1024 * 1024, // 10MB
  disabled = false,
}: FileDropzoneProps) {
  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop,
    accept,
    maxSize,
    disabled,
  })

  return (
    <div
      {...getRootProps()}
      className={`
        border-2 border-dashed rounded-lg p-12 text-center cursor-pointer
        transition-colors
        ${
          isDragActive
            ? 'border-primary-500 bg-primary-50'
            : 'border-gray-300 hover:border-gray-400'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}
    >
      <input {...getInputProps()} />
      
      <UploadIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
      
      {isDragActive ? (
        <p className="text-lg font-medium">파일을 여기에 놓으세요...</p>
      ) : (
        <div>
          <p className="text-lg font-medium mb-2">
            파일을 드래그하거나 클릭하여 선택
          </p>
          <p className="text-sm text-gray-500">
            PDF, JPG, PNG (최대 {maxSize / (1024 * 1024)}MB)
          </p>
        </div>
      )}

      {fileRejections.length > 0 && (
        <p className="text-sm text-red-500 mt-4">
          일부 파일이 거부되었습니다. 파일 형식과 크기를 확인해주세요.
        </p>
      )}
    </div>
  )
}
```

---

### 4. Result 페이지 컴포넌트 (최중요 ⭐⭐⭐)

#### DebtSummary.tsx
```typescript
interface DebtSummaryProps {
  totalDebt: number
  monthlyPayment: number
  dti: number
  creditGrade: string
}

export function DebtSummary({
  totalDebt,
  monthlyPayment,
  dti,
  creditGrade,
}: DebtSummaryProps) {
  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-6">현재 채무 상황</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <div className="text-sm text-gray-500 mb-1">총 부채액</div>
          <div className="text-2xl font-bold text-red-600">
            {formatCurrency(totalDebt)}
          </div>
        </div>

        <div>
          <div className="text-sm text-gray-500 mb-1">월 상환액</div>
          <div className="text-2xl font-bold">
            {formatCurrency(monthlyPayment)}
          </div>
        </div>

        <div>
          <div className="text-sm text-gray-500 mb-1">DTI</div>
          <div className={`text-2xl font-bold ${
            dti > 300 ? 'text-red-600' : dti > 200 ? 'text-yellow-600' : 'text-green-600'
          }`}>
            {dti.toFixed(1)}%
          </div>
        </div>

        <div>
          <div className="text-sm text-gray-500 mb-1">신용등급</div>
          <div className="text-2xl font-bold">
            {creditGrade}
          </div>
        </div>
      </div>

      {dti > 300 && (
        <div className="mt-4 p-4 bg-red-50 rounded-lg">
          <p className="text-sm text-red-700">
            ⚠️ DTI가 매우 높습니다. 채무조정을 적극 권장합니다.
          </p>
        </div>
      )}
    </Card>
  )
}
```

#### PlanComparison.tsx
```typescript
import { Check } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface Plan {
  planType: string
  adjustedPayment: number
  adjustedInterestRate: number
  estimatedPeriod: number
  totalSavings: number
  debtReductionRate: number
  isRecommended: boolean
}

interface PlanComparisonProps {
  currentPayment: number
  plans: Plan[]
  onSelectPlan: (plan: Plan) => void
}

export function PlanComparison({
  currentPayment,
  plans,
  onSelectPlan,
}: PlanComparisonProps) {
  const planNames = {
    SHINBOK_PRE_WORKOUT: '신복위 프리워크아웃',
    FRESH_START_FUND: '새출발기금',
    INDIVIDUAL_RECOVERY: '개인회생',
  }

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-6">조정 시뮬레이션 비교</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {plans.map((plan) => (
          <Card
            key={plan.planType}
            className={`p-6 ${
              plan.isRecommended ? 'border-2 border-primary-500' : ''
            }`}
          >
            {plan.isRecommended && (
              <Badge className="mb-4">추천</Badge>
            )}

            <h3 className="font-bold text-lg mb-4">
              {planNames[plan.planType]}
            </h3>

            {/* 월 상환액 */}
            <div className="mb-6">
              <div className="text-sm text-gray-500 mb-1">월 상환액</div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-primary-600">
                  {formatCurrency(plan.adjustedPayment)}
                </span>
                <span className="text-sm text-gray-500 line-through">
                  {formatCurrency(currentPayment)}
                </span>
              </div>
              <div className="text-sm text-green-600 font-medium mt-1">
                ↓ {formatCurrency(currentPayment - plan.adjustedPayment)} 절감
              </div>
            </div>

            {/* 상세 정보 */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-green-500" />
                <span>금리 {plan.adjustedInterestRate}%</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-green-500" />
                <span>상환 기간 {plan.estimatedPeriod}개월</span>
              </div>
              {plan.debtReductionRate > 0 && (
                <div className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-green-500" />
                  <span>원금 {(plan.debtReductionRate * 100).toFixed(0)}% 탕감</span>
                </div>
              )}
            </div>

            {/* 총 절감액 */}
            <div className="p-3 bg-primary-50 rounded-lg mb-4">
              <div className="text-sm text-gray-600">총 절감 예상액</div>
              <div className="text-xl font-bold text-primary-600">
                {formatCurrency(plan.totalSavings)}
              </div>
            </div>

            <Button
              onClick={() => onSelectPlan(plan)}
              className="w-full"
              variant={plan.isRecommended ? 'default' : 'outline'}
            >
              이 플랜 선택
            </Button>
          </Card>
        ))}
      </div>
    </Card>
  )
}
```

---

### 5. Dashboard 컴포넌트

#### AccountCard.tsx
```typescript
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { RefreshCw } from 'lucide-react'

interface AccountCardProps {
  bankName: string
  accountNumber: string
  balance: number
  accountType: string
  lastSyncedAt: string | null
  onSync: () => void
}

export function AccountCard({
  bankName,
  accountNumber,
  balance,
  accountType,
  lastSyncedAt,
  onSync,
}: AccountCardProps) {
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="font-semibold">{bankName}</div>
          <div className="text-sm text-gray-500">{accountNumber}</div>
        </div>
        <Badge variant="outline">{accountType}</Badge>
      </div>

      <div className={`text-2xl font-bold mb-3 ${
        balance < 0 ? 'text-red-600' : 'text-gray-900'
      }`}>
        {formatCurrency(balance)}
      </div>

      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>
          {lastSyncedAt
            ? `최근 동기화: ${new Date(lastSyncedAt).toLocaleDateString()}`
            : '동기화 필요'}
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={onSync}
          className="h-6 px-2"
        >
          <RefreshCw className="w-3 h-3 mr-1" />
          동기화
        </Button>
      </div>
    </Card>
  )
}
```

---

## 🎣 Custom Hooks

### useAuth.ts
```typescript
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  id: string
  email: string
  name: string
}

interface AuthStore {
  user: User | null
  accessToken: string | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  setUser: (user: User) => void
}

export const useAuth = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,

      login: async (email, password) => {
        const response = await fetch('/api/v1/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        })
        const data = await response.json()
        set({ user: data.user, accessToken: data.accessToken })
      },

      logout: () => {
        set({ user: null, accessToken: null })
      },

      setUser: (user) => {
        set({ user })
      },
    }),
    {
      name: 'auth-storage',
    }
  )
)
```

### useAccounts.ts
```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'

export function useAccounts() {
  const queryClient = useQueryClient()

  const { data: accounts, isLoading } = useQuery({
    queryKey: ['accounts'],
    queryFn: () => api.get('/accounts'),
  })

  const syncMutation = useMutation({
    mutationFn: () => api.post('/accounts/sync'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] })
    },
  })

  return {
    accounts: accounts?.accounts || [],
    isLoading,
    sync: syncMutation.mutate,
    isSyncing: syncMutation.isPending,
  }
}
```

---

## 📱 반응형 디자인

### 브레이크포인트
```typescript
// tailwind.config.ts
screens: {
  'sm': '640px',   // Mobile
  'md': '768px',   // Tablet
  'lg': '1024px',  // Desktop
  'xl': '1280px',  // Large Desktop
  '2xl': '1536px', // Extra Large
}

// 사용 예
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
```

### 모바일 우선 설계
```typescript
// ✅ Good (Mobile First)
<div className="text-sm md:text-base lg:text-lg">

// ❌ Bad (Desktop First)
<div className="text-lg lg:text-base md:text-sm">
```

---

**마지막 업데이트**: 2025-10-26
