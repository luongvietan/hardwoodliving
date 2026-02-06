---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]
inputDocuments: ['prd.md', 'project-spec.md']
workflowType: 'architecture'
project_name: 'hardwoodliving'
user_name: 'Viet An'
date: '2026-02-06T17:17:45.958Z'
lastStep: 8
status: 'complete'
completedAt: '2026-02-06T17:17:45.958Z'
---

# Architecture Decision Document

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

## Project Context Analysis

### Requirements Overview

**Functional Requirements:**
50 FRs across 8 capability areas, sourced from 5 validated user journeys:

| Capability Area | FRs | Architectural Implication |
|---|---|---|
| Content Discovery & Navigation (FR1-FR6) | 6 | Server-rendered pages with dynamic CMS content, responsive layouts |
| Product Information & Display (FR7-FR12) | 6 | Image optimization pipeline, product catalog with filtering, visibility-based access control |
| Lead Capture & Contact (FR13-FR18) | 6 | Form handling with server-side validation, database writes to Supabase |
| Trade/Contractor Management (FR19-FR23) | 5 | Supabase Auth for login, registration forms, role-based content |
| Content Management / Admin (FR24-FR35) | 12 | Sanity CMS embedded studio, schema design, media management, publish workflow |
| Data Export & Reporting (FR36-FR42) | 7 | Admin data views, CSV/Excel export, filtering/sorting |
| Authentication & Access Control (FR43-FR46) | 4 | Dual auth: Supabase Auth (trades) + Sanity Auth (CMS admin) |
| Content Delivery & Error Handling (FR47-FR50) | 4 | ISR/SSG strategies, image optimization, error boundaries, custom error pages |

**Non-Functional Requirements:**
64 NFRs that drive architectural decisions:

| Category | Count | Key Architectural Drivers |
|---|---|---|
| Performance (NFR1-NFR13) | 13 | LCP < 2.5s on 4G, JS bundle < 200KB gzipped, edge caching, lazy loading |
| Security (NFR14-NFR25) | 12 | HTTPS, encryption at rest, input validation, PIPEDA compliance |
| Accessibility (NFR26-NFR36) | 11 | WCAG 2.1 AA, semantic HTML, keyboard navigation, screen reader support |
| Reliability (NFR37-NFR45) | 9 | 99% uptime, error isolation, form retry, atomic CMS updates |
| SEO (NFR46-NFR57) | 12 | Server-rendered HTML, JSON-LD structured data, XML sitemap, 301 redirects |
| Browser Compatibility (NFR58-NFR64) | 7 | Latest 2 versions of major browsers, mobile-first responsive design |

**Scale & Complexity:**

- Primary domain: Web application (catalog + lead generation)
- Complexity level: Low — no real-time features, no multi-tenancy, no payment processing
- Estimated architectural components: ~15 (pages, components, services, schemas)
- Data volume: Low — hundreds of products, thousands of leads/year
- Integration complexity: Low — 2 external services (Sanity API, Supabase API) with official SDKs

### Technical Constraints & Dependencies

| Constraint | Source | Impact |
|---|---|---|
| Budget: $2,500 fixed | Project spec | Use proven technologies, no custom infrastructure |
| Team: 1 developer | Project spec | Simple architecture, minimize operational complexity |
| Brownfield: Migrating from CodeIgniter 3 | PRD | 301 redirects required, SEO preservation |
| Client designs: Figma (provided by Romeo) | Project spec | Pixel-perfect implementation, no design system creation |
| Vercel hosting | PRD | Edge network, serverless functions, automatic scaling |
| WHC for DNS only | PRD | DNS configuration at WHC, no server hosting |
| No e-commerce | PRD | No payment processing, no cart, no checkout |

### Cross-Cutting Concerns Identified

1. **Dual Data Source Management** — Content from Sanity CMS + transactional data from Supabase. Clear boundary needed to prevent confusion.
2. **Image Optimization** — Product images stored in Sanity must be optimized for performance (WebP/AVIF, responsive sizes, lazy loading).
3. **SEO Preservation** — 301 redirects from old CodeIgniter URLs to new Next.js URLs must be maintained across the entire site.
4. **Authentication Duality** — Sanity Studio has its own auth; trade users authenticate via Supabase Auth. These are separate systems.
5. **Responsive Design** — Every page must work across desktop (≥1024px), tablet (768–1024px), and mobile (<768px) with mobile-first approach.

## Starter Template Evaluation

### Primary Technology Domain

Web application (Next.js App Router) based on project requirements: server-rendered catalog site with CMS integration and lead capture.

### Starter Options Considered

| Starter | Pros | Cons | Verdict |
|---|---|---|---|
| `create-next-app` (official) | Official, always current, customizable options | Requires manual Sanity/Supabase setup | ✅ Selected |
| `sanity-template-nextjs-clean` | Pre-configured Sanity integration | May lag behind Next.js versions, opinionated structure | ❌ Too opinionated |
| `create-next-app -e with-supabase` | Pre-configured Supabase auth | Lacks Sanity setup, auth-focused template | ❌ Partial coverage |
| T3 Stack | Full-stack, type-safe | Includes tRPC/Prisma (unnecessary complexity) | ❌ Over-engineered |

### Selected Starter: create-next-app (Official)

**Rationale:** The official Next.js starter provides the most up-to-date foundation with full control over project configuration. Given that Sanity and Supabase require specific setup regardless of starter, starting clean avoids conflicting conventions.

**Initialization Command:**

```bash
npx create-next-app@latest hardwoodliving --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
```

**Architectural Decisions Provided by Starter:**

| Decision | Value |
|---|---|
| Language & Runtime | TypeScript 5.x, Node.js |
| Styling Solution | Tailwind CSS v4 |
| Routing | App Router (file-based) |
| Build Tooling | Turbopack (dev), Webpack (production) |
| Linting | ESLint with Next.js config |
| Code Organization | `src/` directory with `app/` router |
| Import Aliases | `@/*` maps to `src/*` |

**Note:** Project initialization using this command should be the first implementation story.

## Core Architectural Decisions

### Decision Priority Analysis

**Critical Decisions (Block Implementation):**
- Data architecture: Sanity for content, Supabase for transactional data
- Rendering strategy: Hybrid (SSG + ISR + SSR)
- Authentication approach: Supabase Auth for trades, Sanity Auth for CMS
- Deployment platform: Vercel

**Important Decisions (Shape Architecture):**
- Component architecture: Server Components default, Client Components opt-in
- State management: React Server Components + Server Actions (no external state library)
- API patterns: Direct SDK calls (no REST/GraphQL API layer)
- Image handling: Sanity CDN with Next.js Image component

**Deferred Decisions (Post-MVP):**
- Advanced search implementation (Algolia vs native)
- Analytics platform specifics (GA4 integration)
- A/B testing framework
- CRM integration approach

### Data Architecture

**Dual-Source Strategy:**

| Data Store | Technology | Data Types | Access Pattern |
|---|---|---|---|
| **Sanity CMS** | Sanity Content Lake | Products, Categories, Pages, Media, Homepage content, Testimonials | GROQ queries via `next-sanity` client |
| **Supabase** | PostgreSQL | Trade user registrations, Contact inquiries, User sessions | Supabase JS client via `@supabase/ssr` |

**Sanity Schema Types:**

| Type | Key Fields | Notes |
|---|---|---|
| `product` | title, slug, description, specs, price, images[], category ref, visibility, isFeatured | Core content type |
| `category` | title, slug, description, image, parent ref (self-referential) | Supports subcategories |
| `page` | title, slug, body (Portable Text), seo | Dynamic content pages |
| `homepage` | hero, introBlurb, featuredProducts refs, testimonials | Singleton document |
| `testimonial` | author, content, image | Referenced by homepage |
| `siteSettings` | siteName, logo, navigation, contactInfo, socialLinks | Singleton document |

**Supabase Tables:**

| Table | Key Columns | Notes |
|---|---|---|
| `trades` | id, name, company, business_type, email, phone, created_at, status | Trade user registrations |
| `inquiries` | id, name, email, phone, product_interest, room_type, area, budget, message, created_at, status | Contact form submissions |

**Data Validation:**
- Sanity: Schema-level validation (required fields, string lengths, slug uniqueness)
- Supabase: Row-Level Security (RLS) policies + server-side validation in Server Actions
- Client-side: Form validation with native HTML5 + JavaScript validation before submission

**Caching Strategy:**

| Content Type | Strategy | Revalidation |
|---|---|---|
| Product pages | ISR (Incremental Static Regeneration) | On-demand via Sanity webhook → `revalidateTag()` |
| Category pages | ISR | On-demand via Sanity webhook |
| Content pages | ISR | On-demand via Sanity webhook |
| Homepage | ISR | On-demand via Sanity webhook |
| Static assets | CDN edge cache | Immutable (hashed filenames) |
| Trade/inquiry forms | No cache (dynamic) | N/A — Server Actions |

### Authentication & Security

**Authentication Architecture:**

| User Type | Auth Provider | Method | Session Storage |
|---|---|---|---|
| CMS Admin | Sanity | Sanity Studio built-in auth | Sanity-managed |
| Trade User | Supabase Auth | Email/password | HTTP-only cookies via `@supabase/ssr` |
| Public User | None | No authentication required | N/A |

**Authorization Patterns:**

| Resource | Public | Trade User | Admin |
|---|---|---|---|
| Public product pages | ✅ | ✅ | ✅ |
| Wholesale-only products | ❌ | ✅ | ✅ |
| Contact forms | ✅ | ✅ | ✅ |
| Trade registration | ✅ | N/A | ✅ |
| CMS admin panel (`/admin`) | ❌ | ❌ | ✅ |
| Data export (CSV) | ❌ | ❌ | ✅ |

**Security Measures:**
- HTTPS enforced on all routes (Vercel default)
- Supabase RLS policies on `trades` and `inquiries` tables
- Server-side input validation in all Server Actions
- CSRF protection via Next.js Server Actions (built-in)
- Content Security Policy headers configured in `next.config.ts`
- Rate limiting on form submissions (Vercel Edge Middleware or Supabase rate limits)

### API & Communication Patterns

**No Separate API Layer.** This project uses direct SDK calls instead of building a REST/GraphQL API:

| Communication | Pattern | Library |
|---|---|---|
| Frontend → Sanity | GROQ queries in Server Components | `next-sanity` client |
| Frontend → Supabase | Direct client calls in Server Actions | `@supabase/ssr` |
| Sanity → Next.js (revalidation) | Webhook POST to API route | `/api/revalidate` route handler |
| Form submissions | Next.js Server Actions | Native React Server Actions |

**Error Handling Standard:**

```typescript
// Standard error response shape for Server Actions
type ActionResult<T> = 
  | { success: true; data: T }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> }
```

- Server Actions return `ActionResult<T>` — never throw to client
- Sanity query errors: fallback to cached content or error UI
- Supabase errors: display descriptive message, allow retry
- Network errors: toast notification with retry option

### Frontend Architecture

**Rendering Strategy (Hybrid):**

| Page Type | Rendering | Rationale |
|---|---|---|
| Homepage | ISR (revalidate on-demand) | SEO + performance, content changes infrequently |
| Product catalog | ISR (revalidate on-demand) | SEO + performance, updated via CMS webhook |
| Product detail | ISR (revalidate on-demand) | SEO + performance, individual product updates |
| Content pages | ISR (revalidate on-demand) | SEO + performance |
| Trade login/register | SSR (dynamic) | Auth state dependent |
| Admin/Studio | Client-side (SPA) | Sanity Studio is a client-side application |
| Error pages (404, 500) | Static | Pre-rendered at build time |

**Component Architecture:**

| Component Type | Rendering | Usage |
|---|---|---|
| Page layouts | Server Component | `layout.tsx` files — fetch data, render shell |
| Data display | Server Component | Product cards, content blocks, navigation |
| Interactive forms | Client Component | Contact form, trade registration, filters |
| Image galleries | Client Component | Product image carousel/lightbox |
| Sanity Studio | Client Component | Entire `/admin` route is client-side |

**State Management:**
- **No external state library** (no Redux, Zustand, etc.)
- Server state: React Server Components fetch data directly
- Form state: React `useActionState` + `useFormStatus` hooks
- UI state: React `useState` for toggles, modals, galleries
- Auth state: Supabase session via `@supabase/ssr` middleware

**Bundle Optimization:**
- Dynamic imports (`next/dynamic`) for heavy client components (image gallery, Studio)
- Tree shaking via TypeScript + ESM
- Route-based code splitting (automatic with App Router)
- Target: < 200KB initial JS bundle (gzipped)

### Infrastructure & Deployment

**Deployment Architecture:**

```
GitHub Repository
    ↓ (push to master)
Vercel CI/CD Pipeline
    ↓ (build + deploy)
┌──────────────────────────────────┐
│         Vercel Platform          │
│  ┌────────────────────────────┐  │
│  │   Edge Network (CDN)      │  │
│  │   Static assets, ISR pages│  │
│  └────────────────────────────┘  │
│  ┌────────────────────────────┐  │
│  │   Serverless Functions     │  │
│  │   Server Components, APIs │  │
│  └────────────────────────────┘  │
└──────────────────────────────────┘
    ↕                    ↕
Sanity Content Lake    Supabase
(Content + Media)    (PostgreSQL + Auth)
```

**Environment Configuration:**

| Environment | Domain | Branch | Purpose |
|---|---|---|---|
| Production | `hardwoodliving.com` | `master` | Live website |
| Staging | `hardwoodliving.net` | `staging` | Client review, QA |
| Preview | Vercel preview URLs | PR branches | Developer preview |

**Environment Variables:**

```
# Sanity
NEXT_PUBLIC_SANITY_PROJECT_ID=<project-id>
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_READ_TOKEN=<read-token>  # Server-only, for drafts/preview
SANITY_REVALIDATE_SECRET=<webhook-secret>

# Supabase
NEXT_PUBLIC_SUPABASE_URL=<supabase-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>  # Server-only, for admin operations

# App
NEXT_PUBLIC_SITE_URL=<site-url>
```

**CI/CD Pipeline:**
1. Developer pushes to GitHub branch
2. Vercel automatically builds preview deployment
3. PR review + merge to `staging` → deploys to staging
4. Merge `staging` to `master` → deploys to production
5. Sanity webhook triggers on-demand ISR revalidation

**Monitoring:**
- Vercel Analytics (Core Web Vitals, errors)
- Vercel Logs (serverless function errors)
- Supabase Dashboard (database health, auth logs)
- Sanity Studio (content health)

### Decision Impact Analysis

**Implementation Sequence:**
1. Project initialization (`create-next-app`)
2. Sanity project setup + schema definitions
3. Supabase project setup + table creation + RLS policies
4. Environment configuration (Vercel, GitHub, env vars)
5. Core layout + navigation components
6. Homepage + product pages (Sanity integration)
7. Forms + Server Actions (Supabase integration)
8. Authentication (Supabase Auth for trades)
9. Admin features (data export, Sanity Studio embed)
10. SEO, performance optimization, error handling

**Cross-Component Dependencies:**

| Decision | Depends On | Affects |
|---|---|---|
| Sanity schemas | PRD functional requirements | All content-driven pages |
| Supabase tables | PRD lead capture requirements | Forms, admin data views |
| ISR + webhooks | Sanity + Vercel setup | All content pages |
| Supabase Auth | Supabase project setup | Trade area, middleware |
| Image optimization | Sanity CDN + Next.js Image | All product/content pages |

## Implementation Patterns & Consistency Rules

### Naming Patterns

**Database Naming (Supabase PostgreSQL):**

| Element | Convention | Example |
|---|---|---|
| Tables | snake_case, plural | `trades`, `inquiries` |
| Columns | snake_case | `business_type`, `created_at` |
| Foreign keys | `{table}_id` | `trade_id` |
| Indexes | `idx_{table}_{column}` | `idx_trades_email` |
| Enums | snake_case | `business_type_enum` |

**Sanity Schema Naming:**

| Element | Convention | Example |
|---|---|---|
| Document types | camelCase | `product`, `category`, `siteSettings` |
| Field names | camelCase | `salePrice`, `businessType`, `isFeatured` |
| Slug fields | Always named `slug` | `slug: { type: 'slug' }` |

**Code Naming:**

| Element | Convention | Example |
|---|---|---|
| Components | PascalCase | `ProductCard`, `ContactForm` |
| Component files | PascalCase `.tsx` | `ProductCard.tsx`, `ContactForm.tsx` |
| Utility files | camelCase `.ts` | `formatPrice.ts`, `sanityClient.ts` |
| Route files | lowercase (Next.js convention) | `page.tsx`, `layout.tsx`, `loading.tsx` |
| Server Actions | camelCase with verb prefix | `submitContactForm`, `registerTrade` |
| Environment variables | UPPER_SNAKE_CASE | `NEXT_PUBLIC_SANITY_PROJECT_ID` |
| CSS classes | Tailwind utility classes | `className="flex items-center gap-4"` |
| Types/Interfaces | PascalCase with suffix | `Product`, `CategoryWithProducts`, `ContactFormData` |

**URL/Route Naming:**

| Element | Convention | Example |
|---|---|---|
| Pages | lowercase, kebab-case slugs | `/products/engineered-hardwood` |
| Dynamic routes | `[slug]` parameter | `/products/[slug]` |
| API routes | lowercase, kebab-case | `/api/revalidate` |
| Admin route | `/admin` | `/admin/[[...tool]]/page.tsx` |

### Structure Patterns

**Component Organization: By Feature + Shared UI**

```
src/components/
├── ui/              # Reusable UI primitives (Button, Input, Card, Modal)
├── layout/          # Layout components (Header, Footer, Navigation, Breadcrumbs)
├── products/        # Product-specific components (ProductCard, ProductGallery, ProductSpecs)
├── forms/           # Form components (ContactForm, TradeRegistrationForm)
├── home/            # Homepage sections (HeroSection, FeaturedProducts, Testimonials)
└── admin/           # Admin-specific components (DataTable, ExportButton)
```

**Test Co-location:**
- Tests live next to the code they test: `ProductCard.test.tsx` beside `ProductCard.tsx`
- E2E tests in dedicated `e2e/` directory at project root

**Shared Utilities Location:**

```
src/lib/
├── sanity/          # Sanity client, queries, helpers
├── supabase/        # Supabase client, server client, middleware helpers
├── utils/           # General utilities (formatPrice, formatDate, etc.)
└── types/           # Shared TypeScript types and interfaces
```

### Format Patterns

**API Response Format (Server Actions):**

```typescript
// ALL Server Actions return this shape
type ActionResult<T> = 
  | { success: true; data: T }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> }
```

**Date Format:**
- Database storage: ISO 8601 (`2026-02-06T17:00:00.000Z`)
- Display: Localized format via `Intl.DateTimeFormat`
- Sanity: ISO 8601 (Sanity default)

**JSON Field Naming:**
- Sanity responses: camelCase (Sanity default)
- Supabase responses: snake_case (PostgreSQL default)
- Frontend types: camelCase (transform Supabase responses at the boundary)

**Boolean Naming:**
- Sanity: `isFeatured`, `isPublished`
- Supabase: `is_active`, `is_verified`
- Frontend: `isFeatured`, `isActive` (camelCase)

### Communication Patterns

**Data Fetching:**

| Context | Pattern | Example |
|---|---|---|
| Server Component | Async function call | `const products = await sanityFetch(query)` |
| Client Component (read) | `use()` hook with Server Component data | Pass data as props from Server Component |
| Client Component (write) | Server Action via `useActionState` | `const [state, action] = useActionState(submitForm)` |
| Revalidation | Webhook → API route → `revalidateTag()` | Sanity webhook triggers `/api/revalidate` |

**Sanity Query Pattern:**

```typescript
// All Sanity queries defined in src/lib/sanity/queries.ts
// Use GROQ with typed results
import { defineQuery } from 'next-sanity'

export const PRODUCTS_QUERY = defineQuery(`
  *[_type == "product" && visibility == "public"] | order(title asc) {
    _id, title, slug, price, "image": images[0]
  }
`)
```

**Supabase Query Pattern:**

```typescript
// All Supabase queries in Server Actions or server utilities
// Never expose service role key to client
import { createClient } from '@/lib/supabase/server'

export async function getTradeUsers() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('trades')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) return { success: false, error: error.message }
  return { success: true, data }
}
```

### Process Patterns

**Error Handling:**

| Layer | Pattern |
|---|---|
| Server Actions | Try/catch → return `ActionResult<T>`, never throw to client |
| Sanity queries | Try/catch → return fallback content or null |
| Supabase queries | Check `error` property → return structured error |
| Client UI | `useActionState` → display error message from `ActionResult` |
| Page-level | `error.tsx` boundary files per route segment |
| Global | `global-error.tsx` for unrecoverable errors |

**Loading States:**

| Pattern | Implementation |
|---|---|
| Page loading | `loading.tsx` files with skeleton UI |
| Form submission | `useFormStatus` → disable button + show spinner |
| Image loading | `placeholder="blur"` with LQIP from Sanity |
| Component loading | `Suspense` boundary with fallback |

**Form Submission Pattern:**

```typescript
// 1. Define Server Action
'use server'
export async function submitContactForm(
  prevState: ActionResult<void>,
  formData: FormData
): Promise<ActionResult<void>> {
  // Validate
  // Insert to Supabase
  // Return ActionResult
}

// 2. Use in Client Component
'use client'
function ContactForm() {
  const [state, action, pending] = useActionState(submitContactForm, null)
  return (
    <form action={action}>
      {/* fields */}
      <button disabled={pending}>Submit</button>
      {state?.error && <p>{state.error}</p>}
      {state?.success && <p>Thank you!</p>}
    </form>
  )
}
```

### Enforcement Guidelines

**All AI Agents MUST:**
1. Use Server Components by default; add `'use client'` only when interactivity is required
2. Never import Sanity write tokens or Supabase service role keys in Client Components
3. Follow the `ActionResult<T>` pattern for all Server Actions
4. Use `next/image` for all images with proper `width`, `height`, and `alt` attributes
5. Place components in the correct feature directory under `src/components/`
6. Use Tailwind CSS utility classes exclusively — no CSS modules, no styled-components
7. Use TypeScript strict mode — no `any` types, no `@ts-ignore`

**Anti-Patterns to Avoid:**
- ❌ Fetching Sanity data in Client Components (use Server Components)
- ❌ Using `useEffect` for data fetching (use Server Components or Server Actions)
- ❌ Creating REST API routes for internal data (use Server Actions)
- ❌ Storing sensitive keys in `NEXT_PUBLIC_*` variables
- ❌ Using `getServerSideProps` or `getStaticProps` (use App Router patterns)
- ❌ Installing state management libraries (Redux, Zustand) — use built-in React patterns

## Project Structure & Boundaries

### Complete Project Directory Structure

```
hardwoodliving/
├── README.md
├── package.json
├── package-lock.json
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── postcss.config.mjs
├── eslint.config.mjs
├── .env.local                       # Local env vars (gitignored)
├── .env.example                     # Template for env vars
├── .gitignore
├── .github/
│   └── workflows/
│       └── ci.yml                   # Lint + type check on PR
├── sanity.config.ts                 # Sanity Studio configuration
├── sanity.cli.ts                    # Sanity CLI configuration
├── public/
│   ├── favicon.ico
│   ├── robots.txt
│   └── assets/
│       └── images/                  # Static images (logo, icons)
├── e2e/                             # End-to-end tests
│   ├── homepage.spec.ts
│   ├── products.spec.ts
│   └── forms.spec.ts
└── src/
    ├── app/
    │   ├── globals.css              # Tailwind directives + global styles
    │   ├── layout.tsx               # Root layout (Header, Footer, metadata)
    │   ├── page.tsx                 # Homepage
    │   ├── loading.tsx              # Root loading skeleton
    │   ├── error.tsx                # Root error boundary
    │   ├── not-found.tsx            # Custom 404 page
    │   ├── global-error.tsx         # Global error boundary
    │   ├── sitemap.ts               # Dynamic XML sitemap generation
    │   ├── robots.ts                # Dynamic robots.txt
    │   ├── products/
    │   │   ├── page.tsx             # Product catalog (all categories)
    │   │   ├── loading.tsx
    │   │   └── [slug]/
    │   │       ├── page.tsx         # Product detail page
    │   │       └── loading.tsx
    │   ├── categories/
    │   │   └── [slug]/
    │   │       ├── page.tsx         # Category product listing
    │   │       └── loading.tsx
    │   ├── pages/
    │   │   └── [slug]/
    │   │       └── page.tsx         # Dynamic content pages (Care Guide, etc.)
    │   ├── trades/
    │   │   ├── page.tsx             # Trade info + registration form
    │   │   ├── login/
    │   │   │   └── page.tsx         # Trade user login
    │   │   └── dashboard/
    │   │       └── page.tsx         # Trade user dashboard (post-login)
    │   ├── contact/
    │   │   └── page.tsx             # Contact / consultation page
    │   ├── admin/
    │   │   └── [[...tool]]/
    │   │       └── page.tsx         # Sanity Studio (embedded)
    │   └── api/
    │       ├── revalidate/
    │       │   └── route.ts         # Sanity webhook → ISR revalidation
    │       ├── draft-mode/
    │       │   ├── enable/
    │       │   │   └── route.ts     # Enable Sanity preview
    │       │   └── disable/
    │       │       └── route.ts     # Disable Sanity preview
    │       └── export/
    │           └── route.ts         # CSV/Excel export for admin
    ├── components/
    │   ├── ui/
    │   │   ├── Button.tsx
    │   │   ├── Input.tsx
    │   │   ├── Card.tsx
    │   │   ├── Modal.tsx
    │   │   ├── Skeleton.tsx
    │   │   ├── Badge.tsx
    │   │   └── Toast.tsx
    │   ├── layout/
    │   │   ├── Header.tsx
    │   │   ├── Footer.tsx
    │   │   ├── Navigation.tsx
    │   │   ├── MobileMenu.tsx
    │   │   ├── Breadcrumbs.tsx
    │   │   └── Container.tsx
    │   ├── products/
    │   │   ├── ProductCard.tsx
    │   │   ├── ProductGrid.tsx
    │   │   ├── ProductGallery.tsx   # Client Component (interactive)
    │   │   ├── ProductSpecs.tsx
    │   │   ├── ProductPrice.tsx
    │   │   └── ProductFilter.tsx    # Client Component (interactive)
    │   ├── forms/
    │   │   ├── ContactForm.tsx      # Client Component
    │   │   ├── TradeRegistrationForm.tsx  # Client Component
    │   │   ├── TradeLoginForm.tsx    # Client Component
    │   │   └── FormField.tsx
    │   ├── home/
    │   │   ├── HeroSection.tsx
    │   │   ├── IntroBlurb.tsx
    │   │   ├── FeaturedProducts.tsx
    │   │   └── Testimonials.tsx
    │   ├── seo/
    │   │   ├── JsonLd.tsx           # JSON-LD structured data components
    │   │   └── Breadcrumbs.tsx      # Schema.org BreadcrumbList
    │   └── portable-text/
    │       └── PortableTextRenderer.tsx  # Sanity Portable Text renderer
    ├── lib/
    │   ├── sanity/
    │   │   ├── client.ts            # Sanity client configuration
    │   │   ├── fetch.ts             # Typed fetch wrapper with caching
    │   │   ├── queries.ts           # All GROQ queries (centralized)
    │   │   ├── image.ts             # Sanity image URL builder
    │   │   └── schemas/
    │   │       ├── index.ts         # Schema registry
    │   │       ├── product.ts
    │   │       ├── category.ts
    │   │       ├── page.ts
    │   │       ├── homepage.ts
    │   │       ├── testimonial.ts
    │   │       └── siteSettings.ts
    │   ├── supabase/
    │   │   ├── client.ts            # Browser Supabase client
    │   │   ├── server.ts            # Server Supabase client
    │   │   └── middleware.ts        # Auth middleware helper
    │   ├── actions/
    │   │   ├── contact.ts           # submitContactForm Server Action
    │   │   ├── trades.ts            # registerTrade, loginTrade Server Actions
    │   │   └── export.ts            # exportTradesCSV, exportInquiriesCSV
    │   ├── utils/
    │   │   ├── formatPrice.ts
    │   │   ├── formatDate.ts
    │   │   ├── cn.ts                # Tailwind class merge utility
    │   │   └── validation.ts        # Form validation helpers
    │   └── types/
    │       ├── sanity.ts            # Sanity document types (auto-generated)
    │       ├── supabase.ts          # Supabase table types (auto-generated)
    │       ├── forms.ts             # Form data types
    │       └── actions.ts           # ActionResult<T> type
    └── middleware.ts                # Next.js middleware (Supabase auth refresh)
```

### Architectural Boundaries

**API Boundaries:**

| Boundary | Internal | External | Protocol |
|---|---|---|---|
| Sanity Content | `src/lib/sanity/` | Sanity Content Lake API | GROQ over HTTPS |
| Supabase Data | `src/lib/supabase/` | Supabase REST API | PostgREST over HTTPS |
| Supabase Auth | `src/lib/supabase/` | Supabase Auth API | HTTPS |
| Revalidation | `/api/revalidate` | Sanity Webhooks | POST with secret |
| Export | `/api/export` | Internal (admin only) | GET with auth |

**Component Boundaries:**
- Server Components: Cannot use `useState`, `useEffect`, browser APIs. Can fetch data directly.
- Client Components: Marked with `'use client'`. Can use hooks, browser APIs. Receive data via props.
- The boundary is at the component file level — a file is either Server or Client.

**Data Boundaries:**
- Content data (Sanity) is read-only from the frontend — mutations happen only in Sanity Studio.
- Transactional data (Supabase) is written from Server Actions — never from Client Components directly.
- Auth tokens are managed in HTTP-only cookies via `@supabase/ssr` middleware.

### Requirements to Structure Mapping

**Feature Mapping:**

| Feature Area | Routes | Components | Data Source |
|---|---|---|---|
| Homepage (FR4, FR11) | `src/app/page.tsx` | `home/*`, `products/ProductCard` | Sanity |
| Product Catalog (FR2, FR3, FR7) | `src/app/products/`, `src/app/categories/` | `products/*` | Sanity |
| Product Detail (FR8-FR10, FR13, FR15) | `src/app/products/[slug]/` | `products/*`, `forms/ContactForm` | Sanity + Supabase |
| Content Pages (FR6) | `src/app/pages/[slug]/` | `portable-text/*` | Sanity |
| Lead Capture (FR13-FR18) | Forms on product + contact pages | `forms/ContactForm` | Supabase |
| Trade Management (FR19-FR23) | `src/app/trades/` | `forms/TradeRegistrationForm, TradeLoginForm` | Supabase |
| CMS Admin (FR24-FR35) | `src/app/admin/` | Sanity Studio (embedded) | Sanity |
| Data Export (FR36-FR42) | `/api/export` + admin UI | `admin/DataTable, ExportButton` | Supabase |
| Auth (FR43-FR46) | Middleware + trades routes | `forms/TradeLoginForm` | Supabase Auth |
| SEO (NFR46-NFR57) | `sitemap.ts`, `robots.ts`, `JsonLd` | `seo/*` | Sanity |

### Integration Points

**Internal Communication:**
- Server Components → Sanity: Direct GROQ queries in component async functions
- Server Actions → Supabase: Direct client calls with server-side client
- Middleware → Supabase Auth: Token refresh on every request
- Layout → Components: Props passing (Server → Client boundary)

**External Integrations:**
- Sanity Content Lake: Read content via GROQ API
- Sanity Asset Pipeline: Serve optimized images via Sanity CDN
- Supabase PostgreSQL: Read/write transactional data
- Supabase Auth: User sessions, token management
- Vercel: Hosting, CDN, serverless functions, analytics
- GitHub: Source control, CI/CD trigger

**Data Flow:**

```
[User Browser]
    ↓ Request
[Vercel Edge] → [CDN Cache Hit?] → Yes → [Return Cached Page]
    ↓ No
[Next.js Server Component]
    ↓ Fetch content          ↓ Fetch data
[Sanity GROQ API]      [Supabase PostgreSQL]
    ↓                        ↓
[Render HTML + Stream to Client]
    ↓
[User Browser]
    ↓ Form Submit (Server Action)
[Next.js Server Action]
    ↓ Validate + Insert
[Supabase PostgreSQL]
    ↓ Return ActionResult
[Client UI Update]
```

## Architecture Validation Results

### Coherence Validation ✅

**Decision Compatibility:**
All technology choices work together without conflicts:
- Next.js App Router + `next-sanity` (official integration, well-maintained)
- Next.js + `@supabase/ssr` (official SSR support for Next.js)
- Vercel + Next.js (first-party hosting platform)
- TypeScript across all layers (consistent type safety)
- Tailwind CSS v4 compatible with Next.js (built-in PostCSS support)

**Pattern Consistency:**
- Naming conventions are consistent: camelCase for JS/Sanity, snake_case for PostgreSQL
- All data flows through defined boundaries (Sanity client, Supabase client)
- Error handling follows `ActionResult<T>` pattern consistently
- Server/Client Component boundary is clearly defined

**Structure Alignment:**
- Project structure directly maps to features from PRD
- Each capability area has a clear home in the directory tree
- Integration points are well-defined with dedicated lib directories

### Requirements Coverage Validation ✅

**Functional Requirements Coverage:**

| FR Group | Coverage | Architectural Support |
|---|---|---|
| FR1-FR6 (Navigation) | 100% | App Router file-based routing, layout components |
| FR7-FR12 (Products) | 100% | Sanity schemas, ISR pages, image optimization |
| FR13-FR18 (Lead Capture) | 100% | Server Actions → Supabase, form components |
| FR19-FR23 (Trades) | 100% | Supabase Auth + PostgreSQL, trades routes |
| FR24-FR35 (CMS Admin) | 100% | Embedded Sanity Studio at `/admin` |
| FR36-FR42 (Data Export) | 100% | API routes for CSV export, admin data views |
| FR43-FR46 (Auth) | 100% | Supabase Auth (trades) + Sanity Auth (admin) |
| FR47-FR50 (Delivery) | 100% | ISR + CDN, Next.js Image, error boundaries |

**Non-Functional Requirements Coverage:**

| NFR Group | Coverage | Architectural Support |
|---|---|---|
| Performance (NFR1-13) | 100% | ISR, edge caching, image optimization, code splitting |
| Security (NFR14-25) | 100% | HTTPS (Vercel), RLS (Supabase), CSP headers, validation |
| Accessibility (NFR26-36) | 100% | Semantic HTML, ARIA, keyboard nav — enforced at component level |
| Reliability (NFR37-45) | 100% | Vercel redundancy, error boundaries, Supabase backups |
| SEO (NFR46-57) | 100% | SSR/ISR, JSON-LD, sitemap, 301 redirects in `next.config.ts` |
| Browser Compat (NFR58-64) | 100% | Modern framework defaults, Tailwind responsive, progressive enhancement |

### Implementation Readiness Validation ✅

**Decision Completeness:** All critical decisions documented with specific technologies and versions.
**Structure Completeness:** Complete directory tree with every file and directory defined.
**Pattern Completeness:** Naming, structure, format, communication, and process patterns all documented with examples.

### Gap Analysis Results

**No critical gaps identified.**

**Minor enhancements (post-MVP):**
- Monitoring/alerting strategy details (currently using Vercel defaults)
- Database migration approach (Supabase handles this via dashboard/CLI)
- Detailed CI/CD pipeline configuration (`.github/workflows/ci.yml` contents)
- Performance budgets as automated tests

### Architecture Completeness Checklist

**✅ Requirements Analysis**

- [x] Project context thoroughly analyzed
- [x] Scale and complexity assessed (low complexity, catalog + lead gen)
- [x] Technical constraints identified (budget, team size, brownfield)
- [x] Cross-cutting concerns mapped (dual data source, SEO, auth, responsive)

**✅ Architectural Decisions**

- [x] Critical decisions documented with versions
- [x] Technology stack fully specified (Next.js, Sanity, Supabase, Vercel)
- [x] Integration patterns defined (GROQ queries, Server Actions, webhooks)
- [x] Performance considerations addressed (ISR, CDN, bundle optimization)

**✅ Implementation Patterns**

- [x] Naming conventions established (code, DB, API, URLs)
- [x] Structure patterns defined (component organization, test co-location)
- [x] Communication patterns specified (data fetching, Server Actions)
- [x] Process patterns documented (error handling, loading states, forms)

**✅ Project Structure**

- [x] Complete directory structure defined
- [x] Component boundaries established (Server vs Client)
- [x] Integration points mapped (Sanity, Supabase, Vercel)
- [x] Requirements to structure mapping complete

### Architecture Readiness Assessment

**Overall Status:** READY FOR IMPLEMENTATION

**Confidence Level:** High — based on proven technology stack, low project complexity, and comprehensive pattern documentation.

**Key Strengths:**
1. Clean separation of concerns: Sanity for content, Supabase for transactions
2. Modern App Router patterns (Server Components, Server Actions) eliminate unnecessary complexity
3. ISR + webhook revalidation provides optimal performance with real-time content updates
4. No external state management library needed — simpler mental model for AI agents
5. Complete directory structure prevents structural conflicts between agents

**Areas for Future Enhancement:**
1. Advanced search (Algolia integration) for Phase 2
2. Analytics dashboard integration for Phase 2
3. Multi-language support architecture for Phase 3
4. CRM integration architecture for Phase 3

### Implementation Handoff

**AI Agent Guidelines:**

- Follow all architectural decisions exactly as documented
- Use implementation patterns consistently across all components
- Respect project structure and boundaries — place files in correct directories
- Refer to this document for all architectural questions
- Use Server Components by default; add `'use client'` only when required
- All Sanity queries go in `src/lib/sanity/queries.ts`
- All Server Actions go in `src/lib/actions/`
- All Supabase operations use the typed client from `src/lib/supabase/`

**First Implementation Priority:**

```bash
npx create-next-app@latest hardwoodliving --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
cd hardwoodliving
npm install next-sanity @sanity/image-url @sanity/vision sanity
npm install @supabase/supabase-js @supabase/ssr
```
