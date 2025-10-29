/**
 * React Query key factory
 * Centralized query key management
 */

export const queryKeys = {
  // Auth
  auth: {
    me: ['auth', 'me'] as const,
    session: ['auth', 'session'] as const,
  },

  // OAuth
  oauth: {
    connections: (userId: string) => ['oauth', 'connections', userId] as const,
    connection: (userId: string, provider: string) =>
      ['oauth', 'connection', userId, provider] as const,
  },

  // Accounts
  accounts: {
    all: (userId: string) => ['accounts', userId] as const,
    detail: (accountId: string) => ['accounts', 'detail', accountId] as const,
  },

  // Transactions
  transactions: {
    all: (accountId: string, page: number, limit: number) =>
      ['transactions', accountId, page, limit] as const,
    detail: (transactionId: string) => ['transactions', 'detail', transactionId] as const,
  },

  // Documents
  documents: {
    all: (userId: string) => ['documents', userId] as const,
    detail: (documentId: string) => ['documents', 'detail', documentId] as const,
    verification: (documentId: string) =>
      ['documents', 'verification', documentId] as const,
  },

  // Debt Analysis
  debt: {
    analyses: (userId: string) => ['debt', 'analyses', userId] as const,
    latest: (userId: string) => ['debt', 'latest', userId] as const,
    detail: (analysisId: string) => ['debt', 'detail', analysisId] as const,
    policies: (analysisId: string) => ['debt', 'policies', analysisId] as const,
  },

  // Applications
  applications: {
    all: (userId: string) => ['applications', userId] as const,
    detail: (applicationId: string) => ['applications', 'detail', applicationId] as const,
  },

  // User
  user: {
    profile: (userId: string) => ['user', 'profile', userId] as const,
  },
};
