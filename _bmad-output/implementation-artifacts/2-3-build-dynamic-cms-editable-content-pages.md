# Story 2.3: Build Dynamic CMS-Editable Content Pages

**Epic:** 2-Homepage & Content Discovery
**Story Key:** 2-3-build-dynamic-cms-editable-content-pages
**Status:** ready-for-dev

## Story Requirements

### User Story

As a **visitor**,
I want **to read informational pages like Visit Us, Care Guide, and Why Wood?**,
So that **I can learn about wood products, care, and the Hardwoodliving store**.

### Acceptance Criteria

- [ ] **Given** the site layout is in place (Epic 1) and Sanity `page` schema is configured
- [ ] **When** a visitor navigates to a content page (e.g., `/pages/care-guide`)
- [ ] **Then** the page renders the title and body content from Sanity
- [ ] **And** rich text (Portable Text) is rendered using the PortableTextRenderer component, supporting headings, paragraphs, lists, links, and embedded images
- [ ] **And** the page URL uses a clean slug format (`/pages/[slug]`)
- [ ] **And** the page uses ISR with on-demand revalidation
- [ ] **And** if the page slug does not exist in Sanity, a 404 page is displayed
- [ ] **And** the page supports CMS-editable SEO metadata (meta title, meta description)

---

## Developer Operations Context

### Architecture & Technical Requirements

**Route:**
- `src/app/pages/[slug]/page.tsx`

**Components:**
- `src/components/portable-text/PortableTextRenderer.tsx`

**Dependencies:**
- `@portabletext/react`

**SEO:**
- Use `generateMetadata` in `page.tsx`.

### Implementation Guide

1.  **Dynamic Route:**
    `src/app/pages/[slug]/page.tsx`
    `generateStaticParams`: Fetch all page slugs.
    `Page`: Fetch page data by slug.

2.  **Portable Text:**
    Create `PortableTextRenderer` component. Customize components for standard HTML elements and custom types (images).

3.  **SEO:**
    Map Sanity SEO fields to Next.js Metadata.

### File List
- [ ] src/app/pages/[slug]/page.tsx
- [ ] src/components/portable-text/PortableTextRenderer.tsx

### Tasks / Subtasks

- [ ] Install `@portabletext/react` if missing
- [ ] Create `PortableTextRenderer`
- [ ] Implement `src/app/pages/[slug]/page.tsx`
- [ ] Implement `generateStaticParams`
- [ ] Implement `generateMetadata`
- [ ] Verify 404 content
- [ ] Test with sample content from Sanity

### Change Log
- **2026-02-07**: Story created.
