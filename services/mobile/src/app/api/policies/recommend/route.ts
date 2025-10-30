import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

/**
 * GET /api/policies/recommend
 * 사용자 맞춤 정책 추천
 */
export async function GET(request: NextRequest) {
  try {
    // TODO: JWT 토큰에서 userId 추출
    // TODO: 사용자 프로필 및 부채 데이터 기반 AI 추천

    // Mock delay
    await new Promise((resolve) => setTimeout(resolve, 100))

    // Mock 정책 추천 데이터
    const recommendations = [
      {
        id: '1',
        title: '햇살론뱅크',
        category: 'loan_refinance',
        provider: '서민금융진흥원',
        description: '저신용자를 위한 저금리 대환대출 상품',
        targetAudience: '신용등급 6등급 이하',
        benefits: [
          '연 최대 10.5% 금리',
          '최대 3,000만원 대출',
          '10년 장기 상환',
          '중도상환 수수료 면제',
        ],
        eligibility: {
          creditScore: '6등급 이하',
          income: '연 소득 3,500만원 이하',
          age: '만 19세 이상',
          other: '재직 또는 사업 영위 3개월 이상',
        },
        applicationProcess: [
          '온라인 신청서 작성',
          '서류 제출 (소득증명, 재직증명)',
          '심사 진행 (3-5일)',
          '대출 실행',
        ],
        estimatedSaving: 850000, // 예상 절감 금액 (연간)
        matchScore: 95, // 사용자 매칭 점수 (0-100)
        tags: ['저금리', '장기상환', '중도상환수수료면제'],
        url: 'https://www.kinfa.or.kr/',
        phone: '1397',
        applicationDeadline: null, // 상시 접수
        createdAt: '2025-01-01T00:00:00Z',
      },
      {
        id: '2',
        title: '근로자 소액생활자금 대출',
        category: 'emergency_loan',
        provider: '근로복지공단',
        description: '긴급 생활자금이 필요한 저소득 근로자 지원',
        targetAudience: '저소득 근로자',
        benefits: [
          '연 1.5% 초저금리',
          '최대 1,000만원',
          '5년 분할 상환',
          '6개월 거치 가능',
        ],
        eligibility: {
          creditScore: '제한 없음',
          income: '연 소득 4,000만원 이하',
          age: '재직 중인 근로자',
          other: '고용보험 가입 3개월 이상',
        },
        applicationProcess: [
          '근로복지넷 회원가입',
          '온라인 신청',
          '재직 및 소득 확인',
          '승인 후 대출 실행',
        ],
        estimatedSaving: 620000,
        matchScore: 88,
        tags: ['초저금리', '근로자', '생활안정'],
        url: 'https://www.workdream.net/',
        phone: '1588-0075',
        applicationDeadline: null,
        createdAt: '2025-01-01T00:00:00Z',
      },
      {
        id: '3',
        title: '청년 전월세 보증금 대출',
        category: 'housing_support',
        provider: '주택도시기금',
        description: '청년의 주거 안정을 위한 전월세 보증금 대출',
        targetAudience: '만 19-34세 청년',
        benefits: [
          '연 1.2% 초저금리',
          '최대 1억원',
          '4년 거치 후 6년 분할 상환',
          '중도상환 수수료 없음',
        ],
        eligibility: {
          creditScore: '제한 없음',
          income: '부부 합산 5,000만원 이하',
          age: '만 19-34세',
          other: '무주택 세대주',
        },
        applicationProcess: ['주택도시기금 포털 신청', '서류 제출', '승인 후 대출 실행'],
        estimatedSaving: 450000,
        matchScore: 82,
        tags: ['청년', '주거', '초저금리'],
        url: 'https://nhuf.molit.go.kr/',
        phone: '1566-9009',
        applicationDeadline: null,
        createdAt: '2025-01-01T00:00:00Z',
      },
      {
        id: '4',
        title: '사잇돌 대출',
        category: 'loan_refinance',
        provider: '저축은행중앙회',
        description: '제1금융권 이용이 어려운 중신용자를 위한 대출',
        targetAudience: '신용등급 중하위',
        benefits: ['연 10-15% 금리', '최대 3,000만원', '5년 분할 상환', '담보 불필요'],
        eligibility: {
          creditScore: '7-10등급',
          income: '연 소득 3,500만원 이하',
          age: '만 19세 이상',
          other: '재직 또는 사업 영위',
        },
        applicationProcess: [
          '온라인 상담 신청',
          '가까운 저축은행 방문',
          '서류 제출 및 심사',
          '대출 실행',
        ],
        estimatedSaving: 380000,
        matchScore: 75,
        tags: ['중신용', '무담보', '저축은행'],
        url: 'https://www.fsb.or.kr/',
        phone: '1588-8850',
        applicationDeadline: null,
        createdAt: '2025-01-01T00:00:00Z',
      },
      {
        id: '5',
        title: '카드 채무 조정 프로그램',
        category: 'debt_adjustment',
        provider: '신용회복위원회',
        description: '카드 빚 상환이 어려운 분들을 위한 채무 조정',
        targetAudience: '카드 채무자',
        benefits: [
          '이자율 최대 10% 인하',
          '상환 기간 최대 10년 연장',
          '연체 이자 면제',
          '신용 회복 지원',
        ],
        eligibility: {
          creditScore: '제한 없음',
          income: '소득 있는 자',
          age: '만 19세 이상',
          other: '카드 채무 500만원 이상',
        },
        applicationProcess: [
          '신용회복위원회 상담',
          '채무 조정 신청',
          '금융회사 협의',
          '조정 안 확정',
        ],
        estimatedSaving: 920000,
        matchScore: 70,
        tags: ['채무조정', '카드빚', '신용회복'],
        url: 'https://www.ccrs.or.kr/',
        phone: '1600-5500',
        applicationDeadline: null,
        createdAt: '2025-01-01T00:00:00Z',
      },
    ]

    return NextResponse.json(
      {
        success: true,
        data: recommendations,
        meta: {
          total: recommendations.length,
          averageMatchScore:
            recommendations.reduce((sum, rec) => sum + rec.matchScore, 0) / recommendations.length,
          totalEstimatedSaving: recommendations.reduce(
            (sum, rec) => sum + rec.estimatedSaving,
            0,
          ),
        },
        timestamp: new Date().toISOString(),
      },
      { status: 200 },
    )
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch policy recommendations',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    )
  }
}
