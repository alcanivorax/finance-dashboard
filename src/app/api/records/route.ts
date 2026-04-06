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
    return NextResponse.json({ success: true, record }, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: (err as Error).message },
      { status: 500 },
    );
  }
}

export async function GET(req: NextRequest) {
  const authError = await authorize(["ADMIN", "ANALYST"])(req);
  if (authError) return authError;
  try {
    const records = await prisma.record.findMany();
    if (records.length === 0) {
      return NextResponse.json(
        { success: true, message: "No records found" },
        { status: 200 },
      );
    }
    return NextResponse.json({ success: true, records }, { status: 200 });
  } catch {
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
