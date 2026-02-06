import { describe, it, before } from 'node:test';
import assert from 'node:assert/strict';
import { loadEnvConfig } from '@next/env';

describe('Supabase Browser Client', () => {
    let createClient: () => ReturnType<typeof import('@supabase/ssr').createBrowserClient>;

    before(async () => {
        loadEnvConfig(process.cwd());
        const mod = await import('../../../src/lib/supabase/client');
        createClient = mod.createClient;
    });

    it('should export a createClient function', () => {
        assert.ok(createClient, 'createClient should be exported');
        assert.equal(typeof createClient, 'function', 'createClient should be a function');
    });

    it('should return a Supabase client instance', () => {
        const client = createClient();
        assert.ok(client, 'Client should be defined');
        assert.ok(client.auth, 'Client should have auth property');
        assert.ok(client.from, 'Client should have from method');
    });

    it('should return a typed client with from() method', () => {
        const client = createClient();
        // Verify that the typed client can reference known tables
        assert.ok(typeof client.from === 'function', 'Client should have from() method for table queries');
    });

    it('should throw if NEXT_PUBLIC_SUPABASE_URL is missing', () => {
        const originalUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        delete process.env.NEXT_PUBLIC_SUPABASE_URL;
        try {
            assert.throws(
                () => createClient(),
                { message: /Missing env\.NEXT_PUBLIC_SUPABASE_URL/ }
            );
        } finally {
            process.env.NEXT_PUBLIC_SUPABASE_URL = originalUrl;
        }
    });

    it('should throw if NEXT_PUBLIC_SUPABASE_ANON_KEY is missing', () => {
        const originalKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        try {
            assert.throws(
                () => createClient(),
                { message: /Missing env\.NEXT_PUBLIC_SUPABASE_ANON_KEY/ }
            );
        } finally {
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = originalKey;
        }
    });
});
