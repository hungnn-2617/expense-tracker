import { format } from "date-fns"

export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ")
}

export function generateCsvFilename(): string {
  return `expenses_${format(new Date(), "yyyy-MM-dd")}.csv`
}
