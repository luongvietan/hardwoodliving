
import { defineField, defineType } from 'sanity';

export default defineType({
    name: 'siteSettings',
    title: 'Site Settings',
    type: 'document',
    fields: [
        defineField({
            name: 'siteName',
            title: 'Site Name',
            type: 'string',
            validation: (Rule) => Rule.required().max(100),
        }),
        defineField({
            name: 'logo',
            title: 'Logo',
            type: 'image',
            options: { hotspot: true },
            description: 'Site logo displayed in the header (centered) and footer',
        }),
        defineField({
            name: 'navigation',
            title: 'Main Navigation',
            description: 'Navigation links split left/right of the centered logo. Items can have dropdown children.',
            type: 'array',
            of: [
                {
                    type: 'object',
                    name: 'navItem',
                    title: 'Navigation Item',
                    fields: [
                        defineField({ name: 'title', type: 'string', title: 'Link Title', validation: (Rule) => Rule.required() }),
                        defineField({ name: 'path', type: 'string', title: 'Path (e.g., /about)', description: 'Leave empty if this item only has children (dropdown parent)' }),
                        defineField({
                            name: 'position',
                            title: 'Position',
                            type: 'string',
                            options: { list: ['left', 'right'], layout: 'radio' },
                            initialValue: 'left',
                            description: 'Left or right of the centered logo',
                        }),
                        defineField({
                            name: 'children',
                            title: 'Dropdown Items',
                            type: 'array',
                            of: [
                                {
                                    type: 'object',
                                    name: 'navChild',
                                    fields: [
                                        defineField({ name: 'title', type: 'string', title: 'Link Title', validation: (Rule) => Rule.required() }),
                                        defineField({ name: 'path', type: 'string', title: 'Path', validation: (Rule) => Rule.required() }),
                                    ],
                                    preview: { select: { title: 'title', subtitle: 'path' } },
                                },
                            ],
                        }),
                    ],
                    preview: {
                        select: { title: 'title', subtitle: 'position' },
                        prepare({ title, subtitle }) {
                            return { title, subtitle: subtitle === 'left' ? '← Left' : 'Right →' };
                        },
                    },
                },
            ],
        }),
        defineField({
            name: 'contactInfo',
            title: 'Contact Information',
            type: 'object',
            fields: [
                defineField({ name: 'email', type: 'string', title: 'Email' }),
                defineField({ name: 'phone', type: 'string', title: 'Phone' }),
                defineField({ name: 'address', type: 'text', title: 'Address (multi-line ok)' }),
                defineField({ name: 'tollFree', type: 'string', title: 'Toll-Free Number' }),
            ],
        }),
        defineField({
            name: 'footerTagline',
            title: 'Footer Tagline',
            type: 'text',
            rows: 2,
            description: 'e.g. "Premium flooring solutions for homeowners, designers, and contractors since 2005."',
        }),
        defineField({
            name: 'businessHours',
            title: 'Business Hours',
            type: 'text',
            rows: 2,
            description: 'e.g. "Mon Fri: 9:00 18:00\nSat: 10:00 16:00"',
        }),
        defineField({
            name: 'footerPhone',
            title: 'Footer Phone',
            type: 'string',
            description: 'Phone number shown in footer (e.g. +31 (0)20 123 4567). Leave empty to use main contact phone.',
        }),
        defineField({
            name: 'readyToFindHeading',
            title: 'Ready to Find CTA Heading',
            type: 'string',
            description: 'e.g. "Ready to Find Your Perfect Floor?"',
        }),
        defineField({
            name: 'readyToFindPrimaryText',
            title: 'Ready to Find Primary Button',
            type: 'string',
            description: 'e.g. "Book Your Visit"',
        }),
        defineField({
            name: 'readyToFindSecondaryText',
            title: 'Ready to Find Secondary Button',
            type: 'string',
            description: 'e.g. "Request Info"',
        }),
        defineField({
            name: 'copyrightText',
            title: 'Copyright Text',
            type: 'string',
            description: 'e.g. "© 2026 Hardfloor Showroom. All rights reserved." Leave empty to use site name + year.',
        }),
        defineField({
            name: 'socialLinks',
            title: 'Social Media Links',
            type: 'array',
            of: [
                {
                    type: 'object',
                    name: 'socialLink',
                    title: 'Social Link',
                    fields: [
                        defineField({
                            name: 'platform',
                            type: 'string',
                            title: 'Platform Name',
                            options: { list: ['Facebook', 'Instagram', 'Pinterest', 'Twitter', 'YouTube', 'LinkedIn'] },
                        }),
                        defineField({ name: 'url', type: 'url', title: 'URL' }),
                    ],
                    preview: { select: { title: 'platform', subtitle: 'url' } },
                },
            ],
        }),
    ],
});
