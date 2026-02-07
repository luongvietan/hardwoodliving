# Story 7.1: Build Admin Data Views for Trades and Inquiries

**Epic:** 7-Data Export & Lead Management
**Story Key:** 7-1-build-admin-data-views-for-trades-and-inquiries
**Status:** ready-for-dev

## Story Requirements

### User Story

As an **admin**,
I want **to view lists of registered trades and contact inquiries**,
So that **I can manage leads and follow up with customers**.

### Acceptance Criteria

- [ ] **Given** I am logged in as an authenticated Admin
- [ ] **When** I navigate to the Admin Dashboard (e.g., `/admin/leads` or separate custom view)
- [ ] **Then** I see a list of recent Contact Inquiries
- [ ] **And** I see a list of registered Trade Users
- [ ] **And** I can click to view details of each record
- [ ] **And** unauthorized users cannot access this view
- [ ] **And** the interface is clean and easy to read

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

**Data Fetching:**
- Server Components fetching directly from Supabase (Service Role or Admin User RLS).

### Implementation Guide

1.  **Route:** `src/app/leads/page.tsx`. Proteced by Middleware (require Auth).
2.  **Fetch:** `supabase.from('inquiries').select('*')`.
3.  **UI:** Simple Table (Tailwind).

### File List
- [ ] src/app/leads/page.tsx
- [ ] src/components/admin/LeadsTable.tsx
- [ ] src/components/admin/TradesTable.tsx

### Tasks / Subtasks

- [ ] Create Protected Leads Page
- [ ] Implement Inquiries Table
- [ ] Implement Trades Table
- [ ] Verify Role Protection

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
