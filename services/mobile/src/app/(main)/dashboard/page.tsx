/**
 * Dashboard Page - Minimal Clean Design
 */

import { Heading, Text, Badge, Button, Divider } from '@hephaitos/ui';
import Link from 'next/link';

const mockDashboardData = {
  user: {
    name: '김헤파이스토스',
    lastSync: '2025-10-28 21:00',
  },
  summary: {
    totalAssets: 45_800_000,
    totalDebts: 12_500_000,
    netWorth: 33_300_000,
    creditScore: 820,
  },
  recentTransactions: [
    { id: 1, date: '2025-10-28', description: '월급', amount: 3_500_000, type: 'income' },
    { id: 2, date: '2025-10-27', description: '카드대금', amount: -450_000, type: 'expense' },
    { id: 3, date: '2025-10-26', description: '저축', amount: -1_000_000, type: 'transfer' },
  ],
  insights: [
    { id: 1, title: '이자 절감 기회', description: '신용대출 금리 인하 가능', type: 'success' },
    { id: 2, title: '대출 상환 알림', description: '다음 달 상환일: 11월 15일', type: 'warning' },
  ],
};

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
    minimumFractionDigits: 0,
  }).format(amount);
}

export default function DashboardPage() {
  const { user, summary, recentTransactions, insights } = mockDashboardData;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-blue-600 px-4 pb-6 pt-8 text-white">
        <Text className="text-sm">안녕하세요,</Text>
        <Heading className="text-white">{user.name}님</Heading>
        <Text className="mt-1 text-xs opacity-75">
          마지막 동기화: {user.lastSync}
        </Text>
      </div>

      {/* Net Worth Card */}
      <div className="-mt-4 px-4">
        <div className="rounded-lg bg-white p-6 shadow">
          <div className="mb-4 flex items-center justify-between">
            <Text className="text-sm text-gray-600">순자산</Text>
            <Badge color="green">건강</Badge>
          </div>
          <Heading level={1} className="text-3xl">
            {formatCurrency(summary.netWorth)}
          </Heading>
          
          <div className="mt-4 grid grid-cols-2 gap-4 border-t border-gray-200 pt-4">
            <div>
              <Text className="text-xs text-gray-600">총 자산</Text>
              <Text className="mt-1 font-semibold text-green-600">
                {formatCurrency(summary.totalAssets)}
              </Text>
            </div>
            <div>
              <Text className="text-xs text-gray-600">총 부채</Text>
              <Text className="mt-1 font-semibold text-red-600">
                {formatCurrency(summary.totalDebts)}
              </Text>
            </div>
          </div>
        </div>
      </div>

      {/* Credit Score */}
      <div className="mt-6 px-4">
        <div className="rounded-lg bg-white p-4 shadow">
          <div className="flex items-center justify-between">
            <div>
              <Text className="text-sm text-gray-600">신용점수</Text>
              <Heading level={3} className="mt-1">
                {summary.creditScore}점
              </Heading>
            </div>
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <Text className="text-2xl">✓</Text>
            </div>
          </div>
          <div className="mt-3">
            <div className="h-2 rounded-full bg-gray-200">
              <div
                className="h-2 rounded-full bg-green-500"
                style={{ width: `${(summary.creditScore / 1000) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 px-4">
        <Heading level={3} className="mb-3">
          빠른 메뉴
        </Heading>
        <div className="grid grid-cols-2 gap-3">
          <Link href="/accounts">
            <Button className="w-full" outline>
              계좌 관리
            </Button>
          </Link>
          <Link href="/debt-analysis">
            <Button className="w-full" outline>
              부채 분석
            </Button>
          </Link>
          <Link href="/policy-recommendation">
            <Button className="w-full" outline>
              정책 추천
            </Button>
          </Link>
          <Link href="/connect">
            <Button className="w-full" outline>
              계좌 연결
            </Button>
          </Link>
        </div>
      </div>

      {/* Insights */}
      <div className="mt-6 px-4">
        <Heading level={3} className="mb-3">
          맞춤 인사이트
        </Heading>
        <div className="space-y-3">
          {insights.map((insight) => (
            <div
              key={insight.id}
              className={`rounded-lg p-4 ${
                insight.type === 'success'
                  ? 'bg-green-50'
                  : 'bg-yellow-50'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <Text
                    className={`font-semibold ${
                      insight.type === 'success'
                        ? 'text-green-900'
                        : 'text-yellow-900'
                    }`}
                  >
                    {insight.title}
                  </Text>
                  <Text
                    className={`mt-1 text-sm ${
                      insight.type === 'success'
                        ? 'text-green-800'
                        : 'text-yellow-800'
                    }`}
                  >
                    {insight.description}
                  </Text>
                </div>
                <Badge color={insight.type === 'success' ? 'green' : 'yellow'}>
                  {insight.type === 'success' ? '기회' : '알림'}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="mt-6 px-4 pb-6">
        <div className="mb-3 flex items-center justify-between">
          <Heading level={3}>최근 거래</Heading>
          <Link href="/transactions">
            <Text className="text-sm text-blue-600">
              전체보기 →
            </Text>
          </Link>
        </div>
        <div className="rounded-lg bg-white shadow">
          {recentTransactions.map((tx, index) => (
            <div key={tx.id}>
              <div className="flex items-center justify-between p-4">
                <div className="flex-1">
                  <Text className="font-medium">{tx.description}</Text>
                  <Text className="mt-1 text-xs text-gray-600">
                    {tx.date}
                  </Text>
                </div>
                <Text
                  className={`font-semibold ${
                    tx.type === 'income'
                      ? 'text-green-600'
                      : 'text-gray-900'
                  }`}
                >
                  {tx.amount > 0 ? '+' : ''}
                  {formatCurrency(tx.amount)}
                </Text>
              </div>
              {index < recentTransactions.length - 1 && (
                <Divider className="mx-4" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
