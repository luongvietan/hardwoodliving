import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import siteSettings from '../../../src/lib/sanity/schemas/siteSettings';

interface SchemaField {
    name: string;
    type: string;
    of?: Array<{ type: string; name?: string; fields?: SchemaField[] }>;
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

    it('should have navigation array with enhanced nav items', () => {
        const nav = (siteSettings.fields as SchemaField[]).find((f) => f.name === 'navigation');
        assert.ok(nav, 'navigation field should exist');
        assert.equal(nav.type, 'array');
        const navItem = nav.of?.[0];
        assert.ok(navItem, 'navigation should have items');
        assert.equal(navItem.type, 'object');
        const fields = (navItem.fields ?? []).map((f) => f.name);
        assert.ok(fields.includes('title'), 'Nav item should have title');
        assert.ok(fields.includes('path'), 'Nav item should have path');
        assert.ok(fields.includes('position'), 'Nav item should have position');
        assert.ok(fields.includes('children'), 'Nav item should have children for dropdowns');
    });

    it('should have contactInfo with tollFree field', () => {
        const contact = (siteSettings.fields as SchemaField[]).find((f) => f.name === 'contactInfo');
        assert.ok(contact, 'contactInfo field should exist');
        const contactFields = (contact.fields ?? []).map((f) => f.name);
        assert.ok(contactFields.includes('email'));
        assert.ok(contactFields.includes('phone'));
        assert.ok(contactFields.includes('address'));
        assert.ok(contactFields.includes('tollFree'), 'contactInfo should have tollFree field');
    });

    it('should have socialLinks with platform dropdown options', () => {
        const social = (siteSettings.fields as SchemaField[]).find((f) => f.name === 'socialLinks');
        assert.ok(social, 'socialLinks field should exist');
        assert.equal(social.type, 'array');
    });
});
