# Story 4.1: Build Contact/Consultation Form

**Epic:** 4-Lead Capture & Contact
**Story Key:** 4-1-build-contact-consultation-form
**Status:** ready-for-dev

## Story Requirements

### User Story

As a **visitor**,
I want **to submit a consultation request with my contact details and inquiry**,
So that **Hardwoodliving can follow up with personalized advice**.

### Acceptance Criteria

- [ ] **Given** a visitor is on a product detail page or the contact page (`/contact`)
- [ ] **When** the visitor fills out the ContactForm component
- [ ] **Then** the form includes fields: name (required), email (required), phone, product interest, room type, area, budget, and message
- [ ] **And** client-side validation prevents submission of invalid data
- [ ] **And** the form is a Client Component using `useActionState` and `useFormStatus` hooks
- [ ] **And** the form is accessible: labels associated with inputs, validation errors announced
- [ ] **And** touch targets are ≥ 44×44px on mobile

---

## Developer Operations Context

### Architecture & Technical Requirements

**Component:**
- `src/components/forms/ContactForm.tsx`

**Tech:**
- React Server Actions (Next.js basics).
- `useActionState` (React 19 / Next.js 15 pattern) or `useFormState` (older). Assume `useActionState` if on latest React, otherwise `useFormState`. *Note: Project initialized with latest Next.js likely uses `useActionState` if React 19 RC, or `useFormState` if React 18. Stick to stable `useActionState` if available, else `useFormState`.*
- `zod` for validation (optional but recommended).

### Implementation Guide

1.  **Form Layout:**
    Responsive grid.
    Input fields with labels.

2.  **Validation:**
    HTML5 attributes (`required`, `type="email"`).
    JS validation before submit (optional, server validation is key).

3.  **Route:**
    Contact Page: `src/app/contact/page.tsx`.

### File List
- [ ] src/components/forms/ContactForm.tsx
- [ ] src/app/contact/page.tsx

### Tasks / Subtasks

- [ ] Create `ContactForm` component skeleton
- [ ] Add Form Fields (Name, Email, details...)
- [ ] Implement `src/app/contact/page.tsx`
- [ ] Add basic client-side validation
- [ ] Apply styling (Tailwind)
- [ ] Verify Accessibility (labels, focus)

### Change Log
- **2026-02-07**: Story created.
