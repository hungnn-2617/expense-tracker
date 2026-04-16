"use client"

import Link from "next/link"
import { formatVND, formatDate } from "@/app/lib/format"
import { cn } from "@/app/lib/utils"
import { useState } from "react"
import { deleteTransaction } from "@/app/lib/actions/transaction"
import { Modal } from "@/app/components/ui/Modal"
import { Button } from "@/app/components/ui/Button"
import type { Transaction, Category } from "@prisma/client"

interface TransactionRowProps {
  transaction: Transaction & { category: Category | null }
}

export function TransactionRow({ transaction }: TransactionRowProps) {
  const [showDelete, setShowDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const isExpense = transaction.type === "EXPENSE"

  async function handleDelete() {
    setDeleting(true)
    await deleteTransaction(transaction.id)
    setShowDelete(false)
    setDeleting(false)
  }

  return (
    <>
      <div className="flex items-center justify-between py-3 px-4 hover:bg-gray-50 rounded-lg transition-colors">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <span className="text-xl flex-shrink-0">
            {transaction.category?.icon ?? "📦"}
          </span>
          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {transaction.category?.name ?? "Không phân loại"}
            </p>
            {transaction.description && (
              <p className="text-xs text-gray-500 truncate">{transaction.description}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4 flex-shrink-0">
          <div className="text-right">
            <p
              className={cn(
                "text-sm font-semibold",
                isExpense ? "text-red-600" : "text-green-600"
              )}
            >
              {isExpense ? "-" : "+"}{formatVND(transaction.amount)}
            </p>
            <p className="text-xs text-gray-400">{formatDate(transaction.date)}</p>
          </div>

          <div className="flex items-center gap-1">
            <Link
              href={`/transactions/${transaction.id}`}
              className="p-1.5 text-gray-400 hover:text-blue-600 rounded"
              title="Sửa"
            >
              ✏️
            </Link>
            <button
              onClick={() => setShowDelete(true)}
              className="p-1.5 text-gray-400 hover:text-red-600 rounded"
              title="Xóa"
            >
              🗑️
            </button>
          </div>
        </div>
      </div>

      <Modal open={showDelete} onOpenChange={setShowDelete} title="Xác nhận xóa">
        <p className="text-sm text-gray-600 mb-4">
          Bạn có chắc muốn xóa giao dịch này? Hành động này không thể hoàn tác.
        </p>
        <div className="flex gap-3 justify-end">
          <Button variant="secondary" onClick={() => setShowDelete(false)}>
            Hủy
          </Button>
          <Button variant="danger" onClick={handleDelete} disabled={deleting}>
            {deleting ? "Đang xóa..." : "Xóa"}
          </Button>
        </div>
      </Modal>
    </>
  )
}
