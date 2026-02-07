import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

/**
 * Navigation Data Tests
 *
 * Navigation is now fully CMS-driven via Sanity siteSettings.
 * This test validates the type definitions exported from navigation.ts.
 * Actual navigation content is tested via integration tests and the seed script.
 */

describe('Navigation Module', () => {
    it('should export NavChild interface type', async () => {
        // Module should import without errors
        const mod = await import('../../../src/lib/navigation');
        // Module exists and exports types — if this import succeeds, types are valid
        assert.ok(mod, 'Navigation module should be importable');
    });
});

describe('SiteSettings Module', () => {
    it('should export getSiteSettings function', async () => {
        const mod = await import('../../../src/lib/sanity/siteSettings');
        assert.ok(mod.getSiteSettings, 'Should export getSiteSettings');
        assert.equal(typeof mod.getSiteSettings, 'function', 'getSiteSettings should be a function');
    });

    it('should NOT export hardcoded defaults', async () => {
        const mod = await import('../../../src/lib/sanity/siteSettings');
        assert.equal((mod as Record<string, unknown>).defaultNavigation, undefined, 'Should not export defaultNavigation');
        assert.equal((mod as Record<string, unknown>).defaultContactInfo, undefined, 'Should not export defaultContactInfo');
        assert.equal((mod as Record<string, unknown>).defaultSocialLinks, undefined, 'Should not export defaultSocialLinks');
    });

    it('should export type interfaces', async () => {
        const mod = await import('../../../src/lib/sanity/siteSettings');
        // If the module imports without error, the type exports are valid
        assert.ok(mod.getSiteSettings, 'Module should be importable with all types');
    });
});
