import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Vercel Configuration', () => {
    const vercelConfigPath = resolve(process.cwd(), 'vercel.json');

    it('should have vercel.json in project root', () => {
        assert.ok(
            existsSync(vercelConfigPath),
            'vercel.json must exist for Vercel deployment configuration'
        );
    });

    it('should contain valid JSON', () => {
        const content = readFileSync(vercelConfigPath, 'utf-8');
        let config: Record<string, unknown>;
        assert.doesNotThrow(() => {
            config = JSON.parse(content);
        }, 'vercel.json must contain valid JSON');
    });

    it('should configure security headers', () => {
        const content = readFileSync(vercelConfigPath, 'utf-8');
        const config = JSON.parse(content);
        assert.ok(config.headers, 'vercel.json should configure response headers');
        assert.ok(Array.isArray(config.headers), 'headers should be an array');

        // Check for essential security headers
        const allHeaders = config.headers.flatMap(
            (h: { headers: { key: string; value: string }[] }) => h.headers.map((hh: { key: string }) => hh.key)
        );
        assert.ok(
            allHeaders.includes('X-Frame-Options'),
            'Should include X-Frame-Options header'
        );
        assert.ok(
            allHeaders.includes('X-Content-Type-Options'),
            'Should include X-Content-Type-Options header'
        );
    });

    it('should configure framework as Next.js', () => {
        const content = readFileSync(vercelConfigPath, 'utf-8');
        const config = JSON.parse(content);
        assert.equal(config.framework, 'nextjs', 'Framework should be set to nextjs');
    });

    it('should have git integration settings', () => {
        const content = readFileSync(vercelConfigPath, 'utf-8');
        const config = JSON.parse(content);
        assert.ok(config.git, 'Should have git configuration');
        assert.equal(
            config.git.deploymentEnabled, true,
            'Git deployment should be enabled'
        );
    });
});

describe('Next.js Build Configuration', () => {
    it('should have next.config.ts', () => {
        const configPath = resolve(process.cwd(), 'next.config.ts');
        assert.ok(existsSync(configPath), 'next.config.ts must exist');
    });

    it('should have package.json with build script', () => {
        const pkgPath = resolve(process.cwd(), 'package.json');
        const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));
        assert.ok(pkg.scripts?.build, 'package.json must have a build script');
        assert.ok(
            pkg.scripts.build.includes('next build'),
            'Build script should use next build'
        );
    });
});
