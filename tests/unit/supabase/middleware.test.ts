import { describe, it, before } from 'node:test';
import assert from 'node:assert/strict';
import { loadEnvConfig } from '@next/env';
import type { NextRequest } from 'next/server';

describe('Supabase Middleware Helper', () => {
    let updateSession: (request: NextRequest) => Promise<Response>;

    before(async () => {
        loadEnvConfig(process.cwd());
        const mod = await import('../../../src/lib/supabase/middleware');
        updateSession = mod.updateSession;
    });

    it('should export an updateSession function', () => {
        assert.ok(updateSession, 'updateSession should be exported');
        assert.equal(typeof updateSession, 'function', 'updateSession should be a function');
    });

    it('should be an async function', () => {
        assert.equal(
            updateSession.constructor.name,
            'AsyncFunction',
            'updateSession should be async'
        );
    });

    it('should accept exactly one parameter (request: NextRequest)', () => {
        assert.equal(
            updateSession.length,
            1,
            'updateSession should accept exactly 1 parameter'
        );
    });

    // NOTE: Full behavior testing (cookie handling, auth token refresh,
    // NextResponse creation) requires a real NextRequest object and
    // Supabase connection. These are covered by integration/e2e tests.
});
