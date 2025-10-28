import { z } from 'zod';

/**
 * Credit grade enum
 */
export type CreditGrade = 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR';

/**
 * Policy type enum
 */
export type PolicyType = 'CREDIT_COUNSELING' | 'FRESH_START_FUND' | 'PERSONAL_REHABILITATION';

/**
 * Debt analysis schema
 */
export const DebtAnalysisSchema = z.object({
  id: z.string().cuid(),
  userId: z.string().cuid(),
  totalDebt: z.number(),
  totalAssets: z.number(),
  monthlyIncome: z.number(),
  monthlyExpenses: z.number(),
  dti: z.number(),
  dsr: z.number(),
  creditGrade: z.enum(['EXCELLENT', 'GOOD', 'FAIR', 'POOR']),
  analysisDate: z.date(),
  createdAt: z.date(),
});

export type DebtAnalysis = z.infer<typeof DebtAnalysisSchema>;

/**
 * Policy match schema
 */
export const PolicyMatchSchema = z.object({
  id: z.string().cuid(),
  debtAnalysisId: z.string().cuid(),
  policyType: z.enum(['CREDIT_COUNSELING', 'FRESH_START_FUND', 'PERSONAL_REHABILITATION']),
  eligibilityScore: z.number().min(0).max(100),
  estimatedBenefit: z.number(),
  monthlyPayment: z.number().nullable(),
  repaymentPeriod: z.number().int().nullable(),
  requirements: z.array(z.string()),
  processingTime: z.string().nullable(),
  contactInfo: z.any().nullable(),
  createdAt: z.date(),
});

export type PolicyMatch = z.infer<typeof PolicyMatchSchema>;

/**
 * Debt analysis request
 */
export const DebtAnalysisRequestSchema = z.object({
  userId: z.string().cuid(),
  includeAllAccounts: z.boolean().default(true),
  accountIds: z.array(z.string().cuid()).optional(),
});

export type DebtAnalysisRequest = z.infer<typeof DebtAnalysisRequestSchema>;

/**
 * DTI/DSR thresholds
 */
export const DTI_THRESHOLDS = {
  EXCELLENT: 40,
  GOOD: 100,
  WARNING: 200,
} as const;

export const DSR_THRESHOLDS = {
  EXCELLENT: 30,
  GOOD: 40,
  WARNING: 50,
} as const;
