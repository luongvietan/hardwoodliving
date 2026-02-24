# Bulk Import Products

The product schema maps 1-to-1 with the product detail card on the website (title, price, description, images, and all 25 structured specifications). This guide explains every way to add or update products in bulk.

---

## Quick start

```bash
# 1. Copy the template and fill in your data
cp scripts/products-bulk-template.csv scripts/my-products.csv

# 2. Preview — no data is written
npm run import:products -- scripts/my-products.csv --dry-run

# 3. Import for real (you will be asked to confirm)
npm run import:products -- scripts/my-products.csv
```

---

## CSV format

Each row = one product. See **`scripts/products-bulk-template.csv`** for a working example.

### Required columns

| Column | Type | Notes |
|--------|------|-------|
| `title` | string | Product name, max 150 chars |
| `price` | number | Must be ≥ 0 |

### Core columns

| Column | Type | Notes |
|--------|------|-------|
| `slug` | string | URL slug — auto-generated from `title` if blank |
| `description` | string | Short description, max 500 chars |
| `priceUnit` | string | `/ sq ft` · `/ box` · `/ piece` · `/ linear ft` |
| `categoryId` | string | Sanity `_id` of the category (e.g. `category-hardwood`) |
| `visibility` | string | `public` (default) · `wholesale` · `hidden` |
| `isFeatured` | boolean | `true` or `false` (default `false`) |

### Image column

| Column | Format | Example |
|--------|--------|---------|
| `image_urls` | Pipe-separated public URLs | `https://cdn.example.com/img1.jpg\|https://cdn.example.com/img2.jpg` |

- URLs are downloaded and uploaded to Sanity as native assets.
- The **first URL** becomes the primary (hero) image.
- Add as many images as needed — just separate them with `|`.
- Leave blank to skip images and add them later in Studio.
- Supported formats: JPEG, PNG, WebP, AVIF, GIF, TIFF, SVG.

### Specification columns (all optional — leave blank if not applicable)

| Column | Example value |
|--------|--------------|
| `species` | `W. Oak` |
| `width` | `7` |
| `thickness` | `5/8` |
| `length` | `2-7` |
| `prefinished` | `Urethane + Alum. Oxide` |
| `surface` | `Wire Brush` |
| `stain` | `White wash` |
| `color` | `Translucent Grain Wht. Wsh.` |
| `cut` | `Flat` |
| `grade` | `Character (A, B, C, D)` |
| `edge` | `Microbevel` |
| `traffic` | `Medium / High` |
| `application` | `Residential / Commercial` |
| `installation` | `Glue, Nail` |
| `pattern` | `Random` |
| `source` | `N. America` |
| `eco` | `Responsibly Harvested` |
| `jankaRate` | `2300` |
| `radiantHeatRated` | `Yes (conditioned)` |
| `airMoisture` | `40-50%` |
| `trimMoulding` | `Custom as needed` |
| `stock` | `In stock` |
| `deliveryTime` | `3-5 days` |
| `sftPerBox` | `32` |
| `weightPerBox` | `52Lb` |
| `boxDimensions` | `7'x7"` |

---

## Import script options

```
npx tsx scripts/import-products-from-csv.ts <csv-file> [options]
```

| Option | Description |
|--------|-------------|
| _(none)_ | Full import — products + images |
| `--dry-run` | Preview only, nothing is written to Sanity |
| `--skip-images` | Import product data only, skip image uploads |

### Example output

```
📄  CSV loaded: 12 row(s) from "my-products.csv"
🖼   Rows with image_urls: 10
✅  Valid products: 12  |  Skipped: 0

📋  Preview (first 5):
   • [product-white-alaska]  "White Alaska"  $8.5  category: category-hardwood  specs: 25  images: 2  visibility: public
   • [product-dark-walnut]   "Dark Walnut"   $12   category: category-hardwood  specs: 18  images: 1  visibility: public
   …

⚠️   This will createOrReplace 12 product(s) in Sanity (production / abc123) + upload images for 10 product(s).
    Continue? [y/N] y

🚀  Importing 12 product(s)…

  ✅  [1/12]  "White Alaska"
      📷  Uploading 2 image(s) for "White Alaska"…
         ✅  [1/2]  https://cdn.example.com/white-alaska-1.jpg
         ✅  [2/2]  https://cdn.example.com/white-alaska-2.jpg
  ✅  [2/12]  "Dark Walnut"  (1 image(s))
  …

─────────────────────────────────────────
✅  Success: 12   ❌  Failed: 0

🎉  Import complete!
```

---

## Setup

### 1. Get a Sanity write token

1. Go to [sanity.io/manage](https://sanity.io/manage) → your project → **API** → **Tokens**
2. Click **Add API token** → name it `Import Script` → role **Editor** → **Save**
3. Copy the token

### 2. Add to `.env.local`

```env
SANITY_API_WRITE_TOKEN=sk...your-token-here
```

### 3. Ensure categories exist

Categories must exist in Sanity before you reference them in `categoryId`. Create them via Studio or run:

```bash
npm run seed
```

---

## Default category IDs (from seed.ts)

| Category | `categoryId` value |
|----------|--------------------|
| Hardwood Flooring | `category-hardwood` |
| Luxury Vinyl | `category-vinyl` |
| Laminate | `category-laminate` |
| Engineered Hardwood | `category-engineered-hardwood` |
| Waterproof Laminate | `category-waterproof-laminate` |
| Cabinetry | `category-cabinetry` |
| Tile | `category-tile` |
| Carpet Tile | `category-carpet-tile` |

To find the `_id` of a custom category, open Studio → Vision tool and run:

```groq
*[_type == "category"]{ _id, title }
```

---

## Other import methods

### Sanity Studio (manual, one at a time)

Go to `/admin` → **Product** → **New document**. Best for small batches or when you need fine-grained control over each product.

### Extend seed.ts (code-based, for dev/staging)

Add `client.createOrReplace({ _type: 'product', ... })` blocks to `scripts/seed.ts` and run:

```bash
npm run seed
```

Best when product data lives in code and you need to re-seed environments.

---

## Notes

- The script uses `createOrReplace` — re-running the same CSV will **update** existing products (matched by `_id = product-{slug}`).
- Images are uploaded sequentially per product to keep output readable.
- Sanity deduplicates assets by content hash — uploading the same image twice does not create a duplicate asset.
- A failed image upload does **not** abort the product import — the product is saved without that image and a warning is printed.
