"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Modal } from "@/components/modal"
import { IconFolderPlus, IconTrash } from "@tabler/icons-react"
import { createCategoryAction, deleteCategoryAction } from "@/lib/actions/category"
import { useActionState } from "react"

function CreateCategoryForm({ onSuccess }: { onSuccess: () => void }) {
  const [state, action, pending] = useActionState(
    async (_prev: { error: string | null } | null, formData: FormData) => {
      const res = await createCategoryAction(formData)
      if (!res.error) onSuccess()
      return res
    },
    null,
  )

  return (
    <form action={action} className="space-y-4">
      <div className="space-y-1.5">
        <label htmlFor="name" className="text-sm font-medium">Category Name</label>
        <input id="name" name="name" required className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
      </div>
      {state?.error && (
        <div className="rounded-lg bg-red-50 dark:bg-red-950 px-3 py-2 text-sm text-red-600 dark:text-red-400">{state.error}</div>
      )}
      <div className="flex gap-2 justify-end">
        <button type="submit" disabled={pending} className="rounded-lg bg-primary text-primary-foreground px-4 py-2 text-sm font-medium disabled:opacity-50 hover:brightness-110 transition-all">
          {pending ? "Creating..." : "Create Category"}
        </button>
      </div>
    </form>
  )
}

export function CategoriesClient({
  categories,
}: {
  categories: { id: string; name: string; pdfCount: number }[]
}) {
  const router = useRouter()
  const [createOpen, setCreateOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null)
  const [deletePending, setDeletePending] = useState(false)

  async function handleDelete() {
    if (!deleteTarget) return
    setDeletePending(true)
    const res = await deleteCategoryAction(deleteTarget.id)
    setDeletePending(false)
    if (res?.error) return
    setDeleteTarget(null)
    router.refresh()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Categories</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage document categories</p>
        </div>
        <button
          onClick={() => setCreateOpen(true)}
          className="rounded-lg bg-primary text-primary-foreground px-3 py-2 text-sm font-medium hover:brightness-110 transition-all flex items-center gap-1.5"
        >
          <IconFolderPlus className="h-4 w-4" /> Add Category
        </button>
      </div>

      <div className="border rounded-lg divide-y">
        {categories.map((c) => (
          <div key={c.id} className="flex items-center justify-between px-4 py-3">
            <div className="space-y-0.5">
              <p className="text-sm font-medium">{c.name}</p>
              <p className="text-xs text-muted-foreground">{c.pdfCount} PDF(s)</p>
            </div>
            {c.pdfCount === 0 && (
              <button
                onClick={() => setDeleteTarget({ id: c.id, name: c.name })}
                className="text-xs text-red-500 hover:text-red-700 transition-colors flex items-center gap-1"
              >
                <IconTrash className="h-3 w-3" /> Delete
              </button>
            )}
          </div>
        ))}
        {categories.length === 0 && (
          <div className="px-4 py-12 text-center space-y-2">
            <IconFolderPlus className="h-8 w-8 mx-auto text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">No categories yet</p>
              <p className="text-xs text-muted-foreground mt-0.5">Create a category to organize PDFs.</p>
            </div>
          </div>
        )}
      </div>

      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Add Category">
        <CreateCategoryForm onSuccess={() => { setCreateOpen(false); router.refresh() }} />
      </Modal>

      <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Confirm Delete">
        <p className="text-sm text-muted-foreground mb-4">
          Are you sure you want to delete <strong>{deleteTarget?.name}</strong>? This cannot be undone.
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
            disabled={deletePending}
            className="rounded-lg bg-red-600 text-white px-4 py-2 text-sm font-medium disabled:opacity-50 hover:brightness-110 transition-all"
          >
            {deletePending ? "Deleting..." : "Delete"}
          </button>
        </div>
      </Modal>
    </div>
  )
}
