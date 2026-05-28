import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { DeleteCategoryButton } from "./delete-button"
import { IconFolderPlus } from "@tabler/icons-react"

export default async function CategoriesPage() {
  const session = await auth()
  if (!session?.user) redirect("/login")
  if ((session.user as any).role !== "admin") redirect("/dashboard")

  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { pdfs: true } } },
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Categories</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage document categories</p>
        </div>
        <Link
          href="/categories/create"
          className="rounded-lg bg-primary text-primary-foreground px-3 py-2 text-sm font-medium hover:brightness-110 transition-all flex items-center gap-1.5"
        >
          <IconFolderPlus className="h-4 w-4" /> Add Category
        </Link>
      </div>

      <div className="border rounded-lg divide-y">
        {categories.map((c) => (
          <div key={c.id} className="flex items-center justify-between px-4 py-3">
            <div className="space-y-0.5">
              <p className="text-sm font-medium">{c.name}</p>
              <p className="text-xs text-muted-foreground">{c._count.pdfs} PDF(s)</p>
            </div>
            {c._count.pdfs === 0 && <DeleteCategoryButton id={c.id} />}
          </div>
        ))}
        {categories.length === 0 && (
          <p className="px-4 py-6 text-sm text-muted-foreground text-center">No categories yet.</p>
        )}
      </div>
    </div>
  )
}
