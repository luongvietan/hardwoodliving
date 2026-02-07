# Story 8.3: Build Custom Error Pages

**Epic:** 8-SEO, Performance & Launch Readiness
**Story Key:** 8-3-build-custom-error-pages
**Status:** done

## Story Requirements

### User Story

As a **visitor**,
I want **helpful error pages when something goes wrong**,
So that **I can navigate back to content**.

### Acceptance Criteria

- [x] **Given** a 404 or 500 error occurs
- [x] **Then** a branded error page is displayed
- [x] **And** the page includes navigation links to Home and Products
- [x] **And** the design matches the site theme

---

## Developer Operations Context

### Architecture & Technical Requirements

**Files:**
- `src/app/not-found.tsx` (404).
- `src/app/error.tsx` (500/React Error).
- `src/app/global-error.tsx`.

### Implementation Guide

1.  **Not Found:**
    Branded UI. "Page not found". Search or Links.

2.  **Error:**
    "Something went wrong". Try Again button.

### File List
- [x] src/app/not-found.tsx (new)
- [x] src/app/error.tsx (new)
- [x] src/app/global-error.tsx (new)
- [x] src/app/not-found.test.tsx (new)
- [x] src/app/error.test.tsx (new)
- [x] src/app/global-error.test.tsx (new — added during code review)

### Tasks / Subtasks

- [x] Create Custom 404 Page
- [x] Create Error Boundary
- [x] Verify Behavior

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

**Implementation Notes:**
- Created branded 404 page with Go Home and Browse Products links, amber theme
- Created error boundary with Try Again button and Go Home link
- Created global-error.tsx as fallback for root layout errors (inline styles for independence)
- All 6 tests pass (3 not-found + 3 error)

### Change Log
- **2026-02-07**: Story created.
- **2026-02-07**: Implementation complete. 404, error, and global-error pages created with tests.
- **2026-02-07**: Code review fixes applied: Added "Browse Products" link to error.tsx (AC compliance), added homepage link to global-error.tsx (navigation fallback), created global-error.test.tsx (4 tests).
