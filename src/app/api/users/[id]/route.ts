import { NextRequest, NextResponse } from "next/server";
import prisma from "@/src/lib/prisma";
import { authorize } from "@/src/middleware/authorize";

export async function GET(context: { params: Promise<{ id: string }> }) {
  const authError = await authorize(["ADMIN"])(new NextRequest(""));
  if (authError) return authError;
  try {
    const { id: idString } = await context.params;
    const id = Number(idString);
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        role: true,
        status: true,
      },
    });
    return NextResponse.json(
      { success: true, message: "Fetched data", data: user },
      { status: 200 },
    );
  } catch {
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const authError = await authorize(["ADMIN"])(req);
  if (authError) return authError;
  try {
    const { id: idString } = await context.params;
    const id = Number(idString);

    const { email, role, status } = await req.json();
    const user = await prisma.user.update({
      where: { id },
      data: {
        email,
        role,
        status,
      },
    });

    return NextResponse.json(
      { success: true, message: "Updated Successfully", data: user },
      { status: 201 },
    );
  } catch (err) {
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const authError = await authorize(["ADMIN"])(req);
  if (authError) return authError;
  try {
    const { id: idString } = await context.params;
    const id = Number(idString);

    await prisma.user.delete({ where: { id } });
    return NextResponse.json(
      { success: true, message: "Successfully deleted User" },
      { status: 200 },
    );
  } catch {
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
