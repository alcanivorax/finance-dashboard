import { describe, it, expect, vi } from "vitest";
import { userSchema, userUpdateSchema } from "@/src/schemas/user.schema";

vi.mock("@/src/lib/prisma", () => ({
  default: {
    user: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

vi.mock("@/src/utils/getUser", () => ({
  getCurrentUser: vi.fn(),
}));

describe("User Schema", () => {
  describe("userSchema", () => {
    it("validates correct user data", () => {
      const result = userSchema.safeParse({
        email: "test@example.com",
        password: "Password123",
      });
      expect(result.success).toBe(true);
    });

    it("rejects invalid email", () => {
      const result = userSchema.safeParse({
        email: "invalid-email",
        password: "Password123",
      });
      expect(result.success).toBe(false);
    });

    it("rejects short password", () => {
      const result = userSchema.safeParse({
        email: "test@example.com",
        password: "Pass1",
      });
      expect(result.success).toBe(false);
    });

    it("rejects password without uppercase", () => {
      const result = userSchema.safeParse({
        email: "test@example.com",
        password: "password123",
      });
      expect(result.success).toBe(false);
    });

    it("rejects password without number", () => {
      const result = userSchema.safeParse({
        email: "test@example.com",
        password: "PasswordABC",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("userUpdateSchema", () => {
    it("validates partial update with role", () => {
      const result = userUpdateSchema.safeParse({ role: "ADMIN" });
      expect(result.success).toBe(true);
    });

    it("validates partial update with status", () => {
      const result = userUpdateSchema.safeParse({ status: "INACTIVE" });
      expect(result.success).toBe(true);
    });

    it("validates partial update with email", () => {
      const result = userUpdateSchema.safeParse({ email: "new@example.com" });
      expect(result.success).toBe(true);
    });

    it("rejects invalid role", () => {
      const result = userUpdateSchema.safeParse({ role: "SUPERADMIN" });
      expect(result.success).toBe(false);
    });

    it("rejects invalid status", () => {
      const result = userUpdateSchema.safeParse({ status: "DELETED" });
      expect(result.success).toBe(false);
    });

    it("rejects invalid email", () => {
      const result = userUpdateSchema.safeParse({ email: "not-an-email" });
      expect(result.success).toBe(false);
    });
  });
});
