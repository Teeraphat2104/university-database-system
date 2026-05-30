"use client"

import { useActionState, Suspense, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { IconCheck } from "@tabler/icons-react"
import { updateSettingsAction } from "@/lib/actions/settings"

const COLOR_PRESETS = [
  "#E66239", "#D43F3F", "#E8913A", "#F59E0B",
  "#10B981", "#059669", "#0D9488", "#06B6D4",
  "#3B82F6", "#6366F1", "#8B5CF6", "#DB2777",
  "#525252", "#1E293B",
]

const TABS = [
  { key: "general", label: "General" },
  { key: "upload", label: "Upload" },
  { key: "contact", label: "Contact" },
  { key: "appearance", label: "Appearance" },
  { key: "landing", label: "Landing" },
] as const

type Tab = (typeof TABS)[number]["key"]

function SettingsForm({ settings }: { settings: Record<string, string> }) {
  const searchParams = useSearchParams()
  const tab = (searchParams.get("tab") as Tab) || "general"

  const [state, action, pending] = useActionState(
    async (_prev: { error: string | null } | null, formData: FormData) => {
      const res = await updateSettingsAction(formData)
      return res
    },
    null,
  )

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage website configuration
        </p>
      </div>

      <div className="flex gap-1 border-b border-border mb-6">
        {TABS.map((t) => {
          const isActive = tab === t.key
          return (
            <Link
              key={t.key}
              href={`/settings?tab=${t.key}`}
              className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
                isActive
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.label}
            </Link>
          )
        })}
      </div>

      <form action={action} className="space-y-6">
        {tab === "general" && (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="siteName" className="text-sm font-medium">Site Name</label>
              <input
                id="siteName"
                name="siteName"
                defaultValue={settings.siteName}
                className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="siteDescription" className="text-sm font-medium">Site Description</label>
              <textarea
                id="siteDescription"
                name="siteDescription"
                rows={3}
                defaultValue={settings.siteDescription}
                className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-y"
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="footerText" className="text-sm font-medium">Footer Text</label>
              <input
                id="footerText"
                name="footerText"
                defaultValue={settings.footerText}
                className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
          </div>
        )}

        {tab === "upload" && (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="maxFileSizeMB" className="text-sm font-medium">Max File Size (MB)</label>
              <input
                id="maxFileSizeMB"
                name="maxFileSizeMB"
                type="number"
                min={1}
                defaultValue={settings.maxFileSizeMB}
                className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="allowedFileTypes" className="text-sm font-medium">Allowed File Types</label>
              <input
                id="allowedFileTypes"
                name="allowedFileTypes"
                placeholder=".pdf,.doc,.docx"
                defaultValue={settings.allowedFileTypes}
                className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
              <p className="text-xs text-muted-foreground">Comma-separated list of allowed extensions</p>
            </div>
          </div>
        )}

        {tab === "contact" && (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="contactEmail" className="text-sm font-medium">Contact Email</label>
              <input
                id="contactEmail"
                name="contactEmail"
                type="email"
                defaultValue={settings.contactEmail}
                className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="contactPhone" className="text-sm font-medium">Phone</label>
              <input
                id="contactPhone"
                name="contactPhone"
                defaultValue={settings.contactPhone}
                className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="aboutText" className="text-sm font-medium">About</label>
              <textarea
                id="aboutText"
                name="aboutText"
                rows={4}
                defaultValue={settings.aboutText}
                className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-y"
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="address" className="text-sm font-medium">Address</label>
              <textarea
                id="address"
                name="address"
                rows={3}
                defaultValue={settings.address}
                className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-y"
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="facebookLink" className="text-sm font-medium">Facebook</label>
              <input
                id="facebookLink"
                name="facebookLink"
                type="url"
                placeholder="https://facebook.com/..."
                defaultValue={settings.facebookLink}
                className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="lineId" className="text-sm font-medium">Line ID</label>
              <input
                id="lineId"
                name="lineId"
                defaultValue={settings.lineId}
                className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="mapEmbedUrl" className="text-sm font-medium">Google Maps Embed URL</label>
              <input
                id="mapEmbedUrl"
                name="mapEmbedUrl"
                placeholder="https://www.google.com/maps/embed?pb=..."
                defaultValue={settings.mapEmbedUrl}
                className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
              <p className="text-xs text-muted-foreground">Paste the Google Maps embed URL from the share dialog</p>
            </div>
          </div>
        )}

        {tab === "appearance" && (
          <ColorPicker initialColor={settings.primaryColor} />
        )}

        {tab === "landing" && (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="heroTitle" className="text-sm font-medium">Hero Title</label>
              <input
                id="heroTitle"
                name="heroTitle"
                defaultValue={settings.heroTitle}
                className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="heroTitleHighlight" className="text-sm font-medium">Hero Title Highlight</label>
              <input
                id="heroTitleHighlight"
                name="heroTitleHighlight"
                defaultValue={settings.heroTitleHighlight}
                className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
              <p className="text-xs text-muted-foreground">Word in the title to highlight with the primary color</p>
            </div>
            <div className="space-y-1.5">
              <label htmlFor="heroSubtitle" className="text-sm font-medium">Hero Subtitle</label>
              <textarea
                id="heroSubtitle"
                name="heroSubtitle"
                rows={3}
                defaultValue={settings.heroSubtitle}
                className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-y"
              />
            </div>
          </div>
        )}

        {state?.error && (
          <div className="rounded-lg bg-destructive/10 text-destructive text-sm px-4 py-3">
            {state.error}
          </div>
        )}

        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-primary text-primary-foreground px-6 py-2.5 text-sm font-medium hover:brightness-110 transition-all disabled:opacity-50"
        >
          {pending ? "Saving..." : "Save Settings"}
        </button>
      </form>
    </div>
  )
}

function ColorPicker({ initialColor }: { initialColor: string }) {
  const [selected, setSelected] = useState(initialColor)

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <label className="text-sm font-medium">Primary Color</label>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="w-5 h-5 rounded border border-border" style={{ backgroundColor: selected }} />
          <span className="font-mono">{selected}</span>
        </div>
        <input type="hidden" name="primaryColor" value={selected} />
      </div>
      <div className="grid grid-cols-7 gap-2">
        {COLOR_PRESETS.map((color) => (
          <button
            key={color}
            type="button"
            onClick={() => setSelected(color)}
            className="relative h-9 w-9 rounded-full border-2 transition-all hover:scale-110"
            style={{
              backgroundColor: color,
              borderColor: selected === color ? "var(--foreground)" : "transparent",
            }}
            title={color}
          >
            {selected === color && (
              <IconCheck className="absolute inset-0 m-auto h-4 w-4 text-white drop-shadow-md" />
            )}
          </button>
        ))}
      </div>
      <div className="rounded-lg border border-border p-4 space-y-2">
        <p className="text-xs text-muted-foreground font-medium">Preview</p>
        <div className="flex flex-wrap gap-2" style={{ "--primary": selected } as React.CSSProperties}>
          <div className="rounded-lg bg-primary text-primary-foreground px-3 py-1.5 text-xs font-medium">Primary Button</div>
          <div className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground">Default</div>
          <span className="inline-flex items-center rounded-full bg-primary/10 text-primary px-2 py-0.5 text-xs font-medium">Badge</span>
        </div>
      </div>
    </div>
  )
}

export function SettingsClient({ settings }: { settings: Record<string, string> }) {
  return (
    <Suspense fallback={<div className="max-w-2xl"><div className="h-8 w-32 bg-muted rounded animate-pulse mb-8" /><div className="h-10 bg-muted rounded animate-pulse mb-6" /><div className="space-y-4"><div className="h-16 bg-muted rounded animate-pulse" /><div className="h-24 bg-muted rounded animate-pulse" /><div className="h-16 bg-muted rounded animate-pulse" /></div></div>}>
      <SettingsForm settings={settings} />
    </Suspense>
  )
}
