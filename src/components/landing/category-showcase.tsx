"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { CategoryImage } from "@/components/category-image"
import { IconFolder } from "@tabler/icons-react"

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06 },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.4, 0.25, 1] as const },
  },
}

export function CategoryShowcase({
  categories,
  hideHeader,
}: {
  categories: { id: string; name: string; imagePath?: string | null }[]
  hideHeader?: boolean
}) {
  if (categories.length === 0) return null

  return (
    <section className="space-y-5">
      {!hideHeader && (
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold">Browse by Category</h2>
          <Link
            href="/browse/categories"
            className="text-xs text-muted-foreground hover:text-primary transition-colors"
          >
            View all categories
          </Link>
        </div>
      )}

      <motion.div
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
      >
        {categories.map((cat) => (
          <motion.div key={cat.id} variants={cardVariants}>
            <Link
              href={`/browse/categories/${cat.id}`}
              className="group block relative rounded-xl overflow-hidden border border-border hover:shadow-md transition-all duration-300"
            >
              <div className="aspect-[4/3] relative">
                {cat.imagePath ? (
                  <CategoryImage
                    categoryId={cat.id}
                    alt={cat.name}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-muted">
                    <IconFolder className="h-8 w-8 text-muted-foreground/40" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <p className="text-sm font-medium text-white drop-shadow-sm">
                    {cat.name}
                  </p>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}
