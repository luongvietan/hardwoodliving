import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { schemaTypes } from '../../../src/lib/sanity/schemas/index';

interface SchemaType {
    name: string;
}

describe('Schema Index', () => {
    it('should export schemaTypes array', () => {
        assert.ok(Array.isArray(schemaTypes), 'schemaTypes should be an array');
    });

    it('should include all defined schemas', () => {
        const names = (schemaTypes as SchemaType[]).map((s) => s.name);
        const expected = ['product', 'category', 'page', 'homepage', 'testimonial', 'siteSettings'];
        expected.forEach(name => {
            assert.ok(names.includes(name), `Schema ${name} should be included`);
        });
    });
});
