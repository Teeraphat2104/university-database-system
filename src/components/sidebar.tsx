import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { NavLinks } from "@/components/nav-links"
import { CategoryNav } from "@/components/category-nav"

export async function Sidebar() {
  const session = await auth()
  if (!session?.user) redirect("/login")

  const role = (session.user as any).role

  const categories = await prisma.category.findMany({
    include: {
      _count: { select: { pdfs: true } },
      pdfs: {
        select: { id: true, title: true },
        orderBy: { createdAt: "desc" },
        take: 20,
      },
    },
    orderBy: { name: "asc" },
  })

  return (
    <aside className="w-60 bg-sidebar text-sidebar-foreground flex flex-col min-h-screen border-r border-border">
      <div className="h-14 flex items-center gap-2 px-4 border-b border-border">
        <span className="text-sm font-semibold tracking-tight">University DB</span>
      </div>

      <div className="flex-1 py-3 overflow-y-auto">
        <NavLinks role={role} />
        <CategoryNav categories={categories} />
      </div>
    </aside>
  )
}
