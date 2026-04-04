import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
export function proxy(request: NextRequest) {
  return NextResponse.redirect(new URL("/sign-up", request.url));
}

export const config = {
  matcher: ["/records", "/dashboard/categories", "/dashboard/trends", "/users"],
};
