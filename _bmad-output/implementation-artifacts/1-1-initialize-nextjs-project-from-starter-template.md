# Story 1.1: Initialize Next.js Project from Starter Template

**Epic:** 1-Project Foundation & Site Shell
**Story Key:** 1-1-initialize-nextjs-project-from-starter-template
**Status:** done

## Story Requirements

### User Story

As a **developer**,
I want **the project initialized from `create-next-app` with all core dependencies installed**,
So that **all future development has a consistent, working foundation**.

### Acceptance Criteria

- [x] **Given** no project exists yet
- [x] **When** the developer runs `npx create-next-app@latest hardwoodliving --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"`
- [x] **Then** the project is created with TypeScript, Tailwind CSS, ESLint, App Router, and `src/` directory structure
- [x] **And** `next-sanity`, `@sanity/image-url`, `@sanity/vision`, `sanity` are installed
- [x] **And** `@supabase/supabase-js`, `@supabase/ssr` are installed
- [x] **And** TypeScript strict mode is enabled in `tsconfig.json`
- [x] **And** the project runs successfully on `localhost:3000`
- [x] **And** `.env.example` file is created with all required environment variable templates
- [x] **And** `.gitignore` includes `.env.local` and other sensitive files
- [x] **And** the project directory structure matches the Architecture document layout

---

## Developer Operations Context

### Architecture & Technical Requirements

**Technology Stack:**
- **Framework:** Next.js (App Router)
- **Language:** TypeScript 5.x
- **Styling:** Tailwind CSS v4
- **Linting:** ESLint

**Dependencies to Install:**
- `next-sanity`
- `@sanity/image-url`
- `@sanity/vision`
- `sanity`
- `@supabase/supabase-js`
- `@supabase/ssr`

**Folder Structure Enforcement:**
Ensure the following structure is established in `src/`:
```
src/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/
│   ├── layout/
│   ├── products/
│   ├── forms/
│   ├── home/
│   └── admin/
├── lib/
│   ├── sanity/
│   ├── supabase/
│   ├── utils/
│   └── types/
```

### Implementation Guide

1.  **Initialize Project:**
    Run the standard initialization command:
    ```bash
    npx create-next-app@latest hardwoodliving --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm
    ```
    *Note: Move contents to root if created in subfolder, or run in current directory if empty.*

2.  **Install CMS & Database Dependencies:**
    ```bash
    npm install next-sanity @sanity/image-url @sanity/vision sanity @supabase/supabase-js @supabase/ssr
    ```

3.  **Global Configuration:**
    - Verify `tsconfig.json` has `"strict": true`.
    - Create `.env.example` with:
        ```
        # Sanity
        NEXT_PUBLIC_SANITY_PROJECT_ID=
        NEXT_PUBLIC_SANITY_DATASET=production
        SANITY_API_READ_TOKEN=
        SANITY_REVALIDATE_SECRET=

        # Supabase
        NEXT_PUBLIC_SUPABASE_URL=
        NEXT_PUBLIC_SUPABASE_ANON_KEY=
        SUPABASE_SERVICE_ROLE_KEY=

        # App
        NEXT_PUBLIC_SITE_URL=http://localhost:3000
        ```

4.  **Scaffold Directory Structure:**
    Create the empty directories defined in the Architecture section to guide future stories.

### Dev Agent Record

#### Debug Log
*Use this section to log any errors encountered and how they were resolved.*

#### Completion Notes
Project initialized successfully. Verified all dependencies (Sanity, Supabase, Tailwind, TypeScript) are installed. Created `.env.example` with required variables. Updated `.gitignore` to allow `.env.example`. Scaffolded `src/` directory structure matching architecture requirements. Verified build passes. Committed initial structure.

### File List
*List of all files created or modified in this story.*
- [x] package.json (modified — added Sanity, Supabase, shadcn dependencies)
- [x] package-lock.json (modified — dependency lockfile)
- [x] tsconfig.json (verified — strict mode enabled)
- [x] .env.example (new — environment variable template)
- [x] .gitignore (modified — added .env* pattern, .vercel)
- [x] next.config.ts (verified — default Next.js config)
- [x] src/app/layout.tsx (modified — project metadata)
- [x] src/app/page.tsx (default — placeholder from create-next-app)
- [x] src/app/globals.css (default — Tailwind CSS directives)
- [x] src/components/ui/.gitkeep (new — directory scaffold)
- [x] src/components/layout/.gitkeep (new — directory scaffold)
- [x] src/components/products/.gitkeep (new — directory scaffold)
- [x] src/components/forms/.gitkeep (new — directory scaffold)
- [x] src/components/home/.gitkeep (new — directory scaffold)
- [x] src/components/admin/.gitkeep (new — directory scaffold)
- [x] src/lib/sanity/.gitkeep (new — directory scaffold)
- [x] src/lib/supabase/.gitkeep (new — directory scaffold)
- [x] src/lib/utils/.gitkeep (new — directory scaffold)
- [x] src/lib/types/.gitkeep (new — directory scaffold)

### Tasks / Subtasks

- [x] Run `create-next-app` to initialize project
- [x] Install Sanity dependencies (`next-sanity`, `sanity`, etc.)
- [x] Install Supabase dependencies (`@supabase/supabase-js`, `@supabase/ssr`)
- [x] Verify `tsconfig.json` strict mode
- [x] Create `.env.example` with required variables
- [x] Update `.gitignore` to include local environment files
- [x] Scaffold `src/` directory structure (components, lib folders)
- [x] Verify project builds and runs (`npm run dev`)
- [x] Commit initial project structure

#### Additional Dependencies (documented by review)
- `shadcn` (devDependency) — CLI tool for adding Tailwind-based UI components; not in original story scope but compatible with architecture (Tailwind utility classes)
- `dotenv` (devDependency) — Environment variable loading for tests
- `tsx` (devDependency) — TypeScript execution for Node.js test runner

### Change Log

- **2026-02-07**: Story created for development.
- **2026-02-07**: Story completed by Dev Agent.
- **2026-02-07**: Code review — 7 issues found (2H, 3M, 2L). Fixed: ACs checked, shadcn moved to devDependencies, File List detailed, layout.tsx metadata updated, .gitignore duplicate removed, additional dependencies documented.
