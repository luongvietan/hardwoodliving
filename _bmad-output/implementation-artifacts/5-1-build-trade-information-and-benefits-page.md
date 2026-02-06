# Story 5.1: Build Trade Information and Benefits Page

**Epic:** 5-Trade/Contractor Management
**Story Key:** 5-1-build-trade-information-and-benefits-page
**Status:** ready-for-dev

## Story Requirements

### User Story

As a **contractor or installer**,
I want **to learn about the Trade Program benefits and requirements**,
So that **I can decide if I should register for an account**.

### Acceptance Criteria

- [ ] **Given** the site layout is in place
- [ ] **When** a visitor navigates to the Trades page (`/trades`)
- [ ] **Then** information about trade benefits (pricing, support, etc.) is displayed
- [ ] **And** the content is editable from the CMS (sourced from Sanity `page` or dedicated fields)
- [ ] **And** a clear Call to Action (CTA) allows new users to "Register for Trade Account"
- [ ] **And** a "Login" link is provided for existing trade users
- [ ] **And** the page is accessible to public (unauthenticated) users

---

## Developer Operations Context

### Architecture & Technical Requirements

**Route:**
- `src/app/trades/page.tsx`

**Components:**
- Reuse dynamic page structure or build custom if specific layout needed.
- `src/components/forms/TradeRegistrationForm.tsx` (toggle usage).

**Data:**
- Fetch 'Trades' page content from Sanity (`*[_type == "page" && slug.current == "trades"][0]`).
- Fallback text if CMS page missing.

### Implementation Guide

1.  **Page:**
    `src/app/trades/page.tsx`.
    Fetch content.
    Display "Benefits" section.
    Split layout: Info on left, Login/Register buttons or forms on right.

2.  **Navigation:**
    Add link to Header if not already there.

### File List
- [ ] src/app/trades/page.tsx

### Tasks / Subtasks

- [ ] Create Trades landing page
- [ ] Fetch/Render content from CMS (create 'trades' page in Sanity via Studio manually later)
- [ ] Add Register/Login CTAs (links to frag/components)
- [ ] Verify SEO metadata

### Change Log
- **2026-02-07**: Story created.
