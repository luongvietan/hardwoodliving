-- ============================================
-- Migration: Fix RLS policies - Remove authenticated SELECT access
-- Created: 2026-02-07
-- Description: Remediation for live database. Removes SELECT policies
--   and grants for 'authenticated' role. Admin reads should use
--   service_role key which bypasses RLS entirely.
-- ============================================

-- Drop existing SELECT policies (if they exist from initial migration)
DROP POLICY IF EXISTS "Enable read for authenticated users" ON trades;
DROP POLICY IF EXISTS "Enable read for authenticated users" ON inquiries;

-- Revoke SELECT from authenticated role
REVOKE SELECT ON trades FROM authenticated;
REVOKE SELECT ON inquiries FROM authenticated;
