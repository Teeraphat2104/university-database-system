"use client"

import { useState, useEffect, useCallback } from "react"
import { Modal } from "@/components/modal"
import { EditPdfForm } from "@/components/edit-pdf-form"
import { CategoryImage } from "@/components/category-image"
import { MONTHS } from "@/lib/constants"
import {
  IconDownload, IconEdit, IconTrash,
  IconFolder, IconCalendar, IconWeight, IconUser,
} from "@tabler/icons-react"
import { Skeleton } from "@/components/ui/skeleton"

export function PdfDetailModal({
  pdfId,
  onClose,
  onSuccess,
}: {
  pdfId: string | null
  onClose: () => void
  onSuccess?: () => void
}) {
  const [loading, setLoading] = useState(false)
  const [pdf, setPdf] = useState<any>(null)
  const [categories, setCategories] = useState<any[]>([])
  const [canEdit, setCanEdit] = useState(false)
  const [canDelete, setCanDelete] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [mode, setMode] = useState<"view" | "edit" | "delete">("view")
  const [deleting, setDeleting] = useState(false)

  const fetchPdf = useCallback(async (id: string) => {
    setLoading(true)
    setError(null)
    setMode("view")
    setPdf(null)
    try {
      const res = await fetch(`/api/pdf/${id}/detail`, { method: "POST" })
      if (!res.ok) {
        setError("Failed to load PDF")
        return
      }
      const data = await res.json()
      setPdf(data.pdf)
      setCategories(data.categories)
      setCanEdit(data.canEdit)
      setCanDelete(data.canDelete)
    } catch {
      setError("Failed to load PDF")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (pdfId) fetchPdf(pdfId)
  }, [pdfId, fetchPdf])

  async function handleDelete() {
    if (!pdf) return
    setDeleting(true)
    try {
      await fetch(`/api/pdf/${pdf.id}/delete`, { method: "POST" })
      onSuccess?.()
      onClose()
    } catch {
    } finally {
      setDeleting(false)
    }
  }

  function handleEditSuccess() {
    if (pdfId) fetchPdf(pdfId)
    setMode("view")
    onSuccess?.()
  }

  const modalTitle = mode === "edit" ? "Edit PDF" : mode === "delete" ? "Confirm Delete" : "PDF Details"

  return (
    <Modal open={!!pdfId} onClose={onClose} title={modalTitle} wide>
      {loading && (
        <div className="space-y-4">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Skeleton className="h-12" />
            <Skeleton className="h-12" />
            <Skeleton className="h-12" />
            <Skeleton className="h-12" />
          </div>
          <Skeleton className="h-16" />
        </div>
      )}
      {error && <p className="text-sm text-red-500">{error}</p>}
      {pdf && mode === "view" && !loading && (
        <div className="space-y-6">
          <div className="space-y-1">
            <h2 className="text-lg font-semibold">{pdf.title}</h2>
            <p className="text-sm text-muted-foreground">{pdf.originalName}</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground flex items-center gap-1"><IconFolder className="h-3 w-3" /> Category</p>
              <div className="flex items-center gap-2">
                {pdf.category?.imagePath && (
                  <CategoryImage categoryId={pdf.categoryId} alt="" className="w-5 h-5 rounded object-cover border border-border" />
                )}
                <p className="text-sm font-medium">{pdf.category?.name}</p>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground flex items-center gap-1"><IconCalendar className="h-3 w-3" /> Date</p>
              <p className="text-sm font-medium">{MONTHS[pdf.month - 1]} {pdf.year}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground flex items-center gap-1"><IconWeight className="h-3 w-3" /> Size</p>
              <p className="text-sm font-medium">{pdf.fileSize ? `${(pdf.fileSize / 1024).toFixed(0)} KB` : "—"}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground flex items-center gap-1"><IconUser className="h-3 w-3" /> Uploaded by</p>
              <p className="text-sm font-medium">{pdf.uploadedBy?.name ?? "—"}</p>
            </div>
          </div>
          {pdf.description && (
            <div className="space-y-1.5">
              <p className="text-xs text-muted-foreground font-medium">Description</p>
              <p className="text-sm">{pdf.description}</p>
            </div>
          )}
          <div className="flex gap-2 pt-2 border-t border-border">
            <a
              href={`/api/pdf/${pdf.id}/download`}
              className="rounded-lg border px-3 py-2 text-sm font-medium hover:bg-muted transition-colors flex items-center gap-1.5"
            >
              <IconDownload className="h-4 w-4" /> Download
            </a>
            {canEdit && (
              <button
                onClick={() => setMode("edit")}
                className="rounded-lg border px-3 py-2 text-sm font-medium hover:bg-muted transition-colors flex items-center gap-1.5"
              >
                <IconEdit className="h-4 w-4" /> Edit
              </button>
            )}
            {canDelete && (
              <button
                onClick={() => setMode("delete")}
                className="rounded-lg border px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950 transition-colors flex items-center gap-1.5"
              >
                <IconTrash className="h-4 w-4" /> Delete
              </button>
            )}
          </div>
        </div>
      )}
      {pdf && mode === "edit" && (
        <EditPdfForm pdf={pdf} categories={categories} months={[...MONTHS]} onSuccess={handleEditSuccess} />
      )}
      {mode === "delete" && pdf && (
        <div>
          <p className="text-sm text-muted-foreground mb-4">
            Are you sure you want to delete <strong>{pdf.title}</strong>? This cannot be undone.
          </p>
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => setMode("view")}
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
        </div>
      )}
    </Modal>
  )
}
