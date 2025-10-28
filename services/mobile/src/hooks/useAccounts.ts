/**
 * Accounts API Hook
 * 
 * Fetches connected bank accounts, cards, and loans.
 */

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

interface BankAccount {
  id: number;
  provider: string;
  accountNumber: string;
  accountType: string;
  balance: number;
  lastSync: string;
  status: 'active' | 'inactive' | 'error';
}

interface Card {
  id: number;
  provider: string;
  cardNumber: string;
  cardType: string;
  balance: number;
  lastSync: string;
  status: 'active' | 'inactive' | 'error';
}

interface Loan {
  id: number;
  provider: string;
  loanName: string;
  principal: number;
  remaining: number;
  interestRate: number;
  lastSync: string;
  status: 'active' | 'inactive' | 'error';
}

interface AccountsData {
  banks: BankAccount[];
  cards: Card[];
  loans: Loan[];
}

export function useAccounts() {
  return useQuery({
    queryKey: ['accounts'],
    queryFn: async () => {
      // TODO: Replace with actual API call
      // return apiClient.get<AccountsData>('/api/v1/accounts');
      
      await new Promise((resolve) => setTimeout(resolve, 600));
      
      return {
        banks: [
          {
            id: 1,
            provider: 'KB국민은행',
            accountNumber: '****-****-1234',
            accountType: '입출금',
            balance: 8_500_000,
            lastSync: '방금 전',
            status: 'active' as const,
          },
          {
            id: 2,
            provider: '신한은행',
            accountNumber: '****-****-5678',
            accountType: '적금',
            balance: 12_000_000,
            lastSync: '10분 전',
            status: 'active' as const,
          },
          {
            id: 3,
            provider: '토스뱅크',
            accountNumber: '****-****-9012',
            accountType: '저축',
            balance: 5_300_000,
            lastSync: '1시간 전',
            status: 'active' as const,
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
            status: 'active' as const,
          },
          {
            id: 5,
            provider: '현대카드',
            cardNumber: '****-****-****-7890',
            cardType: '체크카드',
            balance: 0,
            lastSync: '15분 전',
            status: 'active' as const,
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
            status: 'active' as const,
          },
        ],
      } as AccountsData;
    },
  });
}
