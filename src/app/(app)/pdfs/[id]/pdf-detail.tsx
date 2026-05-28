"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { IconArrowLeft, IconDownload, IconEdit, IconTrash, IconFileDescription, IconCalendar, IconFolder, IconUser, IconWeight } from "@tabler/icons-react"
import { Modal } from "@/components/modal"
import { EditPdfForm } from "@/components/edit-pdf-form"

export function PdfDetail({
  pdf,
  categories,
  months,
  years,
  canEdit,
  canDelete,
}: {
  pdf: {
    id: string
    title: string
    description: string | null
    year: number
    month: number
    categoryId: string
    fileSize: number
    originalName: string
    createdAt: Date
    category: { name: string }
    uploadedBy: { name: string }
  }
  categories: { id: string; name: string }[]
  months: string[]
  years: number[]
  canEdit: boolean
  canDelete: boolean
}) {
  const router = useRouter()
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)

  async function handleDelete() {
    setDeleting(true)
    await fetch(`/api/pdfs/${pdf.id}`, { method: "DELETE" })
    setDeleting(false)
    router.push("/pdfs")
    router.refresh()
  }

  return (
    <div className="max-w-3xl space-y-6">
      <Link
        href="/pdfs"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
      >
        <IconArrowLeft className="h-4 w-4" />
        Back to PDFs
      </Link>

      <div className="border border-border rounded-xl p-6 space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-xl font-semibold tracking-tight">{pdf.title}</h1>
            <p className="text-sm text-muted-foreground">{pdf.originalName}</p>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <a
              href={`/api/pdfs/${pdf.id}/download`}
              className="rounded-lg p-2.5 text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors"
              title="Download"
            >
              <IconDownload className="h-5 w-5" />
            </a>
            {canEdit && (
              <button
                onClick={() => setEditOpen(true)}
                className="rounded-lg p-2.5 text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors"
                title="Edit"
              >
                <IconEdit className="h-5 w-5" />
              </button>
            )}
            {canDelete && (
              <button
                onClick={() => setDeleteOpen(true)}
                className="rounded-lg p-2.5 text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
                title="Delete"
              >
                <IconTrash className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <IconFolder className="h-3 w-3" /> Category
            </p>
            <p className="text-sm font-medium">{pdf.category.name}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <IconCalendar className="h-3 w-3" /> Date
            </p>
            <p className="text-sm font-medium">{months[pdf.month - 1]} {pdf.year}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <IconWeight className="h-3 w-3" /> Size
            </p>
            <p className="text-sm font-medium">
              {pdf.fileSize ? `${(pdf.fileSize / 1024).toFixed(0)} KB` : "—"}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <IconUser className="h-3 w-3" /> Uploaded by
            </p>
            <p className="text-sm font-medium">{pdf.uploadedBy.name}</p>
          </div>
        </div>

        {pdf.description && (
          <div className="space-y-1.5">
            <p className="text-xs text-muted-foreground font-medium">Description</p>
            <p className="text-sm">{pdf.description}</p>
          </div>
        )}
      </div>

      <Modal open={editOpen} onClose={() => setEditOpen(false)} title="Edit PDF">
        <EditPdfForm
          pdf={pdf}
          categories={categories}
          months={months}
          onSuccess={() => { setEditOpen(false); router.refresh() }}
        />
      </Modal>

      <Modal open={deleteOpen} onClose={() => setDeleteOpen(false)} title="Confirm Delete">
        <p className="text-sm text-muted-foreground mb-4">
          Are you sure you want to delete <strong>{pdf.title}</strong>? This cannot be undone.
        </p>
        <div className="flex gap-2 justify-end">
          <button
            onClick={() => setDeleteOpen(false)}
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
