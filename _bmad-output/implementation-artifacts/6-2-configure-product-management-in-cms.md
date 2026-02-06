# Story 6.2: Configure Product Management in CMS

**Epic:** 6-Content Management System (CMS)
**Story Key:** 6-2-configure-product-management-in-cms
**Status:** ready-for-dev

## Story Requirements

### User Story

As an **admin**,
I want **a user-friendly interface to manage products**,
So that **I can easily add, update, and organize my inventory**.

### Acceptance Criteria

- [ ] **Given** I am logged into the CMS
- [ ] **When** I create or edit a "Product"
- [ ] **Then** I can enter: Name, Slug (auto-generated), Description, Price, Specs, Category
- [ ] **And** I can upload multiple images and reorder them
- [ ] **And** I can set Visibility (Public/Wholesale/Hidden)
- [ ] **And** I see a preview of the product card or data in the list view
- [ ] **And** validation prevents saving without required fields (Name, Slug)

---

## Developer Operations Context

### Architecture & Technical Requirements

**Schema:**
- `product.ts` (Refine from 1.2 if needed).
- Fields: `name`, `slug`, `price`, `description`, `details` (Portable Text), `images` (array), `category` (reference), `visibility` (string list), `isFeatured` (boolean).

**Desk Structure:**
- Optional: Customize `sanity.config.ts` structure builder to group Products by Category for easier browsing.

### Implementation Guide

1.  **Refine Schema:**
    Ensure `options: { hotspot: true }` for images.
    Ensure `slug: { source: 'name' }`.

2.  **Input Components:**
    Use default inputs.

### File List
- [ ] src/lib/sanity/schemas/product.ts

### Tasks / Subtasks

- [ ] Review Product Schema details
- [ ] Add field validation
- [ ] Verify Image Upload options
- [ ] Test CRUD operations in Studio

### Change Log
- **2026-02-07**: Story created.
