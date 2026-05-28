"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { IconChevronRight, IconFolder } from "@tabler/icons-react"
import { PdfDetailModal } from "@/components/pdf-detail-modal"

type CategoryItem = {
  id: string
  name: string
  slug: string
  imagePath?: string | null
  _count: { pdfs: number }
  pdfs: { id: string; title: string }[]
}

export function CategoryNav({ categories }: { categories: CategoryItem[] }) {
  const router = useRouter()
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})
  const [selectedPdfId, setSelectedPdfId] = useState<string | null>(null)

  function toggle(categoryId: string) {
    setExpanded((prev) => ({ ...prev, [categoryId]: !prev[categoryId] }))
  }

  function handlePdfClick(pdfId: string) {
    setSelectedPdfId(pdfId)
  }

  return (
    <>
      <div className="px-3 mt-2 mb-1">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/60">
          Categories
        </p>
      </div>
      <nav className="flex flex-col gap-0.5 px-3">
        {categories.map((cat) => {
          const isExpanded = expanded[cat.id]
          return (
            <div key={cat.id}>
              <button
                onClick={() => toggle(cat.id)}
                className="w-full rounded-lg px-3 py-2 text-sm flex items-center gap-3 text-sidebar-foreground/80 hover:text-primary hover:bg-primary/10 transition-colors"
              >
                <IconChevronRight
                  className={`h-3.5 w-3.5 shrink-0 transition-transform ${isExpanded ? "rotate-90" : ""}`}
                />
                {cat.imagePath ? (
                  <img src={`/api/categories/${cat.id}/image`} alt="" className="h-4 w-4 shrink-0 rounded object-cover" />
                ) : (
                  <IconFolder className="h-4 w-4 shrink-0" />
                )}
                <span className="flex-1 text-left truncate">{cat.name}</span>
                <span className="text-xs text-muted-foreground">{cat._count.pdfs}</span>
              </button>
              {isExpanded && (
                <div className="ml-6 pl-2 border-l border-border space-y-0.5">
                  {cat.pdfs.length === 0 && (
                    <p className="text-xs text-muted-foreground py-1.5 px-3">No PDFs</p>
                  )}
                  {cat.pdfs.map((pdf) => (
                    <button
                      key={pdf.id}
                      onClick={() => handlePdfClick(pdf.id)}
                      className="w-full text-left rounded-md px-3 py-1.5 text-xs text-sidebar-foreground/70 hover:text-primary hover:bg-primary/10 transition-colors truncate"
                    >
                      {pdf.title}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </nav>
      <PdfDetailModal
        pdfId={selectedPdfId}
        onClose={() => setSelectedPdfId(null)}
        onSuccess={() => router.refresh()}
      />
    </>
  )
}
