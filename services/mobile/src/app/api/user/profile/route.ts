import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// Mock user data (나중에 데이터베이스로 대체)
const mockUserProfile = {
  id: '1',
  name: '김헤파',
  email: 'hephaitos@example.com',
  phone: '010-1234-5678',
  birthDate: '1990-01-01',
  createdAt: '2025-01-01T00:00:00Z',
  updatedAt: '2025-10-30T00:00:00Z',
}

/**
 * GET /api/user/profile
 * 사용자 프로필 조회
 */
export async function GET(request: NextRequest) {
  try {
    // TODO: 실제로는 JWT 토큰에서 사용자 ID를 추출해야 함
    // const token = request.headers.get('authorization')
    // const userId = extractUserIdFromToken(token)

    // Mock delay (실제 DB 조회 시뮬레이션)
    await new Promise((resolve) => setTimeout(resolve, 100))

    return NextResponse.json(
      {
        success: true,
        data: mockUserProfile,
      },
      { status: 200 },
    )
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch user profile',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    )
  }
}

/**
 * PUT /api/user/profile
 * 사용자 프로필 수정
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()

    // 유효성 검증
    const { name, phone, birthDate } = body

    if (!name || typeof name !== 'string') {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid name',
        },
        { status: 400 },
      )
    }

    // Mock delay
    await new Promise((resolve) => setTimeout(resolve, 100))

    // Mock update
    const updatedProfile = {
      ...mockUserProfile,
      name,
      phone,
      birthDate,
      updatedAt: new Date().toISOString(),
    }

    return NextResponse.json(
      {
        success: true,
        data: updatedProfile,
        message: 'Profile updated successfully',
      },
      { status: 200 },
    )
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update user profile',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    )
  }
}
