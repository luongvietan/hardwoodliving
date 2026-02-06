# Story 1.2: Configure Sanity CMS Project and Content Schemas

**Epic:** 1-Project Foundation & Site Shell
**Story Key:** 1-2-configure-sanity-cms-project-and-content-schemas
**Status:** ready-for-dev

## Story Requirements

### User Story

As an **admin**,
I want **the Sanity CMS project created with all content schemas defined**,
So that **content types are ready for data entry and the Studio is functional**.

### Acceptance Criteria

- [ ] **Given** the Next.js project is initialized (Story 1.1)
- [ ] **When** the Sanity project is configured with `sanity.config.ts` and `sanity.cli.ts`
- [ ] **Then** the following Sanity document schemas are created:
  - `product` (title, slug, description, specs, price, images[], category ref, visibility, isFeatured)
  - `category` (title, slug, description, image, parent ref for subcategories)
  - `page` (title, slug, body as Portable Text, SEO fields)
  - `homepage` (hero, introBlurb, featuredProducts refs, testimonials) — singleton
  - `testimonial` (author, content, image)
  - `siteSettings` (siteName, logo, navigation, contactInfo, socialLinks) — singleton
- [ ] **And** schemas include validation rules (required fields, slug uniqueness, string lengths)
- [ ] **And** Sanity Studio is accessible at `/admin` via catch-all route `[[...tool]]`
- [ ] **And** Sanity client is configured in `src/lib/sanity/client.ts` with project ID and dataset
- [ ] **And** GROQ query helpers are set up in `src/lib/sanity/queries.ts`
- [ ] **And** Sanity image URL builder is configured in `src/lib/sanity/image.ts`

---

## Developer Operations Context

### Architecture & Technical Requirements

**Technology Stack:**
- **CMS:** Sanity.io
- **Integration:** `next-sanity`

**Schema Definitions:**
Create schema definitions in `src/lib/sanity/schemas/`:
- `product.ts`: Core content type
- `category.ts`: Hierarchical categories
- `page.ts`: Dynamic content pages
- `homepage.ts`: Singleton for homepage content
- `testimonial.ts`: Testimonial object/document
- `siteSettings.ts`: Singleton for global settings

**Configuration:**
- `sanity.config.ts`: Define project ID, dataset, schema types, and plugins (structure tool, vision).
- `src/lib/sanity/client.ts`: Export `client` using `createClient`.
- `src/lib/sanity/image.ts`: Export `urlFor` helper.

### Developer Steps

1.  **Configure Sanity Client:**
    Set up `src/lib/sanity/client.ts` reading env vars.

2.  **Define Schemas:**
    Create individual schema files for each type requested.
    Ensure `visibility` field in `product` supports 'public', 'wholesale', 'hidden'.

3.  **Setup Studio:**
    Ensure `src/app/admin/[[...tool]]/page.tsx` renders `NextStudio`.

4.  **Types:**
    Consider generating types from schemas if possible, or define TypeScript interfaces for the content types in `src/lib/types/sanity.ts`.

### Dev Agent Record

#### Debug Log
*Log any schema validation errors or studio rendering issues.*

#### Completion Notes
*Notes on schema structure and any additional fields added.*

### File List
- [ ] sanity.config.ts
- [ ] sanity.cli.ts
- [ ] src/lib/sanity/client.ts
- [ ] src/lib/sanity/image.ts
- [ ] src/lib/sanity/queries.ts
- [ ] src/lib/sanity/schemas/product.ts
- [ ] src/lib/sanity/schemas/category.ts
- [ ] src/lib/sanity/schemas/page.ts
- [ ] src/lib/sanity/schemas/homepage.ts
- [ ] src/lib/sanity/schemas/testimonial.ts
- [ ] src/lib/sanity/schemas/siteSettings.ts
- [ ] src/lib/sanity/schemas/index.ts
- [ ] src/app/admin/[[...tool]]/page.tsx

### Tasks / Subtasks

- [ ] Create Sanity client configuration
- [ ] Create schema: Product
- [ ] Create schema: Category
- [ ] Create schema: Page
- [ ] Create schema: Homepage (Singleton)
- [ ] Create schema: Site Settings (Singleton)
- [ ] Create schema: Testimonial
- [ ] Register schemas in `index.ts` and `sanity.config.ts`
- [ ] Create Admin Studio route `[[...tool]]`
- [ ] Verify Studio loads at `/admin`
- [ ] Verify schemas appear in Studio

### Change Log
- **2026-02-07**: Story created.
