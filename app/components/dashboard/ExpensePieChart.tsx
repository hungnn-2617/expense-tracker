"use client"

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { formatVND } from "@/app/lib/format"
import type { CategoryBreakdown } from "@/app/lib/types"

export function ExpensePieChart({ data }: { data: CategoryBreakdown[] }) {
  if (data.length === 0) return null

  const chartData = data.map((d) => ({
    name: `${d.categoryIcon} ${d.categoryName}`,
    value: d.total,
    color: d.categoryColor,
  }))

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            dataKey="value"
            nameKey="name"
            paddingAngle={2}
          >
            {chartData.map((entry, i) => (
              <Cell key={i} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => formatVND(Number(value))}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
