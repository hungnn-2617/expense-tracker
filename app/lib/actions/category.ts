"use server"

import { prisma } from "@/app/lib/db"
import { categorySchema } from "@/app/lib/validations/category"
import { revalidatePath } from "next/cache"
import type { ActionState } from "@/app/lib/types"

export async function createCategory(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const raw = {
    name: formData.get("name"),
    type: formData.get("type"),
    icon: formData.get("icon"),
    color: formData.get("color"),
  }

  const result = categorySchema.safeParse(raw)
  if (!result.success) {
    const errors: Record<string, string[]> = {}
    for (const issue of result.error.issues) {
      const key = String(issue.path[0] ?? "form")
      if (!errors[key]) errors[key] = []
      errors[key].push(issue.message)
    }
    return { success: false, errors }
  }

  const existing = await prisma.category.findUnique({
    where: { name_type: { name: result.data.name, type: result.data.type } },
  })
  if (existing) {
    return { success: false, errors: { name: ["Danh mục này đã tồn tại"] } }
  }

  await prisma.category.create({
    data: {
      name: result.data.name,
      type: result.data.type,
      icon: result.data.icon,
      color: result.data.color,
      isDefault: false,
    },
  })

  revalidatePath("/categories")
  revalidatePath("/transactions")
  return { success: true }
}

export async function updateCategory(
  id: string,
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const category = await prisma.category.findUnique({ where: { id } })
  if (!category) {
    return { success: false, error: "Danh mục không tồn tại" }
  }
  if (category.isDefault) {
    return { success: false, error: "Không thể sửa danh mục mặc định" }
  }

  const raw = {
    name: formData.get("name"),
    type: formData.get("type"),
    icon: formData.get("icon"),
    color: formData.get("color"),
  }

  const result = categorySchema.safeParse(raw)
  if (!result.success) {
    const errors: Record<string, string[]> = {}
    for (const issue of result.error.issues) {
      const key = String(issue.path[0] ?? "form")
      if (!errors[key]) errors[key] = []
      errors[key].push(issue.message)
    }
    return { success: false, errors }
  }

  await prisma.category.update({
    where: { id },
    data: {
      name: result.data.name,
      type: result.data.type,
      icon: result.data.icon,
      color: result.data.color,
    },
  })

  revalidatePath("/categories")
  revalidatePath("/transactions")
  return { success: true }
}

export async function deleteCategory(id: string): Promise<ActionState> {
  const category = await prisma.category.findUnique({ where: { id } })
  if (!category) {
    return { success: false, error: "Danh mục không tồn tại" }
  }
  if (category.isDefault) {
    return { success: false, error: "Không thể xóa danh mục mặc định" }
  }

  await prisma.category.delete({ where: { id } })

  revalidatePath("/categories")
  revalidatePath("/transactions")
  return { success: true }
}
