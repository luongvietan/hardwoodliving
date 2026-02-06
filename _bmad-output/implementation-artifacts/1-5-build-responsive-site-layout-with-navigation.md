# Story 1.5: Build Responsive Site Layout with Navigation

**Epic:** 1-Project Foundation & Site Shell
**Story Key:** 1-5-build-responsive-site-layout-with-navigation
**Status:** ready-for-dev

## Story Requirements

### User Story

As a **visitor**,
I want **a professional website layout with clear navigation to all sections**,
So that **I can easily find products and information on any device**.

### Acceptance Criteria

- [ ] **Given** the project is deployed and accessible
- [ ] **When** a visitor loads any page on the website
- [ ] **Then** the Header displays the Hardwoodliving logo and navigation links to: Flooring, Cabinetry, Visit Us, Care Guide, Why Wood?, Contact, and Trades
- [ ] **And** the Footer displays contact information (phone, email, address), social links, and copyright
- [ ] **And** on mobile devices (< 768px), navigation collapses into a hamburger menu (MobileMenu component)
- [ ] **And** Breadcrumbs component shows the user's current location in the site hierarchy
- [ ] **And** all navigation links are functional (even if destination pages show placeholder content)
- [ ] **And** the layout is responsive: single-column on mobile, proper spacing on tablet, full layout on desktop
- [ ] **And** all public pages are accessible without authentication
- [ ] **And** the Container component enforces consistent max-width and padding across all pages

---

## Developer Operations Context

### Architecture & Technical Requirements

**Components to Build:**
- `src/components/layout/Header.tsx`
- `src/components/layout/Footer.tsx`
- `src/components/layout/Navigation.tsx`
- `src/components/layout/MobileMenu.tsx`
- `src/components/layout/Breadcrumbs.tsx`
- `src/components/layout/Container.tsx`

**Styling:**
- Tailwind CSS.
- Responsive design (md, lg breakpoints).

**Integration:**
- `src/app/layout.tsx` (Update to include Header, Footer, Container).
- `src/components/layout/Navigation.tsx` should use `next/link`.

### Implementation Guide

1.  **Container:**
    Create `Container.tsx` wrapping content with `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`.

2.  **Header:**
    Sticky/fixed header or static. Include Logo and Navigation.
    Desktop: Horizontal links.
    Mobile: Hamburger button.

3.  **Navigation Data:**
    Define links structure:
    ```ts
    const links = [
      { label: 'Flooring', href: '/categories/flooring' },
      { label: 'Cabinetry', href: '/categories/cabinetry' },
      { label: 'Visit Us', href: '/pages/visit-us' },
      // ...
    ]
    ```
    Consider fetching navigation from Sanity `siteSettings` later, but hardcode for now or setup fetch if Schema 1.2 is ready. *Assume hardcoded or basic fetch for MVP.*

4.  **Mobile Menu:**
    Client Component (`use client`) for open/close state.

5.  **Footer:**
    Columns for Contact, Links, Socials.

### Dev Agent Record

#### Debug Log
*Log any layout shifts or responsive issues.*

#### Completion Notes
*Screenshots or confirmation of responsive behavior.*

### File List
- [ ] src/components/layout/Header.tsx
- [ ] src/components/layout/Footer.tsx
- [ ] src/components/layout/Navigation.tsx
- [ ] src/components/layout/MobileMenu.tsx
- [ ] src/components/layout/Breadcrumbs.tsx
- [ ] src/components/layout/Container.tsx
- [ ] src/app/layout.tsx

### Tasks / Subtasks

- [ ] Create `Container` component
- [ ] Create `Navigation` component (Desktop)
- [ ] Create `MobileMenu` component (Client side)
- [ ] Create `Header` component combining Logo, Nav, MobileMenu
- [ ] Create `Footer` component
- [ ] Create `Breadcrumbs` component
- [ ] Update Root Layout (`src/app/layout.tsx`) to implement the shell
- [ ] Verify responsiveness on Mobile, Tablet, Desktop
- [ ] Verify all links work

### Change Log
- **2026-02-07**: Story created.
