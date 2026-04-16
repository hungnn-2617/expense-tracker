"use client"

import { CategoryRow } from "./CategoryRow"
import type { Category } from "@prisma/client"

interface CategoryListProps {
  categories: Category[]
  onEdit: (category: Category) => void
}

export function CategoryList({ categories, onEdit }: CategoryListProps) {
  const expenseCategories = categories.filter((c) => c.type === "EXPENSE")
  const incomeCategories = categories.filter((c) => c.type === "INCOME")

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide px-4 mb-2">
          Chi tiêu
        </h3>
        <div className="divide-y divide-gray-100">
          {expenseCategories.map((cat) => (
            <CategoryRow key={cat.id} category={cat} onEdit={onEdit} />
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide px-4 mb-2">
          Thu nhập
        </h3>
        <div className="divide-y divide-gray-100">
          {incomeCategories.map((cat) => (
            <CategoryRow key={cat.id} category={cat} onEdit={onEdit} />
          ))}
        </div>
      </div>
    </div>
  )
}
