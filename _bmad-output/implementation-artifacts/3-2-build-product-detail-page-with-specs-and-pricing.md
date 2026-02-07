# Story 3.2: Build Product Detail Page with Specs and Pricing

**Epic:** 3-Product Catalog & Browsing
**Story Key:** 3-2-build-product-detail-page-with-specs-and-pricing
**Status:** ready-for-dev

## Story Requirements

### User Story

As a **visitor**,
I want **to see complete product information including description, specifications, and price**,
So that **I can evaluate whether the product meets my needs**.

### Acceptance Criteria

- [ ] **Given** products exist in Sanity with full details
- [ ] **When** a visitor navigates to a product detail page (`/products/[slug]`)
- [ ] **Then** the page displays the product name, full description, and technical specifications (ProductSpecs component)
- [ ] **And** the sale price is displayed publicly on the page (ProductPrice component)
- [ ] **And** the page uses a clean URL format (`/products/[slug]`)
- [ ] **And** if the product slug does not exist, a 404 page is displayed
- [ ] **And** the page uses ISR with on-demand revalidation
- [ ] **And** the page includes CMS-editable SEO metadata

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
- [ ] src/app/products/[slug]/page.tsx
- [ ] src/components/products/ProductSpecs.tsx
- [ ] src/components/products/ProductPrice.tsx

### Tasks / Subtasks

- [ ] Define `PRODUCT_BY_SLUG_QUERY`
- [ ] Create `ProductSpecs` component
- [ ] Create `ProductPrice` component
- [ ] Implement `src/app/products/[slug]/page.tsx`
- [ ] Implement `generateStaticParams`
- [ ] Implement `generateMetadata`
- [ ] Validate 404 handling

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
