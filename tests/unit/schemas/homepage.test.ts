import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import homepage from '../../../src/lib/sanity/schemas/homepage';

interface SchemaField {
    name: string;
    type: string;
    of?: Array<{ type: string; to?: Array<{ type: string }> }>;
    fields?: SchemaField[];
}

describe('Homepage Schema', () => {
    it('should be a document', () => {
        assert.equal(homepage.type, 'document');
        assert.equal(homepage.name, 'homepage');
    });

    it('should have required fields', () => {
        const fieldNames = (homepage.fields as SchemaField[]).map((f) => f.name);
        const expected = ['hero', 'introHeading', 'introBlurb', 'categoryHighlights', 'featuredProducts', 'ctaSection', 'testimonials'];
        expected.forEach(f => {
            assert.ok(fieldNames.includes(f), `Field ${f} should exist`);
        });
    });

    it('should have hero sections with slideshow images', () => {
        const hero = (homepage.fields as SchemaField[]).find((f) => f.name === 'hero');
        assert.ok(hero, 'hero field should exist');
        assert.equal(hero.type, 'object');
        const heroFields = (hero.fields ?? []).map((f) => f.name);
        assert.ok(heroFields.includes('heading'));
        assert.ok(heroFields.includes('subheading'));
        assert.ok(heroFields.includes('images'), 'Hero should have images array (not single image)');
        assert.ok(heroFields.includes('ctaLink'));
        assert.ok(heroFields.includes('ctaText'));
    });

    it('should have categoryHighlights as array of category references', () => {
        const ch = (homepage.fields as SchemaField[]).find((f) => f.name === 'categoryHighlights');
        assert.ok(ch, 'categoryHighlights field should exist');
        assert.equal(ch.type, 'array');
        assert.equal(ch.of?.[0].type, 'reference');
        assert.equal(ch.of?.[0].to?.[0].type, 'category');
    });

    it('should have featuredProducts as array of references', () => {
        const fp = (homepage.fields as SchemaField[]).find((f) => f.name === 'featuredProducts');
        assert.ok(fp, 'featuredProducts field should exist');
        assert.equal(fp.type, 'array');
        assert.equal(fp.of?.[0].type, 'reference');
        assert.equal(fp.of?.[0].to?.[0].type, 'product');
    });

    it('should have ctaSection as object', () => {
        const cta = (homepage.fields as SchemaField[]).find((f) => f.name === 'ctaSection');
        assert.ok(cta, 'ctaSection field should exist');
        assert.equal(cta.type, 'object');
        const ctaFields = (cta.fields ?? []).map((f) => f.name);
        assert.ok(ctaFields.includes('heading'));
        assert.ok(ctaFields.includes('text'));
        assert.ok(ctaFields.includes('linkText'));
        assert.ok(ctaFields.includes('linkUrl'));
    });
});
