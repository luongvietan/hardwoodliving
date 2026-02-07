/**
 * IntroBlurb Component Tests (co-located)
 *
 * Validates file existence, exports, and behavioral rendering.
 * IntroBlurb has no Next.js-specific dependencies (no next/image, next/link)
 * so it can be rendered via renderToStaticMarkup for real HTML assertions.
 */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderToStaticMarkup } from 'react-dom/server';
import { createElement } from 'react';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const INTRO_PATH = resolve(__dirname, 'IntroBlurb.tsx');

describe('IntroBlurb Component Files', () => {
    it('should have IntroBlurb.tsx file', () => {
        assert.ok(existsSync(INTRO_PATH), 'IntroBlurb.tsx should exist');
    });
});

describe('IntroBlurb Component Exports', () => {
    it('should export IntroBlurb as default', async () => {
        const mod = await import('./IntroBlurb');
        assert.ok(mod.default, 'IntroBlurb should have a default export');
        assert.equal(typeof mod.default, 'function', 'IntroBlurb should be a function component');
    });
});

describe('IntroBlurb Component Behavior', () => {
    it('should render text content when provided', async () => {
        const mod = await import('./IntroBlurb');
        const IntroBlurb = mod.default;
        const html = renderToStaticMarkup(createElement(IntroBlurb, { text: 'Test intro text' }));
        assert.ok(html.includes('Test intro text'), 'Should render provided text content');
        assert.ok(html.includes('<section'), 'Should render a section element');
        assert.ok(html.includes('<p'), 'Should render text in a paragraph element');
    });

    it('should render nothing when text is empty or undefined', async () => {
        const mod = await import('./IntroBlurb');
        const IntroBlurb = mod.default;
        const htmlEmpty = renderToStaticMarkup(createElement(IntroBlurb, { text: '' }));
        const htmlUndefined = renderToStaticMarkup(createElement(IntroBlurb, {}));
        assert.ok(!htmlEmpty.includes('<section'), 'Should not render section when text is empty');
        assert.ok(!htmlUndefined.includes('<section'), 'Should not render section when text is undefined');
    });

    it('should use centered layout with constrained width', async () => {
        const mod = await import('./IntroBlurb');
        const IntroBlurb = mod.default;
        const html = renderToStaticMarkup(createElement(IntroBlurb, { text: 'Centered text' }));
        assert.ok(html.includes('text-center'), 'Should center text');
        assert.ok(html.includes('max-w-3xl'), 'Should constrain paragraph width');
    });

    it('should have aria-label for accessibility when no heading provided', async () => {
        const mod = await import('./IntroBlurb');
        const IntroBlurb = mod.default;
        const html = renderToStaticMarkup(createElement(IntroBlurb, { text: 'Some text' }));
        assert.ok(html.includes('aria-label'), 'Section should have aria-label for screen readers');
    });

    it('should render heading when provided', async () => {
        const mod = await import('./IntroBlurb');
        const IntroBlurb = mod.default;
        const html = renderToStaticMarkup(createElement(IntroBlurb, { heading: 'About Us', text: 'Some text' }));
        assert.ok(html.includes('<h2'), 'Should render h2 when heading is provided');
        assert.ok(html.includes('About Us'), 'Should render heading text');
    });

    it('should not render heading when omitted', async () => {
        const mod = await import('./IntroBlurb');
        const IntroBlurb = mod.default;
        const html = renderToStaticMarkup(createElement(IntroBlurb, { text: 'Some text' }));
        assert.ok(!html.includes('<h2'), 'Should not render h2 when heading is omitted');
    });
});
