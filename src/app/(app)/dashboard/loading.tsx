import { Skeleton } from "@/components/ui/skeleton"

function StatSkeleton() {
  return (
    <div className="space-y-1">
      <Skeleton className="h-8 w-20" />
      <Skeleton className="h-3 w-12" />
    </div>
  )
}

function RecentRowSkeleton() {
  return (
    <div className="flex items-center justify-between py-3">
      <Skeleton className="h-4 w-3/5" />
      <div className="flex items-center gap-2 ml-4">
        <Skeleton className="h-5 w-16 rounded-full" />
        <Skeleton className="h-3 w-20" />
      </div>
    </div>
  )
}

export default function DashboardLoading() {
  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <Skeleton className="h-7 w-32" />
        <Skeleton className="h-4 w-48" />
      </div>

      <div className="flex flex-wrap gap-x-10 gap-y-4">
        <StatSkeleton />
        <StatSkeleton />
        <StatSkeleton />
      </div>

      <section className="space-y-3">
        <Skeleton className="h-4 w-24" />
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-24" />
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-16" />
        </div>
        <div className="divide-y divide-border">
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
