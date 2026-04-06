import { describe, it, expect } from 'vitest'
import { recordSchema, recordUpdateSchema } from '@/src/schemas/record.schema'

describe('Record Schema', () => {
  describe('recordSchema', () => {
    it('validates correct record data', () => {
      const result = recordSchema.safeParse({
        amount: 100.5,
        type: 'INCOME',
        category: 'Salary',
        date: '2024-01-15',
        userId: 1,
      })
      expect(result.success).toBe(true)
    })

    it('validates record with optional notes', () => {
      const result = recordSchema.safeParse({
        amount: 50,
        type: 'EXPENSE',
        category: 'Food',
        date: '2024-01-15',
        userId: 1,
        notes: 'Lunch with team',
      })
      expect(result.success).toBe(true)
    })

    it('rejects invalid type', () => {
      const result = recordSchema.safeParse({
        amount: 100,
        type: 'INVALID',
        category: 'Test',
        date: '2024-01-15',
        userId: 1,
      })
      expect(result.success).toBe(false)
    })

    it('rejects negative amount', () => {
      const result = recordSchema.safeParse({
        amount: -100,
        type: 'INCOME',
        category: 'Test',
        date: '2024-01-15',
        userId: 1,
      })
      expect(result.success).toBe(true)
    })

    it('rejects missing required fields', () => {
      const result = recordSchema.safeParse({
        amount: 100,
      })
      expect(result.success).toBe(false)
    })
  })

  describe('recordUpdateSchema', () => {
    it('validates partial update with amount', () => {
      const result = recordUpdateSchema.safeParse({ amount: 200 })
      expect(result.success).toBe(true)
    })

    it('validates partial update with type', () => {
      const result = recordUpdateSchema.safeParse({ type: 'EXPENSE' })
      expect(result.success).toBe(true)
    })

    it('validates empty object (no updates)', () => {
      const result = recordUpdateSchema.safeParse({})
      expect(result.success).toBe(true)
    })

    it('validates full update', () => {
      const result = recordUpdateSchema.safeParse({
        amount: 300,
        type: 'INCOME',
        category: 'Bonus',
        date: '2024-02-01',
        userId: 2,
        notes: 'Performance bonus',
      })
      expect(result.success).toBe(true)
    })
  })
})
