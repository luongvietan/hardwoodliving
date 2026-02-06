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
        slug: { current: 'hardwood-flooring' },
        description: 'Premium hardwood flooring options.'
    });

    const vinylCat = await client.createOrReplace({
        _id: 'category-vinyl',
        _type: 'category',
        title: 'Luxury Vinyl',
        slug: { current: 'luxury-vinyl' },
        description: 'Durable and water-resistant vinyl flooring.'
    });

    // 2. Create Products
    console.log('Creating products...');
    await client.createOrReplace({
        _id: 'product-oak-plank',
        _type: 'product',
        title: 'Classic Oak Plank',
        slug: { current: 'classic-oak-plank' },
        description: 'Traditional oak flooring with a rich finish.',
        price: 8.99,
        specs: [
            { _key: '1', label: 'Thickness', value: '3/4 inch' },
            { _key: '2', label: 'Width', value: '5 inch' }
        ],
        category: { _type: 'reference', _ref: hardwoodCat._id },
        visibility: 'public',
        isFeatured: true
    });

    await client.createOrReplace({
        _id: 'product-luxury-vinyl-tile',
        _type: 'product',
        title: 'Modern Luxury Vinyl Tile',
        slug: { current: 'modern-luxury-vinyl-tile' },
        description: 'Sleek and modern vinyl tile for any room.',
        price: 4.50,
        specs: [
            { _key: '1', label: 'Thickness', value: '5mm' },
            { _key: '2', label: 'Wear Layer', value: '20mil' }
        ],
        category: { _type: 'reference', _ref: vinylCat._id },
        visibility: 'public',
        isFeatured: false
    });

    // 3. Create Testimonial
    console.log('Creating testimonial...');
    const testimonial = await client.createOrReplace({
        _id: 'testimonial-john-doe',
        _type: 'testimonial',
        author: 'John Doe',
        content: 'Excellent service and quality products. Highly recommended!',
    });

    // 4. Create Page (About Us)
    console.log('Creating "About Us" page...');
    await client.createOrReplace({
        _id: 'page-about-us',
        _type: 'page',
        title: 'About Us',
        slug: { current: 'about-us' },
        body: [
            {
                _type: 'block',
                _key: 'b1',
                style: 'normal',
                children: [{ _key: 'c1', _type: 'span', text: 'Welcome to Hardwood Living. We specialize in providing the best flooring solutions.' }]
            }
        ],
        seo: {
            _type: 'seo', // Assuming SEO fields are simple objects or strict types if defined, but here simplified
            metaTitle: 'About Hardwood Living',
            metaDescription: 'Learn more about our company.'
        }
    });

    // 5. Create Singletons (Homepage and SiteSettings)
    console.log('Creating Site Settings...');
    await client.createOrReplace({
        _id: 'siteSettings', // Singleton ID usually fixed
        _type: 'siteSettings',
        siteName: 'Hardwood Living',
        contactInfo: {
            _type: 'contactInfo', // Assuming this matches schema structure implied
            email: 'contact@hardwoodliving.com',
            phone: '555-0123'
        }
    });

    console.log('Creating Homepage...');
    await client.createOrReplace({
        _id: 'homepage', // Singleton ID
        _type: 'homepage',
        hero: {
            _type: 'hero', // Assuming hero object structure
            heading: 'Flooring Excellence',
            subheading: 'Transform your home with our premium selection.'
        },
        introBlurb: 'Discover the finest collection of hardwood and vinyl flooring.',
        featuredProducts: [
            { _type: 'reference', _ref: 'product-oak-plank' }
        ],
        testimonials: [
            { _type: 'reference', _ref: testimonial._id }
        ]
    });

    console.log('Seed completed successfully!');
}

main().catch((err) => {
    console.error('Seed failed:', err);
    process.exit(1);
});
