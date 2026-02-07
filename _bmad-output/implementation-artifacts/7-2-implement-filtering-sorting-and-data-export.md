# Story 7.2: Implement Filtering, Sorting, and Data Export

**Epic:** 7-Data Export & Lead Management
**Story Key:** 7-2-implement-filtering-sorting-and-data-export
**Status:** ready-for-dev

## Story Requirements

### User Story

As an **admin**,
I want **to filter leads and export them to CSV**,
So that **I can import them into other tools or analyze them in Excel**.

### Acceptance Criteria

- [ ] **Given** I am on the Leads view (Story 7.1)
- [ ] **When** I click "Export to CSV"
- [ ] **Then** a CSV file containing the currently filtered data is downloaded
- [ ] **And** I can filter the list by status (New, Contacted) or Date
- [ ] **And** sorting by Date (Newest First) is default

---

## Developer Operations Context

### Architecture & Technical Requirements

**Components:**
- `src/components/admin/ExportButton.tsx` (Client Comp).

**API:**
- `src/app/api/export/route.ts` OR Client-side CSV generation.
- Client-side is easier for filtering if data is already loaded.
- Architecture Doc mentions `/api/export`. Let's implement Server-Side Stream for large datasets.

**Server Action:**
- `exportTradesCSV`, `exportInquiriesCSV`. Return string/blob?
- Actually, API Route is better for file download response headers.

### Implementation Guide

1.  **API Route:**
    `GET /api/export?type=trades`.
    Fetch all data.
    Convert to CSV (library: `csv-stringify` or manual).
    Return with `Content-Type: text/csv` and `Content-Disposition: attachment`.

2.  **UI:**
    Button linking to `/api/export?type=trades`.

### File List
- [ ] src/app/api/export/route.ts

### Tasks / Subtasks

- [ ] Create Export API Route
- [ ] Implement CSV conversion
- [ ] Add Export Buttons to Leads Page
- [ ] Test Download

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

### Change Log
- **2026-02-07**: Story created.
