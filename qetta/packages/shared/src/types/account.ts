import { z } from 'zod';

/**
 * Account type enum
 */
export type AccountType = 'CHECKING' | 'SAVINGS' | 'LOAN' | 'CREDIT';

/**
 * Account schema
 */
export const AccountSchema = z.object({
  id: z.string().cuid(),
  userId: z.string().cuid(),
  provider: z.enum(['toss', 'kftc']),
  accountNumber: z.string(),
  accountName: z.string(),
  accountType: z.enum(['CHECKING', 'SAVINGS', 'LOAN', 'CREDIT']),
  bankName: z.string(),
  bankCode: z.string().nullable(),
  balance: z.number(),
  availableAmount: z.number().nullable(),
  currency: z.string().default('KRW'),
  isActive: z.boolean().default(true),
  lastSyncAt: z.date().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Account = z.infer<typeof AccountSchema>;

/**
 * Transaction type enum
 */
export type TransactionType = 'DEPOSIT' | 'WITHDRAWAL' | 'TRANSFER';

/**
 * Transaction schema
 */
export const TransactionSchema = z.object({
  id: z.string().cuid(),
  accountId: z.string().cuid(),
  transactionDate: z.date(),
  transactionTime: z.string().nullable(),
  transactionType: z.enum(['DEPOSIT', 'WITHDRAWAL', 'TRANSFER']),
  amount: z.number(),
  balance: z.number().nullable(),
  merchantName: z.string().nullable(),
  category: z.string().nullable(),
  memo: z.string().nullable(),
  externalId: z.string().nullable(),
  createdAt: z.date(),
});

export type Transaction = z.infer<typeof TransactionSchema>;

/**
 * Pagination parameters
 */
export const PaginationSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(50),
});

export type PaginationParams = z.infer<typeof PaginationSchema>;

/**
 * Paginated response
 */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
