"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Select, type SelectOption } from "@/components/ui/select"

export function EditPdfForm({
  pdf,
  categories,
  months,
  onSuccess,
}: {
  pdf: { id: string; title: string; description: string | null; year: number; month: number; categoryId: string }
  categories: { id: string; name: string; imagePath?: string | null }[]
  months: string[]
  onSuccess: () => void
}) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [categoryId, setCategoryId] = useState(pdf.categoryId)
  const [yearVal, setYearVal] = useState(String(pdf.year))
  const [monthVal, setMonthVal] = useState(String(pdf.month))

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
        <label className="text-sm font-medium">Category</label>
        <Select
          options={categories.map((c) => ({ value: c.id, label: c.name }))}
          value={categoryId}
          onChange={setCategoryId}
          name="categoryId"
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Year</label>
          <Select
            options={years.map((y) => ({ value: String(y), label: String(y) }))}
            value={yearVal}
            onChange={setYearVal}
            name="year"
            required
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Month</label>
          <Select
            options={months.map((m, i) => ({ value: String(i + 1), label: m }))}
            value={monthVal}
            onChange={setMonthVal}
            name="month"
            required
          />
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
