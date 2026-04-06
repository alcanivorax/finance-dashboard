import { NextRequest, NextResponse } from "next/server";
import prisma from "@/src/lib/prisma";
import { userSchema } from "@/src/schemas/user.schema";
import bcrypt from "bcryptjs";
import { authorize } from "@/src/middleware/authorize";

export async function GET(req: NextRequest) {
  const authError = await authorize(["ADMIN"])(req);
  if (authError) return authError;
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
      },
    });
    return NextResponse.json({ success: true, users }, { status: 200 });
  } catch {
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  // const authError = await authorize(["ADMIN"])(req);
  // if (authError) return authError;
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

    const validatedEmail = email.toLowerCase();

    const userExists = await prisma.user.findUnique({
      where: { email: validatedEmail },
    });
    if (userExists) {
      return NextResponse.json(
        { success: false, error: "User already exsits" },
        { status: 400 },
      );
    }

    const hashPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        email: validatedEmail,
        password: hashPassword,
        role: "VIEWER",
        status: "INACTIVE",
      },
    });

    return NextResponse.json(
      { success: true, message: "Account created. Await activation." },
      { status: 201 },
    );
  } catch {
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
