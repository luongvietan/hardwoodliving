
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
                defineField({
                    name: 'images',
                    title: 'Hero Slideshow Images',
                    type: 'array',
                    of: [{ type: 'image', options: { hotspot: true } }],
                    validation: (Rule) => Rule.min(1).warning('At least 1 hero image is recommended'),
                }),
                defineField({ name: 'ctaLink', title: 'CTA Link (primary)', type: 'string' }),
                defineField({ name: 'ctaText', title: 'CTA Text (primary)', type: 'string' }),
                defineField({ name: 'cta2Link', title: 'CTA 2 Link (secondary)', type: 'string' }),
                defineField({ name: 'cta2Text', title: 'CTA 2 Text (secondary)', type: 'string' }),
            ],
        }),
        defineField({
            name: 'choosingSection',
            title: 'Choosing the Right Floor Section',
            type: 'object',
            fields: [
                defineField({ name: 'heading1', title: 'Heading Line 1', type: 'string' }),
                defineField({ name: 'heading2', title: 'Heading Line 2', type: 'string' }),
                defineField({
                    name: 'painPoints',
                    title: 'Pain Points (bullets)',
                    type: 'array',
                    of: [{ type: 'string' }],
                }),
                defineField({ name: 'resultText', title: 'Result Paragraph', type: 'text', rows: 2 }),
                defineField({ name: 'tagline', title: 'Tagline (e.g. See It. Choose Confidently.)', type: 'string' }),
                defineField({
                    name: 'solutionBullets',
                    title: 'Solution Bullets',
                    type: 'array',
                    of: [{ type: 'string' }],
                }),
                defineField({ name: 'ctaText', title: 'CTA Button Text', type: 'string' }),
                defineField({ name: 'ctaLink', title: 'CTA Button URL', type: 'string' }),
            ],
        }),
        defineField({
            name: 'whatWeOffer',
            title: 'What We Offer',
            type: 'object',
            fields: [
                defineField({ name: 'intro', title: 'Intro Paragraph', type: 'text', rows: 2 }),
                defineField({
                    name: 'items',
                    title: 'Offer Items',
                    type: 'array',
                    of: [
                        {
                            type: 'object',
                            fields: [
                                defineField({ name: 'title', type: 'string', title: 'Title' }),
                                defineField({ name: 'description', type: 'text', rows: 3, title: 'Description' }),
                            ],
                            preview: { select: { title: 'title' } },
                        },
                    ],
                }),
            ],
        }),
        defineField({
            name: 'ourSpecialty',
            title: 'Our Specialty',
            type: 'object',
            fields: [
                defineField({ name: 'intro', title: 'Intro Line', type: 'string' }),
                defineField({
                    name: 'items',
                    title: 'Specialty Steps (01–04)',
                    type: 'array',
                    of: [
                        {
                            type: 'object',
                            fields: [
                                defineField({ name: 'number', type: 'string', title: 'Number (e.g. 01)' }),
                                defineField({ name: 'title', type: 'string', title: 'Title' }),
                                defineField({ name: 'description', type: 'text', rows: 4, title: 'Description' }),
                            ],
                            preview: { select: { title: 'title', subtitle: 'number' } },
                        },
                    ],
                    validation: (Rule) => Rule.max(4),
                }),
                defineField({ name: 'ctaText', title: 'CTA Button Text', type: 'string' }),
                defineField({ name: 'ctaLink', title: 'CTA Button URL', type: 'string' }),
            ],
        }),
        defineField({
            name: 'flooringGrades',
            title: 'Flooring Grades',
            type: 'object',
            fields: [
                defineField({ name: 'heading', title: 'Section Heading', type: 'string' }),
                defineField({ name: 'subheading', title: 'Subheading', type: 'string' }),
                defineField({
                    name: 'grades',
                    title: 'Grades',
                    type: 'array',
                    of: [
                        {
                            type: 'object',
                            fields: [
                                defineField({ name: 'name', type: 'string', title: 'Grade Name (e.g. Prime /AB)' }),
                                defineField({
                                    name: 'bullets',
                                    title: 'Bullet Points',
                                    type: 'array',
                                    of: [{ type: 'string' }],
                                }),
                            ],
                            preview: { select: { title: 'name' } },
                        },
                    ],
                }),
            ],
        }),
        defineField({
            name: 'lumberCuts',
            title: 'Lumber Cuts',
            type: 'object',
            fields: [
                defineField({ name: 'heading', title: 'Section Heading', type: 'string' }),
                defineField({ name: 'intro', title: 'Intro Paragraph', type: 'text', rows: 2 }),
                defineField({
                    name: 'cuts',
                    title: 'Cut Types',
                    type: 'array',
                    of: [
                        {
                            type: 'object',
                            fields: [
                                defineField({ name: 'name', type: 'string', title: 'Name (e.g. Plainsawn)' }),
                                defineField({ name: 'description', type: 'text', rows: 4, title: 'Description' }),
                            ],
                            preview: { select: { title: 'name' } },
                        },
                    ],
                }),
            ],
        }),
        defineField({
            name: 'limitedTimeOffer',
            title: 'Limited Time Offer',
            type: 'object',
            fields: [
                defineField({ name: 'heading', title: 'Heading', type: 'string' }),
                defineField({ name: 'body', title: 'Body Text', type: 'text', rows: 3 }),
                defineField({ name: 'ctaText', title: 'Primary CTA Text', type: 'string' }),
                defineField({ name: 'ctaLink', title: 'Primary CTA URL', type: 'string' }),
                defineField({ name: 'cta2Text', title: 'Secondary CTA Text', type: 'string' }),
                defineField({ name: 'cta2Link', title: 'Secondary CTA URL', type: 'string' }),
            ],
        }),
        defineField({
            name: 'whyLoveUs',
            title: 'Why Homeowners & Designers Love Us',
            type: 'object',
            fields: [
                defineField({ name: 'heading', title: 'Heading', type: 'string' }),
                defineField({
                    name: 'items',
                    title: 'Value Props',
                    type: 'array',
                    of: [
                        {
                            type: 'object',
                            fields: [
                                defineField({ name: 'title', type: 'string', title: 'Title' }),
                                defineField({ name: 'description', type: 'text', rows: 3, title: 'Description' }),
                            ],
                            preview: { select: { title: 'title' } },
                        },
                    ],
                }),
            ],
        }),
        defineField({
            name: 'ourWorksHeading',
            title: 'Our Works Section Heading',
            type: 'string',
            description: 'e.g. "Our works"',
        }),
        defineField({
            name: 'faq',
            title: 'FAQ',
            type: 'object',
            fields: [
                defineField({ name: 'heading', title: 'Section Heading', type: 'string' }),
                defineField({
                    name: 'items',
                    title: 'Questions & Answers',
                    type: 'array',
                    of: [
                        {
                            type: 'object',
                            fields: [
                                defineField({ name: 'question', type: 'string', title: 'Question' }),
                                defineField({ name: 'answer', type: 'text', rows: 4, title: 'Answer' }),
                            ],
                            preview: { select: { title: 'question' } },
                        },
                    ],
                }),
            ],
        }),
        defineField({
            name: 'testimonialsHeading',
            title: 'Testimonials Section Heading',
            type: 'string',
            description: 'e.g. "What Our Customers Are Saying"',
        }),
        defineField({
            name: 'testimonials',
            title: 'Testimonials',
            type: 'array',
            of: [{ type: 'reference', to: [{ type: 'testimonial' }] }],
        }),
        defineField({
            name: 'bookVisitForm',
            title: 'Book Your Showroom Visit Form',
            type: 'object',
            fields: [
                defineField({ name: 'heading', title: 'Heading', type: 'string' }),
                defineField({ name: 'subheading', title: 'Subheading', type: 'text', rows: 2 }),
                defineField({ name: 'primaryCtaText', title: 'Primary Button Text', type: 'string' }),
                defineField({ name: 'secondaryCtaText', title: 'Secondary Button Text', type: 'string' }),
            ],
        }),
        // Legacy / optional sections (kept for backward compatibility)
        defineField({
            name: 'introHeading',
            title: 'Intro Heading (legacy)',
            type: 'string',
            hidden: true,
        }),
        defineField({
            name: 'introBlurb',
            title: 'Intro Blurb (legacy)',
            type: 'text',
            hidden: true,
        }),
        defineField({
            name: 'categoryHighlights',
            title: 'Category Highlights (legacy)',
            type: 'array',
            of: [{ type: 'reference', to: [{ type: 'category' }] }],
            validation: (Rule) => Rule.max(8),
            hidden: true,
        }),
        defineField({
            name: 'featuredProducts',
            title: 'Featured Products (legacy)',
            type: 'array',
            of: [{ type: 'reference', to: [{ type: 'product' }] }],
            validation: (Rule) => Rule.max(6),
            hidden: true,
        }),
        defineField({
            name: 'ctaSection',
            title: 'CTA Section (legacy)',
            type: 'object',
            fields: [
                defineField({ name: 'heading', type: 'string', title: 'Heading' }),
                defineField({ name: 'text', type: 'text', rows: 3, title: 'Description Text' }),
                defineField({ name: 'image', type: 'image', options: { hotspot: true }, title: 'Image' }),
                defineField({ name: 'linkText', type: 'string', title: 'Button Text' }),
                defineField({ name: 'linkUrl', type: 'string', title: 'Button URL' }),
            ],
            hidden: true,
        }),
    ],
});
