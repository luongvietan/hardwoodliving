# Story 5.2: Build Trade Registration Form with Database Storage

**Epic:** 5-Trade/Contractor Management
**Story Key:** 5-2-build-trade-registration-form-with-database-storage
**Status:** ready-for-dev

## Story Requirements

### User Story

As a **contractor**,
I want **to register for a trade account by providing my business details**,
So that **I can access wholesale pricing and trade tools**.

### Acceptance Criteria

- [ ] **Given** a visitor is on the Trades page (Story 5.1)
- [ ] **When** they fill out the TradeRegistrationForm
- [ ] **Then** the form captures: Name, Company Name, Business Type, Email, Phone, Password
- [ ] **And** the form submits to a Server Action (`registerTrade`)
- [ ] **And** the Server Action creates a user in Supabase Auth (for login)
- [ ] **And** the Server Action creates a profile record in the Supabase `trades` table
- [ ] **And** on success, the user is automatically logged in or redirected to the Trade Dashboard
- [ ] **And** validation ensures email is unique and password meets complexity rules

---

## Developer Operations Context

### Architecture & Technical Requirements

**Components:**
- `src/components/forms/TradeRegistrationForm.tsx`

**Server Action:**
- `src/lib/actions/trades.ts`: `registerTrade` function.

**Supabase:**
- `auth.signUp`.
- `insert` into `trades` table.

### Implementation Guide

1.  **Form UI:**
    Standard fields.
    Password field (type="password").

2.  **Server Action:**
    `registerTrade`.
    Step 1: `supabase.auth.signUp({ email, password })`.
    Step 2: If auth success, `supabase.from('trades').insert({ ... })`.
    *Note: Handle atomicity—if insert fails, user exists in Auth but not DB. Try/Catch cleanup or minimal profile.*

3.  **Security:**
    Ensure RLS allows `insert` for authenticated user (if inserting own profile) or handle via Service Role if using Admin-created accounts.
    *PRD says "Register". Usually `signUp` returns session. `trades` table insert might need RLS policy: "Auth users can insert their own row".*

### File List
- [ ] src/components/forms/TradeRegistrationForm.tsx
- [ ] src/lib/actions/trades.ts

### Tasks / Subtasks

- [ ] Create `TradeRegistrationForm`
- [ ] Implement `registerTrade` Server Action
- [ ] Connect Auth `signUp`
- [ ] Connect DB `insert`
- [ ] Handle Errors (Email taken, etc.)
- [ ] Verify Redirect to Dashboard

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
