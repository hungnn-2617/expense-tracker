import { Card } from "@/app/components/ui/Card"
import { formatVND } from "@/app/lib/format"
import type { DashboardSummary } from "@/app/lib/types"

export function SummaryCards({ summary }: { summary: DashboardSummary }) {
  const cards = [
    { label: "Thu nhập", value: summary.totalIncome, color: "text-green-600" },
    { label: "Chi tiêu", value: summary.totalExpenses, color: "text-red-600" },
    {
      label: "Số dư",
      value: summary.netBalance,
      color: summary.netBalance >= 0 ? "text-blue-600" : "text-red-600",
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {cards.map((card) => (
        <Card key={card.label}>
          <p className="text-sm text-gray-500">{card.label}</p>
          <p className={`text-2xl font-bold mt-1 ${card.color}`}>
            {formatVND(card.value)}
          </p>
        </Card>
      ))}
    </div>
  )
}
