# Story 8.3: Build Custom Error Pages

**Epic:** 8-SEO, Performance & Launch Readiness
**Story Key:** 8-3-build-custom-error-pages
**Status:** ready-for-dev

## Story Requirements

### User Story

As a **visitor**,
I want **helpful error pages when something goes wrong**,
So that **I can navigate back to content**.

### Acceptance Criteria

- [ ] **Given** a 404 or 500 error occurs
- [ ] **Then** a branded error page is displayed
- [ ] **And** the page includes navigation links to Home and Products
- [ ] **And** the design matches the site theme

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
- [ ] src/app/not-found.tsx
- [ ] src/app/error.tsx

### Tasks / Subtasks

- [ ] Create Custom 404 Page
- [ ] Create Error Boundary
- [ ] Verify Behavior

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
