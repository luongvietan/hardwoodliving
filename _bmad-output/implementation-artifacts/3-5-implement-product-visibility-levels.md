# Story 3.5: Implement Product Visibility Levels

**Epic:** 3-Product Catalog & Browsing
**Story Key:** 3-5-implement-product-visibility-levels
**Status:** done

## Story Requirements

### User Story

As the **system**,
I want **to control which products are visible to which user types**,
So that **only appropriate content is shown based on access level**.

### Acceptance Criteria

- [x] **Given** products in Sanity have a `visibility` field with values: "public", "wholesale", "hidden"
- [x] **When** a public (unauthenticated) user browses products
- [x] **Then** only products with visibility "public" are displayed
- [x] **And** when an authenticated trade user browses products, both "public" and "wholesale" products are displayed
- [x] **And** products with visibility "hidden" (draft) are never shown on the public site
- [x] **And** GROQ queries filter by visibility server-side
- [x] **And** direct URL access to a hidden/restricted product returns 404 for unauthorized users

---

## Developer Operations Context

### File List
- [x] src/lib/sanity/visibility.ts (modified - role-aware trade check)
- [x] src/lib/sanity/visibility.test.ts (modified - getUserRole coverage)
- [x] src/lib/sanity/queries.ts (modified - added 3 visibility-aware GROQ queries)
- [x] src/test-setup.ts (modified - added visibility and query mocks)
- [x] src/app/(site)/products/[slug]/page.tsx (modified - visibility-aware caching)
- [x] src/app/(site)/products/page.tsx (modified - visibility-aware filtering)
- [x] src/app/(site)/categories/[slug]/page.tsx (modified - visibility-aware filtering)

### Tasks / Subtasks

- [x] Update GROQ queries to accept visibility params
- [x] Implement auth check in Product/Catalog pages
- [x] Pass correct visibility options based on user role
- [x] Test Public User view
- [x] Test Trade User view (mocked auth for now if needed)
- [x] Verify Hidden products are inaccessible

### Dev Agent Record

**Implementation Plan:**
- Created `visibility.ts` helper with:
  - `getVisibilityOptions(role)`: returns visibility array for GROQ queries
  - `getUserRole()`: checks Supabase auth, returns "public" or "trade"
- Added 3 visibility-aware GROQ queries:
  - `getVisibleProductsQuery`: all products filtered by visibility
  - `getVisibleProductBySlugQuery`: single product with visibility check
  - `getVisibleProductsByCategoryQuery`: products by category with visibility
- All GROQ queries use `visibility in $visibility` for server-side filtering
- Product detail page: if product doesn't match visibility filter, returns 404 (notFound)
- Graceful fallback: if Supabase auth is unavailable, defaults to "public" role
- "hidden" products are never included in any visibility options array

**Completion Notes:**
- All 6 tasks implemented and verified
- 3 new visibility tests + all existing tests pass
- Full regression suite: 170 tests passing, 0 regressions
- Visibility filtering is applied at the GROQ query level (server-side) for security
- getUserRole uses dynamic import for Supabase to avoid breaking when not configured
- Direct URL access to wholesale/hidden products returns 404 for public users
- Trade role now requires explicit role metadata (app/user metadata)
- Visibility-aware cache prevents cross-role content leakage

### Change Log
- **2026-02-07**: Story created.
- **2026-02-07**: Story implemented - Created visibility helper, visibility-aware GROQ queries, updated all product pages. All tests pass (170/170).
- **2026-02-07**: Review fixes - Enforced trade role + visibility-safe caching.
