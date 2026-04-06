import { NextRequest, NextResponse } from "next/server";
import prisma from "@/src/lib/prisma";
import { authorize } from "@/src/middleware/authorize";
import { recordUpdateSchema } from "@/src/schemas/record.schema";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const authError = await authorize(["ADMIN", "ANALYST"])(req);
  if (authError) return authError;
  try {
    const record = await prisma.record.findUnique({
      where: { id: params.id },
    });
    if (!record) {
      return NextResponse.json(
        { success: false, error: "Record not found" },
        { status: 404 },
      );
    }
    return NextResponse.json({ success: true, record }, { status: 200 });
  } catch {
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const authError = await authorize(["ADMIN"])(req);
  if (authError) return authError;
  try {
    const record = await prisma.record.findUnique({
      where: { id: params.id },
    });
    if (!record) {
      return NextResponse.json(
        { success: false, error: "Record not found" },
        { status: 404 },
      );
    }
    await prisma.record.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ success: true }, { status: 200 });
  } catch {
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const authError = await authorize(["ADMIN"])(req);
  if (authError) return authError;
  try {
    const body = await req.json();
    const parsed = recordUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.flatten() },
        { status: 400 },
      );
    }
    const record = await prisma.record.update({
      where: { id: params.id },
      data: parsed.data,
    });
    return NextResponse.json({ success: true, record }, { status: 200 });
  } catch {
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
