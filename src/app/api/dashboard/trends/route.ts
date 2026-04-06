import { NextRequest, NextResponse } from "next/server";
import prisma from "@/src/lib/prisma";
import { authorize } from "@/src/middleware/authorize";

export async function GET(req: NextRequest) {
  const authError = await authorize(["ADMIN", "ANALYST", "VIEWER"])(req);
  if (authError) return authError;
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
      const date = new Date(record.date);
      const year = date.getFullYear();
      const month = date.getMonth();
      const key = `${year}-${month.toString().padStart(2, "0")}`;

      if (!trendsMap[key]) {
        trendsMap[key] = { income: 0, expense: 0 };
      }

      if (record.type === "INCOME") {
        trendsMap[key].income += record.amount;
      } else {
        trendsMap[key].expense += record.amount;
      }
    });

    const trends = Object.entries(trendsMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, data]) => ({
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
