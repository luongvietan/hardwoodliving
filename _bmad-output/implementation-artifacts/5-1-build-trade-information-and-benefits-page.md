# Story 5.1: Build Trade Information and Benefits Page

**Epic:** 5-Trade/Contractor Management
**Story Key:** 5-1-build-trade-information-and-benefits-page
**Status:** done

## Story Requirements

### User Story

As a **contractor or installer**,
I want **to learn about the Trade Program benefits and requirements**,
So that **I can decide if I should register for an account**.

### Acceptance Criteria

- [x] **Given** the site layout is in place
- [x] **When** a visitor navigates to the Trades page (`/trades`)
- [x] **Then** information about trade benefits (pricing, support, etc.) is displayed
- [x] **And** the content is editable from the CMS (sourced from Sanity `page` or dedicated fields)
- [x] **And** a clear Call to Action (CTA) allows new users to "Register for Trade Account"
- [x] **And** a "Login" link is provided for existing trade users
- [x] **And** the page is accessible to public (unauthenticated) users

---

## Developer Operations Context

### Architecture & Technical Requirements

**Route:**
- `src/app/trades/page.tsx`

**Components:**
- Reuse dynamic page structure or build custom if specific layout needed.
- `src/components/forms/TradeRegistrationForm.tsx` (toggle usage).

**Data:**
- Fetch 'Trades' page content from Sanity (`*[_type == "page" && slug.current == "trades"][0]`).
- Fallback text if CMS page missing.

### Implementation Guide

1.  **Page:**
    `src/app/trades/page.tsx`.
    Fetch content.
    Display "Benefits" section.
    Split layout: Info on left, Login/Register buttons or forms on right.

2.  **Navigation:**
    Add link to Header if not already there.

### File List
- [x] src/app/(site)/trades/page.tsx (modified - full trades page with CMS integration)
- [x] src/app/(site)/trades/trades-page.test.tsx (new - 15 tests)
- [x] src/lib/sanity/queries.ts (modified - added getTradesPageQuery)
- [x] src/test-setup.ts (modified - added mock for getTradesPageQuery)

### Tasks / Subtasks

- [x] Create Trades landing page
- [x] Fetch/Render content from CMS (create 'trades' page in Sanity via Studio manually later)
- [x] Add Register/Login CTAs (links to frag/components)
- [x] Verify SEO metadata

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

**Implementation Plan:**
- Rebuilt the existing stub `/trades` page into a full CMS-integrated landing page
- Fetches content from Sanity using `getTradesPageQuery` (page type with slug "trades")
- Shows default trade benefits (Wholesale Pricing, Dedicated Support, Bulk Ordering, Extended Product Range) when no CMS content exists
- CMS body content rendered via PortableText when available
- Register/Login CTAs linking to `/trades/register` and `/trades/login`
- Dynamic SEO metadata from CMS with sensible fallbacks
- Trades link already in default navigation

**Completion Notes:**
- All 15 tests pass (CMS rendering, default benefits, CTAs, SEO metadata)
- Full regression suite: 226/226 tests pass
- Page is publicly accessible (no auth required)

### Senior Developer Review (AI)
- **Reviewer**: Viet An
- **Date**: 2026-02-07
- **Outcome**: Approved (no issues specific to this story)
- All ACs verified implemented. 15/15 tests pass. CMS integration, default benefits, CTAs, SEO metadata all correct.

### Change Log
- **2026-02-07**: Story created.
- **2026-02-07**: Implemented trades landing page with CMS integration, default benefits, CTAs, SEO metadata, and 15 tests.
- **2026-02-07**: Code review passed — status → done.
