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
        'SearchBar.tsx',
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

describe('Header Component Content Validation', () => {
    const headerContent = readComponent(resolve(LAYOUT_DIR, 'Header.tsx'));

    it('should use sticky positioning', () => {
        assert.ok(headerContent.includes('sticky'), 'Header should use sticky positioning');
    });

    it('should include Navigation component', () => {
        assert.ok(headerContent.includes('Navigation'), 'Header should include Navigation component');
    });

    it('should include MobileMenu component', () => {
        assert.ok(headerContent.includes('MobileMenu'), 'Header should include MobileMenu component');
    });

    it('should include SearchBar component', () => {
        assert.ok(headerContent.includes('SearchBar'), 'Header should include SearchBar component');
    });

    it('should link logo to homepage', () => {
        assert.ok(headerContent.includes('href="/"'), 'Header logo should link to homepage');
    });

    it('should use dark charcoal theme', () => {
        assert.ok(headerContent.includes('bg-charcoal'), 'Header should use charcoal background');
    });

    it('should accept dynamic props (no hardcoded content)', () => {
        assert.ok(headerContent.includes('interface HeaderProps'), 'Header should have typed props interface');
        assert.ok(headerContent.includes('siteName'), 'Header should accept siteName prop');
        assert.ok(headerContent.includes('navigation'), 'Header should accept navigation prop');
        assert.ok(headerContent.includes('contactInfo'), 'Header should accept contactInfo prop');
        assert.ok(headerContent.includes('socialLinks'), 'Header should accept socialLinks prop');
    });
});

describe('Footer Component Content Validation', () => {
    const footerContent = readComponent(resolve(LAYOUT_DIR, 'Footer.tsx'));

    it('should display contact information dynamically', () => {
        assert.ok(footerContent.includes('contactInfo'), 'Footer should use contactInfo prop');
    });

    it('should display social links dynamically', () => {
        assert.ok(footerContent.includes('socialLinks'), 'Footer should render social links');
    });

    it('should display copyright with dynamic year', () => {
        assert.ok(footerContent.includes('getFullYear'), 'Footer should use dynamic year for copyright');
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

    it('should use dark charcoal theme', () => {
        assert.ok(footerContent.includes('bg-charcoal-dark'), 'Footer should use charcoal-dark background');
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
        assert.ok(navContent.includes('hidden'), 'Navigation should be hidden on mobile');
        assert.ok(navContent.includes('md:flex'), 'Navigation should flex on desktop');
    });

    it('should have accessible navigation landmark', () => {
        assert.ok(navContent.includes('aria-label'), 'Navigation should have aria-label for accessibility');
    });

    it('should support dropdown menus', () => {
        assert.ok(navContent.includes('DropdownItem'), 'Navigation should support dropdown items');
        assert.ok(navContent.includes('aria-expanded'), 'Dropdown should have aria-expanded');
        assert.ok(navContent.includes('aria-haspopup'), 'Dropdown should have aria-haspopup');
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

    it('should use accent-orange for link colors', () => {
        assert.ok(crumbsContent.includes('text-accent-orange'), 'Breadcrumb links should use accent-orange');
    });
});

// Note: Container behavioral rendering tests are in "Container Component Behavior" suite above.
describe('Container Component Source Validation', () => {
    const containerContent = readComponent(resolve(LAYOUT_DIR, 'Container.tsx'));

    it('should accept optional className prop in interface', () => {
        assert.ok(containerContent.includes('className?'), 'Container should accept optional className prop');
    });
});

describe('Site Layout Validation', () => {
    const layoutContent = readComponent(resolve(PROJECT_ROOT, 'src/app/(site)/layout.tsx'));

    it('should include Header component', () => {
        assert.ok(layoutContent.includes('<Header'), 'Site layout should include Header');
    });

    it('should include Footer component', () => {
        assert.ok(layoutContent.includes('<Footer'), 'Site layout should include Footer');
    });

    it('should include Breadcrumbs component', () => {
        assert.ok(layoutContent.includes('<Breadcrumbs'), 'Site layout should include Breadcrumbs');
    });

    it('should have skip navigation link', () => {
        assert.ok(layoutContent.includes('Skip to main content'), 'Site layout should have skip navigation link');
        assert.ok(layoutContent.includes('id="main-content"'), 'Site layout should have main-content id target');
    });

    it('should have semantic main element', () => {
        assert.ok(layoutContent.includes('<main'), 'Site layout should use semantic main element');
    });

    it('should pass CMS data to Header and Footer', () => {
        assert.ok(layoutContent.includes('getSiteSettings'), 'Layout should fetch site settings');
        assert.ok(layoutContent.includes('settings.navigation'), 'Layout should pass navigation to components');
        assert.ok(layoutContent.includes('settings.contactInfo'), 'Layout should pass contactInfo to components');
        assert.ok(layoutContent.includes('settings.socialLinks'), 'Layout should pass socialLinks to components');
    });
});
