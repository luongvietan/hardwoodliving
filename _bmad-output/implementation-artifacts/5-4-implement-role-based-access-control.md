# Story 5.4: Implement Role-Based Access Control

**Epic:** 5-Trade/Contractor Management
**Story Key:** 5-4-implement-role-based-access-control
**Status:** done

## Story Requirements

### User Story

As the **system**,
I want **to restrict access to specific pages and data based on user roles**,
So that **regular users cannot see trade info and trade users cannot see admin info**.

### Acceptance Criteria

- [x] **Given** different user types (Public, Trade, Admin)
- [x] **When** a user attempts to access a protected route
- [x] **Then** Admin routes (`/admin`) require Sanity Admin authentication
- [x] **And** Trade Dashboard (`/trades/dashboard`) requires Supabase Authenticated User
- [x] **And** Wholesale Products require Supabase Authenticated User
- [x] **And** Public pages are accessible to everyone
- [x] **And** unauthorized access attempts redirect to the appropriate login page

---

## Developer Operations Context

### Architecture & Technical Requirements

**Configuration:**
- `src/middleware.ts`: Route guards.

**Logic:**
- Sanity Studio (`/admin`) handles its own auth internally (via Sanity). No blocking needed from Next.js middleware usually, but can check.
- Trade Routes: Check Supabase session.

**Roles:**
- "Trade User" = Any Authenticated Supabase User (for this MVP).
- "Admin" = Sanity User (handled by Sanity).

### Implementation Guide

1.  **Middleware Update:**
    Ensure `src/middleware.ts` handles `/trades/dashboard/*` -> redirect to `/trades/login`.

2.  **Sanity:**
    `/admin` is client-side SPA. Authentication is managed by Sanity.

### Tasks / Subtasks

- [x] Update Middleware for Trade Routes
- [x] Verify Public Access to Catalog
- [x] Verify Restricted Access to Dashboard
- [x] Verify Admin layout (Sanity)

### File List
- [x] src/lib/supabase/middleware.ts (modified - added route protection logic)
- [x] src/lib/supabase/middleware.test.ts (new - 10 tests)

### Dev Agent Record

**Implementation Plan:**
- Updated Supabase middleware to check authentication for protected routes
- PROTECTED_ROUTES array: /trades/dashboard (and sub-paths)
- Unauthenticated users accessing protected routes → redirect to /trades/login
- Authenticated users accessing auth pages (login/register) → redirect to /trades/dashboard
- Admin routes (/admin) handled by Sanity's internal auth (no middleware blocking needed)
- Public routes (/, /products, /trades, etc.) remain accessible to all
- Wholesale product visibility already handled by getUserRole() from story 3-5

**Completion Notes:**
- 10 middleware tests pass (public access, protected redirect, auth page redirect, env checks)
- Full regression suite: 289/289 tests pass
- Three-tier access: Public (all visitors), Trade (authenticated Supabase users), Admin (Sanity users)

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

### Senior Developer Review (AI)
- **Reviewer**: Viet An
- **Date**: 2026-02-07
- **Outcome**: Approved
- All ACs verified. 10/10 middleware tests pass. Route protection correct.
- **Note (L2)**: Middleware runs on /admin routes unnecessarily (minor perf). Deferred to future optimization.
- **Note (L3)**: Wholesale product visibility uses query-level filtering (from story 3-5), not route protection. AC wording slightly inconsistent but implementation is correct.

### Change Log
- **2026-02-07**: Story created.
- **2026-02-07**: Implemented middleware route protection with 10 tests. Full regression: 289/289 pass.
- **2026-02-07**: Code review passed — status → done. Full regression: 293/293 pass.
