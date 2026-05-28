export default function BrowseCategoryLoading() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="sticky top-0 z-50 border-b border-border/50">
        <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between">
          <div className="h-5 w-24 bg-muted rounded animate-pulse" />
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-muted rounded-lg animate-pulse" />
            <div className="h-8 w-16 bg-muted rounded-lg animate-pulse" />
          </div>
        </div>
      </div>

      <section className="bg-gradient-to-b from-primary/5 via-primary/[0.02] to-background border-b border-border">
        <div className="mx-auto max-w-5xl px-4 py-10 sm:py-12 space-y-4">
          <div className="flex items-center gap-1">
            <div className="h-4 w-12 bg-muted rounded animate-pulse" />
            <div className="h-3.5 w-3.5 bg-muted rounded animate-pulse" />
            <div className="h-4 w-28 bg-muted rounded animate-pulse" />
            <div className="h-3.5 w-3.5 bg-muted rounded animate-pulse" />
            <div className="h-4 w-24 bg-muted rounded animate-pulse" />
          </div>
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-muted rounded-xl animate-pulse shrink-0" />
              <div className="space-y-2">
                <div className="h-7 sm:h-9 w-48 bg-muted rounded animate-pulse" />
                <div className="h-4 w-24 bg-muted rounded animate-pulse" />
              </div>
            </div>
            <div className="h-4 w-32 bg-muted rounded animate-pulse shrink-0" />
          </div>
        </div>
      </section>

      <main className="flex-1 mx-auto max-w-5xl w-full px-4 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-28 bg-muted rounded-lg animate-pulse" />
          ))}
        </div>
      </main>

      <footer className="border-t border-border py-6 flex justify-center">
        <div className="h-3 w-48 bg-muted rounded animate-pulse" />
      </footer>
    </div>
  )
}
