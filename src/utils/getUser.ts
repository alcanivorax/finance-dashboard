import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
// utils/getUser.ts
export async function getCurrentUser(req: NextRequest) {
  const token = req.headers.get("authorization")?.split(" ")[1];
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
      role: string;
      status: string;
    };
    return decoded;
  } catch {
    return null;
  }
}
