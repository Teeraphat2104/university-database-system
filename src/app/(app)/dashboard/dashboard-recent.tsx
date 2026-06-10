"use client"

import { useState } from "react"
import { PdfDetailModal } from "@/components/pdf-detail-modal"
import { MONTHS } from "@/lib/constants"

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
      <div className="divide-y divide-border">
        {pdfs.map((pdf) => (
          <button
            type="button"
            key={pdf.id}
            onClick={() => setSelectedPdfId(pdf.id)}
            className="flex items-center justify-between w-full py-3 group text-left"
          >
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">
                {pdf.title}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0 ml-4">
              <span className="text-xs text-muted-foreground border border-border rounded-full px-2 py-0.5">
                {pdf.category.name}
              </span>
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                {MONTHS[pdf.month - 1]} {pdf.year}
              </span>
            </div>
          </button>
        ))}
      </div>
      <PdfDetailModal
        pdfId={selectedPdfId}
        onClose={() => setSelectedPdfId(null)}
      />
    </>
  )
}
