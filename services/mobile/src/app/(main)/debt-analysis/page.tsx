/**
 * Debt Analysis Page - 부채 분석 및 시각화
 * 
 * Features:
 * - 총 부채 현황
 * - 부채 종류별 분포 (도넛 차트)
 * - 금리 비교
 * - 상환 계획 시뮬레이션
 * - AI 기반 부채 감소 제안
 */

'use client';

import {
  Heading,
  Text,
  Badge,
  Button,
  Divider,
} from '@hephaitos/ui';
import { useDebtAnalysis } from '@/hooks/useDebtAnalysis';
import { DebtDonutChart } from '@/components/charts/DebtDonutChart';
import { useState } from 'react';

// REMOVED Mock data - now using useDebtAnalysis hook
const mockDebtDataOLD = {
  totalDebt: 12_500_000,
  monthlyPayment: 850_000,
  averageInterestRate: 5.2,
  debts: [
    {
      id: 1,
      type: '신용대출',
      lender: 'KB국민은행',
      principal: 10_000_000,
      remaining: 7_500_000,
      interestRate: 4.5,
      monthlyPayment: 650_000,
      remainingMonths: 12,
      priority: 'high',
    },
    {
      id: 2,
      type: '카드론',
      lender: '삼성카드',
      principal: 3_000_000,
      remaining: 2_500_000,
      interestRate: 8.5,
      monthlyPayment: 200_000,
      remainingMonths: 15,
      priority: 'urgent',
    },
    {
      id: 3,
      type: '학자금대출',
      lender: '한국장학재단',
      principal: 5_000_000,
      remaining: 2_500_000,
      interestRate: 2.0,
      monthlyPayment: 150_000,
      remainingMonths: 18,
      priority: 'low',
    },
  ],
  insights: [
    {
      id: 1,
      title: '고금리 부채 우선 상환 권장',
      description: '삼성카드 카드론(8.5%)을 먼저 상환하면 연간 213,000원 절감 가능',
      savingsAmount: 213_000,
      type: 'optimization',
    },
    {
      id: 2,
      title: '대출 통합 기회',
      description: 'KB국민은행 신용대출 금리 인하 가능 (4.5% → 3.8%)',
      savingsAmount: 525_000,
      type: 'refinancing',
    },
  ],
  payoffScenarios: [
    {
      name: '현재 계획',
      months: 15,
      totalInterest: 1_200_000,
      totalPayment: 13_700_000,
    },
    {
      name: '추가 50만원/월',
      months: 10,
      totalInterest: 780_000,
      totalPayment: 13_280_000,
      savings: 420_000,
    },
    {
      name: '추가 100만원/월',
      months: 7,
      totalInterest: 520_000,
      totalPayment: 13_020_000,
      savings: 680_000,
    },
  ],
};

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
    minimumFractionDigits: 0,
  }).format(amount);
}

function getPriorityBadge(priority: string) {
  const config = {
    urgent: { color: 'red' as const, label: '긴급' },
    high: { color: 'yellow' as const, label: '높음' },
    low: { color: 'green' as const, label: '낮음' },
  };
  const { color, label } = config[priority as keyof typeof config] || config.high;
  return <Badge color={color}>{label}</Badge>;
}

export default function DebtAnalysisPage() {
  const { data: debtAnalysis, isLoading, error } = useDebtAnalysis();
  const [selectedScenario, setSelectedScenario] = useState<number>(0);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="text-center">
          <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent" />
          <Text>부채 분석 중...</Text>
        </div>
      </div>
    );
  }

  if (error || !debtAnalysis) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 dark:bg-gray-950">
        <div className="text-center">
          <Text className="text-red-600">데이터를 불러올 수 없습니다.</Text>
          <Button className="mt-4" onClick={() => window.location.reload()}>
            다시 시도
          </Button>
        </div>
      </div>
    );
  }

  const { totalDebt, monthlyPayment, averageInterestRate, breakdown, aiInsight, recommendations, simulationScenarios, debtToIncomeRatio, creditUtilizationRate } = debtAnalysis;

  return (
    <div className="min-h-screen bg-gray-50 pb-20 dark:bg-gray-950">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-600 px-4 py-6 text-white shadow-lg">
        <Heading className="text-white">부채 분석</Heading>
        <Text className="mt-1 text-sm opacity-90">
          AI 기반 효율적인 부채 관리 전략
        </Text>
      </div>

      {/* Summary Cards */}
      <div className="-mt-4 px-4">
        <div className="rounded-lg bg-white p-6 shadow-lg dark:bg-gray-900">
          <Text className="text-sm text-gray-600 dark:text-gray-400">총 부채</Text>
          <Heading className="mt-2 text-red-600 dark:text-red-400">{formatCurrency(totalDebt)}</Heading>
          <Divider className="my-4" />
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Text className="text-xs text-gray-600 dark:text-gray-400">월 상환액</Text>
              <Text className="mt-1 font-semibold">{formatCurrency(monthlyPayment)}</Text>
            </div>
            <div>
              <Text className="text-xs text-gray-600 dark:text-gray-400">평균 금리</Text>
              <Text className="mt-1 font-semibold">{averageInterestRate}%</Text>
            </div>
            <div>
              <Text className="text-xs text-gray-600 dark:text-gray-400">DTI 비율</Text>
              <Text className="mt-1 font-semibold">{debtToIncomeRatio}%</Text>
            </div>
          </div>
        </div>
      </div>

      {/* Debt Breakdown Chart */}
      <div className="mt-6 px-4">
        <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-900">
          <Heading level={3} className="mb-4">
            부채 구성
          </Heading>
          <DebtDonutChart 
            data={breakdown} 
            centerText="총 부채"
            centerValue={`${Math.round(totalDebt / 1000000)}백만`}
          />
        </div>
      </div>

      {/* AI Insight */}
      <div className="mt-6 px-4">
        <div className="rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 p-4 dark:from-blue-950/20 dark:to-indigo-950/20">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 rounded-full bg-blue-100 p-2 dark:bg-blue-900/50">
              <Text className="text-xl">🤖</Text>
            </div>
            <div className="flex-1">
              <Heading level={4} className="text-blue-900 dark:text-blue-400">
                AI 분석 결과
              </Heading>
              <Text className="mt-2 text-sm text-blue-800 dark:text-blue-300">
                {aiInsight}
              </Text>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="mt-6 px-4">
        <Heading level={3} className="mb-3">
          💡 맞춤 추천사항 ({recommendations.length}개)
        </Heading>
        <div className="space-y-3">
          {recommendations.map((rec) => (
            <div
              key={rec.id}
              className={`rounded-lg p-4 shadow-sm ${
                rec.priority === 'high'
                  ? 'border-2 border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/20'
                  : rec.priority === 'medium'
                  ? 'bg-yellow-50 dark:bg-yellow-950/20'
                  : 'bg-green-50 dark:bg-green-950/20'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <Text className="font-semibold">{rec.title}</Text>
                    <Badge 
                      color={
                        rec.priority === 'high' ? 'red' : 
                        rec.priority === 'medium' ? 'yellow' : 
                        'green'
                      }
                    >
                      {rec.priority === 'high' ? '긴급' : 
                       rec.priority === 'medium' ? '권장' : 
                       '참고'}
                    </Badge>
                  </div>
                  <Text className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                    {rec.description}
                  </Text>
                  <div className="mt-3 flex items-center justify-between">
                    <Text className="text-xs text-gray-600 dark:text-gray-400">
                      예상 절감액
                    </Text>
                    <Text className="font-bold text-green-600 dark:text-green-400">
                      연간 {formatCurrency(rec.potentialSavings)}
                    </Text>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* REMOVED old Debt Breakdown section */}
      <div className="mt-6 px-4 hidden">
        <Heading level={3} className="mb-3">
          부채 상세 (OLD - REMOVED)
        </Heading>
        <div className="space-y-3">
          {mockDebtDataOLD.debts && mockDebtDataOLD.debts.map((debt: any) => (
            <div
              key={debt.id}
              className="rounded-lg bg-white p-4 shadow-sm dark:bg-gray-900"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <Text className="font-semibold">{debt.type}</Text>
                    {getPriorityBadge(debt.priority)}
                  </div>
                  <Text className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    {debt.lender} · 금리 {debt.interestRate}%
                  </Text>
                </div>
              </div>

              <Divider className="my-3" />

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <Text className="text-gray-600 dark:text-gray-400">대출원금</Text>
                  <Text>{formatCurrency(debt.principal)}</Text>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <Text className="text-gray-600 dark:text-gray-400">잔여금액</Text>
                  <Text className="font-semibold text-red-600 dark:text-red-400">
                    {formatCurrency(debt.remaining)}
                  </Text>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <Text className="text-gray-600 dark:text-gray-400">월 상환액</Text>
                  <Text>{formatCurrency(debt.monthlyPayment)}</Text>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <Text className="text-gray-600 dark:text-gray-400">잔여기간</Text>
                  <Text>{debt.remainingMonths}개월</Text>
                </div>
              </div>

              <div className="mt-3">
                <div className="h-2 rounded-full bg-gray-200 dark:bg-gray-700">
                  <div
                    className="h-2 rounded-full bg-red-500"
                    style={{
                      width: `${(debt.remaining / debt.principal) * 100}%`,
                    }}
                  />
                </div>
                <Text className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                  {Math.round(((debt.principal - debt.remaining) / debt.principal) * 100)}% 상환
                  완료
                </Text>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* OLD AI Insights - REMOVED (replaced with Recommendations above) */}

      {/* Simulation Scenarios */}
      <div className="mt-6 px-4 pb-6">
        <Heading level={3} className="mb-3">
          📊 상환 시뮬레이션
        </Heading>
        <div className="space-y-3">
          {simulationScenarios.map((scenario, index) => (
            <div
              key={scenario.id}
              className={`cursor-pointer rounded-lg p-4 transition-all ${
                selectedScenario === index
                  ? 'border-2 border-blue-500 bg-blue-50 shadow-lg dark:border-blue-400 dark:bg-blue-950/30'
                  : 'bg-white shadow-sm hover:shadow-md dark:bg-gray-900'
              }`}
              onClick={() => setSelectedScenario(index)}
            >
              <div className="flex items-center justify-between">
                <Heading level={4}>{scenario.name}</Heading>
                {selectedScenario === index && (
                  <Badge color="blue">선택됨</Badge>
                )}
              </div>
              <div className="mt-3 grid grid-cols-3 gap-3 text-center">
                <div>
                  <Text className="text-xs text-gray-600 dark:text-gray-400">월 납입액</Text>
                  <Text className="mt-1 font-semibold">{formatCurrency(scenario.monthlyPayment)}</Text>
                </div>
                <div>
                  <Text className="text-xs text-gray-600 dark:text-gray-400">총 이자</Text>
                  <Text className="mt-1 font-semibold text-red-600 dark:text-red-400">
                    {formatCurrency(scenario.totalInterest)}
                  </Text>
                </div>
                <div>
                  <Text className="text-xs text-gray-600 dark:text-gray-400">상환 기간</Text>
                  <Text className="mt-1 font-semibold">
                    {scenario.payoffMonths}개월
                  </Text>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Action Button */}
        <div className="mt-6">
          <Button className="w-full" color="blue" href="/policy-recommendation">
            맞춤 정책 확인하기 →
          </Button>
        </div>
      </div>
    </div>
  );
}
