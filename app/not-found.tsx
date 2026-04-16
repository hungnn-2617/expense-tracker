import Link from "next/link"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
      <h2 className="text-2xl font-bold text-gray-900">404</h2>
      <p className="text-gray-600">Trang bạn tìm kiếm không tồn tại.</p>
      <Link
        href="/"
        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
      >
        ← Về trang chủ
      </Link>
    </div>
  )
}
