import { NextRequest, NextResponse } from "next/server";
import prisma from "@/src/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const records = await prisma.record.findMany({
      select: {
        amount: true,
        type: true,
        date: true,
      },
    });
    if (records.length === 0) {
      return NextResponse.json(
        { success: true, message: "No records found" },
        { status: 200 },
      );
    }

    const trendsMap: Record<string, { income: number; expense: number }> = {};

    records.forEach((record) => {
      const month = new Date(record.date).toLocaleString("default", {
        month: "short",
      });

      if (!trendsMap[month]) {
        trendsMap[month] = { income: 0, expense: 0 };
      }

      if (record.type === "INCOME") {
        trendsMap[month].income += record.amount;
      } else {
        trendsMap[month].expense += record.amount;
      }
    });

    const trends = Object.entries(trendsMap).map(([month, data]) => ({
      month,
      ...data,
    }));

    return NextResponse.json({ success: true, data: trends }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
