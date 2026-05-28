"use client"

import { useState } from "react"
import { PdfDetailModal } from "@/components/pdf-detail-modal"
import { MONTHS } from "@/lib/constants"

type RecentPdf = {
  id: string
  title: string
  description: string | null
  year: number
  month: number
  category: { name: string }
}

export function RecentPdfs({ pdfs }: { pdfs: RecentPdf[] }) {
  const [selectedPdfId, setSelectedPdfId] = useState<string | null>(null)

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {pdfs.map((pdf) => (
          <div
            key={pdf.id}
            onClick={() => setSelectedPdfId(pdf.id)}
            className="border border-border rounded-lg p-4 space-y-1.5 hover:shadow-sm transition-shadow cursor-pointer"
          >
            <p className="text-sm font-medium">{pdf.title}</p>
            <p className="text-xs text-muted-foreground">
              {pdf.category.name} &middot; {MONTHS[pdf.month - 1]} {pdf.year}
            </p>
            {pdf.description && (
              <p className="text-xs text-muted-foreground">{pdf.description}</p>
            )}
          </div>
        ))}
      </div>
      <PdfDetailModal
        pdfId={selectedPdfId}
        onClose={() => setSelectedPdfId(null)}
      />
    </>
  )
}
