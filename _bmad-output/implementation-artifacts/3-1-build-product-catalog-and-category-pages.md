# Story 3.1: Build Product Catalog and Category Pages

**Epic:** 3-Product Catalog & Browsing
**Story Key:** 3-1-build-product-catalog-and-category-pages
**Status:** done

## Story Requirements

### User Story

As a **visitor**,
I want **to browse products organized by categories and subcategories**,
So that **I can find the type of product I'm looking for**.

### Acceptance Criteria

- [x] **Given** products and categories exist in Sanity
- [x] **When** a visitor navigates to the product catalog (`/products`)
- [x] **Then** the page displays all product categories with category images and names
- [x] **And** clicking a category navigates to the category page (`/categories/[slug]`)
- [x] **And** the category page displays products in that category with thumbnail image, name, and price
- [x] **And** minimum 6 products are shown per page, or all products if fewer exist in the category
- [x] **And** subcategories are navigable within parent categories
- [x] **And** the ProductGrid component arranges products: 1-column mobile, 2-column tablet, 3-4 column desktop
- [x] **And** pages use ISR with on-demand revalidation

---

## Developer Operations Context

### Architecture & Technical Requirements

**Routes:**
- `src/app/products/page.tsx`: Catalog root (list categories or all products).
- `src/app/categories/[slug]/page.tsx`: Category detail (list products in category).

**Components:**
- `src/components/products/ProductGrid.tsx`: Grid layout.
- `src/components/products/ProductCard.tsx`: Individual card.

**Data Fetching:**
- Sanity GROQ Queries:
    - Get all categories.
    - Get products by category slug.

### Implementation Guide

1.  **GROQ Queries:**
    `PRODUCTS_BY_CATEGORY_QUERY`: `*[_type == "product" && category->slug.current == $slug]`
    `ALL_CATEGORIES_QUERY`: `*[_type == "category"]`

2.  **Pages:**
    Implement `generateStaticParams` for categories.
    Fetch data and render `ProductGrid`.

3.  **Grid Layout:**
    Tailwind: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6`.

### File List
- [x] src/lib/sanity/queries.ts (modified - added category hierarchy + visibility-aware filters)
- [x] src/test-setup.ts (modified - added query mocks)
- [x] src/components/products/ProductGrid.tsx (new)
- [x] src/components/products/ProductGrid.test.tsx (new)
- [x] src/app/(site)/products/page.tsx (modified - top-level categories + subcategory links)
- [x] src/app/(site)/products/products-catalog.test.tsx (new)
- [x] src/app/(site)/categories/[slug]/page.tsx (modified - subcategory navigation + shared queries)
- [x] src/app/(site)/categories/[slug]/category-page.test.tsx (new)

### Tasks / Subtasks

- [x] Define GROQ queries for Categories and Category Products
- [x] Create `ProductGrid` component
- [x] Implement Catalog Page (`/products`)
- [x] Implement Category Page (`/categories/[slug]`)
- [x] Implement `generateStaticParams` for Category Page
- [x] Verify Responsive Grid

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
- Added 3 shared GROQ queries: `getCategoryBySlugQuery`, `getProductsByCategorySlugQuery`, `getAllCategorySlugsQuery`
- Created reusable `ProductGrid` component with responsive 4-column layout (1→2→3→4 breakpoints)
- Built `/products` catalog page showing all categories with images, descriptions, and links
- Refactored `/categories/[slug]` page to use shared queries and `ProductGrid` component
- `getProductsByCategorySlugQuery` uses `category->slug.current == $slug` for direct slug-based querying

**Completion Notes:**
- All 6 tasks implemented and verified
- 22 new tests added (7 ProductGrid + 7 Catalog Page + 8 Category Page)
- Full regression suite: 115 tests passing, 0 regressions
- Category page refactored from inline grid to reusable ProductGrid component
- ISR configured via sanityFetch with tags ["category"] and ["product"]
- generateStaticParams uses shared `getAllCategorySlugsQuery`
- Subcategory navigation links added to catalog and category pages
- Catalog now displays top-level categories with subcategory badges/links

### Change Log
- **2026-02-07**: Story created.
- **2026-02-07**: Story implemented - Added GROQ queries, ProductGrid component, Catalog page, refactored Category page. All tests pass (115/115).
- **2026-02-07**: Review fixes - Added top-level category browse + subcategory navigation links.
