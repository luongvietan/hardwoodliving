
import { defineField, defineType } from 'sanity';

export default defineType({
    name: 'product',
    title: 'Product',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Title',
            type: 'string',
            validation: (Rule) => Rule.required().max(150),
        }),
        defineField({
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            options: {
                source: 'title',
                maxLength: 96,
            },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'description',
            title: 'Description',
            type: 'text',
            validation: (Rule) => Rule.max(500),
        }),
        defineField({
            name: 'specs',
            title: 'Specifications',
            type: 'array',
            of: [
                {
                    type: 'object',
                    fields: [
                        { name: 'label', type: 'string', title: 'Label' },
                        { name: 'value', type: 'string', title: 'Value' }
                    ]
                }
            ],
            description: 'Key-value pairs for specifications (e.g. Dimensions: 10x10)'
        }),
        defineField({
            name: 'price',
            title: 'Price',
            type: 'number',
            validation: (Rule) => Rule.required().min(0),
        }),
        defineField({
            name: 'priceUnit',
            title: 'Price Unit',
            type: 'string',
            options: {
                list: [
                    { title: 'per sq ft', value: '/ sq ft' },
                    { title: 'per box', value: '/ box' },
                    { title: 'per piece', value: '/ piece' },
                    { title: 'per linear ft', value: '/ linear ft' },
                ],
            },
            initialValue: '/ sq ft',
        }),
        defineField({
            name: 'images',
            title: 'Images',
            type: 'array',
            of: [{ type: 'image', options: { hotspot: true } }],
        }),
        defineField({
            name: 'category',
            title: 'Category',
            type: 'reference',
            to: [{ type: 'category' }],
        }),
        defineField({
            name: 'visibility',
            title: 'Visibility',
            type: 'string',
            options: {
                list: [
                    { title: 'Public', value: 'public' },
                    { title: 'Wholesale Only', value: 'wholesale' },
                    { title: 'Hidden', value: 'hidden' },
                ],
            },
            initialValue: 'public',
        }),
        defineField({
            name: 'isFeatured',
            title: 'Featured',
            type: 'boolean',
            initialValue: false,
        }),
    ],
});
