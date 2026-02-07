# Story 8.1: Implement Technical SEO

**Epic:** 8-SEO, Performance & Launch Readiness
**Story Key:** 8-1-implement-technical-seo
**Status:** ready-for-dev

## Story Requirements

### User Story

As a **business owner**,
I want **my site to be indexable and optimized for search engines**,
So that **customers can find us organically**.

### Acceptance Criteria

- [ ] **Given** the site content is populated
- [ ] **When** a crawler visits the site
- [ ] **Then** a `sitemap.xml` is available listing all pages and products
- [ ] **And** a `robots.txt` controls crawling access
- [ ] **And** every page has unique Title and Meta Description
- [ ] **And** Canonical URLs are self-referencing
- [ ] **And** Semantic HTML (H1-H6) is used correctly

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
- [ ] src/app/sitemap.ts
- [ ] src/app/robots.ts

### Tasks / Subtasks

- [ ] Create Dynamic Sitemap
- [ ] Create Robots.txt
- [ ] Validated Metadata Implementation
- [ ] Verify HTML Semantics

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
