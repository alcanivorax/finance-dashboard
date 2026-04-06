import { NextRequest, NextResponse } from "next/server";
import { recordSchema } from "@/src/schemas/record.schema";
import prisma from "@/src/lib/prisma";
import { authorize } from "@/src/middleware/authorize";

export async function POST(req: NextRequest) {
  const authError = await authorize(["ADMIN"])(req);
  if (authError) return authError;
  try {
    const body = await req.json();
    const parsed = recordSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.flatten() },
        { status: 400 },
      );
    }
    const { amount, type, category, notes, date, userId } = parsed.data;

    const record = await prisma.record.create({
      data: {
        amount,
        type,
        category,
        notes,
        date,
        userId,
      },
    });
    return NextResponse.json({ success: true, data: record }, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function GET(req: NextRequest) {
  const authError = await authorize(["ADMIN", "ANALYST"])(req);
  if (authError) return authError;
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");
    const category = searchParams.get("category");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    const where: Record<string, unknown> = {};
    if (type) where.type = type;
    if (category) where.category = category;
    if (startDate || endDate) {
      where.date = {};
      if (startDate)
        (where.date as Record<string, Date>).gte = new Date(startDate);
      if (endDate) (where.date as Record<string, Date>).lte = new Date(endDate);
    }

    const records = await prisma.record.findMany({ where });
    return NextResponse.json({ success: true, data: records }, { status: 200 });
  } catch {
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
