import { describe, it, before } from 'node:test';
import assert from 'node:assert/strict';
import { loadEnvConfig } from '@next/env';

describe('Supabase Server Client', () => {
    let createClient: () => Promise<ReturnType<typeof import('@supabase/ssr').createServerClient>>;

    before(async () => {
        loadEnvConfig(process.cwd());
        const mod = await import('../../../src/lib/supabase/server');
        createClient = mod.createClient;
    });

    it('should export a createClient function', () => {
        assert.ok(createClient, 'createClient should be exported');
        assert.equal(typeof createClient, 'function', 'createClient should be a function');
    });

    it('should be an async function (returns Promise for cookie access)', () => {
        // createClient is async because it awaits cookies() from next/headers
        assert.equal(
            createClient.constructor.name,
            'AsyncFunction',
            'createClient should be async'
        );
    });

    it('should throw if NEXT_PUBLIC_SUPABASE_URL is missing', async () => {
        const originalUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        delete process.env.NEXT_PUBLIC_SUPABASE_URL;
        try {
            await assert.rejects(
                () => createClient(),
                { message: /Missing env\.NEXT_PUBLIC_SUPABASE_URL/ }
            );
        } finally {
            process.env.NEXT_PUBLIC_SUPABASE_URL = originalUrl;
        }
    });

    it('should throw if NEXT_PUBLIC_SUPABASE_ANON_KEY is missing', async () => {
        const originalKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        try {
            await assert.rejects(
                () => createClient(),
                { message: /Missing env\.NEXT_PUBLIC_SUPABASE_ANON_KEY/ }
            );
        } finally {
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = originalKey;
        }
    });

    // NOTE: Full behavior testing (cookie handling, Supabase client creation)
    // requires Next.js request context for cookies() from 'next/headers'.
    // These are covered by integration/e2e tests, not unit tests.
});
