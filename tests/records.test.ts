import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockRecords = [
  {
    id: '1',
    amount: 100,
    type: 'INCOME',
    category: 'Salary',
    date: new Date('2024-01-15'),
    userId: 1,
  },
  {
    id: '2',
    amount: 50,
    type: 'EXPENSE',
    category: 'Food',
    date: new Date('2024-01-20'),
    userId: 1,
  },
  {
    id: '3',
    amount: 200,
    type: 'INCOME',
    category: 'Freelance',
    date: new Date('2024-02-10'),
    userId: 1,
  },
]

describe('Record Filtering Logic', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Filter by type', () => {
    it('filters income records only', () => {
      const filtered = mockRecords.filter((r) => r.type === 'INCOME')
      expect(filtered).toHaveLength(2)
      expect(filtered.every((r) => r.type === 'INCOME')).toBe(true)
    })

    it('filters expense records only', () => {
      const filtered = mockRecords.filter((r) => r.type === 'EXPENSE')
      expect(filtered).toHaveLength(1)
      expect(filtered[0].type).toBe('EXPENSE')
    })
  })

  describe('Filter by category', () => {
    it('filters by exact category match', () => {
      const filtered = mockRecords.filter((r) => r.category === 'Salary')
      expect(filtered).toHaveLength(1)
      expect(filtered[0].id).toBe('1')
    })

    it('returns empty for non-existent category', () => {
      const filtered = mockRecords.filter((r) => r.category === 'Rent')
      expect(filtered).toHaveLength(0)
    })
  })

  describe('Filter by date range', () => {
    it('filters records within date range', () => {
      const startDate = new Date('2024-01-01')
      const endDate = new Date('2024-01-31')
      const filtered = mockRecords.filter(
        (r) => r.date >= startDate && r.date <= endDate
      )
      expect(filtered).toHaveLength(2)
    })

    it('filters records from start date only', () => {
      const startDate = new Date('2024-02-01')
      const filtered = mockRecords.filter((r) => r.date >= startDate)
      expect(filtered).toHaveLength(1)
      expect(filtered[0].id).toBe('3')
    })

    it('filters records until end date only', () => {
      const endDate = new Date('2024-01-31')
      const filtered = mockRecords.filter((r) => r.date <= endDate)
      expect(filtered).toHaveLength(2)
    })
  })

  describe('Combined filters', () => {
    it('filters by type and category', () => {
      const filtered = mockRecords.filter(
        (r) => r.type === 'INCOME' && r.category === 'Salary'
      )
      expect(filtered).toHaveLength(1)
      expect(filtered[0].id).toBe('1')
    })

    it('filters by type and date range', () => {
      const filtered = mockRecords.filter(
        (r) =>
          r.type === 'INCOME' &&
          r.date >= new Date('2024-01-01') &&
          r.date <= new Date('2024-01-31')
      )
      expect(filtered).toHaveLength(1)
      expect(filtered[0].id).toBe('1')
    })
  })
})

describe('CRUD Operations', () => {
  let records: typeof mockRecords

  beforeEach(() => {
    records = [...mockRecords]
  })

  describe('Create', () => {
    it('adds new record', () => {
      const newRecord = {
        id: '4',
        amount: 75,
        type: 'EXPENSE' as const,
        category: 'Entertainment',
        date: new Date('2024-02-20'),
        userId: 1,
      }
      records.push(newRecord)
      expect(records).toHaveLength(4)
    })
  })

  describe('Read', () => {
    it('finds record by id', () => {
      const record = records.find((r) => r.id === '2')
      expect(record).toBeDefined()
      expect(record?.amount).toBe(50)
    })
  })

  describe('Update', () => {
    it('updates record amount', () => {
      const index = records.findIndex((r) => r.id === '1')
      records[index] = { ...records[index], amount: 150 }
      expect(records[0].amount).toBe(150)
    })
  })

  describe('Delete', () => {
    it('removes record by id', () => {
      records = records.filter((r) => r.id !== '2')
      expect(records).toHaveLength(2)
      expect(records.find((r) => r.id === '2')).toBeUndefined()
    })
  })
})
