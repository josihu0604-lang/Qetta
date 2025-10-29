/**
 * Policy Recommendations API Hook
 * 
 * Fetches AI-powered policy recommendations based on user's debt situation.
 */

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

interface Policy {
  id: number;
  name: string;
  provider: string;
  description: string;
  category: 'loan' | 'subsidy' | 'tax' | 'welfare';
  maxBenefit: number;
  eligibilityRequirements: string[];
  applicationPeriod: string;
  matchRate: number;
  applicationUrl: string;
  benefits: {
    label: string;
    value: string;
  }[];
}

interface PolicyRecommendationsData {
  policies: Policy[];
  totalPotentialBenefit: number;
  matchedCount: number;
}

export function usePolicyRecommendations() {
  return useQuery({
    queryKey: ['policy-recommendations'],
    queryFn: async () => {
      // TODO: Replace with actual API call
      // return apiClient.get<PolicyRecommendationsData>('/api/v1/policy-recommendations');
      
      await new Promise((resolve) => setTimeout(resolve, 700));
      
      return {
        policies: [
          {
            id: 1,
            name: '서민금융진흥원 햇살론',
            provider: '서민금융진흥원',
            description: '저신용·저소득 근로자를 위한 저금리 대출 상품. 연 10% 이하의 금리로 최대 2,000만원까지 대출 가능합니다.',
            category: 'loan' as const,
            maxBenefit: 20_000_000,
            eligibilityRequirements: [
              '연소득 4,500만원 이하 근로자',
              '신용점수 하위 20% 이하',
              '기존 대출 연체 없음',
            ],
            applicationPeriod: '상시 접수',
            matchRate: 92,
            applicationUrl: 'https://www.kinfa.or.kr',
            benefits: [
              { label: '최대 대출액', value: '2,000만원' },
              { label: '금리', value: '연 10% 이하' },
              { label: '대출 기간', value: '최대 5년' },
            ],
          },
          {
            id: 2,
            name: '청년 버팀목 전세자금대출',
            provider: '주택도시기금',
            description: '만 19세~34세 청년의 전세자금 마련을 위한 저금리 대출. 보증금의 최대 80%까지 지원합니다.',
            category: 'loan' as const,
            maxBenefit: 100_000_000,
            eligibilityRequirements: [
              '만 19~34세 무주택 세대주',
              '연소득 5,000만원 이하',
              '전용면적 85㎡ 이하',
            ],
            applicationPeriod: '2025년 12월 31일까지',
            matchRate: 88,
            applicationUrl: 'https://www.hf.go.kr',
            benefits: [
              { label: '최대 대출액', value: '1억원' },
              { label: '금리', value: '연 1.8~3.0%' },
              { label: '대출 기간', value: '최대 10년' },
            ],
          },
          {
            id: 3,
            name: '근로장려금',
            provider: '국세청',
            description: '저소득 근로자 가구에 근로장려금을 지급하여 근로를 장려하고 소득을 지원하는 제도입니다.',
            category: 'subsidy' as const,
            maxBenefit: 3_300_000,
            eligibilityRequirements: [
              '총소득 4,400만원 미만',
              '재산 2억 4천만원 미만',
              '근로소득 또는 사업소득 있음',
            ],
            applicationPeriod: '2025년 5월 1일 ~ 5월 31일',
            matchRate: 85,
            applicationUrl: 'https://www.nts.go.kr',
            benefits: [
              { label: '최대 지급액', value: '330만원' },
              { label: '신청 방법', value: '홈택스 또는 ARS' },
              { label: '지급 시기', value: '9월 말' },
            ],
          },
          {
            id: 4,
            name: '신용회복위원회 개인워크아웃',
            provider: '신용회복위원회',
            description: '채무 상환이 어려운 개인에게 채무조정을 통해 경제적 재기를 지원하는 프로그램입니다.',
            category: 'welfare' as const,
            maxBenefit: 50_000_000,
            eligibilityRequirements: [
              '총 채무액 15억원 이하',
              '3개월 이상 연체 또는 상환 곤란',
              '최저 생계비 이상의 수입 있음',
            ],
            applicationPeriod: '상시 접수',
            matchRate: 78,
            applicationUrl: 'https://www.ccrs.or.kr',
            benefits: [
              { label: '금리 감면', value: '최대 연 12%' },
              { label: '원금 감면', value: '최대 40%' },
              { label: '상환 기간', value: '최대 10년' },
            ],
          },
          {
            id: 5,
            name: '학자금 대출 이자 지원',
            provider: '한국장학재단',
            description: '저소득 학자금 대출자의 이자 부담을 경감하기 위한 이자 지원 프로그램입니다.',
            category: 'subsidy' as const,
            maxBenefit: 1_500_000,
            eligibilityRequirements: [
              '학자금 대출 보유',
              '연소득 3,500만원 이하',
              '정기 상환 중',
            ],
            applicationPeriod: '2025년 3월 1일 ~ 3월 31일',
            matchRate: 72,
            applicationUrl: 'https://www.kosaf.go.kr',
            benefits: [
              { label: '이자 지원', value: '최대 150만원' },
              { label: '지원 기간', value: '1년' },
              { label: '지급 방식', value: '직접 감면' },
            ],
          },
        ],
        totalPotentialBenefit: 175_300_000,
        matchedCount: 5,
      } as PolicyRecommendationsData;
    },
  });
}
