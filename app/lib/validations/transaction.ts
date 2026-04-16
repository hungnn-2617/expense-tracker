import { z } from "zod/v4"

export const transactionSchema = z.object({
  type: z.enum(["INCOME", "EXPENSE"]),
  amount: z.coerce.number().int().positive("Số tiền phải lớn hơn 0"),
  categoryId: z.string().min(1, "Vui lòng chọn danh mục"),
  date: z.coerce.date(),
  description: z.string().max(255, "Mô tả tối đa 255 ký tự").optional(),
})

export type TransactionInput = z.infer<typeof transactionSchema>
