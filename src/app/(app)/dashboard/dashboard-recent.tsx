"use client"

import { useState } from "react"
import { PdfDetailModal } from "@/components/pdf-detail-modal"
import { MONTHS } from "@/lib/constants"
import { IconArrowRight } from "@tabler/icons-react"

type RecentPdf = {
  id: string
  title: string
  year: number
  month: number
  categoryId: string
  category: { name: string; imagePath?: string | null }
}

export function DashboardRecent({ pdfs }: { pdfs: RecentPdf[] }) {
  const [selectedPdfId, setSelectedPdfId] = useState<string | null>(null)

  return (
    <>
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="divide-y divide-border">
          {pdfs.map((pdf) => (
            <button
              type="button"
              key={pdf.id}
              onClick={() => setSelectedPdfId(pdf.id)}
              className="flex items-center justify-between w-full px-4 py-4 group text-left hover:bg-accent transition-colors"
            >
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">
                  {pdf.title}
                </p>
                <p className="text-xs text-muted-foreground truncate">{pdf.category.name}</p>
              </div>
              <div className="flex items-center gap-4 shrink-0 ml-4">
                <span className="hidden sm:block text-xs text-muted-foreground whitespace-nowrap">
                  {MONTHS[pdf.month - 1]} {pdf.year}
                </span>
                <div className="p-1.5 rounded-full bg-border group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <IconArrowRight className="h-3 w-3" />
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
      <PdfDetailModal
        pdfId={selectedPdfId}
        onClose={() => setSelectedPdfId(null)}
      />
    </>
  )
}
