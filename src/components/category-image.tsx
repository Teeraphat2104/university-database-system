"use client"

import { useEffect, useState, useRef } from "react"

const cache = new Map<string, string | null>()

export function CategoryImage({
  categoryId,
  alt,
  className,
}: {
  categoryId: string
  alt: string
  className?: string
}) {
  const [src, setSrc] = useState<string | null>(cache.get(categoryId) ?? null)
  const [loading, setLoading] = useState(!cache.has(categoryId))
  const mounted = useRef(true)

  useEffect(() => {
    return () => { mounted.current = false }
  }, [])

  useEffect(() => {
    if (cache.has(categoryId)) {
      const cached = cache.get(categoryId)
      setSrc(cached ?? null)
      setLoading(false)
      return
    }

    setLoading(true)
    fetch(`/api/category/${categoryId}/image`, { method: "POST" })
      .then((r) => r.json())
      .then((data: { image: string | null }) => {
        cache.set(categoryId, data.image)
        if (mounted.current) {
          setSrc(data.image ?? null)
          setLoading(false)
        }
      })
      .catch(() => {
        cache.set(categoryId, null)
        if (mounted.current) {
          setSrc(null)
          setLoading(false)
        }
      })
  }, [categoryId])

  if (loading) {
    return <div className={className} />
  }

  if (!src) {
    return <div className={className} />
  }

  return <img src={src} alt={alt} className={className} />
}
