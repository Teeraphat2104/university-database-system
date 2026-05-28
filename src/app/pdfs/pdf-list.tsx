"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { IconSearch, IconTrash, IconDownload, IconEdit, IconFileDescription } from "@tabler/icons-react"

export function PdfList({
  pdfs,
  categories,
  years,
  months,
  canEdit,
  canDelete,
  initialQ = "",
  initialCategory = "",
  initialYear = "",
  initialMonth = "",
}: {
  pdfs: any[]
  categories: { id: string; name: string }[]
  years: number[]
  months: string[]
  canEdit: boolean
  canDelete: boolean
  initialQ?: string
  initialCategory?: string
  initialYear?: string
  initialMonth?: string
}) {
  const router = useRouter()
  const [search, setSearch] = useState(initialQ)
  const [category, setCategory] = useState(initialCategory)
  const [year, setYear] = useState(initialYear)
  const [month, setMonth] = useState(initialMonth)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const filtered = pdfs.filter((p) => {
    if (search && !p.title.toLowerCase().includes(search.toLowerCase())) return false
    if (category && p.categoryId !== category) return false
    if (year && p.year !== Number(year)) return false
    if (month && p.month !== Number(month)) return false
    return true
  })

  async function handleDelete(id: string) {
    if (!confirm("Delete this PDF?")) return
    setDeletingId(id)
    await fetch(`/api/pdfs/${id}`, { method: "DELETE" })
    setDeletingId(null)
    router.refresh()
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border pl-9 pr-3 py-2 text-sm"
          />
        </div>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded-lg border px-3 py-2 text-sm"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <select
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="rounded-lg border px-3 py-2 text-sm"
        >
          <option value="">All Years</option>
          {years.map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
        <select
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="rounded-lg border px-3 py-2 text-sm"
        >
          <option value="">All Months</option>
          {months.map((m, i) => (
            <option key={i + 1} value={i + 1}>{m}</option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12 space-y-2">
          <IconFileDescription className="h-8 w-8 mx-auto text-muted-foreground" />
          <p className="text-sm text-muted-foreground">No PDFs found.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((pdf) => (
            <div
              key={pdf.id}
              className="border rounded-lg p-4 flex items-center justify-between gap-4 hover:shadow-sm transition-shadow"
            >
              <Link
                href={`/pdfs/${pdf.id}`}
                className="flex-1 min-w-0"
              >
                <p className="text-sm font-medium truncate">{pdf.title}</p>
                <p className="text-xs text-muted-foreground">
                  {pdf.category?.name} &middot; {months[pdf.month - 1]} {pdf.year}
                  {pdf.fileSize ? ` &middot; ${(pdf.fileSize / 1024).toFixed(0)} KB` : ""}
                </p>
              </Link>
              <div className="flex items-center gap-1 shrink-0">
                <a
                  href={`/api/pdfs/${pdf.id}/download`}
                  className="rounded-md p-2 text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors"
                  title="Download"
                >
                  <IconDownload className="h-4 w-4" />
                </a>
                {canEdit && (
                  <Link
                    href={`/pdfs/${pdf.id}/edit`}
                    className="rounded-md p-2 text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors"
                    title="Edit"
                  >
                    <IconEdit className="h-4 w-4" />
                  </Link>
                )}
                {canDelete && (
                  <button
                    onClick={() => handleDelete(pdf.id)}
                    disabled={deletingId === pdf.id}
                    className="rounded-md p-2 text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
                    title="Delete"
                  >
                    <IconTrash className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
