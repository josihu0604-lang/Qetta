import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

/**
 * GET /api/policies/recommend
 * 사용자 맞춤 정책 추천
 */
export async function GET(request: NextRequest) {
  try {
    // TODO: JWT 토큰에서 userId 추출
    // TODO: 사용자 프로필 및 부채 데이터 기반 AI 추천

    // 모든 활성 정책 조회
    const policies = await prisma.policy.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        estimatedSaving: 'desc',
      },
    })

    // 정책 데이터 변환 (JSON 문자열 파싱)
    const recommendations = policies.map((policy, index) => {
      // 매칭 점수 계산 (임시: estimatedSaving 기반)
      const matchScore = Math.max(70, Math.min(95, 70 + (5 - index) * 5))

      return {
        id: policy.id,
        title: policy.title,
        category: policy.category,
        provider: policy.provider,
        description: policy.description,
        targetAudience: policy.targetAudience,
        benefits: JSON.parse(policy.benefits),
        eligibility: {
          creditScore: policy.eligibilityCreditScore || '',
          income: policy.eligibilityIncome || '',
          age: policy.eligibilityAge || '',
          other: policy.eligibilityOther,
        },
        applicationProcess: JSON.parse(policy.applicationProcess),
        estimatedSaving: policy.estimatedSaving || 0,
        matchScore,
        tags: JSON.parse(policy.tags),
        url: policy.applicationUrl || '',
        phone: policy.applicationPhone || '',
        applicationDeadline: policy.applicationDeadline,
        createdAt: policy.createdAt.toISOString(),
      }
    })

    // 통계 계산
    const averageMatchScore =
      recommendations.length > 0
        ? recommendations.reduce((sum, rec) => sum + rec.matchScore, 0) / recommendations.length
        : 0

    const totalEstimatedSaving = recommendations.reduce(
      (sum, rec) => sum + rec.estimatedSaving,
      0,
    )

    return NextResponse.json(
      {
        success: true,
        data: recommendations,
        meta: {
          total: recommendations.length,
          averageMatchScore: Number(averageMatchScore.toFixed(1)),
          totalEstimatedSaving,
        },
        timestamp: new Date().toISOString(),
      },
      { status: 200 },
    )
  } catch (error) {
    console.error('Failed to fetch policy recommendations:', error)
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
