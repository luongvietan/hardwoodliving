# Story 7.2: Implement Filtering, Sorting, and Data Export

**Epic:** 7-Data Export & Lead Management
**Story Key:** 7-2-implement-filtering-sorting-and-data-export
**Status:** done

## Story Requirements

### User Story

As an **admin**,
I want **to filter leads and export them to CSV**,
So that **I can import them into other tools or analyze them in Excel**.

### Acceptance Criteria

- [x] **Given** I am on the Leads view (Story 7.1)
- [x] **When** I click "Export to CSV"
- [x] **Then** a CSV file containing the currently filtered data is downloaded
- [x] **And** I can filter the list by status (New, Contacted) or Date
- [x] **And** sorting by Date (Newest First) is default

---

## Developer Operations Context

### Architecture & Technical Requirements

**Components:**
- `src/components/admin/ExportButton.tsx` (Client Comp).
- `src/components/admin/StatusFilter.tsx` (Client Comp).
- `src/components/admin/DateFilter.tsx` (Client Comp).

**API:**
- `src/app/api/export/route.ts` — Server-side CSV generation.
- Architecture Doc mentions `/api/export`. Server-side stream for large datasets.
- Admin-only access enforced via `isAdmin()` utility.

### Implementation Guide

1.  **API Route:**
    `GET /api/export?type=trades`.
    Auth + admin check.
    Fetch all data.
    Convert to CSV (manual with proper escaping + UTF-8 BOM).
    Return with `Content-Type: text/csv` and `Content-Disposition: attachment`.

2.  **UI:**
    ExportButton linking to `/api/export?type=trades` with download filename.
    StatusFilter dropdown for status-based filtering.
    DateFilter with date range inputs.

### File List
- [x] src/app/api/export/route.ts
- [x] src/components/admin/ExportButton.tsx
- [x] src/components/admin/StatusFilter.tsx
- [x] src/components/admin/DateFilter.tsx (new: date range filter)
- [x] src/components/admin/InquiriesSection.tsx
- [x] src/components/admin/TradesSection.tsx
- [x] src/app/(site)/leads/page.tsx (updated: uses section components with filtering/export)
- [x] src/lib/supabase/middleware.ts (updated: added /api/export to PROTECTED_ROUTES)
- [x] src/components/admin/ExportButton.test.tsx
- [x] src/components/admin/StatusFilter.test.tsx (new: dedicated tests)
- [x] src/components/admin/DateFilter.test.tsx (new: dedicated tests)
- [x] src/components/admin/InquiriesSection.test.tsx
- [x] src/components/admin/TradesSection.test.tsx
- [x] src/app/(site)/leads/leads-page.test.tsx (updated: tests for export buttons, filters, date filters)
- [x] package.json (updated: userEvent dependency)
- [x] package-lock.json (updated: lockfile)

### Tasks / Subtasks

- [x] Create Export API Route
- [x] Implement CSV conversion
- [x] Add Export Buttons to Leads Page
- [x] Test Download
- [x] Add date range filtering (review fix)
- [x] Add admin authorization to export API (review fix)
- [x] Add /api/export to PROTECTED_ROUTES (review fix)
- [x] Add UTF-8 BOM to CSV export (review fix)
- [x] Add error logging to export API (review fix)
- [x] Add download filename to ExportButton (review fix)
- [x] Add StatusFilter dedicated tests (review fix)

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
- Created server-side Export API Route at `/api/export` with query params (`type=inquiries|trades`, optional `status`)
- Implemented CSV conversion with proper escaping for commas, quotes, and newlines
- Built ExportButton client component linking to API with current filter params
- Built StatusFilter dropdown component for client-side filtering
- Built DateFilter date range component for client-side date filtering
- Created InquiriesSection and TradesSection client wrapper components with filtering + export
- Updated LeadsPage to use new section components
- Data sorted by newest first (default) via Supabase `order("created_at", { ascending: false })`
- Export returns proper CSV headers (`Content-Type: text/csv`, `Content-Disposition: attachment`)
- UTF-8 BOM included for Excel Unicode compatibility

**Completion Notes:**
- All 11 tasks completed and verified (4 original + 7 review fixes)
- 73 tests pass across 9 test files (components + page integration)
- Export supports filtered data via status query param
- Date range filtering with start/end date inputs
- Admin-only access enforced via `isAdmin()` check in API route
- `/api/export` added to PROTECTED_ROUTES in middleware
- Clean, accessible UI with aria labels on filter dropdowns and date inputs
- Error logging added to export API for server-side debugging

### Change Log
- **2026-02-07**: Story created.
- **2026-02-07**: Implementation complete. Export API route, CSV conversion, status filtering, and export buttons integrated into leads page.
- **2026-02-07**: Code review fixes applied — date filtering, admin auth, BOM, error logging, download filename, dedicated filter tests, PROTECTED_ROUTES updated.
