# Story 1.5: Build Responsive Site Layout with Navigation

**Epic:** 1-Project Foundation & Site Shell
**Story Key:** 1-5-build-responsive-site-layout-with-navigation
**Status:** done

## Story Requirements

### User Story

As a **visitor**,
I want **a professional website layout with clear navigation to all sections**,
So that **I can easily find products and information on any device**.

### Acceptance Criteria

- [x] **Given** the project is deployed and accessible
- [x] **When** a visitor loads any page on the website
- [x] **Then** the Header displays the Hardwoodliving logo and navigation links to: Flooring, Cabinetry, Visit Us, Care Guide, Why Wood?, Contact, and Trades
- [x] **And** the Footer displays contact information (phone, email, address), social links, and copyright
- [x] **And** on mobile devices (< 768px), navigation collapses into a hamburger menu (MobileMenu component)
- [x] **And** Breadcrumbs component shows the user's current location in the site hierarchy
- [x] **And** all navigation links are functional (even if destination pages show placeholder content)
- [x] **And** the layout is responsive: single-column on mobile, proper spacing on tablet, full layout on desktop
- [x] **And** all public pages are accessible without authentication
- [x] **And** the Container component enforces consistent max-width and padding across all pages

---

## Developer Operations Context

### Architecture & Technical Requirements

**Components to Build:**
- `src/components/layout/Header.tsx`
- `src/components/layout/Footer.tsx`
- `src/components/layout/Navigation.tsx`
- `src/components/layout/MobileMenu.tsx`
- `src/components/layout/Breadcrumbs.tsx`
- `src/components/layout/Container.tsx`

**Styling:**
- Tailwind CSS.
- Responsive design (md, lg breakpoints).

**Integration:**
- `src/app/layout.tsx` (Update to include Header, Footer, Container).
- `src/components/layout/Navigation.tsx` should use `next/link`.

### Implementation Guide

1.  **Container:**
    Create `Container.tsx` wrapping content with `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`.

2.  **Header:**
    Sticky/fixed header or static. Include Logo and Navigation.
    Desktop: Horizontal links.
    Mobile: Hamburger button.

3.  **Navigation Data:**
    Define links structure:
    ```ts
    const links = [
      { label: 'Flooring', href: '/categories/flooring' },
      { label: 'Cabinetry', href: '/categories/cabinetry' },
      { label: 'Visit Us', href: '/pages/visit-us' },
      // ...
    ]
    ```
    Consider fetching navigation from Sanity `siteSettings` later, but hardcode for now or setup fetch if Schema 1.2 is ready. *Assume hardcoded or basic fetch for MVP.*

4.  **Mobile Menu:**
    Client Component (`use client`) for open/close state.

5.  **Footer:**
    Columns for Contact, Links, Socials.

### Dev Agent Record

#### Debug Log
No layout shift or responsive issues encountered during implementation. All components render correctly on first attempt.

#### Completion Notes

**Implementation Summary:**
- Created all 6 layout components (Container, Header, Footer, Navigation, MobileMenu, Breadcrumbs)
- Created shared navigation data module at `src/lib/navigation.ts` for DRY navigation links reuse
- Updated root layout to include Header, Breadcrumbs, and Footer shell
- Created 7 placeholder pages for all navigation destinations
- Updated homepage with professional hero section

**Technical Decisions:**
- Navigation data is hardcoded in `src/lib/navigation.ts` (can be replaced with Sanity siteSettings fetch later)
- Header is sticky with `backdrop-blur-sm` for modern glass effect
- MobileMenu uses `useState` for open/close toggle with absolute positioned dropdown
- Breadcrumbs auto-generate from URL pathname, hidden on homepage and admin pages
- Amber/brown color scheme consistent with hardwood brand identity
- Container enforces `max-w-7xl` with responsive padding (px-4/sm:px-6/lg:px-8)

**Route Structure Deviation (Documented):**
- Architecture specifies dynamic routes: `/categories/[slug]/page.tsx`, `/pages/[slug]/page.tsx`
- Implementation creates static placeholder pages instead: `/categories/flooring/page.tsx`, `/categories/cabinetry/page.tsx`, `/pages/visit-us/page.tsx`, `/pages/care-guide/page.tsx`, `/pages/why-wood/page.tsx`
- Rationale: Placeholder pages don't need dynamic routing since they are not CMS-driven yet. When Sanity CMS integration is added (stories 2-3, 3-1), these static pages will be replaced with `[slug]` dynamic routes that fetch content from Sanity.
- This is a **deliberate interim approach** and does not affect the final architecture.

**Responsive Design:**
- Navigation: `hidden md:flex` (hidden on mobile, flex row on >=768px)
- MobileMenu: `md:hidden` (visible on mobile, hidden on >=768px)
- Footer: grid-cols-1 → sm:grid-cols-2 → lg:grid-cols-4
- Hamburger icon with accessible aria-expanded and aria-controls attributes

**Tests Added:**
- `tests/unit/layout/navigation-data.test.ts` - 12 tests for navigation links, contact info, social links
- `tests/unit/layout/components.test.ts` - 15+ tests for component files, exports, placeholder pages, root layout; includes behavioral rendering tests for Container via `renderToStaticMarkup`
- Testing strategy documented in components.test.ts: behavioral tests for pure components (Container), source-code validation for Next.js-dependent components (Header, Footer, Navigation, MobileMenu, Breadcrumbs)
- All 79 layout tests pass (15 suites, 0 failures)

**Build Verification:**
- `next build` completes successfully with all routes generated
- No TypeScript errors, no linter errors
- All 11 routes generated as static pages (except admin which is dynamic)

### File List
- [x] src/lib/navigation.ts (NEW)
- [x] src/components/layout/Container.tsx (NEW)
- [x] src/components/layout/Navigation.tsx (NEW)
- [x] src/components/layout/MobileMenu.tsx (NEW)
- [x] src/components/layout/Header.tsx (NEW)
- [x] src/components/layout/Footer.tsx (NEW)
- [x] src/components/layout/Breadcrumbs.tsx (NEW)
- [x] src/app/layout.tsx (MODIFIED)
- [x] src/app/page.tsx (MODIFIED)
- [x] src/app/categories/flooring/page.tsx (NEW)
- [x] src/app/categories/cabinetry/page.tsx (NEW)
- [x] src/app/pages/visit-us/page.tsx (NEW)
- [x] src/app/pages/care-guide/page.tsx (NEW)
- [x] src/app/pages/why-wood/page.tsx (NEW)
- [x] src/app/contact/page.tsx (NEW)
- [x] src/app/trades/page.tsx (NEW)
- [x] tests/unit/layout/navigation-data.test.ts (NEW)
- [x] tests/unit/layout/components.test.ts (NEW)

### Tasks / Subtasks

- [x] Create `Container` component
- [x] Create `Navigation` component (Desktop)
- [x] Create `MobileMenu` component (Client side)
- [x] Create `Header` component combining Logo, Nav, MobileMenu
- [x] Create `Footer` component
- [x] Create `Breadcrumbs` component
- [x] Update Root Layout (`src/app/layout.tsx`) to implement the shell
- [x] Verify responsiveness on Mobile, Tablet, Desktop
- [x] Verify all links work

### Change Log
- **2026-02-07**: Story created.
- **2026-02-07**: Implementation complete. Created all 6 layout components, navigation data module, 7 placeholder pages. Updated root layout and homepage. Added 27 unit tests (all pass). Build verified successfully.
- **2026-02-07**: Code review complete. Fixed 2 MEDIUM issues: (1) Added behavioral rendering tests for Container using `renderToStaticMarkup` + documented testing strategy in test file header; (2) Documented route structure deviation from architecture (static placeholder pages vs dynamic `[slug]` routes — deliberate interim approach). Updated test counts, Dev Agent Record. Status → done.
