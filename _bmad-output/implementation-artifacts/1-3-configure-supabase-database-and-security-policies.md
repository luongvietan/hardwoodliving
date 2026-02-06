# Story 1.3: Configure Supabase Database and Security Policies

**Epic:** 1-Project Foundation & Site Shell
**Story Key:** 1-3-configure-supabase-database-and-security-policies
**Status:** ready-for-dev

## Story Requirements

### User Story

As a **developer**,
I want **the Supabase project set up with tables and row-level security**,
So that **transactional data (trades, inquiries) can be securely stored and queried**.

### Acceptance Criteria

- [ ] **Given** the Next.js project is initialized (Story 1.1)
- [ ] **When** the Supabase project is configured
- [ ] **Then** the `trades` table is created with columns: id (uuid, PK), name (text, not null), company (text, nullable), business_type (text, not null), email (text, not null), phone (text), created_at (timestamptz), status (text, default 'pending')
- [ ] **And** the `inquiries` table is created with columns: id (uuid, PK), name (text, not null), email (text, not null), phone (text), product_interest (text), room_type (text), area (text), budget (text), message (text), created_at (timestamptz), status (text, default 'new')
- [ ] **And** RLS policies restrict read access on `trades` and `inquiries` to authenticated admin users only
- [ ] **And** RLS policies allow anonymous inserts to `trades` and `inquiries` (for public form submissions)
- [ ] **And** Supabase Auth is enabled for email/password authentication
- [ ] **And** Supabase server client is configured in `src/lib/supabase/server.ts`
- [ ] **And** Supabase browser client is configured in `src/lib/supabase/client.ts`
- [ ] **And** Supabase middleware helper is created in `src/lib/supabase/middleware.ts`

---

## Developer Operations Context

### Architecture & Technical Requirements

**Technology Stack:**
- **Database:** PostgreSQL (Supabase)
- **Auth:** Supabase Auth
- **Integration:** `@supabase/ssr`, `@supabase/supabase-js`

**Database Schema:**
*   **Table: trades**
    *   `id`: uuid (primary key, default: `gen_random_uuid()`)
    *   `name`: text
    *   `company`: text
    *   `business_type`: text
    *   `email`: text
    *   `phone`: text
    *   `created_at`: timestamptz (default: `now()`)
    *   `status`: text (default: `'pending'`)
    
*   **Table: inquiries**
    *   `id`: uuid (primary key, default: `gen_random_uuid()`)
    *   `name`: text
    *   `email`: text
    *   `phone`: text
    *   `product_interest`: text
    *   `room_type`: text
    *   `area`: text
    *   `budget`: text
    *   `message`: text
    *   `created_at`: timestamptz (default: `now()`)
    *   `status`: text (default: `'new'`)

**Security Policies (RLS):**
*   Enable RLS on both tables.
*   Policy: "Enable insert for everyone" (anon role).
*   Policy: "Enable read for authenticated admin only" (service_role or specific admin check).

### Implementation Guide

1.  **Supabase Setup:**
    Use `supabase/migrations` if possible, or provide SQL scripts in a `db/` folder to be run in Supabase Dashboard SQL Editor.

2.  **Client Configuration:**
    *   `src/lib/supabase/client.ts`: `createBrowserClient`
    *   `src/lib/supabase/server.ts`: `createServerClient` (with cookie handling)
    *   `src/lib/supabase/middleware.ts`: `createServerClient` (for middleware auth refresh)

3.  **Middleware:**
    Update `src/middleware.ts` to use the supabase middleware helper.

### Dev Agent Record

#### Debug Log
*Log any connection issues or RLS policy testing results.*

#### Completion Notes
*Confirm tables created and RLS policies verified.*

### File List
- [ ] src/lib/supabase/client.ts
- [ ] src/lib/supabase/server.ts
- [ ] src/lib/supabase/middleware.ts
- [ ] src/middleware.ts
- [ ] supabase/migrations/0000_init_tables.sql (Optional, or just SQL notes)

### Tasks / Subtasks

- [ ] Create Supabase browser client (`client.ts`)
- [ ] Create Supabase server client (`server.ts`)
- [ ] Create Supabase middleware client helper (`middleware.ts`)
- [ ] Setup `src/middleware.ts`
- [ ] Generate SQL script for `trades` table creation
- [ ] Generate SQL script for `inquiries` table creation
- [ ] Define RLS policies for `trades` (Insert: Anon, Select: Admin)
- [ ] Define RLS policies for `inquiries` (Insert: Anon, Select: Admin)
- [ ] Verify Supabase connection

### Change Log
- **2026-02-07**: Story created.
