"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { useActionState } from "react"
import { Modal } from "@/components/modal"
import { CategoryImage } from "@/components/category-image"
import { usePersistedState } from "@/hooks/use-persisted-state"
import {
  IconFolderPlus, IconTrash, IconEdit, IconTable, IconLayoutGrid,
  IconFolder, IconPhoto, IconX,
} from "@tabler/icons-react"
import { createCategoryAction, deleteCategoryAction, updateCategoryAction } from "@/lib/actions/category"

type ViewMode = "table" | "card"

type CategoryData = {
  id: string
  name: string
  pdfCount: number
  createdAt?: string
  imagePath?: string | null
}

function ImagePreview({ src, onRemove }: { src: string; onRemove?: () => void }) {
  return (
    <div className="relative inline-flex">
      <img src={src} alt="" className="w-20 h-20 rounded-lg object-cover border border-border" />
      {onRemove && (
        <button type="button" onClick={onRemove} className="absolute -top-1.5 -right-1.5 rounded-full bg-red-500 text-white p-0.5 shadow-sm">
          <IconX className="h-3 w-3" />
        </button>
      )}
    </div>
  )
}

function ImageInput({ name, currentImage, onRemove }: { name: string; currentImage?: string | null; onRemove?: () => void }) {
  const [preview, setPreview] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      setPreview(URL.createObjectURL(file))
    }
  }

  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium">Category Image <span className="text-muted-foreground font-normal">(optional)</span></label>
      {preview ? (
        <ImagePreview src={preview} onRemove={() => { setPreview(null); if (fileRef.current) fileRef.current.value = "" }} />
      ) : currentImage ? (
        <div className="flex items-center gap-3">
          <CategoryImage categoryId={currentImage} alt="" className="w-20 h-20 rounded-lg object-cover border border-border" />
          <button type="button" onClick={onRemove} className="text-xs text-red-500 hover:text-red-600 underline">Remove</button>
        </div>
      ) : (
        <label className="flex items-center gap-2 rounded-lg border border-dashed border-border px-4 py-3 text-sm text-muted-foreground hover:border-primary/50 hover:text-primary cursor-pointer transition-colors">
          <IconPhoto className="h-4 w-4" />
          Upload image
          <input ref={fileRef} type="file" name={name} accept=".png,.jpg,.jpeg,.webp,.svg" onChange={handleChange} className="hidden" />
        </label>
      )}
    </div>
  )
}

function CreateCategoryForm({ onSuccess }: { onSuccess: () => void }) {
  const [showImageInput, setShowImageInput] = useState(false)
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
      <div className="space-y-1.5">
        <label className="text-sm font-medium">Category Image <span className="text-muted-foreground font-normal">(optional)</span></label>
        {showImageInput ? (
          <div className="flex items-center gap-3">
            <input type="file" name="image" accept=".png,.jpg,.jpeg,.webp,.svg" className="block w-full text-sm text-muted-foreground file:mr-3 file:rounded-lg file:border-0 file:bg-primary/10 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-primary hover:file:bg-primary/20 transition-colors" />
            <button type="button" onClick={() => setShowImageInput(false)} className="text-xs text-muted-foreground hover:text-primary shrink-0">Remove</button>
          </div>
        ) : (
          <button type="button" onClick={() => setShowImageInput(true)} className="flex items-center gap-2 rounded-lg border border-dashed border-border px-4 py-3 text-sm text-muted-foreground hover:border-primary/50 hover:text-primary transition-colors w-full">
            <IconPhoto className="h-4 w-4" />
            Add category image
          </button>
        )}
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

function EditCategoryForm({ category, onSuccess }: { category: CategoryData & { imagePath?: string | null }; onSuccess: () => void }) {
  const [state, action, pending] = useActionState(
    async (_prev: { error: string | null } | null, formData: FormData) => {
      const res = await updateCategoryAction(formData)
      if (!res.error) onSuccess()
      return res
    },
    null,
  )

  const [removeImage, setRemoveImage] = useState(false)

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="id" value={category.id} />
      {removeImage && <input type="hidden" name="removeImage" value="true" />}
      <div className="space-y-1.5">
        <label htmlFor="edit-name" className="text-sm font-medium">Category Name</label>
        <input id="edit-name" name="name" defaultValue={category.name} required className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
      </div>
      <div className="space-y-1.5">
        <label className="text-sm font-medium">Category Image <span className="text-muted-foreground font-normal">(optional)</span></label>
        {removeImage ? (
          <div className="flex items-center gap-3">
            <input type="file" name="image" accept=".png,.jpg,.jpeg,.webp,.svg" className="block w-full text-sm text-muted-foreground file:mr-3 file:rounded-lg file:border-0 file:bg-primary/10 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-primary hover:file:bg-primary/20 transition-colors" />
            <button type="button" onClick={() => setRemoveImage(false)} className="text-xs text-muted-foreground hover:text-primary shrink-0">Cancel</button>
          </div>
        ) : category.imagePath ? (
          <div className="flex items-center gap-3">
            <CategoryImage categoryId={category.id} alt="" className="w-20 h-20 rounded-lg object-cover border border-border" />
            <button type="button" onClick={() => setRemoveImage(true)} className="text-xs text-red-500 hover:text-red-600 underline">Remove</button>
          </div>
        ) : (
          <label className="flex items-center gap-2 rounded-lg border border-dashed border-border px-4 py-3 text-sm text-muted-foreground hover:border-primary/50 hover:text-primary cursor-pointer transition-colors">
            <IconPhoto className="h-4 w-4" />
            Upload image
            <input type="file" name="image" accept=".png,.jpg,.jpeg,.webp,.svg" className="hidden" />
          </label>
        )}
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
  const [view, setView] = usePersistedState<ViewMode>("view-categories", "table")
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
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Categories</h1>
          <p className="text-sm text-muted-foreground">
            {categories.length} categor{categories.length === 1 ? "y" : "ies"} &middot;{" "}
            {categories.reduce((s, c) => s + c.pdfCount, 0)} PDFs
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="flex items-center p-1 rounded-lg bg-muted border border-border">
            <button
              onClick={() => setView("table")}
              className={`p-1.5 rounded-md text-sm transition-all ${view === "table" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
              title="Table view"
            >
              <IconTable className="h-4 w-4" />
            </button>
            <button
              onClick={() => setView("card")}
              className={`p-1.5 rounded-md text-sm transition-all ${view === "card" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
              title="Card view"
            >
              <IconLayoutGrid className="h-4 w-4" />
            </button>
          </div>
          <button
            onClick={() => setCreateOpen(true)}
            className="rounded-lg bg-primary text-primary-foreground px-3 py-2 text-sm font-medium hover:brightness-110 transition-all flex items-center gap-1.5 shadow-sm"
          >
            <IconFolderPlus className="h-4 w-4" /> Add Category
          </button>
        </div>
      </div>

      {/* Table view */}
      {view === "table" && (
        <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-sm">
          <div className="border-border min-w-[500px]">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground w-10">#</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Name</th>
                <th className="text-center px-4 py-3 text-xs font-medium text-muted-foreground w-20">PDFs</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-muted-foreground w-24">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {categories.map((c, i) => (
                <tr key={c.id} className="hover:bg-muted/50 transition-colors group">
                  <td className="px-4 py-3 text-xs text-muted-foreground">{i + 1}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {c.imagePath ? (
                        <CategoryImage categoryId={c.id} alt="" className="w-8 h-8 rounded-md object-cover border border-border shrink-0" />
                      ) : (
                        <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                          <IconFolder className="h-4 w-4 text-primary" />
                        </div>
                      )}
                      <p className="text-sm font-medium group-hover:text-primary transition-colors">{c.name}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="inline-flex items-center justify-center text-xs font-medium tabular-nums text-primary min-w-[28px]">
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
                <tr className="text-center py-12">
                  <td colSpan={4} className="px-4 py-12 space-y-2">
                    <IconFolderPlus className="h-8 w-8 mx-auto text-muted-foreground" />
                    <p className="text-sm font-medium">No categories yet</p>
                    <p className="text-xs text-muted-foreground">Create a category to organize PDFs.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          </div>
        </div>
      )}

      {/* Card view */}
      {view === "card" && (
        <>
          {categories.length === 0 ? (
            <div className="text-center py-16 space-y-2 rounded-xl border border-dashed border-border bg-card/50">
              <IconFolderPlus className="h-8 w-8 mx-auto text-muted-foreground" />
              <p className="text-sm font-medium">No categories yet</p>
              <p className="text-xs text-muted-foreground">Create a category to organize PDFs.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {categories.map((c) => (
                <div
                  key={c.id}
                  className="group rounded-xl border border-border bg-card shadow-sm overflow-hidden hover:border-primary/50 transition-all"
                >
                  <div className="aspect-[4/3] relative border-b border-border">
                    {c.imagePath ? (
                      <CategoryImage
                        categoryId={c.id}
                        alt={c.name}
                        className="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-105"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-muted">
                        <IconFolder className="h-8 w-8 text-muted-foreground/40" />
                      </div>
                    )}
                  </div>
                  <div className="p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium group-hover:text-primary transition-colors">{c.name}</p>
                      <span className="text-xs tabular-nums text-muted-foreground">{c.pdfCount} PDFs</span>
                    </div>
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={() => setEditTarget(c)}
                        className="text-xs text-muted-foreground hover:text-primary transition-colors"
                      >
                        Edit
                      </button>
                      {c.pdfCount === 0 && (
                        <button
                          onClick={() => setDeleteTarget({ id: c.id, name: c.name })}
                          className="text-xs text-red-500 hover:text-red-600 transition-colors"
                        >
                          Delete
                        </button>
                      )}
                    </div>
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
      <Modal open={!!editTarget} onClose={() => setEditTarget(null)} title="Edit Category">
        {editTarget && (
          <EditCategoryForm category={editTarget} onSuccess={() => { setEditTarget(null); router.refresh() }} />
        )}
      </Modal>

      {/* Delete modal */}
      <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Confirm Delete">
        <p className="text-sm text-muted-foreground mb-4">
          Are you sure you want to delete <strong className="text-foreground">{deleteTarget?.name}</strong>? This cannot be undone.
        </p>
        <div className="flex gap-2 justify-end">
          <button onClick={() => setDeleteTarget(null)} className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-muted transition-colors">Cancel</button>
          <button onClick={handleDelete} disabled={deletePending} className="rounded-lg bg-red-600 text-white px-4 py-2 text-sm font-medium disabled:opacity-50 hover:brightness-110 transition-all">
            {deletePending ? "Deleting..." : "Delete"}
          </button>
        </div>
      </Modal>
    </div>
  )
}
