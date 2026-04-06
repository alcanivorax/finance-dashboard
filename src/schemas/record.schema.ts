import { z } from 'zod'

type RECORDTYPE = 'INCOME' | 'EXPENSE'

export interface RECORD {
  amount: number
  type: RECORDTYPE
  category: string
  notes?: string
  date: string
  userId: number
}

export const recordSchema = z.object({
  amount: z.number(),
  type: z.enum(['INCOME', 'EXPENSE']),
  category: z.string(),
  notes: z.string().optional(),
  date: z.string(),
  userId: z.number(),
})

export const recordUpdateSchema = recordSchema.partial()
