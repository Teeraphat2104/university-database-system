import {
  IconFileDescription,
  IconFolder,
  IconUsers,
  IconCalendar,
} from "@tabler/icons-react"

type StatsData = {
  pdfCount: number
  categoryCount: number
  userCount: number
  pdfsThisMonth: number
}

const stats: { label: string; getValue: (data: StatsData) => number; icon: React.ComponentType<{ className?: string }> }[] = [
  {
    label: "Total PDFs",
    getValue: (data: StatsData) => data.pdfCount,
    icon: IconFileDescription,
  },
  {
    label: "Categories",
    getValue: (data: StatsData) => data.categoryCount,
    icon: IconFolder,
  },
  {
    label: "Users",
    getValue: (data: StatsData) => data.userCount,
    icon: IconUsers,
  },
  {
    label: "This Month",
    getValue: (data: StatsData) => data.pdfsThisMonth,
    icon: IconCalendar,
  },
]

export function StatsSection({ data }: { data: StatsData }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <div
            key={stat.label}
            className="border border-border rounded-xl p-4 sm:p-5 space-y-2 hover:shadow-sm transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div className="h-10 w-10 rounded-lg flex items-center justify-center bg-muted text-primary">
                <Icon className="h-5 w-5" />
              </div>
            </div>
            <p className="text-2xl font-bold tabular-nums">
              {stat.getValue(data)}
            </p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </div>
        )
      })}
    </div>
  )
}
