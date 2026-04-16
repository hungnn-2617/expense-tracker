import type { Transaction, Category } from "@prisma/client"
import { format } from "date-fns"

type TransactionWithCategory = Transaction & { category: Category | null }

export function transactionsToCsv(transactions: TransactionWithCategory[]): string {
  const header = "Date,Type,Category,Description,Amount"
  const rows = transactions.map((t) => {
    const date = format(t.date, "yyyy-MM-dd")
    const type = t.type === "INCOME" ? "Income" : "Expense"
    const category = escapeCsvField(t.category?.name ?? "Không phân loại")
    const description = escapeCsvField(t.description ?? "")
    const amount = t.amount.toString()
    return `${date},${type},${category},${description},${amount}`
  })

  return [header, ...rows].join("\n")
}

function escapeCsvField(field: string): string {
  if (field.includes(",") || field.includes('"') || field.includes("\n")) {
    return `"${field.replace(/"/g, '""')}"`
  }
  return field
}
