import { getCategories } from "@/app/lib/services/category"
import { createTransaction } from "@/app/lib/actions/transaction"
import { TransactionForm } from "@/app/components/transactions/TransactionForm"
import { Card } from "@/app/components/ui/Card"

export default async function NewTransactionPage() {
  const categories = await getCategories()

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Tạo giao dịch mới</h1>
      <Card>
        <TransactionForm categories={categories} action={createTransaction} />
      </Card>
    </div>
  )
}
