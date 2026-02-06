# Story 1.1: Initialize Next.js Project from Starter Template

**Epic:** 1-Project Foundation & Site Shell
**Story Key:** 1-1-initialize-nextjs-project-from-starter-template
**Status:** review

## Story Requirements

### User Story

As a **developer**,
I want **the project initialized from `create-next-app` with all core dependencies installed**,
So that **all future development has a consistent, working foundation**.

### Acceptance Criteria

- [ ] **Given** no project exists yet
- [ ] **When** the developer runs `npx create-next-app@latest hardwoodliving --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"`
- [ ] **Then** the project is created with TypeScript, Tailwind CSS, ESLint, App Router, and `src/` directory structure
- [ ] **And** `next-sanity`, `@sanity/image-url`, `@sanity/vision`, `sanity` are installed
- [ ] **And** `@supabase/supabase-js`, `@supabase/ssr` are installed
- [ ] **And** TypeScript strict mode is enabled in `tsconfig.json`
- [ ] **And** the project runs successfully on `localhost:3000`
- [ ] **And** `.env.example` file is created with all required environment variable templates
- [ ] **And** `.gitignore` includes `.env.local` and other sensitive files
- [ ] **And** the project directory structure matches the Architecture document layout

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
- [x] package.json
- [x] tsconfig.json
- [x] .env.example
- [x] .gitignore
- [x] src/app/layout.tsx
- [x] src/app/page.tsx
- [x] src/app/globals.css
- [x] src/components/
- [x] src/lib/

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

### Change Log

- **2026-02-07**: Story created for development.
- **2026-02-07**: Story completed by Dev Agent.
