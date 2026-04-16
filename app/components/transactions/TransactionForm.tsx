"use client"

import { useActionState } from "react"
import { Button } from "@/app/components/ui/Button"
import { Input } from "@/app/components/ui/Input"
import { Select } from "@/app/components/ui/Select"
import type { ActionState } from "@/app/lib/types"
import { formatDateForInput } from "@/app/lib/format"
import type { Category, Transaction } from "@prisma/client"

interface TransactionFormProps {
  categories: Category[]
  action: (state: ActionState, formData: FormData) => Promise<ActionState>
  defaultValues?: Transaction & { category: Category | null }
}

const initialState: ActionState = { success: false }

export function TransactionForm({
  categories,
  action,
  defaultValues,
}: TransactionFormProps) {
  const [state, formAction, pending] = useActionState(action, initialState)

  const typeOptions = [
    { value: "EXPENSE", label: "Chi tiêu" },
    { value: "INCOME", label: "Thu nhập" },
  ]

  const categoryOptions = categories.map((c) => ({
    value: c.id,
    label: `${c.icon} ${c.name}`,
  }))

  return (
    <form action={formAction} className="space-y-4">
      {state.error && (
        <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{state.error}</p>
      )}

      <Select
        id="type"
        name="type"
        label="Loại giao dịch"
        options={typeOptions}
        defaultValue={defaultValues?.type ?? "EXPENSE"}
        error={state.errors?.type?.[0]}
      />

      <Input
        id="amount"
        name="amount"
        type="number"
        label="Số tiền (VND)"
        placeholder="0"
        min={1}
        defaultValue={defaultValues?.amount ?? ""}
        error={state.errors?.amount?.[0]}
      />

      <Select
        id="categoryId"
        name="categoryId"
        label="Danh mục"
        options={categoryOptions}
        placeholder="Chọn danh mục"
        defaultValue={defaultValues?.categoryId ?? ""}
        error={state.errors?.categoryId?.[0]}
      />

      <Input
        id="date"
        name="date"
        type="date"
        label="Ngày"
        defaultValue={
          defaultValues ? formatDateForInput(defaultValues.date) : formatDateForInput(new Date())
        }
        error={state.errors?.date?.[0]}
      />

      <Input
        id="description"
        name="description"
        label="Mô tả (tùy chọn)"
        placeholder="Nhập mô tả..."
        maxLength={255}
        defaultValue={defaultValues?.description ?? ""}
        error={state.errors?.description?.[0]}
      />

      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={pending}>
          {pending ? "Đang lưu..." : defaultValues ? "Cập nhật" : "Tạo giao dịch"}
        </Button>
        <Button type="button" variant="secondary" onClick={() => history.back()}>
          Hủy
        </Button>
      </div>
    </form>
  )
}
