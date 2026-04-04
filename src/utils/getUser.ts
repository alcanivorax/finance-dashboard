import { NextRequest } from "next/server";
// utils/getUser.ts
export async function getCurrentUser(req: NextRequest) {
  // Later replace with JWT/session
  return {
    id: "123",
    role: "ADMIN", // or from token/db
    status: "ACTIVE",
  };
}
