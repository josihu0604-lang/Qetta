import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

/**
 * GET /api/debts/analysis
 * 부채 분석 데이터 조회
 */
export async function GET(request: NextRequest) {
  try {
    // TODO: JWT 토큰에서 userId 추출
    // 임시: 첫 번째 사용자
    const user = await prisma.user.findFirst()

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: 'User not found',
        },
        { status: 404 },
      )
    }

    // 모든 부채 조회
    const debts = await prisma.debt.findMany({
      where: {
        userId: user.id,
        status: 'active',
      },
    })

    if (debts.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'No debts found',
        },
        { status: 404 },
      )
    }

    // 요약 계산
    const totalDebt = debts.reduce((sum, debt) => sum + debt.currentBalance, 0)
    const totalMonthlyPayment = debts.reduce((sum, debt) => sum + debt.monthlyPayment, 0)
    const averageInterestRate =
      debts.reduce((sum, debt) => sum + debt.interestRate, 0) / debts.length

    // 카테고리별 분석
    const categoryMap = new Map<
      string,
      { amount: number; count: number; totalInterest: number }
    >()

    debts.forEach((debt) => {
      const category = debt.type
      if (!categoryMap.has(category)) {
        categoryMap.set(category, { amount: 0, count: 0, totalInterest: 0 })
      }
      const data = categoryMap.get(category)!
      data.amount += debt.currentBalance
      data.count += 1
      data.totalInterest += debt.interestRate
    })

    const byCategory = Array.from(categoryMap.entries()).map(([category, data]) => {
      const categoryNames: { [key: string]: string } = {
        personal_loan: '신용대출',
        credit_line: '마이너스 통장',
        installment: '할부',
        mortgage: '주택담보대출',
        student_loan: '학자금대출',
      }

      const colors: { [key: string]: string } = {
        personal_loan: '#3b82f6',
        credit_line: '#10b981',
        installment: '#f59e0b',
        mortgage: '#ef4444',
        student_loan: '#8b5cf6',
      }

      return {
        category,
        name: categoryNames[category] || category,
        amount: data.amount,
        percentage: Number(((data.amount / totalDebt) * 100).toFixed(1)),
        interestRate: Number((data.totalInterest / data.count).toFixed(2)),
        color: colors[category] || '#6b7280',
      }
    })

    // 추세 데이터 (최근 6개월 - 임시 mock)
    const trend = {
      labels: ['5월', '6월', '7월', '8월', '9월', '10월'],
      data: [
        totalDebt * 1.2,
        totalDebt * 1.15,
        totalDebt * 1.1,
        totalDebt * 1.05,
        totalDebt * 1.02,
        totalDebt,
      ],
      prediction: [
        totalDebt,
        totalDebt * 0.95,
        totalDebt * 0.9,
      ],
    }

    // 추천사항
    const recommendations = [
      {
        id: '1',
        priority: 'high' as const,
        title: '고금리 부채 우선 상환',
        description: `가장 높은 이자율(${Math.max(...debts.map((d) => d.interestRate)).toFixed(1)}%)의 부채를 먼저 상환하면 이자를 절감할 수 있습니다.`,
        potentialSaving: totalDebt * 0.05,
      },
      {
        id: '2',
        priority: 'medium' as const,
        title: '대출 통합 검토',
        description: `${debts.length}개의 부채를 하나로 통합하면 금리를 낮출 수 있습니다.`,
        potentialSaving: totalDebt * 0.03,
      },
      {
        id: '3',
        priority: 'low' as const,
        title: '정부 지원 정책 확인',
        description: '햇살론 등 저금리 정부 지원 대출을 확인해보세요.',
        potentialSaving: totalDebt * 0.02,
      },
    ]

    // 상환 계획
    const monthlyPayment = totalMonthlyPayment
    const monthsToPayoff = Math.ceil(totalDebt / (monthlyPayment * 0.8)) // 이자 고려
    const totalInterest = totalDebt * averageInterestRate * 0.01 * (monthsToPayoff / 12)

    const payoffPlan = {
      currentStrategy: {
        totalMonths: monthsToPayoff,
        totalInterest: Math.round(totalInterest),
        payoffDate: new Date(Date.now() + monthsToPayoff * 30 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split('T')[0],
      },
      optimizedStrategy: {
        totalMonths: Math.ceil(monthsToPayoff * 0.85),
        totalInterest: Math.round(totalInterest * 0.8),
        payoffDate: new Date(Date.now() + monthsToPayoff * 0.85 * 30 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split('T')[0],
        saving: Math.round(totalInterest * 0.2),
      },
    }

    const analysisData = {
      summary: {
        totalDebt: Math.round(totalDebt),
        totalMonthlyPayment: Math.round(totalMonthlyPayment),
        averageInterestRate: Number(averageInterestRate.toFixed(2)),
        debtCount: debts.length,
      },
      byCategory,
      trend,
      recommendations,
      payoffPlan,
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
    console.error('Failed to analyze debts:', error)
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
