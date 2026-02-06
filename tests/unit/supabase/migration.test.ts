import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

describe('SQL Migration: Init Tables and RLS', () => {
    const migrationPath = join(process.cwd(), 'supabase', 'migrations', '0001_init_tables_and_rls.sql');
    let sql: string;

    it('should exist and be readable', () => {
        sql = readFileSync(migrationPath, 'utf-8');
        assert.ok(sql.length > 0, 'Migration file should not be empty');
    });

    describe('trades table', () => {
        it('should create trades table with correct columns', () => {
            sql = readFileSync(migrationPath, 'utf-8');
            assert.ok(sql.includes('CREATE TABLE'), 'Should contain CREATE TABLE');
            assert.ok(sql.includes('trades'), 'Should reference trades table');
            assert.ok(sql.includes('id uuid PRIMARY KEY DEFAULT gen_random_uuid()'), 'Should have uuid PK');
            assert.ok(sql.includes('name text NOT NULL'), 'Should have name column');
            assert.ok(sql.includes('business_type text NOT NULL'), 'Should have business_type column');
            assert.ok(sql.includes('email text NOT NULL'), 'Should have email column');
            assert.ok(sql.includes("status text DEFAULT 'pending'"), 'Should have status with pending default');
        });

        it('should enable RLS on trades table', () => {
            sql = readFileSync(migrationPath, 'utf-8');
            assert.ok(sql.includes('ALTER TABLE trades ENABLE ROW LEVEL SECURITY'), 'Should enable RLS on trades');
        });

        it('should define insert policy for anonymous users on trades', () => {
            sql = readFileSync(migrationPath, 'utf-8');
            assert.ok(
                sql.includes('CREATE POLICY') && sql.includes('ON trades') && sql.includes('FOR INSERT') && sql.includes('TO anon'),
                'Should have anonymous insert policy on trades'
            );
        });

        it('should NOT grant SELECT to authenticated role (admin uses service_role)', () => {
            sql = readFileSync(migrationPath, 'utf-8');
            assert.ok(
                !sql.includes('GRANT SELECT ON trades TO authenticated'),
                'Should NOT grant SELECT on trades to authenticated — admin uses service_role which bypasses RLS'
            );
        });

        it('should NOT have a SELECT policy for authenticated users', () => {
            sql = readFileSync(migrationPath, 'utf-8');
            // Check there is no SELECT policy targeting authenticated on trades
            const lines = sql.split('\n');
            let inTradesSelectPolicy = false;
            for (const line of lines) {
                if (line.includes('FOR SELECT') && line.includes('ON trades')) {
                    inTradesSelectPolicy = true;
                }
                if (inTradesSelectPolicy && line.includes('TO authenticated')) {
                    assert.fail('Should NOT have authenticated SELECT policy on trades — admin uses service_role');
                }
            }
        });
    });

    describe('inquiries table', () => {
        it('should create inquiries table with correct columns', () => {
            sql = readFileSync(migrationPath, 'utf-8');
            assert.ok(sql.includes('inquiries'), 'Should reference inquiries table');
            assert.ok(sql.includes('product_interest text'), 'Should have product_interest column');
            assert.ok(sql.includes('room_type text'), 'Should have room_type column');
            assert.ok(sql.includes('area text'), 'Should have area column');
            assert.ok(sql.includes('budget text'), 'Should have budget column');
            assert.ok(sql.includes('message text'), 'Should have message column');
            assert.ok(sql.includes("status text DEFAULT 'new'"), 'Should have status with new default');
        });

        it('should enable RLS on inquiries table', () => {
            sql = readFileSync(migrationPath, 'utf-8');
            assert.ok(sql.includes('ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY'), 'Should enable RLS on inquiries');
        });

        it('should define insert policy for anonymous users on inquiries', () => {
            sql = readFileSync(migrationPath, 'utf-8');
            assert.ok(
                sql.includes('ON inquiries') && sql.includes('FOR INSERT'),
                'Should have anonymous insert policy on inquiries'
            );
        });

        it('should NOT grant SELECT to authenticated role (admin uses service_role)', () => {
            sql = readFileSync(migrationPath, 'utf-8');
            assert.ok(
                !sql.includes('GRANT SELECT ON inquiries TO authenticated'),
                'Should NOT grant SELECT on inquiries to authenticated — admin uses service_role which bypasses RLS'
            );
        });
    });
});

describe('SQL Migration: Fix RLS Admin-Only (Remediation)', () => {
    const migrationPath = join(process.cwd(), 'supabase', 'migrations', '0002_fix_rls_admin_only.sql');
    let sql: string;

    it('should exist and be readable', () => {
        sql = readFileSync(migrationPath, 'utf-8');
        assert.ok(sql.length > 0, 'Remediation migration file should not be empty');
    });

    it('should drop old authenticated SELECT policies', () => {
        sql = readFileSync(migrationPath, 'utf-8');
        assert.ok(
            sql.includes('DROP POLICY IF EXISTS "Enable read for authenticated users" ON trades'),
            'Should drop old trades SELECT policy'
        );
        assert.ok(
            sql.includes('DROP POLICY IF EXISTS "Enable read for authenticated users" ON inquiries'),
            'Should drop old inquiries SELECT policy'
        );
    });

    it('should revoke SELECT from authenticated role', () => {
        sql = readFileSync(migrationPath, 'utf-8');
        assert.ok(sql.includes('REVOKE SELECT ON trades FROM authenticated'), 'Should revoke SELECT on trades');
        assert.ok(sql.includes('REVOKE SELECT ON inquiries FROM authenticated'), 'Should revoke SELECT on inquiries');
    });
});
