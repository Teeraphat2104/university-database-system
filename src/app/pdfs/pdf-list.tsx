"use client"

import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { FileText } from "lucide-react"

type PdfWithRelations = {
  id: string
  title: string
  description: string | null
  year: number
  month: number
  originalName: string
  fileSize: number
  category: { id: string; name: string }
  uploadedBy: { name: string }
  createdAt: Date
}

type Category = { id: string; name: string }

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
]

export function PdfList({
  pdfs,
  categories,
  currentCategory,
  currentYear,
  currentMonth,
  currentQ,
}: {
  pdfs: PdfWithRelations[]
  categories: Category[]
  currentCategory: string
  currentYear: string
  currentMonth: string
  currentQ: string
}) {
  const router = useRouter()
  const searchParams = useSearchParams()

  function setParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (value) params.set(key, value)
    else params.delete(key)
    router.push(`/pdfs?${params.toString()}`)
  }

  const years = Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i)

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <input
          defaultValue={currentQ}
          placeholder="Search..."
          onKeyDown={(e) => {
            if (e.key === "Enter") setParam("q", (e.target as HTMLInputElement).value)
          }}
          className="rounded-lg border px-3 py-2 text-sm flex-1 min-w-[200px]"
        />
        <select
          value={currentCategory}
          onChange={(e) => setParam("category", e.target.value)}
          className="rounded-lg border px-3 py-2 text-sm"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
        <select
          value={currentYear}
          onChange={(e) => setParam("year", e.target.value)}
          className="rounded-lg border px-3 py-2 text-sm"
        >
          <option value="">All Years</option>
          {years.map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
        <select
          value={currentMonth}
          onChange={(e) => setParam("month", e.target.value)}
          className="rounded-lg border px-3 py-2 text-sm"
        >
          <option value="">All Months</option>
          {months.map((m, i) => (
            <option key={i + 1} value={i + 1}>{m}</option>
          ))}
        </select>
      </div>

      <div className="border rounded-lg divide-y">
        {pdfs.map((pdf) => (
          <div key={pdf.id} className="flex items-center gap-4 px-4 py-3">
            <FileText className="h-5 w-5 text-muted-foreground shrink-0" />
            <div className="flex-1 min-w-0">
              <Link
                href={`/api/pdfs/${pdf.id}/download`}
                className="text-sm font-medium hover:underline"
              >
                {pdf.title}
              </Link>
              <p className="text-xs text-muted-foreground">
                {pdf.category.name} &middot; {months[pdf.month - 1]} {pdf.year}
                {pdf.description && ` \u2014 ${pdf.description}`}
              </p>
            </div>
            <div className="text-xs text-muted-foreground text-right">
              <p>{pdf.uploadedBy.name}</p>
              <p>{(pdf.fileSize / 1024 / 1024).toFixed(1)} MB</p>
            </div>
            <Link
              href={`/pdfs/${pdf.id}/edit`}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Edit
            </Link>
          </div>
        ))}
        {pdfs.length === 0 && (
          <p className="px-4 py-8 text-sm text-muted-foreground text-center">
            No PDFs found
          </p>
        )}
      </div>
    </div>
  )
}
