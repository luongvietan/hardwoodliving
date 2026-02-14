
import { defineField, defineType } from 'sanity';

export default defineType({
    name: 'testimonial',
    title: 'Testimonial',
    type: 'document',
    fields: [
        defineField({
            name: 'author',
            title: 'Author',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'content',
            title: 'Content',
            type: 'text',
            rows: 4,
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'image',
            title: 'Author Image',
            type: 'image',
            options: { hotspot: true },
        }),
        defineField({
            name: 'role',
            title: 'Role / Title',
            type: 'string',
            description: 'e.g. "Homeowner", "Interior Designer"',
        }),
    ],
});
