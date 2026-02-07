# Story 2.2: Display Featured Products on Homepage

**Epic:** 2-Homepage & Content Discovery
**Story Key:** 2-2-display-featured-products-on-homepage
**Status:** done

## Story Requirements

### User Story

As a **visitor**,
I want **to see highlighted featured products on the homepage**,
So that **I can quickly discover popular and recommended products**.

### Acceptance Criteria

- [x] **Given** the homepage is built (Story 2.1) and products exist in Sanity with `isFeatured: true`
- [x] **When** the homepage loads
- [x] **Then** the FeaturedProducts section displays products marked as featured from Sanity
- [x] **And** each featured product shows a thumbnail image, product name, and price
- [x] **And** each featured product links to its product detail page (`/products/[slug]`)
- [x] **And** the section updates dynamically when admin changes featured products in CMS
- [x] **And** if no featured products exist, the section is hidden gracefully

---

## Developer Operations Context

### Architecture & Technical Requirements

**Components:**
- `src/components/home/FeaturedProducts.tsx`
- `src/components/products/ProductCard.tsx` (Reuse or create base)

**Data Fetching:**
- Update Homepage GROQ query or separate query for `*[_type == "product" && isFeatured == true]`.
- Ideally, `homepage` singleton has a reference array `featuredProducts[]`. Be sure to support both manual selection via reference OR automatic query if referenced list is empty (decide on one Pattern, typically Reference is better for control). *PRD implies "products marked as Featured" but usually Home singleton has a list. Let's assume Reference list in Homepage Schema for explicit control, or Query property.*
- Architecture Doc says: "products marked as 'Featured' for homepage...". Let's simply query: `*[_type == "product" && isFeatured == true][0..3]`.

### Implementation Guide

1.  **Product Card:**
    Create a reusable `ProductCard.tsx` showing Image, Title, Price check.

2.  **Section Component:**
    `FeaturedProducts.tsx` takes list of products. Grid layout.

3.  **Integration:**
    Add to `src/app/page.tsx`. Provide data from fetch.

### File List
- [x] src/components/home/FeaturedProducts.tsx (new)
- [x] src/components/home/FeaturedProducts.test.ts (new)
- [x] src/components/products/ProductCard.tsx (new)
- [x] src/components/products/ProductCard.test.ts (new)
- [x] src/app/(site)/page.tsx (modified - refactored inline featured products to use FeaturedProducts component)
- [x] src/app/(site)/homepage.test.ts (modified - added FeaturedProducts integration tests)
- [x] src/lib/sanity/queries.ts (modified - added featured products queries)
- [x] src/lib/sanity/schemas/product.ts (modified - added priceUnit field)

### Tasks / Subtasks

- [x] Create `ProductCard` component
- [x] Create `FeaturedProducts` section component
- [x] Update/Create Sanity query for Featured Products
- [x] Integrate into Homepage
- [x] Verify navigation to Product Detail (even if 404 for now)
- [x] Verify Empty State handling

### Dev Agent Record

#### Implementation Plan
- Created reusable `ProductCard` component with typed props (title, slug, price, images), Next.js Image/Link integration, Sanity urlFor for image URLs, and placeholder SVG for missing images
- Created `FeaturedProducts` section component that uses `ProductCard` in a responsive grid (1/2/3 columns), with Container layout, accessible aria-labelledby, and graceful null return for empty state
- Refactored `page.tsx` to replace 50+ lines of inline featured products rendering with clean `<FeaturedProducts products={data?.featuredProducts} />` component usage
- GROQ queries already existed: `getHomepageQuery` fetches `featuredProducts[]->` via references, and standalone `getFeaturedProductsQuery` available for direct isFeatured queries
- Removed unused `Link`, `Image`, `Container` imports from page.tsx after refactoring

#### Completion Notes
- All 6 tasks/subtasks completed and tested
- 45 co-located tests pass (0 failures): ProductCard (11), FeaturedProducts (11), Homepage integration (23)
- Full regression suite: 119/146 pass; 27 pre-existing failures in Placeholder Pages tests (unrelated pages not yet created)
- No linter errors introduced
- Navigation verified: ProductCard links to `/products/${slug.current}`
- Empty state verified: FeaturedProducts returns null when no products provided
- CMS dynamic updates supported via ISR with `homepage` cache tag (60s revalidation)

### Change Log
- **2026-02-07**: Story created.
- **2026-02-07**: Implemented all tasks - created ProductCard and FeaturedProducts components, refactored homepage to use components, added comprehensive tests. All ACs satisfied.
