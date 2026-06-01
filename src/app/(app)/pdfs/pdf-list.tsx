"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  IconSearch, IconTrash, IconDownload, IconEdit, IconFileDescription,
  IconTable, IconLayoutGrid, IconUpload, IconCalendar, IconWeight,
} from "@tabler/icons-react"
import { Select, type SelectOption } from "@/components/ui/select"
import { Modal } from "@/components/modal"
import { EditPdfForm } from "@/components/edit-pdf-form"

import { usePersistedState } from "@/hooks/use-persisted-state"

type ViewMode = "table" | "card"

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
  categories: { id: string; name: string; }[]
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
  const [view, setView] = usePersistedState<ViewMode>("view-pdfs", "table")
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
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">PDFs</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {filtered.length} of {pdfs.length} document{pdfs.length === 1 ? "" : "s"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-lg border border-border p-0.5 bg-muted/30">
            <button
              onClick={() => setView("table")}
              className={`rounded-md p-1.5 text-sm transition-colors ${view === "table" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
              title="Table view"
            >
              <IconTable className="h-4 w-4" />
            </button>
            <button
              onClick={() => setView("card")}
              className={`rounded-md p-1.5 text-sm transition-colors ${view === "card" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
              title="Card view"
            >
              <IconLayoutGrid className="h-4 w-4" />
            </button>
          </div>
          <Link
            href="/pdfs/upload"
            className="rounded-lg bg-primary text-primary-foreground px-3 py-2 text-sm font-medium hover:brightness-110 transition-all flex items-center gap-1.5"
          >
            <IconUpload className="h-4 w-4" /> Upload
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            placeholder="Search by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-border pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
        </div>
        <Select
          options={[
            { value: "", label: "All Categories" },
            ...categories.map((c) => ({ value: c.id, label: c.name })),
          ]}
          value={category}
          onChange={setCategory}
          placeholder="All Categories"
          className="min-w-[130px]"
        />
        <Select
          options={[
            { value: "", label: "All Years" },
            ...years.map((y) => ({ value: String(y), label: String(y) })),
          ]}
          value={year}
          onChange={setYear}
          placeholder="All Years"
          className="min-w-[110px]"
        />
        <Select
          options={[
            { value: "", label: "All Months" },
            ...months.map((m, i) => ({ value: String(i + 1), label: m })),
          ]}
          value={month}
          onChange={setMonth}
          placeholder="All Months"
          className="min-w-[120px]"
        />
      </div>

      {/* Empty state */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 space-y-3 border border-dashed border-border rounded-xl">
          <IconFileDescription className="h-10 w-10 mx-auto text-muted-foreground" />
          <div>
            <p className="text-sm font-medium">No PDFs found</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {pdfs.length === 0
                ? "The archive is empty. Upload the first document."
                : "Try adjusting your search or filter criteria."}
            </p>
          </div>
          {pdfs.length === 0 && (
            <Link
              href="/pdfs/upload"
              className="inline-flex items-center gap-1 text-xs text-primary hover:text-primary/80 font-medium transition-colors"
            >
              Upload a PDF
            </Link>
          )}
        </div>
      ) : (
        <>
          {/* Table view */}
          {view === "table" && (
            <div className="overflow-x-auto">
              <div className="border border-border rounded-xl min-w-[640px]">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground w-10">#</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Title</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground w-36">Category</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground w-28">Date</th>
                    <th className="text-right px-4 py-3 text-xs font-medium text-muted-foreground w-20">Size</th>
                    <th className="text-right px-4 py-3 text-xs font-medium text-muted-foreground w-28">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filtered.map((pdf, i) => (
                    <tr
                      key={pdf.id}
                      onClick={() => router.push(`/pdfs/${pdf.id}`)}
                      className="hover:bg-muted/20 transition-colors cursor-pointer"
                    >
                      <td className="px-4 py-3 text-xs text-muted-foreground">{i + 1}</td>
                      <td className="px-4 py-3">
                        <p className="text-sm font-medium truncate max-w-[300px]">{pdf.title}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2 py-0.5 text-xs font-medium">
                          {pdf.category?.name}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <IconCalendar className="h-3 w-3" />
                          {months[pdf.month - 1]} {pdf.year}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground text-right tabular-nums">
                        {pdf.fileSize ? `${(pdf.fileSize / 1024).toFixed(0)} KB` : "—"}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                          <a
                            href={`/api/pdfs/${pdf.id}/download`}
                            className="rounded-md p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors"
                            title="Download"
                          >
                            <IconDownload className="h-4 w-4" />
                          </a>
                          {canEdit && (
                            <button
                              onClick={() => setEditPdf(pdf)}
                              className="rounded-md p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors"
                              title="Edit"
                            >
                              <IconEdit className="h-4 w-4" />
                            </button>
                          )}
                          {canDelete && (
                            <button
                              onClick={() => setDeleteTarget(pdf)}
                              className="rounded-md p-1.5 text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
                              title="Delete"
                            >
                              <IconTrash className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
            </div>
            </div>
          )}

          {/* Card view */}
          {view === "card" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filtered.map((pdf) => (
                <div
                  key={pdf.id}
                  onClick={() => router.push(`/pdfs/${pdf.id}`)}
                  className="group border border-border rounded-xl p-4 hover:shadow-sm transition-all space-y-3 cursor-pointer"
                >
                  <div className="flex items-start justify-between">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <IconFileDescription className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                      <a
                        href={`/api/pdfs/${pdf.id}/download`}
                        className="rounded-md p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors"
                        title="Download"
                      >
                        <IconDownload className="h-4 w-4" />
                      </a>
                      {canEdit && (
                        <button
                          onClick={() => setEditPdf(pdf)}
                          className="rounded-md p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors"
                          title="Edit"
                        >
                          <IconEdit className="h-4 w-4" />
                        </button>
                      )}
                      {canDelete && (
                        <button
                          onClick={() => setDeleteTarget(pdf)}
                          className="rounded-md p-1.5 text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
                          title="Delete"
                        >
                          <IconTrash className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-sm font-medium leading-snug line-clamp-2">{pdf.title}</p>
                    <div className="flex flex-wrap gap-1.5">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium">
                        {pdf.category?.imagePath && (
                          <img src={`/api/categories/${pdf.categoryId}/image`} alt="" className="w-3 h-3 rounded object-cover" />
                        )}
                        {pdf.category?.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <IconCalendar className="h-3 w-3" />
                        {months[pdf.month - 1]} {pdf.year}
                      </span>
                      {pdf.fileSize && (
                        <span className="flex items-center gap-1">
                          <IconWeight className="h-3 w-3" />
                          {(pdf.fileSize / 1024).toFixed(0)} KB
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
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
          <button onClick={() => setDeleteTarget(null)} className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-muted transition-colors">Cancel</button>
          <button onClick={handleDelete} disabled={deleting} className="rounded-lg bg-red-600 text-white px-4 py-2 text-sm font-medium disabled:opacity-50 hover:brightness-110 transition-all">
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </Modal>
    </div>
  )
}
