import Link from "next/link"
import { CategoryImage } from "@/components/category-image"
import { IconFolder } from "@tabler/icons-react"

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
          <h2 className="text-base font-semibold">Browse by Category</h2>
          <Link
            href="/browse/categories"
            className="text-xs text-muted-foreground hover:text-primary transition-colors"
          >
            View all categories
          </Link>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/browse/categories/${cat.id}`}
            className="group block relative rounded-2xl overflow-hidden border border-border hover:border-foreground/20 transition-colors"
          >
            <div className="aspect-[4/3] relative">
              {cat.imagePath ? (
                <CategoryImage
                  categoryId={cat.id}
                  alt={cat.name}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-muted">
                  <IconFolder className="h-8 w-8 text-muted-foreground/40" />
                </div>
              )}
              <div className="absolute inset-0 bg-black/40" />
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <p className="text-sm font-medium text-white drop-shadow-sm">
                  {cat.name}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
