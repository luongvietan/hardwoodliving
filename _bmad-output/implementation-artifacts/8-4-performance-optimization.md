# Story 8.4: Performance Optimization

**Epic:** 8-SEO, Performance & Launch Readiness
**Story Key:** 8-4-performance-optimization
**Status:** ready-for-dev

## Story Requirements

### User Story

As a **visitor**,
I want **the site to load instantly**,
So that **I don't get frustrated and leave**.

### Acceptance Criteria

- [ ] **Given** the site is feature complete
- [ ] **When** checked against Core Web Vitals
- [ ] **Then** LCP < 2.5s
- [ ] **And** CLS < 0.1
- [ ] **And** Images are properly sized and lazy loaded
- [ ] **And** Fonts are optimized (next/font)

---

## Developer Operations Context

### Architecture & Technical Requirements

**Optimization:**
- `next/image` usage audit.
- `next/font` (Google Fonts).
- Dynamic Imports for heavy components (`ProductGallery`?).

### Implementation Guide

1.  **Audit:** Run Lighthouse.
2.  **Fixes:** Adjust image sizes/priorities. Optimize font loading.

### Tasks / Subtasks

- [ ] Audit Image Usage
- [ ] Verify Font Optimization
- [ ] Implement Dynamic Imports if needed
- [ ] Validate Lighthouse Score

### Change Log
- **2026-02-07**: Story created.
