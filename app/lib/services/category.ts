import { prisma } from "@/app/lib/db"
import { TransactionType } from "@prisma/client"

export async function getCategories(type?: TransactionType) {
  return prisma.category.findMany({
    where: type ? { type } : undefined,
    orderBy: { name: "asc" },
  })
}

export async function getCategoryById(id: string) {
  return prisma.category.findUnique({ where: { id } })
}
