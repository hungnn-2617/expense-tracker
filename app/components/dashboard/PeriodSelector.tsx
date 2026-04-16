"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { cn } from "@/app/lib/utils"
import type { Period } from "@/app/lib/types"

const periods: { value: Period; label: string }[] = [
  { value: "daily", label: "Ngày" },
  { value: "weekly", label: "Tuần" },
  { value: "monthly", label: "Tháng" },
]

export function PeriodSelector() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const current = (searchParams.get("period") as Period) || "monthly"

  function handleChange(period: Period) {
    const params = new URLSearchParams(searchParams.toString())
    params.set("period", period)
    router.push(`/?${params.toString()}`)
  }

  return (
    <div className="flex gap-1 bg-gray-100 p-1 rounded-lg w-fit">
      {periods.map((p) => (
        <button
          key={p.value}
          onClick={() => handleChange(p.value)}
          className={cn(
            "px-4 py-1.5 text-sm font-medium rounded-md transition-colors",
            current === p.value
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          )}
        >
          {p.label}
        </button>
      ))}
    </div>
  )
}
