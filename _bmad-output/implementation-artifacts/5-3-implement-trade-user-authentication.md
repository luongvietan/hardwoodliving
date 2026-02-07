# Story 5.3: Implement Trade User Authentication

**Epic:** 5-Trade/Contractor Management
**Story Key:** 5-3-implement-trade-user-authentication
**Status:** done

## Story Requirements

### User Story

As a **trade user**,
I want **to log in to my account securely**,
So that **I can view protected content and my profile**.

### Acceptance Criteria

- [x] **Given** a registered trade user
- [x] **When** they maximize the TradeLoginForm
- [x] **Then** they can enter email and password
- [x] **And** on submit, the system authenticates via Supabase Auth
- [x] **And** on success, they are redirected to the Trade Dashboard (`/trades/dashboard`)
- [x] **And** invalid credentials show an error message
- [x] **And** a "Logout" action is available in the dashboard
- [x] **And** protected routes (`/trades/dashboard`, `/products` wholesale view) require authentication

---

## Developer Operations Context

### Architecture & Technical Requirements

**Components:**
- `src/components/forms/TradeLoginForm.tsx`
- `src/app/trades/login/page.tsx`
- `src/app/trades/dashboard/page.tsx` (Protected)

**Server Action:**
- `src/lib/actions/trades.ts`: `loginTrade`, `logoutTrade`.

**Middleware:**
- `src/middleware.ts`: Refresh session. Use `updateSession`.
- Protect routes: Check session for `/trades/dashboard`.

### Implementation Guide

1.  **Login Action:**
    `supabase.auth.signInWithPassword`.

2.  **Protected Page:**
    In `dashboard/page.tsx`:
    ```ts
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/trades/login')
    ```

3.  **Logout:**
    `supabase.auth.signOut`. Redirect to `/`.

### File List
- [x] src/components/forms/TradeLoginForm.tsx (new - login form component, uses shared FormField)
- [x] src/components/forms/TradeLoginForm.test.tsx (new - 8 tests, improved useEffect mock)
- [x] src/app/(site)/trades/login/page.tsx (new - login page)
- [x] src/app/(site)/trades/dashboard/page.tsx (new - protected dashboard page, uses next/link)
- [x] src/app/(site)/trades/dashboard/LogoutButton.tsx (new - logout button with error handling)
- [x] src/app/(site)/trades/dashboard/error.tsx (new - error boundary for dashboard)
- [x] src/app/(site)/trades/dashboard/dashboard-page.test.tsx (new - 9 tests)
- [x] src/test-setup.ts (modified - added redirect mock)

### Tasks / Subtasks

- [x] Create `TradeLoginForm`
- [x] Implement `loginTrade` Action
- [x] Implement `logoutTrade` Action
- [x] Create Protected Dashboard Page
- [x] Verify Login Flow
- [x] Verify Logout Flow
- [x] Verify Middleware protection

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
- Created TradeLoginForm client component with email/password fields
- Login page at /trades/login with SEO metadata
- Protected dashboard page at /trades/dashboard with auth check (redirects to login if unauthenticated)
- Dashboard shows: user info, company, business type, account status badge, quick links
- LogoutButton client component calls logoutTrade action and redirects to /
- loginTrade and logoutTrade server actions already created in story 5-2
- Added redirect mock to test-setup.ts for testing redirect behavior

**Completion Notes:**
- 17 new tests pass (8 login form + 9 dashboard)
- Dashboard redirects unauthenticated users to /trades/login
- Login form redirects to dashboard on success via router.push
- Logout calls supabase.auth.signOut and redirects to /

### Senior Developer Review (AI)
- **Reviewer**: Viet An
- **Date**: 2026-02-07
- **Outcome**: Approved after fixes
- **Fixes applied**:
  - H3: Dashboard quick links now use next/link instead of plain <a> tags
  - M2: useEffect mock in login form test improved (queueMicrotask instead of synchronous)
  - M3: LogoutButton now shows error state when logout fails (was silent failure)
  - M5: Added error.tsx boundary for dashboard route

### Change Log
- **2026-02-07**: Story created.
- **2026-02-07**: Implemented login form, login/dashboard pages, logout button, and 17 tests.
- **2026-02-07**: Code review fixes — next/link, LogoutButton error handling, error boundary, test improvements. Status → done.
