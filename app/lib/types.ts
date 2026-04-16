export type TransactionType = "INCOME" | "EXPENSE"

export type Period = "daily" | "weekly" | "monthly"

export interface DashboardSummary {
  totalIncome: number
  totalExpenses: number
  netBalance: number
}

export interface CategoryBreakdown {
  categoryId: string | null
  categoryName: string
  categoryColor: string
  categoryIcon: string
  total: number
  percentage: number
}

export interface TimeSeriesPoint {
  label: string
  income: number
  expense: number
}

export interface PaginatedResult<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface TransactionFilters {
  page?: number
  pageSize?: number
  dateFrom?: Date
  dateTo?: Date
  type?: TransactionType
  categoryId?: string
  search?: string
}

export interface ActionState {
  success: boolean
  errors?: Record<string, string[]>
  error?: string
}
