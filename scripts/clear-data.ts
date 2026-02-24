/**
 * Script 1: Clear all categories and products from Sanity.
 * Run: npm run clear:data
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

async function deleteAllOfType(type: string): Promise<number> {
    // Fetch all document IDs of this type (including drafts)
    const ids: string[] = await client.fetch(`*[_type == $type]._id`, { type });
    if (ids.length === 0) {
        console.log(`  No ${type} documents found.`);
        return 0;
    }

    // Delete in batches of 50 (Sanity transaction limit)
    const BATCH = 50;
    let deleted = 0;
    for (let i = 0; i < ids.length; i += BATCH) {
        const batch = ids.slice(i, i + BATCH);
        const tx = client.transaction();
        for (const id of batch) {
            tx.delete(id);
            // Also delete draft version if it exists
            tx.delete(`drafts.${id}`);
        }
        await tx.commit({ visibility: 'async' });
        deleted += batch.length;
    }
    return deleted;
}

async function main() {
    console.log('🗑️  Starting data cleanup...\n');

    // Delete products first (they reference categories)
    process.stdout.write('Deleting products... ');
    const products = await deleteAllOfType('product');
    console.log(`✅ ${products} deleted`);

    // Delete categories
    process.stdout.write('Deleting categories... ');
    const categories = await deleteAllOfType('category');
    console.log(`✅ ${categories} deleted`);

    console.log('\n✅ Cleanup complete!');
}

main().catch((err) => {
    console.error('❌ Clear failed:', err);
    process.exit(1);
});
