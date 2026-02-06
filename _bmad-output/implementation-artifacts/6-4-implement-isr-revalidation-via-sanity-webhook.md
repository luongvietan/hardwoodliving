# Story 6.4: Implement ISR Revalidation via Sanity Webhook

**Epic:** 6-Content Management System (CMS)
**Story Key:** 6-4-implement-isr-revalidation-via-sanity-webhook
**Status:** ready-for-dev

## Story Requirements

### User Story

As an **admin**,
I want **the website to update automatically when I publish changes**,
So that **visitors always see the latest content without manual rebuilds**.

### Acceptance Criteria

- [ ] **Given** content is published in Sanity
- [ ] **When** Sanity triggers the configured webhook
- [ ] **Then** the Next.js API route `/api/revalidate` receives the request
- [ ] **And** the signature/secret is verified
- [ ] **And** the corresponding cache tags (e.g., `product:[slug]`, `home`) are revalidated
- [ ] **And** the updated content appears on the site within seconds (ISR)

---

## Developer Operations Context

### Architecture & Technical Requirements

**Route:**
- `src/app/api/revalidate/route.ts`

**Sanity:**
- Project Settings > API > Webhooks.
- URL: `https://prod-domain.com/api/revalidate`.
- Secret: `SANITY_REVALIDATE_SECRET`.
- Projection: `{_type, "slug": slug.current}`.

**Next.js:**
- `revalidateTag(tag)`.

### Implementation Guide

1.  **API Route:**
    Parse body.
    Verify signature (`parseBody` from `next-sanity/webhook`).
    Check `_type`.
    Call `revalidateTag(_type)` and `revalidateTag('products')` etc.

2.  **Fetch Tags:**
    Ensure `sanityFetch` applies tags: `next: { tags: ['product', 'homepage'...] }`.

### File List
- [ ] src/app/api/revalidate/route.ts

### Tasks / Subtasks

- [ ] Create Revalidate API Route
- [ ] Implement Signature Verification
- [ ] Implement Tag Revalidation logic
- [ ] Update Fetch functions to include Tags
- [ ] Document Webhook Setup (for user to add in Sanity Dashboard manually)

### Change Log
- **2026-02-07**: Story created.
