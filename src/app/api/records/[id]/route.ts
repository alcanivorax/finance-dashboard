import { NextRequest, NextResponse } from "next/server";
import prisma from "@/src/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
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
  try {
    const { amount, category, date } = await req.json();
    const record = await prisma.record.update({
      where: { id: params.id },
      data: { amount, category, date },
    });
    return NextResponse.json({ success: true, record }, { status: 200 });
  } catch {
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
