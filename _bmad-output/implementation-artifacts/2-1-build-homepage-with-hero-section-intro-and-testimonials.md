# Story 2.1: Build Homepage with Hero Section, Intro, and Testimonials

**Epic:** 2-Homepage & Content Discovery
**Story Key:** 2-1-build-homepage-with-hero-section-intro-and-testimonials
**Status:** ready-for-dev

## Story Requirements

### User Story

As a **visitor**,
I want **to see the Hardwoodliving homepage with brand imagery, an introduction, and customer testimonials**,
So that **I understand what the company offers and feel confident in the brand quality**.

### Acceptance Criteria

- [ ] **Given** the site layout is in place (Epic 1)
- [ ] **When** a visitor navigates to the homepage (`/`)
- [ ] **Then** the HeroSection displays a prominent image with a headline and call-to-action
- [ ] **And** the IntroBlurb section shows introductory text about Hardwoodliving
- [ ] **And** the Testimonials section displays customer testimonials from Sanity
- [ ] **And** all content is sourced dynamically from the Sanity `homepage` singleton document
- [ ] **And** the page uses ISR with on-demand revalidation via Sanity webhook
- [ ] **And** the page renders server-side for SEO
- [ ] **And** the page loads within LCP < 2.5s on 4G

---

## Developer Operations Context

### Architecture & Technical Requirements

**Components:**
- `src/components/home/HeroSection.tsx`
- `src/components/home/IntroBlurb.tsx`
- `src/components/home/Testimonials.tsx`
- `src/app/page.tsx` (Homepage)

**Data Fetching:**
- Sanity GROQ Query: Fetch `homepage` singleton.
- Fields: `heroImage`, `heroHeading`, `heroSubheading`, `heroCta`, `introHeading`, `introText`, `testimonials[]->`

**Performance:**
- Use `NextImage` for Hero Image (Priority: true).
- ISR: `export const revalidate = 60` (or purely on-demand).

### Implementation Guide

1.  **Sanity Query:**
    Define query in `src/lib/sanity/queries.ts` to get homepage data including testimonial references.

2.  **Hero Section:**
    Full width or container width. Text overlay. CTA button linking to Contact or Products.

3.  **Intro Blurb:**
    Simple text section.

4.  **Testimonials:**
    Grid or carousel of testimonial cards.

5.  **Page Assembly:**
    `src/app/page.tsx` fetches data and renders components. Handle case where data is missing (fallback or skeleton).

### Dev Agent Record

#### Debug Log
*Log any ISR issues or Sanity fetch errors.*

#### Completion Notes
*LCP score check.*

### File List
- [ ] src/components/home/HeroSection.tsx
- [ ] src/components/home/IntroBlurb.tsx
- [ ] src/components/home/Testimonials.tsx
- [ ] src/app/page.tsx

### Tasks / Subtasks

- [ ] Define Homepage GROQ query
- [ ] Create `HeroSection` component
- [ ] Create `IntroBlurb` component
- [ ] Create `Testimonials` component
- [ ] Implement `src/app/page.tsx` fetching logic
- [ ] Integrate Sanity data mapping
- [ ] Verify local build and performance
- [ ] Implement ISR/Revalidation logic (basic setup)

### Change Log
- **2026-02-07**: Story created.
