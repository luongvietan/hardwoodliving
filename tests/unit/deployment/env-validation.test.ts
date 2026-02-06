import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Deployment Environment Variable Validation', () => {
    const envExamplePath = resolve(process.cwd(), '.env.example');

    it('should have .env.example file in project root', () => {
        assert.ok(
            existsSync(envExamplePath),
            '.env.example must exist to document required environment variables'
        );
    });

    it('.env.example should contain all required Sanity variables', () => {
        const content = readFileSync(envExamplePath, 'utf-8');
        const requiredSanityVars = [
            'NEXT_PUBLIC_SANITY_PROJECT_ID',
            'NEXT_PUBLIC_SANITY_DATASET',
            'SANITY_API_READ_TOKEN',
            'SANITY_REVALIDATE_SECRET',
        ];
        for (const varName of requiredSanityVars) {
            assert.ok(
                content.includes(varName),
                `.env.example must include ${varName}`
            );
        }
    });

    it('.env.example should contain all required Supabase variables', () => {
        const content = readFileSync(envExamplePath, 'utf-8');
        const requiredSupabaseVars = [
            'NEXT_PUBLIC_SUPABASE_URL',
            'NEXT_PUBLIC_SUPABASE_ANON_KEY',
            'SUPABASE_SERVICE_ROLE_KEY',
        ];
        for (const varName of requiredSupabaseVars) {
            assert.ok(
                content.includes(varName),
                `.env.example must include ${varName}`
            );
        }
    });

    it('.env.example should contain NEXT_PUBLIC_SITE_URL', () => {
        const content = readFileSync(envExamplePath, 'utf-8');
        assert.ok(
            content.includes('NEXT_PUBLIC_SITE_URL'),
            '.env.example must include NEXT_PUBLIC_SITE_URL'
        );
    });

    it('.env.example should NOT contain actual secret values', () => {
        const content = readFileSync(envExamplePath, 'utf-8');
        // Ensure no real tokens/keys are in the example file
        assert.ok(
            !content.includes('sk') || content.includes('your_'),
            '.env.example should use placeholder values, not real secrets'
        );
        // Check that values are placeholders
        const lines = content.split('\n').filter(l => l.includes('=') && !l.startsWith('#'));
        for (const line of lines) {
            const value = line.split('=')[1]?.trim();
            if (value && value.length > 0) {
                // Values should be placeholder-like (contain 'your_' or be example URLs)
                const isPlaceholder = value.startsWith('your_') ||
                    value.startsWith('http://localhost') ||
                    value.startsWith('https://your') ||
                    value === 'production' ||
                    value === '';
                assert.ok(
                    isPlaceholder,
                    `env var value in .env.example should be a placeholder, got: ${line}`
                );
            }
        }
    });
});
