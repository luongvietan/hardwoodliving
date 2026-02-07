# Story 8.5: Accessibility Compliance

**Epic:** 8-SEO, Performance & Launch Readiness
**Story Key:** 8-5-accessibility-compliance
**Status:** ready-for-dev

## Story Requirements

### User Story

As a **visitor with disabilities**,
I want **the site to be accessible via keyboard and screen reader**,
So that **I can use it effectively**.

### Acceptance Criteria

- [ ] **Given** the site is navigable
- [ ] **When** tested with keyboard or screen reader
- [ ] **Then** focus indicators are visible
- [ ] **And** color contrast meets WCAG AA standards
- [ ] **And** images have alt text
- [ ] **And** headings follow hierarchy

---

## Developer Operations Context

### Architecture & Technical Requirements

**Standards:**
- WCAG 2.1 AA.

### Implementation Guide

1.  **Audit:** Run Axe or similar tool.
2.  **Fixes:** Contrast adjustments, ARIA labels, semantic HTML.

### Tasks / Subtasks

- [ ] Run Accessibility Audit
- [ ] Fix Contrast Issues
- [ ] Fix Keyboard Nav Issues
- [ ] Verify ARIA labels

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

### Change Log
- **2026-02-07**: Story created.
