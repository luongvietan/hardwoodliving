# Story 8.2: Implement Structured Data and URL Redirects

**Epic:** 8-SEO, Performance & Launch Readiness
**Story Key:** 8-2-implement-structured-data-and-url-redirects
**Status:** ready-for-dev

## Story Requirements

### User Story

As a **business owner**,
I want **rich search results and preserved SEO value from the old site**,
So that **traffic is not lost during migration**.

### Acceptance Criteria

- [ ] **Given** the legacy site has known URLs
- [ ] **When** a user visits an old URL
- [ ] **Then** they are 301 Redirected to the equivalent new URL
- [ ] **And** Product Pages include JSON-LD Product Schema
- [ ] **And** Homepage includes JSON-LD Organization Schema
- [ ] **And** Breadcrumbs include BreadcrumbList Schema

---

## Developer Operations Context

### Architecture & Technical Requirements

**Redirects:**
- `next.config.ts`: `async redirects()`. Map old list (provided by client/Romeo) to new.
- *Note:* If list is huge, use Middleware or Sanity Redirects plugin. MVP: `next.config.ts` if < 1000.

**Structured Data:**
- `src/components/seo/JsonLd.tsx`.
- Render `<script type="application/ld+json">`.

### Implementation Guide

1.  **Redirects:**
    Get list of top legacy URLs. Add to config.

2.  **Schema:**
    Product Schema: `name`, `description`, `image`, `offers` (Price).
    Org Schema: `name`, `url`, `logo`.

### File List
- [ ] next.config.ts
- [ ] src/components/seo/JsonLd.tsx

### Tasks / Subtasks

- [ ] Configure 301 Redirects
- [ ] Implement JSON-LD Component
- [ ] Add Product Schema to PDP
- [ ] Add Org Schema to Home
- [ ] Verify Rich Results Test

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
