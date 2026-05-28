export default function AppLoading() {
  return (
    <div className="flex min-h-screen">
      <aside className="w-60 bg-sidebar border-r border-border animate-pulse p-3 space-y-2">
        <div className="h-5 w-28 bg-muted rounded" />
        <div className="h-5 w-20 bg-muted rounded mt-6" />
        <div className="h-5 w-24 bg-muted rounded" />
        <div className="h-5 w-16 bg-muted rounded" />
        <div className="h-5 w-32 bg-muted rounded" />
      </aside>
      <main className="flex-1 p-6 animate-pulse space-y-4">
        <div className="h-6 w-48 bg-muted rounded" />
        <div className="h-4 w-64 bg-muted rounded" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="h-24 bg-muted rounded-xl" />
          <div className="h-24 bg-muted rounded-xl" />
          <div className="h-24 bg-muted rounded-xl" />
        </div>
      </main>
    </div>
  )
}
