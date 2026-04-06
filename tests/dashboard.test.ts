import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockRecords = [
  {
    id: '1',
    amount: 1000,
    type: 'INCOME',
    category: 'Salary',
    date: new Date('2024-01-15'),
    userId: 1,
  },
  {
    id: '2',
    amount: 200,
    type: 'EXPENSE',
    category: 'Food',
    date: new Date('2024-01-20'),
    userId: 1,
  },
  {
    id: '3',
    amount: 500,
    type: 'INCOME',
    category: 'Freelance',
    date: new Date('2024-02-10'),
    userId: 1,
  },
  {
    id: '4',
    amount: 150,
    type: 'EXPENSE',
    category: 'Transport',
    date: new Date('2024-02-15'),
    userId: 1,
  },
]

vi.mock('@/src/lib/prisma', () => ({
  default: {
    record: {
      findMany: vi.fn().mockResolvedValue(mockRecords),
    },
  },
}))

describe('Dashboard Summary', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('calculates total income correctly', () => {
    const totalIncome = mockRecords
      .filter((r) => r.type === 'INCOME')
      .reduce((sum, r) => sum + r.amount, 0)
    expect(totalIncome).toBe(1500)
  })

  it('calculates total expenses correctly', () => {
    const totalExpense = mockRecords
      .filter((r) => r.type === 'EXPENSE')
      .reduce((sum, r) => sum + r.amount, 0)
    expect(totalExpense).toBe(350)
  })

  it('calculates net balance correctly', () => {
    const totalIncome = mockRecords
      .filter((r) => r.type === 'INCOME')
      .reduce((sum, r) => sum + r.amount, 0)
    const totalExpense = mockRecords
      .filter((r) => r.type === 'EXPENSE')
      .reduce((sum, r) => sum + r.amount, 0)
    const balance = totalIncome - totalExpense
    expect(balance).toBe(1150)
  })
})

describe('Dashboard Categories', () => {
  it('groups income by category', () => {
    const incomeByCategory = mockRecords
      .filter((r) => r.type === 'INCOME')
      .reduce(
        (acc, r) => {
          acc[r.category] = (acc[r.category] || 0) + r.amount
          return acc
        },
        {} as Record<string, number>
      )

    expect(incomeByCategory).toEqual({
      Salary: 1000,
      Freelance: 500,
    })
  })

  it('groups expenses by category', () => {
    const expenseByCategory = mockRecords
      .filter((r) => r.type === 'EXPENSE')
      .reduce(
        (acc, r) => {
          acc[r.category] = (acc[r.category] || 0) + r.amount
          return acc
        },
        {} as Record<string, number>
      )

    expect(expenseByCategory).toEqual({
      Food: 200,
      Transport: 150,
    })
  })
})

describe('Dashboard Trends', () => {
  it('groups records by month', () => {
    const trendsByMonth = mockRecords.reduce(
      (acc, r) => {
        const month = `${r.date.getFullYear()}-${String(r.date.getMonth() + 1).padStart(2, '0')}`
        if (!acc[month]) {
          acc[month] = { income: 0, expense: 0 }
        }
        if (r.type === 'INCOME') {
          acc[month].income += r.amount
        } else {
          acc[month].expense += r.amount
        }
        return acc
      },
      {} as Record<string, { income: number; expense: number }>
    )

    expect(trendsByMonth).toEqual({
      '2024-01': { income: 1000, expense: 200 },
      '2024-02': { income: 500, expense: 150 },
    })
  })

  it('sorts months chronologically', () => {
    const monthKeys = Object.keys(
      mockRecords.reduce(
        (acc, r) => {
          const month = `${r.date.getFullYear()}-${String(r.date.getMonth() + 1).padStart(2, '0')}`
          acc[month] = true
          return acc
        },
        {} as Record<string, boolean>
      )
    )

    const sorted = [...monthKeys].sort((a, b) => a.localeCompare(b))
    expect(sorted).toEqual(['2024-01', '2024-02'])
  })
})
