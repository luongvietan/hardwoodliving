# Story 2.2: Display Featured Products on Homepage

**Epic:** 2-Homepage & Content Discovery
**Story Key:** 2-2-display-featured-products-on-homepage
**Status:** ready-for-dev

## Story Requirements

### User Story

As a **visitor**,
I want **to see highlighted featured products on the homepage**,
So that **I can quickly discover popular and recommended products**.

### Acceptance Criteria

- [ ] **Given** the homepage is built (Story 2.1) and products exist in Sanity with `isFeatured: true`
- [ ] **When** the homepage loads
- [ ] **Then** the FeaturedProducts section displays products marked as featured from Sanity
- [ ] **And** each featured product shows a thumbnail image, product name, and price
- [ ] **And** each featured product links to its product detail page (`/products/[slug]`)
- [ ] **And** the section updates dynamically when admin changes featured products in CMS
- [ ] **And** if no featured products exist, the section is hidden gracefully

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
- [ ] src/components/home/FeaturedProducts.tsx
- [ ] src/components/products/ProductCard.tsx

### Tasks / Subtasks

- [ ] Create `ProductCard` component
- [ ] Create `FeaturedProducts` section component
- [ ] Update/Create Sanity query for Featured Products
- [ ] Integrate into Homepage
- [ ] Verify navigation to Product Detail (even if 404 for now)
- [ ] Verify Empty State handling

### Change Log
- **2026-02-07**: Story created.
