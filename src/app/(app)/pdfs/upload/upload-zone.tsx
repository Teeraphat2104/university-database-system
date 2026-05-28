"use client"

import { useCallback, useState } from "react"
import { useRouter } from "next/navigation"
import {
  IconUpload, IconFileDescription, IconX, IconChevronLeft, IconFile,
} from "@tabler/icons-react"
import { MONTHS, getYears } from "@/lib/constants"

export function UploadZone({ categories }: { categories: { id: string; name: string }[] }) {
  const router = useRouter()
  const [step, setStep] = useState<1 | 2>(1)
  const [file, setFile] = useState<File | null>(null)
  const [dragging, setDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const years = getYears()

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const dropped = e.dataTransfer.files[0]
    if (dropped?.type === "application/pdf") {
      setFile(dropped)
    }
  }, [])

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null
    if (f?.type === "application/pdf" || !f) setFile(f)
  }

  function handleNext() {
    if (file) setStep(2)
  }

  function handleBack() {
    setStep(1)
    setMessage(null)
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!file) return
    setUploading(true)
    setMessage(null)

    const formData = new FormData(e.currentTarget)
    formData.set("file", file)

    const res = await fetch("/api/upload", { method: "POST", body: formData })
    const data = await res.json()
    setUploading(false)

    if (!res.ok) {
      setMessage(data.error || "Upload failed")
    } else {
      router.push("/pdfs")
      router.refresh()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Steps indicator */}
      <div className="flex items-center gap-4 text-sm">
        <div className={`flex items-center gap-2 ${step === 1 ? "text-primary font-semibold" : "text-muted-foreground"}`}>
          <span className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold border-2 ${
            step === 1 ? "border-primary bg-primary text-primary-foreground" : "border-border"
          }`}>1</span>
          Select File
        </div>
        <div className="h-px flex-1 bg-border" />
        <div className={`flex items-center gap-2 ${step === 2 ? "text-primary font-semibold" : "text-muted-foreground"}`}>
          <span className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold border-2 ${
            step === 2 ? "border-primary bg-primary text-primary-foreground" : "border-border"
          }`}>2</span>
          Details
        </div>
      </div>

      {/* Step 1: File selection */}
      {step === 1 && (
        <div className="space-y-4">
          <div
            onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl py-16 px-8 text-center space-y-4 transition-all cursor-pointer ${
              dragging
                ? "border-primary bg-primary/5 scale-[1.01]"
                : "border-muted-foreground/30 hover:border-primary/50 hover:bg-muted/30"
            }`}
          >
            {file ? (
              <div className="space-y-3">
                <div className="w-14 h-14 mx-auto rounded-xl bg-primary/10 flex items-center justify-center">
                  <IconFileDescription className="h-7 w-7 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">{file.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {(file.size / 1024).toFixed(0)} KB &middot; PDF
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => { setFile(null); setMessage(null) }}
                  className="inline-flex items-center gap-1 text-xs text-red-500 hover:text-red-600 transition-colors"
                >
                  <IconX className="h-3 w-3" /> Remove file
                </button>
              </div>
            ) : (
              <>
                <div className="w-14 h-14 mx-auto rounded-xl bg-muted flex items-center justify-center">
                  <IconUpload className="h-7 w-7 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium">Drop your PDF here</p>
                  <p className="text-xs text-muted-foreground mt-1">or click to browse files</p>
                </div>
                <input
                  type="file"
                  name="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </>
            )}
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              disabled={!file}
              onClick={handleNext}
              className="rounded-lg bg-primary text-primary-foreground px-5 py-2 text-sm font-medium disabled:opacity-40 hover:brightness-110 transition-all flex items-center gap-1.5"
            >
              Continue <IconChevronLeft className="h-4 w-4 rotate-180" />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Metadata */}
      {step === 2 && file && (
        <div className="space-y-5">
          {/* Selected file summary */}
          <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/30 p-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <IconFile className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{file.name}</p>
              <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(0)} KB</p>
            </div>
            <button
              type="button"
              onClick={handleBack}
              className="text-xs text-muted-foreground hover:text-primary transition-colors shrink-0"
            >
              Change
            </button>
          </div>

          {/* Form fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5 md:col-span-2">
              <label htmlFor="title" className="text-sm font-medium">Title</label>
              <input
                id="title"
                name="title"
                required
                placeholder="e.g. Introduction to Computer Science"
                className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-muted-foreground/50"
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="category" className="text-sm font-medium">Category</label>
              <select
                id="category"
                name="categoryId"
                required
                defaultValue=""
                className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              >
                <option value="" disabled>Select category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label htmlFor="year" className="text-sm font-medium">Year</label>
              <select
                id="year"
                name="year"
                required
                defaultValue={years[0]}
                className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              >
                {years.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label htmlFor="month" className="text-sm font-medium">Month</label>
              <select
                id="month"
                name="month"
                required
                defaultValue={new Date().getMonth() + 1}
                className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              >
                {MONTHS.map((m, i) => (
                  <option key={i + 1} value={i + 1}>{m}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5 md:col-span-2">
              <label htmlFor="description" className="text-sm font-medium">Description <span className="text-muted-foreground font-normal">(optional)</span></label>
              <textarea
                id="description"
                name="description"
                rows={3}
                placeholder="Brief description of the document..."
                className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none placeholder:text-muted-foreground/50"
              />
            </div>
          </div>

          {/* Error message */}
          {message && (
            <div className="rounded-lg bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-900 px-3 py-2.5 text-sm text-red-600 dark:text-red-400">
              {message}
            </div>
          )}

          {/* Action buttons */}
          <div className="flex items-center gap-3 justify-end">
            <button
              type="button"
              onClick={handleBack}
              className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-muted transition-colors"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={uploading}
              className="rounded-lg bg-primary text-primary-foreground px-6 py-2 text-sm font-medium disabled:opacity-50 hover:brightness-110 transition-all flex items-center gap-1.5 min-w-[140px] justify-center"
            >
              {uploading ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Uploading...
                </>
              ) : (
                "Upload PDF"
              )}
            </button>
          </div>
        </div>
      )}
    </form>
  )
}
