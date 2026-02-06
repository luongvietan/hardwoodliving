# Story 4.3: Add CTA Buttons and Contact Information Display

**Epic:** 4-Lead Capture & Contact
**Story Key:** 4-3-add-cta-buttons-and-contact-information-display
**Status:** ready-for-dev

## Story Requirements

### User Story

As a **visitor**,
I want **to easily find ways to contact Hardwoodliving throughout the site**,
So that **I can reach out whenever I'm ready**.

### Acceptance Criteria

- [ ] **Given** the site layout and product pages are built
- [ ] **When** a visitor views any product detail page
- [ ] **Then** a clear "Contact" or "Get Consultation" CTA button is visible
- [ ] **And** clicking the CTA scrolls to or navigates to the contact form
- [ ] **And** the homepage also includes a CTA linking to the contact form
- [ ] **And** the phone number and email address are displayed clearly in the site footer and on the contact page
- [ ] **And** CTA buttons have sufficient contrast and are keyboard-accessible

---

## Developer Operations Context

### Architecture & Technical Requirements

**Integration Points:**
- Product Detail Page (add CTA).
- Homepage (add/verify CTA).
- Footer (verify content).
- Contact Page (verify content).

**UX:**
- Smooth scroll to form if on same page (e.g., PDP might have form at bottom).
- Or Link to `/contact`.

### Implementation Guide

1.  **PDP CTA:**
    Add to `ProductPrice` or distinct component.
    Action: Link to `/contact?product=slug` or auto-scroll.

2.  **Footer Info:**
    Hardcode phone/email or fetch from Site Settings (if available).

### Tasks / Subtasks

- [ ] Add CTA to Product Detail Page
- [ ] Ensure CTA passes Product Name to Contact Form (via query param)
- [ ] Verify Homepage CTA
- [ ] Verify Footer Contact Info
- [ ] Verify Contact Page Info

### Change Log
- **2026-02-07**: Story created.
