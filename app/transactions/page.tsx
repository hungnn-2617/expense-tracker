import Link from "next/link"
import { getTransactions } from "@/app/lib/services/transaction"
import { getCategories } from "@/app/lib/services/category"
import { TransactionList } from "@/app/components/transactions/TransactionList"
import { FilterBar } from "@/app/components/transactions/FilterBar"
import { SearchInput } from "@/app/components/transactions/SearchInput"
import { ExportButton } from "@/app/components/transactions/ExportButton"
import { Card } from "@/app/components/ui/Card"
import { Button } from "@/app/components/ui/Button"
import type { TransactionType } from "@/app/lib/types"

export default async function TransactionsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const params = await searchParams
  const page = Number(params.page) || 1
  const type = (params.type as TransactionType) || undefined
  const categoryId = (params.categoryId as string) || undefined
  const dateFrom = params.dateFrom ? new Date(params.dateFrom as string) : undefined
  const dateTo = params.dateTo ? new Date(params.dateTo as string + "T23:59:59") : undefined
  const search = (params.search as string) || undefined

  const [result, categories] = await Promise.all([
    getTransactions({ page, pageSize: 10, type, categoryId, dateFrom, dateTo, search }),
    getCategories(),
  ])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Giao dịch</h1>
        <div className="flex gap-2">
          <ExportButton />
          <Link href="/transactions/new">
            <Button>+ Thêm giao dịch</Button>
          </Link>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <SearchInput />
        </div>
        <FilterBar categories={categories} />
      </div>

      <Card padding={false}>
        <TransactionList
          transactions={result.data}
          currentPage={result.page}
          totalPages={result.totalPages}
        />
      </Card>
    </div>
  )
}
