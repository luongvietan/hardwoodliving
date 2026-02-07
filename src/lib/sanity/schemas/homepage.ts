
import { defineField, defineType } from 'sanity';

export default defineType({
    name: 'homepage',
    title: 'Homepage',
    type: 'document',
    fields: [
        defineField({
            name: 'hero',
            title: 'Hero Section',
            type: 'object',
            fields: [
                defineField({ name: 'heading', title: 'Heading', type: 'string', description: 'Main hero heading (e.g., "PREMIER CANADIAN DISTRIBUTOR")' }),
                defineField({ name: 'subheading', title: 'Subheading', type: 'text', rows: 2 }),
                defineField({
                    name: 'images',
                    title: 'Hero Slideshow Images',
                    type: 'array',
                    of: [{ type: 'image', options: { hotspot: true } }],
                    description: 'Multiple images for hero slideshow. First image is shown initially.',
                    validation: (Rule) => Rule.min(1).warning('At least 1 hero image is recommended'),
                }),
                defineField({ name: 'ctaLink', title: 'CTA Link', type: 'string', description: 'Optional relative path (e.g., /products)' }),
                defineField({ name: 'ctaText', title: 'CTA Text', type: 'string' }),
            ],
        }),
        defineField({
            name: 'introHeading',
            title: 'Intro Heading',
            type: 'string',
            description: 'Heading for the intro section below the hero',
        }),
        defineField({
            name: 'introBlurb',
            title: 'Intro Blurb',
            type: 'text',
            description: 'Short introduction text displayed below the hero',
        }),
        defineField({
            name: 'categoryHighlights',
            title: 'Category Highlights',
            description: 'Categories to highlight on the homepage as image cards (Magna-style grid)',
            type: 'array',
            of: [{ type: 'reference', to: [{ type: 'category' }] }],
            validation: (Rule) => Rule.max(8).warning('Keep under 8 for best layout'),
        }),
        defineField({
            name: 'featuredProducts',
            title: 'Featured Products',
            type: 'array',
            of: [{ type: 'reference', to: [{ type: 'product' }] }],
            validation: (Rule) => Rule.max(6).warning('Keep featured products under 6 for best layout'),
        }),
        defineField({
            name: 'ctaSection',
            title: 'CTA Section',
            description: 'Promotional section with image and call-to-action (e.g., "View Our Products In Your Own Home")',
            type: 'object',
            fields: [
                defineField({ name: 'heading', title: 'Heading', type: 'string' }),
                defineField({ name: 'text', title: 'Description Text', type: 'text', rows: 3 }),
                defineField({ name: 'image', title: 'Image', type: 'image', options: { hotspot: true } }),
                defineField({ name: 'linkText', title: 'Button Text', type: 'string' }),
                defineField({ name: 'linkUrl', title: 'Button URL', type: 'string' }),
            ],
        }),
        defineField({
            name: 'testimonials',
            title: 'Testimonials',
            type: 'array',
            of: [{ type: 'reference', to: [{ type: 'testimonial' }] }],
        }),
    ],
});
