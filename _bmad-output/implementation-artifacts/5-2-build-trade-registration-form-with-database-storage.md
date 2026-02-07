# Story 5.2: Build Trade Registration Form with Database Storage

**Epic:** 5-Trade/Contractor Management
**Story Key:** 5-2-build-trade-registration-form-with-database-storage
**Status:** done

## Story Requirements

### User Story

As a **contractor**,
I want **to register for a trade account by providing my business details**,
So that **I can access wholesale pricing and trade tools**.

### Acceptance Criteria

- [x] **Given** a visitor is on the Trades page (Story 5.1)
- [x] **When** they fill out the TradeRegistrationForm
- [x] **Then** the form captures: Name, Company Name, Business Type, Email, Phone, Password
- [x] **And** the form submits to a Server Action (`registerTrade`)
- [x] **And** the Server Action creates a user in Supabase Auth (for login)
- [x] **And** the Server Action creates a profile record in the Supabase `trades` table
- [x] **And** on success, the user is automatically logged in or redirected to the Trade Dashboard
- [x] **And** validation ensures email is unique and password meets complexity rules

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
- [x] src/components/forms/TradeRegistrationForm.tsx (new - registration form component)
- [x] src/components/forms/TradeRegistrationForm.test.tsx (new - 15 tests)
- [x] src/components/forms/FormField.tsx (new - shared SubmitButton, FieldError, getFieldError)
- [x] src/lib/actions/trades.ts (new - registerTrade, loginTrade, logoutTrade server actions)
- [x] src/lib/actions/trades.test.ts (new - 25 tests)
- [x] src/lib/utils/rate-limit.ts (new - in-memory rate limiter for server actions)
- [x] src/app/(site)/trades/register/page.tsx (new - registration page)

### Tasks / Subtasks

- [x] Create `TradeRegistrationForm`
- [x] Implement `registerTrade` Server Action
- [x] Connect Auth `signUp`
- [x] Connect DB `insert`
- [x] Handle Errors (Email taken, etc.)
- [x] Verify Redirect to Dashboard

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
- Created TradeRegistrationForm client component with fields: Name, Company, Business Type (select), Email, Phone, Password
- Created registerTrade server action with Zod validation, Supabase auth.signUp, and trades table insert
- Also created loginTrade and logoutTrade server actions (needed for stories 5-3)
- Registration page at /trades/register with SEO metadata
- Form shows success state with link to login after registration
- Handles duplicate email, auth errors, and DB insert failures gracefully

**Completion Notes:**
- 36 new tests pass (15 form component + 21 server action)
- Password validation: minimum 8 characters
- Business types: General Contractor, Flooring Installer, Interior Designer, Architect, Builder/Developer, Property Manager, Renovation Specialist, Other
- Trade profile insert failure doesn't block registration (graceful degradation)

### Senior Developer Review (AI)
- **Reviewer**: Viet An
- **Date**: 2026-02-07
- **Outcome**: Approved after fixes
- **Fixes applied**:
  - H1: Registration now auto-redirects to dashboard when Supabase creates a session (no email confirmation); shows verify email message otherwise
  - H2: Password validation strengthened — requires uppercase, lowercase, and number (was min 8 only)
  - H4: Email enumeration vulnerability fixed — auth errors return generic message
  - M1: Extracted shared FormField components (SubmitButton, FieldError, getFieldError) to reduce duplication
  - M4: Added in-memory rate limiting (5 reg/min, 10 login/min per IP)
- Tests: 25 server action tests pass (was 21, +4 new for password rules, session redirect, rate limit)

### Change Log
- **2026-02-07**: Story created.
- **2026-02-07**: Implemented trade registration form, server actions (register/login/logout), and 36 tests.
- **2026-02-07**: Code review fixes — auto-redirect, password complexity, email enumeration fix, shared components, rate limiting. Status → done.
