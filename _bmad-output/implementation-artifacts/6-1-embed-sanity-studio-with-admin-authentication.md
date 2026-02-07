# Story 6.1: Embed Sanity Studio with Admin Authentication

**Epic:** 6-Content Management System (CMS)
**Story Key:** 6-1-embed-sanity-studio-with-admin-authentication
**Status:** ready-for-dev

## Story Requirements

### User Story

As an **admin**,
I want **to access the Content Management System at `/admin`**,
So that **I can manage website content securely**.

### Acceptance Criteria

- [ ] **Given** the Sanity Project is configured
- [ ] **When** I navigate to `/admin`
- [ ] **Then** the Sanity Studio interface loads
- [ ] **And** I am prompted to log in with my Sanity credentials
- [ ] **And** after login, I can see the "Desk" (Structure) tool
- [ ] **And** I can see the schema types (Products, Categories, Pages)
- [ ] **And** the Studio is embedded within the Next.js application route

---

## Developer Operations Context

### Architecture & Technical Requirements

**Route:**
- `src/app/admin/[[...tool]]/page.tsx`

**Component:**
- `NextStudio` from `next-sanity/studio`.
- `sanity.config.ts`.

### Implementation Guide

1.  **Route Implementation:**
    Already scaffolded in Story 1.2? If simplified in 1.2, ensure FULL functionality here.
    Config options: `basePath: '/admin'`.

2.  **Validation:**
    Login using Sanity Account.

### File List
- [ ] src/app/admin/[[...tool]]/page.tsx
- [ ] sanity.config.ts

### Tasks / Subtasks

- [ ] Verify `sanity.config.ts` basePath
- [ ] Implement Admin Page catch-all
- [ ] Verify Login
- [ ] Verify Structure Tool loads

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
