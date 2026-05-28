"use client"

import { useState } from "react"
import { IconEye, IconCalendar } from "@tabler/icons-react"
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
      <div className="border border-border rounded-xl divide-y divide-border overflow-hidden">
        {pdfs.map((pdf) => (
          <div
            key={pdf.id}
            onClick={() => setSelectedPdfId(pdf.id)}
            className="flex items-center justify-between px-4 py-3.5 hover:bg-muted/30 transition-colors cursor-pointer group"
          >
            <div className="space-y-1 min-w-0 flex-1">
              <p className="text-sm font-medium group-hover:text-primary transition-colors truncate">
                {pdf.title}
              </p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium">
                  {pdf.category.imagePath && (
                    <img src={`/api/categories/${pdf.categoryId}/image`} alt="" className="w-3 h-3 rounded object-cover" />
                  )}
                  {pdf.category.name}
                </span>
                <span className="flex items-center gap-1">
                  <IconCalendar className="h-3 w-3" />
                  {MONTHS[pdf.month - 1]} {pdf.year}
                </span>
              </div>
            </div>
            <IconEye className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0 ml-3" />
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
