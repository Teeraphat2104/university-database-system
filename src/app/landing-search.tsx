"use client"

import { useRouter } from "next/navigation"
import { IconSearch } from "@tabler/icons-react"

export function LandingSearch({
  categories,
  years,
  months,
  hero = false,
}: {
  categories: { id: string; name: string; imagePath?: string | null }[]
  years: number[]
  months: string[]
  hero?: boolean
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

  const inputClass = hero
    ? "w-full rounded-xl border border-border/50 bg-background/70 backdrop-blur-sm pl-10 pr-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-muted-foreground/60"
    : "w-full rounded-lg border pl-9 pr-3 py-2 text-sm"

  const selectClass = hero
    ? "rounded-xl border border-border/50 bg-background/70 backdrop-blur-sm px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
    : "rounded-lg border px-3 py-2 text-sm"

  const buttonClass = hero
    ? "rounded-xl bg-primary text-primary-foreground px-6 py-3 text-sm font-medium hover:brightness-110 transition-all flex items-center gap-2"
    : "rounded-lg bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:brightness-110 transition-all"

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap gap-2">
      <div className={`relative ${hero ? "flex-1 min-w-[220px]" : "flex-1 min-w-[200px]"}`}>
        <IconSearch className={`absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground ${hero ? "h-5 w-5" : "h-4 w-4"}`} />
        <input
          name="q"
          placeholder="Search documents..."
          className={inputClass}
        />
      </div>
      <select
        name="category"
        className={selectClass}
      >
        <option value="">All Categories</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>{cat.name}</option>
        ))}
      </select>
      <select
        name="year"
        className={selectClass}
      >
        <option value="">All Years</option>
        {years.map((y) => (
          <option key={y} value={y}>{y}</option>
        ))}
      </select>
      <select
        name="month"
        className={selectClass}
      >
        <option value="">All Months</option>
        {months.map((m, i) => (
          <option key={i + 1} value={i + 1}>{m}</option>
        ))}
      </select>
      <button
        type="submit"
        className={buttonClass}
      >
        Search
      </button>
    </form>
  )
}
