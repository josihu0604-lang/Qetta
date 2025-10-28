/**
 * Accounts Page - 연결된 계좌 관리
 * 
 * Features:
 * - 연결된 은행/카드 계좌 목록
 * - 계좌별 잔액 및 상태
 * - 새 계좌 연결
 * - 계좌 동기화
 */

import {
  Heading,
  Text,
  Badge,
  Button,
  Divider,
} from '@hephaitos/ui';
import Link from 'next/link';

// Mock data
const mockAccounts = {
  banks: [
    {
      id: 1,
      provider: 'KB국민은행',
      accountNumber: '****-****-1234',
      accountType: '입출금',
      balance: 8_500_000,
      lastSync: '방금 전',
      status: 'active',
    },
    {
      id: 2,
      provider: '신한은행',
      accountNumber: '****-****-5678',
      accountType: '적금',
      balance: 12_000_000,
      lastSync: '10분 전',
      status: 'active',
    },
    {
      id: 3,
      provider: '토스뱅크',
      accountNumber: '****-****-9012',
      accountType: '저축',
      balance: 5_300_000,
      lastSync: '1시간 전',
      status: 'active',
    },
  ],
  cards: [
    {
      id: 4,
      provider: '삼성카드',
      cardNumber: '****-****-****-3456',
      cardType: '신용카드',
      balance: -1_200_000,
      lastSync: '5분 전',
      status: 'active',
    },
    {
      id: 5,
      provider: '현대카드',
      cardNumber: '****-****-****-7890',
      cardType: '체크카드',
      balance: 0,
      lastSync: '15분 전',
      status: 'active',
    },
  ],
  loans: [
    {
      id: 6,
      provider: 'KB국민은행',
      loanName: '신용대출',
      principal: 10_000_000,
      remaining: 7_500_000,
      interestRate: 4.5,
      lastSync: '30분 전',
      status: 'active',
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

function getProviderIcon(provider: string): string {
  if (provider.includes('KB')) return '🏦';
  if (provider.includes('신한')) return '🏛️';
  if (provider.includes('토스')) return '💳';
  if (provider.includes('삼성')) return '💎';
  if (provider.includes('현대')) return '🚗';
  return '🏢';
}

export default function AccountsPage() {
  const { banks, cards, loans } = mockAccounts;
  const totalAssets = banks.reduce((sum, acc) => sum + acc.balance, 0);
  const totalDebts = Math.abs(cards.reduce((sum, card) => sum + card.balance, 0)) +
    loans.reduce((sum, loan) => sum + loan.remaining, 0);

  return (
    <div className="min-h-screen bg-gray-50 pb-20 dark:bg-gray-950">
      {/* Header */}
      <div className="bg-white px-4 py-6 shadow-sm dark:bg-gray-900">
        <Heading>계좌 관리</Heading>
        <Text className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          연결된 금융 계좌를 관리하세요
        </Text>
      </div>

      {/* Summary Cards */}
      <div className="mt-6 grid grid-cols-2 gap-4 px-4">
        <div className="rounded-lg bg-green-50 p-4 dark:bg-green-950/20">
          <Text className="text-xs text-green-800 dark:text-green-300">총 자산</Text>
          <Heading level={3} className="mt-1 text-green-900 dark:text-green-400">
            {formatCurrency(totalAssets)}
          </Heading>
        </div>
        <div className="rounded-lg bg-red-50 p-4 dark:bg-red-950/20">
          <Text className="text-xs text-red-800 dark:text-red-300">총 부채</Text>
          <Heading level={3} className="mt-1 text-red-900 dark:text-red-400">
            {formatCurrency(totalDebts)}
          </Heading>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 px-4">
        <div className="grid grid-cols-2 gap-3">
          <Link href="/connect">
            <Button className="w-full" color="primary">
              + 계좌 연결
            </Button>
          </Link>
          <Button className="w-full" outline>
            🔄 전체 동기화
          </Button>
        </div>
      </div>

      {/* Bank Accounts */}
      <div className="mt-6 px-4">
        <Heading level={3} className="mb-3">
          은행 계좌 ({banks.length})
        </Heading>
        <div className="space-y-3">
          {banks.map((account) => (
            <div
              key={account.id}
              className="rounded-lg bg-white p-4 shadow-sm dark:bg-gray-900"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-2xl dark:bg-gray-800">
                    {getProviderIcon(account.provider)}
                  </div>
                  <div className="flex-1">
                    <Text className="font-semibold">{account.provider}</Text>
                    <Text className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                      {account.accountType} · {account.accountNumber}
                    </Text>
                    <Text className="mt-1 text-xs text-gray-500 dark:text-gray-500">
                      동기화: {account.lastSync}
                    </Text>
                  </div>
                </div>
                <Badge color="green">활성</Badge>
              </div>
              <Divider className="my-3" />
              <div className="flex items-center justify-between">
                <Text className="text-sm text-gray-600 dark:text-gray-400">잔액</Text>
                <Heading level={4} className="text-green-600 dark:text-green-400">
                  {formatCurrency(account.balance)}
                </Heading>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Credit/Debit Cards */}
      <div className="mt-6 px-4">
        <Heading level={3} className="mb-3">
          신용/체크카드 ({cards.length})
        </Heading>
        <div className="space-y-3">
          {cards.map((card) => (
            <div
              key={card.id}
              className="rounded-lg bg-white p-4 shadow-sm dark:bg-gray-900"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-2xl dark:bg-gray-800">
                    {getProviderIcon(card.provider)}
                  </div>
                  <div className="flex-1">
                    <Text className="font-semibold">{card.provider}</Text>
                    <Text className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                      {card.cardType} · {card.cardNumber}
                    </Text>
                    <Text className="mt-1 text-xs text-gray-500 dark:text-gray-500">
                      동기화: {card.lastSync}
                    </Text>
                  </div>
                </div>
                <Badge color="green">활성</Badge>
              </div>
              <Divider className="my-3" />
              <div className="flex items-center justify-between">
                <Text className="text-sm text-gray-600 dark:text-gray-400">
                  {card.balance < 0 ? '미결제금액' : '잔액'}
                </Text>
                <Heading
                  level={4}
                  className={
                    card.balance < 0
                      ? 'text-red-600 dark:text-red-400'
                      : 'text-gray-900 dark:text-white'
                  }
                >
                  {formatCurrency(Math.abs(card.balance))}
                </Heading>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Loans */}
      <div className="mt-6 px-4 pb-6">
        <Heading level={3} className="mb-3">
          대출 ({loans.length})
        </Heading>
        <div className="space-y-3">
          {loans.map((loan) => (
            <div
              key={loan.id}
              className="rounded-lg bg-white p-4 shadow-sm dark:bg-gray-900"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-2xl dark:bg-gray-800">
                    {getProviderIcon(loan.provider)}
                  </div>
                  <div className="flex-1">
                    <Text className="font-semibold">{loan.provider}</Text>
                    <Text className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                      {loan.loanName} · 금리 {loan.interestRate}%
                    </Text>
                    <Text className="mt-1 text-xs text-gray-500 dark:text-gray-500">
                      동기화: {loan.lastSync}
                    </Text>
                  </div>
                </div>
                <Badge color="yellow">대출</Badge>
              </div>
              <Divider className="my-3" />
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Text className="text-sm text-gray-600 dark:text-gray-400">대출원금</Text>
                  <Text className="font-medium">{formatCurrency(loan.principal)}</Text>
                </div>
                <div className="flex items-center justify-between">
                  <Text className="text-sm text-gray-600 dark:text-gray-400">잔여금액</Text>
                  <Heading level={4} className="text-red-600 dark:text-red-400">
                    {formatCurrency(loan.remaining)}
                  </Heading>
                </div>
                <div className="mt-2">
                  <div className="h-2 rounded-full bg-gray-200 dark:bg-gray-700">
                    <div
                      className="h-2 rounded-full bg-green-500"
                      style={{
                        width: `${((loan.principal - loan.remaining) / loan.principal) * 100}%`,
                      }}
                    />
                  </div>
                  <Text className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                    {Math.round(((loan.principal - loan.remaining) / loan.principal) * 100)}%
                    상환 완료
                  </Text>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
