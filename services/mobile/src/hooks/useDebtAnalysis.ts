/**
 * Debt Analysis API Hook
 * 
 * Fetches debt analysis data including breakdown, AI insights, and recommendations.
 */

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

interface DebtBreakdown {
  type: string;
  amount: number;
  percentage: number;
  color: string;
}

interface Recommendation {
  id: number;
  title: string;
  description: string;
  potentialSavings: number;
  priority: 'high' | 'medium' | 'low';
}

interface SimulationScenario {
  id: number;
  name: string;
  monthlyPayment: number;
  totalInterest: number;
  payoffMonths: number;
}

interface DebtAnalysisData {
  totalDebt: number;
  monthlyPayment: number;
  averageInterestRate: number;
  breakdown: DebtBreakdown[];
  aiInsight: string;
  recommendations: Recommendation[];
  simulationScenarios: SimulationScenario[];
  debtToIncomeRatio: number;
  creditUtilizationRate: number;
}

export function useDebtAnalysis() {
  return useQuery({
    queryKey: ['debt-analysis'],
    queryFn: async () => {
      // TODO: Replace with actual API call
      // return apiClient.get<DebtAnalysisData>('/api/v1/debt-analysis');
      
      await new Promise((resolve) => setTimeout(resolve, 100)); // Reduced delay for better UX
      
      return {
        totalDebt: 18_700_000,
        monthlyPayment: 850_000,
        averageInterestRate: 5.2,
        breakdown: [
          {
            type: '신용대출',
            amount: 10_000_000,
            percentage: 53.5,
            color: '#ef4444',
          },
          {
            type: '학자금대출',
            amount: 5_000_000,
            percentage: 26.7,
            color: '#f59e0b',
          },
          {
            type: '신용카드',
            amount: 2_500_000,
            percentage: 13.4,
            color: '#eab308',
          },
          {
            type: '기타',
            amount: 1_200_000,
            percentage: 6.4,
            color: '#84cc16',
          },
        ],
        aiInsight: '현재 부채 상황은 관리 가능한 수준입니다. 신용대출 금리가 높은 편이므로, 저금리 대환 대출을 고려하시면 연간 약 120만원의 이자를 절감할 수 있습니다.',
        recommendations: [
          {
            id: 1,
            title: '저금리 대환 대출',
            description: '현재 4.5% → 3.2% 금리로 대환 가능',
            potentialSavings: 1_200_000,
            priority: 'high' as const,
          },
          {
            id: 2,
            title: '신용카드 대금 일시 상환',
            description: '카드 대금을 먼저 상환하면 고금리 부담 감소',
            potentialSavings: 450_000,
            priority: 'high' as const,
          },
          {
            id: 3,
            title: '학자금대출 거치기간 활용',
            description: '거치기간 연장으로 월 상환액 부담 경감',
            potentialSavings: 300_000,
            priority: 'medium' as const,
          },
          {
            id: 4,
            title: '소득공제 혜택 활용',
            description: '학자금 대출 이자 소득공제 신청',
            potentialSavings: 150_000,
            priority: 'low' as const,
          },
        ],
        simulationScenarios: [
          {
            id: 1,
            name: '현재 유지',
            monthlyPayment: 850_000,
            totalInterest: 3_200_000,
            payoffMonths: 24,
          },
          {
            id: 2,
            name: '월 50만원 추가 상환',
            monthlyPayment: 1_350_000,
            totalInterest: 2_100_000,
            payoffMonths: 15,
          },
          {
            id: 3,
            name: '대환 대출 활용',
            monthlyPayment: 750_000,
            totalInterest: 2_000_000,
            payoffMonths: 26,
          },
        ],
        debtToIncomeRatio: 35.2,
        creditUtilizationRate: 28.5,
      } as DebtAnalysisData;
    },
  });
}
