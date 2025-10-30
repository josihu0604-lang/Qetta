import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  return NextResponse.json(
    {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'hephaitos-mobile-api',
      version: '1.0.0',
    },
    { status: 200 },
  )
}
