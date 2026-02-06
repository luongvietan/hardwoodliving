-- ============================================
-- Migration: Initial Tables and RLS Policies
-- Created: 2026-02-07
-- Description: Creates trades and inquiries tables with Row Level Security policies
-- ============================================

-- ============================================
-- Table: trades
-- Stores trade/B2B registration submissions
-- ============================================
CREATE TABLE IF NOT EXISTS trades (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  company text,
  business_type text NOT NULL,
  email text NOT NULL,
  phone text,
  created_at timestamptz DEFAULT now(),
  status text DEFAULT 'pending'
);

-- ============================================
-- Table: inquiries
-- Stores customer consultation/contact form submissions
-- ============================================
CREATE TABLE IF NOT EXISTS inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  product_interest text,
  room_type text,
  area text,
  budget text,
  message text,
  created_at timestamptz DEFAULT now(),
  status text DEFAULT 'new'
);

-- ============================================
-- Enable Row Level Security on both tables
-- ============================================
ALTER TABLE trades ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;

-- ============================================
-- Grant base table permissions to Supabase roles
-- NOTE: Only anonymous INSERT is granted here.
-- Admin read/write access uses the service_role key
-- which bypasses RLS entirely (server-side only).
-- Do NOT grant SELECT to 'authenticated' — trade users
-- must not be able to read other users' data.
-- ============================================
GRANT INSERT ON trades TO anon;
GRANT INSERT ON inquiries TO anon;

-- ============================================
-- RLS Policies for trades table
-- ============================================

-- Policy: Allow anonymous users to insert (public form submissions)
CREATE POLICY "Enable insert for everyone" ON trades
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- NOTE: No SELECT policy for 'authenticated' role.
-- Admin operations (read, update, delete) use SUPABASE_SERVICE_ROLE_KEY
-- on the server side, which bypasses RLS entirely.
-- This ensures trade users cannot read other registrations.

-- ============================================
-- RLS Policies for inquiries table
-- ============================================

-- Policy: Allow anonymous users to insert (public form submissions)
CREATE POLICY "Enable insert for everyone" ON inquiries
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- NOTE: No SELECT policy for 'authenticated' role.
-- Admin operations use SUPABASE_SERVICE_ROLE_KEY (server-side only).
