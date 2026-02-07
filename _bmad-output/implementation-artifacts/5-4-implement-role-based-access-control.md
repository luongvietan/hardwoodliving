# Story 5.4: Implement Role-Based Access Control

**Epic:** 5-Trade/Contractor Management
**Story Key:** 5-4-implement-role-based-access-control
**Status:** ready-for-dev

## Story Requirements

### User Story

As the **system**,
I want **to restrict access to specific pages and data based on user roles**,
So that **regular users cannot see trade info and trade users cannot see admin info**.

### Acceptance Criteria

- [ ] **Given** different user types (Public, Trade, Admin)
- [ ] **When** a user attempts to access a protected route
- [ ] **Then** Admin routes (`/admin`) require Sanity Admin authentication
- [ ] **And** Trade Dashboard (`/trades/dashboard`) requires Supabase Authenticated User
- [ ] **And** Wholesale Products require Supabase Authenticated User
- [ ] **And** Public pages are accessible to everyone
- [ ] **And** unauthorized access attempts redirect to the appropriate login page

---

## Developer Operations Context

### Architecture & Technical Requirements

**Configuration:**
- `src/middleware.ts`: Route guards.

**Logic:**
- Sanity Studio (`/admin`) handles its own auth internally (via Sanity). No blocking needed from Next.js middleware usually, but can check.
- Trade Routes: Check Supabase session.

**Roles:**
- "Trade User" = Any Authenticated Supabase User (for this MVP).
- "Admin" = Sanity User (handled by Sanity).

### Implementation Guide

1.  **Middleware Update:**
    Ensure `src/middleware.ts` handles `/trades/dashboard/*` -> redirect to `/trades/login`.

2.  **Sanity:**
    `/admin` is client-side SPA. Authentication is managed by Sanity.

### Tasks / Subtasks

- [ ] Update Middleware for Trade Routes
- [ ] Verify Public Access to Catalog
- [ ] Verify Restricted Access to Dashboard
- [ ] Verify Admin layout (Sanity)

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
