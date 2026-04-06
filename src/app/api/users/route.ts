import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/src/lib/prisma'
import { Prisma } from '@/prisma/generated/prisma/client'
import { authorize } from '@/src/middleware/authorize'
import { hashPassword } from '@/src/utils/hashPassword'

export async function GET(req: NextRequest) {
  const authError = await authorize(['ADMIN'])(req)
  if (authError) return authError
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
      },
    })
    return NextResponse.json({ success: true, users }, { status: 200 })
  } catch {
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  const authError = await authorize(['ADMIN'])(req)
  if (authError) return authError
  try {
    const body = await req.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: email, password' },
        { status: 400 }
      )
    }

    await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        password: await hashPassword(password),
        role: 'VIEWER',
        status: 'INACTIVE',
      },
    })

    return NextResponse.json(
      { success: true, message: 'User created' },
      { status: 201 }
    )
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === 'P2002'
    ) {
      return NextResponse.json(
        { success: false, error: 'User already exists' },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
