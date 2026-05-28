"use client"

import { IconAlertCircle, IconRefresh } from "@tabler/icons-react"

export default function PdfsError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">PDFs</h1>
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="text-center space-y-4 max-w-sm">
          <IconAlertCircle className="h-10 w-10 mx-auto text-red-500" />
          <h2 className="text-lg font-semibold">Failed to load PDFs</h2>
          <p className="text-sm text-muted-foreground">
            {error.message || "An unexpected error occurred."}
          </p>
          <button
            onClick={reset}
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:brightness-110 transition-all"
          >
            <IconRefresh className="h-4 w-4" /> Try again
          </button>
        </div>
      </div>
    </div>
  )
}
