export default function AppLoading() {
  return (
    <div className="flex min-h-screen">
      <aside className="w-60 bg-sidebar border-r border-border animate-pulse p-3 space-y-2">
        <div className="h-5 w-28 bg-muted" />
        <div className="h-5 w-20 bg-muted mt-6" />
        <div className="h-5 w-24 bg-muted" />
        <div className="h-5 w-16 bg-muted" />
        <div className="h-5 w-32 bg-muted" />
      </aside>
      <main className="flex-1 p-6 animate-pulse space-y-4">
        <div className="h-6 w-48 bg-muted" />
        <div className="h-4 w-64 bg-muted" />
        <div className="flex gap-10 mt-6">
          <div className="h-24 w-32 bg-muted" />
          <div className="h-24 w-32 bg-muted" />
          <div className="h-24 w-32 bg-muted" />
        </div>
      </main>
    </div>
  )
}
