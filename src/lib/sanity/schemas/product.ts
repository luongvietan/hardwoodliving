import { defineField, defineType } from 'sanity';

/** Structured product specs matching the product detail card (e.g. White Alaska). Used for bulk import and consistent display. */
const productSpecificationsFields = [
    { name: 'species', title: 'Species', type: 'string' as const, description: 'e.g. W. Oak' },
    { name: 'width', title: 'W (Width)', type: 'string' as const, description: 'Width (e.g. 7 inch)' },
    { name: 'thickness', title: 'T (Thickness)', type: 'string' as const, description: 'e.g. 5/8' },
    { name: 'length', title: 'L (Length)', type: 'string' as const, description: 'e.g. 2-7' },
    { name: 'prefinished', title: 'Prefinished', type: 'string' as const, description: 'e.g. Urethane + Alum. Oxide' },
    { name: 'surface', title: 'Surface', type: 'string' as const, description: 'e.g. Wire Brush' },
    { name: 'stain', title: 'Stain', type: 'string' as const, description: 'e.g. White wash' },
    { name: 'color', title: 'Color', type: 'string' as const, description: 'e.g. Translucent Grain Wht. Wsh.' },
    { name: 'cut', title: 'Cut', type: 'string' as const, description: 'e.g. Flat' },
    { name: 'grade', title: 'Grade', type: 'string' as const, description: 'e.g. Character (A, B, C, D)' },
    { name: 'edge', title: 'Edge', type: 'string' as const, description: 'e.g. Microbevel' },
    { name: 'traffic', title: 'Traffic', type: 'string' as const, description: 'e.g. Medium / High' },
    { name: 'application', title: 'Application', type: 'string' as const, description: 'e.g. Residential / Commercial' },
    { name: 'installation', title: 'Installation', type: 'string' as const, description: 'e.g. Glue, Nail' },
    { name: 'pattern', title: 'Pattern', type: 'string' as const, description: 'e.g. Random' },
    { name: 'source', title: 'Source', type: 'string' as const, description: 'e.g. N. America' },
    { name: 'eco', title: 'Eco', type: 'string' as const, description: 'e.g. Responsibly Harvested' },
    { name: 'jankaRate', title: 'Janka Rate', type: 'string' as const, description: 'e.g. 2300' },
    { name: 'radiantHeatRated', title: 'Radiant heat rated', type: 'string' as const, description: 'e.g. Yes (conditioned)' },
    { name: 'airMoisture', title: 'Air moisture', type: 'string' as const, description: 'e.g. 40-50%' },
    { name: 'trimMoulding', title: 'Trim & moulding', type: 'string' as const, description: 'e.g. Custom as needed' },
    { name: 'stock', title: 'Stock', type: 'string' as const, description: 'e.g. Inquire' },
    { name: 'deliveryTime', title: 'Delivery time', type: 'string' as const, description: 'e.g. Inquire' },
    { name: 'sftPerBox', title: 'Sft / box', type: 'string' as const, description: 'e.g. 32' },
    { name: 'weightPerBox', title: 'Weight / box', type: 'string' as const, description: 'e.g. 52Lb' },
    { name: 'boxDimensions', title: 'Box dimensions', type: 'string' as const, description: "e.g. 7'x7\"" },
];

export default defineType({
    name: 'product',
    title: 'Product',
    type: 'document',
    preview: {
        select: {
            title: 'title',
            categoryTitle: 'category.title',
            price: 'price',
            priceUnit: 'priceUnit',
            visibility: 'visibility',
            media: 'images.0',
        },
        prepare({ title, categoryTitle, price, priceUnit, visibility, media }) {
            const priceStr = price != null ? `$${price}${priceUnit ? ` ${priceUnit}` : ''}` : '';
            const badge = visibility === 'wholesale' ? ' [Wholesale]' : visibility === 'hidden' ? ' [Hidden]' : '';
            return {
                title: `${title || 'Untitled'}${badge}`,
                subtitle: [categoryTitle, priceStr].filter(Boolean).join(' — '),
                media,
            };
        },
    },
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
            name: 'specifications',
            title: 'Product specifications',
            type: 'object',
            options: { collapsible: true, collapsed: false },
            fields: productSpecificationsFields.map((f) =>
                defineField({ name: f.name, title: f.title, type: f.type, description: f.description })
            ),
            description: 'Structured specs matching the product detail card. Use for bulk import and consistent display.',
        }),
        defineField({
            name: 'specs',
            title: 'Additional specifications (key-value)',
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
            description: 'Extra key-value pairs if not covered above (e.g. custom attributes).'
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
