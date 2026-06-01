---
name: University Database System
description: A centralized document management system for a university archive
colors:
  primary: "#E66239"
  neutral-bg: "#ffffff"
  neutral-ink: "#262626"
  neutral-muted: "#f5f5f5"
  muted-ink: "#737373"
  border: "#e5e5e5"
  sidebar-bg: "#ffffff"
  sidebar-ink: "#262626"
  dark-bg: "#0a0a0a"
  dark-ink: "#f5f5f5"
  dark-muted: "#171717"
  dark-muted-ink: "#a3a3a3"
  dark-border: "#262626"
  dark-sidebar-bg: "#0a0a0a"
  dark-sidebar-ink: "#f5f5f5"
typography:
  display:
    fontFamily: "Geist, 'Noto Sans Thai', Arial, Helvetica, sans-serif"
    fontSize: "clamp(1.5rem, 4vw, 3.75rem)"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.03em"
  body:
    fontFamily: "Geist, 'Noto Sans Thai', Arial, Helvetica, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Geist, 'Noto Sans Thai', Arial, Helvetica, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 500
    letterSpacing: "0.01em"
  mono:
    fontFamily: "Geist Mono, monospace"
    fontSize: "0.875rem"
rounded:
  sm: "6px"
  md: "8px"
  lg: "12px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.neutral-bg}"
    rounded: "{rounded.md}"
    padding: "10px 16px"
    height: "32px"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.neutral-ink}"
    border: "1px solid {colors.border}"
    rounded: "{rounded.md}"
    padding: "10px 16px"
    height: "32px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.neutral-ink}"
    rounded: "{rounded.md}"
    padding: "10px 16px"
    height: "32px"
  input:
    backgroundColor: "transparent"
    textColor: "{colors.neutral-ink}"
    border: "1px solid {colors.border}"
    rounded: "{rounded.md}"
    padding: "4px 10px"
    height: "32px"
  card:
    backgroundColor: "{colors.neutral-bg}"
    border: "1px solid {colors.border}"
    rounded: "{rounded.lg}"
    padding: "16px"
  sidebar-nav-item:
    backgroundColor: "transparent"
    textColor: "{colors.neutral-ink}"
    rounded: "{rounded.md}"
    padding: "8px 12px"
  sidebar-nav-item-active:
    backgroundColor: "rgba(230, 98, 57, 0.1)"
    textColor: "{colors.primary}"
    rounded: "{rounded.md}"
    padding: "8px 12px"
---

# Design System: University Database System

## 1. Overview

**Creative North Star: "The Quiet Archive"**

The interface of a special collections reading room: calm, orderly, and deliberately backgrounded. Every surface is flat and matter-of-fact. Borders, not shadows, separate content regions. The typography is clean and legible — Geist with Noto Sans Thai for Thai-language support. The single accent, Terracotta, is used sparingly: buttons, links, active navigation states. Its rarity is the point.

This system explicitly rejects the visual language of corporate SaaS dashboards: no rainbow-colored stat cards, no glassmorphism, no gradient text, no heavy drop shadows. The design never competes with the documents it exists to surface.

**Key Characteristics:**
- Flat surfaces with 1px borders for hierarchy
- Single restrained accent (Terracotta, used on <10% of any screen)
- Clean geometric sans typography
- Generous whitespace, capped line lengths
- Dark mode achieved through tonal inversion, not hue shifts

## 2. Colors

The palette is restrained: a true neutral scale anchored by white and near-black, with a single warm accent.

### Primary
- **Terracotta** (`#E66239`): The only accent. Used for primary buttons, active navigation, key interactive elements, and the site name in the hero. Never decorative.

### Neutral
- **White** (`#ffffff`): Primary background (light mode).
- **Ink** (`#262626`): Body text (light mode). High contrast against white (4.5:1+).
- **Muted Surface** (`#f5f5f5`): Secondary background, hover states, skeleton loaders.
- **Muted Ink** (`#737373`): Secondary text, metadata, placeholders, section labels.
- **Border** (`#e5e5e5`): All 1px borders separating surfaces.
- **Sidebar** (`#ffffff`): Sidebar surface, same as body background.
- **Sidebar Ink** (`#262626`): Sidebar text, same as body text.

### Dark Mode
- **Dark Background** (`#0a0a0a`): Near-black body background.
- **Dark Ink** (`#f5f5f5`): Body text on dark. High contrast.
- **Dark Muted** (`#171717`): Secondary background in dark mode.
- **Dark Muted Ink** (`#a3a3a3`): Secondary text in dark mode.
- **Dark Border** (`#262626`): Surface separation in dark mode.
- **Terracotta** (`#E66239`): Identical in both themes. Consistent brand anchor.

### Named Rules
**The Restraint Rule.** Terracotta occupies no more than 10% of any given screen. If a layout requires more visual weight, use weight or spacing before reaching for color.

## 3. Typography

**Display & Body Font:** Geist (with Noto Sans Thai for Thai-language fallback)
**Mono Font:** Geist Mono

**Character:** Clean, geometric, and quietly confident. Geist is a utilitarian sans-serif with precise spacing and a large x-height for readability. The single-family approach (Geist for both display and body) avoids the pairing problem entirely. Noto Sans Thai matches Geist's geometric clarity for bilingual content.

### Hierarchy
- **Display** (700, `clamp(1.5rem, 4vw, 3.75rem)`, 1.1, -0.03em): Hero headings only. One per page.
- **Headline** (600, `1.5rem`, 1.2): Page titles, section headings in the admin panel.
- **Title** (600, `1rem`, 1.3): Card titles, modal headings, subsection labels.
- **Body** (400, `0.875rem`, 1.6): Primary reading text. Line length capped at 65-75ch.
- **Body Large** (400, `1rem`, 1.7): Hero subtitles, featured descriptions.
- **Label** (500, `0.75rem`, 1.4, 0.01em): Metadata labels, stat descriptions, timestamps.
- **Mono** (400, `0.875rem`, 1.5): File paths, code, technical identifiers.

### Named Rules
**The One-Family Rule.** No competing typefaces. Geist covers display, body, and UI. Mono is Geist Mono. Thai content uses Noto Sans Thai with matching proportions.

## 4. Elevation

Flat by default. Depth is communicated through 1px solid borders (`var(--border)`), not through shadows. This is deliberate: the content should feel like it sits on a table, not suspended in space.

- **Cards and containers** have no shadow at rest. A 1px border separates them from the background.
- **Hover state** on interactive cards adds `box-shadow: 0 1px 3px rgba(0,0,0,0.08)` — barely perceptible, just enough to signal interactivity.
- **Modal dialogs** use the native `<dialog>` element with a 1px border; no shadow on the dialog itself.
- **Select dropdowns** use `shadow-lg` (the one exception) for the floating panel, since it must visually detach from the trigger.
- **Tooltips** have no shadow, just an inverted color scheme (ink background, white text).

### Named Rules
**The Flat-By-Default Rule.** Surfaces are flat at rest. Shadows appear only as a response to state (hover, focus), and only at minimum perceptible intensity. The one exception: floating dropdown panels that must visually escape their trigger.

## 5. Components

### Buttons
- **Shape:** Gently curved edges (8px radius). Compact by default (32px height).
- **Primary:** Terracotta background (`#E66239`), white text. Hover: slight brightening via `brightness(1.1)`. Focus: 3px ring at primary/50.
- **Outline:** Transparent background, 1px border (`var(--border)`), ink text. Hover: muted background fill. Active: slight press via `translateY(1px)`.
- **Ghost:** Transparent, no border. Hover: muted background fill.
- **Destructive:** Red tinted background (`bg-destructive/10`), red text. Hover: deeper tint.
- **Link:** Text-only, underline on hover. Same color as primary.

### Inputs & Fields
- **Shape:** Gently curved edges (8px radius). Compact (32px height). 1px border (`var(--border)`).
- **Focus:** 1px border shifts to primary hue, plus a 3px ring at primary/20.
- **Placeholder:** Muted ink (`#737373`). Not the browser default gray — matches the design's contrast requirements.
- **Disabled:** 50% opacity, muted background fill.

### Select (Custom Dropdown)
- **Trigger:** Same shape as inputs. Chevron icon rotates on open.
- **Panel:** Fixed-positioned below trigger. White background, 1px border, rounded-lg, `shadow-lg`. Animated entrance (scale + fade, 150ms).
- **Options:** Hover fills muted background. Selected option shows checkmark and primary tint.
- **Portal-aware:** Renders into modal portal when inside a dialog, avoiding clipping.

### Cards
- **Corner Style:** Relaxed curve (12px radius). Slightly rounder than buttons/inputs for visual hierarchy.
- **Background:** Matches page background. No fill shift.
- **Border:** 1px solid (`var(--border)`).
- **Shadow:** None at rest. Interactive cards add `hover:shadow-sm`.
- **Internal Padding:** 16-20px (p-4 to p-5).

### Navigation (Sidebar)
- **Width:** 240px (w-60). Full viewport height on desktop.
- **Background:** Matches page background.
- **Style:** Tree structure with collapsible branches (Content, System) and leaf items.
- **Default state:** Muted text (`color: var(--sidebar-foreground)/80`).
- **Hover:** Terracotta text on 10% Terracotta tint background.
- **Active:** Same as hover, persistent.
- **Toggle chevron:** Rotates 90 degrees on branch expand. 3.5px icon width.

### Modal (Dialog)
- **Container:** Native `<dialog>` element with `showModal()`.
- **Shape:** 12px radius. 1px border. Max width: 448px (default) or 672px (wide variant).
- **Header:** Bottom border separator. 20px horizontal padding, 16px vertical. Semibold title, close button (X icon).
- **Body:** 20px padding. Overflow visible (to allow dropdown panels).

## 6. Do's and Don'ts

### Do:
- **Do** use Terracotta sparingly — buttons, active nav, links. Let the neutral palette carry 90%+ of the surface.
- **Do** use 1px borders for surface separation instead of shadows. Flat is the default.
- **Do** use `text-wrap: balance` on headings and `text-wrap: pretty` on prose paragraphs.
- **Do** prefer the compact height (32px) for buttons and inputs as the default. Only use larger sizes when the context demands it.
- **Do** test every screen in both light and dark mode before shipping.

### Don't:
- **Don't** use rainbow-colored stat cards with per-item gradients. Stats use the neutral palette with the icon tinted Terracotta.
- **Don't** combine `border: 1px solid` with `box-shadow` blur ≥ 16px on the same element.
- **Don't** use border-radius larger than 12px on cards or 8px on buttons/inputs.
- **Don't** use gradient text, glassmorphism, or side-stripe borders of any kind.
- **Don't** use all-caps body copy. Uppercase is reserved for short labels (≤4 words) only.
- **Don't** use the hero-metric template (big number + small label + gradient accent) — that is a SaaS cliché that contradicts the Quiet Archive.
- **Don't** use <4.5:1 contrast for body text or 4.5:1 for placeholder text. Muted Ink (`#737373`) on white is the floor; don't go lighter.
- **Don't** create nested cards. A card inside a card is always wrong.
