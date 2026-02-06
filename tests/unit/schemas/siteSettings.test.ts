import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import siteSettings from '../../../src/lib/sanity/schemas/siteSettings';

interface SchemaField {
    name: string;
    type: string;
    of?: Array<{ type: string; fields?: SchemaField[] }>;
    fields?: SchemaField[];
}

describe('Site Settings Schema', () => {
    it('should be a document', () => {
        assert.equal(siteSettings.type, 'document');
        assert.equal(siteSettings.name, 'siteSettings');
    });

    it('should have required fields', () => {
        const fieldNames = (siteSettings.fields as SchemaField[]).map((f) => f.name);
        const expected = ['siteName', 'logo', 'navigation', 'contactInfo', 'socialLinks'];
        expected.forEach(f => {
            assert.ok(fieldNames.includes(f), `Field ${f} should exist`);
        });
    });

    it('should have navigation array', () => {
        const nav = (siteSettings.fields as SchemaField[]).find((f) => f.name === 'navigation');
        assert.ok(nav, 'navigation field should exist');
        assert.equal(nav.type, 'array');
        const navItem = nav.of?.[0];
        assert.ok(navItem, 'navigation should have items');
        assert.equal(navItem.type, 'object');
        const fields = (navItem.fields ?? []).map((f) => f.name);
        assert.ok(fields.includes('title'));
        assert.ok(fields.includes('path'));
    });
});
