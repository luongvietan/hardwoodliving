import { describe, it, before } from 'node:test';
import assert from 'node:assert/strict';
import { loadEnvConfig } from '@next/env';
import { createClient } from '@supabase/supabase-js';

describe('Supabase Connection Verification', () => {
    let supabase: ReturnType<typeof createClient>;
    let adminClient: ReturnType<typeof createClient>;

    before(() => {
        loadEnvConfig(process.cwd());
        supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );
        adminClient = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );
    });

    it('should have valid environment variables configured', () => {
        assert.ok(process.env.NEXT_PUBLIC_SUPABASE_URL, 'NEXT_PUBLIC_SUPABASE_URL should be set');
        assert.ok(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, 'NEXT_PUBLIC_SUPABASE_ANON_KEY should be set');
        assert.ok(process.env.SUPABASE_SERVICE_ROLE_KEY, 'SUPABASE_SERVICE_ROLE_KEY should be set');
        assert.ok(
            process.env.NEXT_PUBLIC_SUPABASE_URL!.startsWith('https://'),
            'Supabase URL should start with https://'
        );
    });

    it('should be able to connect to Supabase', async () => {
        const { error } = await supabase.auth.getSession();
        assert.equal(error, null, 'Should connect without errors');
    });

    it('should be able to insert into trades table (anonymous)', async () => {
        // Anonymous insert WITHOUT .select() since anon has no SELECT permission
        const { error } = await supabase.from('trades').insert({
            name: 'Test Trade User',
            business_type: 'retailer',
            email: 'test-trade@example.com',
        });

        assert.equal(error, null, `Should insert without error: ${error?.message}`);

        // Verify via admin client (service_role bypasses RLS)
        const { data } = await adminClient
            .from('trades')
            .select('*')
            .eq('email', 'test-trade@example.com')
            .single();

        assert.ok(data, 'Admin should be able to read the inserted trade');
        assert.equal(data!.name, 'Test Trade User');
        assert.equal(data!.status, 'pending');

        // Clean up
        if (data) {
            await adminClient.from('trades').delete().eq('id', data.id);
        }
    });

    it('should be able to insert into inquiries table (anonymous)', async () => {
        // Anonymous insert WITHOUT .select()
        const { error } = await supabase.from('inquiries').insert({
            name: 'Test Inquiry User',
            email: 'test-inquiry@example.com',
            product_interest: 'hardwood flooring',
            message: 'Test inquiry message',
        });

        assert.equal(error, null, `Should insert without error: ${error?.message}`);

        // Verify via admin client
        const { data } = await adminClient
            .from('inquiries')
            .select('*')
            .eq('email', 'test-inquiry@example.com')
            .single();

        assert.ok(data, 'Admin should be able to read the inserted inquiry');
        assert.equal(data!.name, 'Test Inquiry User');
        assert.equal(data!.status, 'new');

        // Clean up
        if (data) {
            await adminClient.from('inquiries').delete().eq('id', data.id);
        }
    });

    it('should deny anonymous read on trades table (RLS)', async () => {
        const { data, error } = await supabase.from('trades').select('*');
        // With RLS, anonymous users should get empty result
        assert.ok(data !== null || error !== null, 'Should enforce RLS');
        if (data) {
            assert.equal(data.length, 0, 'Anonymous should not be able to read trades');
        }
    });

    it('should deny anonymous read on inquiries table (RLS)', async () => {
        const { data, error } = await supabase.from('inquiries').select('*');
        assert.ok(data !== null || error !== null, 'Should enforce RLS');
        if (data) {
            assert.equal(data.length, 0, 'Anonymous should not be able to read inquiries');
        }
    });
});
