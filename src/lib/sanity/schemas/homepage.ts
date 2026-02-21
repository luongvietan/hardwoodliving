
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
                defineField({ name: 'heading', title: 'Heading', type: 'string', description: 'e.g. CRAFTED BY NATURE' }),
                defineField({ name: 'subheading', title: 'Subheading Line 1', type: 'string', description: 'e.g. SELECT FLOORING, PERSONALIZED SERVICE' }),
                defineField({ name: 'subheading2', title: 'Subheading Line 2', type: 'string', description: 'e.g. VISION TO REALITY' }),
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
                defineField({
                    name: 'categories',
                    title: 'Hero Category Bar',
                    type: 'array',
                    description: 'Categories displayed in the bottom bar of hero section',
                    validation: (Rule) => Rule.max(5).warning('Maximum 5 categories recommended'),
                    of: [
                        {
                            type: 'object',
                            fields: [
                                defineField({ name: 'label', type: 'string', title: 'Label', validation: (Rule) => Rule.required() }),
                                defineField({ name: 'link', type: 'string', title: 'Link URL', description: 'e.g. /collections/hardwood' }),
                            ],
                            preview: { select: { title: 'label', subtitle: 'link' } },
                        },
                    ],
                }),
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
                    validation: (Rule) => Rule.max(4).warning('Keep 3–4 short bullets for emotional impact'),
                }),
                defineField({ name: 'resultText', title: 'Result Paragraph', type: 'text', rows: 2 }),
                defineField({
                    name: 'image1',
                    title: 'Top-right image (person examining samples)',
                    type: 'image',
                    options: { hotspot: true },
                    description: 'Shown next to the problem section',
                }),
                defineField({ name: 'tagline', title: 'Tagline (e.g. See It. Choose Confidently.)', type: 'string' }),
                defineField({
                    name: 'solutionBullets',
                    title: 'Solution Bullets',
                    type: 'array',
                    of: [{ type: 'string' }],
                    validation: (Rule) => Rule.max(4).warning('Keep 3–4 short bullets (Visit showroom, Personalized guidance, Compare finishes, Zero pressure)'),
                }),
                defineField({
                    name: 'image2',
                    title: 'Bottom-left image (showroom)',
                    type: 'image',
                    options: { hotspot: true },
                    description: 'Shown next to the solution section',
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
                    title: 'Core Collections (max 4 on homepage)',
                    type: 'array',
                    validation: (Rule) =>
                        Rule.max(4).warning('Homepage shows only 4: Hardwood, Engineered, Luxury Vinyl, Laminate'),
                    of: [
                        {
                            type: 'object',
                            fields: [
                                defineField({ name: 'title', type: 'string', title: 'Title' }),
                                defineField({ name: 'description', type: 'text', rows: 2, title: 'Description' }),
                                defineField({
                                    name: 'link',
                                    type: 'string',
                                    title: 'Link (e.g. /collections/hardwood)',
                                    description: 'Optional collection URL',
                                }),
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
            description: 'Content for /wood-guide/flooring-grades — not shown on homepage',
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
            description: 'Content for /wood-guide/lumber-cuts — not shown on homepage',
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
                defineField({ name: 'badgeText', title: 'Badge Text', type: 'string', description: 'e.g. "Limited Time Offer"' }),
                defineField({ name: 'heading', title: 'Heading', type: 'string' }),
                defineField({ name: 'body', title: 'Body Text', type: 'text', rows: 3 }),
                defineField({ name: 'body2', title: 'Urgency Line', type: 'string', description: 'Optional second line e.g. "Limited-time offer – book your visit now!"' }),
                defineField({ name: 'backgroundImage', title: 'Background Image', type: 'image', options: { hotspot: true }, description: 'Showroom/flooring image (blurred behind content)' }),
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
                                defineField({ name: 'image', type: 'image', title: 'Image', options: { hotspot: true }, description: 'Optional photo (e.g. room with flooring)' }),
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
            name: 'projectsPreview',
            title: 'Projects Preview',
            type: 'object',
            description: '3 featured images linking to gallery',
            fields: [
                defineField({ name: 'heading', title: 'Heading', type: 'string' }),
                defineField({
                    name: 'images',
                    title: 'Project Images (3)',
                    type: 'array',
                    validation: (Rule) => Rule.max(3),
                    of: [{ type: 'image', options: { hotspot: true } }],
                }),
            ],
        }),
        defineField({
            name: 'faq',
            title: 'FAQ',
            type: 'object',
            description: 'Keep only 3 most popular questions on homepage; rest go to FAQ page',
            fields: [
                defineField({ name: 'heading', title: 'Section Heading', type: 'string' }),
                defineField({
                    name: 'items',
                    title: 'Questions & Answers (max 3 on homepage)',
                    type: 'array',
                    validation: (Rule) => Rule.max(3).warning('Homepage shows only 3 most popular'),
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
