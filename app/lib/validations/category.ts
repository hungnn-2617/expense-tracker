import { z } from "zod/v4"

export const categorySchema = z.object({
  name: z.string().min(1, "Tên danh mục không được để trống").max(50, "Tên tối đa 50 ký tự"),
  type: z.enum(["INCOME", "EXPENSE"]),
  icon: z.string().min(1, "Vui lòng chọn icon"),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Mã màu không hợp lệ"),
})

export type CategoryInput = z.infer<typeof categorySchema>
