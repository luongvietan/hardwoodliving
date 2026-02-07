# Story 6.3: Configure Category, Page Management, and Preview

**Epic:** 6-Content Management System (CMS)
**Story Key:** 6-3-configure-category-page-management-and-preview
**Status:** done

## Story Requirements

### User Story

As an **admin**,
I want **to manage categories and content pages**,
So that **I can structure the site navigation and content**.

### Acceptance Criteria

- [x] **Given** schemas defined in Story 1.2
- [x] **When** I access the CMS
- [x] **Then** I can manage Categories (Name, Image, Parent)
- [x] **And** I can manage Pages (Title, Slug, Rich Text Body)
- [x] **And** I can manage the Homepage singleton (Hero, Testimonials)
- [x] **And** I can manage Site Settings (Navigation Links, Contact Info)
- [x] **And** "Preview" functionality is enabled to view draft content on the site safely (Draft Mode)

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
- [x] src/app/api/draft-mode/enable/route.ts (NEW)
- [x] src/app/api/draft-mode/disable/route.ts (NEW)
- [x] sanity.config.ts (MODIFIED - added presentationTool plugin)
- [x] src/lib/sanity/fetch.ts (MODIFIED - added draft mode perspective support)
- [x] src/app/api/draft-mode/enable/route.test.tsx (NEW - test, added by review)
- [x] src/app/api/draft-mode/disable/route.test.tsx (NEW - test)

### Tasks / Subtasks

- [x] Create Draft Mode API routes
- [x] Configure Presentation Tool in Sanity Config
- [x] Update Sanity Client/Fetch to support Draft Mode
- [x] Verify Live Preview in Studio (Split pane)

### Testing Requirements

> **CRITICAL: Do NOT create fake/static-analysis tests.**
> Tests that use `fs.readFileSync` to scan source code strings are **BANNED**.
> All component tests MUST render real components via the pre-configured test infrastructure.

**Pre-configured infrastructure (already installed — do NOT reconfigure):**
- `vitest` + `@testing-library/react` + `jsdom` → see `vitest.config.ts`
- Global mocks for `next/image`, `next/link`, `next/navigation`, `@/lib/sanity/image`, `@/lib/sanity/fetch` → see `src/test-setup.ts`

**Rules:**
1. Component test files → `.test.tsx` extension (NOT `.test.ts`)
2. Use `import { render, screen } from '@testing-library/react'`
3. Use `render(<Component {...props} />)` — real rendering in jsdom DOM
4. Use `screen.getByText()`, `screen.getByRole()`, etc. to assert on rendered output
5. For async Server Components: `const jsx = await ServerComponent(); render(<>{jsx}</>);`
6. Run with: `npm run test:components`

### Dev Agent Record

**Implementation Notes:**
- **Draft Mode Enable route** (`/api/draft-mode/enable`): Uses `defineEnableDraftMode` from `next-sanity/draft-mode` with authenticated Sanity client (SANITY_API_READ_TOKEN). This validates the request from Sanity Presentation Tool and enables Next.js draft mode cookies.
- **Draft Mode Disable route** (`/api/draft-mode/disable`): Simple GET handler that calls `draftMode().disable()` and returns JSON confirmation.
- **Presentation Tool**: Added `presentationTool` from `sanity/presentation` to sanity.config.ts plugins. Configured with:
  - `previewUrl.origin`: Uses NEXT_PUBLIC_SITE_URL env var (falls back to localhost:3000)
  - `previewUrl.previewMode.enable`: Points to `/api/draft-mode/enable`
- **sanityFetch updated**: Now auto-detects draft mode via dynamic `import("next/headers")`. When draft mode is active:
  - Uses `perspective: "previewDrafts"` to show unpublished content
  - Disables CDN (`useCdn: false`) for real-time updates
  - Sets `revalidate: 0` to bypass caching
  - Wrapped in try-catch so non-server contexts (tests, build time) gracefully fall back to normal mode
- **Schema verification**: All content types verified:
  - Categories: title, slug, description, image, parent reference ✓
  - Pages: title, slug, body (Portable Text with styles/lists/marks/images), SEO fields ✓
  - Homepage singleton: hero section, intro blurb, featured products, testimonials ✓
  - Site Settings singleton: site name, logo, navigation, contact info, social links ✓
  - Singleton configuration in sanity.config.ts prevents duplicate creation ✓

**Completion Notes:**
- ✅ All 4 tasks completed
- ✅ Draft mode enable/disable routes created
- ✅ Presentation Tool configured in sanity.config.ts
- ✅ sanityFetch updated with draft mode awareness
- ✅ 3 tests for draft mode disable route pass
- ✅ 3 tests for draft mode enable route pass (added by review)
- ✅ 309 total tests pass, zero regressions

### Senior Developer Review (AI)

**Review Date:** 2026-02-07
**Reviewer:** Viet An (AI-assisted)
**Outcome:** Approved with fixes applied

**Issues Found & Fixed:**
1. [MEDIUM] Enable route had no tests — added 3 tests (enable/route.test.tsx)
2. [MEDIUM] Enable route used non-null assertion `process.env.SANITY_API_READ_TOKEN!` — replaced with explicit validation that throws descriptive error

### Change Log
- **2026-02-07**: Story created.
- **2026-02-07**: Created draft mode API routes, configured Presentation Tool, updated sanityFetch for draft mode, marked complete.
- **2026-02-07**: [Review] Added enable route tests, added env var validation for SANITY_API_READ_TOKEN.
