export default function BrowsePdfDetailLoading() {
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

      <div className="mx-auto max-w-6xl w-full px-4 py-4">
        <div className="flex items-center gap-1">
          <div className="h-4 w-12 bg-muted rounded animate-pulse" />
          <div className="h-3.5 w-3.5 bg-muted rounded animate-pulse" />
          <div className="h-4 w-28 bg-muted rounded animate-pulse" />
          <div className="h-3.5 w-3.5 bg-muted rounded animate-pulse" />
          <div className="h-4 w-32 bg-muted rounded animate-pulse" />
        </div>

        <div className="flex items-start justify-between gap-4 mt-2 mb-6">
          <div className="space-y-2 min-w-0">
            <div className="h-7 sm:h-8 w-72 bg-muted rounded animate-pulse" />
            <div className="h-4 w-48 bg-muted rounded animate-pulse" />
          </div>
          <div className="h-4 w-32 bg-muted rounded animate-pulse shrink-0" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-muted rounded-xl animate-pulse" style={{ minHeight: "80vh" }} />

          <div className="space-y-6">
            <div className="border border-border rounded-xl p-5 space-y-5">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-1.5">
                  <div className="h-3 w-16 bg-muted rounded animate-pulse" />
                  <div className="h-4 w-28 bg-muted rounded animate-pulse" />
                </div>
              ))}
              <div className="space-y-1.5">
                <div className="h-3 w-20 bg-muted rounded animate-pulse" />
                <div className="h-4 w-full bg-muted rounded animate-pulse" />
                <div className="h-4 w-3/4 bg-muted rounded animate-pulse" />
              </div>
            </div>
            <div className="h-11 bg-muted rounded-lg animate-pulse" />
          </div>
        </div>
      </div>

      <footer className="border-t border-border py-6 flex justify-center">
        <div className="h-3 w-48 bg-muted rounded animate-pulse" />
      </footer>
    </div>
  )
}
