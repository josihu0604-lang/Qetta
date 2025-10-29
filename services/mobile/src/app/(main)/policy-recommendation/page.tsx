/**
 * Policy Recommendation Page - AI 기반 정책 추천
 * 
 * Features:
 * - 사용자 맞춤 정부 지원 정책 추천
 * - 정책별 혜택 및 신청 요건
 * - 예상 지원금액 계산
 * - 신청 가이드
 */

'use client';

import {
  Heading,
  Text,
  Badge,
  Button,
  Divider,
} from '@hephaitos/ui';
import { usePolicyRecommendations } from '@/hooks/usePolicyRecommendations';
import { useState } from 'react';

// OLD Mock data (REMOVED)
const mockPoliciesOLD = {
  eligibilityScore: 85,
  totalPotentialBenefit: 8_500_000,
  recommendations: [
    {
      id: 1,
      title: '청년내일채움공제',
      category: '취업지원',
      provider: '고용노동부',
      matchScore: 95,
      estimatedBenefit: 3_000_000,
      requirements: ['만 15~34세 청년', '중소·중견기업 정규직 근로자', '2년 근속'],
      benefits: [
        '2년 근속 시 최대 1,200만원 수령',
        '기업 부담금 + 청년 자부담 + 정부 지원금',
      ],
      deadline: '2025-12-31',
      applicationStatus: 'eligible',
      difficulty: 'easy',
    },
    {
      id: 2,
      title: '근로장려금',
      category: '소득지원',
      provider: '국세청',
      matchScore: 88,
      estimatedBenefit: 2_500_000,
      requirements: [
        '단독가구 연소득 2,200만원 미만',
        '재산 2억원 미만',
        '근로·사업·종교인 소득 있음',
      ],
      benefits: ['연간 최대 300만원 지급', '반기별 신청 가능'],
      deadline: '2025-05-31',
      applicationStatus: 'eligible',
      difficulty: 'easy',
    },
    {
      id: 3,
      title: '청년희망적금',
      category: '자산형성',
      provider: '금융위원회',
      matchScore: 82,
      estimatedBenefit: 1_800_000,
      requirements: ['만 19~34세 청년', '개인소득 3,600만원 이하', '2년간 월 50만원 납입'],
      benefits: ['2년 만기 시 정부지원금 최대 144만원', '이자소득 비과세'],
      deadline: '2025-11-30',
      applicationStatus: 'review_needed',
      difficulty: 'medium',
    },
    {
      id: 4,
      title: '청년도약계좌',
      category: '자산형성',
      provider: '금융위원회',
      matchScore: 78,
      estimatedBenefit: 1_200_000,
      requirements: ['만 19~34세 청년', '개인소득 7,500만원 이하', '5년간 월 70만원 납입'],
      benefits: ['5년 만기 시 정부지원금 최대 5,000만원', '비과세 혜택'],
      deadline: '2025-12-31',
      applicationStatus: 'not_eligible',
      difficulty: 'hard',
    },
  ],
  categories: [
    { name: '전체', count: 4 },
    { name: '취업지원', count: 1 },
    { name: '소득지원', count: 1 },
    { name: '자산형성', count: 2 },
  ],
};

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
    minimumFractionDigits: 0,
  }).format(amount);
}

function getStatusBadge(status: string) {
  const config = {
    eligible: { color: 'green' as const, label: '신청가능' },
    review_needed: { color: 'yellow' as const, label: '검토필요' },
    not_eligible: { color: 'zinc' as const, label: '요건미달' },
  };
  const { color, label } = config[status as keyof typeof config] || config.eligible;
  return <Badge color={color}>{label}</Badge>;
}

function getDifficultyBadge(difficulty: string) {
  const config = {
    easy: { color: 'green' as const, label: '쉬움' },
    medium: { color: 'yellow' as const, label: '보통' },
    hard: { color: 'red' as const, label: '어려움' },
  };
  const { color, label } = config[difficulty as keyof typeof config] || config.medium;
  return <Badge color={color}>{label}</Badge>;
}

export default function PolicyRecommendationPage() {
  const { data: policyData, isLoading, error } = usePolicyRecommendations();
  const [selectedCategory, setSelectedCategory] = useState<string>('전체');
  const [expandedPolicy, setExpandedPolicy] = useState<number | null>(null);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="text-center">
          <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent" />
          <Text>정책 분석 중...</Text>
        </div>
      </div>
    );
  }

  if (error || !policyData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 dark:bg-gray-950">
        <div className="text-center">
          <Text className="text-red-600">정책 데이터를 불러올 수 없습니다.</Text>
          <Button className="mt-4" onClick={() => window.location.reload()}>
            다시 시도
          </Button>
        </div>
      </div>
    );
  }

  const { policies, totalPotentialBenefit, matchedCount } = policyData;

  // Filter policies by category
  const filteredPolicies = selectedCategory === '전체' 
    ? policies 
    : policies.filter(p => p.category === selectedCategory);

  // Calculate category counts
  const categories = [
    { name: '전체', count: policies.length },
    { name: 'loan', count: policies.filter(p => p.category === 'loan').length },
    { name: 'subsidy', count: policies.filter(p => p.category === 'subsidy').length },
    { name: 'welfare', count: policies.filter(p => p.category === 'welfare').length },
  ];

  const categoryLabels: Record<string, string> = {
    '전체': '전체',
    'loan': '대출',
    'subsidy': '보조금',
    'tax': '세금',
    'welfare': '복지',
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 dark:bg-gray-950">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-500 to-indigo-600 px-4 py-6 text-white shadow-lg">
        <Heading className="text-white">맞춤 정책 추천</Heading>
        <Text className="mt-1 text-sm opacity-90">
          AI 분석 기반 정부 지원 정책
        </Text>
      </div>

      {/* Summary Card */}
      <div className="-mt-4 px-4">
        <div className="rounded-lg bg-white p-6 shadow-lg dark:bg-gray-900">
          <div className="flex items-center justify-between">
            <div>
              <Text className="text-sm text-gray-600 dark:text-gray-400">매칭된 정책</Text>
              <Heading className="mt-2 text-blue-600 dark:text-blue-400">{matchedCount}건</Heading>
            </div>
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-3xl dark:bg-blue-900/50">
              ✨
            </div>
          </div>
          <Divider className="my-4" />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Text className="text-xs text-gray-600 dark:text-gray-400">평균 매칭률</Text>
              <Text className="mt-1 font-semibold">
                {Math.round(policies.reduce((sum, p) => sum + p.matchRate, 0) / policies.length)}%
              </Text>
            </div>
            <div>
              <Text className="text-xs text-gray-600 dark:text-gray-400">예상 총 혜택</Text>
              <Text className="mt-1 font-semibold text-green-600 dark:text-green-400">
                {formatCurrency(totalPotentialBenefit)}
              </Text>
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="mt-6 px-4">
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {categories.filter(c => c.count > 0).map((category) => (
            <button
              key={category.name}
              onClick={() => setSelectedCategory(category.name)}
              className={`flex-shrink-0 rounded-full px-4 py-2 text-sm font-medium shadow-sm transition-all ${
                selectedCategory === category.name
                  ? 'bg-blue-600 text-white dark:bg-blue-500'
                  : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-900 dark:text-gray-300'
              }`}
            >
              {categoryLabels[category.name] || category.name} ({category.count})
            </button>
          ))}
        </div>
      </div>

      {/* Policy Recommendations */}
      <div className="mt-6 px-4">
        <div className="mb-3 flex items-center justify-between">
          <Heading level={3}>
            {selectedCategory === '전체' ? '전체 정책' : categoryLabels[selectedCategory]} ({filteredPolicies.length})
          </Heading>
          <Text className="text-sm text-blue-600 dark:text-blue-400">
            매칭률순 ▼
          </Text>
        </div>
        <div className="space-y-4">
          {filteredPolicies.map((policy) => (
            <div
              key={policy.id}
              className="cursor-pointer rounded-lg bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:bg-gray-900"
              onClick={() => setExpandedPolicy(expandedPolicy === policy.id ? null : policy.id)}
            >
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <Heading level={4}>{policy.name}</Heading>
                    <Badge color={
                      policy.matchRate >= 85 ? 'green' : 
                      policy.matchRate >= 70 ? 'yellow' : 
                      'zinc'
                    }>
                      {policy.matchRate}% 매칭
                    </Badge>
                  </div>
                  <Text className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    {policy.provider} · {categoryLabels[policy.category] || policy.category}
                  </Text>
                </div>
              </div>

              {/* Match Score Progress */}
              <div className="mt-3">
                <div className="h-2 rounded-full bg-gray-200 dark:bg-gray-700">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      policy.matchRate >= 85 ? 'bg-green-500' : 
                      policy.matchRate >= 70 ? 'bg-yellow-500' : 
                      'bg-gray-500'
                    }`}
                    style={{ width: `${policy.matchRate}%` }}
                  />
                </div>
              </div>

              <Divider className="my-4" />

              {/* Description */}
              <Text className="text-sm text-gray-700 dark:text-gray-300">
                {policy.description}
              </Text>

              {/* Estimated Benefit */}
              <div className="mt-4 rounded-lg bg-green-50 p-3 dark:bg-green-950/20">
                <Text className="text-xs text-green-800 dark:text-green-300">
                  최대 혜택 금액
                </Text>
                <Heading level={3} className="mt-1 text-green-900 dark:text-green-400">
                  {formatCurrency(policy.maxBenefit)}
                </Heading>
              </div>

              {/* Expandable Details */}
              {expandedPolicy === policy.id && (
                <div className="mt-4 space-y-4 animate-fade-in">
                  {/* Requirements */}
                  <div>
                    <Text className="mb-2 text-sm font-semibold">✓ 신청 요건</Text>
                    <ul className="space-y-1">
                      {policy.eligibilityRequirements.map((req, index) => (
                        <li
                          key={index}
                          className="flex items-start text-sm text-gray-700 dark:text-gray-300"
                        >
                          <span className="mr-2 text-green-500">•</span>
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Benefits Details */}
                  <div>
                    <Text className="mb-2 text-sm font-semibold">💰 상세 혜택</Text>
                    <div className="space-y-2">
                      {policy.benefits.map((benefit, index) => (
                        <div key={index} className="rounded-lg bg-gray-50 p-2 dark:bg-gray-800">
                          <Text className="text-xs text-gray-600 dark:text-gray-400">
                            {benefit.label}
                          </Text>
                          <Text className="mt-1 font-semibold">{benefit.value}</Text>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Application Period */}
                  <div className="flex items-center justify-between rounded-lg bg-blue-50 p-3 dark:bg-blue-950/20">
                    <Text className="text-sm text-blue-800 dark:text-blue-300">
                      📅 신청 기간
                    </Text>
                    <Text className="font-semibold text-blue-900 dark:text-blue-400">
                      {policy.applicationPeriod}
                    </Text>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="mt-4">
                <Button 
                  className="w-full" 
                  color="blue"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(policy.applicationUrl, '_blank');
                  }}
                >
                  {expandedPolicy === policy.id ? '신청 페이지로 이동 →' : '자세히 보기'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Insight */}
      <div className="mt-6 px-4 pb-6">
        <div className="rounded-lg bg-gradient-to-br from-purple-50 to-pink-50 p-4 dark:from-purple-950/20 dark:to-pink-950/20">
          <div className="flex items-start space-x-3">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-purple-100 text-xl dark:bg-purple-900/50">
              🤖
            </div>
            <div className="flex-1">
              <Text className="font-semibold text-purple-900 dark:text-purple-400">
                AI 추천 전략
              </Text>
              <Text className="mt-1 text-sm text-purple-800 dark:text-purple-300">
                현재 매칭된 정책 중 상위 3개를 모두 신청하면 최대{' '}
                <strong className="text-purple-900 dark:text-purple-200">
                  {formatCurrency(
                    policies
                      .slice(0, 3)
                      .reduce((sum, p) => sum + p.maxBenefit, 0)
                  )}
                </strong>
                의 혜택을 받을 수 있습니다.
              </Text>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-4 grid grid-cols-3 gap-3">
          <div className="rounded-lg bg-white p-3 text-center shadow-sm dark:bg-gray-900">
            <Text className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {policies.filter(p => p.matchRate >= 80).length}
            </Text>
            <Text className="mt-1 text-xs text-gray-600 dark:text-gray-400">
              고매칭 정책
            </Text>
          </div>
          <div className="rounded-lg bg-white p-3 text-center shadow-sm dark:bg-gray-900">
            <Text className="text-2xl font-bold text-green-600 dark:text-green-400">
              {policies.filter(p => p.category === 'subsidy').length}
            </Text>
            <Text className="mt-1 text-xs text-gray-600 dark:text-gray-400">
              보조금 지원
            </Text>
          </div>
          <div className="rounded-lg bg-white p-3 text-center shadow-sm dark:bg-gray-900">
            <Text className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {policies.filter(p => p.category === 'loan').length}
            </Text>
            <Text className="mt-1 text-xs text-gray-600 dark:text-gray-400">
              저금리 대출
            </Text>
          </div>
        </div>
      </div>
    </div>
  );
}
