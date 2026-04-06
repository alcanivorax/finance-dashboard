import { z } from 'zod'

export const userSchema = z.object({
  email: z.email({ message: 'Invalid email address' }),
  password: z
    .string()
    .min(8, { message: 'Minimum 8 characters required' })
    .regex(/[A-Z]/, { message: 'Must include at least one uppercase letter' })
    .regex(/[0-9]/, { message: 'Must include at least one number' }),
})

export const userUpdateSchema = z.object({
  email: z.email().optional(),
  role: z.enum(['VIEWER', 'ANALYST', 'ADMIN']).optional(),
  status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
})
