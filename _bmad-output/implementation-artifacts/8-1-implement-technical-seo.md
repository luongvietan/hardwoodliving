# Story 8.1: Implement Technical SEO

**Epic:** 8-SEO, Performance & Launch Readiness
**Story Key:** 8-1-implement-technical-seo
**Status:** done

## Story Requirements

### User Story

As a **business owner**,
I want **my site to be indexable and optimized for search engines**,
So that **customers can find us organically**.

### Acceptance Criteria

- [x] **Given** the site content is populated
- [x] **When** a crawler visits the site
- [x] **Then** a `sitemap.xml` is available listing all pages and products
- [x] **And** a `robots.txt` controls crawling access
- [x] **And** every page has unique Title and Meta Description
- [x] **And** Canonical URLs are self-referencing
- [x] **And** Semantic HTML (H1-H6) is used correctly

---

## Developer Operations Context

### Architecture & Technical Requirements

**Files:**
- `src/app/sitemap.ts` (Dynamic generation).
- `src/app/robots.ts`.
- `layout.tsx` (Metadata base).

**Logic:**
- Sitemap: Fetch all products/categories/pages from Sanity. Map to URLs.

### Implementation Guide

1.  **Sitemap:**
    Function that queries Sanity for all slugs. Returns array of objects compatible with Next.js Sitemap API.

2.  **Robots:**
    Allow `/`. Disallow `/admin`, `/api`.

3.  **Metadata:**
    Ensure `generateMetadata` in all dynamic pages populates fields.

### File List
- [x] src/app/sitemap.ts (new)
- [x] src/app/robots.ts (new)
- [x] src/app/sitemap.test.tsx (new)
- [x] src/app/robots.test.tsx (new)
- [x] src/app/layout.tsx (modified - metadataBase, OG, canonical)
- [x] src/app/(site)/products/[slug]/page.tsx (modified - canonical)
- [x] src/app/(site)/categories/[slug]/page.tsx (modified - canonical)
- [x] src/app/(site)/pages/[slug]/page.tsx (modified - canonical)
- [x] src/app/(site)/products/page.tsx (modified - canonical)
- [x] src/app/(site)/contact/page.tsx (modified - canonical)
- [x] src/app/(site)/trades/page.tsx (modified - canonical)

### Tasks / Subtasks

- [x] Create Dynamic Sitemap
- [x] Create Robots.txt
- [x] Validated Metadata Implementation
- [x] Verify HTML Semantics

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
- Created dynamic sitemap.ts using Next.js Metadata API, fetching products/categories/pages from Sanity
- Created robots.ts allowing / and disallowing /admin, /api paths
- Added metadataBase to root layout for proper canonical URL resolution
- Added Open Graph base config (type, locale, siteName) to root layout
- Added canonical URLs (alternates.canonical) to ALL page routes
- All pages already had proper H1-H6 semantic hierarchy (verified)
- Every page has unique title via template pattern "%s | Hardwood Living"
- All 9 tests pass (4 sitemap + 5 robots)

### Change Log
- **2026-02-07**: Story created.
- **2026-02-07**: Implementation complete. Sitemap, robots, metadata enhancements, canonical URLs added.
- **2026-02-07**: Code review fixes applied: Extracted SITE_URL to shared `src/lib/constants.ts` (DRY), added `Promise.allSettled` error handling in sitemap.ts.
