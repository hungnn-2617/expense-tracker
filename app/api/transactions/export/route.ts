import { prisma } from "@/app/lib/db"
import { transactionsToCsv } from "@/app/lib/csv"
import { generateCsvFilename } from "@/app/lib/utils"
import { z } from "zod/v4"
import { NextRequest } from "next/server"

const querySchema = z.object({
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  type: z.enum(["INCOME", "EXPENSE"]).optional(),
  categoryId: z.string().optional(),
  search: z.string().optional(),
})

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl

  const raw = {
    dateFrom: searchParams.get("dateFrom") ?? undefined,
    dateTo: searchParams.get("dateTo") ?? undefined,
    type: searchParams.get("type") ?? undefined,
    categoryId: searchParams.get("categoryId") ?? undefined,
    search: searchParams.get("search") ?? undefined,
  }

  const result = querySchema.safeParse(raw)
  if (!result.success) {
    return new Response("Invalid query parameters", { status: 400 })
  }

  const where: Record<string, unknown> = {}
  const { data } = result

  if (data.type) where.type = data.type
  if (data.categoryId) where.categoryId = data.categoryId
  if (data.dateFrom || data.dateTo) {
    where.date = {
      ...(data.dateFrom ? { gte: new Date(data.dateFrom) } : {}),
      ...(data.dateTo ? { lte: new Date(data.dateTo + "T23:59:59") } : {}),
    }
  }
  if (data.search) {
    where.description = { contains: data.search }
  }

  const transactions = await prisma.transaction.findMany({
    where,
    include: { category: true },
    orderBy: { date: "desc" },
  })

  if (transactions.length === 0) {
    return new Response(null, { status: 204 })
  }

  const csv = transactionsToCsv(transactions)
  const filename = generateCsvFilename()

  return new Response(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  })
}
