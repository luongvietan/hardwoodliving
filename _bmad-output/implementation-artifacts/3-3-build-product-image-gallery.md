# Story 3.3: Build Product Image Gallery

**Epic:** 3-Product Catalog & Browsing
**Story Key:** 3-3-build-product-image-gallery
**Status:** ready-for-dev

## Story Requirements

### User Story

As a **visitor**,
I want **to view multiple product images in an interactive gallery**,
So that **I can see the product from different angles and in different settings**.

### Acceptance Criteria

- [ ] **Given** a product has at least 2 images attached in Sanity
- [ ] **When** the visitor views a product detail page
- [ ] **Then** the ProductGallery component displays all product images
- [ ] **And** the gallery includes thumbnail navigation to switch between images
- [ ] **And** images are automatically optimized for device size and connection speed
- [ ] **And** images are served in WebP/AVIF format with JPEG/PNG fallback
- [ ] **And** below-the-fold gallery images are lazy loaded
- [ ] **And** the gallery is a Client Component (interactive) with `'use client'` directive
- [ ] **And** all images have descriptive alt text

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
- [ ] src/components/products/ProductGallery.tsx

### Tasks / Subtasks

- [ ] Create `ProductGallery` client component
- [ ] Implement Main Image display
- [ ] Implement Thumbnail list
- [ ] Implement State switching logic
- [ ] Integrate into Product Detail Page
- [ ] Verify accessibility (keyboard nav, alt text)

### Change Log
- **2026-02-07**: Story created.
