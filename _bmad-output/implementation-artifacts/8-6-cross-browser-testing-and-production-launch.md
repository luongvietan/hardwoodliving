# Story 8.6: Cross-Browser Testing and Production Launch

**Epic:** 8-SEO, Performance & Launch Readiness
**Story Key:** 8-6-cross-browser-testing-and-production-launch
**Status:** ready-for-dev

## Story Requirements

### User Story

As a **business owner**,
I want **the site deployed to production and verified**,
So that **customers can start using the new platform**.

### Acceptance Criteria

- [ ] **Given** all features are complete and tested on staging
- [ ] **When** the code is merged to main
- [ ] **Then** it deploys to `hardwoodliving.com`
- [ ] **And** it works on Chrome, Safari, Firefox, Edge, and Mobile browsers
- [ ] **And** SSL is active
- [ ] **And** the site is live

---

## Developer Operations Context

### Architecture & Technical Requirements

**Launch Steps:**
1.  Merge Staging to Main.
2.  Verify Vercel Deployment.
3.  Final QA on Production Domain.

### Implementation Guide

1.  **Testing:** BrowserStack or manual device testing.
2.  **Launch:** Git Merge.

### Tasks / Subtasks

- [ ] Cross-browser Verification
- [ ] Mobile Verification
- [ ] Merge Staging -> Main
- [ ] Verify Production Launch

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
