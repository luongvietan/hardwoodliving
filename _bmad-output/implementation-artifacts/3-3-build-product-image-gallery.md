# Story 3.3: Build Product Image Gallery

**Epic:** 3-Product Catalog & Browsing
**Story Key:** 3-3-build-product-image-gallery
**Status:** done

## Story Requirements

### User Story

As a **visitor**,
I want **to view multiple product images in an interactive gallery**,
So that **I can see the product from different angles and in different settings**.

### Acceptance Criteria

- [x] **Given** a product has at least 2 images attached in Sanity
- [x] **When** the visitor views a product detail page
- [x] **Then** the ProductGallery component displays all product images
- [x] **And** the gallery includes thumbnail navigation to switch between images
- [x] **And** images are automatically optimized for device size and connection speed
- [x] **And** images are served in WebP/AVIF format with JPEG/PNG fallback
- [x] **And** below-the-fold gallery images are lazy loaded
- [x] **And** the gallery is a Client Component (interactive) with `'use client'` directive
- [x] **And** all images have descriptive alt text

---

## Developer Operations Context

### Architecture & Technical Requirements

**Component:**
- `src/components/products/ProductGallery.tsx`

**Tech:**
- React Client Component (`'use client'`).
- `useState` for active image index.
- `next/image` for optimization.
- `@sanity/image-url` for generating Sanity image sources.

### Implementation Guide

1.  **Gallery State:**
    Track `selectedIndex`.

2.  **Main Image:**
    Display `images[selectedIndex]`. Use `NextImage` with `priority` (for LCP).

3.  **Thumbnails:**
    Row of small images. Click updates `selectedIndex`.

### File List
- [x] src/components/products/ProductGallery.tsx (modified - alt text + aria states + lazy thumbnails)
- [x] src/components/products/ProductGallery.test.tsx (modified)
- [x] src/app/(site)/products/[slug]/page.tsx (modified - integrated ProductGallery)
- [x] src/app/(site)/products/[slug]/product-detail.test.tsx (modified - updated gallery tests)

### Tasks / Subtasks

- [x] Create `ProductGallery` client component
- [x] Implement Main Image display
- [x] Implement Thumbnail list
- [x] Implement State switching logic
- [x] Integrate into Product Detail Page
- [x] Verify accessibility (keyboard nav, alt text)

### Testing Requirements

> **CRITICAL: Do NOT create fake/static-analysis tests.**

### Dev Agent Record

**Implementation Plan:**
- Created `ProductGallery` as a Client Component with `'use client'` directive
- Uses `useState` for tracking selected image index
- Main image displayed with `priority` loading for LCP optimization
- Thumbnails rendered as buttons with active ring highlight (amber-600)
- Images optimized via `next/image` with `auto("format")` for WebP/AVIF
- Below-fold thumbnails lazy-loaded by default via next/image
- All images have descriptive alt text: "{productTitle}" for main, "{productTitle} - Image N" for thumbnails
- Placeholder SVG shown when no images available
- Accessible: `role="region"`, `aria-label` on gallery, `aria-label` on each thumbnail button

**Completion Notes:**
- All 6 tasks implemented and verified
- 10 new tests for ProductGallery, 17 updated tests for product detail page
- Full regression suite: 155 tests passing, 0 regressions
- Gallery handles edge cases: no images, single image (no thumbnails), empty array
- Added ARIA state for active thumbnail + descriptive fallback alt text

### Change Log
- **2026-02-07**: Story created.
- **2026-02-07**: Story implemented - Created ProductGallery client component, integrated into product detail page. All tests pass (155/155).
- **2026-02-07**: Review fixes - Improved alt text and accessibility states for thumbnails.
