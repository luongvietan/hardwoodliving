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

### Change Log
- **2026-02-07**: Story created.
