import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { DeleteCategoryButton } from "./delete-button"
import { EditCategoryForm } from "./edit-form"

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { pdfs: true } } },
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Categories</h1>
        <Link
          href="/categories/create"
          className="rounded-lg bg-foreground text-background px-4 py-2 text-sm font-medium"
        >
          Add Category
        </Link>
      </div>

      <div className="border rounded-lg divide-y">
        {categories.map((category) => (
          <div key={category.id} className="flex items-center justify-between px-4 py-3">
            <div>
              <p className="text-sm font-medium">{category.name}</p>
              <p className="text-xs text-muted-foreground">
                {category._count.pdfs} PDF{category._count.pdfs !== 1 ? "s" : ""}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <EditCategoryForm category={{ id: category.id, name: category.name }} />
              <DeleteCategoryButton id={category.id} />
            </div>
          </div>
        ))}
        {categories.length === 0 && (
          <p className="px-4 py-6 text-sm text-muted-foreground text-center">
            No categories yet
          </p>
        )}
      </div>
    </div>
  )
}
