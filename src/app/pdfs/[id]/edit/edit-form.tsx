"use client"

import { useActionState } from "react"
import { updatePdfAction, deletePdfAction } from "@/lib/actions/pdf"
import { useRouter } from "next/navigation"

export function EditPdfForm({
  pdf,
  categories,
  months,
  years,
}: {
  pdf: any
  categories: { id: string; name: string }[]
  months: string[]
  years: number[]
}) {
  const router = useRouter()

  const [updateState, updateAction, updatePending] = useActionState(
    async (_prev: { error: string | null } | null, formData: FormData) => {
      formData.set("id", pdf.id)
      const result = await updatePdfAction(formData)
      if (!result.error) router.push("/pdfs")
      return result
    },
    null,
  )

  const deleteWithId = deletePdfAction.bind(null, pdf.id)
  const [deleteState, deleteAction, deletePending] = useActionState(
    async (_prev: { error: string | null } | null) => {
      const result = await deleteWithId()
      if (!result.error) router.push("/pdfs")
      return result
    },
    null,
  )

  return (
    <div className="space-y-6">
      <form action={updateAction} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Title</label>
          <input name="title" defaultValue={pdf.title} required className="w-full rounded-lg border px-3 py-2 text-sm" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Category</label>
          <select name="categoryId" defaultValue={pdf.categoryId} className="w-full rounded-lg border px-3 py-2 text-sm">
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <label className="text-sm font-medium">Year</label>
            <select name="year" defaultValue={pdf.year} className="w-full rounded-lg border px-3 py-2 text-sm">
              {years.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Month</label>
            <select name="month" defaultValue={pdf.month} className="w-full rounded-lg border px-3 py-2 text-sm">
              {months.map((m, i) => (
                <option key={i + 1} value={i + 1}>{m}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Description</label>
          <input name="description" defaultValue={pdf.description || ""} className="w-full rounded-lg border px-3 py-2 text-sm" />
        </div>
        {updateState?.error && <p className="text-sm text-red-500">{updateState.error}</p>}
        <button
          type="submit"
          disabled={updatePending}
          className="w-full rounded-lg bg-foreground text-background px-4 py-2 text-sm font-medium disabled:opacity-50"
        >
          {updatePending ? "Saving..." : "Save Changes"}
        </button>
      </form>

      <form action={deleteAction}>
        <button
          type="submit"
          disabled={deletePending}
          className="w-full rounded-lg border border-red-500 text-red-500 px-4 py-2 text-sm font-medium disabled:opacity-50"
        >
          {deletePending ? "Deleting..." : "Delete PDF"}
        </button>
        {deleteState?.error && <p className="text-sm text-red-500 mt-2">{deleteState.error}</p>}
      </form>
    </div>
  )
}
