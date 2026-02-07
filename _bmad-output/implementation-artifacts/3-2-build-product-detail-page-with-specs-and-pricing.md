# Story 3.2: Build Product Detail Page with Specs and Pricing

**Epic:** 3-Product Catalog & Browsing
**Story Key:** 3-2-build-product-detail-page-with-specs-and-pricing
**Status:** done

## Story Requirements

### User Story

As a **visitor**,
I want **to see complete product information including description, specifications, and price**,
So that **I can evaluate whether the product meets my needs**.

### Acceptance Criteria

- [x] **Given** products exist in Sanity with full details
- [x] **When** a visitor navigates to a product detail page (`/products/[slug]`)
- [x] **Then** the page displays the product name, full description, and technical specifications (ProductSpecs component)
- [x] **And** the sale price is displayed publicly on the page (ProductPrice component)
- [x] **And** the page uses a clean URL format (`/products/[slug]`)
- [x] **And** if the product slug does not exist, a 404 page is displayed
- [x] **And** the page uses ISR with on-demand revalidation
- [x] **And** the page includes CMS-editable SEO metadata

---

## Developer Operations Context

### Architecture & Technical Requirements

**Route:**
- `src/app/products/[slug]/page.tsx`

**Components:**
- `src/components/products/ProductSpecs.tsx`
- `src/components/products/ProductPrice.tsx`

**Data Fetching:**
- Sanity GROQ: Get product by slug.

### Implementation Guide

1.  **GROQ Query:**
    `PRODUCT_BY_SLUG_QUERY`: `*[_type == "product" && slug.current == $slug][0]`

2.  **Page:**
    Fetch product.
    Render details, specs, price.
    Handle 404 (`notFound()`).

3.  **SEO:**
    `generateMetadata` using product title/description.

### File List
- [x] src/lib/sanity/queries.ts (modified - added public-only product slugs)
- [x] src/test-setup.ts (modified - added query mocks)
- [x] src/components/products/ProductSpecs.tsx (new)
- [x] src/components/products/ProductSpecs.test.tsx (new)
- [x] src/components/products/ProductPrice.tsx (new)
- [x] src/components/products/ProductPrice.test.tsx (new)
- [x] src/app/(site)/products/[slug]/page.tsx (modified - visibility-aware caching + public slugs)
- [x] src/app/(site)/products/[slug]/product-detail.test.tsx (new)

### Tasks / Subtasks

- [x] Define `PRODUCT_BY_SLUG_QUERY`
- [x] Create `ProductSpecs` component
- [x] Create `ProductPrice` component
- [x] Implement `src/app/products/[slug]/page.tsx`
- [x] Implement `generateStaticParams`
- [x] Implement `generateMetadata`
- [x] Validate 404 handling

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

**Implementation Plan:**
- Added `getAllProductSlugsQuery` to shared queries
- Created `ProductSpecs` component: definition list (dl/dt/dd) for technical specs
- Created `ProductPrice` component: prominent price display with priceUnit support
- Refactored product detail page to use extracted components and shared queries
- Added breadcrumb navigation with aria-label for accessibility
- priceUnit now uses CMS value instead of hardcoded "/ sq ft"

**Completion Notes:**
- All 7 tasks implemented and verified
- 29 new tests added (6 ProductSpecs + 7 ProductPrice + 16 Product Detail Page)
- Full regression suite: 144 tests passing, 0 regressions
- Product page fully supports: specs, price, images, thumbnails, breadcrumbs, 404, SEO metadata
- ISR configured via sanityFetch with tags ["product"]
- Public-only static params used to avoid leaking wholesale slugs
- Visibility-aware cache set to prevent cross-role content leakage

### Change Log
- **2026-02-07**: Story created.
- **2026-02-07**: Story implemented - Created ProductSpecs, ProductPrice components, refactored product detail page. All tests pass (144/144).
- **2026-02-07**: Review fixes - Public-only static params + visibility-aware caching.
