/**
 * User Registration API
 * 
 * POST /api/auth/register
 * - Create new user account with email and password
 * - Hash password with bcrypt
 * - Return success message
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

// Validation schema
const registerSchema = z.object({
  email: z.string().email('유효한 이메일 주소를 입력해주세요.'),
  password: z
    .string()
    .min(8, '비밀번호는 최소 8자 이상이어야 합니다.')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      '비밀번호는 대문자, 소문자, 숫자를 포함해야 합니다.',
    ),
  name: z.string().min(2, '이름은 최소 2자 이상이어야 합니다.'),
  phone: z.string().optional(),
  birthDate: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate input
    const validation = registerSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: validation.error.errors[0].message,
        },
        { status: 400 },
      )
    }

    const { email, password, name, phone, birthDate } = validation.data

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          error: '이미 등록된 이메일입니다.',
        },
        { status: 409 },
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        phone,
        birthDate,
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        birthDate: true,
        createdAt: true,
      },
    })

    return NextResponse.json(
      {
        success: true,
        data: user,
        message: '회원가입이 완료되었습니다.',
      },
      { status: 201 },
    )
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      {
        success: false,
        error: '회원가입 중 오류가 발생했습니다.',
      },
      { status: 500 },
    )
  }
}
