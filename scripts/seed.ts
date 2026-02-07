import { createClient } from 'next-sanity';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
// Use provided token or fall back to READ_TOKEN (which might fail for writes if strict)
const token = process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_API_READ_TOKEN;

if (!projectId || !dataset || !token) {
    console.error('Missing configuration. Please check .env.local for NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, and valid SANITY_API_TOKEN.');
    process.exit(1);
}

const client = createClient({
    projectId,
    dataset,
    apiVersion: '2024-02-07',
    token,
    useCdn: false,
});

async function main() {
    console.log('Starting seed...');

    // 1. Create Categories
    console.log('Creating categories...');
    const hardwoodCat = await client.createOrReplace({
        _id: 'category-hardwood',
        _type: 'category',
        title: 'Hardwood Flooring',
        slug: { current: 'hardwood-flooring', _type: 'slug' },
        description: 'Premium hardwood flooring options for residential and commercial spaces.',
    });

    const vinylCat = await client.createOrReplace({
        _id: 'category-vinyl',
        _type: 'category',
        title: 'Luxury Vinyl',
        slug: { current: 'luxury-vinyl', _type: 'slug' },
        description: 'Durable and water-resistant vinyl flooring.',
    });

    const laminateCat = await client.createOrReplace({
        _id: 'category-laminate',
        _type: 'category',
        title: 'Laminate',
        slug: { current: 'laminate', _type: 'slug' },
        description: 'High-quality laminate flooring with stunning designs.',
    });

    const cabinetCat = await client.createOrReplace({
        _id: 'category-cabinetry',
        _type: 'category',
        title: 'Cabinetry',
        slug: { current: 'cabinetry', _type: 'slug' },
        description: 'Custom cabinetry solutions for kitchens and bathrooms.',
    });

    // Subcategories
    await client.createOrReplace({
        _id: 'category-waterproof-laminate',
        _type: 'category',
        title: 'Waterproof Laminate',
        slug: { current: 'waterproof-laminate', _type: 'slug' },
        description: 'Water-resistant laminate flooring for any room.',
        parent: { _type: 'reference', _ref: laminateCat._id },
    });

    await client.createOrReplace({
        _id: 'category-engineered-hardwood',
        _type: 'category',
        title: 'Engineered Hardwood',
        slug: { current: 'engineered-hardwood', _type: 'slug' },
        description: 'Engineered hardwood flooring with superior stability.',
        parent: { _type: 'reference', _ref: hardwoodCat._id },
    });

    // 2. Create Products
    console.log('Creating products...');
    await client.createOrReplace({
        _id: 'product-oak-plank',
        _type: 'product',
        title: 'Classic Oak Plank',
        slug: { current: 'classic-oak-plank', _type: 'slug' },
        description: 'Traditional oak flooring with a rich, warm finish. Perfect for living rooms and bedrooms.',
        price: 8.99,
        priceUnit: '/ sq ft',
        specs: [
            { _key: '1', label: 'Thickness', value: '3/4 inch' },
            { _key: '2', label: 'Width', value: '5 inch' },
            { _key: '3', label: 'Length', value: 'Random (12"-48")' },
            { _key: '4', label: 'Finish', value: 'Matte Polyurethane' },
        ],
        category: { _type: 'reference', _ref: hardwoodCat._id },
        visibility: 'public',
        isFeatured: true,
    });

    await client.createOrReplace({
        _id: 'product-luxury-vinyl-tile',
        _type: 'product',
        title: 'Modern Luxury Vinyl Tile',
        slug: { current: 'modern-luxury-vinyl-tile', _type: 'slug' },
        description: 'Sleek and modern vinyl tile for any room. Waterproof and scratch-resistant.',
        price: 4.50,
        priceUnit: '/ sq ft',
        specs: [
            { _key: '1', label: 'Thickness', value: '5mm' },
            { _key: '2', label: 'Wear Layer', value: '20mil' },
            { _key: '3', label: 'Click System', value: 'Valinge 5G' },
        ],
        category: { _type: 'reference', _ref: vinylCat._id },
        visibility: 'public',
        isFeatured: true,
    });

    await client.createOrReplace({
        _id: 'product-luxury-laminate-falcon',
        _type: 'product',
        title: 'Luxury Laminate Falcon Ridge',
        slug: { current: 'luxury-laminate-falcon-ridge', _type: 'slug' },
        description: 'Industry-leading features in colors you will love. Pressed bevel, scratch resistant, and waterproof.',
        price: 3.99,
        priceUnit: '/ sq ft',
        specs: [
            { _key: '1', label: 'Thickness', value: '12mm' },
            { _key: '2', label: 'AC Rating', value: 'AC4' },
            { _key: '3', label: 'Water Resistance', value: '72 hours' },
            { _key: '4', label: 'Surface', value: '4D EIR' },
        ],
        category: { _type: 'reference', _ref: laminateCat._id },
        visibility: 'public',
        isFeatured: true,
    });

    // 3. Create Testimonial
    console.log('Creating testimonials...');
    const testimonial1 = await client.createOrReplace({
        _id: 'testimonial-john-doe',
        _type: 'testimonial',
        author: 'John Doe',
        content: 'Excellent service and quality products. The hardwood flooring transformed our home completely.',
    });

    const testimonial2 = await client.createOrReplace({
        _id: 'testimonial-sarah-miller',
        _type: 'testimonial',
        author: 'Sarah Miller',
        content: 'Very professional team. They helped us choose the perfect vinyl flooring for our kitchen renovation.',
    });

    // 4. Create Pages
    console.log('Creating pages...');
    await client.createOrReplace({
        _id: 'page-visit-us',
        _type: 'page',
        title: 'Visit Us',
        slug: { current: 'visit-us', _type: 'slug' },
        body: [
            {
                _type: 'block',
                _key: 'b1',
                style: 'normal',
                children: [{ _key: 'c1', _type: 'span', text: 'Come visit our showroom to see and feel our products in person. Our knowledgeable staff is ready to help you find the perfect flooring solution.' }],
            },
        ],
        seo: {
            metaTitle: 'Visit Our Showroom | Hardwood Living',
            metaDescription: 'Visit our showroom to explore premium hardwood flooring and cabinetry options.',
        },
    });

    await client.createOrReplace({
        _id: 'page-care-guide',
        _type: 'page',
        title: 'Care Guide',
        slug: { current: 'care-guide', _type: 'slug' },
        body: [
            {
                _type: 'block',
                _key: 'b1',
                style: 'normal',
                children: [{ _key: 'c1', _type: 'span', text: 'Proper care and maintenance will keep your hardwood floors looking beautiful for decades. Follow these simple guidelines to protect your investment.' }],
            },
        ],
        seo: {
            metaTitle: 'Hardwood Floor Care Guide | Hardwood Living',
            metaDescription: 'Tips and guidelines for maintaining your hardwood floors.',
        },
    });

    await client.createOrReplace({
        _id: 'page-why-wood',
        _type: 'page',
        title: 'Why Wood?',
        slug: { current: 'why-wood', _type: 'slug' },
        body: [
            {
                _type: 'block',
                _key: 'b1',
                style: 'normal',
                children: [{ _key: 'c1', _type: 'span', text: 'Wood flooring is a timeless choice that adds warmth, character, and value to any home. Discover why homeowners across Canada choose hardwood.' }],
            },
        ],
        seo: {
            metaTitle: 'Why Choose Wood Flooring | Hardwood Living',
            metaDescription: 'Discover the benefits of choosing hardwood flooring for your home.',
        },
    });

    await client.createOrReplace({
        _id: 'page-trades',
        _type: 'page',
        title: 'Trade Program',
        slug: { current: 'trades', _type: 'slug' },
        body: [
            {
                _type: 'block',
                _key: 'b1',
                style: 'normal',
                children: [{ _key: 'c1', _type: 'span', text: 'Join our Trade Program and unlock exclusive benefits designed for contractors, installers, and design professionals.' }],
            },
        ],
        seo: {
            metaTitle: 'Trade Program | Hardwood Living',
            metaDescription: 'Join our trade program for exclusive pricing and dedicated support.',
        },
    });

    // 5. Create Site Settings (Magna-style navigation)
    console.log('Creating Site Settings...');
    await client.createOrReplace({
        _id: 'siteSettings',
        _type: 'siteSettings',
        siteName: 'Hardwood Living',
        navigation: [
            {
                _key: 'nav-products',
                _type: 'navItem',
                title: 'Our Products',
                position: 'left',
                children: [
                    { _key: 'nav-products-hardwood', _type: 'navChild', title: 'Hardwood Flooring', path: '/categories/hardwood-flooring' },
                    { _key: 'nav-products-vinyl', _type: 'navChild', title: 'Luxury Vinyl', path: '/categories/luxury-vinyl' },
                    { _key: 'nav-products-laminate', _type: 'navChild', title: 'Laminate', path: '/categories/laminate' },
                    { _key: 'nav-products-cabinetry', _type: 'navChild', title: 'Cabinetry', path: '/categories/cabinetry' },
                    { _key: 'nav-products-all', _type: 'navChild', title: 'View All Products', path: '/products' },
                ],
            },
            {
                _key: 'nav-galleries',
                _type: 'navItem',
                title: 'Galleries',
                path: '/pages/galleries',
                position: 'left',
            },
            {
                _key: 'nav-why-wood',
                _type: 'navItem',
                title: 'Why Wood?',
                path: '/pages/why-wood',
                position: 'right',
            },
            {
                _key: 'nav-contact',
                _type: 'navItem',
                title: 'Contact Us',
                path: '/contact',
                position: 'right',
            },
            {
                _key: 'nav-about',
                _type: 'navItem',
                title: 'About',
                position: 'left',
                children: [
                    { _key: 'nav-about-visit', _type: 'navChild', title: 'Visit Us', path: '/pages/visit-us' },
                    { _key: 'nav-about-care', _type: 'navChild', title: 'Care Guide', path: '/pages/care-guide' },
                ],
            },
            {
                _key: 'nav-trades',
                _type: 'navItem',
                title: 'Trades',
                path: '/trades',
                position: 'right',
            },
        ],
        contactInfo: {
            email: 'info@hardwoodliving.ca',
            phone: '(604) 555-0123',
            tollFree: '1-800-555-0199',
            address: '123 Timber Street, Vancouver, BC V6B 1A1',
        },
        socialLinks: [
            { _key: 'social-fb', _type: 'socialLink', platform: 'Facebook', url: 'https://facebook.com/hardwoodliving' },
            { _key: 'social-ig', _type: 'socialLink', platform: 'Instagram', url: 'https://instagram.com/hardwoodliving' },
        ],
    });

    // 6. Create Homepage (Magna-style)
    console.log('Creating Homepage...');
    await client.createOrReplace({
        _id: 'homepage',
        _type: 'homepage',
        hero: {
            heading: 'Premium Canadian Distributor',
            subheading: 'Of the finest quality hardwood, vinyl and laminate floors.',
            images: [],  // Images need to be uploaded via Studio - empty array as placeholder
            ctaLink: '/products',
            ctaText: 'View All Products',
        },
        introHeading: 'Welcome to Hardwood Living',
        introBlurb: 'Discover our curated collection of hardwood flooring and cabinetry, crafted for residential and commercial spaces across Canada. We bring the finest quality products directly to you.',
        categoryHighlights: [
            { _type: 'reference', _ref: hardwoodCat._id, _key: 'ch-hardwood' },
            { _type: 'reference', _ref: vinylCat._id, _key: 'ch-vinyl' },
            { _type: 'reference', _ref: laminateCat._id, _key: 'ch-laminate' },
            { _type: 'reference', _ref: cabinetCat._id, _key: 'ch-cabinetry' },
        ],
        featuredProducts: [
            { _type: 'reference', _ref: 'product-oak-plank', _key: 'fp-1' },
            { _type: 'reference', _ref: 'product-luxury-vinyl-tile', _key: 'fp-2' },
            { _type: 'reference', _ref: 'product-luxury-laminate-falcon', _key: 'fp-3' },
        ],
        ctaSection: {
            heading: 'View Our Products In Your Own Home',
            text: 'Try our room-visualizing tool to see what our flooring would look like in your home. Simply open the product you want and explore the possibilities.',
            linkText: 'View All',
            linkUrl: '/products',
        },
        testimonials: [
            { _type: 'reference', _ref: testimonial1._id, _key: 't-1' },
            { _type: 'reference', _ref: testimonial2._id, _key: 't-2' },
        ],
    });

    console.log('Seed completed successfully!');
}

main().catch((err) => {
    console.error('Seed failed:', err);
    process.exit(1);
});
