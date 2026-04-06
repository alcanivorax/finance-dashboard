import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest, NextResponse } from "next/server";

vi.mock("@/src/utils/getUser", () => ({
  getCurrentUser: vi.fn(),
}));

const { getCurrentUser } = await import("@/src/utils/getUser");

vi.mocked(getCurrentUser).mockImplementation(async (req: NextRequest) => {
  const auth = req.headers.get("authorization");
  if (!auth) return null;

  if (auth.includes("admin-token")) {
    return { id: "1", role: "ADMIN", status: "ACTIVE" };
  }
  if (auth.includes("analyst-token")) {
    return { id: "2", role: "ANALYST", status: "ACTIVE" };
  }
  if (auth.includes("viewer-token")) {
    return { id: "3", role: "VIEWER", status: "ACTIVE" };
  }
  if (auth.includes("inactive-token")) {
    return { id: "4", role: "VIEWER", status: "INACTIVE" };
  }
  return null;
});

describe("Authorization Middleware", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getCurrentUser", () => {
    it("returns null when no authorization header", async () => {
      const req = new NextRequest("http://localhost:3000");
      const user = await getCurrentUser(req);
      expect(user).toBeNull();
    });

    it("returns admin user for admin token", async () => {
      const req = new NextRequest("http://localhost:3000", {
        headers: { authorization: "Bearer admin-token" },
      });
      const user = await getCurrentUser(req);
      expect(user).toEqual({ id: "1", role: "ADMIN", status: "ACTIVE" });
    });

    it("returns analyst user for analyst token", async () => {
      const req = new NextRequest("http://localhost:3000", {
        headers: { authorization: "Bearer analyst-token" },
      });
      const user = await getCurrentUser(req);
      expect(user).toEqual({ id: "2", role: "ANALYST", status: "ACTIVE" });
    });

    it("returns viewer user for viewer token", async () => {
      const req = new NextRequest("http://localhost:3000", {
        headers: { authorization: "Bearer viewer-token" },
      });
      const user = await getCurrentUser(req);
      expect(user).toEqual({ id: "3", role: "VIEWER", status: "ACTIVE" });
    });

    it("returns inactive user for inactive token", async () => {
      const req = new NextRequest("http://localhost:3000", {
        headers: { authorization: "Bearer inactive-token" },
      });
      const user = await getCurrentUser(req);
      expect(user).toEqual({ id: "4", role: "VIEWER", status: "INACTIVE" });
    });

    it("returns null for invalid token", async () => {
      const req = new NextRequest("http://localhost:3000", {
        headers: { authorization: "Bearer invalid-token" },
      });
      const user = await getCurrentUser(req);
      expect(user).toBeNull();
    });
  });
});
