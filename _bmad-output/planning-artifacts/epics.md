---
stepsCompleted: [1, 2, 3, 4]
inputDocuments: ['prd.md', 'architecture.md']
workflowType: 'epics-and-stories'
project_name: 'hardwoodliving'
user_name: 'Viet An'
date: '2026-02-07'
lastStep: 4
status: 'complete'
---

# hardwoodliving - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for hardwoodliving, decomposing the requirements from the PRD and Architecture into implementable stories organized by user value. Each story is sized for a single dev agent, includes complete acceptance criteria, and references the specific FRs it implements.

## Requirements Inventory

### Functional Requirements

FR1: Users can navigate between product categories (flooring, cabinetry, etc.) and content pages (Visit Us, Care Guide, Why Wood?) through persistent navigation with labeled links to all top-level categories and content pages
FR2: Users can browse products organized by categories and subcategories
FR3: Users can filter products by basic criteria (category, product type)
FR4: Users can access the homepage displaying hero section, introductory content, featured products, and testimonials
FR5: Users can navigate the website on desktop, tablet, and mobile devices with responsive layouts
FR6: Users can access dynamic content pages (Visit Us, Care Guide, Why Wood?, etc.) with content editable from CMS
FR7: Users can view a product catalog page showing products (minimum 6 per page or all in category) with thumbnail image, name, and price
FR8: Users can view individual product detail pages containing name, description, technical specifications, sale price, and image gallery
FR9: Users can view product images in a gallery format with at least 2 images per product
FR10: Users can see product pricing information displayed publicly on product detail pages
FR11: Users can identify featured products highlighted in special sections (homepage, featured collections)
FR12: Users can view products with different visibility settings (Public, Wholesale-only, Hidden/Draft) based on their access level
FR13: Users can submit contact/consultation forms from product detail pages and homepage
FR14: Users can provide contact information and inquiry details (product interest, room type, area, budget) through contact forms
FR15: Users can see clear call-to-action buttons ("Contact" or "Get Consultation") on product pages
FR16: Users receive confirmation feedback after successfully submitting contact forms
FR17: The system stores contact form submissions as structured data in the database for follow-up
FR18: Users can access contact information (phone number, email) displayed clearly on the website
FR19: Trade users (contractors, installers) can register through a form providing name, company, business type, and contact information
FR20: Trade users can log in to access trade-specific content or features
FR21: Trade users can view information about trade benefits and programs
FR22: The system stores trade registration data in the database for marketing and follow-up
FR23: Trade users receive confirmation after successful registration
FR24: Admin users can access the CMS admin panel at `/admin` after authentication
FR25: Admin users can create, edit, and delete products
FR26: Admin users can manage product fields: title, description, technical specifications, price
FR27: Admin users can set product visibility (Public, Wholesale-only, Hidden/Draft)
FR28: Admin users can mark products as "Featured" for homepage and collection highlights
FR29: Admin users can create, edit, and delete product categories and subcategories
FR30: Admin users can upload images to the media library
FR31: Admin users can attach images to products and homepage sections
FR32: Admin users can preview content before publishing
FR33: Admin users can create, edit, and delete dynamic content pages
FR34: Admin users can manage page content: title, slug, body (rich text)
FR35: Admin users can publish content changes that appear on the website without developer intervention
FR36: Admin users can view and manage trades user registrations
FR37: Admin users can view and manage contact form submissions (inquiries)
FR38: Admin users can export trades user data to CSV/Excel format
FR39: Admin users can export inquiry/contact form data to CSV/Excel format
FR40: Admin users can view lists of registered trades users with full details (name, company, business type, contact)
FR41: Admin users can view lists of inquiries with submission details
FR42: Admin users can filter and sort trades and inquiries by date and type
FR43: Admin users can authenticate to access the CMS admin panel
FR44: Trade users can authenticate to access trade-specific areas
FR45: The system enforces role-based access control: admin functions restricted to authenticated admin users
FR46: Public users can access all public content without authentication
FR47: The system delivers CMS content to public-facing pages dynamically
FR48: The system optimizes images for different device sizes and connection speeds
FR49: The system loads homepage, catalog, and product detail pages within Core Web Vitals thresholds
FR50: The system displays branded error pages (404, 500) with navigation links to homepage and product catalog when errors occur

### NonFunctional Requirements

NFR1: LCP < 2.5s on 4G for homepage, catalog, and product pages
NFR2: LCP < 1.5s on broadband/WiFi for homepage
NFR3: FID < 100ms for all interactive elements
NFR4: CLS < 0.1 across all pages
NFR5: TTI < 3.5s on 4G for critical user paths
NFR6: Product images automatically optimized for device size and connection speed
NFR7: Images served in modern formats (WebP/AVIF) with JPEG/PNG fallback
NFR8: Below-the-fold images lazy loaded
NFR9: CMS content API responses < 500ms
NFR10: Database queries < 300ms for standard operations
NFR11: Form submissions process and confirm within 2 seconds
NFR12: Initial JS bundle < 200KB gzipped
NFR13: Static pages cached at edge with on-demand revalidation
NFR14: All data transmission encrypted via HTTPS/TLS
NFR15: Sensitive data encrypted at rest
NFR16: Authentication credentials stored with industry-standard hashing
NFR17: CMS admin requires authentication with secure session management
NFR18: Trade user authentication uses secure token-based sessions
NFR19: Public content accessible without authentication; admin restricted
NFR20: All form inputs validated client-side and server-side
NFR21: File uploads validated for type and size
NFR22: Database queries protected against SQL injection attacks
NFR23: Contact and trades data accessible only to authorized admins
NFR24: No user tracking without explicit consent
NFR25: Personal information handled per PIPEDA
NFR26: Text contrast ratio ≥ 4.5:1 (normal) and ≥ 3:1 (large)
NFR27: All interactive elements keyboard accessible with focus indicators
NFR28: All informative images have meaningful alt text
NFR29: Website navigable via screen readers
NFR30: Document structure uses semantic markup for accessibility and SEO
NFR31: Form labels properly associated with input fields
NFR32: ARIA labels for complex components
NFR33: Skip navigation links for keyboard users
NFR34: Readable and functional at 200% zoom
NFR35: Touch targets ≥ 44×44px on mobile
NFR36: Form validation errors announced to screen readers
NFR37: 99% uptime during business hours
NFR38: Website remains accessible during single-server failures
NFR39: API failures handled gracefully with descriptive error messages
NFR40: Custom 404 pages with helpful navigation
NFR41: Form submission failures display clear errors; user can retry without data loss
NFR42: Individual component failures isolated, do not cascade
NFR43: Form submissions reliably stored with retry mechanism
NFR44: CMS content updates are atomic
NFR45: Database backups performed automatically
NFR46: Unique meta titles (≤60 chars) and descriptions (≤160 chars), CMS-editable
NFR47: Clean semantic URLs without query parameters for content
NFR48: Auto-generated XML sitemap at /sitemap.xml
NFR49: Robots.txt configured to allow crawling, block admin
NFR50: JSON-LD Organization schema on homepage
NFR51: Product schema markup on all product detail pages
NFR52: BreadcrumbList schema for navigation
NFR53: Proper heading hierarchy (H1-H6)
NFR54: All images have descriptive alt text
NFR55: Internal linking between related products and content pages
NFR56: 301 redirects from old CodeIgniter URLs
NFR57: Canonical URLs to prevent duplicate content
NFR58: Fully functional on latest 2 versions of Chrome, Firefox, Safari, Edge (desktop)
NFR59: Fully functional on iOS Safari and Chrome Mobile (latest 2 versions)
NFR60: Core functionality works on older browsers with graceful degradation
NFR61: Optimal viewing on desktop (≥1024px), tablet (768-1024px), mobile (<768px)
NFR62: Layout adapts fluidly between breakpoints
NFR63: Touch interactions work correctly on mobile/tablet
NFR64: Mobile-first design: 1-column mobile, 2-column tablet, 3-4 columns desktop

### Additional Requirements

**From Architecture Document:**
- Starter template: `create-next-app` with TypeScript, Tailwind, ESLint, App Router, src directory — this MUST be Epic 1 Story 1
- Sanity CMS schemas: product, category, page, homepage, testimonial, siteSettings
- Supabase tables: trades (id, name, company, business_type, email, phone, created_at, status), inquiries (id, name, email, phone, product_interest, room_type, area, budget, message, created_at, status)
- Supabase RLS policies for trades and inquiries tables
- ISR (Incremental Static Regeneration) with on-demand revalidation via Sanity webhooks
- Sanity Studio embedded at /admin via catch-all route `[[...tool]]`
- Supabase Auth for trade users (email/password, HTTP-only cookies via @supabase/ssr)
- Sanity built-in auth for CMS admin
- Server Actions for all form submissions (ActionResult<T> pattern)
- Server Components by default, Client Components only for interactivity
- No external state management library
- Environment variables for Sanity, Supabase, and app configuration
- Vercel deployment: staging (hardwoodliving.net) + production (hardwoodliving.com)
- GitHub CI/CD to Vercel (push to staging branch → staging deploy, merge to main → production)
- Next.js middleware for Supabase auth token refresh
- Content Security Policy headers in next.config.ts
- Rate limiting on form submissions
- /api/revalidate route handler for Sanity webhook
- /api/export route handler for CSV/Excel admin export
- Draft mode enable/disable API routes for Sanity preview

### FR Coverage Map

FR1: Epic 1 — Persistent navigation with category and page links
FR2: Epic 3 — Product catalog organized by categories/subcategories
FR3: Epic 3 — Product filtering by category and type
FR4: Epic 2 — Homepage hero, intro, featured products, testimonials
FR5: Epic 1 — Responsive layouts across desktop, tablet, mobile
FR6: Epic 2 — Dynamic CMS-editable content pages
FR7: Epic 3 — Product catalog page with thumbnails, names, prices
FR8: Epic 3 — Product detail page with full information
FR9: Epic 3 — Product image gallery (≥ 2 images per product)
FR10: Epic 3 — Public pricing on product detail pages
FR11: Epic 2 — Featured products on homepage and collections
FR12: Epic 3 — Product visibility levels (Public/Wholesale/Hidden)
FR13: Epic 4 — Contact/consultation forms on product pages and homepage
FR14: Epic 4 — Contact form with inquiry details (product, room, area, budget)
FR15: Epic 4 — CTA buttons on product pages
FR16: Epic 4 — Confirmation feedback after form submission
FR17: Epic 4 — Contact form data stored in Supabase
FR18: Epic 4 — Phone/email displayed on website
FR19: Epic 5 — Trade registration form
FR20: Epic 5 — Trade user login
FR21: Epic 5 — Trade benefits and programs information
FR22: Epic 5 — Trade registration data stored in Supabase
FR23: Epic 5 — Trade registration confirmation
FR24: Epic 6 — CMS admin access at /admin
FR25: Epic 6 — Product CRUD in CMS
FR26: Epic 6 — Product field management
FR27: Epic 6 — Product visibility settings in CMS
FR28: Epic 6 — Featured product flag in CMS
FR29: Epic 6 — Category/subcategory CRUD
FR30: Epic 6 — Media library upload
FR31: Epic 6 — Image attachment to products/pages
FR32: Epic 6 — Content preview before publish
FR33: Epic 6 — Dynamic page CRUD
FR34: Epic 6 — Page content management (title, slug, rich text)
FR35: Epic 6 — Publish changes without developer
FR36: Epic 7 — View/manage trades registrations
FR37: Epic 7 — View/manage contact inquiries
FR38: Epic 7 — Export trades to CSV/Excel
FR39: Epic 7 — Export inquiries to CSV/Excel
FR40: Epic 7 — Trades list with full details
FR41: Epic 7 — Inquiries list with details
FR42: Epic 7 — Filter/sort by date and type
FR43: Epic 6 — Admin CMS authentication
FR44: Epic 5 — Trade user authentication
FR45: Epic 5 — Role-based access control enforcement
FR46: Epic 1 — Public access without authentication
FR47: Epic 2 — Dynamic CMS content delivery to pages
FR48: Epic 3 — Image optimization for devices/speeds
FR49: Epic 8 — Core Web Vitals compliance
FR50: Epic 8 — Branded error pages (404, 500)

**Coverage Summary:** 50/50 FRs mapped (100%)

## Epic List

### Epic 1: Project Foundation & Site Shell
Users can visit the Hardwoodliving website and see a professional, responsive layout with clear navigation across all device types. This epic establishes the entire technical foundation.
**FRs covered:** FR1, FR5, FR46

### Epic 2: Homepage & Content Discovery
Visitors can experience the Hardwoodliving brand through the homepage and informational content pages, learning about the company and its products.
**FRs covered:** FR4, FR6, FR11, FR47

### Epic 3: Product Catalog & Browsing
Users can browse products by category, view detailed product information with images and pricing, and filter products to find what they need.
**FRs covered:** FR2, FR3, FR7, FR8, FR9, FR10, FR12, FR48

### Epic 4: Lead Capture & Contact
Visitors can submit consultation requests, contact the business, and receive confirmation — enabling the core lead generation business goal.
**FRs covered:** FR13, FR14, FR15, FR16, FR17, FR18

### Epic 5: Trade User Registration & Access
Contractors and installers can register, log in, and access trade-specific content and pricing, establishing the trade user pipeline.
**FRs covered:** FR19, FR20, FR21, FR22, FR23, FR44, FR45

### Epic 6: CMS Admin & Content Management
Admin (Romeo or data entry staff) can manage all site content — products, categories, pages, media — independently through the CMS without developer intervention.
**FRs covered:** FR24, FR25, FR26, FR27, FR28, FR29, FR30, FR31, FR32, FR33, FR34, FR35, FR43

### Epic 7: Data Export & Lead Management
Admin can view, filter, sort, and export trade registrations and contact inquiries for follow-up and marketing activities.
**FRs covered:** FR36, FR37, FR38, FR39, FR40, FR41, FR42

### Epic 8: SEO, Performance & Launch Readiness
The site meets all quality standards — SEO, performance, accessibility, error handling — and is deployed to production, ready for customers.
**FRs covered:** FR49, FR50
**NFR coverage:** NFR1-NFR64

---

## Epic 1: Project Foundation & Site Shell

**Goal:** Users can visit the Hardwoodliving website on staging and see a professional, responsive layout with clear navigation to all product categories and content pages. This epic establishes the entire technical stack and deployment pipeline.

**FRs:** FR1, FR5, FR46
**Architecture refs:** Starter template (create-next-app), Sanity schemas, Supabase tables, Vercel deployment

### Story 1.1: Initialize Next.js Project from Starter Template

As a **developer**,
I want **the project initialized from `create-next-app` with all core dependencies installed**,
So that **all future development has a consistent, working foundation**.

**Acceptance Criteria:**

**Given** no project exists yet
**When** the developer runs `npx create-next-app@latest hardwoodliving --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"`
**Then** the project is created with TypeScript, Tailwind CSS, ESLint, App Router, and `src/` directory structure
**And** `next-sanity`, `@sanity/image-url`, `@sanity/vision`, `sanity` are installed
**And** `@supabase/supabase-js`, `@supabase/ssr` are installed
**And** TypeScript strict mode is enabled in `tsconfig.json`
**And** the project runs successfully on `localhost:3000`
**And** `.env.example` file is created with all required environment variable templates
**And** `.gitignore` includes `.env.local` and other sensitive files
**And** the project directory structure matches the Architecture document layout

### Story 1.2: Configure Sanity CMS Project and Content Schemas

As an **admin**,
I want **the Sanity CMS project created with all content schemas defined**,
So that **content types are ready for data entry and the Studio is functional**.

**Acceptance Criteria:**

**Given** the Next.js project is initialized (Story 1.1)
**When** the Sanity project is configured with `sanity.config.ts` and `sanity.cli.ts`
**Then** the following Sanity document schemas are created:
  - `product` (title, slug, description, specs, price, images[], category ref, visibility, isFeatured)
  - `category` (title, slug, description, image, parent ref for subcategories)
  - `page` (title, slug, body as Portable Text, SEO fields)
  - `homepage` (hero, introBlurb, featuredProducts refs, testimonials) — singleton
  - `testimonial` (author, content, image)
  - `siteSettings` (siteName, logo, navigation, contactInfo, socialLinks) — singleton
**And** schemas include validation rules (required fields, slug uniqueness, string lengths)
**And** Sanity Studio is accessible at `/admin` via catch-all route `[[...tool]]`
**And** Sanity client is configured in `src/lib/sanity/client.ts` with project ID and dataset
**And** GROQ query helpers are set up in `src/lib/sanity/queries.ts`
**And** Sanity image URL builder is configured in `src/lib/sanity/image.ts`

### Story 1.3: Configure Supabase Database and Security Policies

As a **developer**,
I want **the Supabase project set up with tables and row-level security**,
So that **transactional data (trades, inquiries) can be securely stored and queried**.

**Acceptance Criteria:**

**Given** the Next.js project is initialized (Story 1.1)
**When** the Supabase project is configured
**Then** the `trades` table is created with columns: id (uuid, PK), name (text, not null), company (text, nullable), business_type (text, not null), email (text, not null), phone (text), created_at (timestamptz), status (text, default 'pending')
**And** the `inquiries` table is created with columns: id (uuid, PK), name (text, not null), email (text, not null), phone (text), product_interest (text), room_type (text), area (text), budget (text), message (text), created_at (timestamptz), status (text, default 'new')
**And** RLS policies restrict read access on `trades` and `inquiries` to authenticated admin users only
**And** RLS policies allow anonymous inserts to `trades` and `inquiries` (for public form submissions)
**And** Supabase Auth is enabled for email/password authentication
**And** Supabase server client is configured in `src/lib/supabase/server.ts`
**And** Supabase browser client is configured in `src/lib/supabase/client.ts`
**And** Supabase middleware helper is created in `src/lib/supabase/middleware.ts`

### Story 1.4: Set Up Vercel Deployment with GitHub CI/CD

As a **developer**,
I want **the deployment pipeline configured with staging and production environments**,
So that **code changes are automatically deployed and the site is accessible online**.

**Acceptance Criteria:**

**Given** the project has a GitHub repository (Story 1.1)
**When** Vercel is connected to the GitHub repository
**Then** pushes to the `staging` branch auto-deploy to `hardwoodliving.net` (staging)
**And** pushes to the `main` branch auto-deploy to `hardwoodliving.com` (production)
**And** all environment variables (Sanity, Supabase, app) are configured in Vercel
**And** preview deployments are generated for pull requests
**And** DNS for both domains is configured at WHC pointing to Vercel
**And** HTTPS/SSL is verified on both staging and production
**And** a successful deployment to staging is confirmed with the default page loading

### Story 1.5: Build Responsive Site Layout with Navigation

As a **visitor**,
I want **a professional website layout with clear navigation to all sections**,
So that **I can easily find products and information on any device**.

**Acceptance Criteria:**

**Given** the project is deployed and accessible (Stories 1.1–1.4)
**When** a visitor loads any page on the website
**Then** the Header displays the Hardwoodliving logo and navigation links to: Flooring, Cabinetry (and other top-level product categories), Visit Us, Care Guide, Why Wood?, Contact, and Trades
**And** the Footer displays contact information (phone, email, address), social links, and copyright
**And** on mobile devices (< 768px), navigation collapses into a hamburger menu (MobileMenu component)
**And** Breadcrumbs component shows the user's current location in the site hierarchy
**And** all navigation links are functional (even if destination pages show placeholder content)
**And** the layout is responsive: single-column on mobile, proper spacing on tablet, full layout on desktop
**And** all public pages are accessible without authentication (FR46)
**And** the Container component enforces consistent max-width and padding across all pages

---

## Epic 2: Homepage & Content Discovery

**Goal:** Visitors can experience the Hardwoodliving brand through the homepage and browse informational content pages (Visit Us, Care Guide, Why Wood?), building trust and understanding of the company's offerings.

**FRs:** FR4, FR6, FR11, FR47
**Dependencies:** Epic 1 (layout, Sanity integration)

### Story 2.1: Build Homepage with Hero Section, Intro, and Testimonials

As a **visitor**,
I want **to see the Hardwoodliving homepage with brand imagery, an introduction, and customer testimonials**,
So that **I understand what the company offers and feel confident in the brand quality**.

**Acceptance Criteria:**

**Given** the site layout is in place (Epic 1)
**When** a visitor navigates to the homepage (`/`)
**Then** the HeroSection displays a prominent image with a headline and call-to-action
**And** the IntroBlurb section shows introductory text about Hardwoodliving
**And** the Testimonials section displays customer testimonials from Sanity
**And** all content is sourced dynamically from the Sanity `homepage` singleton document
**And** the page uses ISR with on-demand revalidation via Sanity webhook
**And** the page renders server-side for SEO (FR47)
**And** the page loads within LCP < 2.5s on 4G (target)

### Story 2.2: Display Featured Products on Homepage

As a **visitor**,
I want **to see highlighted featured products on the homepage**,
So that **I can quickly discover popular and recommended products**.

**Acceptance Criteria:**

**Given** the homepage is built (Story 2.1) and products exist in Sanity with `isFeatured: true`
**When** the homepage loads
**Then** the FeaturedProducts section displays products marked as featured from Sanity
**And** each featured product shows a thumbnail image, product name, and price
**And** each featured product links to its product detail page (`/products/[slug]`)
**And** the section updates dynamically when admin changes featured products in CMS
**And** if no featured products exist, the section is hidden gracefully

### Story 2.3: Build Dynamic CMS-Editable Content Pages

As a **visitor**,
I want **to read informational pages like Visit Us, Care Guide, and Why Wood?**,
So that **I can learn about wood products, care, and the Hardwoodliving store**.

**Acceptance Criteria:**

**Given** the site layout is in place (Epic 1) and Sanity `page` schema is configured
**When** a visitor navigates to a content page (e.g., `/pages/care-guide`)
**Then** the page renders the title and body content from Sanity
**And** rich text (Portable Text) is rendered using the PortableTextRenderer component, supporting headings, paragraphs, lists, links, and embedded images
**And** the page URL uses a clean slug format (`/pages/[slug]`)
**And** the page uses ISR with on-demand revalidation (FR47)
**And** if the page slug does not exist in Sanity, a 404 page is displayed
**And** the page supports CMS-editable SEO metadata (meta title, meta description)

---

## Epic 3: Product Catalog & Browsing

**Goal:** Users can browse the full product catalog by category, view detailed product information with multiple images and pricing, and filter products to narrow their options.

**FRs:** FR2, FR3, FR7, FR8, FR9, FR10, FR12, FR48
**Dependencies:** Epic 1 (layout, Sanity), Epic 2 (homepage links to products)

### Story 3.1: Build Product Catalog and Category Pages

As a **visitor**,
I want **to browse products organized by categories and subcategories**,
So that **I can find the type of product I'm looking for**.

**Acceptance Criteria:**

**Given** products and categories exist in Sanity
**When** a visitor navigates to the product catalog (`/products`)
**Then** the page displays all product categories with category images and names
**And** clicking a category navigates to the category page (`/categories/[slug]`)
**And** the category page displays products in that category with thumbnail image, name, and price
**And** minimum 6 products are shown per page, or all products if fewer exist in the category (FR7)
**And** subcategories are navigable within parent categories
**And** the ProductGrid component arranges products: 1-column mobile, 2-column tablet, 3-4 column desktop (NFR64)
**And** pages use ISR with on-demand revalidation

### Story 3.2: Build Product Detail Page with Specs and Pricing

As a **visitor**,
I want **to see complete product information including description, specifications, and price**,
So that **I can evaluate whether the product meets my needs**.

**Acceptance Criteria:**

**Given** products exist in Sanity with full details
**When** a visitor navigates to a product detail page (`/products/[slug]`)
**Then** the page displays the product name, full description, and technical specifications (ProductSpecs component)
**And** the sale price is displayed publicly on the page (ProductPrice component) (FR10)
**And** the page uses a clean URL format (`/products/[slug]`) (NFR47)
**And** if the product slug does not exist, a 404 page is displayed
**And** the page uses ISR with on-demand revalidation
**And** the page includes CMS-editable SEO metadata

### Story 3.3: Build Product Image Gallery

As a **visitor**,
I want **to view multiple product images in an interactive gallery**,
So that **I can see the product from different angles and in different settings**.

**Acceptance Criteria:**

**Given** a product has at least 2 images attached in Sanity (FR9)
**When** the visitor views a product detail page
**Then** the ProductGallery component displays all product images
**And** the gallery includes thumbnail navigation to switch between images
**And** images are automatically optimized for device size and connection speed (FR48)
**And** images are served in WebP/AVIF format with JPEG/PNG fallback (NFR7)
**And** below-the-fold gallery images are lazy loaded (NFR8)
**And** the gallery is a Client Component (interactive) with `'use client'` directive
**And** all images have descriptive alt text (NFR28)

### Story 3.4: Implement Product Filtering

As a **visitor**,
I want **to filter products by category and product type**,
So that **I can narrow my search to find exactly what I need**.

**Acceptance Criteria:**

**Given** the product catalog page or category page is loaded
**When** the visitor interacts with the ProductFilter component
**Then** products can be filtered by category and product type
**And** the product grid updates to show only matching products
**And** active filters are visually indicated
**And** filters can be cleared to show all products again
**And** the filter component is responsive and usable on mobile devices
**And** the ProductFilter is a Client Component (interactive)

### Story 3.5: Implement Product Visibility Levels

As the **system**,
I want **to control which products are visible to which user types**,
So that **only appropriate content is shown based on access level**.

**Acceptance Criteria:**

**Given** products in Sanity have a `visibility` field with values: "public", "wholesale", "hidden"
**When** a public (unauthenticated) user browses products
**Then** only products with visibility "public" are displayed
**And** when an authenticated trade user browses products, both "public" and "wholesale" products are displayed
**And** products with visibility "hidden" (draft) are never shown on the public site
**And** GROQ queries filter by visibility server-side (not client-side)
**And** direct URL access to a hidden/restricted product returns 404 for unauthorized users

---

## Epic 4: Lead Capture & Contact

**Goal:** Visitors can submit consultation requests and contact forms to initiate business relationships, and receive clear confirmation that their inquiry was received.

**FRs:** FR13, FR14, FR15, FR16, FR17, FR18
**Dependencies:** Epic 1 (Supabase), Epic 3 (product pages for inline forms)

### Story 4.1: Build Contact/Consultation Form

As a **visitor**,
I want **to submit a consultation request with my contact details and inquiry**,
So that **Hardwoodliving can follow up with personalized advice**.

**Acceptance Criteria:**

**Given** a visitor is on a product detail page or the contact page (`/contact`)
**When** the visitor fills out the ContactForm component
**Then** the form includes fields: name (required), email (required), phone, product interest, room type, area, budget, and message
**And** client-side validation prevents submission of invalid data (empty required fields, invalid email format)
**And** the form is a Client Component using `useActionState` and `useFormStatus` hooks
**And** the form is accessible: labels associated with inputs (NFR31), validation errors announced to screen readers (NFR36)
**And** touch targets are ≥ 44×44px on mobile (NFR35)

### Story 4.2: Implement Form Submission and Confirmation

As a **visitor**,
I want **to receive confirmation that my inquiry was successfully submitted**,
So that **I know the business will follow up**.

**Acceptance Criteria:**

**Given** the visitor has filled out the contact form correctly (Story 4.1)
**When** the visitor submits the form
**Then** the form data is sent via a Server Action (`submitContactForm`) to Supabase `inquiries` table (FR17)
**And** server-side validation re-validates all fields before insertion (NFR20)
**And** the Server Action returns an `ActionResult<T>` response
**And** on success, a clear confirmation message is displayed (FR16)
**And** on error, a descriptive error message is shown and the user can retry without losing entered data (NFR41)
**And** the submit button shows a loading state during submission (`useFormStatus`)
**And** the form processes and confirms within 2 seconds (NFR11)

### Story 4.3: Add CTA Buttons and Contact Information Display

As a **visitor**,
I want **to easily find ways to contact Hardwoodliving throughout the site**,
So that **I can reach out whenever I'm ready**.

**Acceptance Criteria:**

**Given** the site layout and product pages are built
**When** a visitor views any product detail page
**Then** a clear "Contact" or "Get Consultation" CTA button is visible (FR15)
**And** clicking the CTA scrolls to or navigates to the contact form
**And** the homepage also includes a CTA linking to the contact form (FR13)
**And** the phone number and email address are displayed clearly in the site footer and on the contact page (FR18)
**And** CTA buttons have sufficient contrast and are keyboard-accessible (NFR26, NFR27)

---

## Epic 5: Trade User Registration & Access

**Goal:** Contractors and installers can register for trade access, log in, and view trade-specific content and benefits, enabling the trade user pipeline.

**FRs:** FR19, FR20, FR21, FR22, FR23, FR44, FR45
**Dependencies:** Epic 1 (Supabase Auth), Epic 3 (product visibility for trade content)

### Story 5.1: Build Trade Information and Benefits Page

As a **contractor or installer**,
I want **to learn about Hardwoodliving's trade program and benefits**,
So that **I can decide whether to register**.

**Acceptance Criteria:**

**Given** the site layout is in place
**When** a visitor navigates to the trades page (`/trades`)
**Then** the page displays information about trade benefits: better pricing, technical support, new product updates (FR21)
**And** the page includes a prominent link/CTA to the trade registration form
**And** the page is accessible from the main navigation
**And** the page is server-rendered for SEO

### Story 5.2: Build Trade Registration Form with Database Storage

As a **contractor**,
I want **to register for trade access by providing my details**,
So that **I can receive trade pricing and materials**.

**Acceptance Criteria:**

**Given** the trades page is built (Story 5.1)
**When** a contractor fills out the TradeRegistrationForm
**Then** the form includes fields: name (required), company (optional), business type (required — installer/contractor/designer/other), email (required), phone (FR19)
**And** client-side and server-side validation ensures data integrity (NFR20)
**And** the form submits via Server Action (`registerTrade`) to Supabase `trades` table (FR22)
**And** on success, a confirmation message tells the user Hardwoodliving will contact them (FR23)
**And** on error, a descriptive message is shown with retry capability (NFR41)
**And** the Server Action returns `ActionResult<T>`

### Story 5.3: Implement Trade User Authentication

As a **registered trade user**,
I want **to log in to access trade-specific content**,
So that **I can view wholesale pricing and trade materials**.

**Acceptance Criteria:**

**Given** a trade user has been set up with credentials in Supabase Auth
**When** the trade user navigates to the login page (`/trades/login`)
**Then** the TradeLoginForm accepts email and password (FR44)
**And** authentication is handled via Supabase Auth with `@supabase/ssr`
**And** on successful login, the user is redirected to the trade dashboard (`/trades/dashboard`)
**And** the session is stored in HTTP-only cookies (secure, token-based) (NFR18)
**And** on failed login, a descriptive error message is displayed
**And** a logout function clears the session and redirects to the homepage

### Story 5.4: Implement Role-Based Access Control

As the **system**,
I want **to enforce access control across the site**,
So that **protected content is only visible to authorized users**.

**Acceptance Criteria:**

**Given** the authentication system is in place (Story 5.3)
**When** Next.js middleware runs on each request
**Then** public content is accessible without authentication (FR46)
**And** the `/trades/dashboard` route requires an authenticated trade user session
**And** the `/admin` route is protected by Sanity's built-in authentication (FR45)
**And** unauthenticated users attempting to access protected routes are redirected to the appropriate login page
**And** the middleware refreshes Supabase auth tokens on each request (using `@supabase/ssr`)
**And** wholesale-only products are only visible to authenticated trade users (integrates with Epic 3 Story 3.5)

---

## Epic 6: CMS Admin & Content Management

**Goal:** Admin users (Romeo or data entry staff) can independently manage all website content — products, categories, pages, media — through the Sanity CMS without developer intervention.

**FRs:** FR24, FR25, FR26, FR27, FR28, FR29, FR30, FR31, FR32, FR33, FR34, FR35, FR43
**Dependencies:** Epic 1 (Sanity project and schemas)

### Story 6.1: Embed Sanity Studio with Admin Authentication

As an **admin**,
I want **to access the CMS admin panel at `/admin` after logging in**,
So that **I can manage site content securely**.

**Acceptance Criteria:**

**Given** the Sanity project is configured (Epic 1 Story 1.2)
**When** an admin navigates to `/admin`
**Then** the Sanity Studio loads as an embedded client-side application (FR24)
**And** the Studio requires Sanity authentication to access (FR43)
**And** unauthenticated users are prompted to log in via Sanity's auth flow
**And** the Studio route uses `[[...tool]]` catch-all to handle all Studio paths
**And** the Studio is loaded via `next/dynamic` with SSR disabled for performance

### Story 6.2: Configure Product Management in CMS

As an **admin**,
I want **to create, edit, and delete products with all their fields**,
So that **I can keep the product catalog current**.

**Acceptance Criteria:**

**Given** the admin is logged into Sanity Studio (Story 6.1)
**When** the admin navigates to the Products section
**Then** the admin can create a new product with fields: title, slug (auto-generated from title), description (rich text), technical specifications, price (FR26)
**And** the admin can set product visibility: Public, Wholesale-only, or Hidden/Draft (FR27)
**And** the admin can mark a product as "Featured" for homepage display (FR28)
**And** the admin can upload images to the media library (FR30) and attach them to the product (FR31)
**And** the admin can edit any existing product's fields (FR25)
**And** the admin can delete products (FR25)
**And** validation rules prevent saving products without required fields (title, slug, at least 1 image)

### Story 6.3: Configure Category, Page Management, and Preview

As an **admin**,
I want **to manage categories, subcategories, and content pages**,
So that **I can organize products and publish informational content**.

**Acceptance Criteria:**

**Given** the admin is logged into Sanity Studio (Story 6.1)
**When** the admin navigates to Categories
**Then** the admin can create, edit, and delete categories and subcategories (FR29)
**And** subcategories reference a parent category
**When** the admin navigates to Pages
**Then** the admin can create, edit, and delete content pages with title, slug, and rich text body (Portable Text) (FR33, FR34)
**And** the admin can set SEO metadata for each page
**And** the admin can preview content before publishing via Sanity's preview mode (FR32)
**And** preview uses Next.js draft mode (API routes for enable/disable)

### Story 6.4: Implement ISR Revalidation via Sanity Webhook

As an **admin**,
I want **content changes to appear on the website within seconds of publishing**,
So that **I don't need developer help to make content updates live**.

**Acceptance Criteria:**

**Given** content is published in Sanity Studio
**When** a document is created, updated, or deleted in Sanity
**Then** Sanity sends a webhook to `/api/revalidate` with a shared secret
**And** the API route validates the secret and extracts the document type and slug
**And** the route calls `revalidateTag()` for the affected content tags
**And** the updated content appears on the live site within seconds (FR35)
**And** invalid webhook requests (missing/wrong secret) are rejected with 401
**And** the route returns appropriate status codes (200 for success, 500 for errors)

---

## Epic 7: Data Export & Lead Management

**Goal:** Admin can view all trade registrations and contact inquiries, filter and sort them, and export data to CSV/Excel for follow-up and marketing activities.

**FRs:** FR36, FR37, FR38, FR39, FR40, FR41, FR42
**Dependencies:** Epic 4 (inquiries data), Epic 5 (trades data), Epic 6 (admin auth)

### Story 7.1: Build Admin Data Views for Trades and Inquiries

As an **admin**,
I want **to view all trade registrations and contact inquiries in a clear list**,
So that **I can review leads and plan follow-ups**.

**Acceptance Criteria:**

**Given** the admin is authenticated (via Supabase Auth or a dedicated admin interface)
**When** the admin accesses the leads management interface
**Then** a DataTable displays all trades users with columns: name, company, business type, email, phone, registration date, status (FR40)
**And** a separate DataTable displays all inquiries with columns: name, email, phone, product interest, message, submission date, status (FR41)
**And** each list shows the most recent entries first
**And** the data is fetched server-side from Supabase (FR36, FR37)
**And** the interface is only accessible to authenticated admin users (NFR23)

### Story 7.2: Implement Filtering, Sorting, and Data Export

As an **admin**,
I want **to filter, sort, and export lead data to CSV or Excel**,
So that **I can manage follow-ups and share data with the sales team**.

**Acceptance Criteria:**

**Given** the admin data views are built (Story 7.1)
**When** the admin interacts with the filter controls
**Then** trades and inquiries can be filtered by date range and type/status (FR42)
**And** both lists can be sorted by any column (date, name, etc.)
**When** the admin clicks the "Export" button on the trades table
**Then** a CSV file with all visible (filtered) trades data is downloaded (FR38)
**When** the admin clicks the "Export" button on the inquiries table
**Then** a CSV file with all visible (filtered) inquiry data is downloaded (FR39)
**And** the export API route (`/api/export`) validates admin authentication before returning data
**And** exported files include all relevant columns with proper headers

---

## Epic 8: SEO, Performance & Launch Readiness

**Goal:** The site meets all non-functional quality standards — SEO, performance, accessibility, error handling, browser compatibility — and is deployed to the production domain, ready for real customers.

**FRs:** FR49, FR50
**NFR Coverage:** NFR1-NFR64 (comprehensive)
**Dependencies:** All previous epics

### Story 8.1: Implement Technical SEO

As the **business**,
I want **the site optimized for search engines**,
So that **potential customers can discover Hardwoodliving through Google and other search engines**.

**Acceptance Criteria:**

**Given** all content pages, product pages, and category pages are built
**When** a search engine crawls the site
**Then** every page has a unique meta title (≤ 60 characters) and meta description (≤ 160 characters), editable from CMS (NFR46)
**And** all pages use clean semantic URLs (e.g., `/products/[slug]`, `/pages/[slug]`) (NFR47)
**And** an XML sitemap is auto-generated at `/sitemap.xml` including all products and pages (NFR48)
**And** `robots.txt` is configured to allow crawling of public pages and block `/admin` (NFR49)
**And** canonical URLs are set on all pages to prevent duplicate content (NFR57)
**And** proper heading hierarchy (H1-H6) is maintained on all pages (NFR53)
**And** internal linking between related products and content pages is implemented (NFR55)

### Story 8.2: Implement Structured Data and URL Redirects

As the **business**,
I want **rich search results and SEO value preserved from the old site**,
So that **the website maintains its search ranking and appears attractively in search results**.

**Acceptance Criteria:**

**Given** the site is fully functional
**When** search engines process the pages
**Then** the homepage includes JSON-LD Organization schema (NFR50)
**And** all product detail pages include Product schema markup (NFR51)
**And** navigation pages include BreadcrumbList schema (NFR52)
**And** 301 redirects from all known old CodeIgniter URLs to their new equivalents are configured in `next.config.ts` (NFR56)
**And** all structured data passes Google's Rich Results Test validation

### Story 8.3: Build Custom Error Pages

As a **visitor**,
I want **helpful error pages when something goes wrong**,
So that **I can navigate back to useful content instead of being stuck**.

**Acceptance Criteria:**

**Given** an error occurs during navigation
**When** a 404 (page not found) error occurs
**Then** a branded custom 404 page is displayed with navigation links to the homepage and product catalog (FR50, NFR40)
**When** a 500 (server error) occurs
**Then** a branded custom 500 page is displayed with navigation links (FR50)
**And** both error pages are visually consistent with the site design
**And** error pages are statically generated at build time for reliability
**And** the `error.tsx` boundary catches route-level errors gracefully
**And** the `global-error.tsx` boundary catches unrecoverable errors

### Story 8.4: Performance Optimization

As a **visitor**,
I want **the site to load quickly on any connection**,
So that **I can browse without frustration**.

**Acceptance Criteria:**

**Given** the site is fully built with all content
**When** performance is measured on homepage, catalog, and product pages
**Then** LCP < 2.5 seconds on 4G connection (NFR1)
**And** LCP < 1.5 seconds on broadband/WiFi for homepage (NFR2)
**And** FID < 100 milliseconds for all interactive elements (NFR3)
**And** CLS < 0.1 across all pages (NFR4)
**And** TTI < 3.5 seconds on 4G for critical paths (NFR5)
**And** initial JavaScript bundle < 200KB gzipped (NFR12)
**And** static pages are cached at edge (CDN) with on-demand revalidation (NFR13)
**And** heavy client components (image gallery, Studio) are dynamically imported
**And** images use `next/image` with proper sizing, WebP/AVIF format, and lazy loading (NFR6, NFR7, NFR8)

### Story 8.5: Accessibility Compliance

As a **visitor with accessibility needs**,
I want **to navigate and use the site with assistive technology**,
So that **I have equal access to all content and functionality**.

**Acceptance Criteria:**

**Given** the site is fully built
**When** accessibility is audited
**Then** text color contrast ratio ≥ 4.5:1 (normal text) and ≥ 3:1 (large text) (NFR26)
**And** all interactive elements are keyboard accessible with visible focus indicators (NFR27)
**And** all informative images have meaningful alt text (NFR28)
**And** the site is navigable via screen readers (NVDA, JAWS, VoiceOver) (NFR29)
**And** semantic HTML is used throughout (NFR30)
**And** form labels are properly associated with inputs (NFR31)
**And** ARIA labels are provided for complex components (filters, galleries, modals) (NFR32)
**And** skip navigation links are available for keyboard users (NFR33)
**And** the site is readable at 200% zoom without horizontal scrolling (NFR34)
**And** touch targets ≥ 44×44px on mobile (NFR35)
**And** form validation errors are announced to screen readers (NFR36)

### Story 8.6: Cross-Browser Testing and Production Launch

As the **business owner**,
I want **the site live on the production domain and tested across all target browsers**,
So that **customers can access the new website reliably**.

**Acceptance Criteria:**

**Given** all features are implemented and tested on staging
**When** the site is deployed to production
**Then** the site is fully functional on the latest 2 versions of Chrome, Firefox, Safari, and Edge (desktop) (NFR58)
**And** the site is fully functional on iOS Safari and Chrome Mobile (latest 2 versions) (NFR59)
**And** core functionality works on older browsers with graceful degradation (NFR60)
**And** the layout is optimal on desktop (≥1024px), tablet (768-1024px), and mobile (<768px) (NFR61)
**And** layout adapts fluidly between breakpoints without horizontal scrolling (NFR62)
**And** touch interactions work correctly on mobile and tablet (NFR63)
**And** the production domain (`hardwoodliving.com`) is live with DNS configured at WHC
**And** HTTPS/SSL is verified on production
**And** 99% uptime during business hours is achievable via Vercel platform (NFR37)
**And** Content Security Policy headers are configured in `next.config.ts`
