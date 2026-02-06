# Story 3.1: Build Product Catalog and Category Pages

**Epic:** 3-Product Catalog & Browsing
**Story Key:** 3-1-build-product-catalog-and-category-pages
**Status:** ready-for-dev

## Story Requirements

### User Story

As a **visitor**,
I want **to browse products organized by categories and subcategories**,
So that **I can find the type of product I'm looking for**.

### Acceptance Criteria

- [ ] **Given** products and categories exist in Sanity
- [ ] **When** a visitor navigates to the product catalog (`/products`)
- [ ] **Then** the page displays all product categories with category images and names
- [ ] **And** clicking a category navigates to the category page (`/categories/[slug]`)
- [ ] **And** the category page displays products in that category with thumbnail image, name, and price
- [ ] **And** minimum 6 products are shown per page, or all products if fewer exist in the category
- [ ] **And** subcategories are navigable within parent categories
- [ ] **And** the ProductGrid component arranges products: 1-column mobile, 2-column tablet, 3-4 column desktop
- [ ] **And** pages use ISR with on-demand revalidation

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
- [ ] src/app/products/page.tsx
- [ ] src/app/categories/[slug]/page.tsx
- [ ] src/components/products/ProductGrid.tsx

### Tasks / Subtasks

- [ ] Define GROQ queries for Categories and Category Products
- [ ] Create `ProductGrid` component
- [ ] Implement Catalog Page (`/products`)
- [ ] Implement Category Page (`/categories/[slug]`)
- [ ] Implement `generateStaticParams` for Category Page
- [ ] Verify Responsive Grid

### Change Log
- **2026-02-07**: Story created.
