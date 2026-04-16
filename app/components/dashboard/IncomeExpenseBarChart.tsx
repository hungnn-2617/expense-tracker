"use client"

import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid,
} from "recharts"
import { formatVND } from "@/app/lib/format"
import type { TimeSeriesPoint } from "@/app/lib/types"

export function IncomeExpenseBarChart({ data }: { data: TimeSeriesPoint[] }) {
  if (data.length === 0) return null

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="label" tick={{ fontSize: 12 }} />
          <YAxis
            tick={{ fontSize: 12 }}
            tickFormatter={(v: number) =>
              v >= 1_000_000 ? `${(v / 1_000_000).toFixed(0)}M` : `${(v / 1_000).toFixed(0)}K`
            }
          />
          <Tooltip formatter={(value) => formatVND(Number(value))} />
          <Legend />
          <Bar dataKey="income" name="Thu nhập" fill="#2ECC71" radius={[4, 4, 0, 0]} />
          <Bar dataKey="expense" name="Chi tiêu" fill="#FF6B6B" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
