import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/src/lib/prisma'
import { authorize } from '@/src/middleware/authorize'

export async function GET(req: NextRequest) {
  const authError = await authorize(['ADMIN', 'ANALYST', 'VIEWER'])(req)
  if (authError) return authError
  try {
    const records = await prisma.record.findMany()

    const categoryTotals = records.reduce(
      (acc, record) => {
        if (!acc[record.category]) {
          acc[record.category] = { income: 0, expense: 0 }
        }
        if (record.type === 'INCOME') {
          acc[record.category].income += record.amount
        } else {
          acc[record.category].expense += record.amount
        }
        return acc
      },
      {} as Record<string, { income: number; expense: number }>
    )

    return NextResponse.json(
      { success: true, data: categoryTotals },
      { status: 200 }
    )
  } catch {
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
