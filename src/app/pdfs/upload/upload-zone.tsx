"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Upload } from "lucide-react"

type Category = { id: string; name: string }
type Month = { value: number; label: string }

export function UploadZone({
  categories,
  years,
  months,
}: {
  categories: Category[]
  years: number[]
  months: Month[]
}) {
  const [files, setFiles] = useState<
    { file: File; title: string; categoryId: string; year: number; month: number; description: string }[]
  >([])
  const [uploading, setUploading] = useState(false)
  const [success, setSuccess] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)

  const onDrop = useCallback(
    (accepted: File[]) => {
      setError(null)
      setSuccess([])
      const newFiles = accepted
        .filter((f) => f.type === "application/pdf")
        .map((file) => ({
          file,
          title: file.name.replace(/\.pdf$/i, ""),
          categoryId: categories[0]?.id || "",
          year: new Date().getFullYear(),
          month: new Date().getMonth() + 1,
          description: "",
        }))
      setFiles((prev) => [...prev, ...newFiles])
    },
    [categories],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
  })

  async function handleUploadAll() {
    setUploading(true)
    setError(null)
    setSuccess([])

    for (const item of files) {
      const formData = new FormData()
      formData.set("file", item.file)
      formData.set("title", item.title)
      formData.set("categoryId", item.categoryId)
      formData.set("year", item.year.toString())
      formData.set("month", item.month.toString())
      formData.set("description", item.description)

      const res = await fetch("/api/upload", { method: "POST", body: formData })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error)
        break
      }
      setSuccess((prev) => [...prev, item.title])
    }

    setUploading(false)
    if (!error) setFiles([])
  }

  function removeFile(index: number) {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  function updateFile(index: number, field: string, value: string | number) {
    setFiles((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    )
  }

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${isDragActive ? "border-foreground bg-muted" : "border-border hover:border-muted-foreground"}`}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
        <p className="text-sm text-muted-foreground">
          {isDragActive
            ? "Drop PDFs here"
            : "Drag & drop PDF files here, or click to select"}
        </p>
      </div>

      {files.length > 0 && (
        <div className="space-y-3 border rounded-lg divide-y">
          {files.map((item, i) => (
            <div key={i} className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium truncate">{item.file.name}</span>
                <button
                  type="button"
                  onClick={() => removeFile(i)}
                  className="text-xs text-red-500"
                >
                  Remove
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground">Title</label>
                  <input
                    value={item.title}
                    onChange={(e) => updateFile(i, "title", e.target.value)}
                    className="w-full rounded border px-2 py-1 text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground">Category</label>
                  <select
                    value={item.categoryId}
                    onChange={(e) => updateFile(i, "categoryId", e.target.value)}
                    className="w-full rounded border px-2 py-1 text-sm"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground">Year</label>
                  <select
                    value={item.year}
                    onChange={(e) => updateFile(i, "year", parseInt(e.target.value))}
                    className="w-full rounded border px-2 py-1 text-sm"
                  >
                    {years.map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground">Month</label>
                  <select
                    value={item.month}
                    onChange={(e) => updateFile(i, "month", parseInt(e.target.value))}
                    className="w-full rounded border px-2 py-1 text-sm"
                  >
                    {months.map((m) => (
                      <option key={m.value} value={m.value}>
                        {m.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Description (optional)</label>
                <input
                  value={item.description}
                  onChange={(e) => updateFile(i, "description", e.target.value)}
                  className="w-full rounded border px-2 py-1 text-sm"
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {success.length > 0 && (
        <div className="text-sm text-green-600">
          Uploaded: {success.join(", ")}
        </div>
      )}
      {error && <div className="text-sm text-red-500">{error}</div>}

      {files.length > 0 && (
        <button
          type="button"
          onClick={handleUploadAll}
          disabled={uploading}
          className="w-full rounded-lg bg-foreground text-background px-4 py-2 text-sm font-medium disabled:opacity-50"
        >
          {uploading
            ? `Uploading ${success.length}/${files.length}...`
            : `Upload ${files.length} file${files.length !== 1 ? "s" : ""}`}
        </button>
      )}
    </div>
  )
}
