import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import product from '../../../src/lib/sanity/schemas/product';

interface SchemaField {
    name: string;
    type: string;
    options?: { list?: Array<{ title: string; value: string } | string> };
    of?: Array<{ type: string; to?: Array<{ type: string }> }>;
    fields?: SchemaField[];
}

describe('Product Schema', () => {
    it('should be a document', () => {
        assert.equal(product.type, 'document');
        assert.equal(product.name, 'product');
    });

    it('should have required fields', () => {
        const fieldNames = (product.fields as SchemaField[]).map((f) => f.name);
        const expected = ['title', 'slug', 'description', 'specifications', 'specs', 'price', 'priceUnit', 'images', 'category', 'visibility', 'isFeatured'];
        expected.forEach(f => {
            assert.ok(fieldNames.includes(f), `Field ${f} should exist`);
        });
    });

    it('should have visibility options', () => {
        const visibility = (product.fields as SchemaField[]).find((f) => f.name === 'visibility');
        assert.ok(visibility, 'visibility field should exist');
        const values = (visibility.options?.list ?? []).map((o) => typeof o === 'string' ? o : o.value);
        assert.ok(values.includes('public'));
        assert.ok(values.includes('wholesale'));
        assert.ok(values.includes('hidden'));
    });
});
