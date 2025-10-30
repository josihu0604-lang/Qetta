import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

/**
 * GET /api/debts/analysis
 * 부채 분석 데이터 조회
 */
export async function GET(request: NextRequest) {
  try {
    // TODO: JWT 토큰에서 userId 추출
    // TODO: 실제 부채 데이터를 DB에서 가져와서 분석

    // Mock delay
    await new Promise((resolve) => setTimeout(resolve, 100))

    // Mock 분석 데이터
    const analysisData = {
      summary: {
        totalDebt: 12500000, // 총 부채
        totalMonthlyPayment: 600000, // 월 총 상환액
        averageInterestRate: 6.2, // 평균 이자율
        debtCount: 3, // 부채 개수
      },
      byCategory: [
        {
          category: 'personal_loan',
          name: '신용대출',
          amount: 8200000,
          percentage: 65.6,
          interestRate: 5.2,
          color: '#3b82f6', // blue
        },
        {
          category: 'credit_line',
          name: '마이너스 통장',
          amount: 3500000,
          percentage: 28.0,
          interestRate: 4.5,
          color: '#10b981', // green
        },
        {
          category: 'installment',
          name: '할부',
          amount: 800000,
          percentage: 6.4,
          interestRate: 8.9,
          color: '#f59e0b', // amber
        },
      ],
      trend: {
        // 최근 6개월 추세
        labels: ['5월', '6월', '7월', '8월', '9월', '10월'],
        data: [15200000, 14800000, 14200000, 13600000, 13100000, 12500000],
        prediction: [12500000, 11900000, 11300000], // 향후 3개월 예측
      },
      recommendations: [
        {
          id: '1',
          priority: 'high',
          title: '고금리 부채 우선 상환',
          description: '우리카드 할부(8.9%)를 먼저 상환하면 연간 약 71,200원의 이자를 절감할 수 있습니다.',
          potentialSaving: 71200,
        },
        {
          id: '2',
          priority: 'medium',
          title: '대출 통합 검토',
          description: '3개의 부채를 하나로 통합하면 금리를 4.8%로 낮출 수 있습니다.',
          potentialSaving: 175000,
        },
        {
          id: '3',
          priority: 'low',
          title: '정부 지원 정책 확인',
          description: '햇살론 등 저금리 정부 지원 대출을 확인해보세요.',
          potentialSaving: 300000,
        },
      ],
      payoffPlan: {
        // 상환 계획
        currentStrategy: {
          totalMonths: 42,
          totalInterest: 2890000,
          payoffDate: '2028-04-30',
        },
        optimizedStrategy: {
          totalMonths: 36,
          totalInterest: 2340000,
          payoffDate: '2027-10-31',
          saving: 550000,
        },
      },
    }

    return NextResponse.json(
      {
        success: true,
        data: analysisData,
        timestamp: new Date().toISOString(),
      },
      { status: 200 },
    )
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to analyze debts',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    )
  }
}
