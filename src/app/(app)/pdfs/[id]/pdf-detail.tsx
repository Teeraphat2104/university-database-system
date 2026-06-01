"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { IconArrowLeft, IconChevronRight, IconDownload, IconEdit, IconTrash, IconCalendar, IconFolder, IconUser, IconWeight } from "@tabler/icons-react"
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
    filePath: string
    fileSize: number
    originalName: string
    createdAt: Date
    category: { name: string; imagePath?: string | null }
    uploadedBy: { name: string }
  }
  categories: { id: string; name: string; imagePath?: string | null }[]
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
    <>
      <div className="flex items-center justify-between pb-3">
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Link href="/pdfs" className="hover:text-primary transition-colors">PDFs</Link>
          <IconChevronRight className="h-3.5 w-3.5" />
          <span className="text-foreground font-medium truncate max-w-[300px]">{pdf.title}</span>
        </div>
        <Link
          href="/pdfs"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          <IconArrowLeft className="h-4 w-4" />
          Back
        </Link>
      </div>
      <div className="flex flex-col lg:flex-row gap-4 min-h-[70vh]">
        {/* Left: PDF preview */}
        <div className="flex-1 flex flex-col border border-border rounded-xl overflow-hidden bg-muted/10">
          <div className="px-4 py-3 border-b border-border bg-background">
            <p className="text-sm font-medium truncate">{pdf.title}</p>
            <p className="text-xs text-muted-foreground truncate">{pdf.originalName}</p>
          </div>
          <iframe
            src={`/api/pdfs/${pdf.id}/download`}
            className="flex-1 w-full min-h-[60vh]"
            title={pdf.title}
          />
        </div>

        {/* Right: details */}
        <div className="w-full lg:w-80 xl:w-96 shrink-0">
          <div className="border border-border rounded-xl p-5 space-y-5 bg-background">
            {/* Actions */}
            <div className="flex items-center gap-2 flex-wrap">
              <a
                href={`/api/pdfs/${pdf.id}/download`}
                className="flex-1 rounded-lg border px-3 py-2 text-sm font-medium hover:bg-muted transition-colors flex items-center justify-center gap-1.5"
              >
                <IconDownload className="h-4 w-4" /> Download
              </a>
              {canEdit && (
                <button
                  onClick={() => setEditOpen(true)}
                  className="flex-1 rounded-lg border px-3 py-2 text-sm font-medium hover:bg-muted transition-colors flex items-center justify-center gap-1.5"
                >
                  <IconEdit className="h-4 w-4" /> Edit
                </button>
              )}
              {canDelete && (
                <button
                  onClick={() => setDeleteOpen(true)}
                  className="rounded-lg border px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
                  title="Delete"
                >
                  <IconTrash className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <IconFolder className="h-4 w-4 text-muted-foreground shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Category</p>
                  <p className="text-sm font-medium">{pdf.category.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <IconCalendar className="h-4 w-4 text-muted-foreground shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Date</p>
                  <p className="text-sm font-medium">{months[pdf.month - 1]} {pdf.year}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <IconWeight className="h-4 w-4 text-muted-foreground shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Size</p>
                  <p className="text-sm font-medium">
                    {pdf.fileSize ? `${(pdf.fileSize / 1024).toFixed(0)} KB` : "—"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <IconUser className="h-4 w-4 text-muted-foreground shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Uploaded by</p>
                  <p className="text-sm font-medium">{pdf.uploadedBy.name}</p>
                </div>
              </div>
            </div>

            {pdf.description && (
              <div className="space-y-1.5 pt-3 border-t border-border">
                <p className="text-xs text-muted-foreground font-medium">Description</p>
                <p className="text-sm">{pdf.description}</p>
              </div>
            )}
          </div>
        </div>
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
    </>
  )
}
