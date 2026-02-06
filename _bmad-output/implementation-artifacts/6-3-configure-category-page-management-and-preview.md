# Story 6.3: Configure Category, Page Management, and Preview

**Epic:** 6-Content Management System (CMS)
**Story Key:** 6-3-configure-category-page-management-and-preview
**Status:** ready-for-dev

## Story Requirements

### User Story

As an **admin**,
I want **to manage categories and content pages**,
So that **I can structure the site navigation and content**.

### Acceptance Criteria

- [ ] **Given** schemas defined in Story 1.2
- [ ] **When** I access the CMS
- [ ] **Then** I can manage Categories (Name, Image, Parent)
- [ ] **And** I can manage Pages (Title, Slug, Rich Text Body)
- [ ] **And** I can manage the Homepage singleton (Hero, Testimonials)
- [ ] **And** I can manage Site Settings (Navigation Links, Contact Info)
- [ ] **And** "Preview" functionality is enabled to view draft content on the site safely (Draft Mode)

---

## Developer Operations Context

### Architecture & Technical Requirements

**Preview Mode (Draft Mode):**
- **Route:** `src/app/api/draft-mode/enable/route.ts` & `disable`.
- **Logic:** Validate secret. Set cookie `draftMode().enable()`.
- **Sanity Config:** Add `presentationTool` plugin pointing to localhost/production URL.

**Schemas:**
- `category.ts`, `page.ts`, `homepage.ts` (Refine).

### Implementation Guide

1.  **Draft Mode API:**
    Create endpoints.

2.  **Sanity Presentation:**
    Configure `presentationTool` in `sanity.config.ts`.
    `previewUrl: { previewMode: { enable: '/api/draft-mode/enable' } }`.

3.  **Frontend Update:**
    Ensure fetching logic uses `stega: true` or `perspective: 'previewDrafts'` when draft mode enabled.
    *`next-sanity` `sanityFetch` helper handles this automatically if configured right.*

### File List
- [ ] src/app/api/draft-mode/enable/route.ts
- [ ] src/app/api/draft-mode/disable/route.ts
- [ ] sanity.config.ts

### Tasks / Subtasks

- [ ] Create Draft Mode API routes
- [ ] Configure Presentation Tool in Sanity Config
- [ ] Update Sanity Client/Fetch to support Draft Mode
- [ ] Verify Live Preview in Studio (Split pane)

### Change Log
- **2026-02-07**: Story created.
