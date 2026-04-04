import { z } from "zod";

export const userSchema = z.object({
  email: z.email({ message: "Invalid email address" }),

  password: z
    .string()
    .min(8, { error: "Minimum 8 characters required" })
    .regex(/[A-Z]/, { error: "Must include at least one uppercase letter" })
    .regex(/[0-9]/, { error: "Must include at least one number" }),
});
