import { NextResponse, NextRequest } from "next/server";
import prisma from "@/src/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const record = await prisma.record.findMany();
    let totalIncome = 0;
    record.forEach((curr) => {
      if (curr.type === "INCOME") totalIncome += curr.amount;
    });
    let totalExpense = 0;
    record.forEach((curr) => {
      if (curr.type === "EXPENSE") totalExpense += curr.amount;
    });
    const balance = totalIncome + totalExpense;
    return NextResponse.json(
      {
        success: true,
        totalIncome,
        totalExpense,
        balance,
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
