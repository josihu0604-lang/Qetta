import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth, createAuthError } from '@/lib/auth/session'

export const dynamic = 'force-dynamic'

/**
 * GET /api/debts
 * 사용자의 모든 부채 목록 조회
 * @requires Authentication
 */
export async function GET(request: NextRequest) {
  try {
    // Require authentication
    const sessionUser = await requireAuth()

    // URL 파라미터
    const searchParams = request.nextUrl.searchParams
    const type = searchParams.get('type') // 부채 유형 필터링

    // 부채 조회
    const debts = await prisma.debt.findMany({
      where: {
        userId: sessionUser.id,
        ...(type && { type }),
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    // 통계 계산
    const totalAmount = debts.reduce((sum, debt) => sum + debt.currentBalance, 0)
    const averageInterestRate =
      debts.length > 0 ? debts.reduce((sum, debt) => sum + debt.interestRate, 0) / debts.length : 0

    return NextResponse.json(
      {
        success: true,
        data: debts,
        meta: {
          total: debts.length,
          totalAmount,
          averageInterestRate: Number(averageInterestRate.toFixed(2)),
        },
      },
      { status: 200 },
    )
  } catch (error) {
    // Handle authentication errors
    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return createAuthError(error.message)
    }

    console.error('Failed to fetch debts:', error)
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
 * @requires Authentication
 */
export async function POST(request: NextRequest) {
  try {
    // Require authentication
    const sessionUser = await requireAuth()

    const body = await request.json()

    // 유효성 검증
    const { accountName, type, totalAmount, interestRate, monthlyPayment, dueDate, startDate } =
      body

    if (!accountName || !type || !totalAmount) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields',
        },
        { status: 400 },
      )
    }

    // 새 부채 생성
    const newDebt = await prisma.debt.create({
      data: {
        userId: sessionUser.id,
        accountName,
        type,
        totalAmount,
        currentBalance: totalAmount,
        interestRate,
        monthlyPayment,
        dueDate: dueDate || null,
        startDate: startDate || new Date().toISOString().split('T')[0],
        status: 'active',
      },
    })

    return NextResponse.json(
      {
        success: true,
        data: newDebt,
        message: 'Debt added successfully',
      },
      { status: 201 },
    )
  } catch (error) {
    // Handle authentication errors
    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return createAuthError(error.message)
    }

    console.error('Failed to add debt:', error)
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
