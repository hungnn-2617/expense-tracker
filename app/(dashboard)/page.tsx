import { getDashboardSummary, getCategoryBreakdown, getTimeSeriesData } from "@/app/lib/services/transaction"
import { SummaryCards } from "@/app/components/dashboard/SummaryCards"
import { ExpensePieChart } from "@/app/components/dashboard/ExpensePieChart"
import { IncomeExpenseBarChart } from "@/app/components/dashboard/IncomeExpenseBarChart"
import { PeriodSelector } from "@/app/components/dashboard/PeriodSelector"
import { EmptyState } from "@/app/components/dashboard/EmptyState"
import { Card } from "@/app/components/ui/Card"
import type { Period } from "@/app/lib/types"

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const params = await searchParams
  const period = (params.period as Period) || "monthly"
  const now = new Date()

  const [summary, categoryBreakdown, timeSeries] = await Promise.all([
    getDashboardSummary(period, now),
    getCategoryBreakdown(period, now),
    getTimeSeriesData(period, now),
  ])

  const hasData = summary.totalIncome > 0 || summary.totalExpenses > 0

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Tổng quan</h1>
        <PeriodSelector />
      </div>

      <SummaryCards summary={summary} />

      {!hasData ? (
        <Card>
          <EmptyState />
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Chi tiêu theo danh mục</h2>
            <ExpensePieChart data={categoryBreakdown} />
          </Card>
          <Card>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Thu chi theo thời gian</h2>
            <IncomeExpenseBarChart data={timeSeries} />
          </Card>
        </div>
      )}
    </div>
  )
}
