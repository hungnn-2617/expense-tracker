"use client"

import { useActionState } from "react"
import { Button } from "@/app/components/ui/Button"
import { Input } from "@/app/components/ui/Input"
import { Select } from "@/app/components/ui/Select"
import type { ActionState } from "@/app/lib/types"
import type { Category } from "@prisma/client"

const EMOJI_OPTIONS = [
  "🍜", "🚗", "🛍️", "🎮", "📄", "💊", "📚", "📦",
  "💰", "💻", "📈", "🎁", "🏠", "✈️", "🎵", "🐾",
  "☕", "💪", "🎬", "📱",
]

const COLOR_OPTIONS = [
  "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7",
  "#DDA0DD", "#98D8C8", "#AEB6BF", "#2ECC71", "#3498DB",
  "#E74C3C", "#F39C12", "#9B59B6", "#1ABC9C", "#E67E22",
]

interface CategoryFormProps {
  action: (state: ActionState, formData: FormData) => Promise<ActionState>
  defaultValues?: Category
  onSuccess?: () => void
}

const initialState: ActionState = { success: false }

export function CategoryForm({ action, defaultValues, onSuccess }: CategoryFormProps) {
  const [state, formAction, pending] = useActionState(async (prev: ActionState, formData: FormData) => {
    const result = await action(prev, formData)
    if (result.success && onSuccess) onSuccess()
    return result
  }, initialState)

  return (
    <form action={formAction} className="space-y-4">
      {state.error && (
        <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{state.error}</p>
      )}

      <Input
        id="name"
        name="name"
        label="Tên danh mục"
        placeholder="VD: Cafe"
        maxLength={50}
        defaultValue={defaultValues?.name ?? ""}
        error={state.errors?.name?.[0]}
      />

      <Select
        id="type"
        name="type"
        label="Loại"
        options={[
          { value: "EXPENSE", label: "Chi tiêu" },
          { value: "INCOME", label: "Thu nhập" },
        ]}
        defaultValue={defaultValues?.type ?? "EXPENSE"}
        error={state.errors?.type?.[0]}
      />

      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">Icon</label>
        <input type="hidden" name="icon" id="icon-input" defaultValue={defaultValues?.icon ?? EMOJI_OPTIONS[0]} />
        <div className="flex flex-wrap gap-2">
          {EMOJI_OPTIONS.map((emoji) => (
            <button
              key={emoji}
              type="button"
              className="w-10 h-10 rounded-lg border-2 text-xl flex items-center justify-center hover:border-blue-500 transition-colors border-gray-200"
              onClick={(e) => {
                const input = document.getElementById("icon-input") as HTMLInputElement
                input.value = emoji
                e.currentTarget.parentElement?.querySelectorAll("button").forEach((b) => {
                  b.classList.remove("border-blue-500", "bg-blue-50")
                  b.classList.add("border-gray-200")
                })
                e.currentTarget.classList.remove("border-gray-200")
                e.currentTarget.classList.add("border-blue-500", "bg-blue-50")
              }}
            >
              {emoji}
            </button>
          ))}
        </div>
        {state.errors?.icon && <p className="text-sm text-red-600">{state.errors.icon[0]}</p>}
      </div>

      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">Màu sắc</label>
        <input type="hidden" name="color" id="color-input" defaultValue={defaultValues?.color ?? COLOR_OPTIONS[0]} />
        <div className="flex flex-wrap gap-2">
          {COLOR_OPTIONS.map((color) => (
            <button
              key={color}
              type="button"
              className="w-8 h-8 rounded-full border-2 border-gray-200 hover:scale-110 transition-transform"
              style={{ backgroundColor: color }}
              onClick={(e) => {
                const input = document.getElementById("color-input") as HTMLInputElement
                input.value = color
                e.currentTarget.parentElement?.querySelectorAll("button").forEach((b) => {
                  b.classList.remove("ring-2", "ring-offset-2", "ring-blue-500")
                })
                e.currentTarget.classList.add("ring-2", "ring-offset-2", "ring-blue-500")
              }}
            />
          ))}
        </div>
        {state.errors?.color && <p className="text-sm text-red-600">{state.errors.color[0]}</p>}
      </div>

      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Đang lưu..." : defaultValues ? "Cập nhật" : "Tạo danh mục"}
      </Button>
    </form>
  )
}
