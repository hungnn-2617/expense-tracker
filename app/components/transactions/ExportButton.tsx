"use client"

import { useSearchParams } from "next/navigation"
import { Button } from "@/app/components/ui/Button"
import { useState } from "react"

export function ExportButton() {
  const searchParams = useSearchParams()
  const [exporting, setExporting] = useState(false)

  async function handleExport() {
    setExporting(true)

    const params = new URLSearchParams()
    const dateFrom = searchParams.get("dateFrom")
    const dateTo = searchParams.get("dateTo")
    const type = searchParams.get("type")
    const categoryId = searchParams.get("categoryId")
    const search = searchParams.get("search")

    if (dateFrom) params.set("dateFrom", dateFrom)
    if (dateTo) params.set("dateTo", dateTo)
    if (type) params.set("type", type)
    if (categoryId) params.set("categoryId", categoryId)
    if (search) params.set("search", search)

    const url = `/api/transactions/export?${params.toString()}`
    const response = await fetch(url)

    if (response.status === 204) {
      alert("Không có giao dịch nào để xuất.")
      setExporting(false)
      return
    }

    if (!response.ok) {
      alert("Đã xảy ra lỗi khi xuất CSV.")
      setExporting(false)
      return
    }

    const blob = await response.blob()
    const downloadUrl = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = downloadUrl
    a.download = response.headers.get("Content-Disposition")?.split("filename=")[1]?.replace(/"/g, "") ?? "export.csv"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(downloadUrl)

    setExporting(false)
  }

  return (
    <Button variant="secondary" onClick={handleExport} disabled={exporting}>
      {exporting ? "Đang xuất..." : "📥 Xuất CSV"}
    </Button>
  )
}
