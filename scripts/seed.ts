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

    // Example: product with structured specifications (matches product detail card)
    await client.createOrReplace({
        _id: 'product-white-alaska',
        _type: 'product',
        title: 'White Alaska',
        slug: { current: 'white-alaska', _type: 'slug' },
        description: 'An elegant plank enhancing any room\'s accents contrast. Modern & ambient.',
        price: 8.5,
        priceUnit: '/ sq ft',
        specifications: {
            species: 'W. Oak',
            width: '7',
            thickness: '5/8',
            length: '2-7',
            prefinished: 'Urethane + Alum. Oxide',
            surface: 'Wire Brush',
            stain: 'White wash',
            color: 'Translucent Grain Wht. Wsh.',
            cut: 'Flat',
            grade: 'Character (A, B, C, D)',
            edge: 'Microbevel',
            traffic: 'Medium / High',
            application: 'Residential / Commercial',
            installation: 'Glue, Nail',
            pattern: 'Random',
            source: 'N. America',
            eco: 'Responsibly Harvested',
            jankaRate: '2300',
            radiantHeatRated: 'Yes (conditioned)',
            airMoisture: '40-50%',
            trimMoulding: 'Custom as needed',
            stock: 'Inquire',
            deliveryTime: 'Inquire',
            sftPerBox: '32',
            weightPerBox: '52Lb',
            boxDimensions: '7\'x7"',
        },
        category: { _type: 'reference', _ref: hardwoodCat._id },
        visibility: 'public',
        isFeatured: false,
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

    // 3. Create Testimonials (exact design copy)
    console.log('Creating testimonials...');
    const testimonial1 = await client.createOrReplace({
        _id: 'testimonial-sarah-m-1',
        _type: 'testimonial',
        author: 'Sarah M.',
        role: 'Homeowner',
        content: '"The showroom experience was incredible. The team helped us choose the perfect oak flooring for our living room. Absolutely love it!"',
    });
    const testimonial2 = await client.createOrReplace({
        _id: 'testimonial-david-k',
        _type: 'testimonial',
        author: 'David K.',
        role: 'Interior Designer',
        content: '"I always recommend this showroom to my clients. The quality and variety are unmatched, and the staff really understands design."',
    });
    const testimonial3 = await client.createOrReplace({
        _id: 'testimonial-sarah-m-2',
        _type: 'testimonial',
        author: 'Sarah M.',
        role: 'Homeowner',
        content: '"From selection to installation, everything was seamless. Our new vinyl planks look stunning and are so easy to maintain!"',
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
        siteName: 'Hardfloor Showroom',
        navigation: [
            {
                _key: 'nav-book',
                _type: 'navItem',
                title: 'Book a Visit',
                path: '/contact',
                position: 'left',
            },
            {
                _key: 'nav-collections',
                _type: 'navItem',
                title: 'Our Collections',
                path: '/products',
                position: 'left',
            },
            {
                _key: 'nav-about',
                _type: 'navItem',
                title: 'About Us',
                path: '/pages/visit-us',
                position: 'right',
            },
            {
                _key: 'nav-contact',
                _type: 'navItem',
                title: 'Contact',
                path: '/contact',
                position: 'right',
            },
            {
                _key: 'nav-products',
                _type: 'navItem',
                title: 'Our Products',
                position: 'left',
                children: [
                    { _key: 'nav-products-hardwood', _type: 'navChild', title: 'Hardwood Flooring', path: '/categories/hardwood-flooring' },
                    { _key: 'nav-products-vinyl', _type: 'navChild', title: 'Luxury Vinyl', path: '/categories/luxury-vinyl' },
                    { _key: 'nav-products-laminate', _type: 'navChild', title: 'Laminate', path: '/categories/laminate' },
                    { _key: 'nav-products-all', _type: 'navChild', title: 'View All', path: '/products' },
                ],
            },
        ],
        contactInfo: {
            email: 'info@hardwoodliving.com',
            phone: '604 .726.5453',
            address: '123 Flooring Avenue, Suite 100\nAmsterdam, Netherlands',
            tollFree: '',
        },
        footerTagline: 'Premium flooring solutions for homeowners, designers, and contractors since 2005.',
        businessHours: 'Mon Fri: 9:00 18:00\nSat: 10:00 16:00',
        footerPhone: '+31 (0)20 123 4567',
        readyToFindHeading: 'Ready to Find Your Perfect Floor?',
        readyToFindPrimaryText: 'Book Your Visit',
        readyToFindSecondaryText: 'Request Info',
        copyrightText: '© 2026 Hardfloor Showroom. All rights reserved.',
        socialLinks: [
            { _key: 'social-fb', _type: 'socialLink', platform: 'Facebook', url: 'https://facebook.com/hardwoodliving' },
            { _key: 'social-ig', _type: 'socialLink', platform: 'Instagram', url: 'https://instagram.com/hardwoodliving' },
        ],
    });

    // 6. Create Homepage (100% design copy from hardfloor website desktop PDF)
    console.log('Creating Homepage...');
    await client.createOrReplace({
        _id: 'homepage',
        _type: 'homepage',
        hero: {
            heading: 'Find Your Perfect Hardfloor',
            subheading: 'Explore premium flooring options in person and get expert guidance for your home.',
            images: [],
            ctaLink: '/contact',
            ctaText: 'Book a showroom visit',
            cta2Link: '/contact',
            cta2Text: 'Request a quote',
        },
        choosingSection: {
            heading1: 'Choosing the Right Floor',
            heading2: "Doesn't Have to Be Hard",
            painPoints: [
                'Too many options and no clear guidance',
                "Photos online don't show true color or texture",
                'Worry about picking the wrong style for the home',
                'Concerns about durability, scratches, and maintenance',
                'Uncertainty about what fits your budget',
            ],
            resultText: 'People delay decisions, feel stressed, and risk choosing flooring they\'ll regret.',
            tagline: 'See It. Choose Confidently.',
            solutionBullets: [
                'Visit our showroom and explore real hardwood samples',
                'Get personalized recommendations based on your space and lifestyle',
                'Compare finishes, tones, and textures side by side',
                'Learn what works best for pets, kids, and daily wear',
                'Leave knowing you made the right choice with zero pressure',
            ],
            ctaText: 'Book a showroom visit',
            ctaLink: '/contact',
        },
        whatWeOffer: {
            intro: 'Complete flooring solutions — installation, maintenance, and custom designs for every home.',
            items: [
                { title: 'Hardwood', description: 'Bring timeless elegance into your home with authentic natural wood floors built to last for generations.' },
                { title: 'Engineered', description: 'Enjoy the beauty of real hardwood with added stability, making it ideal for modern homes and changing climates.' },
                { title: 'Vinyl', description: 'A stylish, waterproof flooring option that stands up to busy families, pets, and everyday life with ease.' },
                { title: 'Laminate', description: 'Get the look of hardwood at a budget friendly price, with durable performance made for high traffic spaces.' },
                { title: 'Custom Floors', description: 'Create a one of a kind floor designed around your style, your space, and your exact project needs.' },
                { title: 'Unfinished', description: 'Start with raw wood and customize the stain, tone, and finish to match your home perfectly.' },
                { title: 'Adhesive', description: 'Professional installation starts here — high quality adhesives that ensure strong, long lasting results.' },
                { title: 'Accessories', description: 'From trims to underlayment, find the essential finishing touches that make your flooring project complete.' },
                { title: 'Coatings', description: 'Protect your investment with premium coatings that enhance durability, shine, and long term beauty.' },
                { title: 'Lumber', description: 'Reliable, high quality lumber for flooring, construction, and custom woodworking projects.' },
                { title: 'Home Decor', description: 'Elevate your space with carefully selected decor elements that pair beautifully with your flooring.' },
                { title: 'Commercial', description: 'Durable flooring solutions designed to handle heavy traffic while maintaining a clean, professional look.' },
            ],
        },
        ourSpecialty: {
            intro: 'Everything you need from first visit to finished floor.',
            items: [
                { number: '01', title: 'Supply', description: 'Hardwoodliving offers a variety of hardwood and engineered flooring, with more wood, tile, vinyl, and remodeling products coming soon.' },
                { number: '02', title: 'Installation', description: 'Floor installation is key to long lasting results. We provide expert, unbiased guidance to ensure a smooth, reliable, and beautiful finish.' },
                { number: '03', title: 'Contracting', description: 'Expert installation recommendations and coordination with trusted professionals.' },
                { number: '04', title: 'Maintenance', description: 'Tips and products to keep your floors looking pristine for years to come.' },
            ],
            ctaText: 'Book a showroom visit',
            ctaLink: '/contact',
        },
        flooringGrades: {
            heading: 'Flooring grades',
            subheading: 'Handpicked materials for every style and space.',
            grades: [
                { name: 'Prime /AB', bullets: ['High-end grade', 'Even appearance', 'Few or no knots', 'Low sap wood', 'Center cut'] },
                { name: 'Select /ABc', bullets: ['Select / & better', 'Small knots 5-10%', 'Color variations', 'Milling imperfect', 'Smooth, flat cut'] },
                { name: 'Natural /ABcd', bullets: ['More character', 'More, larger knots', 'Sap wood, variety', 'Spots, streaks', 'Knot holes, splits'] },
                { name: 'Rustic / Cd', bullets: ['Character', 'Knots, raw texture', 'Imperfections', 'Stains, split ends', 'Shattered pieces'] },
            ],
        },
        lumberCuts: {
            heading: 'Lumber cuts',
            intro: 'Lumber & veneer cuts determine the core appearance of the floor boards, the length, performance, stability & price.',
            cuts: [
                { name: 'Plainsawn', description: 'Wood cut parallel to the growth rings (0°–45°) is called plainsawn in hardwoods and flatsawn in softwoods. It is stable in thickness but less stable in width.' },
                { name: 'Riftsawn', description: 'Here\'s a shorter version of that text: Riftsawn (hardwoods) or bastard sawn (softwoods) lumber is cut so the growth rings form 30°–60° angles to the board\'s face.' },
                { name: 'Quartersawn', description: 'Quartersawn (hardwoods) or vertical grain (softwoods) lumber is cut perpendicular to the growth rings (45°–90°). It\'s more stable in width but less stable in thickness.' },
                { name: 'Livesawn', description: 'Live sawn wood is cut straight from log to board, showing the full range of grain patterns, width, and stability.' },
            ],
        },
        limitedTimeOffer: {
            heading: 'Special Offer Save on Selected Floors',
            body: 'Book your showroom visit today and enjoy exclusive discounts on selected flooring collections. Limited-time offer — book your visit now before slots fill up!',
            ctaText: 'Book a showroom visit',
            ctaLink: '/contact',
            cta2Text: 'Request a quote',
            cta2Link: '/contact',
        },
        whyLoveUs: {
            heading: "We've helped thousands create their dream spaces.",
            items: [
                { title: 'Premium Materials', description: 'We source only the highest quality flooring from trusted European and local brands.' },
                { title: 'Expert Guidance', description: 'Our flooring specialists help you pick the perfect match for your lifestyle and taste..' },
                { title: 'Seamless Experience', description: 'From selection to installation, we make the entire process effortless and enjoyable.' },
                { title: 'Built to Last for Real Life', description: 'Durable design that keeps up with your everyday.' },
            ],
        },
        ourWorksHeading: 'Our works',
        faq: {
            heading: "Have Questions? We've Got Answers",
            items: [
                { question: 'Do I need an appointment to visit the showroom?', answer: 'Walk ins are welcome, but we recommend booking an appointment so a specialist can be ready to assist you personally.' },
                { question: 'Can I take samples home?', answer: '' },
                { question: 'Where is the showroom located?', answer: '' },
                { question: 'Do you offer installation services?', answer: '' },
                { question: 'What are your payment options?', answer: '' },
            ],
        },
        testimonialsHeading: 'What Our Customers Are Saying',
        testimonials: [
            { _type: 'reference', _ref: testimonial1._id, _key: 't-1' },
            { _type: 'reference', _ref: testimonial2._id, _key: 't-2' },
            { _type: 'reference', _ref: testimonial3._id, _key: 't-3' },
        ],
        bookVisitForm: {
            heading: 'Book Your Showroom Visit',
            subheading: 'Fill out the form below and our team will get back to you quickly. It only takes 30 seconds.',
            primaryCtaText: 'Book a showroom visit',
            secondaryCtaText: 'Request a quote',
        },
    });

    console.log('Seed completed successfully!');
}

main().catch((err) => {
    console.error('Seed failed:', err);
    process.exit(1);
});
