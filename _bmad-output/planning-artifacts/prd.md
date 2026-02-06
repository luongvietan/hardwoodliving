---
stepsCompleted: ['step-01-init', 'step-02-discovery', 'step-04-journeys', 'step-05-domain', 'step-06-innovation', 'step-07-project-type', 'step-08-scoping', 'step-09-functional', 'step-10-nonfunctional', 'step-11-polish', 'step-12-complete']
inputDocuments: ['project-spec.md']
documentCounts:
  briefCount: 0
  researchCount: 0
  brainstormingCount: 0
  projectDocsCount: 1
workflowType: 'prd'
classification:
  projectType: web_app
  domain: general
  complexity: low
  projectContext: brownfield
---

# Product Requirements Document - hardwoodliving

**Author:** Viet An
**Date:** 2026-02-06T16:44:26.137Z

## Executive Summary

### Vision

Replace the legacy Hardwoodliving website (CodeIgniter 3) with a modern, high-performance catalog and lead generation platform. The new site positions Hardwoodliving as a premium boutique brand for wood flooring and cabinetry in the Canadian market, enabling self-service content management and structured lead capture.

### Product Differentiator

Unlike generic template-based competitors, Hardwoodliving's website delivers a warm, nature-oriented "boutique feel" that mirrors the in-store experience. The site operates as an **online catalog with lead generation** — displaying products and prices publicly while guiding visitors toward consultation requests rather than e-commerce checkout flows.

### Target Users

| User Type | Description | Primary Goal |
|---|---|---|
| **Retail Customer** | Homeowners seeking premium wood flooring or cabinetry | Browse products, compare options, request consultation |
| **Trade User** | Contractors, installers, interior designers | Register for trade pricing and programs |
| **Admin** | Business owner (Romeo) and data entry staff | Manage products, pages, media, and view leads |

### Problem Statement

The current CodeIgniter 3 website is outdated, difficult to maintain, and does not reflect the premium brand identity. Content updates require developer intervention. There is no structured lead capture or trade user management system.

### Technology Stack

| Layer | Technology | Responsibility |
|---|---|---|
| Frontend | Next.js (App Router) | Server-rendered pages, static generation, routing |
| Content Management | Sanity CMS (at `/admin`) | Products, categories, pages, media assets |
| Database | Supabase PostgreSQL | Trades users, contact inquiries, transactional data |
| Authentication | Supabase Auth | Trade user login, admin access control |
| Media Assets | Sanity Asset Pipeline | Product images, galleries, page media |
| Hosting | Vercel (staging + production) | Deployment, CDN, edge network |
| Domain Management | WHC (Web Hosting Canada) | DNS only — `hardwoodliving.net` (staging), `hardwoodliving.com` (production) |
| Source Control | GitHub | Version control, CI/CD pipeline to Vercel |

**Architecture Note:** Sanity handles all content and media assets. Supabase handles transactional data (trades registrations, contact form submissions) and authentication. WHC is used solely for domain DNS — not for hosting.

## Success Criteria

### User Success

- Retail customers can browse the product catalog by category (flooring, cabinetry), view detailed product information (description, specs, price, high-quality images), and request consultation — all without encountering e-commerce checkout flows.
- Visitors experience a cohesive "boutique, premium" brand impression across desktop, tablet, and mobile.
- The site guides users through a clear path: discover products → understand value → submit consultation request.

### Business Success

- **Lead volume**: Contact form and consultation request submissions increase by at least 20% compared to the old site baseline (baseline measured immediately before go-live).
- **Engagement**: Average session duration and pages-per-session increase by at least 20% compared to old site baseline.
- **Operational efficiency**: Admin (Romeo or data entry staff) can create, edit, and delete products, categories, and content pages in Sanity CMS without developer assistance.
- **Brand perception**: The website is perceived as warm, natural, and premium — on par with or exceeding reference competitor Magna Hardwood Floors.

### Technical Success

- Full tech stack operational: Next.js + Sanity CMS + Supabase deployed on Vercel with GitHub CI/CD.
- Staging (`hardwoodliving.net`) and production (`hardwoodliving.com`) environments accessible via Vercel, with DNS managed at WHC.
- Core Web Vitals passing (LCP < 2.5s, FID < 100ms, CLS < 0.1) on product pages over 4G.
- Basic SEO structure: metadata, clean URLs, proper headings, indexable content.
- Zero blocking errors in normal usage (navigation, product viewing, form submission, trades login).

### Measurable Outcomes

- **Leads**: Monthly contact/consultation form submissions tracked and compared to pre-launch baseline. Target: ≥ 80% of submitted forms contain complete information (name, business type, contact method).
- **Engagement**: Average time-on-site and pages-per-session tracked via analytics. Target: ≥ 20% increase over old site within 3 months.
- **Operations**: Admin can independently manage all content types. Target: zero developer-assisted content updates within 30 days of launch.

## User Journeys

### Journey 1 — Retail Customer Finding Flooring (Primary User — Success Path)

**Opening Scene**
Customer A just purchased a new home and was referred to Hardwoodliving by friends. He visits `hardwoodliving.com` on his laptop to find suitable hardwood flooring for his living room and bedroom.

**Rising Action**
- He lands on the homepage, sees a hero image of a beautiful wood interior, a brief introduction to Hardwoodliving, and "Featured Products / Collections" sections.
- He clicks "Flooring" in the navigation to view the catalog.
- On the catalog page, he filters by flooring type (e.g., engineered hardwood), color, or series.
- He opens several product detail pages to compare: descriptions, technical specifications, close-up photos, room-setting images, and reference pricing.
- He begins visualizing how each option would look in his apartment.

**Climax**
After reviewing 2-3 preferred products, he wants to ask about durability, warranty, and full installation pricing. He sees a clear "Contact / Get Consultation" button on the product detail page, clicks it, and fills out a form with his contact information and needs (room type, area, budget). The form submits successfully with a confirmation message.

**Resolution**
Customer A finds the website easy to use, visually appealing, and informative. He is not pushed into an online checkout flow. He feels confident that Hardwoodliving is a professional brand and awaits a consultation call.

**Traced Requirements:** FR1, FR2, FR3, FR4, FR7, FR8, FR9, FR10, FR13, FR14, FR15, FR16

### Journey 2 — Retail Customer Browsing Cabinetry, Returning Later (Primary User — Return Visit)

**Opening Scene**
Customer B is considering a kitchen renovation. She discovers Hardwoodliving through search or a friend's recommendation. She first visits the site on her phone to browse casually.

**Rising Action**
- On mobile, she navigates to "Cabinetry / Kitchen" from the menu or a homepage block.
- She browses several cabinet designs but is not ready to decide — she scrolls through images and reads brief descriptions.
- The website displays correctly on mobile with no layout issues, but she does not leave any contact information.
- A few days later, she returns on a tablet for a closer look: detailed descriptions, materials, warranty, close-up photos.

**Climax**
On her return visit, content pages like "Why Wood?" and "Care Guide" help her understand the value of natural wood and maintenance considerations. The combination of informational content and imagery builds trust. She uses the contact form or the clearly displayed phone number to schedule a consultation.

**Resolution**
Customer B feels that Hardwoodliving offers not just products but knowledgeable guidance. The website serves as a path from curiosity → understanding → action.

**Traced Requirements:** FR1, FR5, FR6, FR7, FR8, FR13, FR18

### Journey 3 — Trade/Contractor Registration (Secondary — Trade User)

**Opening Scene**
Contractor C is a flooring installer who hears that Hardwoodliving offers trade pricing and programs. He visits the site to register.

**Rising Action**
- From the homepage or a dedicated "For Trades / Contractors" section, he accesses the trade area.
- He reads about trade benefits: better pricing, technical support, new product updates.
- He sees a simple registration form requiring only basic fields: name, company (optional), business type (installer/contractor/etc.), email/phone.
- He completes the form and submits. The system stores his information in the database for admin follow-up.

**Climax**
The form submits successfully with a clear confirmation message that Hardwoodliving will contact him with relevant materials and trade pricing. Internally, the admin team can view the new trade registration.

**Resolution**
Contractor C finds the registration process simple and straightforward. He trusts he will receive appropriate trade access.

**Traced Requirements:** FR19, FR20, FR21, FR22, FR23

### Journey 4 — Admin Managing Content (Admin / Operations Journey)

**Opening Scene**
Romeo or a data entry staff member needs to add a new product, update pricing, and create a new "Care Guide" content page.

**Rising Action**
- Admin navigates to `/admin` (Sanity Studio) and logs in.
- In the CMS, admin selects "Products" to create a new product: enters name, slug, description, specs, price, display status (Public / Wholesale-only / Hidden), marks as "Featured" if needed.
- Admin uploads product images to the media library and attaches them to the product.
- Admin switches to "Pages" to create or edit content pages (Visit Us, Care Guide, Why Wood?) with rich text editing.
- All operations include preview functionality before publishing.

**Climax**
Admin clicks publish and within seconds, the new product/page appears on staging/production. No developer needed, no code changes.

**Resolution**
Admin feels in control of content, confident in making changes without fear of breaking the site. Developer turnaround time for minor content changes is eliminated.

**Traced Requirements:** FR24, FR25, FR26, FR27, FR28, FR29, FR30, FR31, FR32, FR33, FR34, FR35

### Journey 5 — Marketing/Admin Reviewing Leads (Support / Back-office Journey)

**Opening Scene**
The marketing team wants to review new trade registrations and contact inquiries for follow-up.

**Rising Action**
- Admin opens the CMS or admin interface to view:
  - List of trades users (name, business type, contact info).
  - List of inquiries from the "Contact / Get Consultation" form.
- Admin can filter/sort by date or lead type.
- When needed, admin exports data to CSV/Excel for email marketing campaigns or internal reporting.

**Climax**
Admin extracts the month's new leads and sends them to the sales team/owner for follow-up — no manual Excel manipulation from the old system required.

**Resolution**
The pipeline from website → data storage → lead extraction is clear and low-friction. Data is centralized, reducing the chance of missed leads.

**Traced Requirements:** FR36, FR37, FR38, FR39, FR40, FR41, FR42

### Journey Requirements Summary

| Area | Key Requirements |
|---|---|
| Public Website | Clear navigation between product groups and content pages; catalog with category browsing, product detail with gallery and CTA; responsive across desktop/tablet/mobile |
| Lead & Trades | Contact/consultation form for retail customers; trade registration with minimal required fields; structured data storage and CSV/Excel export |
| Admin / CMS | Full CRUD for products, categories, pages, trades, inquiries in Sanity; media upload and preview; publish workflow without developer |

## Product Scope & Phased Development

### MVP Strategy

**Approach:** Experience MVP — deliver a complete catalog website with good UX from day one, replacing the legacy site with modern technology and self-service CMS. The MVP solves both the technical debt problem and the brand perception problem simultaneously.

**Resource Constraints:**
- **Team:** 1 freelance developer + client providing Figma designs and content
- **Timeline:** ~5-6 weeks (5 milestones, ~1 week each)
- **Budget:** $2,500 (fixed project-based)

### MVP Feature Set (Phase 1)

**Infrastructure & Setup (Milestone 1 — $500):**
- Next.js + Sanity CMS + Supabase project setup
- Vercel staging environment (`hardwoodliving.net`) accessible
- GitHub repository with CI/CD to Vercel
- Environment variables and configuration management

**CMS & Data Models (Milestone 2 — $600):**
- Sanity schemas: Products, Categories/Subcategories, Pages, Trades users, Inquiries
- Media upload and management via Sanity asset pipeline
- Admin UI configuration for easy content management
- Basic roles and permissions (admin access)

**Public Frontend (Milestone 3 — $700):**
- Homepage: hero section, intro blurb, featured products, testimonials
- Product Catalog: category/subcategory navigation, product listing with images
- Product Detail: full description, specs, price, image gallery, CTA buttons
- Content Pages: Visit Us, Care Guide, Why Wood? (CMS-editable)
- Responsive design: desktop, tablet, mobile layouts
- Basic SEO: metadata, clean URLs, heading structure

**Trades & Lead Capture (Milestone 4 — $400):**
- Trades registration form (name, company, business type, contact info)
- Trades login via Supabase Auth
- Contact/consultation form on product pages and homepage
- Data stored in Supabase (trades and inquiries tables)
- Admin view for trades and inquiries lists

**Launch Preparation (Milestone 5 — $300):**
- Cross-device testing and bug fixes
- Performance optimization (image optimization, code splitting)
- SEO polish (metadata, sitemap, robots.txt, 301 redirects from old URLs)
- Production deployment on Vercel (`hardwoodliving.com`)
- Domain configuration (DNS at WHC) and SSL/HTTPS

**MVP Exclusions (Deferred):**
- Advanced product filtering and search
- E-commerce functionality (not in scope)
- Advanced analytics dashboard
- Multi-language support
- Complex admin workflows (tags, collections, campaigns)

### Post-MVP Features (Phase 2 — 3-6 months post-launch)

- Advanced product filtering (color, price range, material type) and search with autocomplete
- Enhanced testimonials with images and case studies; project gallery
- Advanced CMS workflows: tags, featured collections, content scheduling, bulk operations
- Basic analytics dashboard in CMS (page views, popular products, lead sources)
- GA4 integration with custom event tracking
- A/B testing framework for CTAs and layouts
- Email marketing integration (lead export to Mailchimp or similar)

### Future Vision (Phase 3 — 6-12 months post-launch)

- Product comparison tool and recommendation engine
- Virtual room preview/visualizer (budget permitting)
- Video content integration (product videos, installation guides)
- ERP/inventory system integration (if business scales)
- CRM integration (Salesforce, HubSpot) for lead management
- Multi-language support (English/French for Quebec expansion)
- Multi-site capability (additional locations)

### Risk Mitigation

| Risk | Severity | Mitigation |
|---|---|---|
| Integration complexity (Next.js + Sanity + Supabase) | High | Proof of concept in Milestone 1; use official SDKs; test on staging before production |
| Performance issues with large image galleries | Medium | Next.js image optimization; pagination/lazy loading; Vercel Edge CDN; performance testing in M5 |
| Sanity CMS learning curve for client | Medium | Training in M2; simple schema design; video tutorials; post-launch support period |
| Lead generation does not increase | Medium | Baseline measurement before launch; A/B test CTAs in Phase 2; regular analytics review |
| Client does not adopt CMS (still depends on developer) | Medium | Emphasize training in M2; simple CMS UI; documentation; support period |
| Timeline delays due to Figma designs not ready | High | Clear milestone dependencies (M3 needs designs); parallel work on CMS (M2); regular check-ins |
| Scope creep beyond spec | High | Clear scope in PRD and contract; change request process; refer to MVP goals |
| Budget constraints ($2,500 fixed) | Medium | Strict MVP focus; proven technologies; leverage existing components; clear trade-off communication |

## Functional Requirements

**Capability Contract:** Each requirement specifies WHAT the product must deliver, not HOW it is implemented. UX designers, architects, and developers use these as the definitive source of truth.

### Content Discovery & Navigation
*Traced to: Journey 1, Journey 2*

- **FR1**: Users can navigate between product categories (flooring, cabinetry, etc.) and content pages (Visit Us, Care Guide, Why Wood?) through persistent navigation with labeled links to all top-level categories and content pages
- **FR2**: Users can browse products organized by categories and subcategories
- **FR3**: Users can filter products by basic criteria (category, product type)
- **FR4**: Users can access the homepage displaying hero section, introductory content, featured products, and testimonials
- **FR5**: Users can navigate the website on desktop, tablet, and mobile devices with responsive layouts
- **FR6**: Users can access dynamic content pages (Visit Us, Care Guide, Why Wood?, etc.) with content editable from CMS

### Product Information & Display
*Traced to: Journey 1, Journey 2*

- **FR7**: Users can view a product catalog page showing products (minimum 6 per page or all in category) with thumbnail image, name, and price
- **FR8**: Users can view individual product detail pages containing name, description, technical specifications, sale price, and image gallery
- **FR9**: Users can view product images in a gallery format with at least 2 images per product
- **FR10**: Users can see product pricing information displayed publicly on product detail pages
- **FR11**: Users can identify featured products highlighted in special sections (homepage, featured collections)
- **FR12**: Users can view products with different visibility settings (Public, Wholesale-only, Hidden/Draft) based on their access level

### Lead Capture & Contact
*Traced to: Journey 1, Journey 2*

- **FR13**: Users can submit contact/consultation forms from product detail pages and homepage
- **FR14**: Users can provide contact information and inquiry details (product interest, room type, area, budget) through contact forms
- **FR15**: Users can see clear call-to-action buttons ("Contact" or "Get Consultation") on product pages
- **FR16**: Users receive confirmation feedback after successfully submitting contact forms
- **FR17**: The system stores contact form submissions as structured data in the database for follow-up
- **FR18**: Users can access contact information (phone number, email) displayed clearly on the website

### Trade/Contractor Management
*Traced to: Journey 3*

- **FR19**: Trade users (contractors, installers) can register through a form providing name, company, business type, and contact information
- **FR20**: Trade users can log in to access trade-specific content or features
- **FR21**: Trade users can view information about trade benefits and programs
- **FR22**: The system stores trade registration data in the database for marketing and follow-up
- **FR23**: Trade users receive confirmation after successful registration

### Content Management (Admin)
*Traced to: Journey 4*

- **FR24**: Admin users can access the CMS admin panel at `/admin` after authentication
- **FR25**: Admin users can create, edit, and delete products
- **FR26**: Admin users can manage product fields: title, description, technical specifications, price
- **FR27**: Admin users can set product visibility (Public, Wholesale-only, Hidden/Draft)
- **FR28**: Admin users can mark products as "Featured" for homepage and collection highlights
- **FR29**: Admin users can create, edit, and delete product categories and subcategories
- **FR30**: Admin users can upload images to the media library
- **FR31**: Admin users can attach images to products and homepage sections
- **FR32**: Admin users can preview content before publishing
- **FR33**: Admin users can create, edit, and delete dynamic content pages
- **FR34**: Admin users can manage page content: title, slug, body (rich text)
- **FR35**: Admin users can publish content changes that appear on the website without developer intervention

### Data Export & Reporting
*Traced to: Journey 5*

- **FR36**: Admin users can view and manage trades user registrations
- **FR37**: Admin users can view and manage contact form submissions (inquiries)
- **FR38**: Admin users can export trades user data to CSV/Excel format
- **FR39**: Admin users can export inquiry/contact form data to CSV/Excel format
- **FR40**: Admin users can view lists of registered trades users with full details (name, company, business type, contact)
- **FR41**: Admin users can view lists of inquiries with submission details
- **FR42**: Admin users can filter and sort trades and inquiries by date and type

### Authentication & Access Control
*Traced to: Journey 3, Journey 4*

- **FR43**: Admin users can authenticate to access the CMS admin panel
- **FR44**: Trade users can authenticate to access trade-specific areas
- **FR45**: The system enforces role-based access control: admin functions restricted to authenticated admin users
- **FR46**: Public users can access all public content without authentication

### Content Delivery & Error Handling
*Traced to: All Journeys*

- **FR47**: The system delivers CMS content to public-facing pages dynamically
- **FR48**: The system optimizes images for different device sizes and connection speeds
- **FR49**: The system loads homepage, catalog, and product detail pages within Core Web Vitals thresholds (see NFR1-NFR7)
- **FR50**: The system displays branded error pages (404, 500) with navigation links to homepage and product catalog when errors occur

## Non-Functional Requirements

**Quality Attributes:** NFRs specify HOW WELL the system must perform. Only categories relevant to this product are included. Each NFR is measurable and testable.

### Performance

**Page Load (Core Web Vitals):**
- **NFR1**: Largest Contentful Paint (LCP) < 2.5 seconds on 4G for homepage, catalog, and product pages
- **NFR2**: LCP < 1.5 seconds on broadband/WiFi for homepage
- **NFR3**: First Input Delay (FID) < 100 milliseconds for all interactive elements
- **NFR4**: Cumulative Layout Shift (CLS) < 0.1 across all pages
- **NFR5**: Time to Interactive (TTI) < 3.5 seconds on 4G for critical user paths

**Image Optimization:**
- **NFR6**: Product images automatically optimized for device size and connection speed
- **NFR7**: Images served in modern formats (WebP/AVIF) with JPEG/PNG fallback
- **NFR8**: Below-the-fold images lazy loaded to improve initial page load

**API & Form Response:**
- **NFR9**: CMS content API responses complete within 500 milliseconds
- **NFR10**: Database queries complete within 300 milliseconds for standard operations
- **NFR11**: Form submissions (contact, trades) process and confirm within 2 seconds

**Bundle & Assets:**
- **NFR12**: Initial JavaScript bundle < 200KB gzipped
- **NFR13**: Static pages cached at edge (CDN) with appropriate TTL; CMS content revalidated on-demand or on schedule

### Security

**Data Protection:**
- **NFR14**: All data transmission encrypted via HTTPS/TLS on staging and production
- **NFR15**: Sensitive user data (trades, inquiries) encrypted at rest in the database
- **NFR16**: Authentication credentials stored using industry-standard hashing

**Access Control:**
- **NFR17**: CMS admin access requires authentication with secure session management
- **NFR18**: Trade user authentication uses secure token-based sessions
- **NFR19**: Public content accessible without authentication; admin functions restricted to authenticated admins only

**Input Validation:**
- **NFR20**: All form inputs validated on both client-side and server-side to prevent injection attacks
- **NFR21**: File uploads validated for type and size; rejected if malicious content detected
- **NFR22**: Database queries are protected against SQL injection attacks

**Privacy:**
- **NFR23**: Contact and trades data stored securely, accessible only to authorized admin users
- **NFR24**: No user tracking or analytics without explicit consent (privacy regulation compliance)
- **NFR25**: Personal information handled according to applicable privacy laws (PIPEDA for Canada)

### Accessibility (WCAG 2.1 Level AA)

**Visual & Interaction:**
- **NFR26**: Text color contrast ratio ≥ 4.5:1 (normal text) and ≥ 3:1 (large text)
- **NFR27**: All interactive elements keyboard accessible with visible focus indicators
- **NFR28**: All informative images have meaningful alt text; decorative images marked accordingly
- **NFR29**: Website navigable and functional via screen readers (NVDA, JAWS, VoiceOver)

**Structure:**
- **NFR30**: Document structure uses semantic markup for accessibility and SEO compliance
- **NFR31**: Form labels properly associated with input fields
- **NFR32**: ARIA labels provided for complex components (product filters, image galleries, modals)
- **NFR33**: Skip navigation links available for keyboard users

**Responsive Accessibility:**
- **NFR34**: Website readable and functional at 200% zoom without horizontal scrolling
- **NFR35**: Touch targets ≥ 44×44 pixels on mobile devices
- **NFR36**: Form validation errors announced to screen readers and displayed visually

### Reliability & Availability

**Uptime:**
- **NFR37**: 99% uptime during business hours (9 AM – 6 PM ET, Monday–Friday)
- **NFR38**: Website remains accessible during single-server failures via hosting platform redundancy

**Error Handling:**
- **NFR39**: API failures handled gracefully with descriptive error messages and fallback content
- **NFR40**: Custom 404 pages with helpful navigation options
- **NFR41**: Form submission failures display clear error messages; user can retry without data loss
- **NFR42**: Individual component failures are isolated and do not cascade to break entire pages

**Data Integrity:**
- **NFR43**: Form submissions reliably stored with retry mechanism for temporary network failures
- **NFR44**: CMS content updates are atomic (all-or-nothing) to prevent partial updates
- **NFR45**: Database backups performed automatically on a regular schedule

### SEO & Discoverability

**Technical SEO:**
- **NFR46**: All pages have unique meta titles (≤ 60 chars) and meta descriptions (≤ 160 chars), editable from CMS
- **NFR47**: Clean semantic URLs (e.g., `/products/[slug]`, `/pages/[slug]`) without query parameters for content
- **NFR48**: Auto-generated XML sitemap at `/sitemap.xml` including all products and pages
- **NFR49**: Robots.txt configured to allow crawling while blocking admin areas

**Structured Data:**
- **NFR50**: JSON-LD Organization schema on homepage
- **NFR51**: Product schema markup on all product detail pages
- **NFR52**: BreadcrumbList schema for navigation structure

**Content SEO:**
- **NFR53**: Proper heading hierarchy (H1–H6) maintained on all pages
- **NFR54**: All images have descriptive alt text with relevant keywords
- **NFR55**: Logical internal linking between related products and content pages

**Migration SEO:**
- **NFR56**: 301 redirects from old CodeIgniter URLs to new URLs to preserve SEO value
- **NFR57**: Canonical URLs set to prevent duplicate content issues

### Browser & Device Compatibility

**Browser Support:**
- **NFR58**: Fully functional on latest 2 versions of Chrome, Firefox, Safari, and Edge (desktop)
- **NFR59**: Fully functional on iOS Safari and Chrome Mobile (latest 2 versions)
- **NFR60**: Core functionality works on older browsers with graceful degradation for advanced features

**Responsive Design:**
- **NFR61**: Optimal viewing on desktop (≥ 1024px), tablet (768px–1024px), and mobile (< 768px)
- **NFR62**: Layout adapts fluidly between breakpoints without horizontal scrolling or content overflow
- **NFR63**: Touch interactions work correctly on mobile and tablet devices
- **NFR64**: Mobile-first design approach: 1-column catalog on mobile, 2-column on tablet, 3-4 columns on desktop
