"use client"

import { useState } from "react"
import { CategoryList } from "@/app/components/categories/CategoryList"
import { CategoryForm } from "@/app/components/categories/CategoryForm"
import { Modal } from "@/app/components/ui/Modal"
import { Card } from "@/app/components/ui/Card"
import { Button } from "@/app/components/ui/Button"
import { createCategory, updateCategory } from "@/app/lib/actions/category"
import type { Category } from "@prisma/client"
import type { ActionState } from "@/app/lib/types"

interface CategoriesPageClientProps {
  categories: Category[]
}

export function CategoriesPageClient({ categories }: CategoriesPageClientProps) {
  const [showModal, setShowModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)

  function handleEdit(category: Category) {
    setEditingCategory(category)
    setShowModal(true)
  }

  function handleAdd() {
    setEditingCategory(null)
    setShowModal(true)
  }

  function handleSuccess() {
    setShowModal(false)
    setEditingCategory(null)
  }

  const action = editingCategory
    ? (updateCategory.bind(null, editingCategory.id) as (
        state: ActionState,
        formData: FormData
      ) => Promise<ActionState>)
    : createCategory

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Danh mục</h1>
        <Button onClick={handleAdd}>+ Thêm danh mục</Button>
      </div>

      <Card padding={false}>
        <CategoryList categories={categories} onEdit={handleEdit} />
      </Card>

      <Modal
        open={showModal}
        onOpenChange={setShowModal}
        title={editingCategory ? "Sửa danh mục" : "Tạo danh mục mới"}
      >
        <CategoryForm
          action={action}
          defaultValues={editingCategory ?? undefined}
          onSuccess={handleSuccess}
        />
      </Modal>
    </div>
  )
}
