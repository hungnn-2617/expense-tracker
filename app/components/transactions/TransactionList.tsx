import { TransactionRow } from "./TransactionRow"
import { Pagination } from "@/app/components/ui/Pagination"
import type { Transaction, Category } from "@prisma/client"

interface TransactionListProps {
  transactions: (Transaction & { category: Category | null })[]
  currentPage: number
  totalPages: number
}

export function TransactionList({
  transactions,
  currentPage,
  totalPages,
}: TransactionListProps) {
  if (transactions.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Chưa có giao dịch nào.</p>
        <p className="text-sm text-gray-400 mt-1">Bấm &quot;Thêm giao dịch&quot; để bắt đầu.</p>
      </div>
    )
  }

  return (
    <div>
      <div className="divide-y divide-gray-100">
        {transactions.map((transaction) => (
          <TransactionRow key={transaction.id} transaction={transaction} />
        ))}
      </div>
      <Pagination currentPage={currentPage} totalPages={totalPages} />
    </div>
  )
}
