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
            className="border border-border rounded-2xl p-6 space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="h-12 w-12 rounded-xl flex items-center justify-center bg-muted text-primary">
                <Icon className="h-6 w-6" />
              </div>
            </div>
            <p className="text-3xl font-bold tabular-nums tracking-tight">
              {stat.getValue(data)}
            </p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </div>
        )
      })}
    </div>
  )
}
