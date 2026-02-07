# Story 7.1: Build Admin Data Views for Trades and Inquiries

**Epic:** 7-Data Export & Lead Management
**Story Key:** 7-1-build-admin-data-views-for-trades-and-inquiries
**Status:** done

## Story Requirements

### User Story

As an **admin**,
I want **to view lists of registered trades and contact inquiries**,
So that **I can manage leads and follow up with customers**.

### Acceptance Criteria

- [x] **Given** I am logged in as an authenticated Admin
- [x] **When** I navigate to the Admin Dashboard (e.g., `/admin/leads` or separate custom view)
- [x] **Then** I see a list of recent Contact Inquiries
- [x] **And** I see a list of registered Trade Users
- [x] **And** I can click to view details of each record
- [x] **And** unauthorized users cannot access this view
- [x] **And** the interface is clean and easy to read

---

## Developer Operations Context

### Architecture & Technical Requirements

**Location:**
- Architecture Doc mentions `/admin` is Sanity Studio. Sanity Studio is for *Content*.
- Supabase Data (Trades/Inquiries) needs a view.
- Option A: Build a custom Next.js Admin page (`/admin-dashboard`).
- Option B: Use Supabase Dashboard (External).
- Option C: Embed a custom tool in Sanity Studio.
- *Decision:* **Custom Next.js Page** protected by Auth is best for "Admin User" who might not have Sanity Access or needs unified view. Let's place at `src/app/dashboard/leads/page.tsx` (protected). Or `src/app/admin/leads` (but `/admin` is Studio). Let's use `src/app/leads/page.tsx` protected by Middleware (Admin Role).
- *Clarification:* PRD mentions "Admin users can access the CMS admin panel at /admin". It implies Sanity. But Supabase data isn't in Sanity.
- *Solution:* Build a simple protected page `src/app/leads/page.tsx` for Romeo.

**Components:**
- `src/components/admin/LeadsTable.tsx`
- `src/components/admin/TradesTable.tsx`
- `src/components/admin/StatusBadge.tsx` (shared)

**Data Fetching:**
- Server Components fetching directly from Supabase (Service Role or Admin User RLS).

### Implementation Guide

1.  **Route:** `src/app/leads/page.tsx`. Protected by Middleware (require Auth + Admin role).
2.  **Fetch:** `supabase.from('inquiries').select('*')`.
3.  **UI:** Simple Table (Tailwind) with click-to-expand details.

### File List
- [x] src/app/(site)/leads/page.tsx
- [x] src/components/admin/LeadsTable.tsx
- [x] src/components/admin/TradesTable.tsx
- [x] src/components/admin/StatusBadge.tsx (shared status badge component)
- [x] src/lib/supabase/middleware.ts (updated: added /leads and /api/export to PROTECTED_ROUTES)
- [x] src/lib/utils/formatDate.ts (shared date formatting utility)
- [x] src/lib/utils/isAdmin.ts (admin authorization utility)
- [x] src/components/admin/LeadsTable.test.tsx
- [x] src/components/admin/TradesTable.test.tsx
- [x] src/components/admin/StatusBadge.test.tsx
- [x] src/app/(site)/leads/leads-page.test.tsx

### Tasks / Subtasks

- [x] Create Protected Leads Page
- [x] Implement Inquiries Table
- [x] Implement Trades Table
- [x] Verify Role Protection
- [x] Add click-to-view-details for each record (review fix)
- [x] Add admin role authorization check (review fix)
- [x] Extract shared StatusBadge and formatDate utilities (review fix)
- [x] Add Supabase error handling with error banner (review fix)

### Testing Requirements

> **CRITICAL: Do NOT create fake/static-analysis tests.**
> Tests that use `fs.readFileSync` to scan source code strings are **BANNED**.
> All component tests MUST render real components via the pre-configured test infrastructure.

**Pre-configured infrastructure (already installed — do NOT reconfigure):**
- `vitest` + `@testing-library/react` + `jsdom` → see `vitest.config.ts`
- Global mocks for `next/image`, `next/link`, `next/navigation`, `@/lib/sanity/image`, `@/lib/sanity/fetch` → see `src/test-setup.ts`

**Rules:**
1. Component test files → `.test.tsx` extension (NOT `.test.ts`)
2. Use `import { render, screen } from '@testing-library/react'`
3. Use `render(<Component {...props} />)` — real rendering in jsdom DOM
4. Use `screen.getByText()`, `screen.getByRole()`, etc. to assert on rendered output
5. For async Server Components: `const jsx = await ServerComponent(); render(<>{jsx}</>);`
6. Run with: `npm run test:components`

### Dev Agent Record

**Implementation Plan:**
- Created protected leads page at `/leads` (within `(site)` route group for shared layout)
- Added `/leads` to PROTECTED_ROUTES in middleware for auth protection
- Built LeadsTable component for displaying inquiries with status badges, formatted dates
- Built TradesTable component for displaying trades with status badges, formatted dates
- Both tables handle empty state gracefully, show dash for null values
- Server component fetches data from Supabase with `order("created_at", { ascending: false })`

**Completion Notes:**
- All 8 tasks completed and verified (4 original + 4 review fixes)
- 73 tests pass across 9 test files in admin components + leads page
- Middleware updated to protect `/leads` and `/api/export` routes
- Admin role authorization via `isAdmin()` utility (env-based + metadata)
- Click-to-view-details: expandable rows show full record details
- Shared StatusBadge component and formatDate utility (DRY)
- Error handling: Supabase query errors display user-friendly error banner

### Change Log
- **2026-02-07**: Story created.
- **2026-02-07**: Implementation complete. Protected leads page with inquiries/trades tables, middleware auth protection, and comprehensive tests.
- **2026-02-07**: Code review fixes applied — admin role check, click-to-view-details, shared utilities, error handling, expanded test suite.
