import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import testimonial from '../../../src/lib/sanity/schemas/testimonial';

interface SchemaField {
    name: string;
    type: string;
}

describe('Testimonial Schema', () => {
    it('should be a document', () => {
        assert.equal(testimonial.type, 'document');
        assert.equal(testimonial.name, 'testimonial');
    });

    it('should have required fields', () => {
        const fieldNames = (testimonial.fields as SchemaField[]).map((f) => f.name);
        const expected = ['author', 'content', 'image'];
        expected.forEach(f => {
            assert.ok(fieldNames.includes(f), `Field ${f} should exist`);
        });
    });

    it('should have content as text', () => {
        const content = (testimonial.fields as SchemaField[]).find((f) => f.name === 'content');
        assert.ok(content, 'content field should exist');
        assert.ok(content.type === 'text' || content.type === 'array', 'Content should be text or array');
    });
});
