import { prisma } from "@/app/lib/db"
import type {
  TransactionFilters,
  PaginatedResult,
  DashboardSummary,
  CategoryBreakdown,
  TimeSeriesPoint,
  Period,
} from "@/app/lib/types"
import type { Transaction, Category } from "@prisma/client"
import {
  startOfDay, endOfDay,
  startOfWeek, endOfWeek,
  startOfMonth, endOfMonth,
  subDays, subWeeks, subMonths,
  eachDayOfInterval, eachWeekOfInterval, eachMonthOfInterval,
  format, isSameDay, isSameWeek, isSameMonth,
} from "date-fns"
import { vi } from "date-fns/locale"

type TransactionWithCategory = Transaction & { category: Category | null }

export async function getTransactions(
  filters: TransactionFilters = {}
): Promise<PaginatedResult<TransactionWithCategory>> {
  const page = filters.page ?? 1
  const pageSize = filters.pageSize ?? 10
  const skip = (page - 1) * pageSize

  const where: Record<string, unknown> = {}

  if (filters.type) {
    where.type = filters.type
  }
  if (filters.categoryId) {
    where.categoryId = filters.categoryId
  }
  if (filters.dateFrom || filters.dateTo) {
    where.date = {
      ...(filters.dateFrom ? { gte: filters.dateFrom } : {}),
      ...(filters.dateTo ? { lte: filters.dateTo } : {}),
    }
  }
  if (filters.search) {
    where.description = { contains: filters.search }
  }

  const [data, total] = await Promise.all([
    prisma.transaction.findMany({
      where,
      include: { category: true },
      orderBy: { date: "desc" },
      skip,
      take: pageSize,
    }),
    prisma.transaction.count({ where }),
  ])

  return {
    data,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  }
}

export async function getTransactionById(id: string) {
  return prisma.transaction.findUnique({
    where: { id },
    include: { category: true },
  })
}

function getPeriodRange(period: Period, referenceDate: Date) {
  switch (period) {
    case "daily":
      return {
        start: subDays(startOfDay(referenceDate), 30),
        end: endOfDay(referenceDate),
      }
    case "weekly":
      return {
        start: subWeeks(startOfWeek(referenceDate, { locale: vi }), 12),
        end: endOfWeek(referenceDate, { locale: vi }),
      }
    case "monthly":
      return {
        start: startOfMonth(subMonths(referenceDate, 11)),
        end: endOfMonth(referenceDate),
      }
  }
}

export async function getDashboardSummary(
  period: Period,
  referenceDate: Date
): Promise<DashboardSummary> {
  const { start, end } = getPeriodRange(period, referenceDate)

  const transactions = await prisma.transaction.findMany({
    where: { date: { gte: start, lte: end } },
    select: { type: true, amount: true },
  })

  let totalIncome = 0
  let totalExpenses = 0
  for (const t of transactions) {
    if (t.type === "INCOME") totalIncome += t.amount
    else totalExpenses += t.amount
  }

  return {
    totalIncome,
    totalExpenses,
    netBalance: totalIncome - totalExpenses,
  }
}

export async function getCategoryBreakdown(
  period: Period,
  referenceDate: Date
): Promise<CategoryBreakdown[]> {
  const { start, end } = getPeriodRange(period, referenceDate)

  const transactions = await prisma.transaction.findMany({
    where: { date: { gte: start, lte: end }, type: "EXPENSE" },
    include: { category: true },
  })

  const map = new Map<string, { name: string; color: string; icon: string; total: number }>()

  for (const t of transactions) {
    const key = t.categoryId ?? "uncategorized"
    const existing = map.get(key)
    if (existing) {
      existing.total += t.amount
    } else {
      map.set(key, {
        name: t.category?.name ?? "Không phân loại",
        color: t.category?.color ?? "#AEB6BF",
        icon: t.category?.icon ?? "📦",
        total: t.amount,
      })
    }
  }

  const grandTotal = Array.from(map.values()).reduce((sum, v) => sum + v.total, 0)

  return Array.from(map.entries())
    .map(([categoryId, v]) => ({
      categoryId: categoryId === "uncategorized" ? null : categoryId,
      categoryName: v.name,
      categoryColor: v.color,
      categoryIcon: v.icon,
      total: v.total,
      percentage: grandTotal > 0 ? Math.round((v.total / grandTotal) * 100) : 0,
    }))
    .sort((a, b) => b.total - a.total)
}

export async function getTimeSeriesData(
  period: Period,
  referenceDate: Date
): Promise<TimeSeriesPoint[]> {
  const { start, end } = getPeriodRange(period, referenceDate)

  const transactions = await prisma.transaction.findMany({
    where: { date: { gte: start, lte: end } },
    select: { type: true, amount: true, date: true },
  })

  let intervals: Date[]
  let labelFn: (d: Date) => string
  let matchFn: (txDate: Date, intervalDate: Date) => boolean

  switch (period) {
    case "daily":
      intervals = eachDayOfInterval({ start, end })
      labelFn = (d) => format(d, "dd/MM")
      matchFn = isSameDay
      break
    case "weekly":
      intervals = eachWeekOfInterval({ start, end }, { locale: vi })
      labelFn = (d) => `T${format(d, "w")}`
      matchFn = (txDate, intervalDate) => isSameWeek(txDate, intervalDate, { locale: vi })
      break
    case "monthly":
      intervals = eachMonthOfInterval({ start, end })
      labelFn = (d) => format(d, "MM/yyyy")
      matchFn = isSameMonth
      break
  }

  return intervals.map((intervalDate) => {
    let income = 0
    let expense = 0
    for (const t of transactions) {
      if (matchFn(t.date, intervalDate)) {
        if (t.type === "INCOME") income += t.amount
        else expense += t.amount
      }
    }
    return { label: labelFn(intervalDate), income, expense }
  })
}
