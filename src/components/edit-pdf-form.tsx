"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export function EditPdfForm({
  pdf,
  categories,
  months,
  onSuccess,
}: {
  pdf: { id: string; title: string; description: string | null; year: number; month: number; categoryId: string }
  categories: { id: string; name: string }[]
  months: string[]
  onSuccess: () => void
}) {
  const router = useRouter()
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
        <label htmlFor="edit-title" className="text-sm font-medium">Title</label>
        <input id="edit-title" name="title" defaultValue={pdf.title} required className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
      </div>
      <div className="space-y-1.5">
        <label htmlFor="edit-category" className="text-sm font-medium">Category</label>
        <select id="edit-category" name="categoryId" defaultValue={pdf.categoryId} required className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
          {categories.map((c) => (<option key={c.id} value={c.id}>{c.name}</option>))}
        </select>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label htmlFor="edit-year" className="text-sm font-medium">Year</label>
          <select id="edit-year" name="year" defaultValue={pdf.year} required className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
            {years.map((y) => (<option key={y} value={y}>{y}</option>))}
          </select>
        </div>
        <div className="space-y-1.5">
          <label htmlFor="edit-month" className="text-sm font-medium">Month</label>
          <select id="edit-month" name="month" defaultValue={pdf.month} required className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
            {months.map((m, i) => (<option key={i + 1} value={i + 1}>{m}</option>))}
          </select>
        </div>
      </div>
      <div className="space-y-1.5">
        <label htmlFor="edit-description" className="text-sm font-medium">Description</label>
        <textarea id="edit-description" name="description" rows={3} defaultValue={pdf.description ?? ""} className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
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
