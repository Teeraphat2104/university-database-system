import { prisma } from "@/lib/prisma"
import { HeroSection } from "@/components/landing/hero-section"
import { StatsSection } from "@/components/landing/stats-section"
import { CategoryShowcase } from "@/components/landing/category-showcase"
import { RecentPdfs } from "@/components/recent-pdfs"
import { getCachedSettings } from "@/lib/settings"

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const settings = await getCachedSettings()

  const now = new Date()
  const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  const [categories, recentPdfs, pdfCount, categoryCount, userCount, pdfsThisMonth] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.pdf.findMany({
      take: 6,
      orderBy: { createdAt: "desc" },
      include: { category: true },
    }),
    prisma.pdf.count(),
    prisma.category.count(),
    prisma.user.count(),
    prisma.pdf.count({ where: { createdAt: { gte: firstOfMonth } } }),
  ])

  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection
        pdfCount={pdfCount}
        settings={settings}
      />

      <main className="flex-1 mx-auto max-w-5xl w-full px-4 pb-16 space-y-16">
        <section className="border-b border-border pb-12">
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
