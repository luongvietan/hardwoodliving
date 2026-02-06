
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
                defineField({ name: 'heading', title: 'Heading', type: 'string' }),
                defineField({ name: 'subheading', title: 'Subheading', type: 'text', rows: 2 }),
                defineField({ name: 'image', title: 'Background Image', type: 'image', options: { hotspot: true } }),
                defineField({ name: 'ctaLink', title: 'CTA Link', type: 'string', description: 'Relative path (e.g., /contact)' }),
                defineField({ name: 'ctaText', title: 'CTA Text', type: 'string' }),
            ],
        }),
        defineField({
            name: 'introBlurb',
            title: 'Intro Blurb',
            type: 'text',
            description: 'Short introduction text displayed below the hero',
        }),
        defineField({
            name: 'featuredProducts',
            title: 'Featured Products',
            type: 'array',
            of: [{ type: 'reference', to: [{ type: 'product' }] }],
            validation: (Rule) => Rule.max(6).warning('Keep featured products under 6 for best layout'),
        }),
        defineField({
            name: 'testimonials',
            title: 'Testimonials',
            type: 'array',
            of: [{ type: 'reference', to: [{ type: 'testimonial' }] }],
        }),
    ],
});
