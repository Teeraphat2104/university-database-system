"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useActionState } from "react"
import { Modal } from "@/components/modal"
import {
  IconFolderPlus, IconTrash, IconEdit, IconTable, IconLayoutGrid,
  IconFolder,
} from "@tabler/icons-react"
import { createCategoryAction, deleteCategoryAction, updateCategoryAction } from "@/lib/actions/category"

type ViewMode = "table" | "card"

type CategoryData = {
  id: string
  name: string
  pdfCount: number
  createdAt?: string
}

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

function EditCategoryForm({ category, onSuccess }: { category: CategoryData; onSuccess: () => void }) {
  const [state, action, pending] = useActionState(
    async (_prev: { error: string | null } | null, formData: FormData) => {
      const res = await updateCategoryAction(formData)
      if (!res.error) onSuccess()
      return res
    },
    null,
  )

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="id" value={category.id} />
      <div className="space-y-1.5">
        <label htmlFor="edit-name" className="text-sm font-medium">Category Name</label>
        <input id="edit-name" name="name" defaultValue={category.name} required className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
      </div>
      {state?.error && (
        <div className="rounded-lg bg-red-50 dark:bg-red-950 px-3 py-2 text-sm text-red-600 dark:text-red-400">{state.error}</div>
      )}
      <div className="flex gap-2 justify-end">
        <button type="submit" disabled={pending} className="rounded-lg bg-primary text-primary-foreground px-4 py-2 text-sm font-medium disabled:opacity-50 hover:brightness-110 transition-all">
          {pending ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  )
}

export function CategoriesClient({
  categories,
}: {
  categories: CategoryData[]
}) {
  const router = useRouter()
  const [view, setView] = useState<ViewMode>("table")
  const [createOpen, setCreateOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<CategoryData | null>(null)
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
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Categories</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {categories.length} categor{categories.length === 1 ? "y" : "ies"} &middot;{" "}
            {categories.reduce((s, c) => s + c.pdfCount, 0)} PDFs
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* View toggle */}
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
          <button
            onClick={() => setCreateOpen(true)}
            className="rounded-lg bg-primary text-primary-foreground px-3 py-2 text-sm font-medium hover:brightness-110 transition-all flex items-center gap-1.5"
          >
            <IconFolderPlus className="h-4 w-4" /> Add Category
          </button>
        </div>
      </div>

      {/* Table view */}
      {view === "table" && (
        <div className="border border-border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground w-10">#</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Name</th>
                <th className="text-center px-4 py-3 text-xs font-medium text-muted-foreground w-20">PDFs</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-muted-foreground w-24">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {categories.map((c, i) => (
                <tr key={c.id} className="hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3 text-xs text-muted-foreground">{i + 1}</td>
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium">{c.name}</p>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="inline-flex items-center justify-center text-xs font-medium tabular-nums bg-primary/10 text-primary rounded-full px-2 py-0.5 min-w-[28px]">
                      {c.pdfCount}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => setEditTarget(c)}
                        className="rounded-md p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors"
                        title="Edit"
                      >
                        <IconEdit className="h-4 w-4" />
                      </button>
                      {c.pdfCount === 0 && (
                        <button
                          onClick={() => setDeleteTarget({ id: c.id, name: c.name })}
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
              {categories.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-12 text-center">
                    <IconFolderPlus className="h-8 w-8 mx-auto text-muted-foreground" />
                    <p className="text-sm font-medium mt-2">No categories yet</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Create a category to organize PDFs.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Card view */}
      {view === "card" && (
        <>
          {categories.length === 0 ? (
            <div className="border border-dashed border-border rounded-xl px-4 py-16 text-center space-y-2">
              <IconFolderPlus className="h-8 w-8 mx-auto text-muted-foreground" />
              <p className="text-sm font-medium">No categories yet</p>
              <p className="text-xs text-muted-foreground mt-0.5">Create a category to organize PDFs.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {categories.map((c) => (
                <div
                  key={c.id}
                  className="group border border-border rounded-xl p-4 hover:shadow-sm transition-all space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <IconFolder className="h-5 w-5 text-primary" />
                    </div>
                    {c.pdfCount === 0 && (
                      <button
                        onClick={() => setDeleteTarget({ id: c.id, name: c.name })}
                        className="opacity-0 group-hover:opacity-100 rounded-md p-1 text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950 transition-all"
                        title="Delete"
                      >
                        <IconTrash className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{c.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{c.pdfCount} PDF{c.pdfCount === 1 ? "" : "s"}</p>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setEditTarget(c)}
                      className="flex-1 rounded-md border border-border px-2 py-1.5 text-xs font-medium text-muted-foreground hover:text-primary hover:border-primary/30 transition-colors"
                    >
                      Rename
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Create modal */}
      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Add Category">
        <CreateCategoryForm onSuccess={() => { setCreateOpen(false); router.refresh() }} />
      </Modal>

      {/* Edit modal */}
      <Modal open={!!editTarget} onClose={() => setEditTarget(null)} title="Rename Category">
        {editTarget && (
          <EditCategoryForm category={editTarget} onSuccess={() => { setEditTarget(null); router.refresh() }} />
        )}
      </Modal>

      {/* Delete modal */}
      <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Confirm Delete">
        <p className="text-sm text-muted-foreground mb-4">
          Are you sure you want to delete <strong>{deleteTarget?.name}</strong>? This cannot be undone.
        </p>
        <div className="flex gap-2 justify-end">
          <button onClick={() => setDeleteTarget(null)} className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-muted transition-colors">Cancel</button>
          <button onClick={handleDelete} disabled={deletePending} className="rounded-lg bg-red-600 text-white px-4 py-2 text-sm font-medium disabled:opacity-50 hover:brightness-110 transition-all">
            {deletePending ? "Deleting..." : "Delete"}
          </button>
        </div>
      </Modal>
    </div>
  )
}
