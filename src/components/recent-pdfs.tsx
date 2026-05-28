"use client"

import { motion } from "framer-motion"
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
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 gap-3"
      variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
    >
      {pdfs.map((pdf) => (
        <Link key={pdf.id} href={`/browse/pdfs/${pdf.id}`} className="block">
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.4, 0.25, 1] as const } },
            }}
            whileHover={{ scale: 1.02, y: -2 }}
            className="border border-border rounded-lg p-4 space-y-1.5 hover:shadow-sm transition-shadow cursor-pointer"
          >
            <p className="text-sm font-medium">{pdf.title}</p>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              {pdf.category.imagePath && (
                <img src={`/api/categories/${pdf.categoryId}/image`} alt="" className="w-3.5 h-3.5 rounded object-cover" />
              )}
              {pdf.category.name} &middot; {MONTHS[pdf.month - 1]} {pdf.year}
            </p>
            {pdf.description && (
              <p className="text-xs text-muted-foreground">{pdf.description}</p>
            )}
          </motion.div>
        </Link>
      ))}
    </motion.div>
  )
}
