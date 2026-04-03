import { NextRequest, NextResponse } from "next/server";
import { userSchema } from "@/src/schemas/user.schema";
import prisma from "@/src/lib/prisma";
import { Prisma } from "@/prisma/generated/prisma/client";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = userSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const { email, password } = parsed.data;

    const normalizedEmail = email.toLowerCase();

    const hashPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        email: normalizedEmail,
        password: hashPassword,
        role: "VIEWER",
        status: "INACTIVE",
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Account created. Await activation.",
      },
      { status: 201 },
    );
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2002") {
        return NextResponse.json(
          { success: false, error: "User already exists" },
          { status: 400 },
        );
      }
    }

    console.error("Signup error:", err);

    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
