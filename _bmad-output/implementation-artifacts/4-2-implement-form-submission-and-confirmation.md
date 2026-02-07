# Story 4.2: Implement Form Submission and Confirmation

**Epic:** 4-Lead Capture & Contact
**Story Key:** 4-2-implement-form-submission-and-confirmation
**Status:** ready-for-dev

## Story Requirements

### User Story

As a **visitor**,
I want **to receive confirmation that my inquiry was successfully submitted**,
So that **I know the business will follow up**.

### Acceptance Criteria

- [ ] **Given** the visitor has filled out the contact form correctly (Story 4.1)
- [ ] **When** the visitor submits the form
- [ ] **Then** the form data is sent via a Server Action (`submitContactForm`) to Supabase `inquiries` table
- [ ] **And** server-side validation re-validates all fields before insertion
- [ ] **And** the Server Action returns an `ActionResult<T>` response
- [ ] **And** on success, a clear confirmation message is displayed
- [ ] **And** on error, a descriptive error message is shown and the user can retry without losing entered data
- [ ] **And** the submit button shows a loading state during submission
- [ ] **And** the form processes and confirms within 2 seconds

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
- [ ] src/lib/actions/contact.ts

### Tasks / Subtasks

- [ ] Create Server Action `submitContactForm`
- [ ] Implement Server-side Validation
- [ ] Implement Supabase Insert strategy
- [ ] Connect Action to `ContactForm`
- [ ] Implement Loading State
- [ ] Implement Success/Error UI
- [ ] Verify Data in Supabase

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
