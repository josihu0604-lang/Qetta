import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth, createAuthError } from '@/lib/auth/session'

export const dynamic = 'force-dynamic'

/**
 * GET /api/user/profile
 * 사용자 프로필 조회
 * @requires Authentication
 */
export async function GET(request: NextRequest) {
  try {
    // Require authentication
    const sessionUser = await requireAuth()

    // Fetch full user data from database
    const user = await prisma.user.findUnique({
      where: { id: sessionUser.id },
    })

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
    // Handle authentication errors
    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return createAuthError(error.message)
    }

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
 * @requires Authentication
 */
export async function PUT(request: NextRequest) {
  try {
    // Require authentication
    const sessionUser = await requireAuth()

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

    const updatedUser = await prisma.user.update({
      where: { id: sessionUser.id },
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
    // Handle authentication errors
    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return createAuthError(error.message)
    }

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
