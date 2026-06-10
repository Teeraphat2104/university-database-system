# University Database System — Architecture

## Table of Contents

- [1. Project Architecture](#1-project-architecture)
- [2. Tech Stack](#2-tech-stack)
- [3. System Architecture](#3-system-architecture)
- [4. System Flow](#4-system-flow)
- [5. User Flow](#5-user-flow)
- [6. Challenges & Solutions](#6-challenges--solutions)
- [7. Future Roadmap](#7-future-roadmap)

---

## 1. Project Architecture

### High-Level Structure

```
university-database-system/
├── prisma/             # Database schema + seed
├── public/             # Static assets
├── src/
│   ├── app/            # Next.js App Router (pages + API routes)
│   ├── components/     # Reusable UI components
│   ├── hooks/          # Custom React hooks
│   └── lib/            # Server Actions, auth config, utilities
├── uploads/            # Local file storage (fallback)
├── nginx/              # Reverse proxy + SSL config
├── docker-compose.yml  # Multi-service orchestration
├── Dockerfile          # App container
└── components.json     # shadcn/ui config
```

### Route Grouping

| Group | Path | Auth Required | Description |
|---|---|---|---|
| `(app)/` | `/dashboard`, `/pdfs`, `/categories`, `/admins`, `/settings` | Yes (Editor/Admin) | Authenticated app shell with sidebar + topbar |
| `(auth)/` | `/login` | No | Login page (redirects to dashboard if already authenticated) |
| `browse/` | `/browse/categories`, `/browse/pdfs/[id]`, `/browse/search` | No | Public-facing browse and search |
| `api/` | `/api/auth/*`, `/api/pdf/*`, `/api/category/*` | Mixed | Route handlers for AJAX calls and file serving |

### Data-Fetching Strategy (Hybrid)

The project uses three complementary patterns:

1. **Server Components (RSC)** — Direct `prisma` calls during server-side rendering for initial page loads. No HTTP round-trip.

2. **Server Actions** — `"use server"` functions for mutations (create, update, delete). Called from client components via `formAction` or `useActionState`. Mutations call `revalidatePath()` to refresh cached pages.

3. **Fetch API (Route Handlers)** — Traditional `fetch()` calls to `/api/*` routes for non-form interactions (delete confirmation, modal data loading, file downloads).

### Route Protection

Middleware (`src/proxy.ts`) uses NextAuth's `authorized` callback to enforce three tiers:

- **Public** — Accessible without authentication (`/`, `/browse/*`, `/login`)
- **Editor** — Requires valid session with `role: "editor"` or `"admin"` (`/dashboard`, `/pdfs/*`)
- **Admin** — Requires `role: "admin"` (`/categories`, `/admins`, `/settings`)

---

## 2. Tech Stack

### Core Frameworks

| Technology | Version | Purpose |
|---|---|---|
| **Next.js** | 16.2.6 | React meta-framework (App Router) |
| **React** | 19.2.4 | UI library |
| **TypeScript** | ^5 | Type safety |
| **Node.js** | 20 (Alpine) | Runtime |

### Styling & UI

| Library | Purpose |
|---|---|
| **Tailwind CSS** v4 | Utility-first CSS framework |
| **shadcn/ui** (base-nova) | UI primitives (button, input, select, sheet, sidebar, etc.) |
| **@base-ui/react** ^1.5.0 | Headless UI primitives |
| **@tabler/icons-react** ^3.44.0 | Icon library |
| **lucide-react** ^1.16.0 | Additional icons |
| **framer-motion** ^12.40.0 | Animations |
| **Geist / Geist_Mono / Noto_Sans_Thai** | Typography via `next/font` |
| **class-variance-authority + clsx + tailwind-merge** | Class name management (`cn()` utility) |

### Database & ORM

| Library | Purpose |
|---|---|
| **MongoDB Atlas** | NoSQL database |
| **Prisma** ^6.19.0 | ORM with MongoDB provider |
| **@auth/prisma-adapter** ^2.11.2 | NextAuth session adapter |

### Authentication

| Library | Purpose |
|---|---|
| **next-auth** ^5.0.0-beta.31 | Auth.js v5 with Credentials provider |
| **bcryptjs** ^3.0.3 | Password hashing |
| **JWT session strategy** | Stateless session tokens |

### File Storage

| Strategy | Provider | Condition |
|---|---|---|
| **Vercel Blob** (primary) | `@vercel/blob` ^2.4.0 | When `BLOB_READ_WRITE_TOKEN` is set |
| **Local filesystem** (fallback) | `uploads/` directory | When blob token is unavailable |

### Forms & Validation

| Library | Purpose |
|---|---|
| **react-hook-form** ^7.76.1 | Form state management |
| **@hookform/resolvers** ^5.4.0 | Zod integration |
| **zod** ^4.4.3 | Schema validation |
| **react-dropzone** ^15.0.0 | Drag-and-drop file upload |

### Infrastructure

| Component | Purpose |
|---|---|
| **Docker** + **Dockerfile** | Application container |
| **nginx** | Reverse proxy, SSL termination, HTTP/2 |
| **docker-compose** | Multi-service orchestration (app + nginx) |

---

## 3. System Architecture

### Component Diagram

```
┌─────────────┐     ┌──────────────┐     ┌──────────────────────┐     ┌──────────────┐
│   Browser   │ ──▶ │   nginx      │ ──▶ │   Next.js Server     │ ──▶ │   MongoDB    │
│  (Client)   │ ◀── │ (Reverse     │ ◀── │  (App Router)        │ ◀── │   (Atlas)    │
└─────────────┘     │  Proxy +     │     │                      │     └──────────────┘
                    │  SSL)        │     │  ┌──────────────────┐ │
                    └──────────────┘     │  │  Prisma ORM      │ │
                                         │  └──────────────────┘ │
                                         │                      │
                                         │  ┌──────────────────┐ │
                                         │  │  NextAuth v5     │ │
                                         │  │  (Credentials +  │ │
                                         │  │   JWT)           │ │
                                         │  └──────────────────┘ │
                                         │                      │
                                         │  ┌──────────────────┐ │
                                         │  │  File Storage    │ │
                                         │  │  ┌────────────┐  │ │
                                         │  │  │ Vercel     │  │ │
                                         │  │  │ Blob       │  │ │
                                         │  │  ├────────────┤  │ │
                                         │  │  │ Local FS   │  │ │
                                         │  │  └────────────┘  │ │
                                         │  └──────────────────┘ │
                                         └──────────────────────┘
```

### Authentication Flow

```
Login Form ──▶ Server Action ──▶ NextAuth authorize()
                                    │
                          ┌─────────┴──────────┐
                          ▼                    ▼
                   Credentials valid     Credentials invalid
                          │                    │
                          ▼                    ▼
                   JWT issued + set     Return error
                   session cookie       message
                          │
                          ▼
                   Redirect to /dashboard
```

### Database Schema (Prisma)

```
┌───────────┐     ┌───────────┐     ┌──────────────┐
│   User    │     │ Category  │     │     Pdf      │
├───────────┤     ├───────────┤     ├──────────────┤
│ id        │     │ id        │     │ id           │
│ name      │     │ name      │◀╌╌╌│ categoryId   │
│ email     │     │ slug      │     │ title        │
│ hashedPwd │     │ imagePath │     │ description  │
│ role      │◀╌╌╌│ createdAt │     │ year         │
│ createdAt │     │ updatedAt │     │ month        │
│ updatedAt │     └───────────┘     │ filePath     │
└───────────┘                       │ originalName │
        │                           │ fileSize     │
        │                           │ uploadedById │◀╌╌╌ User
        └───────────────────────────│ createdAt    │
                                    │ updatedAt    │
                                    └──────────────┘

┌───────────┐     ┌───────────┐     ┌───────────────────┐
│  Account  │     │  Session  │     │ VerificationToken │
│ (NextAuth)│     │ (NextAuth)│     │   (NextAuth)      │
└───────────┘     └───────────┘     └───────────────────┘

┌───────────┐
│  Setting  │
├───────────┤
│ key (PK)  │
│ value     │
│ updatedAt │
└───────────┘
```

### File Storage Strategy

```
uploadPdf(formData)
    │
    ├── BLOB_READ_WRITE_TOKEN set?
    │   ├── YES ──▶ Upload to Vercel Blob ──▶ Store blob URL in `filePath`
    │   └── NO  ──▶ Save to local `uploads/` ──▶ Store local path in `filePath`
    │
    ▼
Create Pdf record in database
```

---

## 4. System Flow

### 4.1 PDF Upload Flow

```
User selects file (drag & drop or file picker)
    │
    ▼
Upload Zone (client component) — step 1 of 3
    │ File selected
    ▼
Metadata form — step 2 of 3
    │ Title, Category, Year, Month, Description
    ▼
Upload & Progress — step 3 of 3
    │ XMLHttpRequest with progress tracking
    ▼
POST /api/pdf/create (Route Handler)
    │
    ├── Authenticate via auth()
    ├── Verify file type & size limits
    ├── Upload file to Vercel Blob (or local)
    ├── Create Pdf record in database via Prisma
    └── Return success response
    │
    ▼
Client redirects to /pdfs/[newId]
Server revalidates affected paths
```

### 4.2 PDF View / Download Flow

```
User clicks PDF card or link
    │
    ▼
GET /browse/pdfs/[id] (Server Component)
    │
    ├── Fetch Pdf + Category from Prisma (public)
    ├── Render iframe viewer with src="/api/pdf/[id]/download"
    └── Show metadata panel
    │
    ▼
Browser requests /api/pdf/[id]/download
    │
    ├── Fetch Pdf record from Prisma
    ├── Determine storage type (blob URL or local path)
    ├── Blob: Redirect (307) to blob URL
    ├── Local: Read file, stream with Content-Type: application/pdf
    └── Display inline in iframe
```

### 4.3 Authentication Flow

```
GET /dashboard (or any protected route)
    │
    ▼
NextAuth middleware checks session
    │
    ├── No valid JWT ──▶ Redirect to /login
    │
    ▼
POST /login (LoginForm → loginAction Server Action)
    │
    ├── Validate email + password against database
    ├── Compare with bcrypt (hashedPassword)
    ├── Sign in via NextAuth credentials provider
    └── On success: redirect to /dashboard
    │
    ▼
Server Components call auth() to get session
Route Handlers call auth() to verify permissions
```

### 4.4 Search Flow

```
GET /browse/search?q=...&category=...&year=...&month=...
    │
    ▼
SearchForm (client) sends query params
    │
    ▼
Server Component receives searchParams
    │
    ├── Build Prisma where clause:
    │   ├── title contains query (case-insensitive)
    │   ├── categoryId filter (if selected)
    │   ├── year filter (if selected)
    │   └── month filter (if selected)
    │
    ├── Execute prisma.pdf.findMany() with includes
    │
    └── Render BrowsePdfGrid with results
```

### 4.5 Settings Update Flow

```
Admin navigates to /settings
    │
    ▼
Settings page loads current values via getCachedSettings()
    │
    ▼
Admin edits fields (General / Upload / Contact / Appearance / Landing tabs)
    │
    ▼
UpdateSettingsAction (Server Action)
    │
    ├── Validate user is admin (auth())
    ├── Upsert each setting key-value pair
    └── RevalidatePath('/settings')
```

---

## 5. User Flow

### 5.1 Public User (No Login)

```
Landing Page (/)
    │
    ├── ├── View hero section with site stats
    │   ├── Browse category showcase
    │   └── See recent PDFs
    │
    ├── Search (/browse/search)
    │   ├── Enter keywords
    │   ├── Filter by category / year / month
    │   └── Browse results grid
    │
    ├── Browse Categories (/browse/categories)
    │   ├── View all categories as cards
    │   └── Click a category → see PDFs in that category
    │
    └── View PDF (/browse/pdfs/[id])
        ├── See PDF metadata (title, category, year, month, description)
        ├── Preview PDF in iframe
        └── Click "Download" to download the file
```

### 5.2 Editor (Logged In)

```
Login (/login) ──▶ Dashboard (/dashboard)
    │
    ├── Dashboard
    │   ├── View statistics (total PDFs, categories, users)
    │   ├── Quick actions (upload PDF, manage PDFs)
    │   └── Recent PDFs list
    │
    ├── PDFs (/pdfs)
    │   ├── View all PDFs in table or card view
    │   ├── Filter by keyword / category / year / month
    │   ├── Click PDF → view detail with iframe
    │   ├── Edit metadata (title, description, category, year, month)
    │   └── Delete PDFs (own or if admin)
    │
    └── Upload PDF (/pdfs/upload)
        ├── Step 1: Select file (drag & drop or picker)
        ├── Step 2: Fill metadata (title, category, year, month, description)
        └── Step 3: Upload with progress bar
```

### 5.3 Admin (All Editor Capabilities Plus)

```
    ├── Categories (/categories)
    │   ├── View all categories
    │   ├── Create new category (name + optional image)
    │   ├── Edit category name / image
    │   └── Delete category (with confirmation)
    │
    ├── Admins (/admins)
    │   ├── View all users (editors + admins)
    │   ├── Create new user (name, email, password, role)
    │   └── Delete user
    │
    └── Settings (/settings)
        ├── General tab: site name, description, footer text
        ├── Upload tab: max file size, allowed file types
        ├── Contact tab: email, phone, address, Facebook, Line ID, map
        ├── Appearance tab: primary color, hero title
        └── Landing tab: hero content customization
```

---

## 6. Challenges & Solutions

### 6.1 MongoDB + Prisma Relationship Mapping

**Challenge:** MongoDB is document-based with no native JOINs. Prisma with MongoDB provider has limited relationship support compared to SQL providers.

**Solution:** Used embedded references (ObjectId strings) and Prisma's `@map` to handle one-to-many relationships (User → Pdf, Category → Pdf). Queries use Prisma's `include` to eagerly load related documents. All IDs follow MongoDB ObjectId format.

### 6.2 Dual File Storage Strategy

**Challenge:** The system must work both in development (no Vercel Blob token) and production (with Vercel Blob), requiring transparent fallback.

**Solution:** Abstracted storage behind a single `filePath` field. On download, the system checks whether the path is a blob URL (starts with `https://`) or a local path, then either redirects to the blob URL or streams the file from the local filesystem. Upload logic checks for `BLOB_READ_WRITE_TOKEN` at runtime.

### 6.3 Role-Based Access Control Across Multiple Layers

**Challenge:** Permissions must be enforced at middleware (route access), Server Components (data visibility), API routes (mutation authorization), and UI (button visibility).

**Solution:** Four-layer approach:
- **Middleware** (`proxy.ts`) — blocks unauthenticated access to protected routes
- **Server Actions** — call `auth()` and check `session.user.role` before mutations
- **API Routes** — same `auth()` check for AJAX endpoints
- **Client Components** — receive session data as props to conditionally render admin-only UI elements

### 6.4 Thai Language Support

**Challenge:** Thai characters require specific font loading, and MongoDB's default text search does not natively support Thai word segmentation.

**Solution:** Loaded `Noto_Sans_Thai` via `next/font` with `display: "swap"` and CSS variables. For search, used regex-based matching on title/description fields rather than MongoDB text indexes, since the dataset size is manageable. This avoids Thai word segmentation complexity.

### 6.5 File Upload Size Limits

**Challenge:** Large PDFs could exceed request body limits (default Next.js 4.5 MB) and cause poor UX during upload.

**Solution:** Implemented chunked upload monitoring via `XMLHttpRequest` with `upload.onprogress` event, displaying a real-time progress bar. Added configurable `maxFileSizeMB` setting (default 50 MB) checked both client-side (before upload) and server-side (during processing).

### 6.6 Server / Client Component Boundary

**Challenge:** Next.js App Router requires clear separation between Server and Client Components. Directly passing complex objects (like Prisma models with dates) across the boundary causes serialization errors.

**Solution:** All Prisma queries remain in Server Components. Data is passed as plain props (serializable objects). Client components are leaf nodes that handle interactivity (forms, modals, toggles). Server Actions handle mutations and call `revalidatePath()` to keep the UI fresh.

### 6.7 State Persistence Across Sessions

**Challenge:** User preferences (table vs. card view) should persist across sessions without a database round-trip.

**Solution:** Built a `usePersistedState` hook that syncs state to `localStorage`. The view toggle in the PDF list page uses this hook, so user preference is remembered locally without server involvement.

### 6.8 Responsive Layout with Sidebar Navigation

**Challenge:** The app shell must work on both desktop (expanded sidebar) and mobile (collapsed/hidden sidebar) while maintaining accessible navigation.

**Solution:** Used shadcn/ui's `Sidebar` component with `@base-ui/react` primitives. Desktop shows a collapsible sidebar with tree navigation. Mobile uses a sheet (slide-over) pattern. The responsive behavior is managed via the `use-mobile` hook that detects viewport width.

---

## 7. Future Roadmap

### Short-Term (Next 3 Months)

- **Full-Text Search** — Integrate MongoDB Atlas Search indexes for Thai-aware full-text search with better ranking and typo tolerance
- **Pagination** — Replace infinite-scroll with cursor-based pagination for large PDF collections (10,000+ records)
- **Bulk Upload** — Allow uploading multiple PDFs at once with batch metadata assignment
- **PDF Thumbnails** — Generate preview thumbnails on upload using a server-side PDF renderer

### Medium-Term (3-6 Months)

- **OAuth Providers** — Add Google/Microsoft login alongside credentials for university staff
- **Activity Log** — Track all user actions (upload, delete, edit) with timestamps and actor info
- **Email Notifications** — Notify editors when new PDFs are uploaded or changes are made
- **CDN Caching** — Cache popular PDFs at the edge via CDN (Vercel Edge or Cloudflare)
- **API Rate Limiting** — Protect public API routes from abuse

### Long-Term (6-12 Months)

- **Elasticsearch Integration** — Replace MongoDB search with dedicated Elasticsearch for advanced full-text search, faceted filtering, and Thai language analyzer support
- **Microservices Split** — Separate file upload service from the main Next.js app for independent scaling
- **Backup Automation** — Automated daily MongoDB dumps and file storage backups to cold storage (S3 Glacier / Backblaze B2)
- **Analytics Dashboard** — Track popular PDFs, search trends, and user engagement metrics
- **API Versioning** — Public REST API with versioning for third-party integrations
- **Mobile App** — Native mobile app (React Native) consuming the same API
- **Automatic PDF Metadata Extraction** — Extract title, author, and publication date from PDF metadata on upload
