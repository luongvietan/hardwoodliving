/**
 * Layout Component Tests
 *
 * Testing Strategy:
 * - **Behavioral tests** (preferred): Components without Next.js dependencies (e.g., Container)
 *   are rendered via `renderToStaticMarkup` and validated against actual HTML output.
 * - **Source-code validation tests**: Components that depend on `next/link` or `next/navigation`
 *   (Header, Footer, Navigation, MobileMenu, Breadcrumbs) cannot be rendered in a bare Node.js
 *   environment without mocking the Next.js router context. For these, we validate the source code
 *   to confirm structural patterns (CSS classes, ARIA attributes, component composition).
 * - **Data module tests**: Navigation data is tested behaviorally by importing actual exports.
 *
 * When React Testing Library + jsdom is added in a future story, the source-code validation tests
 * should be migrated to full behavioral rendering tests.
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

const LAYOUT_DIR = resolve(__dirname, '../../../src/components/layout');
const PROJECT_ROOT = resolve(__dirname, '../../..');

// Helper to read file content for source-code validation (used for components with Next.js dependencies)
function readComponent(filePath: string): string {
    return readFileSync(filePath, 'utf-8');
}

describe('Layout Component Files', () => {
    const requiredComponents = [
        'Container.tsx',
        'Header.tsx',
        'Footer.tsx',
        'Navigation.tsx',
        'MobileMenu.tsx',
        'Breadcrumbs.tsx',
    ];

    requiredComponents.forEach((component) => {
        it(`should have ${component} file`, () => {
            const filePath = resolve(LAYOUT_DIR, component);
            assert.ok(existsSync(filePath), `${component} should exist at ${filePath}`);
        });
    });
});

describe('Layout Component Exports', () => {
    it('should export Container as default', async () => {
        const mod = await import('../../../src/components/layout/Container');
        assert.ok(mod.default, 'Container should have a default export');
        assert.equal(typeof mod.default, 'function', 'Container should be a function component');
    });
});

// --- Behavioral Rendering Tests (no Next.js dependencies required) ---

describe('Container Component Behavior', () => {
    it('should render children inside a div with max-w-7xl', async () => {
        const mod = await import('../../../src/components/layout/Container');
        const Container = mod.default;
        const html = renderToStaticMarkup(createElement(Container, null, 'Hello World'));
        assert.ok(html.includes('Hello World'), 'Should render children content');
        assert.ok(html.includes('max-w-7xl'), 'Rendered HTML should contain max-w-7xl class');
        assert.ok(html.startsWith('<div'), 'Should render as a div element');
    });

    it('should apply responsive padding classes', async () => {
        const mod = await import('../../../src/components/layout/Container');
        const Container = mod.default;
        const html = renderToStaticMarkup(createElement(Container, null, 'Content'));
        assert.ok(html.includes('px-4'), 'Should have mobile padding (px-4)');
        assert.ok(html.includes('sm:px-6'), 'Should have tablet padding (sm:px-6)');
        assert.ok(html.includes('lg:px-8'), 'Should have desktop padding (lg:px-8)');
    });

    it('should merge custom className with base classes', async () => {
        const mod = await import('../../../src/components/layout/Container');
        const Container = mod.default;
        const html = renderToStaticMarkup(createElement(Container, { className: 'py-16', children: 'Content' }));
        assert.ok(html.includes('py-16'), 'Should include custom className');
        assert.ok(html.includes('max-w-7xl'), 'Should still include base max-w-7xl class');
    });

    it('should render with mx-auto for centering', async () => {
        const mod = await import('../../../src/components/layout/Container');
        const Container = mod.default;
        const html = renderToStaticMarkup(createElement(Container, null, 'Centered'));
        assert.ok(html.includes('mx-auto'), 'Should center container with mx-auto');
    });

    it('should render with w-full for full width', async () => {
        const mod = await import('../../../src/components/layout/Container');
        const Container = mod.default;
        const html = renderToStaticMarkup(createElement(Container, null, 'Full'));
        assert.ok(html.includes('w-full'), 'Should have w-full for full width within max-w');
    });
});

describe('Navigation Data Module', () => {
    it('should export navigation config', async () => {
        const mod = await import('../../../src/lib/navigation');
        assert.ok(mod.navigationLinks, 'Should export navigationLinks');
        assert.ok(mod.contactInfo, 'Should export contactInfo');
        assert.ok(mod.socialLinks, 'Should export socialLinks');
        assert.ok(Array.isArray(mod.navigationLinks), 'navigationLinks should be an array');
        assert.ok(Array.isArray(mod.socialLinks), 'socialLinks should be an array');
    });
});

describe('Header Component Content Validation', () => {
    const headerContent = readComponent(resolve(LAYOUT_DIR, 'Header.tsx'));

    it('should include the site logo text', () => {
        assert.ok(headerContent.includes('Hardwood'), 'Header should contain "Hardwood" logo text');
        assert.ok(headerContent.includes('Living'), 'Header should contain "Living" logo text');
    });

    it('should use sticky positioning', () => {
        assert.ok(headerContent.includes('sticky'), 'Header should use sticky positioning');
    });

    it('should include Navigation component', () => {
        assert.ok(headerContent.includes('Navigation'), 'Header should include Navigation component');
    });

    it('should include MobileMenu component', () => {
        assert.ok(headerContent.includes('MobileMenu'), 'Header should include MobileMenu component');
    });

    it('should link logo to homepage', () => {
        assert.ok(headerContent.includes('href="/"'), 'Header logo should link to homepage');
    });
});

describe('Footer Component Content Validation', () => {
    const footerContent = readComponent(resolve(LAYOUT_DIR, 'Footer.tsx'));

    it('should display contact information', () => {
        assert.ok(footerContent.includes('contactInfo.phone'), 'Footer should display phone number');
        assert.ok(footerContent.includes('contactInfo.email'), 'Footer should display email');
        assert.ok(footerContent.includes('contactInfo.address'), 'Footer should display address');
    });

    it('should display social links', () => {
        assert.ok(footerContent.includes('socialLinks'), 'Footer should render social links');
    });

    it('should display copyright', () => {
        assert.ok(footerContent.includes('getFullYear'), 'Footer should use dynamic year for copyright');
        assert.ok(footerContent.includes('All rights reserved'), 'Footer should include copyright text');
    });

    it('should use responsive grid layout', () => {
        assert.ok(footerContent.includes('grid-cols-1'), 'Footer should have mobile single column');
        assert.ok(footerContent.includes('lg:grid-cols-4'), 'Footer should have desktop 4-column grid');
    });

    it('should have external links with rel attributes', () => {
        assert.ok(
            footerContent.includes('rel="noopener noreferrer"'),
            'External social links should have noopener noreferrer'
        );
    });
});

describe('MobileMenu Component Validation', () => {
    const menuContent = readComponent(resolve(LAYOUT_DIR, 'MobileMenu.tsx'));

    it('should be a client component', () => {
        assert.ok(menuContent.includes("'use client'"), 'MobileMenu should be a client component');
    });

    it('should have accessibility attributes on hamburger button', () => {
        assert.ok(menuContent.includes('aria-expanded'), 'Should have aria-expanded on toggle button');
        assert.ok(menuContent.includes('aria-controls'), 'Should have aria-controls on toggle button');
        assert.ok(menuContent.includes('aria-label'), 'Should have aria-label on toggle button');
    });

    it('should handle Escape key to close menu', () => {
        assert.ok(menuContent.includes('Escape'), 'MobileMenu should handle Escape key');
    });

    it('should close on route change', () => {
        assert.ok(menuContent.includes('usePathname'), 'MobileMenu should use usePathname for route detection');
    });

    it('should handle click outside to close menu', () => {
        assert.ok(menuContent.includes('mousedown'), 'MobileMenu should handle click outside');
    });

    it('should implement focus trap', () => {
        assert.ok(menuContent.includes('focusableElements'), 'MobileMenu should implement focus trap');
    });

    it('should be hidden on desktop (md breakpoint)', () => {
        assert.ok(menuContent.includes('md:hidden'), 'MobileMenu should be hidden on md+ screens');
    });
});

describe('Navigation Component Validation', () => {
    const navContent = readComponent(resolve(LAYOUT_DIR, 'Navigation.tsx'));

    it('should use next/link for internal navigation', () => {
        assert.ok(navContent.includes("from 'next/link'"), 'Navigation should import from next/link');
        assert.ok(navContent.includes('<Link'), 'Navigation should use Link component');
    });

    it('should be hidden on mobile, shown on desktop', () => {
        assert.ok(navContent.includes('hidden md:flex'), 'Navigation should be hidden on mobile, flex on desktop');
    });

    it('should have accessible navigation landmark', () => {
        assert.ok(navContent.includes('aria-label'), 'Navigation should have aria-label for accessibility');
    });
});

describe('Breadcrumbs Component Validation', () => {
    const crumbsContent = readComponent(resolve(LAYOUT_DIR, 'Breadcrumbs.tsx'));

    it('should be a client component for pathname access', () => {
        assert.ok(crumbsContent.includes("'use client'"), 'Breadcrumbs should be a client component');
    });

    it('should hide on homepage', () => {
        assert.ok(
            crumbsContent.includes("pathname === '/'"),
            'Breadcrumbs should return null on homepage'
        );
    });

    it('should hide on admin pages', () => {
        assert.ok(
            crumbsContent.includes("/admin"),
            'Breadcrumbs should hide on admin pages'
        );
    });

    it('should have breadcrumb aria-label', () => {
        assert.ok(crumbsContent.includes('aria-label="Breadcrumb"'), 'Breadcrumbs should have aria-label');
    });

    it('should mark current page with aria-current', () => {
        assert.ok(crumbsContent.includes('aria-current="page"'), 'Current breadcrumb should have aria-current');
    });
});

// Note: Container behavioral rendering tests are in "Container Component Behavior" suite above.
// The source-code validation below is kept for structural prop interface verification only.
describe('Container Component Source Validation', () => {
    const containerContent = readComponent(resolve(LAYOUT_DIR, 'Container.tsx'));

    it('should accept optional className prop in interface', () => {
        assert.ok(containerContent.includes('className?'), 'Container should accept optional className prop');
    });
});

describe('Root Layout Validation', () => {
    const layoutContent = readComponent(resolve(PROJECT_ROOT, 'src/app/layout.tsx'));

    it('should include Header component', () => {
        assert.ok(layoutContent.includes('<Header'), 'Root layout should include Header');
    });

    it('should include Footer component', () => {
        assert.ok(layoutContent.includes('<Footer'), 'Root layout should include Footer');
    });

    it('should include Breadcrumbs component', () => {
        assert.ok(layoutContent.includes('<Breadcrumbs'), 'Root layout should include Breadcrumbs');
    });

    it('should have skip navigation link', () => {
        assert.ok(layoutContent.includes('Skip to main content'), 'Root layout should have skip navigation link');
        assert.ok(layoutContent.includes('id="main-content"'), 'Root layout should have main-content id target');
    });

    it('should have proper HTML lang attribute', () => {
        assert.ok(layoutContent.includes('lang="en"'), 'Root layout should set lang="en"');
    });

    it('should have semantic main element', () => {
        assert.ok(layoutContent.includes('<main'), 'Root layout should use semantic main element');
    });
});

describe('Placeholder Pages', () => {
    const requiredPages = [
        { path: 'src/app/categories/flooring/page.tsx', title: 'Flooring' },
        { path: 'src/app/categories/cabinetry/page.tsx', title: 'Cabinetry' },
        { path: 'src/app/pages/visit-us/page.tsx', title: 'Visit Us' },
        { path: 'src/app/pages/care-guide/page.tsx', title: 'Care Guide' },
        { path: 'src/app/pages/why-wood/page.tsx', title: 'Why Wood?' },
        { path: 'src/app/contact/page.tsx', title: 'Contact' },
        { path: 'src/app/trades/page.tsx', title: 'Trades' },
    ];

    requiredPages.forEach(({ path, title }) => {
        it(`should have placeholder page at ${path}`, () => {
            const filePath = resolve(PROJECT_ROOT, path);
            assert.ok(existsSync(filePath), `Placeholder page should exist at ${path}`);
        });

        it(`should have metadata with title "${title}" at ${path}`, () => {
            const content = readComponent(resolve(PROJECT_ROOT, path));
            assert.ok(content.includes('Metadata'), `${path} should export Metadata`);
            assert.ok(content.includes(`title: '${title}'`), `${path} should have correct title metadata`);
        });

        it(`should use Container component at ${path}`, () => {
            const content = readComponent(resolve(PROJECT_ROOT, path));
            assert.ok(content.includes('Container'), `${path} should use Container component`);
        });
    });

    it('homepage should use next/link for internal links', () => {
        const content = readComponent(resolve(PROJECT_ROOT, 'src/app/page.tsx'));
        assert.ok(content.includes("from \"next/link\""), 'Homepage should import Link from next/link');
        assert.ok(!content.match(/<a\s+href="\//), 'Homepage should not use raw <a> tags for internal links');
    });
});
