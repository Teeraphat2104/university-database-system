import Link from "next/link"
import { CategoryImage } from "@/components/category-image"
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {pdfs.map((pdf) => (
        <Link key={pdf.id} href={`/browse/pdfs/${pdf.id}`} className="block border border-border rounded-xl p-5 space-y-2 hover:border-foreground/20 transition-colors">
          <p className="text-base font-medium">{pdf.title}</p>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            {pdf.category.imagePath && (
              <CategoryImage categoryId={pdf.categoryId} alt="" className="w-3.5 h-3.5 rounded object-cover" />
            )}
            {pdf.category.name} &middot; {MONTHS[pdf.month - 1]} {pdf.year}
          </p>
          {pdf.description && (
            <p className="text-xs text-muted-foreground">{pdf.description}</p>
          )}
        </Link>
      ))}
    </div>
  )
}
