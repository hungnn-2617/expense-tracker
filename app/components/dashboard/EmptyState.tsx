import Link from "next/link"

export function EmptyState() {
  return (
    <div className="text-center py-12">
      <p className="text-4xl mb-3">📊</p>
      <p className="text-gray-500 font-medium">Chưa có dữ liệu</p>
      <p className="text-sm text-gray-400 mt-1">
        Hãy{" "}
        <Link href="/transactions/new" className="text-blue-600 hover:underline">
          thêm giao dịch
        </Link>{" "}
        để xem tổng quan.
      </p>
    </div>
  )
}
