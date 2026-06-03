"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { IconSearch } from "@tabler/icons-react"
import { Select, type SelectOption } from "@/components/ui/select"

export function SearchForm({
  categories,
  years,
  months,
  initialQ = "",
  initialCategory = "",
  initialYear = "",
  initialMonth = "",
}: {
  categories: { id: string; name: string; imagePath?: string | null }[]
  years: number[]
  months: string[]
  initialQ?: string
  initialCategory?: string
  initialYear?: string
  initialMonth?: string
}) {
  const router = useRouter()
  const [pending, setPending] = useState(false)
  const [category, setCategory] = useState(initialCategory)
  const [year, setYear] = useState(initialYear)
  const [month, setMonth] = useState(initialMonth)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setPending(true)
    const data = new FormData(e.currentTarget)
    const params = new URLSearchParams()
    const q = data.get("q")
    const cat = data.get("category")
    const yr = data.get("year")
    const mon = data.get("month")
    if (q) params.set("q", q as string)
    if (cat) params.set("category", cat as string)
    if (yr) params.set("year", yr as string)
    if (mon) params.set("month", mon as string)
    router.push(`/browse/search?${params.toString()}`)
  }

  const categoryOptions: SelectOption[] = [
    { value: "", label: "All Categories" },
    ...categories.map((c) => ({ value: c.id, label: c.name })),
  ]

  const yearOptions: SelectOption[] = [
    { value: "", label: "All Years" },
    ...years.map((y) => ({ value: String(y), label: String(y) })),
  ]

  const monthOptions: SelectOption[] = [
    { value: "", label: "All Months" },
    ...months.map((m, i) => ({ value: String(i + 1), label: m })),
  ]

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-3">
      <div className="relative">
        <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <input
          name="q"
          defaultValue={initialQ}
          placeholder="Search documents..."
          className="w-full rounded-xl border border-border/50 bg-background/70 backdrop-blur-sm pl-10 pr-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
        />
      </div>
      <div className="flex items-center gap-2 flex-wrap [&>*]:flex-1">
        <Select
          options={categoryOptions}
          value={category}
          onChange={setCategory}
          placeholder="All Categories"
          name="category"
        />
        <Select
          options={yearOptions}
          value={year}
          onChange={setYear}
          placeholder="All Years"
          name="year"
        />
        <Select
          options={monthOptions}
          value={month}
          onChange={setMonth}
          placeholder="All Months"
          name="month"
        />
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-primary text-primary-foreground px-6 py-3 text-sm font-medium hover:brightness-110 transition-all flex items-center gap-2 disabled:opacity-60"
        >
          {pending ? (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          ) : (
            <IconSearch className="h-4 w-4" />
          )}
          {pending ? "Searching..." : "Search"}
        </button>
      </div>
    </form>
  )
}
