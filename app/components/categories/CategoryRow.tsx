"use client"

import { useState } from "react"
import { deleteCategory } from "@/app/lib/actions/category"
import { Modal } from "@/app/components/ui/Modal"
import { Button } from "@/app/components/ui/Button"
import type { Category } from "@prisma/client"

interface CategoryRowProps {
  category: Category
  onEdit: (category: Category) => void
}

export function CategoryRow({ category, onEdit }: CategoryRowProps) {
  const [showDelete, setShowDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)

  async function handleDelete() {
    setDeleting(true)
    await deleteCategory(category.id)
    setShowDelete(false)
    setDeleting(false)
  }

  return (
    <>
      <div className="flex items-center justify-between py-3 px-4 hover:bg-gray-50 rounded-lg transition-colors">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center text-xl"
            style={{ backgroundColor: category.color + "20" }}
          >
            {category.icon}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">{category.name}</p>
            <p className="text-xs text-gray-400">
              {category.type === "EXPENSE" ? "Chi tiêu" : "Thu nhập"}
              {category.isDefault && " · Mặc định"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {!category.isDefault && (
            <>
              <button
                onClick={() => onEdit(category)}
                className="p-1.5 text-gray-400 hover:text-blue-600 rounded"
                title="Sửa"
              >
                ✏️
              </button>
              <button
                onClick={() => setShowDelete(true)}
                className="p-1.5 text-gray-400 hover:text-red-600 rounded"
                title="Xóa"
              >
                🗑️
              </button>
            </>
          )}
        </div>
      </div>

      <Modal open={showDelete} onOpenChange={setShowDelete} title="Xác nhận xóa danh mục">
        <p className="text-sm text-gray-600 mb-2">
          Bạn có chắc muốn xóa danh mục <strong>{category.name}</strong>?
        </p>
        <p className="text-xs text-gray-400 mb-4">
          Các giao dịch thuộc danh mục này sẽ chuyển thành &quot;Không phân loại&quot;.
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
