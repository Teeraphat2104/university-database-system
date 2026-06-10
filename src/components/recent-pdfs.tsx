import Link from "next/link"
import { MONTHS } from "@/lib/constants"

type RecentPdf = {
  id: string
  title: string
  description: string | null
  year: number
  month: number
  categoryId: string
  category: { name: string; imagePath?: string | null }
}

export function RecentPdfs({ pdfs }: { pdfs: RecentPdf[] }) {
  return (
    <div className="divide-y divide-border">
      {pdfs.map((pdf) => (
        <Link
          key={pdf.id}
          href={`/browse/pdfs/${pdf.id}`}
          className="flex items-center justify-between py-3 group"
        >
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">
              {pdf.title}
            </p>
            {pdf.description && (
              <p className="text-xs text-muted-foreground truncate mt-0.5">
                {pdf.description}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2 shrink-0 ml-4">
            <span className="text-xs text-muted-foreground border border-border rounded-full px-2 py-0.5">
              {pdf.category.name}
            </span>
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              {MONTHS[pdf.month - 1]} {pdf.year}
            </span>
          </div>
        </Link>
      ))}
    </div>
  )
}
