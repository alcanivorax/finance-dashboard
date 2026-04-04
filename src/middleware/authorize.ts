import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/src/utils/getUser";

export function authorize(allowedRoles: string[]) {
  return async function (req: NextRequest) {
    const user = await getCurrentUser(req);

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    if (user.status !== "ACTIVE") {
      return NextResponse.json(
        { success: false, error: "User inactive" },
        { status: 403 },
      );
    }

    if (!allowedRoles.includes(user.role)) {
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 },
      );
    }

    return null; // ✅ means allowed
  };
}
