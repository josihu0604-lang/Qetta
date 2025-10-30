/**
 * API Response Types
 */

// Generic API Response
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
  meta?: Record<string, unknown>
  timestamp?: string
}

// User Types
export interface User {
  id: string
  name: string
  email: string
  phone?: string
  birthDate?: string
  createdAt: string
  updatedAt: string
}

// Debt Types
export type DebtType = 'personal_loan' | 'credit_line' | 'installment' | 'mortgage' | 'student_loan'

export interface Debt {
  id: string
  userId: string
  accountName: string
  type: DebtType
  totalAmount: number
  currentBalance: number
  interestRate: number
  monthlyPayment: number
  dueDate: string
  startDate: string
  createdAt: string
  updatedAt: string
}

// Debt Analysis Types
export interface DebtSummary {
  totalDebt: number
  totalMonthlyPayment: number
  averageInterestRate: number
  debtCount: number
}

export interface DebtCategory {
  category: string
  name: string
  amount: number
  percentage: number
  interestRate: number
  color: string
}

export interface DebtTrend {
  labels: string[]
  data: number[]
  prediction?: number[]
}

export interface DebtRecommendation {
  id: string
  priority: 'high' | 'medium' | 'low'
  title: string
  description: string
  potentialSaving: number
}

export interface PayoffStrategy {
  totalMonths: number
  totalInterest: number
  payoffDate: string
  saving?: number
}

export interface DebtAnalysis {
  summary: DebtSummary
  byCategory: DebtCategory[]
  trend: DebtTrend
  recommendations: DebtRecommendation[]
  payoffPlan: {
    currentStrategy: PayoffStrategy
    optimizedStrategy: PayoffStrategy
  }
}

// Policy Types
export type PolicyCategory =
  | 'loan_refinance'
  | 'emergency_loan'
  | 'housing_support'
  | 'debt_adjustment'
  | 'financial_education'

export interface PolicyEligibility {
  creditScore: string
  income: string
  age: string
  other?: string
}

export interface Policy {
  id: string
  title: string
  category: PolicyCategory
  provider: string
  description: string
  targetAudience: string
  benefits: string[]
  eligibility: PolicyEligibility
  applicationProcess: string[]
  estimatedSaving: number
  matchScore: number
  tags: string[]
  url: string
  phone: string
  applicationDeadline: string | null
  createdAt: string
}

// Health Check
export interface HealthResponse {
  status: 'healthy' | 'unhealthy'
  timestamp: string
  service: string
  version: string
}
