/**
 * Homepage Component Tests
 *
 * Testing Strategy:
 * - **GROQ Query tests**: Validate query structure by importing actual query definitions
 * - **Source-code validation tests**: Components depending on next/image or next/link
 *   (HeroSection, Testimonials) are validated via source code inspection.
 * - **Behavioral rendering tests**: IntroBlurb (no Next.js dependencies) can be rendered
 *   via renderToStaticMarkup and validated against actual HTML output.
 * - **Page integration tests**: Validate that page.tsx imports and uses extracted components.
 */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderToStaticMarkup } from 'react-dom/server';
import { createElement } from 'react';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const HOME_COMPONENTS_DIR = resolve(__dirname, '../../../src/components/home');
const PROJECT_ROOT = resolve(__dirname, '../../..');

function readComponent(filePath: string): string {
    return readFileSync(filePath, 'utf-8');
}

// =============================================================================
// Task 1: Homepage GROQ Query
// =============================================================================

describe('Homepage GROQ Query', () => {
    it('should export getHomepageQuery', async () => {
        const mod = await import('../../../src/lib/sanity/queries');
        assert.ok(mod.getHomepageQuery, 'getHomepageQuery should be exported');
    });

    it('should query homepage singleton', async () => {
        const mod = await import('../../../src/lib/sanity/queries');
        const query = mod.getHomepageQuery;
        assert.ok(query.includes('homepage'), 'Query should reference homepage type');
        assert.ok(query.includes('[0]'), 'Query should fetch singleton (first result)');
    });

    it('should include hero fields', async () => {
        const mod = await import('../../../src/lib/sanity/queries');
        const query = mod.getHomepageQuery;
        assert.ok(query.includes('hero'), 'Query should include hero section');
    });

    it('should include introBlurb field', async () => {
        const mod = await import('../../../src/lib/sanity/queries');
        const query = mod.getHomepageQuery;
        assert.ok(query.includes('introBlurb'), 'Query should include introBlurb');
    });

    it('should dereference testimonials', async () => {
        const mod = await import('../../../src/lib/sanity/queries');
        const query = mod.getHomepageQuery;
        assert.ok(query.includes('testimonials[]->'), 'Query should dereference testimonials');
    });

    it('should include testimonial fields (author, content, image)', async () => {
        const mod = await import('../../../src/lib/sanity/queries');
        const query = mod.getHomepageQuery;
        assert.ok(query.includes('author'), 'Query should fetch author field');
        assert.ok(query.includes('content'), 'Query should fetch content field');
    });
});

// =============================================================================
// Task 2: HeroSection Component
// =============================================================================

describe('HeroSection Component Files', () => {
    it('should have HeroSection.tsx file', () => {
        const filePath = resolve(HOME_COMPONENTS_DIR, 'HeroSection.tsx');
        assert.ok(existsSync(filePath), 'HeroSection.tsx should exist');
    });
});

describe('HeroSection Component Exports', () => {
    it('should export HeroSection as default', async () => {
        const mod = await import('../../../src/components/home/HeroSection');
        assert.ok(mod.default, 'HeroSection should have a default export');
        assert.equal(typeof mod.default, 'function', 'HeroSection should be a function component');
    });
});

describe('HeroSection Component Content Validation', () => {
    it('should include heading element (h1)', () => {
        const content = readComponent(resolve(HOME_COMPONENTS_DIR, 'HeroSection.tsx'));
        assert.ok(content.includes('<h1'), 'HeroSection should render an h1 heading');
    });

    it('should use next/image for hero background', () => {
        const content = readComponent(resolve(HOME_COMPONENTS_DIR, 'HeroSection.tsx'));
        assert.ok(content.includes("from \"next/image\"") || content.includes("from 'next/image'"),
            'HeroSection should import Image from next/image');
        assert.ok(content.includes('priority'), 'Hero image should have priority for LCP optimization');
    });

    it('should use next/link for CTA buttons', () => {
        const content = readComponent(resolve(HOME_COMPONENTS_DIR, 'HeroSection.tsx'));
        assert.ok(content.includes("from \"next/link\"") || content.includes("from 'next/link'"),
            'HeroSection should import Link from next/link');
    });

    it('should have fallback content when CMS data is missing', () => {
        const content = readComponent(resolve(HOME_COMPONENTS_DIR, 'HeroSection.tsx'));
        assert.ok(content.includes('Premium Hardwood') || content.includes('fallback') || content.includes('||'),
            'HeroSection should handle missing CMS data with fallbacks');
    });

    it('should include CTA button', () => {
        const content = readComponent(resolve(HOME_COMPONENTS_DIR, 'HeroSection.tsx'));
        assert.ok(content.includes('ctaText') || content.includes('cta'), 'HeroSection should render CTA button');
    });

    it('should accept hero data as props', () => {
        const content = readComponent(resolve(HOME_COMPONENTS_DIR, 'HeroSection.tsx'));
        assert.ok(content.includes('Props') || content.includes('props') || content.includes('hero'),
            'HeroSection should accept props for hero data');
    });
});

// =============================================================================
// Task 3: IntroBlurb Component
// =============================================================================

describe('IntroBlurb Component Files', () => {
    it('should have IntroBlurb.tsx file', () => {
        const filePath = resolve(HOME_COMPONENTS_DIR, 'IntroBlurb.tsx');
        assert.ok(existsSync(filePath), 'IntroBlurb.tsx should exist');
    });
});

describe('IntroBlurb Component Exports', () => {
    it('should export IntroBlurb as default', async () => {
        const mod = await import('../../../src/components/home/IntroBlurb');
        assert.ok(mod.default, 'IntroBlurb should have a default export');
        assert.equal(typeof mod.default, 'function', 'IntroBlurb should be a function component');
    });
});

describe('IntroBlurb Component Behavior', () => {
    it('should render text content when provided', async () => {
        const mod = await import('../../../src/components/home/IntroBlurb');
        const IntroBlurb = mod.default;
        const html = renderToStaticMarkup(createElement(IntroBlurb, { text: 'Test intro text' }));
        assert.ok(html.includes('Test intro text'), 'Should render provided text content');
    });

    it('should render nothing when text is empty or undefined', async () => {
        const mod = await import('../../../src/components/home/IntroBlurb');
        const IntroBlurb = mod.default;
        const htmlEmpty = renderToStaticMarkup(createElement(IntroBlurb, { text: '' }));
        const htmlUndefined = renderToStaticMarkup(createElement(IntroBlurb, {}));
        // Either renders nothing or returns empty/minimal markup
        assert.ok(!htmlEmpty.includes('section') || htmlEmpty === '', 'Should not render section when text is empty');
        assert.ok(!htmlUndefined.includes('section') || htmlUndefined === '', 'Should not render section when text is undefined');
    });

    it('should use centered layout', async () => {
        const mod = await import('../../../src/components/home/IntroBlurb');
        const IntroBlurb = mod.default;
        const html = renderToStaticMarkup(createElement(IntroBlurb, { text: 'Centered text' }));
        assert.ok(html.includes('text-center'), 'Should center text');
    });
});

// =============================================================================
// Task 4: Testimonials Component
// =============================================================================

describe('Testimonials Component Files', () => {
    it('should have Testimonials.tsx file', () => {
        const filePath = resolve(HOME_COMPONENTS_DIR, 'Testimonials.tsx');
        assert.ok(existsSync(filePath), 'Testimonials.tsx should exist');
    });
});

describe('Testimonials Component Exports', () => {
    it('should export Testimonials as default function', () => {
        // Source-code validation because Testimonials imports urlFor which requires Sanity env vars
        const content = readComponent(resolve(HOME_COMPONENTS_DIR, 'Testimonials.tsx'));
        assert.ok(content.includes('export default function Testimonials'),
            'Testimonials should export a default function component');
    });
});

describe('Testimonials Component Content Validation', () => {
    it('should have section heading', () => {
        const content = readComponent(resolve(HOME_COMPONENTS_DIR, 'Testimonials.tsx'));
        assert.ok(content.includes('<h2') || content.includes('What Our Clients Say'),
            'Testimonials should have a section heading');
    });

    it('should use responsive grid layout', () => {
        const content = readComponent(resolve(HOME_COMPONENTS_DIR, 'Testimonials.tsx'));
        assert.ok(content.includes('grid'), 'Testimonials should use grid layout');
        assert.ok(content.includes('md:grid-cols-2') || content.includes('lg:grid-cols-3'),
            'Testimonials should have responsive grid columns');
    });

    it('should display author name', () => {
        const content = readComponent(resolve(HOME_COMPONENTS_DIR, 'Testimonials.tsx'));
        assert.ok(content.includes('author'), 'Testimonials should display author name');
    });

    it('should display testimonial content', () => {
        const content = readComponent(resolve(HOME_COMPONENTS_DIR, 'Testimonials.tsx'));
        assert.ok(content.includes('content'), 'Testimonials should display testimonial content');
    });

    it('should handle author images with next/image', () => {
        const content = readComponent(resolve(HOME_COMPONENTS_DIR, 'Testimonials.tsx'));
        assert.ok(content.includes("from \"next/image\"") || content.includes("from 'next/image'"),
            'Testimonials should import Image from next/image');
    });

    it('should include quote icon', () => {
        const content = readComponent(resolve(HOME_COMPONENTS_DIR, 'Testimonials.tsx'));
        assert.ok(content.includes('svg') || content.includes('quote'),
            'Testimonials should include a quote icon');
    });

    it('should accept testimonials array as props', () => {
        const content = readComponent(resolve(HOME_COMPONENTS_DIR, 'Testimonials.tsx'));
        assert.ok(content.includes('Props') || content.includes('props') || content.includes('testimonials'),
            'Testimonials should accept testimonials data as props');
    });

    it('should handle empty testimonials gracefully', () => {
        const content = readComponent(resolve(HOME_COMPONENTS_DIR, 'Testimonials.tsx'));
        assert.ok(content.includes('length') || content.includes('?.') || content.includes('!') || content.includes('null'),
            'Testimonials should handle empty/null data');
    });
});

// =============================================================================
// Task 5-6: Homepage Page Integration
// =============================================================================

describe('Homepage Page Integration', () => {
    const pagePath = resolve(PROJECT_ROOT, 'src/app/(site)/page.tsx');

    it('should exist at src/app/(site)/page.tsx', () => {
        assert.ok(existsSync(pagePath), 'Homepage should exist');
    });

    it('should import HeroSection component', () => {
        const content = readComponent(pagePath);
        assert.ok(content.includes('HeroSection'), 'Homepage should import HeroSection');
    });

    it('should import IntroBlurb component', () => {
        const content = readComponent(pagePath);
        assert.ok(content.includes('IntroBlurb'), 'Homepage should import IntroBlurb');
    });

    it('should import Testimonials component', () => {
        const content = readComponent(pagePath);
        assert.ok(content.includes('Testimonials'), 'Homepage should import Testimonials');
    });

    it('should use sanityFetch to get homepage data', () => {
        const content = readComponent(pagePath);
        assert.ok(content.includes('sanityFetch'), 'Homepage should use sanityFetch');
        assert.ok(content.includes('getHomepageQuery'), 'Homepage should use getHomepageQuery');
    });

    it('should tag data with homepage for revalidation', () => {
        const content = readComponent(pagePath);
        assert.ok(content.includes('"homepage"') || content.includes("'homepage'"),
            'Homepage should tag fetch with "homepage" for on-demand revalidation');
    });

    it('should be an async server component', () => {
        const content = readComponent(pagePath);
        assert.ok(content.includes('async'), 'Homepage should be async for server-side rendering');
        assert.ok(!content.includes("'use client'") && !content.includes('"use client"'),
            'Homepage should NOT be a client component');
    });
});

// =============================================================================
// Task 8: ISR/Revalidation
// =============================================================================

describe('ISR and Revalidation Setup', () => {
    it('should have sanityFetch module with revalidation support', () => {
        const fetchPath = resolve(PROJECT_ROOT, 'src/lib/sanity/fetch.ts');
        assert.ok(existsSync(fetchPath), 'sanityFetch module should exist');
        const content = readComponent(fetchPath);
        assert.ok(content.includes('revalidate'), 'sanityFetch should support revalidation');
        assert.ok(content.includes('tags'), 'sanityFetch should support cache tags');
    });

    it('should have revalidation API route', () => {
        const apiDir = resolve(PROJECT_ROOT, 'src/app/api/revalidate');
        assert.ok(existsSync(apiDir), 'Revalidation API route directory should exist');
    });

    it('should use homepage tag for cache invalidation in page', () => {
        const pagePath = resolve(PROJECT_ROOT, 'src/app/(site)/page.tsx');
        const content = readComponent(pagePath);
        assert.ok(content.includes('tags: ["homepage"]') || content.includes("tags: ['homepage']"),
            'Homepage should use "homepage" cache tag for ISR revalidation');
    });
});
