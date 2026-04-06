import { NextRequest, NextResponse } from "next/server";
import prisma from "@/src/lib/prisma";

type Filter = {
  category?: string;
};

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const filter: Filter = {};

    if (category) filter.category = category;

    const records = await prisma.record.findMany({
      where: filter,
      orderBy: { date: "desc" },
    });
    if (records.length === 0) {
      return NextResponse.json(
        { success: true, message: "No records found" },
        { status: 200 },
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
