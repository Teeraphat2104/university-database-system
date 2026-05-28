"use client"

import { useRouter } from "next/navigation"
import { Search } from "lucide-react"

export function LandingSearch({
  categories,
  years,
  months,
}: {
  categories: { id: string; name: string }[]
  years: number[]
  months: string[]
}) {
  const router = useRouter()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const params = new URLSearchParams()
    const q = data.get("q")
    const category = data.get("category")
    const year = data.get("year")
    const month = data.get("month")
    if (q) params.set("q", q as string)
    if (category) params.set("category", category as string)
    if (year) params.set("year", year as string)
    if (month) params.set("month", month as string)
    router.push(`/pdfs?${params.toString()}`)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap gap-2">
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          name="q"
          placeholder="Search documents..."
          className="w-full rounded-lg border pl-9 pr-3 py-2 text-sm"
        />
      </div>
      <select
        name="category"
        className="rounded-lg border px-3 py-2 text-sm"
      >
        <option value="">All Categories</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>{cat.name}</option>
        ))}
      </select>
      <select
        name="year"
        className="rounded-lg border px-3 py-2 text-sm"
      >
        <option value="">All Years</option>
        {years.map((y) => (
          <option key={y} value={y}>{y}</option>
        ))}
      </select>
      <select
        name="month"
        className="rounded-lg border px-3 py-2 text-sm"
      >
        <option value="">All Months</option>
        {months.map((m, i) => (
          <option key={i + 1} value={i + 1}>{m}</option>
        ))}
      </select>
      <button
        type="submit"
        className="rounded-lg bg-foreground text-background px-4 py-2 text-sm font-medium"
      >
        Search
      </button>
    </form>
  )
}
