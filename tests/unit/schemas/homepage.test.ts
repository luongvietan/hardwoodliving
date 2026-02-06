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
        const expected = ['hero', 'introBlurb', 'featuredProducts', 'testimonials'];
        expected.forEach(f => {
            assert.ok(fieldNames.includes(f), `Field ${f} should exist`);
        });
    });

    it('should have hero sections', () => {
        const hero = (homepage.fields as SchemaField[]).find((f) => f.name === 'hero');
        assert.ok(hero, 'hero field should exist');
        assert.equal(hero.type, 'object');
        const heroFields = (hero.fields ?? []).map((f) => f.name);
        assert.ok(heroFields.includes('heading'));
        assert.ok(heroFields.includes('subheading'));
        assert.ok(heroFields.includes('image'));
        assert.ok(heroFields.includes('ctaLink'));
    });

    it('should have featuredProducts as array of references', () => {
        const fp = (homepage.fields as SchemaField[]).find((f) => f.name === 'featuredProducts');
        assert.ok(fp, 'featuredProducts field should exist');
        assert.equal(fp.type, 'array');
        assert.equal(fp.of?.[0].type, 'reference');
        assert.equal(fp.of?.[0].to?.[0].type, 'product');
    });
});
