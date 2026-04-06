import { NextRequest, NextResponse } from "next/server";
import prisma from "@/src/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const records = await prisma.record.findMany();
    if (records.length === 0) {
      return NextResponse.json(
        { success: false, error: "No records found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, records }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
