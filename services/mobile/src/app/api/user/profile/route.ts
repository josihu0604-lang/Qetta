import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

/**
 * GET /api/user/profile
 * 사용자 프로필 조회
 */
export async function GET(request: NextRequest) {
  try {
    // TODO: 실제로는 JWT 토큰에서 사용자 ID를 추출해야 함
    // const token = request.headers.get('authorization')
    // const userId = extractUserIdFromToken(token)

    // 임시: 첫 번째 사용자 조회
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

    return NextResponse.json(
      {
        success: true,
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          birthDate: user.birthDate,
          createdAt: user.createdAt.toISOString(),
          updatedAt: user.updatedAt.toISOString(),
        },
      },
      { status: 200 },
    )
  } catch (error) {
    console.error('Failed to fetch user profile:', error)
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

    // TODO: 실제로는 JWT 토큰에서 사용자 ID를 추출
    // 임시: 첫 번째 사용자 업데이트
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

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        name,
        phone,
        birthDate,
      },
    })

    return NextResponse.json(
      {
        success: true,
        data: {
          id: updatedUser.id,
          name: updatedUser.name,
          email: updatedUser.email,
          phone: updatedUser.phone,
          birthDate: updatedUser.birthDate,
          createdAt: updatedUser.createdAt.toISOString(),
          updatedAt: updatedUser.updatedAt.toISOString(),
        },
        message: 'Profile updated successfully',
      },
      { status: 200 },
    )
  } catch (error) {
    console.error('Failed to update user profile:', error)
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
