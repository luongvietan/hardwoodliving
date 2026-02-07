# Story 2.3: Build Dynamic CMS-Editable Content Pages

**Epic:** 2-Homepage & Content Discovery
**Story Key:** 2-3-build-dynamic-cms-editable-content-pages
**Status:** done

## Story Requirements

### User Story

As a **visitor**,
I want **to read informational pages like Visit Us, Care Guide, and Why Wood?**,
So that **I can learn about wood products, care, and the Hardwoodliving store**.

### Acceptance Criteria

- [x] **Given** the site layout is in place (Epic 1) and Sanity `page` schema is configured
- [x] **When** a visitor navigates to a content page (e.g., `/pages/care-guide`)
- [x] **Then** the page renders the title and body content from Sanity
- [x] **And** rich text (Portable Text) is rendered using the PortableTextRenderer component, supporting headings, paragraphs, lists, links, and embedded images
- [x] **And** the page URL uses a clean slug format (`/pages/[slug]`)
- [x] **And** the page uses ISR with on-demand revalidation
- [x] **And** if the page slug does not exist in Sanity, a 404 page is displayed
- [x] **And** the page supports CMS-editable SEO metadata (meta title, meta description)

---

## Developer Operations Context

### Architecture & Technical Requirements

**Route:**
- `src/app/(site)/pages/[slug]/page.tsx`

**Components:**
- `src/components/sanity/PortableText.tsx`

**Dependencies:**
- `@portabletext/react`

**SEO:**
- Use `generateMetadata` in `page.tsx`.

### Implementation Guide

1.  **Dynamic Route:**
    `src/app/(site)/pages/[slug]/page.tsx`
    `generateStaticParams`: Fetch all page slugs.
    `Page`: Fetch page data by slug.

2.  **Portable Text:**
    Create `PortableText` component. Customize components for standard HTML elements and custom types (images).

3.  **SEO:**
    Map Sanity SEO fields to Next.js Metadata.

### File List
- [x] src/app/(site)/pages/[slug]/page.tsx (existing, verified)
- [x] src/components/sanity/PortableText.tsx (existing, verified — serves as PortableTextRenderer)
- [x] src/lib/sanity/schemas/page.ts (existing Sanity page schema)
- [x] src/lib/sanity/queries.ts (modified — added getAllPageSlugsQuery, contains getPageQuery)
- [x] src/components/sanity/PortableText.test.tsx (new — 16 tests)
- [x] src/app/(site)/pages/[slug]/content-page.test.tsx (new — 15 tests)
- [x] src/test-setup.ts (modified — added notFound mock, getPageQuery & getAllPageSlugsQuery mocks)

### Tasks / Subtasks

- [x] Install `@portabletext/react` if missing
- [x] Create `PortableTextRenderer`
- [x] Implement `src/app/pages/[slug]/page.tsx`
- [x] Implement `generateStaticParams`
- [x] Implement `generateMetadata`
- [x] Verify 404 content
- [x] Test with sample content from Sanity

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

#### Implementation Plan
- Verified all code was already implemented from previous stories/infrastructure setup
- The PortableText component at `src/components/sanity/PortableText.tsx` provides full Portable Text rendering with custom components for headings (h1, h2, h3), paragraphs, blockquotes, bullet lists, links (with external target/rel), and embedded images
- The ContentPage at `src/app/(site)/pages/[slug]/page.tsx` implements the full dynamic route with generateStaticParams, generateMetadata (SEO), ISR via sanityFetch with tags, and 404 via notFound()
- Note: Story originally specified `src/components/portable-text/PortableTextRenderer.tsx` but the component exists at `src/components/sanity/PortableText.tsx` following the project's convention of grouping Sanity-related components

#### Completion Notes
- ✅ All 7 tasks verified complete
- ✅ 16 unit tests written for PortableText component covering: null/undefined handling, paragraphs, h1/h2/h3 headings, blockquotes, bullet lists, links (href, target, rel, styling), images (alt text, figure wrapper, missing asset), and mixed content
- ✅ 15 integration tests written for ContentPage covering: page rendering, body content, prose wrapper, empty body fallback, 404 handling, article structure, max-width constraint, heading blocks, generateMetadata (SEO title, description, fallback, not found), generateStaticParams (slugs, empty)
- ✅ Updated test-setup.ts: added `notFound` mock to next/navigation, added `getPageQuery` to queries mock
- ✅ All 93 tests pass (0 failures, 0 regressions)
- ✅ No new lint errors introduced

### Senior Developer Review (AI)

**Reviewer:** Code Review Workflow | **Date:** 2026-02-07
**Result:** APPROVED (after fixes)

**Issues Found:** 0 Critical, 5 Medium, 5 Low
**Issues Fixed:** 4 Medium (auto-fixed), 1 Medium (noted — orphaned file from story 2.1)

**Fixes Applied:**
1. **M1 — Open Graph image support added** to `generateMetadata` in `page.tsx`. Schema's `openGraphImage` field now maps to `openGraph.images` in Next.js Metadata.
2. **M2 — Removed blanket `eslint-disable @typescript-eslint/no-explicit-any`** from both `page.tsx` and `PortableText.tsx`. Added proper types (`SanityImageValue`, `PortableTextImageValue`, `Record<string, unknown>[]`). Reduced `any` usage to single targeted `eslint-disable-next-line` in PortableText where library requires dynamic types.
3. **M3 — Moved `getAllPageSlugsQuery`** from inline definition in `page.tsx` to centralized `src/lib/sanity/queries.ts` per architecture mandate.
4. **M4 — Fixed link behavior** in `PortableText.tsx`. Links now check if URL is external (`http` or `//` prefix) before adding `target="_blank"`. Internal links open in same tab.

**Noted (not fixed — separate story scope):**
- **M5** — `tests/unit/homepage/components.test.ts` is an orphaned untracked file from story 2.1 using BANNED `fs.readFileSync` pattern. Should be addressed in a follow-up cleanup task.

**LOW issues left as-is** (acceptable for current scope):
- L1: `PageData` inline (minor, doesn't affect functionality)
- L2: No numbered list support (matches schema — consistent)
- L3: Image height hardcoded 450px (minor UX)
- L4: Incomplete query mock (future stories will add as needed)
- L5: Component path differs from architecture doc (acknowledged, better location)

**Post-fix verification:** All 93 tests pass. 0 lint errors. 0 regressions.

### Change Log
- **2026-02-07**: Story created.
- **2026-02-07**: Implementation verified — all code pre-existing from prior story work. Wrote 31 new tests (16 PortableText + 15 ContentPage). Updated test-setup.ts with notFound and getPageQuery mocks. All 93 tests pass. Story marked for review.
- **2026-02-07**: Code review completed — 4 MEDIUM issues auto-fixed: added OG image to generateMetadata, removed blanket eslint-disable with proper types, moved getAllPageSlugsQuery to queries.ts, fixed internal/external link behavior. Updated test-setup.ts mock. All 93 tests pass. Status → done.
