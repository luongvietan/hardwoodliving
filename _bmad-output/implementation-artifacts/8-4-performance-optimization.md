# Story 8.4: Performance Optimization

**Epic:** 8-SEO, Performance & Launch Readiness
**Story Key:** 8-4-performance-optimization
**Status:** ready-for-dev

## Story Requirements

### User Story

As a **visitor**,
I want **the site to load instantly**,
So that **I don't get frustrated and leave**.

### Acceptance Criteria

- [ ] **Given** the site is feature complete
- [ ] **When** checked against Core Web Vitals
- [ ] **Then** LCP < 2.5s
- [ ] **And** CLS < 0.1
- [ ] **And** Images are properly sized and lazy loaded
- [ ] **And** Fonts are optimized (next/font)

---

## Developer Operations Context

### Architecture & Technical Requirements

**Optimization:**
- `next/image` usage audit.
- `next/font` (Google Fonts).
- Dynamic Imports for heavy components (`ProductGallery`?).

### Implementation Guide

1.  **Audit:** Run Lighthouse.
2.  **Fixes:** Adjust image sizes/priorities. Optimize font loading.

### Tasks / Subtasks

- [ ] Audit Image Usage
- [ ] Verify Font Optimization
- [ ] Implement Dynamic Imports if needed
- [ ] Validate Lighthouse Score

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
