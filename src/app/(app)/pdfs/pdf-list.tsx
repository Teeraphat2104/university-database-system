"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { IconSearch, IconTrash, IconDownload, IconEdit, IconFileDescription } from "@tabler/icons-react"
import { Modal } from "@/components/modal"

function EditPdfForm({
  pdf,
  categories,
  months,
  onSuccess,
}: {
  pdf: any
  categories: { id: string; name: string }[]
  months: string[]
  onSuccess: () => void
}) {
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 30 }, (_, i) => currentYear - i)

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSaving(true)
    setMessage(null)
    const data = new FormData(e.currentTarget)
    const res = await fetch(`/api/pdfs/${pdf.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(data)),
    })
    const json = await res.json()
    setSaving(false)
    if (!res.ok) {
      setMessage(json.error || "Failed to update")
    } else {
      onSuccess()
    }
  }

  return (
    <form onSubmit={handleSave} className="space-y-4">
      <div className="space-y-1.5">
        <label htmlFor="title" className="text-sm font-medium">Title</label>
        <input id="title" name="title" defaultValue={pdf.title} required className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
      </div>
      <div className="space-y-1.5">
        <label htmlFor="category" className="text-sm font-medium">Category</label>
        <select id="category" name="category" defaultValue={pdf.categoryId} required className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
          {categories.map((c) => (<option key={c.id} value={c.id}>{c.name}</option>))}
        </select>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label htmlFor="year" className="text-sm font-medium">Year</label>
          <select id="year" name="year" defaultValue={pdf.year} required className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
            {years.map((y) => (<option key={y} value={y}>{y}</option>))}
          </select>
        </div>
        <div className="space-y-1.5">
          <label htmlFor="month" className="text-sm font-medium">Month</label>
          <select id="month" name="month" defaultValue={pdf.month} required className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
            {months.map((m, i) => (<option key={i + 1} value={i + 1}>{m}</option>))}
          </select>
        </div>
      </div>
      <div className="space-y-1.5">
        <label htmlFor="description" className="text-sm font-medium">Description</label>
        <textarea id="description" name="description" rows={3} defaultValue={pdf.description ?? ""} className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
      </div>
      {message && (
        <div className="rounded-lg bg-red-50 dark:bg-red-950 px-3 py-2 text-sm text-red-600 dark:text-red-400">{message}</div>
      )}
      <div className="flex gap-2 justify-end">
        <button type="submit" disabled={saving} className="rounded-lg bg-primary text-primary-foreground px-4 py-2 text-sm font-medium disabled:opacity-50 hover:brightness-110 transition-all">
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  )
}

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
  const [editPdf, setEditPdf] = useState<any | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<any | null>(null)
  const [deleting, setDeleting] = useState(false)

  const filtered = pdfs.filter((p) => {
    if (search && !p.title.toLowerCase().includes(search.toLowerCase())) return false
    if (category && p.categoryId !== category) return false
    if (year && p.year !== Number(year)) return false
    if (month && p.month !== Number(month)) return false
    return true
  })

  async function handleDelete() {
    if (!deleteTarget) return
    setDeleting(true)
    await fetch(`/api/pdfs/${deleteTarget.id}`, { method: "DELETE" })
    setDeleting(false)
    setDeleteTarget(null)
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
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{pdf.title}</p>
                <p className="text-xs text-muted-foreground">
                  {pdf.category?.name} &middot; {months[pdf.month - 1]} {pdf.year}
                  {pdf.fileSize ? ` &middot; ${(pdf.fileSize / 1024).toFixed(0)} KB` : ""}
                </p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <a
                  href={`/api/pdfs/${pdf.id}/download`}
                  className="rounded-md p-2 text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors"
                  title="Download"
                >
                  <IconDownload className="h-4 w-4" />
                </a>
                {canEdit && (
                  <button
                    onClick={() => setEditPdf(pdf)}
                    className="rounded-md p-2 text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors"
                    title="Edit"
                  >
                    <IconEdit className="h-4 w-4" />
                  </button>
                )}
                {canDelete && (
                  <button
                    onClick={() => setDeleteTarget(pdf)}
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

      <Modal open={!!editPdf} onClose={() => setEditPdf(null)} title="Edit PDF">
        {editPdf && (
          <EditPdfForm
            pdf={editPdf}
            categories={categories}
            months={months}
            onSuccess={() => { setEditPdf(null); router.refresh() }}
          />
        )}
      </Modal>

      <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Confirm Delete">
        <p className="text-sm text-muted-foreground mb-4">
          Are you sure you want to delete <strong>{deleteTarget?.title}</strong>? This cannot be undone.
        </p>
        <div className="flex gap-2 justify-end">
          <button
            onClick={() => setDeleteTarget(null)}
            className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-muted transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="rounded-lg bg-red-600 text-white px-4 py-2 text-sm font-medium disabled:opacity-50 hover:brightness-110 transition-all"
          >
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </Modal>
    </div>
  )
}
