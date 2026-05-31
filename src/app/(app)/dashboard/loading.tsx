import { Skeleton } from "@/components/ui/skeleton"

function CardSkeleton() {
  return (
    <div className="border border-border rounded-xl p-5 space-y-3">
      <div className="flex items-center justify-between">
        <Skeleton className="h-10 w-10 rounded-lg" />
        <Skeleton className="h-5 w-24 rounded-full" />
      </div>
      <Skeleton className="h-8 w-16" />
      <Skeleton className="h-3 w-20" />
    </div>
  )
}

function ActionCardSkeleton() {
  return (
    <div className="border border-border rounded-xl p-4 flex items-center gap-3">
      <Skeleton className="h-9 w-9 rounded-lg shrink-0" />
      <div className="flex-1 space-y-1.5">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-3 w-32" />
      </div>
      <Skeleton className="h-4 w-4 shrink-0" />
    </div>
  )
}

function RecentRowSkeleton() {
  return (
    <div className="flex items-center justify-between px-4 py-3.5">
      <div className="space-y-2 flex-1 min-w-0">
        <Skeleton className="h-4 w-3/5" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
      <Skeleton className="h-4 w-4 shrink-0 ml-3" />
    </div>
  )
}

export default function DashboardLoading() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-1">
        <Skeleton className="h-7 w-32" />
        <Skeleton className="h-4 w-48" />
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>

      {/* Quick actions */}
      <section className="space-y-3">
        <Skeleton className="h-4 w-24" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <ActionCardSkeleton />
          <ActionCardSkeleton />
          <ActionCardSkeleton />
        </div>
      </section>

      {/* Recent PDFs */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-16" />
        </div>
        <div className="border border-border rounded-xl divide-y divide-border overflow-hidden">
          <RecentRowSkeleton />
          <RecentRowSkeleton />
          <RecentRowSkeleton />
          <RecentRowSkeleton />
          <RecentRowSkeleton />
        </div>
      </section>
    </div>
  )
}
