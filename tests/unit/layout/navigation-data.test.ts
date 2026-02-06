import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { navigationLinks, contactInfo, socialLinks } from '../../../src/lib/navigation';

describe('Navigation Data', () => {
    it('should export all required navigation links', () => {
        const requiredLabels = [
            'Flooring',
            'Cabinetry',
            'Visit Us',
            'Care Guide',
            'Why Wood?',
            'Contact',
            'Trades',
        ];

        const labels = navigationLinks.map((link) => link.label);
        requiredLabels.forEach((label) => {
            assert.ok(labels.includes(label), `Navigation should include "${label}"`);
        });
    });

    it('should have exactly 7 navigation links', () => {
        assert.equal(navigationLinks.length, 7);
    });

    it('should have valid href for each navigation link', () => {
        navigationLinks.forEach((link) => {
            assert.ok(link.href.startsWith('/'), `Link "${link.label}" href should start with /`);
            assert.ok(link.href.length > 1, `Link "${link.label}" href should not be empty`);
        });
    });

    it('should have correct category links', () => {
        const flooring = navigationLinks.find((l) => l.label === 'Flooring');
        assert.ok(flooring, 'Flooring link should exist');
        assert.equal(flooring.href, '/categories/flooring');

        const cabinetry = navigationLinks.find((l) => l.label === 'Cabinetry');
        assert.ok(cabinetry, 'Cabinetry link should exist');
        assert.equal(cabinetry.href, '/categories/cabinetry');
    });

    it('should have correct page links', () => {
        const visitUs = navigationLinks.find((l) => l.label === 'Visit Us');
        assert.ok(visitUs, 'Visit Us link should exist');
        assert.equal(visitUs.href, '/pages/visit-us');

        const careGuide = navigationLinks.find((l) => l.label === 'Care Guide');
        assert.ok(careGuide, 'Care Guide link should exist');
        assert.equal(careGuide.href, '/pages/care-guide');

        const whyWood = navigationLinks.find((l) => l.label === 'Why Wood?');
        assert.ok(whyWood, 'Why Wood? link should exist');
        assert.equal(whyWood.href, '/pages/why-wood');
    });

    it('should have correct standalone links', () => {
        const contact = navigationLinks.find((l) => l.label === 'Contact');
        assert.ok(contact, 'Contact link should exist');
        assert.equal(contact.href, '/contact');

        const trades = navigationLinks.find((l) => l.label === 'Trades');
        assert.ok(trades, 'Trades link should exist');
        assert.equal(trades.href, '/trades');
    });
});

describe('Contact Info', () => {
    it('should have phone number', () => {
        assert.ok(contactInfo.phone, 'Phone should be defined');
        assert.ok(contactInfo.phone.length > 0, 'Phone should not be empty');
    });

    it('should have email', () => {
        assert.ok(contactInfo.email, 'Email should be defined');
        assert.ok(contactInfo.email.includes('@'), 'Email should contain @');
    });

    it('should have address', () => {
        assert.ok(contactInfo.address, 'Address should be defined');
        assert.ok(contactInfo.address.length > 0, 'Address should not be empty');
    });
});

describe('Social Links', () => {
    it('should have at least one social link', () => {
        assert.ok(socialLinks.length > 0, 'Should have social links');
    });

    it('should have valid external URLs', () => {
        socialLinks.forEach((link) => {
            assert.ok(
                link.href.startsWith('https://'),
                `Social link "${link.label}" should be an HTTPS URL`
            );
        });
    });

    it('should have label and href for each social link', () => {
        socialLinks.forEach((link) => {
            assert.ok(link.label, 'Social link should have a label');
            assert.ok(link.href, 'Social link should have an href');
        });
    });
});
