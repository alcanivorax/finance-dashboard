import { NextRequest, NextResponse } from "next/server";
import { recordSchema } from "@/src/schemas/record.schema";
import prisma from "@/src/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = recordSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Invalid input" },
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
  } catch {
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const records = await prisma.record.findMany();
    return NextResponse.json({ success: true, records }, { status: 200 });
  } catch {
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
