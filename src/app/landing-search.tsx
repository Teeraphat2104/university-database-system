"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { IconSearch } from "@tabler/icons-react"
import { Select, type SelectOption } from "@/components/ui/select"

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
  const [category, setCategory] = useState("")
  const [year, setYear] = useState("")
  const [month, setMonth] = useState("")

  const [value, setValue] = useState("")
  const placeholder = "Search documents..."
  const inputRef = useRef<HTMLInputElement>(null)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
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

  const inputClass = hero
    ? "w-full rounded-lg border border-border bg-background pl-10 pr-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-muted-foreground"
    : "w-full rounded-lg border pl-9 pr-3 py-2 text-sm"

  const buttonClass = hero
    ? "rounded-lg border border-border text-foreground px-6 py-3 text-sm font-medium hover:bg-muted transition-all flex items-center gap-2"
    : "rounded-lg bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:brightness-110 transition-all"

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
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div className={`relative ${hero ? "w-full" : "flex-1 min-w-[200px]"}`}>
        <IconSearch className={`absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground ${hero ? "h-5 w-5" : "h-4 w-4"}`} />
        <input
          ref={inputRef}
          name="q"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={hero && !value ? "" : placeholder}
          className={inputClass}
        />
        {hero && !value && (
          <span className="absolute left-10 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none truncate max-w-[calc(100%-3rem)]">
            {placeholder}
          </span>
        )}
      </div>
      <div className={`flex items-center gap-2 flex-wrap ${hero ? "" : "[&>*]:flex-1"}`}>
        <Select
          options={categoryOptions}
          value={category}
          onChange={setCategory}
          placeholder="All Categories"
          name="category"
          className={hero ? "flex-1" : "min-w-[130px]"}
        />
        <Select
          options={yearOptions}
          value={year}
          onChange={setYear}
          placeholder="All Years"
          name="year"
          className={hero ? "flex-1" : "min-w-[110px]"}
        />
        <Select
          options={monthOptions}
          value={month}
          onChange={setMonth}
          placeholder="All Months"
          name="month"
          className={hero ? "flex-1" : "min-w-[120px]"}
        />
        <button
          type="submit"
          className={buttonClass}
        >
          Search
        </button>
      </div>
    </form>
  )
}
