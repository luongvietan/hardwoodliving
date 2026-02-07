/**
 * HeroSection Component Tests (co-located)
 *
 * Validates file existence, exports, and source-code structure.
 * HeroSection depends on next/image and next/link, so behavioral
 * rendering is not feasible in Node.js test runner — uses source
 * code inspection instead.
 */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function readComponent(filePath: string): string {
    return readFileSync(filePath, 'utf-8');
}

const HERO_PATH = resolve(__dirname, 'HeroSection.tsx');

describe('HeroSection Component Files', () => {
    it('should have HeroSection.tsx file', () => {
        assert.ok(existsSync(HERO_PATH), 'HeroSection.tsx should exist');
    });
});

describe('HeroSection Component Exports', () => {
    it('should export HeroSection as default', async () => {
        const mod = await import('./HeroSection');
        assert.ok(mod.default, 'HeroSection should have a default export');
        assert.equal(typeof mod.default, 'function', 'HeroSection should be a function component');
    });
});

describe('HeroSection Component Content Validation', () => {
    it('should include h1 heading element', () => {
        const content = readComponent(HERO_PATH);
        assert.ok(content.includes('<h1'), 'HeroSection should render an h1 heading');
    });

    it('should use next/image with priority for LCP optimization', () => {
        const content = readComponent(HERO_PATH);
        assert.ok(
            content.includes("from \"next/image\"") || content.includes("from 'next/image'"),
            'HeroSection should import Image from next/image'
        );
        assert.ok(content.includes('priority'), 'Hero image should have priority for LCP optimization');
    });

    it('should use next/link for CTA navigation', () => {
        const content = readComponent(HERO_PATH);
        assert.ok(
            content.includes("from \"next/link\"") || content.includes("from 'next/link'"),
            'HeroSection should import Link from next/link'
        );
        assert.ok(content.includes('<Link'), 'HeroSection should render Link components for CTAs');
    });

    it('should have fallback content when CMS data is missing', () => {
        const content = readComponent(HERO_PATH);
        assert.ok(
            content.includes('Premium Hardwood'),
            'HeroSection should provide fallback heading text'
        );
        assert.ok(
            content.includes('|| "'),
            'HeroSection should use OR operator for fallback values'
        );
    });

    it('should render CTA with configurable text and link', () => {
        const content = readComponent(HERO_PATH);
        assert.ok(content.includes('ctaText'), 'HeroSection should accept ctaText prop');
        assert.ok(content.includes('ctaLink'), 'HeroSection should accept ctaLink prop');
        assert.ok(content.includes('{ctaText}'), 'HeroSection should render dynamic CTA text');
    });

    it('should define typed props interface', () => {
        const content = readComponent(HERO_PATH);
        assert.ok(
            content.includes('interface HeroSectionProps'),
            'HeroSection should define a HeroSectionProps interface'
        );
        assert.ok(content.includes('heading?:'), 'Props should include optional heading');
        assert.ok(content.includes('imageUrl?:'), 'Props should include optional imageUrl');
    });

    it('should mark hero background image as decorative with empty alt', () => {
        const content = readComponent(HERO_PATH);
        assert.ok(
            content.includes('alt=""'),
            'Hero background image should have empty alt text (decorative)'
        );
    });

    it('should specify sizes attribute for responsive image loading', () => {
        const content = readComponent(HERO_PATH);
        assert.ok(
            content.includes('sizes='),
            'Hero image should specify sizes for optimal responsive loading'
        );
    });
});
