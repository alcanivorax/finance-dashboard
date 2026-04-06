import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/src/lib/prisma'
import { authorize } from '@/src/middleware/authorize'
import { userUpdateSchema } from '@/src/schemas/user.schema'

export async function GET(context: { params: Promise<{ id: string }> }) {
  const authError = await authorize(['ADMIN'])(new NextRequest(''))
  if (authError) return authError
  try {
    const { id: idString } = await context.params
    const id = Number(idString)
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
      },
    })
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }
    return NextResponse.json({ success: true, user }, { status: 200 })
  } catch {
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const authError = await authorize(['ADMIN'])(req)
  if (authError) return authError
  try {
    const { id: idString } = await context.params
    const id = Number(idString)

    const body = await req.json()
    const parsed = userUpdateSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const user = await prisma.user.update({
      where: { id },
      data: parsed.data,
      select: {
        id: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
      },
    })

    return NextResponse.json({ success: true, user }, { status: 200 })
  } catch {
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const authError = await authorize(['ADMIN'])(req)
  if (authError) return authError
  try {
    const { id: idString } = await context.params
    const id = Number(idString)

    await prisma.user.delete({ where: { id } })
    return NextResponse.json({ success: true }, { status: 200 })
  } catch {
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
