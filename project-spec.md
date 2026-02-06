# Project Specification: HARDWOODLIVING Website

**Project Name:** Hardwoodliving Website Revamp  
**Client:** Romeo Boar  
**Freelancer:** Viet An Luong  
**Primary Domain:** www.hardwoodliving.com  
**Staging/Dev Domain:** www.hardwoodliving.net  
**Budget:** $2,500 (Project-based)

---

## 1. Project Overview
Rebuild the product presentation website for Hardwoodliving—a boutique specializing in high-end wood flooring and cabinetry. The new website needs to replace the old version (CodeIgniter 3), adopting a modern, warm, and luxurious style ("boutique feel") while ensuring easy content management.

**Important Note:** The website operates as an online catalog that displays prices but does NOT integrate online payment features (E-commerce transactions). The primary goal is lead generation and product showcasing.

## 2. Technology Requirements (Tech Stack)
Per agreement, the project will utilize the following technologies:

*   **Frontend & CMS:** Next.js + **Sanity CMS** (Integrated CMS running within Next.js - replacing the old admin panel).
*   **Backend Services:** **Supabase** (PostgreSQL Database, Authentication, Storage, Realtime).
*   **Database:** Supabase PostgreSQL (Managed).
*   **File Storage:** Supabase Storage (for product images and media).
*   **Authentication:** Supabase Auth (for Trade Portal user management).
*   **Hosting:** Vercel (Frontend + Sanity CMS) / Web Hosting Canada (WHC) for custom Node.js deployment.
*   **Source Control:** GitHub.

## 3. Design Requirements (UI/UX)
*   **Designer:** The Client (Romeo) will handle the design on Figma (as a suitable designer has not yet been found).
*   **Reference Site:** [www.magnahardwoodfloors.com](http://www.magnahardwoodfloors.com) (Regarding structure and functionality).
*   **Style:** Friendly, nature-oriented, non-generic, conveying a sense of exclusive service.
*   **Developer Responsibilities:**
    *   Consult on UI/UX if inconsistencies are found in the client's design.
    *   Convert Figma designs to Next.js code (Pixel-perfect).

## 4. Detailed Features (Functional Requirements)

### A. Frontend (Public User Interface)
**Homepage:**
*   Hero section (Image/Video + Introductory Text).
*   Intro Blurb (Brief introduction).
*   Featured Products or Key Features.
*   Testimonials (Customer reviews).

**Product Catalog Page:**
*   Categorized by Categories and Sub-categories.
*   Product filters (as needed).

**Product Detail Page:**
*   Name, description, technical specifications.
*   Sale Price (Publicly displayed).
*   Image gallery.
*   CTA (Call to Action) buttons: "Contact" or "Get Consultation" (instead of "Add to cart").

**Dynamic Content Pages:**
*   Visit Us, Care Guide, Why Wood?, etc.
*   Content fully editable from the CMS.

**Trades/Contractor Section:**
*   Simple registration/login form.
*   Purpose: Collect information (Name, Company, Business Type: installer, contractor, etc.) for promotional sends or follow-ups.
*   No complex account system required; primary focus is lead capture.

### B. Backend / Admin (Sanity CMS)
The management system must be easy to use for the Admin (Romeo and 3rd party data entry). Sanity CMS runs integrated within Next.js, providing a modern admin panel at `/admin`:

**Product Management:**
*   Create/Edit/Delete products.
*   Manage fields: Title, description, specs, price.
*   Display settings: Public, Wholesale-only, Hidden/Draft.
*   Mark products as "Featured".

**Media Management:**
*   Upload images, Preview functionality.
*   Attach images to products or homepage sections.

**Page Management:**
*   Edit content of static and dynamic pages (Title, Slug, Body content).

**Trades Information Management:**
*   View list of registered contractors/trades.
*   Export data (Excel/CSV) for marketing purposes (as required in the old Excel file).

## 5. Infrastructure & Deployment
*   **Staging Environment:** Deployed on hardwoodliving.net for client review before going public.
*   **Production Environment:** Deployed on hardwoodliving.com after completion.

**Other Requirements:**
*   Install HTTPS/SSL.
*   Configure Redirects (if needed) to ensure SEO from the old website.
*   Optimize page load speed (Image optimization).

---

## 6. Project Roadmap & Milestones

### Milestone 1 – Project Setup & Architecture
*   **Amount:** $500
*   **Duration:** ~1 week
*   **Scope:**
    *   Project kickoff
    *   Confirm sitemap & scope
    *   Setup Git repository
    *   Setup Next.js + Sanity CMS integrated project
    *   Setup Supabase project (PostgreSQL + Auth + Storage)
    *   Hosting & environment configuration (staging)
*   **Deliverables:**
    *   Running staging environment
    *   Sanity CMS admin accessible at `/admin`
    *   Database connected
    *   Base project structure ready
*   **Acceptance Criteria:**
    *   Client can access staging URL
    *   Client can log into Sanity CMS admin
    *   Supabase connection verified
    *   No blocking technical errors

### Milestone 2 – CMS & Data Models
*   **Amount:** $600
*   **Duration:** ~1 week
*   **Scope:**
    *   Create content models: Pages, Products, Categories / subcategories, Trades users, Inquiries
    *   Configure roles & permissions
    *   Image upload configuration
    *   Admin UI configuration
*   **Deliverables:**
    *   Fully functional CMS
    *   Admin can manage content & products
*   **Acceptance Criteria:**
    *   Admin can create/edit/delete: Pages, Products, Categories
    *   Images upload successfully
    *   No developer intervention needed for content management

### Milestone 3 – Frontend Pages Implementation
*   **Amount:** $700
*   **Duration:** ~1–1.5 weeks
*   **Scope:**
    *   Implement frontend based on approved Figma: Homepage, Flooring listing page, Product detail page, Dynamic content pages
    *   Responsive layout (desktop / tablet / mobile)
    *   Basic SEO structure
*   **Deliverables:**
    *   Core website pages live on staging
    *   Content rendered from CMS
*   **Acceptance Criteria:**
    *   Pages display correctly on major browsers
    *   Responsive behavior confirmed
    *   Content loads dynamically from CMS

### Milestone 4 – Trades Area & Lead Flows
*   **Amount:** $400
*   **Duration:** ~1 week
*   **Scope:**
    *   Trades registration & login
    *   Inquiry / interest submission forms
    *   Store trades data in CMS
    *   Admin view for inquiries
    *   CTA & contact forms integration
*   **Deliverables:**
    *   Working Trades section
    *   Leads stored & viewable in admin
*   **Acceptance Criteria:**
    *   Trades users can register & log in
    *   Inquiry submissions saved correctly
    *   Admin can view all submissions

### Milestone 5 – QA, Polish & Production Launch
*   **Amount:** $300
*   **Duration:** ~1 week (or buffer)
*   **Scope:**
    *   Cross-device testing
    *   Bug fixes
    *   Performance & SEO polish
    *   Production deployment
    *   Domain connection & SSL
    *   Final review & handover
*   **Deliverables:**
    *   Live production website
    *   Stable & error-free release
*   **Acceptance Criteria:**
    *   Website live on agreed domain
    *   HTTPS active
    *   No critical bugs