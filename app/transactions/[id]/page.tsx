import { notFound } from "next/navigation"
import { getTransactionById } from "@/app/lib/services/transaction"
import { getCategories } from "@/app/lib/services/category"
import { updateTransaction } from "@/app/lib/actions/transaction"
import { TransactionForm } from "@/app/components/transactions/TransactionForm"
import { Card } from "@/app/components/ui/Card"
import type { ActionState } from "@/app/lib/types"

export default async function EditTransactionPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const [transaction, categories] = await Promise.all([
    getTransactionById(id),
    getCategories(),
  ])

  if (!transaction) {
    notFound()
  }

  const boundAction = updateTransaction.bind(null, id) as (
    state: ActionState,
    formData: FormData
  ) => Promise<ActionState>

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Sửa giao dịch</h1>
      <Card>
        <TransactionForm
          categories={categories}
          action={boundAction}
          defaultValues={transaction}
        />
      </Card>
    </div>
  )
}
