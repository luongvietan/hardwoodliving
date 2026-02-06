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

### Change Log
- **2026-02-07**: Story created.
