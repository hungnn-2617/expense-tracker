"use server"

import { prisma } from "@/app/lib/db"
import { transactionSchema } from "@/app/lib/validations/transaction"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import type { ActionState } from "@/app/lib/types"

export async function createTransaction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const raw = {
    type: formData.get("type"),
    amount: formData.get("amount"),
    categoryId: formData.get("categoryId"),
    date: formData.get("date"),
    description: formData.get("description") || undefined,
  }

  const result = transactionSchema.safeParse(raw)
  if (!result.success) {
    const errors: Record<string, string[]> = {}
    for (const issue of result.error.issues) {
      const key = String(issue.path[0] ?? "form")
      if (!errors[key]) errors[key] = []
      errors[key].push(issue.message)
    }
    return { success: false, errors }
  }

  await prisma.transaction.create({
    data: {
      type: result.data.type,
      amount: result.data.amount,
      categoryId: result.data.categoryId,
      date: result.data.date,
      description: result.data.description ?? null,
    },
  })

  revalidatePath("/transactions")
  revalidatePath("/")
  redirect("/transactions")
}

export async function updateTransaction(
  id: string,
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const raw = {
    type: formData.get("type"),
    amount: formData.get("amount"),
    categoryId: formData.get("categoryId"),
    date: formData.get("date"),
    description: formData.get("description") || undefined,
  }

  const result = transactionSchema.safeParse(raw)
  if (!result.success) {
    const errors: Record<string, string[]> = {}
    for (const issue of result.error.issues) {
      const key = String(issue.path[0] ?? "form")
      if (!errors[key]) errors[key] = []
      errors[key].push(issue.message)
    }
    return { success: false, errors }
  }

  const existing = await prisma.transaction.findUnique({ where: { id } })
  if (!existing) {
    return { success: false, error: "Giao dịch không tồn tại" }
  }

  await prisma.transaction.update({
    where: { id },
    data: {
      type: result.data.type,
      amount: result.data.amount,
      categoryId: result.data.categoryId,
      date: result.data.date,
      description: result.data.description ?? null,
    },
  })

  revalidatePath("/transactions")
  revalidatePath("/")
  redirect("/transactions")
}

export async function deleteTransaction(id: string): Promise<ActionState> {
  const existing = await prisma.transaction.findUnique({ where: { id } })
  if (!existing) {
    return { success: false, error: "Giao dịch không tồn tại" }
  }

  await prisma.transaction.delete({ where: { id } })

  revalidatePath("/transactions")
  revalidatePath("/")
  return { success: true }
}
