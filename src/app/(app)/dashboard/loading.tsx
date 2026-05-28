export default function DashboardLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="space-y-1">
        <div className="h-7 w-32 bg-muted rounded" />
        <div className="h-4 w-48 bg-muted rounded" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 bg-muted rounded-xl" />
        ))}
      </div>
      <div className="space-y-4">
        <div className="h-5 w-40 bg-muted rounded" />
        <div className="border border-border rounded-lg divide-y">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-14 bg-muted/50 px-4" />
          ))}
        </div>
      </div>
    </div>
  )
}
