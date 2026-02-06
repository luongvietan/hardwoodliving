# Story 5.3: Implement Trade User Authentication

**Epic:** 5-Trade/Contractor Management
**Story Key:** 5-3-implement-trade-user-authentication
**Status:** ready-for-dev

## Story Requirements

### User Story

As a **trade user**,
I want **to log in to my account securely**,
So that **I can view protected content and my profile**.

### Acceptance Criteria

- [ ] **Given** a registered trade user
- [ ] **When** they maximize the TradeLoginForm
- [ ] **Then** they can enter email and password
- [ ] **And** on submit, the system authenticates via Supabase Auth
- [ ] **And** on success, they are redirected to the Trade Dashboard (`/trades/dashboard`)
- [ ] **And** invalid credentials show an error message
- [ ] **And** a "Logout" action is available in the dashboard
- [ ] **And** protected routes (`/trades/dashboard`, `/products` wholesale view) require authentication

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
- [ ] src/components/forms/TradeLoginForm.tsx
- [ ] src/app/trades/login/page.tsx
- [ ] src/app/trades/dashboard/page.tsx

### Tasks / Subtasks

- [ ] Create `TradeLoginForm`
- [ ] Implement `loginTrade` Action
- [ ] Implement `logoutTrade` Action
- [ ] Create Protected Dashboard Page
- [ ] Verify Login Flow
- [ ] Verify Logout Flow
- [ ] Verify Middleware protection

### Change Log
- **2026-02-07**: Story created.
