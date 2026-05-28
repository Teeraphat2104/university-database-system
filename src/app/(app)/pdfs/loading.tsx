export default function PdfsLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-7 w-16 bg-muted rounded" />
      <div className="flex flex-wrap gap-2">
        <div className="h-10 flex-1 min-w-[200px] bg-muted rounded-lg" />
        <div className="h-10 w-36 bg-muted rounded-lg" />
        <div className="h-10 w-28 bg-muted rounded-lg" />
        <div className="h-10 w-32 bg-muted rounded-lg" />
      </div>
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 bg-muted rounded-lg" />
        ))}
      </div>
    </div>
  )
}
