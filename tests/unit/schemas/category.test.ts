import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import category from '../../../src/lib/sanity/schemas/category';

interface SchemaField {
    name: string;
    type: string;
    to?: Array<{ type: string }>;
}

describe('Category Schema', () => {
    it('should be a document', () => {
        assert.equal(category.type, 'document');
        assert.equal(category.name, 'category');
    });

    it('should have required fields', () => {
        const fieldNames = (category.fields as SchemaField[]).map((f) => f.name);
        const expected = ['title', 'slug', 'description', 'image', 'parent'];
        expected.forEach(f => {
            assert.ok(fieldNames.includes(f), `Field ${f} should exist`);
        });
    });

    it('should have parent reference to category', () => {
        const parent = (category.fields as SchemaField[]).find((f) => f.name === 'parent');
        assert.ok(parent, 'parent field should exist');
        assert.equal(parent.type, 'reference');
        assert.equal(parent.to?.[0].type, 'category');
    });
});
