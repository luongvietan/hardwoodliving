import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import page from '../../../src/lib/sanity/schemas/page';

interface SchemaField {
    name: string;
    type: string;
    of?: Array<{ type: string }>;
    fields?: SchemaField[];
}

describe('Page Schema', () => {
    it('should be a document', () => {
        assert.equal(page.type, 'document');
        assert.equal(page.name, 'page');
    });

    it('should have required fields', () => {
        const fieldNames = (page.fields as SchemaField[]).map((f) => f.name);
        const expected = ['title', 'slug', 'body', 'seo'];
        expected.forEach(f => {
            assert.ok(fieldNames.includes(f), `Field ${f} should exist`);
        });
    });

    it('should have portable text body', () => {
        const body = (page.fields as SchemaField[]).find((f) => f.name === 'body');
        assert.ok(body, 'body field should exist');
        assert.equal(body.type, 'array');
        assert.equal(body.of?.[0].type, 'block');
    });

    it('should have SEO object', () => {
        const seo = (page.fields as SchemaField[]).find((f) => f.name === 'seo');
        assert.ok(seo, 'seo field should exist');
        assert.equal(seo.type, 'object');
        const seoFields = (seo.fields ?? []).map((f) => f.name);
        assert.ok(seoFields.includes('metaTitle'));
        assert.ok(seoFields.includes('metaDescription'));
    });
});
