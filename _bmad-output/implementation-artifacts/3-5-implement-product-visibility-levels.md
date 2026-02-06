# Story 3.5: Implement Product Visibility Levels

**Epic:** 3-Product Catalog & Browsing
**Story Key:** 3-5-implement-product-visibility-levels
**Status:** ready-for-dev

## Story Requirements

### User Story

As the **system**,
I want **to control which products are visible to which user types**,
So that **only appropriate content is shown based on access level**.

### Acceptance Criteria

- [ ] **Given** products in Sanity have a `visibility` field with values: "public", "wholesale", "hidden"
- [ ] **When** a public (unauthenticated) user browses products
- [ ] **Then** only products with visibility "public" are displayed
- [ ] **And** when an authenticated trade user browses products, both "public" and "wholesale" products are displayed
- [ ] **And** products with visibility "hidden" (draft) are never shown on the public site
- [ ] **And** GROQ queries filter by visibility server-side
- [ ] **And** direct URL access to a hidden/restricted product returns 404 for unauthorized users

---

## Developer Operations Context

### Architecture & Technical Requirements

**Data:**
- Sanity Product Schema: `visibility` field (string options).

**Logic:**
- Determine User Role (from Supabase Auth Cookies).
- Modify GROQ Query based on role.

**Queries:**
- Public: `visibility == "public"`
- Trade: `visibility in ["public", "wholesale"]`

**Component:**
- `src/lib/sanity/queries.ts` (helper to generate visibility filter string).
- `src/lib/supabase/server.ts` (helper to check auth).

### Implementation Guide

1.  **Auth Check:**
    In Server Components (`page.tsx`), check `supabase.auth.getUser()`.

2.  **Query Injection:**
    Pass visibility parameter to GROQ queries.
    `*[_type == "product" && visibility in $visibilityOptions]`

3.  **Page Guard:**
    In PDP, check result. If product is wholesale but user is anon, return 404 (or Redirect to Login).

### File List
- [ ] src/lib/sanity/queries.ts

### Tasks / Subtasks

- [ ] Update GROQ queries to accept visibility params
- [ ] Implement auth check in Product/Catalog pages
- [ ] Pass correct visibility options based on user role
- [ ] Test Public User view
- [ ] Test Trade User view (mocked auth for now if needed)
- [ ] Verify Hidden products are inaccessible

### Change Log
- **2026-02-07**: Story created.
