"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/app/components/ui/Input"
import { Select } from "@/app/components/ui/Select"
import type { Category } from "@prisma/client"

interface FilterBarProps {
  categories: Category[]
}

export function FilterBar({ categories }: FilterBarProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    params.delete("page")
    router.push(`/transactions?${params.toString()}`)
  }

  const typeOptions = [
    { value: "", label: "Tất cả" },
    { value: "EXPENSE", label: "Chi tiêu" },
    { value: "INCOME", label: "Thu nhập" },
  ]

  const categoryOptions = [
    { value: "", label: "Tất cả danh mục" },
    ...categories.map((c) => ({ value: c.id, label: `${c.icon} ${c.name}` })),
  ]

  return (
    <div className="flex flex-wrap gap-3">
      <div className="w-40">
        <Input
          type="date"
          placeholder="Từ ngày"
          defaultValue={searchParams.get("dateFrom") ?? ""}
          onChange={(e) => updateParam("dateFrom", e.target.value)}
        />
      </div>
      <div className="w-40">
        <Input
          type="date"
          placeholder="Đến ngày"
          defaultValue={searchParams.get("dateTo") ?? ""}
          onChange={(e) => updateParam("dateTo", e.target.value)}
        />
      </div>
      <div className="w-36">
        <Select
          options={typeOptions}
          defaultValue={searchParams.get("type") ?? ""}
          onChange={(e) => updateParam("type", e.target.value)}
        />
      </div>
      <div className="w-48">
        <Select
          options={categoryOptions}
          defaultValue={searchParams.get("categoryId") ?? ""}
          onChange={(e) => updateParam("categoryId", e.target.value)}
        />
      </div>
    </div>
  )
}
