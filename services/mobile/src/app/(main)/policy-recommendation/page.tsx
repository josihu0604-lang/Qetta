/**
 * Policy Recommendation Page - AI 기반 정책 추천
 * 
 * Features:
 * - 사용자 맞춤 정부 지원 정책 추천
 * - 정책별 혜택 및 신청 요건
 * - 예상 지원금액 계산
 * - 신청 가이드
 */

import {
  Heading,
  Text,
  Badge,
  Button,
  Divider,
} from '@hephaitos/ui';

// Mock data
const mockPolicies = {
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
  const { eligibilityScore, totalPotentialBenefit, recommendations, categories } = mockPolicies;

  return (
    <div className="min-h-screen bg-gray-50 pb-20 dark:bg-gray-950">
      {/* Header */}
      <div className="bg-white px-4 py-6 shadow-sm dark:bg-gray-900">
        <Heading>정책 추천</Heading>
        <Text className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          AI가 분석한 맞춤 정부 지원 정책
        </Text>
      </div>

      {/* Eligibility Score */}
      <div className="mt-6 px-4">
        <div className="rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <Text className="text-sm opacity-90">정책 적합도 점수</Text>
              <Heading className="mt-2 text-white">{eligibilityScore}점</Heading>
            </div>
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 text-3xl">
              🎯
            </div>
          </div>
          <Divider className="my-4 opacity-30" />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Text className="text-xs opacity-75">추천 정책</Text>
              <Text className="mt-1 font-semibold">{recommendations.length}건</Text>
            </div>
            <div>
              <Text className="text-xs opacity-75">예상 총 혜택</Text>
              <Text className="mt-1 font-semibold">
                {formatCurrency(totalPotentialBenefit)}
              </Text>
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="mt-6 px-4">
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category.name}
              className="flex-shrink-0 rounded-full bg-white px-4 py-2 text-sm font-medium shadow-sm dark:bg-gray-900"
            >
              {category.name} ({category.count})
            </button>
          ))}
        </div>
      </div>

      {/* Policy Recommendations */}
      <div className="mt-6 px-4">
        <div className="mb-3 flex items-center justify-between">
          <Heading level={3}>추천 정책 ({recommendations.length})</Heading>
          <Text className="text-sm text-primary-600 dark:text-primary-400">
            적합도순 ▼
          </Text>
        </div>
        <div className="space-y-4">
          {recommendations.map((policy) => (
            <div
              key={policy.id}
              className="rounded-lg bg-white p-5 shadow-sm dark:bg-gray-900"
            >
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <Heading level={4}>{policy.title}</Heading>
                    {getStatusBadge(policy.applicationStatus)}
                  </div>
                  <Text className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    {policy.provider} · {policy.category}
                  </Text>
                </div>
              </div>

              {/* Match Score */}
              <div className="mt-3 flex items-center space-x-2">
                <div className="flex-1">
                  <div className="h-2 rounded-full bg-gray-200 dark:bg-gray-700">
                    <div
                      className="h-2 rounded-full bg-primary-500"
                      style={{ width: `${policy.matchScore}%` }}
                    />
                  </div>
                </div>
                <Text className="text-sm font-semibold text-primary-600 dark:text-primary-400">
                  {policy.matchScore}%
                </Text>
              </div>

              <Divider className="my-4" />

              {/* Estimated Benefit */}
              <div className="rounded-lg bg-green-50 p-3 dark:bg-green-950/20">
                <Text className="text-xs text-green-800 dark:text-green-300">
                  예상 지원 혜택
                </Text>
                <Heading level={3} className="mt-1 text-green-900 dark:text-green-400">
                  {formatCurrency(policy.estimatedBenefit)}
                </Heading>
              </div>

              {/* Requirements */}
              <div className="mt-4">
                <div className="mb-2 flex items-center justify-between">
                  <Text className="text-sm font-semibold">신청 요건</Text>
                  {getDifficultyBadge(policy.difficulty)}
                </div>
                <ul className="space-y-1">
                  {policy.requirements.map((req, index) => (
                    <li
                      key={index}
                      className="flex items-start text-sm text-gray-700 dark:text-gray-300"
                    >
                      <span className="mr-2 text-green-500">✓</span>
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Benefits */}
              <div className="mt-4">
                <Text className="mb-2 text-sm font-semibold">주요 혜택</Text>
                <ul className="space-y-1">
                  {policy.benefits.map((benefit, index) => (
                    <li
                      key={index}
                      className="flex items-start text-sm text-gray-700 dark:text-gray-300"
                    >
                      <span className="mr-2 text-blue-500">•</span>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Deadline */}
              <div className="mt-4 flex items-center space-x-2 text-sm">
                <Text className="text-gray-600 dark:text-gray-400">신청 마감:</Text>
                <Text className="font-medium text-red-600 dark:text-red-400">
                  {policy.deadline}
                </Text>
              </div>

              {/* Actions */}
              <div className="mt-4 grid grid-cols-2 gap-2">
                <Button outline className="w-full">
                  자세히 보기
                </Button>
                <Button
                  color="primary"
                  className="w-full"
                  disabled={policy.applicationStatus === 'not_eligible'}
                >
                  {policy.applicationStatus === 'eligible'
                    ? '신청하기'
                    : policy.applicationStatus === 'review_needed'
                    ? '요건 확인'
                    : '요건 미달'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Insight */}
      <div className="mt-6 px-4 pb-6">
        <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-950/20">
          <div className="flex items-start space-x-3">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-xl dark:bg-blue-900">
              🤖
            </div>
            <div className="flex-1">
              <Text className="font-semibold text-blue-900 dark:text-blue-400">
                AI 추천 팁
              </Text>
              <Text className="mt-1 text-sm text-blue-800 dark:text-blue-300">
                현재 프로필 기준으로 <strong>청년내일채움공제</strong>와{' '}
                <strong>근로장려금</strong>을 우선 신청하면 연간 약{' '}
                <strong>{formatCurrency(5_500_000)}</strong>의 혜택을 받을 수 있습니다.
              </Text>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
