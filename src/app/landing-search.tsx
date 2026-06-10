"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { IconSearch } from "@tabler/icons-react"

export function LandingSearch({
  hero = false,
}: {
  categories?: { id: string; name: string; imagePath?: string | null }[]
  years?: number[]
  months?: string[]
  hero?: boolean
}) {
  const router = useRouter()
  const [value, setValue] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const params = new URLSearchParams()
    const q = data.get("q")
    if (q) params.set("q", q as string)
    router.push(`/browse/search?${params.toString()}`)
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-lg mx-auto">
      <div className="relative flex items-center gap-2">
        <div className="relative flex-1">
          <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <input
            ref={inputRef}
            name="q"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Search documents..."
            className="w-full rounded-lg border border-border bg-background pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-muted-foreground"
          />
        </div>
        <button
          type="submit"
          className="rounded-lg bg-primary text-primary-foreground px-5 py-2.5 text-sm font-medium hover:brightness-110 transition-all"
        >
          Search
        </button>
      </div>
    </form>
  )
}
