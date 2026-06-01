"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { CategoryImage } from "@/components/category-image"
import { MONTHS } from "@/lib/constants"

type BrowsePdf = {
  id: string
  title: string
  description: string | null
  year: number
  month: number
  categoryId: string
  category: { name: string; imagePath?: string | null }
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06 },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.25, 0.4, 0.25, 1] as const },
  },
}

export function BrowsePdfGrid({ pdfs }: { pdfs: BrowsePdf[] }) {
  if (pdfs.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-16">
        No documents found in this category.
      </p>
    )
  }

  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      viewport={{ once: true, margin: "-60px" }}
    >
      {pdfs.map((pdf) => (
        <motion.div key={pdf.id} variants={cardVariants}>
          <Link
            href={`/browse/pdfs/${pdf.id}`}
            className="block border border-border rounded-lg p-4 space-y-2 hover:shadow-sm hover:border-primary/30 transition-all duration-200"
          >
            <p className="text-sm font-medium leading-snug line-clamp-2">{pdf.title}</p>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              {pdf.category.imagePath && (
                <CategoryImage categoryId={pdf.categoryId} alt="" className="w-3 h-3 rounded object-cover shrink-0" />
              )}
              {pdf.category.name} &middot; {MONTHS[pdf.month - 1]} {pdf.year}
            </p>
            {pdf.description && (
              <p className="text-xs text-muted-foreground line-clamp-2">{pdf.description}</p>
            )}
          </Link>
        </motion.div>
      ))}
    </motion.div>
  )
}
