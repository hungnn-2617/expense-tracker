import { format, formatDistanceToNow } from "date-fns"
import { vi } from "date-fns/locale"

const vndFormatter = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
  maximumFractionDigits: 0,
})

export function formatVND(amount: number): string {
  return vndFormatter.format(amount)
}

export function formatDate(date: Date): string {
  return format(date, "dd/MM/yyyy", { locale: vi })
}

export function formatDateISO(date: Date): string {
  return format(date, "yyyy-MM-dd")
}

export function formatRelativeDate(date: Date): string {
  return formatDistanceToNow(date, { addSuffix: true, locale: vi })
}

export function formatDateForInput(date: Date): string {
  return format(date, "yyyy-MM-dd")
}
