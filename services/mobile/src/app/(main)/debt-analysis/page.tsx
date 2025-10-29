/**
 * Debt Analysis Page - 부채 분석 및 시각화
 * 
 * Features:
 * - 총 부채 현황
 * - 부채 종류별 분포
 * - 금리 비교
 * - 상환 계획 시뮬레이션
 * - AI 기반 부채 감소 제안
 */

import {
  Heading,
  Text,
  Badge,
  Button,
  Divider,
} from '@hephaitos/ui';

// Mock data
const mockDebtData = {
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
  const { totalDebt, monthlyPayment, averageInterestRate, debts, insights, payoffScenarios } =
    mockDebtData;

  return (
    <div className="min-h-screen bg-gray-50 pb-20 dark:bg-gray-950">
      {/* Header */}
      <div className="bg-white px-4 py-6 shadow-sm dark:bg-gray-900">
        <Heading>부채 분석</Heading>
        <Text className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          효율적인 부채 관리 전략을 제안합니다
        </Text>
      </div>

      {/* Summary Cards */}
      <div className="mt-6 px-4">
        <div className="rounded-lg bg-gradient-to-br from-red-500 to-red-600 p-6 text-white shadow-lg">
          <Text className="text-sm opacity-90">총 부채</Text>
          <Heading className="mt-2 text-white">{formatCurrency(totalDebt)}</Heading>
          <Divider className="my-4 opacity-30" />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Text className="text-xs opacity-75">월 상환액</Text>
              <Text className="mt-1 font-semibold">{formatCurrency(monthlyPayment)}</Text>
            </div>
            <div>
              <Text className="text-xs opacity-75">평균 금리</Text>
              <Text className="mt-1 font-semibold">{averageInterestRate}%</Text>
            </div>
          </div>
        </div>
      </div>

      {/* Debt Breakdown */}
      <div className="mt-6 px-4">
        <Heading level={3} className="mb-3">
          부채 상세 ({debts.length}건)
        </Heading>
        <div className="space-y-3">
          {debts.map((debt) => (
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

      {/* AI Insights */}
      <div className="mt-6 px-4">
        <Heading level={3} className="mb-3">
          💡 AI 부채 감소 제안
        </Heading>
        <div className="space-y-3">
          {insights.map((insight) => (
            <div
              key={insight.id}
              className={`rounded-lg p-4 ${
                insight.type === 'optimization'
                  ? 'bg-blue-50 dark:bg-blue-950/20'
                  : 'bg-green-50 dark:bg-green-950/20'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <Text
                    className={`font-semibold ${
                      insight.type === 'optimization'
                        ? 'text-blue-900 dark:text-blue-400'
                        : 'text-green-900 dark:text-green-400'
                    }`}
                  >
                    {insight.title}
                  </Text>
                  <Text
                    className={`mt-1 text-sm ${
                      insight.type === 'optimization'
                        ? 'text-blue-800 dark:text-blue-300'
                        : 'text-green-800 dark:text-green-300'
                    }`}
                  >
                    {insight.description}
                  </Text>
                  <div className="mt-3 flex items-center space-x-2">
                    <Badge color={insight.type === 'optimization' ? 'blue' : 'green'}>
                      연간 절감액
                    </Badge>
                    <Text className="font-semibold text-green-600 dark:text-green-400">
                      {formatCurrency(insight.savingsAmount)}
                    </Text>
                  </div>
                </div>
              </div>
              <Button className="mt-3 w-full" outline>
                자세히 보기
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Payoff Scenarios */}
      <div className="mt-6 px-4 pb-6">
        <Heading level={3} className="mb-3">
          상환 시나리오 비교
        </Heading>
        <div className="space-y-3">
          {payoffScenarios.map((scenario, index) => (
            <div
              key={scenario.name}
              className={`rounded-lg p-4 ${
                index === 0
                  ? 'bg-gray-100 dark:bg-gray-800'
                  : 'bg-white shadow-sm dark:bg-gray-900'
              }`}
            >
              <div className="flex items-center justify-between">
                <Heading level={4}>{scenario.name}</Heading>
                {scenario.savings && (
                  <Badge color="green">-{formatCurrency(scenario.savings)}</Badge>
                )}
              </div>
              <div className="mt-3 grid grid-cols-3 gap-3 text-center">
                <div>
                  <Text className="text-xs text-gray-600 dark:text-gray-400">상환기간</Text>
                  <Text className="mt-1 font-semibold">{scenario.months}개월</Text>
                </div>
                <div>
                  <Text className="text-xs text-gray-600 dark:text-gray-400">총 이자</Text>
                  <Text className="mt-1 font-semibold text-red-600 dark:text-red-400">
                    {formatCurrency(scenario.totalInterest)}
                  </Text>
                </div>
                <div>
                  <Text className="text-xs text-gray-600 dark:text-gray-400">총 상환액</Text>
                  <Text className="mt-1 font-semibold">
                    {formatCurrency(scenario.totalPayment)}
                  </Text>
                </div>
              </div>
              {index > 0 && (
                <Button className="mt-3 w-full" color="blue">
                  이 계획 시작하기
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
