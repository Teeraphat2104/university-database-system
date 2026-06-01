"use client"

import { useCallback, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import {
  IconUpload, IconFileDescription, IconX, IconChevronLeft,
  IconFile, IconCircleCheck, IconAlertCircle, IconProgress,
} from "@tabler/icons-react"
import { Select, type SelectOption } from "@/components/ui/select"
import { MONTHS, getYears } from "@/lib/constants"

type Step = 1 | 2 | "uploading" | "done"

export function UploadZone({ categories }: { categories: { id: string; name: string; imagePath?: string | null }[] }) {
  const router = useRouter()
  const [step, setStep] = useState<Step>(1)
  const [file, setFile] = useState<File | null>(null)
  const [dragging, setDragging] = useState(false)
  const [progress, setProgress] = useState(0)
  const [message, setMessage] = useState<string | null>(null)
  const [messageType, setMessageType] = useState<"error" | "success">("error")
  const formRef = useRef<HTMLFormElement>(null)
  const years = getYears()
  const [categoryId, setCategoryId] = useState("")
  const [yearVal, setYearVal] = useState(String(years[0]))
  const [monthVal, setMonthVal] = useState(String(new Date().getMonth() + 1))

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

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!file) return

    setStep("uploading")
    setProgress(0)
    setMessage(null)

    const formData = new FormData(e.currentTarget)
    formData.set("file", file)

    const xhr = new XMLHttpRequest()

    xhr.upload.onprogress = (evt) => {
      if (evt.lengthComputable) {
        setProgress(Math.round((evt.loaded / evt.total) * 100))
      }
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        setProgress(100)
        setStep("done")
        setTimeout(() => {
          router.push("/pdfs")
          router.refresh()
        }, 1200)
      } else {
        try {
          const data = JSON.parse(xhr.responseText)
          setMessage(data.error || "Upload failed")
        } catch {
          setMessage("Upload failed")
        }
        setMessageType("error")
        setStep(2)
      }
    }

    xhr.onerror = () => {
      setMessage("Network error")
      setMessageType("error")
      setStep(2)
    }

    xhr.open("POST", "/api/upload")
    xhr.send(formData)
  }

  const formatSize = (bytes: number) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
      {/* Steps indicator */}
      <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm">
        <div className={`flex items-center gap-1 sm:gap-2 ${step === 1 ? "text-primary font-semibold" : "text-muted-foreground"}`}>
          <span className={`flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-full text-xs font-bold border-2 transition-all ${
            step === 1 ? "border-primary bg-primary text-primary-foreground" : "border-border"
          }`}>
            {step === "done" ? <IconCircleCheck className="h-3 w-3 sm:h-3.5 sm:w-3.5" /> : "1"}
          </span>
          <span className="hidden sm:inline">Select File</span>
        </div>
        <div className={`h-px flex-1 border-t transition-colors ${step === 2 || step === "uploading" || step === "done" ? "border-primary" : "border-border"}`} />
        <div className={`flex items-center gap-1 sm:gap-2 ${step === 2 || step === "uploading" ? "text-primary font-semibold" : "text-muted-foreground"}`}>
          <span className={`flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-full text-xs font-bold border-2 transition-all ${
            step === 2 || step === "uploading" ? "border-primary bg-primary text-primary-foreground" : "border-border"
          }`}>
            {step === "done" ? <IconCircleCheck className="h-3 w-3 sm:h-3.5 sm:w-3.5" /> : "2"}
          </span>
          <span className="hidden sm:inline">Details</span>
        </div>
        <div className={`h-px flex-1 border-t transition-colors ${step === "uploading" || step === "done" ? "border-primary" : "border-border"}`} />
        <div className={`flex items-center gap-1 sm:gap-2 ${step === "uploading" || step === "done" ? "text-primary font-semibold" : "text-muted-foreground"}`}>
          <span className={`flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-full text-xs font-bold border-2 transition-all ${
            step === "done" ? "border-green-500 bg-green-500 text-white" : "border-border"
          } ${step === "uploading" ? "border-primary bg-primary text-primary-foreground" : ""}`}>
            {step === "done" ? <IconCircleCheck className="h-3 w-3 sm:h-3.5 sm:w-3.5" /> : "3"}
          </span>
          <span className="hidden sm:inline">Upload</span>
        </div>
      </div>

      {/* Step 1: File selection */}
      {step === 1 && (
        <div className="space-y-4">
          <div
            onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            className={`relative border-2 border-dashed rounded-xl py-16 px-8 text-center space-y-4 transition-all ${
              dragging
                ? "border-primary bg-primary/5 scale-[1.01]"
                : file
                  ? "border-green-400/50 bg-green-50/30 dark:bg-green-950/10"
                  : "border-muted-foreground/30 hover:border-primary/50 hover:bg-muted/30"
            }`}
          >
            {file ? (
              <div className="space-y-4">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center">
                  <IconFileDescription className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">{file.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatSize(file.size)} &middot; PDF
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => { setFile(null); setMessage(null) }}
                  className="inline-flex items-center gap-1 text-xs text-red-500 hover:text-red-600 transition-colors"
                >
                  <IconX className="h-3 w-3" /> Remove and select a different file
                </button>
              </div>
            ) : (
              <>
                <div className="w-16 h-16 mx-auto rounded-2xl bg-muted flex items-center justify-center">
                  <IconUpload className="h-8 w-8 text-muted-foreground" />
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
              className="rounded-lg bg-primary text-primary-foreground px-6 py-2.5 text-sm font-medium disabled:opacity-40 hover:brightness-110 transition-all flex items-center gap-1.5"
            >
              Continue <IconChevronLeft className="h-4 w-4 rotate-180" />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Metadata */}
      {step === 2 && file && (
        <div className="space-y-5 animate-in fade-in slide-in-from-top-2 duration-200">
          {/* File summary */}
          <div className="flex items-center gap-3 rounded-xl border border-border bg-gradient-to-r from-muted/30 to-transparent p-3.5">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <IconFile className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{file.name}</p>
              <p className="text-xs text-muted-foreground">{formatSize(file.size)}</p>
            </div>
            <button
              type="button"
              onClick={handleBack}
              className="text-xs font-medium text-muted-foreground hover:text-primary transition-colors shrink-0"
            >
              Change
            </button>
          </div>

          {/* Form fields */}
          <div className="rounded-xl border border-border p-5 space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="title" className="text-sm font-medium">Title</label>
              <input
                id="title"
                name="title"
                required
                placeholder="e.g. Introduction to Computer Science"
                className="w-full rounded-lg border border-border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-muted-foreground/40"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Category</label>
                <Select
                  options={categories.map((c) => ({ value: c.id, label: c.name }))}
                  value={categoryId}
                  onChange={setCategoryId}
                  placeholder="Select category"
                  name="categoryId"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Year</label>
                  <Select
                    options={years.map((y) => ({ value: String(y), label: String(y) }))}
                    value={yearVal}
                    onChange={setYearVal}
                    name="year"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Month</label>
                  <Select
                    options={MONTHS.map((m, i) => ({ value: String(i + 1), label: m }))}
                    value={monthVal}
                    onChange={setMonthVal}
                    name="month"
                    required
                  />
                </div>
              </div>
            </div>
            <div className="space-y-1.5">
              <label htmlFor="description" className="text-sm font-medium">
                Description <span className="text-muted-foreground font-normal">(optional)</span>
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                placeholder="Brief description of the document..."
                className="w-full rounded-lg border border-border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none placeholder:text-muted-foreground/40"
              />
            </div>
          </div>

          {/* Error */}
          {message && (
            <div className="rounded-lg bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-900 px-4 py-3 text-sm text-red-600 dark:text-red-400 flex items-start gap-2.5">
              <IconAlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
              <span>{message}</span>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3 justify-end">
            <button
              type="button"
              onClick={handleBack}
              className="rounded-lg border border-border px-5 py-2.5 text-sm font-medium hover:bg-muted transition-colors"
            >
              Back
            </button>
            <button
              type="submit"
              className="rounded-lg bg-primary text-primary-foreground px-6 py-2.5 text-sm font-medium hover:brightness-110 transition-all flex items-center gap-1.5"
            >
              <IconUpload className="h-4 w-4" /> Upload PDF
            </button>
          </div>
        </div>
      )}

      {/* Upload progress */}
      {step === "uploading" && (
        <div className="space-y-5 py-8">
          <div className="text-center space-y-3">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center">
              <IconFileDescription className="h-8 w-8 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">Uploading {file?.name}</p>
              <p className="text-xs text-muted-foreground mt-1">{progress}% complete</p>
            </div>
          </div>
          <div className="w-full max-w-sm mx-auto bg-muted rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-center text-muted-foreground">
            {progress < 30 ? "Preparing your file..." :
             progress < 70 ? "Uploading to server..." :
             progress < 100 ? "Saving to database..." :
             "Upload complete!"}
          </p>
        </div>
      )}

      {/* Success */}
      {step === "done" && (
        <div className="space-y-5 py-8 text-center animate-in fade-in zoom-in-95 duration-300">
          <div className="w-20 h-20 mx-auto rounded-full bg-green-100 dark:bg-green-950 flex items-center justify-center">
            <IconCircleCheck className="h-10 w-10 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <p className="text-base font-semibold">Upload Successful!</p>
            <p className="text-sm text-muted-foreground mt-1">Redirecting to PDFs...</p>
          </div>
        </div>
      )}
    </form>
  )
}
