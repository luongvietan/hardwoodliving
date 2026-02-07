/**
 * Testimonials Component Tests (co-located)
 *
 * Validates file existence, exports, and source-code structure.
 * Testimonials imports urlFor (Sanity env vars required) so behavioral
 * rendering is not feasible — uses source code inspection.
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

const TESTIMONIALS_PATH = resolve(__dirname, 'Testimonials.tsx');

describe('Testimonials Component Files', () => {
    it('should have Testimonials.tsx file', () => {
        assert.ok(existsSync(TESTIMONIALS_PATH), 'Testimonials.tsx should exist');
    });
});

describe('Testimonials Component Exports', () => {
    it('should export Testimonials as default function', () => {
        const content = readComponent(TESTIMONIALS_PATH);
        assert.ok(
            content.includes('export default function Testimonials'),
            'Testimonials should export a default function component'
        );
    });
});

describe('Testimonials Component Content Validation', () => {
    it('should have section heading with proper id for aria-labelledby', () => {
        const content = readComponent(TESTIMONIALS_PATH);
        assert.ok(content.includes('<h2'), 'Testimonials should render an h2 heading');
        assert.ok(
            content.includes('aria-labelledby'),
            'Section should use aria-labelledby for accessibility'
        );
    });

    it('should use responsive grid layout (1 col mobile, 2 tablet, 3 desktop)', () => {
        const content = readComponent(TESTIMONIALS_PATH);
        assert.ok(content.includes('grid-cols-1'), 'Should have 1-column grid for mobile');
        assert.ok(content.includes('md:grid-cols-2'), 'Should have 2-column grid for tablet');
        assert.ok(content.includes('lg:grid-cols-3'), 'Should have 3-column grid for desktop');
    });

    it('should render testimonial author name from data', () => {
        const content = readComponent(TESTIMONIALS_PATH);
        assert.ok(
            content.includes('{testimonial.author}'),
            'Testimonials should render author name from testimonial data'
        );
    });

    it('should render testimonial content from data', () => {
        const content = readComponent(TESTIMONIALS_PATH);
        assert.ok(
            content.includes('{testimonial.content}'),
            'Testimonials should render content text from testimonial data'
        );
    });

    it('should handle author images with next/image and Sanity urlFor', () => {
        const content = readComponent(TESTIMONIALS_PATH);
        assert.ok(
            content.includes("from \"next/image\"") || content.includes("from 'next/image'"),
            'Testimonials should import Image from next/image'
        );
        assert.ok(content.includes('urlFor'), 'Testimonials should use urlFor for Sanity image URLs');
    });

    it('should include decorative quote icon with aria-hidden', () => {
        const content = readComponent(TESTIMONIALS_PATH);
        assert.ok(content.includes('<svg'), 'Testimonials should include an SVG quote icon');
        assert.ok(content.includes('aria-hidden="true"'), 'Quote icon should be aria-hidden');
    });

    it('should use _id as React key for stable list rendering', () => {
        const content = readComponent(TESTIMONIALS_PATH);
        assert.ok(
            content.includes('key={testimonial._id}'),
            'Should use Sanity _id as React key instead of index'
        );
    });

    it('should define typed props interface with _id field', () => {
        const content = readComponent(TESTIMONIALS_PATH);
        assert.ok(
            content.includes('interface Testimonial'),
            'Should define Testimonial interface'
        );
        assert.ok(
            content.includes('_id: string'),
            'Testimonial interface should include _id for stable keys'
        );
    });

    it('should handle empty or missing testimonials gracefully', () => {
        const content = readComponent(TESTIMONIALS_PATH);
        assert.ok(
            content.includes('testimonials.length === 0'),
            'Should explicitly check for empty array'
        );
        assert.ok(
            content.includes('return null'),
            'Should return null when no testimonials'
        );
    });
});
