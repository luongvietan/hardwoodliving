# Story 1.4: Set Up Vercel Deployment with GitHub CI/CD

**Epic:** 1-Project Foundation & Site Shell
**Story Key:** 1-4-set-up-vercel-deployment-with-github-cicd
**Status:** ready-for-dev

## Story Requirements

### User Story

As a **developer**,
I want **the deployment pipeline configured with staging and production environments**,
So that **code changes are automatically deployed and the site is accessible online**.

### Acceptance Criteria

- [ ] **Given** the project has a GitHub repository
- [ ] **When** Vercel is connected to the GitHub repository
- [ ] **Then** pushes to the `staging` branch auto-deploy to `hardwoodliving.net` (staging)
- [ ] **And** pushes to the `main` branch auto-deploy to `hardwoodliving.com` (production)
- [ ] **And** all environment variables (Sanity, Supabase, app) are configured in Vercel
- [ ] **And** preview deployments are generated for pull requests
- [ ] **And** DNS for both domains is configured at WHC pointing to Vercel
- [ ] **And** HTTPS/SSL is verified on both staging and production
- [ ] **And** a successful deployment to staging is confirmed with the default page loading

---

## Developer Operations Context

### Architecture & Technical Requirements

**Platform:** Vercel
**Source Control:** GitHub
**Domains:**
- Production: `hardwoodliving.com`
- Staging: `hardwoodliving.net`

**Environment Variables:**
Ensure the following are added to Vercel Project Settings:
- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET`
- `SANITY_API_READ_TOKEN`
- `SANITY_REVALIDATE_SECRET`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_SITE_URL`

### Implementation Guide

1.  **GitHub Repo:**
    Ensure local code is pushed to GitHub.

2.  **Vercel Project:**
    Import repo to Vercel.
    Configure "Production Branch" as `main`.
    Configure "Staging Domain" for a separate branch if using Preview URL aliases, or simply map `hardwoodliving.net` to the `staging` branch deployments (if Vercel flow supports branch domains, or use Project Environment Variables to differentiate).

3.  **DNS Config:**
    Login to WHC (User to provide access or update DNS themselves).
    Point A records (@) to Vercel IP (`76.76.21.21`).
    Point CNAME records (www) to `cname.vercel-dns.com`.

4.  **Verification:**
    Trigger a build on `staging`.
    Verify site loads.
    Trigger a build on `main`.
    Verify site loads.

### Dev Agent Record

#### Debug Log
*Log any build failures or DNS propagation delays.*

#### Completion Notes
*Confirm URLs are accessible.*

### Tasks / Subtasks

- [ ] Push local code to GitHub repository (main and staging branches)
- [ ] Import project to Vercel
- [ ] Add Environment Variables to Vercel
- [ ] Configure `hardwoodliving.com` domain for production
- [ ] Configure `hardwoodliving.net` domain for staging
- [ ] Update DNS records at WHC (User Action Required: Provide instructions)
- [ ] Verify Staging Deployment
- [ ] Verify Production Deployment
- [ ] Verify SSL certificates

### Change Log
- **2026-02-07**: Story created.
