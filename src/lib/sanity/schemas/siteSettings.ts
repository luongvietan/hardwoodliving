
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
        }),
        defineField({
            name: 'navigation',
            title: 'Main Navigation',
            type: 'array',
            of: [
                {
                    type: 'object',
                    fields: [
                        { name: 'title', type: 'string', title: 'Link Title' },
                        { name: 'path', type: 'string', title: 'Path (e.g., /about)' },
                    ],
                },
            ],
        }),
        defineField({
            name: 'contactInfo',
            title: 'Contact Information',
            type: 'object',
            fields: [
                { name: 'email', type: 'string', title: 'Email' },
                { name: 'phone', type: 'string', title: 'Phone' },
                { name: 'address', type: 'text', title: 'Address' },
            ],
        }),
        defineField({
            name: 'socialLinks',
            title: 'Social Media Links',
            type: 'array',
            of: [
                {
                    type: 'object',
                    fields: [
                        { name: 'platform', type: 'string', title: 'Platform Name' },
                        { name: 'url', type: 'url', title: 'URL' },
                    ],
                },
            ],
        }),
    ],
});
