import { prisma } from "@/lib/prisma"
import { HeroSection } from "@/components/landing/hero-section"
import { StatsSection } from "@/components/landing/stats-section"
import { CategoryShowcase } from "@/components/landing/category-showcase"
import { RecentPdfs } from "@/components/recent-pdfs"
import { getCachedSettings } from "@/lib/settings"

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const settings = await getCachedSettings()
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } })

  const recentPdfs = await prisma.pdf.findMany({
    take: 6,
    orderBy: { createdAt: "desc" },
    include: { category: true },
  })

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ]
  const years = Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i)

  const now = new Date()
  const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  const [pdfCount, categoryCount, userCount, pdfsThisMonth] = await Promise.all([
    prisma.pdf.count(),
    prisma.category.count(),
    prisma.user.count(),
    prisma.pdf.count({ where: { createdAt: { gte: firstOfMonth } } }),
  ])

  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection
        categories={categories}
        years={years}
        months={months}
        settings={settings}
      />

      <main className="flex-1 mx-auto max-w-5xl w-full px-4 pb-16 space-y-12">
        <section>
          <StatsSection data={{ pdfCount, categoryCount, userCount, pdfsThisMonth }} />
        </section>

        {categories.length > 0 && (
          <CategoryShowcase categories={categories} />
        )}

        {recentPdfs.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-sm font-semibold">Recent Documents</h2>
            <RecentPdfs pdfs={recentPdfs} />
          </section>
        )}
      </main>

      <footer className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        {settings.footerText}
      </footer>
    </div>
  )
}
