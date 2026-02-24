/**
 * Script 2: Seed comprehensive test data for categories & products.
 * Covers ALL test cases: visibility, sale price, materialType, finish,
 * isCommercial, isBestValue, subcategories, tags, full specs, no specs, no image, price=0.
 *
 * Run: npm run seed:test
 */
import { createClient } from 'next-sanity';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const token = process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_API_READ_TOKEN;

if (!projectId || !dataset || !token) {
    console.error('Missing env vars. Check .env.local');
    process.exit(1);
}

const client = createClient({
    projectId,
    dataset,
    apiVersion: '2024-02-07',
    token,
    useCdn: false,
});

// ─── Helpers ────────────────────────────────────────────────────────────────

function slug(s: string) {
    return { _type: 'slug' as const, current: s };
}

function ref(id: string) {
    return { _type: 'reference' as const, _ref: id };
}

/** Sanity image asset ref → image field object */
function imageAsset(assetRef: string) {
    return {
        _type: 'image' as const,
        asset: { _type: 'reference' as const, _ref: assetRef },
    };
}

/**
 * Fetch an image from a URL and upload it to Sanity Assets.
 * Returns the Sanity asset _id (e.g. "image-abc123-800x600-jpg").
 * Caches by URL so the same image is not uploaded twice.
 */
const uploadCache = new Map<string, string>();

async function uploadImageFromUrl(url: string, filename: string): Promise<string> {
    if (uploadCache.has(url)) return uploadCache.get(url)!;

    process.stdout.write(`    ↑ uploading ${filename}... `);
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch image ${url}: ${response.status}`);

    const buffer = Buffer.from(await response.arrayBuffer());
    const ext = url.includes('.png') ? 'png' : 'jpg';
    const asset = await client.assets.upload('image', buffer, {
        filename: `${filename}.${ext}`,
        contentType: `image/${ext}`,
    });
    console.log(`✅ ${asset._id}`);
    uploadCache.set(url, asset._id);
    return asset._id;
}

// ─── Category IDs ────────────────────────────────────────────────────────────

const CAT = {
    // Top-level
    hardwood: 'seed-cat-hardwood',
    engineered: 'seed-cat-engineered',
    lvp: 'seed-cat-lvp',
    laminate: 'seed-cat-laminate',
    tile: 'seed-cat-tile',
    carpetTile: 'seed-cat-carpet-tile',
    accessories: 'seed-cat-accessories',
    // Subcategories of hardwood
    hardwoodPrefinished: 'seed-cat-hardwood-prefinished',
    hardwoodUnfinished: 'seed-cat-hardwood-unfinished',
    // Subcategories of engineered
    engineeredPrefinished: 'seed-cat-engineered-prefinished',
    engineeredUnfinished: 'seed-cat-engineered-unfinished',
    // Subcategories of LVP
    lvpSpc: 'seed-cat-lvp-spc',
    lvpWpc: 'seed-cat-lvp-wpc',
};

// ─── Product IDs ─────────────────────────────────────────────────────────────

const PROD = {
    // Hardwood — prefinished
    oakPrime: 'seed-prod-oak-prime',
    mapleSelect: 'seed-prod-maple-select',
    walnutRustic: 'seed-prod-walnut-rustic',
    whiteAlaska: 'seed-prod-white-alaska',
    // Hardwood — unfinished
    oakUnfinished: 'seed-prod-oak-unfinished',
    // Engineered
    engineeredOak: 'seed-prod-engineered-oak',
    engineeredMaple: 'seed-prod-engineered-maple',
    // LVP — SPC
    lvpSpcGrey: 'seed-prod-lvp-spc-grey',
    lvpSpcBeige: 'seed-prod-lvp-spc-beige',
    // LVP — WPC
    lvpWpcBrown: 'seed-prod-lvp-wpc-brown',
    // Laminate
    laminateFalcon: 'seed-prod-laminate-falcon',
    laminateOak: 'seed-prod-laminate-oak',
    // Tile
    tilePorcelain: 'seed-prod-tile-porcelain',
    // Accessories
    underlayment: 'seed-prod-underlayment',
    // Edge cases
    wholesaleOnly: 'seed-prod-wholesale-only',
    hiddenDraft: 'seed-prod-hidden-draft',
    noImage: 'seed-prod-no-image',
    priceZero: 'seed-prod-price-zero',
    onSale: 'seed-prod-on-sale',
    bestValue: 'seed-prod-best-value',
    commercial: 'seed-prod-commercial',
    noSpecs: 'seed-prod-no-specs',
    fullSpecs: 'seed-prod-full-specs',
    featured: 'seed-prod-featured',
    allTags: 'seed-prod-all-tags',
};

// Full structured specs for testing ProductSpecs component
const FULL_SPECS = {
    species: 'White Oak',
    width: '7 inch',
    thickness: '5/8',
    length: '2-7 ft',
    prefinished: 'Urethane + Alum. Oxide',
    surface: 'Wire Brush',
    stain: 'White Wash',
    color: 'Translucent Grain White Wash',
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
    stock: 'In Stock',
    deliveryTime: '3-5 business days',
    sftPerBox: '32',
    weightPerBox: '52 Lb',
    boxDimensions: "7'x7\"",
};

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
    console.log('🌱 Starting comprehensive test seed...\n');

    // ── 0. UPLOAD IMAGES ─────────────────────────────────────────────────────
    console.log('🖼️  Uploading images to Sanity Assets...');
    const A = {
        hardwood1: await uploadImageFromUrl('https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80', 'hardwood-1'),
        hardwood2: await uploadImageFromUrl('https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80', 'hardwood-2'),
        hardwood3: await uploadImageFromUrl('https://images.unsplash.com/photo-1615873968403-89e068629265?w=800&q=80', 'hardwood-3'),
        engineered: await uploadImageFromUrl('https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80', 'engineered'),
        lvp: await uploadImageFromUrl('https://images.unsplash.com/photo-1615873968403-89e068629265?w=800&q=80', 'lvp'),
        laminate: await uploadImageFromUrl('https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80', 'laminate'),
        tile: await uploadImageFromUrl('https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80', 'tile'),
        accessories: await uploadImageFromUrl('https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80', 'accessories'),
    };
    console.log('  ✅ All images uploaded\n');

    // ── 1. TOP-LEVEL CATEGORIES ──────────────────────────────────────────────
    console.log('📁 Creating top-level categories...');

    await client.createOrReplace({
        _id: CAT.hardwood,
        _type: 'category',
        title: 'Hardwood Flooring',
        slug: slug('hardwood-flooring'),
        description: 'Timeless solid hardwood floors — prefinished and unfinished options for residential and commercial spaces.',
        image: imageAsset(A.hardwood1),
    });

    await client.createOrReplace({
        _id: CAT.engineered,
        _type: 'category',
        title: 'Engineered Hardwood',
        slug: slug('engineered-hardwood'),
        description: 'Real hardwood veneer over a stable plywood core — ideal for basements and radiant heat.',
        image: imageAsset(A.engineered),
    });

    await client.createOrReplace({
        _id: CAT.lvp,
        _type: 'category',
        title: 'Luxury Vinyl',
        slug: slug('luxury-vinyl'),
        description: '100% waterproof luxury vinyl plank — SPC and WPC options for every room.',
        image: imageAsset(A.lvp),
    });

    await client.createOrReplace({
        _id: CAT.laminate,
        _type: 'category',
        title: 'Laminate',
        slug: slug('laminate'),
        description: 'The look of hardwood at a budget-friendly price — AC4 rated for high traffic.',
        image: imageAsset(A.laminate),
    });

    await client.createOrReplace({
        _id: CAT.tile,
        _type: 'category',
        title: 'Tile',
        slug: slug('tile'),
        description: 'Durable porcelain and ceramic tile for kitchens, bathrooms, and entryways.',
        image: imageAsset(A.tile),
    });

    await client.createOrReplace({
        _id: CAT.carpetTile,
        _type: 'category',
        title: 'Carpet Tile',
        slug: slug('carpet-tile'),
        description: 'Modular carpet tile solutions for commercial and residential spaces.',
    });

    await client.createOrReplace({
        _id: CAT.accessories,
        _type: 'category',
        title: 'Accessories',
        slug: slug('accessories'),
        description: 'Underlayment, trims, adhesives, and installation accessories.',
        image: imageAsset(A.accessories),
    });

    console.log('  ✅ 7 top-level categories created\n');

    // ── 2. SUBCATEGORIES ─────────────────────────────────────────────────────
    console.log('📂 Creating subcategories...');

    await client.createOrReplace({
        _id: CAT.hardwoodPrefinished,
        _type: 'category',
        title: 'Prefinished Hardwood',
        slug: slug('hardwood-prefinished'),
        description: 'Factory-finished solid hardwood — ready to install, no sanding required.',
        parent: ref(CAT.hardwood),
    });

    await client.createOrReplace({
        _id: CAT.hardwoodUnfinished,
        _type: 'category',
        title: 'Unfinished Hardwood',
        slug: slug('hardwood-unfinished'),
        description: 'Raw solid hardwood — sand and stain on-site for a fully custom look.',
        parent: ref(CAT.hardwood),
    });

    await client.createOrReplace({
        _id: CAT.engineeredPrefinished,
        _type: 'category',
        title: 'Prefinished Engineered',
        slug: slug('engineered-prefinished'),
        description: 'Factory-finished engineered hardwood — quick install over any subfloor.',
        parent: ref(CAT.engineered),
    });

    await client.createOrReplace({
        _id: CAT.engineeredUnfinished,
        _type: 'category',
        title: 'Unfinished Engineered',
        slug: slug('engineered-unfinished'),
        description: 'Unfinished engineered boards for custom stain and finish on-site.',
        parent: ref(CAT.engineered),
    });

    await client.createOrReplace({
        _id: CAT.lvpSpc,
        _type: 'category',
        title: 'SPC Vinyl',
        slug: slug('lvp-spc'),
        description: 'Stone Plastic Composite — rigid, ultra-durable waterproof vinyl.',
        parent: ref(CAT.lvp),
    });

    await client.createOrReplace({
        _id: CAT.lvpWpc,
        _type: 'category',
        title: 'WPC Vinyl',
        slug: slug('lvp-wpc'),
        description: 'Wood Plastic Composite — softer underfoot, great sound absorption.',
        parent: ref(CAT.lvp),
    });

    console.log('  ✅ 6 subcategories created\n');

    // ── 3. PRODUCTS ──────────────────────────────────────────────────────────
    console.log('📦 Creating products...\n');

    // ── Hardwood Prefinished ─────────────────────────────────────────────────
    console.log('  Hardwood — Prefinished...');

    await client.createOrReplace({
        _id: PROD.oakPrime,
        _type: 'product',
        title: 'White Oak Prime — Wire Brush',
        slug: slug('white-oak-prime-wire-brush'),
        description: 'Prime grade white oak with a wire-brushed surface and UV-cured finish. Warm honey tones with subtle grain character.',
        price: 12.99,
        priceUnit: '/ sq ft',
        materialType: 'hardwood',
        finish: 'prefinished',
        visibility: 'public',
        isFeatured: true,
        isOnSale: false,
        isBestValue: false,
        isCommercial: false,
        sortOrder: 1,
        tags: ['wide-plank', 'wire-brush', 'white-oak', 'residential'],
        images: [imageAsset(A.hardwood1)],
        category: ref(CAT.hardwoodPrefinished),
        specifications: {
            species: 'White Oak',
            width: '7.5 inch',
            thickness: '3/4',
            length: '2-7 ft',
            prefinished: 'UV Cured Urethane',
            surface: 'Wire Brush',
            stain: 'Natural',
            color: 'Honey',
            cut: 'Flat',
            grade: 'Prime (AB)',
            edge: 'Microbevel',
            traffic: 'High',
            application: 'Residential',
            installation: 'Nail, Staple',
            pattern: 'Random',
            source: 'N. America',
            eco: 'FSC Certified',
            jankaRate: '1360',
            radiantHeatRated: 'No',
            airMoisture: '35-55%',
            trimMoulding: 'Available',
            stock: 'In Stock',
            deliveryTime: '3-5 days',
            sftPerBox: '24',
            weightPerBox: '45 Lb',
            boxDimensions: "7.5\"x84\"",
        },
    });

    await client.createOrReplace({
        _id: PROD.whiteAlaska,
        _type: 'product',
        title: 'White Alaska',
        slug: slug('white-alaska'),
        description: 'An elegant plank enhancing any room\'s accents contrast. Modern & ambient with a whitewash finish.',
        price: 8.50,
        priceUnit: '/ sq ft',
        materialType: 'hardwood',
        finish: 'prefinished',
        visibility: 'public',
        isFeatured: true,
        isOnSale: false,
        isBestValue: true,
        isCommercial: false,
        sortOrder: 2,
        tags: ['white-wash', 'wide-plank', 'white-oak', 'modern'],
        images: [imageAsset(A.hardwood2)],
        category: ref(CAT.hardwoodPrefinished),
        specifications: FULL_SPECS,
    });

    await client.createOrReplace({
        _id: PROD.mapleSelect,
        _type: 'product',
        title: 'Hard Maple Select — Smooth',
        slug: slug('hard-maple-select-smooth'),
        description: 'Hard maple in select grade with a smooth satin finish. Consistent light tone, perfect for modern interiors.',
        price: 9.75,
        priceUnit: '/ sq ft',
        materialType: 'hardwood',
        finish: 'prefinished',
        visibility: 'public',
        isFeatured: false,
        isOnSale: true,
        salePrice: 7.49,
        isBestValue: false,
        isCommercial: false,
        sortOrder: 3,
        tags: ['maple', 'smooth', 'light-tone', 'on-sale'],
        images: [imageAsset(A.hardwood3)],
        category: ref(CAT.hardwoodPrefinished),
        specifications: {
            species: 'Hard Maple',
            width: '3.25 inch',
            thickness: '3/4',
            length: '1-7 ft',
            prefinished: 'Aluminum Oxide',
            surface: 'Smooth',
            stain: 'Natural',
            color: 'Cream',
            cut: 'Flat',
            grade: 'Select (ABc)',
            edge: 'Square',
            traffic: 'High',
            application: 'Residential / Commercial',
            installation: 'Nail, Staple',
            pattern: 'Random',
            source: 'N. America',
            eco: 'Responsibly Harvested',
            jankaRate: '1450',
            radiantHeatRated: 'No',
            airMoisture: '35-55%',
            trimMoulding: 'Available',
            stock: 'In Stock',
            deliveryTime: '3-5 days',
            sftPerBox: '20',
            weightPerBox: '40 Lb',
            boxDimensions: "3.25\"x84\"",
        },
    });

    await client.createOrReplace({
        _id: PROD.walnutRustic,
        _type: 'product',
        title: 'Black Walnut Rustic — Hand Scraped',
        slug: slug('black-walnut-rustic-hand-scraped'),
        description: 'Rich dark walnut with rustic character and hand-scraped texture. Bold grain patterns with natural knots and color variation.',
        price: 16.50,
        priceUnit: '/ sq ft',
        materialType: 'hardwood',
        finish: 'prefinished',
        visibility: 'public',
        isFeatured: false,
        isOnSale: false,
        isBestValue: false,
        isCommercial: false,
        sortOrder: 4,
        tags: ['walnut', 'hand-scraped', 'dark-tone', 'rustic', 'wide-plank'],
        images: [imageAsset(A.hardwood1)],
        category: ref(CAT.hardwoodPrefinished),
        specifications: {
            species: 'Black Walnut',
            width: '5 inch',
            thickness: '3/4',
            length: '2-7 ft',
            prefinished: 'Oil Finish',
            surface: 'Hand Scraped',
            stain: 'Dark Walnut',
            color: 'Espresso Brown',
            cut: 'Flat',
            grade: 'Rustic (Cd)',
            edge: 'Microbevel',
            traffic: 'Medium',
            application: 'Residential',
            installation: 'Nail, Glue',
            pattern: 'Random',
            source: 'N. America',
            eco: 'Responsibly Harvested',
            jankaRate: '1010',
            radiantHeatRated: 'No',
            airMoisture: '40-50%',
            trimMoulding: 'Available',
            stock: 'Inquire',
            deliveryTime: '7-10 days',
            sftPerBox: '18',
            weightPerBox: '50 Lb',
            boxDimensions: "5\"x84\"",
        },
    });

    // ── Hardwood Unfinished ──────────────────────────────────────────────────
    console.log('  Hardwood — Unfinished...');

    await client.createOrReplace({
        _id: PROD.oakUnfinished,
        _type: 'product',
        title: 'Red Oak Unfinished — 3/4" x 2.25"',
        slug: slug('red-oak-unfinished-3-4-2-25'),
        description: 'Classic red oak unfinished strip flooring. Sand and finish on-site for a fully custom look.',
        price: 5.25,
        priceUnit: '/ sq ft',
        materialType: 'hardwood',
        finish: 'unfinished',
        visibility: 'public',
        isFeatured: false,
        isOnSale: false,
        isBestValue: true,
        isCommercial: false,
        sortOrder: 5,
        tags: ['red-oak', 'unfinished', 'strip', 'custom-stain'],
        images: [imageAsset(A.hardwood2)],
        category: ref(CAT.hardwoodUnfinished),
        specifications: {
            species: 'Red Oak',
            width: '2.25 inch',
            thickness: '3/4',
            length: '1-7 ft',
            prefinished: 'N/A — Sand & Finish On-Site',
            surface: 'Smooth (raw)',
            stain: 'N/A',
            color: 'Natural',
            cut: 'Flat',
            grade: 'Select & Better',
            edge: 'Square',
            traffic: 'High',
            application: 'Residential / Commercial',
            installation: 'Nail, Staple',
            pattern: 'Random',
            source: 'N. America',
            eco: 'Responsibly Harvested',
            jankaRate: '1290',
            radiantHeatRated: 'No',
            airMoisture: '35-55%',
            trimMoulding: 'Available',
            stock: 'In Stock',
            deliveryTime: '3-5 days',
            sftPerBox: '20',
            weightPerBox: '42 Lb',
            boxDimensions: "2.25\"x84\"",
        },
    });

    // ── Engineered ───────────────────────────────────────────────────────────
    console.log('  Engineered Hardwood...');

    await client.createOrReplace({
        _id: PROD.engineeredOak,
        _type: 'product',
        title: 'Engineered White Oak — Brushed Natural',
        slug: slug('engineered-white-oak-brushed-natural'),
        description: 'Wide plank engineered white oak with a brushed natural finish. 9-ply Baltic birch core for maximum stability.',
        price: 10.25,
        priceUnit: '/ sq ft',
        materialType: 'engineered',
        finish: 'prefinished',
        visibility: 'public',
        isFeatured: true,
        isOnSale: false,
        isBestValue: false,
        isCommercial: false,
        sortOrder: 1,
        tags: ['white-oak', 'wide-plank', 'engineered', 'radiant-heat', 'basement'],
        images: [imageAsset(A.engineered)],
        category: ref(CAT.engineeredPrefinished),
        specifications: {
            species: 'White Oak',
            width: '9 inch',
            thickness: '9/16',
            length: '4-8 ft',
            prefinished: 'UV Oil',
            surface: 'Brushed',
            stain: 'Natural',
            color: 'Light Grey',
            cut: 'Flat',
            grade: 'Select (ABc)',
            edge: 'Microbevel',
            traffic: 'High',
            application: 'Residential / Commercial',
            installation: 'Float, Glue, Nail',
            pattern: 'Random',
            source: 'Europe',
            eco: 'FSC Certified',
            jankaRate: '1360',
            radiantHeatRated: 'Yes (up to 27°C)',
            airMoisture: '40-60%',
            trimMoulding: 'Available',
            stock: 'In Stock',
            deliveryTime: '5-7 days',
            sftPerBox: '28',
            weightPerBox: '55 Lb',
            boxDimensions: "9\"x96\"",
        },
    });

    await client.createOrReplace({
        _id: PROD.engineeredMaple,
        _type: 'product',
        title: 'Engineered Hard Maple — Unfinished',
        slug: slug('engineered-hard-maple-unfinished'),
        description: 'Unfinished engineered maple for custom on-site staining. 7-ply core, compatible with radiant heat.',
        price: 7.50,
        priceUnit: '/ sq ft',
        materialType: 'engineered',
        finish: 'unfinished',
        visibility: 'public',
        isFeatured: false,
        isOnSale: false,
        isBestValue: false,
        isCommercial: false,
        sortOrder: 2,
        tags: ['maple', 'unfinished', 'engineered', 'radiant-heat'],
        images: [imageAsset(A.engineered)],
        category: ref(CAT.engineeredUnfinished),
        specifications: {
            species: 'Hard Maple',
            width: '5 inch',
            thickness: '1/2',
            length: '2-6 ft',
            prefinished: 'N/A — Sand & Finish On-Site',
            surface: 'Smooth (raw)',
            stain: 'N/A',
            color: 'Natural',
            cut: 'Flat',
            grade: 'Select & Better',
            edge: 'Square',
            traffic: 'High',
            application: 'Residential',
            installation: 'Float, Glue',
            pattern: 'Random',
            source: 'N. America',
            eco: 'Responsibly Harvested',
            jankaRate: '1450',
            radiantHeatRated: 'Yes (up to 27°C)',
            airMoisture: '40-60%',
            trimMoulding: 'Available',
            stock: 'Inquire',
            deliveryTime: '7-10 days',
            sftPerBox: '22',
            weightPerBox: '38 Lb',
            boxDimensions: "5\"x72\"",
        },
    });

    // ── LVP — SPC ────────────────────────────────────────────────────────────
    console.log('  LVP — SPC...');

    await client.createOrReplace({
        _id: PROD.lvpSpcGrey,
        _type: 'product',
        title: 'SPC Rigid Core — Coastal Grey',
        slug: slug('spc-rigid-core-coastal-grey'),
        description: 'Ultra-rigid SPC core with 20mil wear layer. 100% waterproof, scratch-resistant, and pet-friendly.',
        price: 4.99,
        priceUnit: '/ sq ft',
        materialType: 'luxury-vinyl-plank',
        finish: 'prefinished',
        visibility: 'public',
        isFeatured: true,
        isOnSale: false,
        isBestValue: false,
        isCommercial: false,
        sortOrder: 1,
        tags: ['waterproof', 'pet-friendly', 'scratch-resistant', 'spc', 'grey'],
        images: [imageAsset(A.lvp)],
        category: ref(CAT.lvpSpc),
        specifications: {
            species: 'N/A',
            width: '7 inch',
            thickness: '6mm',
            length: '48 inch',
            prefinished: '20mil Wear Layer',
            surface: 'Embossed',
            stain: 'N/A',
            color: 'Coastal Grey',
            cut: 'N/A',
            grade: 'Commercial Grade',
            edge: 'Micro Bevel',
            traffic: 'Very High',
            application: 'Residential / Commercial',
            installation: 'Float (Click)',
            pattern: 'Random',
            source: 'Asia',
            eco: 'FloorScore Certified',
            jankaRate: 'N/A',
            radiantHeatRated: 'Yes',
            airMoisture: 'N/A — 100% Waterproof',
            trimMoulding: 'Available',
            stock: 'In Stock',
            deliveryTime: '3-5 days',
            sftPerBox: '23',
            weightPerBox: '35 Lb',
            boxDimensions: "7\"x48\"",
        },
    });

    await client.createOrReplace({
        _id: PROD.lvpSpcBeige,
        _type: 'product',
        title: 'SPC Rigid Core — Warm Beige',
        slug: slug('spc-rigid-core-warm-beige'),
        description: 'Warm beige SPC plank with realistic wood emboss. Ideal for high-traffic areas.',
        price: 4.49,
        priceUnit: '/ sq ft',
        materialType: 'luxury-vinyl-plank',
        finish: 'prefinished',
        visibility: 'public',
        isFeatured: false,
        isOnSale: true,
        salePrice: 3.49,
        isBestValue: true,
        isCommercial: false,
        sortOrder: 2,
        tags: ['waterproof', 'pet-friendly', 'spc', 'beige', 'on-sale', 'best-value'],
        images: [imageAsset(A.lvp)],
        category: ref(CAT.lvpSpc),
        specifications: {
            species: 'N/A',
            width: '6 inch',
            thickness: '5mm',
            length: '48 inch',
            prefinished: '12mil Wear Layer',
            surface: 'Embossed in Register',
            stain: 'N/A',
            color: 'Warm Beige',
            cut: 'N/A',
            grade: 'Residential Grade',
            edge: 'Micro Bevel',
            traffic: 'High',
            application: 'Residential',
            installation: 'Float (Click)',
            pattern: 'Random',
            source: 'Asia',
            eco: 'FloorScore Certified',
            jankaRate: 'N/A',
            radiantHeatRated: 'Yes',
            airMoisture: 'N/A — 100% Waterproof',
            trimMoulding: 'Available',
            stock: 'In Stock',
            deliveryTime: '3-5 days',
            sftPerBox: '20',
            weightPerBox: '28 Lb',
            boxDimensions: "6\"x48\"",
        },
    });

    // ── LVP — WPC ────────────────────────────────────────────────────────────
    console.log('  LVP — WPC...');

    await client.createOrReplace({
        _id: PROD.lvpWpcBrown,
        _type: 'product',
        title: 'WPC Comfort Core — Hazel Brown',
        slug: slug('wpc-comfort-core-hazel-brown'),
        description: 'WPC foam core for superior comfort underfoot. Quieter and warmer than SPC — ideal for bedrooms.',
        price: 5.75,
        priceUnit: '/ sq ft',
        materialType: 'luxury-vinyl-plank',
        finish: 'prefinished',
        visibility: 'public',
        isFeatured: false,
        isOnSale: false,
        isBestValue: false,
        isCommercial: false,
        sortOrder: 1,
        tags: ['waterproof', 'comfort', 'wpc', 'brown', 'bedroom'],
        images: [imageAsset(A.lvp)],
        category: ref(CAT.lvpWpc),
        specifications: {
            species: 'N/A',
            width: '7.5 inch',
            thickness: '8mm',
            length: '48 inch',
            prefinished: '20mil Wear Layer',
            surface: 'Embossed in Register',
            stain: 'N/A',
            color: 'Hazel Brown',
            cut: 'N/A',
            grade: 'Residential Grade',
            edge: 'Micro Bevel',
            traffic: 'Medium / High',
            application: 'Residential',
            installation: 'Float (Click)',
            pattern: 'Random',
            source: 'Asia',
            eco: 'FloorScore Certified',
            jankaRate: 'N/A',
            radiantHeatRated: 'Yes',
            airMoisture: 'N/A — 100% Waterproof',
            trimMoulding: 'Available',
            stock: 'In Stock',
            deliveryTime: '3-5 days',
            sftPerBox: '25',
            weightPerBox: '30 Lb',
            boxDimensions: "7.5\"x48\"",
        },
    });

    // ── Laminate ─────────────────────────────────────────────────────────────
    console.log('  Laminate...');

    await client.createOrReplace({
        _id: PROD.laminateFalcon,
        _type: 'product',
        title: 'Luxury Laminate Falcon Ridge',
        slug: slug('luxury-laminate-falcon-ridge'),
        description: 'Industry-leading features in colors you will love. Pressed bevel, scratch resistant, and waterproof. AC4 rated for commercial use.',
        price: 3.99,
        priceUnit: '/ sq ft',
        materialType: 'laminate',
        finish: 'prefinished',
        visibility: 'public',
        isFeatured: true,
        isOnSale: false,
        isBestValue: false,
        isCommercial: false,
        sortOrder: 1,
        tags: ['waterproof', 'ac4', 'commercial-grade', 'wide-plank'],
        images: [imageAsset(A.laminate)],
        category: ref(CAT.laminate),
        specifications: {
            species: 'N/A',
            width: '7.5 inch',
            thickness: '12mm',
            length: '48 inch',
            prefinished: 'AC4 Wear Layer',
            surface: '4D EIR',
            stain: 'N/A',
            color: 'Falcon Ridge',
            cut: 'N/A',
            grade: 'AC4 Commercial',
            edge: 'Pressed Bevel',
            traffic: 'Very High',
            application: 'Residential / Commercial',
            installation: 'Float (Click)',
            pattern: 'Random',
            source: 'Europe',
            eco: 'E1 Formaldehyde',
            jankaRate: 'N/A',
            radiantHeatRated: 'Yes',
            airMoisture: 'N/A — 72hr Water Resistance',
            trimMoulding: 'Available',
            stock: 'In Stock',
            deliveryTime: '3-5 days',
            sftPerBox: '22',
            weightPerBox: '48 Lb',
            boxDimensions: "7.5\"x48\"",
        },
    });

    await client.createOrReplace({
        _id: PROD.laminateOak,
        _type: 'product',
        title: 'Classic Oak Laminate — 8mm',
        slug: slug('classic-oak-laminate-8mm'),
        description: 'Entry-level laminate with realistic oak look. Great for rental properties and high-traffic areas.',
        price: 2.49,
        priceUnit: '/ sq ft',
        materialType: 'laminate',
        finish: 'prefinished',
        visibility: 'public',
        isFeatured: false,
        isOnSale: false,
        isBestValue: true,
        isCommercial: false,
        sortOrder: 2,
        tags: ['budget', 'oak-look', 'rental', 'best-value'],
        images: [imageAsset(A.laminate)],
        category: ref(CAT.laminate),
        specifications: {
            species: 'N/A',
            width: '5 inch',
            thickness: '8mm',
            length: '48 inch',
            prefinished: 'AC3 Wear Layer',
            surface: 'Embossed',
            stain: 'N/A',
            color: 'Natural Oak',
            cut: 'N/A',
            grade: 'AC3 Residential',
            edge: 'Micro Bevel',
            traffic: 'Medium / High',
            application: 'Residential',
            installation: 'Float (Click)',
            pattern: 'Random',
            source: 'Europe',
            eco: 'E1 Formaldehyde',
            jankaRate: 'N/A',
            radiantHeatRated: 'Yes',
            airMoisture: 'N/A',
            trimMoulding: 'Available',
            stock: 'In Stock',
            deliveryTime: '3-5 days',
            sftPerBox: '20',
            weightPerBox: '35 Lb',
            boxDimensions: "5\"x48\"",
        },
    });

    // ── Tile ─────────────────────────────────────────────────────────────────
    console.log('  Tile...');

    await client.createOrReplace({
        _id: PROD.tilePorcelain,
        _type: 'product',
        title: 'Matte Porcelain Tile — Concrete Look 24x24',
        slug: slug('matte-porcelain-tile-concrete-24x24'),
        description: 'Large format matte porcelain tile with a modern concrete look. Frost-resistant for indoor and outdoor use.',
        price: 6.99,
        priceUnit: '/ sq ft',
        materialType: 'tile',
        visibility: 'public',
        isFeatured: false,
        isOnSale: false,
        isBestValue: false,
        isCommercial: true,
        sortOrder: 1,
        tags: ['porcelain', 'concrete-look', 'large-format', 'commercial', 'outdoor'],
        images: [imageAsset(A.tile)],
        category: ref(CAT.tile),
        specs: [
            { _key: 'ts-1', label: 'Size', value: '24" x 24"' },
            { _key: 'ts-2', label: 'Thickness', value: '10mm' },
            { _key: 'ts-3', label: 'Finish', value: 'Matte' },
            { _key: 'ts-4', label: 'PEI Rating', value: '4' },
            { _key: 'ts-5', label: 'Frost Resistant', value: 'Yes' },
            { _key: 'ts-6', label: 'Application', value: 'Indoor / Outdoor' },
        ],
    });

    // ── Accessories ──────────────────────────────────────────────────────────
    console.log('  Accessories...');

    await client.createOrReplace({
        _id: PROD.underlayment,
        _type: 'product',
        title: 'Premium Foam Underlayment — 3mm',
        slug: slug('premium-foam-underlayment-3mm'),
        description: '3mm foam underlayment with vapor barrier. Compatible with laminate and LVP floating floors.',
        price: 0.49,
        priceUnit: '/ sq ft',
        materialType: 'accessories',
        visibility: 'public',
        isFeatured: false,
        isOnSale: false,
        isBestValue: false,
        isCommercial: false,
        sortOrder: 1,
        tags: ['underlayment', 'vapor-barrier', 'laminate', 'lvp'],
        images: [imageAsset(A.accessories)],
        category: ref(CAT.accessories),
        specs: [
            { _key: 'ua-1', label: 'Thickness', value: '3mm' },
            { _key: 'ua-2', label: 'Coverage', value: '100 sq ft / roll' },
            { _key: 'ua-3', label: 'Vapor Barrier', value: 'Yes' },
            { _key: 'ua-4', label: 'Compatible With', value: 'Laminate, LVP' },
        ],
    });

    // ── EDGE CASE PRODUCTS ───────────────────────────────────────────────────
    console.log('\n  Edge case products...');

    // TEST: Wholesale-only visibility
    await client.createOrReplace({
        _id: PROD.wholesaleOnly,
        _type: 'product',
        title: '[TEST] Wholesale Only — Trade Pricing',
        slug: slug('test-wholesale-only-trade-pricing'),
        description: 'This product is only visible to authenticated trade users. Public users should NOT see this.',
        price: 6.50,
        priceUnit: '/ sq ft',
        materialType: 'hardwood',
        finish: 'prefinished',
        visibility: 'wholesale',
        isFeatured: false,
        isOnSale: false,
        isBestValue: false,
        isCommercial: false,
        sortOrder: 99,
        tags: ['wholesale', 'trade-only'],
        images: [imageAsset(A.hardwood2)],
        category: ref(CAT.hardwoodPrefinished),
        specifications: {
            species: 'White Oak',
            width: '5 inch',
            thickness: '3/4',
            length: '2-7 ft',
            prefinished: 'UV Cured',
            surface: 'Smooth',
            stain: 'Natural',
            color: 'Natural',
            cut: 'Flat',
            grade: 'Select',
            edge: 'Square',
            traffic: 'High',
            application: 'Residential',
            installation: 'Nail',
            pattern: 'Random',
            source: 'N. America',
            eco: 'FSC Certified',
            jankaRate: '1360',
            radiantHeatRated: 'No',
            airMoisture: '35-55%',
            trimMoulding: 'Available',
            stock: 'In Stock',
            deliveryTime: '3-5 days',
            sftPerBox: '20',
            weightPerBox: '40 Lb',
            boxDimensions: "5\"x84\"",
        },
    });

    // TEST: Hidden product — should NEVER appear on site
    await client.createOrReplace({
        _id: PROD.hiddenDraft,
        _type: 'product',
        title: '[TEST] Hidden Draft — Should Not Appear',
        slug: slug('test-hidden-draft-should-not-appear'),
        description: 'This product is hidden. It should never appear on any public or trade page.',
        price: 99.99,
        priceUnit: '/ sq ft',
        visibility: 'hidden',
        isFeatured: false,
        isOnSale: false,
        isBestValue: false,
        isCommercial: false,
        sortOrder: 100,
        category: ref(CAT.hardwood),
    });

    // TEST: No image
    await client.createOrReplace({
        _id: PROD.noImage,
        _type: 'product',
        title: '[TEST] No Image Product',
        slug: slug('test-no-image-product'),
        description: 'This product has no image. The placeholder SVG should render in ProductCard and ProductGallery.',
        price: 3.99,
        priceUnit: '/ sq ft',
        materialType: 'laminate',
        visibility: 'public',
        isFeatured: false,
        isOnSale: false,
        isBestValue: false,
        isCommercial: false,
        sortOrder: 90,
        tags: ['no-image'],
        category: ref(CAT.laminate),
        specs: [
            { _key: 'ni-1', label: 'Test', value: 'No image placeholder test' },
        ],
    });

    // TEST: Price = 0 → "Contact for price"
    await client.createOrReplace({
        _id: PROD.priceZero,
        _type: 'product',
        title: '[TEST] Price on Request',
        slug: slug('test-price-on-request'),
        description: 'This product has price = 0. The card should show "Contact for price" instead of $0.00.',
        price: 0,
        priceUnit: '/ sq ft',
        materialType: 'hardwood',
        finish: 'prefinished',
        visibility: 'public',
        isFeatured: false,
        isOnSale: false,
        isBestValue: false,
        isCommercial: false,
        sortOrder: 91,
        tags: ['price-on-request'],
        images: [imageAsset(A.hardwood3)],
        category: ref(CAT.hardwoodPrefinished),
    });

    // TEST: On sale with strikethrough
    await client.createOrReplace({
        _id: PROD.onSale,
        _type: 'product',
        title: '[TEST] On Sale — Strikethrough Price',
        slug: slug('test-on-sale-strikethrough-price'),
        description: 'This product is on sale. The card should show original price struck through and sale price in orange.',
        price: 11.99,
        salePrice: 7.99,
        priceUnit: '/ sq ft',
        materialType: 'hardwood',
        finish: 'prefinished',
        visibility: 'public',
        isFeatured: false,
        isOnSale: true,
        isBestValue: false,
        isCommercial: false,
        sortOrder: 92,
        tags: ['on-sale', 'sale'],
        images: [imageAsset(A.hardwood1)],
        category: ref(CAT.hardwoodPrefinished),
        specs: [
            { _key: 'os-1', label: 'Original Price', value: '$11.99 / sq ft' },
            { _key: 'os-2', label: 'Sale Price', value: '$7.99 / sq ft' },
        ],
    });

    // TEST: Best value badge
    await client.createOrReplace({
        _id: PROD.bestValue,
        _type: 'product',
        title: '[TEST] Best Value Product',
        slug: slug('test-best-value-product'),
        description: 'This product has isBestValue = true. Should appear on /collections/best-value.',
        price: 4.25,
        priceUnit: '/ sq ft',
        materialType: 'lvp',
        visibility: 'public',
        isFeatured: false,
        isOnSale: false,
        isBestValue: true,
        isCommercial: false,
        sortOrder: 93,
        tags: ['best-value'],
        images: [imageAsset(A.lvp)],
        category: ref(CAT.lvp),
    });

    // TEST: Commercial product
    await client.createOrReplace({
        _id: PROD.commercial,
        _type: 'product',
        title: '[TEST] Commercial Grade Product',
        slug: slug('test-commercial-grade-product'),
        description: 'This product has isCommercial = true. Should appear on /commercial pages.',
        price: 8.99,
        priceUnit: '/ sq ft',
        materialType: 'luxury-vinyl-plank',
        visibility: 'public',
        isFeatured: false,
        isOnSale: false,
        isBestValue: false,
        isCommercial: true,
        sortOrder: 94,
        tags: ['commercial', 'heavy-duty'],
        images: [imageAsset(A.lvp)],
        category: ref(CAT.lvpSpc),
        specs: [
            { _key: 'cm-1', label: 'Traffic Rating', value: 'Heavy Commercial' },
            { _key: 'cm-2', label: 'Wear Layer', value: '28mil' },
        ],
    });

    // TEST: No specs — right column should NOT render
    await client.createOrReplace({
        _id: PROD.noSpecs,
        _type: 'product',
        title: '[TEST] No Specs — Single Column Layout',
        slug: slug('test-no-specs-single-column'),
        description: 'This product has no specs. The product detail page should render single-column (no right specs panel).',
        price: 5.99,
        priceUnit: '/ sq ft',
        materialType: 'laminate',
        visibility: 'public',
        isFeatured: false,
        isOnSale: false,
        isBestValue: false,
        isCommercial: false,
        sortOrder: 95,
        images: [imageAsset(A.laminate)],
        category: ref(CAT.laminate),
    });

    // TEST: Full structured specs (all 25 fields)
    await client.createOrReplace({
        _id: PROD.fullSpecs,
        _type: 'product',
        title: '[TEST] Full Specs — All 25 Fields',
        slug: slug('test-full-specs-all-25-fields'),
        description: 'This product has all 25 structured specification fields filled in. Tests the full ProductSpecs table.',
        price: 9.99,
        priceUnit: '/ sq ft',
        materialType: 'hardwood',
        finish: 'prefinished',
        visibility: 'public',
        isFeatured: false,
        isOnSale: false,
        isBestValue: false,
        isCommercial: false,
        sortOrder: 96,
        tags: ['full-specs', 'test'],
        images: [imageAsset(A.hardwood2)],
        category: ref(CAT.hardwoodPrefinished),
        specifications: FULL_SPECS,
        specs: [
            { _key: 'fs-1', label: 'Extra Field 1', value: 'Custom Value A' },
            { _key: 'fs-2', label: 'Extra Field 2', value: 'Custom Value B' },
        ],
    });

    // TEST: Featured product
    await client.createOrReplace({
        _id: PROD.featured,
        _type: 'product',
        title: '[TEST] Featured Product — Badge Visible',
        slug: slug('test-featured-product-badge'),
        description: 'This product is featured. The orange "Featured" badge should appear on the product detail page.',
        price: 14.99,
        priceUnit: '/ sq ft',
        materialType: 'hardwood',
        finish: 'prefinished',
        visibility: 'public',
        isFeatured: true,
        isOnSale: false,
        isBestValue: false,
        isCommercial: false,
        sortOrder: 97,
        tags: ['featured'],
        images: [imageAsset(A.hardwood1)],
        category: ref(CAT.hardwoodPrefinished),
        specs: [
            { _key: 'ft-1', label: 'Test', value: 'Featured badge test' },
        ],
    });

    // TEST: All tags — tests tag filtering
    await client.createOrReplace({
        _id: PROD.allTags,
        _type: 'product',
        title: '[TEST] All Tags — Filter Test',
        slug: slug('test-all-tags-filter'),
        description: 'This product has many tags for testing the tag-based search and filter.',
        price: 7.99,
        priceUnit: '/ sq ft',
        materialType: 'engineered',
        finish: 'prefinished',
        visibility: 'public',
        isFeatured: false,
        isOnSale: false,
        isBestValue: false,
        isCommercial: false,
        sortOrder: 98,
        tags: [
            'waterproof', 'pet-friendly', 'scratch-resistant', 'wide-plank',
            'dark-tone', 'light-tone', 'white-oak', 'radiant-heat', 'basement',
            'commercial', 'residential', 'modern', 'rustic', 'best-value',
        ],
        images: [imageAsset(A.engineered)],
        category: ref(CAT.engineeredPrefinished),
        specs: [
            { _key: 'at-1', label: 'Test', value: 'Tag filter test' },
        ],
    });

    console.log('\n  ✅ All edge case products created');

    // ── SUMMARY ──────────────────────────────────────────────────────────────
    const totalCats = 7 + 6; // top-level + subcategories
    const totalProds = Object.keys(PROD).length;

    console.log('\n' + '─'.repeat(50));
    console.log('🌱 Seed complete!\n');
    console.log(`  Categories : ${totalCats} (7 top-level + 6 subcategories)`);
    console.log(`  Products   : ${totalProds} total\n`);
    console.log('  Test coverage:');
    console.log('  ✅ visibility: public, wholesale, hidden');
    console.log('  ✅ sale price with strikethrough');
    console.log('  ✅ price = 0 → "Contact for price"');
    console.log('  ✅ materialType: hardwood, engineered, luxury-vinyl-plank, laminate, tile, accessories');
    console.log('  ✅ finish: prefinished, unfinished');
    console.log('  ✅ isCommercial: true/false');
    console.log('  ✅ isBestValue: true/false');
    console.log('  ✅ isFeatured: true/false');
    console.log('  ✅ subcategories (2 levels deep)');
    console.log('  ✅ full structured specs (all 25 fields)');
    console.log('  ✅ key-value specs only');
    console.log('  ✅ both specs types combined');
    console.log('  ✅ no specs → single-column layout');
    console.log('  ✅ no image → placeholder SVG');
    console.log('  ✅ tags (search + filter)');
    console.log('  ✅ sortOrder');
    console.log('─'.repeat(50));
}

main().catch((err) => {
    console.error('❌ Seed failed:', err);
    process.exit(1);
});
