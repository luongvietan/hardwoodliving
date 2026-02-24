/**
 * Bulk import products from CSV into Sanity.
 *
 * Usage:
 *   npx tsx scripts/import-products-from-csv.ts <path-to-csv> [--dry-run] [--skip-images]
 *
 * Examples:
 *   npx tsx scripts/import-products-from-csv.ts scripts/products-bulk-template.csv --dry-run
 *   npx tsx scripts/import-products-from-csv.ts my-products.csv
 *   npx tsx scripts/import-products-from-csv.ts my-products.csv --skip-images
 *
 * Requirements:
 *   - SANITY_API_WRITE_TOKEN in .env.local  (Editor role or above)
 *   - NEXT_PUBLIC_SANITY_PROJECT_ID in .env.local
 *   - NEXT_PUBLIC_SANITY_DATASET in .env.local
 *   - Categories must already exist in Sanity (create via Studio or seed.ts)
 *
 * CSV columns (see scripts/products-bulk-template.csv for the full example):
 *   title, slug, description, price, priceUnit, categoryId,
 *   species, width, thickness, length, prefinished, surface, stain, color,
 *   cut, grade, edge, traffic, application, installation, pattern, source,
 *   eco, jankaRate, radiantHeatRated, airMoisture, trimMoulding, stock,
 *   deliveryTime, sftPerBox, weightPerBox, boxDimensions,
 *   visibility, isFeatured,
 *   image_urls   ← pipe-separated list of public image URLs, e.g.:
 *                   https://example.com/img1.jpg|https://example.com/img2.jpg
 *
 * Image upload notes:
 *   - Each URL is downloaded and uploaded to Sanity as a native asset.
 *   - Supported formats: JPEG, PNG, WebP, AVIF, GIF, TIFF, SVG.
 *   - Images are uploaded in order; the first URL becomes the primary image.
 *   - Already-uploaded assets are reused if the same URL is imported again
 *     (Sanity deduplicates by content hash).
 *   - Use --skip-images to import product data only and add images later in Studio.
 */

import { createClient } from 'next-sanity';
import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';
import * as https from 'https';
import * as http from 'http';
import * as dotenv from 'dotenv';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// ─── Config ──────────────────────────────────────────────────────────────────

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!projectId || !dataset || !token) {
    console.error(
        '❌  Missing env vars. Check .env.local for:\n' +
        '    NEXT_PUBLIC_SANITY_PROJECT_ID\n' +
        '    NEXT_PUBLIC_SANITY_DATASET\n' +
        '    SANITY_API_WRITE_TOKEN'
    );
    process.exit(1);
}

const client = createClient({
    projectId,
    dataset,
    apiVersion: '2024-02-07',
    token,
    useCdn: false,
});

// ─── Spec field names (must match product schema) ────────────────────────────

const SPEC_FIELDS = [
    'species', 'width', 'thickness', 'length', 'prefinished', 'surface',
    'stain', 'color', 'cut', 'grade', 'edge', 'traffic', 'application',
    'installation', 'pattern', 'source', 'eco', 'jankaRate', 'radiantHeatRated',
    'airMoisture', 'trimMoulding', 'stock', 'deliveryTime', 'sftPerBox',
    'weightPerBox', 'boxDimensions',
] as const;

type SpecField = typeof SPEC_FIELDS[number];

// ─── CSV parsing ─────────────────────────────────────────────────────────────

/** Parse a single CSV line, handling quoted fields (including commas inside quotes). */
function parseCsvLine(line: string): string[] {
    const fields: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
        const ch = line[i];
        if (ch === '"') {
            if (inQuotes && line[i + 1] === '"') {
                current += '"';
                i++;
            } else {
                inQuotes = !inQuotes;
            }
        } else if (ch === ',' && !inQuotes) {
            fields.push(current.trim());
            current = '';
        } else {
            current += ch;
        }
    }
    fields.push(current.trim());
    return fields;
}

interface CsvRow {
    [key: string]: string;
}

function parseCsv(content: string): CsvRow[] {
    const lines = content.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n');
    const nonEmpty = lines.filter((l) => l.trim().length > 0);
    if (nonEmpty.length < 2) return [];

    const headers = parseCsvLine(nonEmpty[0]);
    return nonEmpty.slice(1).map((line) => {
        const values = parseCsvLine(line);
        const row: CsvRow = {};
        headers.forEach((h, i) => {
            row[h.trim()] = (values[i] ?? '').trim();
        });
        return row;
    });
}

// ─── Slug helper ─────────────────────────────────────────────────────────────

function toSlug(text: string): string {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .slice(0, 96);
}

// ─── Image upload ─────────────────────────────────────────────────────────────

/** Download a remote URL into a Buffer. Follows up to 5 redirects. */
function fetchBuffer(url: string, redirectsLeft = 5): Promise<{ buffer: Buffer; contentType: string }> {
    return new Promise((resolve, reject) => {
        const lib = url.startsWith('https') ? https : http;
        lib.get(url, (res) => {
            if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
                if (redirectsLeft === 0) return reject(new Error(`Too many redirects for ${url}`));
                return resolve(fetchBuffer(res.headers.location, redirectsLeft - 1));
            }
            if (res.statusCode !== 200) {
                return reject(new Error(`HTTP ${res.statusCode} for ${url}`));
            }
            const chunks: Buffer[] = [];
            res.on('data', (chunk: Buffer) => chunks.push(chunk));
            res.on('end', () =>
                resolve({
                    buffer: Buffer.concat(chunks),
                    contentType: res.headers['content-type'] ?? 'image/jpeg',
                })
            );
            res.on('error', reject);
        }).on('error', reject);
    });
}

/** Derive a filename from a URL for the Sanity asset label. */
function filenameFromUrl(url: string): string {
    try {
        const { pathname } = new URL(url);
        const base = pathname.split('/').pop() ?? 'image';
        return base.split('?')[0] || 'image';
    } catch {
        return 'image';
    }
}

interface SanityImageRef {
    _type: 'image';
    _key: string;
    asset: { _type: 'reference'; _ref: string };
    hotspot?: boolean;
}

/**
 * Upload a single image URL to Sanity and return an image reference object.
 * Returns null on failure (error is logged, import continues).
 */
async function uploadImageUrl(url: string, key: string): Promise<SanityImageRef | null> {
    try {
        const { buffer, contentType } = await fetchBuffer(url);
        const filename = filenameFromUrl(url);
        const asset = await client.assets.upload('image', buffer, {
            filename,
            contentType,
        });
        return {
            _type: 'image',
            _key: key,
            asset: { _type: 'reference', _ref: asset._id },
        };
    } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        console.warn(`      ⚠️  Failed to upload image "${url}": ${msg}`);
        return null;
    }
}

/**
 * Upload all image URLs for a product row.
 * image_urls column is pipe-separated: url1|url2|url3
 */
async function uploadProductImages(
    rawUrls: string,
    productTitle: string
): Promise<SanityImageRef[]> {
    const urls = rawUrls
        .split('|')
        .map((u) => u.trim())
        .filter((u) => u.startsWith('http'));

    if (urls.length === 0) return [];

    console.log(`      📷  Uploading ${urls.length} image(s) for "${productTitle}"…`);
    const results: SanityImageRef[] = [];

    for (let i = 0; i < urls.length; i++) {
        const ref = await uploadImageUrl(urls[i], `img-${i}`);
        if (ref) {
            results.push(ref);
            console.log(`         ✅  [${i + 1}/${urls.length}]  ${urls[i]}`);
        }
    }

    return results;
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface SanityProduct {
    _id: string;
    _type: 'product';
    title: string;
    slug: { _type: 'slug'; current: string };
    description?: string;
    price: number;
    priceUnit?: string;
    specifications?: Partial<Record<SpecField, string>>;
    images?: SanityImageRef[];
    category?: { _type: 'reference'; _ref: string };
    visibility: 'public' | 'wholesale' | 'hidden';
    isFeatured: boolean;
}

// ─── Row → Sanity document ───────────────────────────────────────────────────

function rowToDocument(row: CsvRow, index: number): SanityProduct | null {
    const title = row.title?.trim();
    if (!title) {
        console.warn(`  ⚠️  Row ${index + 2}: missing "title" — skipped.`);
        return null;
    }

    const slugValue = row.slug?.trim() || toSlug(title);
    const price = parseFloat(row.price);
    if (isNaN(price) || price < 0) {
        console.warn(`  ⚠️  Row ${index + 2} ("${title}"): invalid price "${row.price}" — skipped.`);
        return null;
    }

    const specifications: Partial<Record<SpecField, string>> = {};
    let hasSpecs = false;
    for (const field of SPEC_FIELDS) {
        const val = row[field]?.trim();
        if (val) {
            specifications[field] = val;
            hasSpecs = true;
        }
    }

    const visibility = (['public', 'wholesale', 'hidden'] as const).includes(
        row.visibility as 'public' | 'wholesale' | 'hidden'
    )
        ? (row.visibility as 'public' | 'wholesale' | 'hidden')
        : 'public';

    const doc: SanityProduct = {
        _id: `product-${slugValue}`,
        _type: 'product',
        title,
        slug: { _type: 'slug', current: slugValue },
        price,
        visibility,
        isFeatured: row.isFeatured?.toLowerCase() === 'true',
    };

    if (row.description?.trim()) doc.description = row.description.trim();
    if (row.priceUnit?.trim()) doc.priceUnit = row.priceUnit.trim();
    if (hasSpecs) doc.specifications = specifications;
    if (row.categoryId?.trim()) {
        doc.category = { _type: 'reference', _ref: row.categoryId.trim() };
    }

    return doc;
}

// ─── Interactive confirmation ─────────────────────────────────────────────────

async function confirm(question: string): Promise<boolean> {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            rl.close();
            resolve(answer.toLowerCase().startsWith('y'));
        });
    });
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
    const args = process.argv.slice(2);
    const csvPath = args.find((a) => !a.startsWith('--'));
    const isDryRun = args.includes('--dry-run');
    const skipImages = args.includes('--skip-images');

    if (!csvPath) {
        console.error(
            'Usage: npx tsx scripts/import-products-from-csv.ts <path-to-csv> [--dry-run] [--skip-images]'
        );
        process.exit(1);
    }

    const resolvedPath = path.resolve(process.cwd(), csvPath);
    if (!fs.existsSync(resolvedPath)) {
        console.error(`❌  File not found: ${resolvedPath}`);
        process.exit(1);
    }

    const content = fs.readFileSync(resolvedPath, 'utf-8');
    const rows = parseCsv(content);

    if (rows.length === 0) {
        console.error('❌  CSV is empty or has no data rows.');
        process.exit(1);
    }

    console.log(`\n📄  CSV loaded: ${rows.length} row(s) from "${path.basename(csvPath)}"`);

    // Count rows with images
    const rowsWithImages = rows.filter((r) =>
        r.image_urls?.split('|').some((u) => u.trim().startsWith('http'))
    );
    if (rowsWithImages.length > 0 && !skipImages) {
        console.log(`🖼   Rows with image_urls: ${rowsWithImages.length}`);
    }

    // Parse all rows into documents
    const parsed: { doc: SanityProduct; imageUrls: string }[] = [];
    rows.forEach((row, i) => {
        const doc = rowToDocument(row, i);
        if (doc) parsed.push({ doc, imageUrls: row.image_urls ?? '' });
    });

    const skipped = rows.length - parsed.length;
    console.log(`✅  Valid products: ${parsed.length}  |  Skipped: ${skipped}`);

    if (parsed.length === 0) {
        console.log('Nothing to import.');
        process.exit(0);
    }

    // Preview
    console.log('\n📋  Preview (first 5):');
    parsed.slice(0, 5).forEach(({ doc, imageUrls }) => {
        const specCount = doc.specifications ? Object.keys(doc.specifications).length : 0;
        const imgCount = imageUrls
            ? imageUrls.split('|').filter((u) => u.trim().startsWith('http')).length
            : 0;
        console.log(
            `   • [${doc._id}]  "${doc.title}"  $${doc.price}  ` +
            `category: ${doc.category?._ref ?? '(none)'}  specs: ${specCount}  ` +
            `images: ${imgCount}  visibility: ${doc.visibility}`
        );
    });
    if (parsed.length > 5) {
        console.log(`   … and ${parsed.length - 5} more.`);
    }

    if (isDryRun) {
        console.log('\n🔍  Dry run — no changes written to Sanity.');
        return;
    }

    const imageNote = skipImages
        ? ' (images will be skipped)'
        : rowsWithImages.length > 0
            ? ` + upload images for ${rowsWithImages.length} product(s)`
            : '';

    const ok = await confirm(
        `\n⚠️   This will createOrReplace ${parsed.length} product(s) in Sanity ` +
        `(${dataset} / ${projectId})${imageNote}.\n    Continue? [y/N] `
    );

    if (!ok) {
        console.log('Aborted.');
        process.exit(0);
    }

    // Import — sequential to keep console output readable and avoid rate limits
    let success = 0;
    let failed = 0;

    console.log(`\n🚀  Importing ${parsed.length} product(s)…\n`);

    for (let i = 0; i < parsed.length; i++) {
        const { doc, imageUrls } = parsed[i];
        const label = `[${i + 1}/${parsed.length}]  "${doc.title}"`;

        try {
            // Upload images before writing the document
            if (!skipImages && imageUrls) {
                const images = await uploadProductImages(imageUrls, doc.title);
                if (images.length > 0) doc.images = images;
            }

            await client.createOrReplace(doc);
            const imgSuffix = doc.images?.length ? `  (${doc.images.length} image(s))` : '';
            console.log(`  ✅  ${label}${imgSuffix}`);
            success++;
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : String(err);
            console.error(`  ❌  ${label}: ${msg}`);
            failed++;
        }
    }

    console.log(`\n─────────────────────────────────────────`);
    console.log(`✅  Success: ${success}   ❌  Failed: ${failed}`);

    if (failed > 0) {
        console.log('   Review errors above — failed rows were not imported.');
        process.exit(1);
    }

    const imageReminder = skipImages || rowsWithImages.length === 0
        ? '\n   Tip: add image URLs to the image_urls column and re-run to attach images.'
        : '';
    console.log(`\n🎉  Import complete!${imageReminder}`);
}

main().catch((err) => {
    console.error('Fatal error:', err);
    process.exit(1);
});
