import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// Mock debts data
const mockDebts = [
  {
    id: '1',
    userId: '1',
    accountName: '신한은행 마이너스 통장',
    type: 'credit_line',
    totalAmount: 5000000,
    currentBalance: 3500000,
    interestRate: 4.5,
    monthlyPayment: 150000,
    dueDate: '2025-11-15',
    startDate: '2024-01-01',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2025-10-30T00:00:00Z',
  },
  {
    id: '2',
    userId: '1',
    accountName: '국민은행 신용대출',
    type: 'personal_loan',
    totalAmount: 10000000,
    currentBalance: 8200000,
    interestRate: 5.2,
    monthlyPayment: 250000,
    dueDate: '2027-12-31',
    startDate: '2023-06-01',
    createdAt: '2023-06-01T00:00:00Z',
    updatedAt: '2025-10-30T00:00:00Z',
  },
  {
    id: '3',
    userId: '1',
    accountName: '우리카드 할부',
    type: 'installment',
    totalAmount: 1200000,
    currentBalance: 800000,
    interestRate: 8.9,
    monthlyPayment: 200000,
    dueDate: '2026-02-28',
    startDate: '2025-10-01',
    createdAt: '2025-10-01T00:00:00Z',
    updatedAt: '2025-10-30T00:00:00Z',
  },
]

/**
 * GET /api/debts
 * 사용자의 모든 부채 목록 조회
 */
export async function GET(request: NextRequest) {
  try {
    // TODO: JWT 토큰에서 userId 추출
    // const userId = extractUserIdFromToken(request)

    // URL 파라미터
    const searchParams = request.nextUrl.searchParams
    const type = searchParams.get('type') // 부채 유형 필터링

    // Mock delay
    await new Promise((resolve) => setTimeout(resolve, 100))

    let filteredDebts = mockDebts

    if (type) {
      filteredDebts = mockDebts.filter((debt) => debt.type === type)
    }

    return NextResponse.json(
      {
        success: true,
        data: filteredDebts,
        meta: {
          total: filteredDebts.length,
          totalAmount: filteredDebts.reduce((sum, debt) => sum + debt.currentBalance, 0),
          averageInterestRate:
            filteredDebts.reduce((sum, debt) => sum + debt.interestRate, 0) / filteredDebts.length,
        },
      },
      { status: 200 },
    )
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch debts',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    )
  }
}

/**
 * POST /api/debts
 * 새로운 부채 추가
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // 유효성 검증
    const { accountName, type, totalAmount, interestRate, monthlyPayment, dueDate } = body

    if (!accountName || !type || !totalAmount) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields',
        },
        { status: 400 },
      )
    }

    // Mock delay
    await new Promise((resolve) => setTimeout(resolve, 100))

    // Mock 새 부채 생성
    const newDebt = {
      id: String(mockDebts.length + 1),
      userId: '1',
      accountName,
      type,
      totalAmount,
      currentBalance: totalAmount,
      interestRate,
      monthlyPayment,
      dueDate,
      startDate: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    return NextResponse.json(
      {
        success: true,
        data: newDebt,
        message: 'Debt added successfully',
      },
      { status: 201 },
    )
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to add debt',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    )
  }
}
