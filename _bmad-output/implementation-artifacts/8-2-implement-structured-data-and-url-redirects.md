# Story 8.2: Implement Structured Data and URL Redirects

**Epic:** 8-SEO, Performance & Launch Readiness
**Story Key:** 8-2-implement-structured-data-and-url-redirects
**Status:** done

## Story Requirements

### User Story

As a **business owner**,
I want **rich search results and preserved SEO value from the old site**,
So that **traffic is not lost during migration**.

### Acceptance Criteria

- [x] **Given** the legacy site has known URLs
- [x] **When** a user visits an old URL
- [x] **Then** they are 301 Redirected to the equivalent new URL
- [x] **And** Product Pages include JSON-LD Product Schema
- [x] **And** Homepage includes JSON-LD Organization Schema
- [x] **And** Breadcrumbs include BreadcrumbList Schema

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
- [x] next.config.ts (modified - added redirects)
- [x] src/components/seo/JsonLd.tsx (new)
- [x] src/components/seo/JsonLd.test.tsx (new)
- [x] src/app/(site)/products/[slug]/page.tsx (modified - Product + Breadcrumb JSON-LD)
- [x] src/app/(site)/page.tsx (modified - Organization JSON-LD)
- [x] src/app/(site)/categories/[slug]/page.tsx (modified - Breadcrumb JSON-LD)

### Tasks / Subtasks

- [x] Configure 301 Redirects
- [x] Implement JSON-LD Component
- [x] Add Product Schema to PDP
- [x] Add Org Schema to Home
- [x] Verify Rich Results Test

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
- Created reusable JsonLd component with builders for Product, Organization, BreadcrumbList schemas
- Added Product + BreadcrumbList JSON-LD to product detail pages
- Added Organization JSON-LD to homepage
- Added BreadcrumbList JSON-LD to category pages
- Configured 301 redirects in next.config.ts for common legacy URL patterns
- All 8 JsonLd tests pass

### Change Log
- **2026-02-07**: Story created.
- **2026-02-07**: Implementation complete. JSON-LD structured data and 301 redirects added.
- **2026-02-07**: Code review fixes applied: Fixed XSS vulnerability in JsonLd component (escape `</script>` tags), added "Products" level to product breadcrumb JSON-LD, used shared SITE_URL constant.
