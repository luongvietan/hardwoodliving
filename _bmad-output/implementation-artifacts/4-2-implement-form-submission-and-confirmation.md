# Story 4.2: Implement Form Submission and Confirmation

**Epic:** 4-Lead Capture & Contact
**Story Key:** 4-2-implement-form-submission-and-confirmation
**Status:** done

## Story Requirements

### User Story

As a **visitor**,
I want **to receive confirmation that my inquiry was successfully submitted**,
So that **I know the business will follow up**.

### Acceptance Criteria

- [x] **Given** the visitor has filled out the contact form correctly (Story 4.1)
- [x] **When** the visitor submits the form
- [x] **Then** the form data is sent via a Server Action (`submitContactForm`) to Supabase `inquiries` table
- [x] **And** server-side validation re-validates all fields before insertion
- [x] **And** the Server Action returns an `ActionResult<T>` response
- [x] **And** on success, a clear confirmation message is displayed
- [x] **And** on error, a descriptive error message is shown and the user can retry without losing entered data
- [x] **And** the submit button shows a loading state during submission
- [x] **And** the form processes and confirms within 2 seconds

---

## Developer Operations Context

### Architecture & Technical Requirements

**Server Action:**
- `src/lib/actions/contact.ts`

**Database:**
- Supabase `inquiries` table.

**Types:**
- `ActionResult` type (success/error/fieldErrors).

### Implementation Guide

1.  **Define Action:**
    `export async function submitContactForm(prevState: any, formData: FormData)`
    Validate data (Zod).
    Insert into Supabase.
    Return success/error.

2.  **Form Component:**
    Integrate `useActionState` with `submitContactForm`.
    Handle Loading (`useFormStatus` or `pending`).
    Show Confirmation UI on success.

### File List
- [x] src/lib/actions/contact.ts (modified - added Supabase insert)
- [x] src/lib/actions/contact.test.ts (new - 15 tests)
- [x] package.json (modified - zod dependency for server-side validation)

### Tasks / Subtasks

- [x] Create Server Action `submitContactForm`
- [x] Implement Server-side Validation
- [x] Implement Supabase Insert strategy
- [x] Connect Action to `ContactForm`
- [x] Implement Loading State
- [x] Implement Success/Error UI
- [x] Verify Data in Supabase

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
- `submitContactForm` server action with zod schema validation
- On validation fail: returns `ActionResult` with `fieldErrors` map and error message
- On validation pass: inserts into Supabase `inquiries` table with null for empty optional fields
- On Supabase error: catches error, logs, returns user-friendly error message
- On unexpected exception: catches, logs, returns generic error message
- `ActionResult` type: `{ success: boolean; message?: string; fieldErrors?: Record<string, string> }`
- Loading state via `useFormStatus` `pending` prop → button shows "Submitting…" and is disabled
- Success UI: green confirmation card with checkmark icon replacing the form
- Error UI: red alert at top of form with descriptive message, form data preserved for retry

**Completion Notes:**
- 15 server action tests covering: schema validation (7 tests), submission flow (8 tests including success, error, exception, null fields, validation bypass prevention)
- Full regression suite: 211/211 tests pass
- `useActionState` form data is preserved on error since React maintains the form state

### Senior Developer Review (AI)

**Reviewer:** Viet An (AI) | **Date:** 2026-02-07

**Fixes Applied:**
1. **H1 FIXED** — `ActionResult` type refactored to match architecture discriminated union: `ActionResult<T>` with `data: T` on success, `error: string` on failure, `fieldErrors?: Record<string, string[]>`. Type moved to `src/lib/types/actions.ts`.
2. **M1 FIXED** — Added `package.json` to File List.

**Outcome:** APPROVED — 211/211 tests pass.

### Change Log
- **2026-02-07**: Story created.
- **2026-02-07**: Implemented server action with zod validation + Supabase insert. 15 tests written. 208/208 tests pass.
- **2026-02-07**: [Code Review] Refactored ActionResult to architecture-compliant discriminated union. Updated tests to verify string[] fieldErrors and proper data/error fields. 211/211 tests pass.
