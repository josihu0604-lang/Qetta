/**
 * Dashboard API Hook
 * 
 * Fetches dashboard data including summary, transactions, and insights.
 */

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

interface DashboardSummary {
  totalAssets: number;
  totalDebts: number;
  netWorth: number;
  creditScore: number;
}

interface Transaction {
  id: number;
  date: string;
  description: string;
  amount: number;
  type: 'income' | 'expense' | 'transfer';
}

interface Insight {
  id: number;
  title: string;
  description: string;
  type: 'success' | 'warning' | 'info';
}

interface DashboardData {
  user: {
    name: string;
    lastSync: string;
  };
  summary: DashboardSummary;
  recentTransactions: Transaction[];
  insights: Insight[];
}

export function useDashboard() {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => {
      // TODO: Replace with actual API call when backend is ready
      // return apiClient.get<DashboardData>('/api/v1/dashboard');
      
      // Mock data for now
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      return {
        user: {
          name: '김헤파이스토스',
          lastSync: new Date().toLocaleString('ko-KR'),
        },
        summary: {
          totalAssets: 45_800_000,
          totalDebts: 12_500_000,
          netWorth: 33_300_000,
          creditScore: 820,
        },
        recentTransactions: [
          { id: 1, date: '2025-10-28', description: '월급', amount: 3_500_000, type: 'income' as const },
          { id: 2, date: '2025-10-27', description: '카드대금', amount: -450_000, type: 'expense' as const },
          { id: 3, date: '2025-10-26', description: '저축', amount: -1_000_000, type: 'transfer' as const },
        ],
        insights: [
          { id: 1, title: '이자 절감 기회', description: '신용대출 금리 인하 가능', type: 'success' as const },
          { id: 2, title: '대출 상환 알림', description: '다음 달 상환일: 11월 15일', type: 'warning' as const },
        ],
      } as DashboardData;
    },
  });
}
