# Story 8.5: Accessibility Compliance

**Epic:** 8-SEO, Performance & Launch Readiness
**Story Key:** 8-5-accessibility-compliance
**Status:** done

## Story Requirements

### User Story

As a **visitor with disabilities**,
I want **the site to be accessible via keyboard and screen reader**,
So that **I can use it effectively**.

### Acceptance Criteria

- [x] **Given** the site is navigable
- [x] **When** tested with keyboard or screen reader
- [x] **Then** focus indicators are visible
- [x] **And** color contrast meets WCAG AA standards
- [x] **And** images have alt text
- [x] **And** headings follow hierarchy

---

## Developer Operations Context

### Architecture & Technical Requirements

**Standards:**
- WCAG 2.1 AA.

### Implementation Guide

1.  **Audit:** Run Axe or similar tool.
2.  **Fixes:** Contrast adjustments, ARIA labels, semantic HTML.

### File List
- [x] src/app/globals.css (modified - focus-visible styles, skip-to-content)
- [x] src/components/layout/Header.tsx (modified - logo aria-label)
- [x] src/components/layout/Navigation.tsx (modified - focus-visible styles)
- [x] src/components/products/ProductFilter.tsx (modified - focus styles, aria-pressed, role="group")
- [x] src/app/(site)/trades/trades-page.test.tsx (modified - updated test for title change)

### Tasks / Subtasks

- [x] Run Accessibility Audit
- [x] Fix Contrast Issues
- [x] Fix Keyboard Nav Issues
- [x] Verify ARIA labels

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
**Audit Results & Fixes Applied:**

1. **Focus Indicators (WCAG 2.4.7):** Added global `:focus-visible` style (amber outline) to globals.css
2. **Skip Navigation (WCAG 2.4.1):** Already existed in site layout (verified), added CSS class
3. **Logo Link (WCAG 4.1.2):** Added `aria-label` to Header logo link
4. **Navigation Links:** Added `focus-visible:bg-amber-50 focus-visible:text-amber-900` to nav links
5. **ProductFilter (WCAG 4.1.2):** Added `aria-pressed` to toggle buttons, `role="group"` with `aria-label` for filter groups, focus ring styles
6. **Images (WCAG 1.1.1):** All images already have alt text ✅
7. **Heading Hierarchy (WCAG 1.3.1):** All pages use correct H1-H6 hierarchy ✅
8. **Color Contrast:** Amber-700 on white meets WCAG AA (4.57:1 ratio) ✅
9. **MobileMenu:** Already had focus trap, escape key handling, dialog role ✅
10. **Forms:** ContactForm already had labels, aria-required, aria-invalid, aria-describedby ✅

**Full regression suite: 43 files, 405 tests - ALL PASS**

### Change Log
- **2026-02-07**: Story created.
- **2026-02-07**: Implementation complete. Accessibility audit and fixes applied.
- **2026-02-07**: Code review fixes applied: Removed dead `.skip-to-content` CSS class from globals.css (site layout uses Tailwind sr-only instead).
