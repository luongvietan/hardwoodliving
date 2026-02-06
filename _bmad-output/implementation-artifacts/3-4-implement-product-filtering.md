# Story 3.4: Implement Product Filtering

**Epic:** 3-Product Catalog & Browsing
**Story Key:** 3-4-implement-product-filtering
**Status:** ready-for-dev

## Story Requirements

### User Story

As a **visitor**,
I want **to filter products by category and product type**,
So that **I can narrow my search to find exactly what I need**.

### Acceptance Criteria

- [ ] **Given** the product catalog page or category page is loaded
- [ ] **When** the visitor interacts with the ProductFilter component
- [ ] **Then** products can be filtered by category and product type
- [ ] **And** the product grid updates to show only matching products
- [ ] **And** active filters are visually indicated
- [ ] **And** filters can be cleared to show all products again
- [ ] **And** the filter component is responsive and usable on mobile devices
- [ ] **And** the ProductFilter is a Client Component (interactive)

---

## Developer Operations Context

### Architecture & Technical Requirements

**Component:**
- `src/components/products/ProductFilter.tsx`

**State:**
- URL Search Params strategy recommended (shareable URLs).
- OR client-side state if list is small (simple MVP).
- Let's use URL Params for better UX (`useSearchParams`, `useRouter`).

### Implementation Guide

1.  **Filter UI:**
    Sidebar or Top Bar (dropdown on mobile).
    Checkboxes/Links for categories.

2.  **Logic:**
    Update URL query params (`?category=flooring`).
    Parent page (Server Component) reads searchParams and filters data (or passes params to GROQ).
    *GROQ filtering is best practice.*

3.  **Refactoring:**
    Update `src/app/products/page.tsx` to accept `searchParams` prop and modify GROQ query.

### File List
- [ ] src/components/products/ProductFilter.tsx

### Tasks / Subtasks

- [ ] Create `ProductFilter` component
- [ ] Implement URL search param logic
- [ ] Update Product Page to read `searchParams`
- [ ] Update GROQ query to support filtering
- [ ] Verify filtering works
- [ ] Verify Mobile responsiveness

### Change Log
- **2026-02-07**: Story created.
