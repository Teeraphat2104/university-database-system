type StatsData = {
  pdfCount: number
  categoryCount: number
  userCount: number
  pdfsThisMonth: number
}

const stats: { label: string; getValue: (data: StatsData) => number }[] = [
  { label: "PDFs", getValue: (d) => d.pdfCount },
  { label: "Categories", getValue: (d) => d.categoryCount },
  { label: "Users", getValue: (d) => d.userCount },
  { label: "This Month", getValue: (d) => d.pdfsThisMonth },
]

export function StatsSection({ data }: { data: StatsData }) {
  return (
    <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 sm:gap-x-16">
      {stats.map((stat, i) => (
        <div key={stat.label} className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-3xl sm:text-4xl font-bold tabular-nums tracking-tight leading-none">
              {stat.getValue(data).toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground uppercase tracking-widest mt-1">
              {stat.label}
            </p>
          </div>
          {i < stats.length - 1 && (
            <div className="hidden sm:block w-px h-12 bg-border" />
          )}
        </div>
      ))}
    </div>
  )
}
