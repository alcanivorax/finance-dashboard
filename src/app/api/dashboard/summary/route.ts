import { NextResponse, NextRequest } from "next/server";
import prisma from "@/src/lib/prisma";
import { authorize } from "@/src/middleware/authorize";

export async function GET(req: NextRequest) {
  const authError = await authorize(["ADMIN", "ANALYST", "VIEWER"])(req);
  if (authError) return authError;
  try {
    const record = await prisma.record.findMany();
    let totalIncome = 0;
    let totalExpense = 0;
    record.forEach((curr) => {
      if (curr.type === "INCOME") totalIncome += curr.amount;
      else totalExpense += curr.amount;
    });
    const balance = totalIncome - totalExpense;
    return NextResponse.json(
      { success: true, data: { totalIncome, totalExpense, balance } },
      { status: 200 },
    );
  } catch {
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
