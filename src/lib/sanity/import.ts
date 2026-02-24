/**
 * Shared product import utilities — used by both the API route (/api/admin/import-products)
 * and the CLI script (scripts/import-products-from-csv.ts).
 *
 * All functions are browser-safe (no Node.js APIs).
 */

// ─── Spec fields (must match product schema) ─────────────────────────────────

export const SPEC_FIELDS = [
  "species",
  "width",
  "thickness",
  "length",
  "prefinished",
  "surface",
  "stain",
  "color",
  "cut",
  "grade",
  "edge",
  "traffic",
  "application",
  "installation",
  "pattern",
  "source",
  "eco",
  "jankaRate",
  "radiantHeatRated",
  "airMoisture",
  "trimMoulding",
  "stock",
  "deliveryTime",
  "sftPerBox",
  "weightPerBox",
  "boxDimensions",
] as const;

export type SpecField = (typeof SPEC_FIELDS)[number];

export const SPEC_FIELD_LABELS: Record<SpecField, string> = {
  species: "Species",
  width: "Width",
  thickness: "Thickness",
  length: "Length",
  prefinished: "Prefinished",
  surface: "Surface",
  stain: "Stain",
  color: "Color",
  cut: "Cut",
  grade: "Grade",
  edge: "Edge",
  traffic: "Traffic",
  application: "Application",
  installation: "Installation",
  pattern: "Pattern",
  source: "Source",
  eco: "Eco",
  jankaRate: "Janka Rate",
  radiantHeatRated: "Radiant Heat Rated",
  airMoisture: "Air Moisture",
  trimMoulding: "Trim & Moulding",
  stock: "Stock",
  deliveryTime: "Delivery Time",
  sftPerBox: "Sft / Box",
  weightPerBox: "Weight / Box",
  boxDimensions: "Box Dimensions",
};

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CsvRow {
  [key: string]: string;
}

export interface SanityImageRef {
  _type: "image";
  _key: string;
  asset: { _type: "reference"; _ref: string };
}

export const MATERIAL_TYPES = [
  { title: "Hardwood", value: "hardwood" },
  { title: "Engineered Hardwood", value: "engineered" },
  { title: "Luxury Vinyl Plank (LVP)", value: "luxury-vinyl-plank" },
  { title: "Laminate", value: "laminate" },
  { title: "Tile", value: "tile" },
  { title: "Carpet Tile", value: "carpet-tile" },
  { title: "Accessories", value: "accessories" },
  { title: "Adhesive", value: "adhesive" },
  { title: "Coatings", value: "coatings" },
  { title: "Lumber", value: "lumber" },
] as const;

export type MaterialType = (typeof MATERIAL_TYPES)[number]["value"];

export const FINISH_TYPES = [
  { title: "Prefinished", value: "prefinished" },
  { title: "Unfinished", value: "unfinished" },
] as const;

export type FinishType = (typeof FINISH_TYPES)[number]["value"];

export interface SanityProduct {
  _id: string;
  _type: "product";
  title: string;
  slug: { _type: "slug"; current: string };
  description?: string;
  price: number;
  salePrice?: number;
  priceUnit?: string;
  specifications?: Partial<Record<SpecField, string>>;
  images?: SanityImageRef[];
  category?: { _type: "reference"; _ref: string };
  materialType?: MaterialType;
  finish?: FinishType;
  isCommercial?: boolean;
  isOnSale?: boolean;
  isBestValue?: boolean;
  tags?: string[];
  sortOrder?: number;
  visibility: "public" | "wholesale" | "hidden";
  isFeatured: boolean;
}

/** A single row in the import table (used by the UI). */
export interface ImportRow {
  id: string; // client-side only, for React keys
  title: string;
  slug: string;
  description: string;
  price: string;
  salePrice: string;
  priceUnit: string;
  categoryId: string;
  materialType: string;
  finish: string;
  isCommercial: boolean;
  isOnSale: boolean;
  isBestValue: boolean;
  tags: string;
  sortOrder: string;
  visibility: "public" | "wholesale" | "hidden";
  isFeatured: boolean;
  /** Pipe-separated image URLs */
  imageUrls: string;
  /** Local files selected by the user — not serialisable, handled separately */
  imageFiles?: File[];
  specs: Partial<Record<SpecField, string>>;
}

export function emptyRow(id: string): ImportRow {
  return {
    id,
    title: "",
    slug: "",
    description: "",
    price: "",
    salePrice: "",
    priceUnit: "/ sq ft",
    categoryId: "",
    materialType: "",
    finish: "",
    isCommercial: false,
    isOnSale: false,
    isBestValue: false,
    tags: "",
    sortOrder: "",
    visibility: "public",
    isFeatured: false,
    imageUrls: "",
    imageFiles: [],
    specs: {},
  };
}

// ─── Slug helper ─────────────────────────────────────────────────────────────

export function toSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 96);
}

// ─── CSV parser (browser-safe) ────────────────────────────────────────────────

/** Parse a single CSV line, handling quoted fields with commas or newlines inside. */
export function parseCsvLine(line: string): string[] {
  const fields: string[] = [];
  let current = "";
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
    } else if (ch === "," && !inQuotes) {
      fields.push(current.trim());
      current = "";
    } else {
      current += ch;
    }
  }
  fields.push(current.trim());
  return fields;
}

/** Parse CSV text into an array of row objects keyed by header name. */
export function parseCsvText(content: string): CsvRow[] {
  const lines = content
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .split("\n");
  const nonEmpty = lines.filter((l) => l.trim().length > 0);
  if (nonEmpty.length < 2) return [];

  const headers = parseCsvLine(nonEmpty[0]);
  return nonEmpty.slice(1).map((line) => {
    const values = parseCsvLine(line);
    const row: CsvRow = {};
    headers.forEach((h, i) => {
      row[h.trim()] = (values[i] ?? "").trim();
    });
    return row;
  });
}

/** Convert a parsed CSV row into an ImportRow for the UI table. */
export function csvRowToImportRow(row: CsvRow, index: number): ImportRow {
  const specs: Partial<Record<SpecField, string>> = {};
  for (const field of SPEC_FIELDS) {
    const val = row[field]?.trim();
    if (val) specs[field] = val;
  }

  const rawVisibility = row.visibility?.trim();
  const visibility: "public" | "wholesale" | "hidden" = (
    ["public", "wholesale", "hidden"] as const
  ).includes(rawVisibility as "public" | "wholesale" | "hidden")
    ? (rawVisibility as "public" | "wholesale" | "hidden")
    : "public";

  return {
    id: `csv-${index}-${Date.now()}`,
    title: row.title?.trim() ?? "",
    slug: row.slug?.trim() ?? "",
    description: row.description?.trim() ?? "",
    price: row.price?.trim() ?? "",
    salePrice: row.salePrice?.trim() ?? "",
    priceUnit: row.priceUnit?.trim() || "/ sq ft",
    categoryId: row.categoryId?.trim() ?? "",
    materialType: row.materialType?.trim() ?? "",
    finish: row.finish?.trim() ?? "",
    isCommercial: row.isCommercial?.toLowerCase() === "true",
    isOnSale: row.isOnSale?.toLowerCase() === "true",
    isBestValue: row.isBestValue?.toLowerCase() === "true",
    tags: row.tags?.trim() ?? "",
    sortOrder: row.sortOrder?.trim() ?? "",
    visibility,
    isFeatured: row.isFeatured?.toLowerCase() === "true",
    imageUrls: row.image_urls?.trim() ?? "",
    imageFiles: [],
    specs,
  };
}

// ─── Row → Sanity document ────────────────────────────────────────────────────

/**
 * Convert an ImportRow + resolved image refs into a Sanity product document.
 * Returns null if the row is invalid (missing title or bad price).
 */
export function rowToSanityDoc(
  row: ImportRow,
  imageRefs: SanityImageRef[]
): SanityProduct | null {
  const title = row.title.trim();
  if (!title) return null;

  const price = parseFloat(row.price);
  if (isNaN(price) || price < 0) return null;

  const slugValue = row.slug.trim() || toSlug(title);

  const hasSpecs = Object.values(row.specs).some((v) => v?.trim());

  const visibility: "public" | "wholesale" | "hidden" = (
    ["public", "wholesale", "hidden"] as const
  ).includes(row.visibility)
    ? row.visibility
    : "public";

  const doc: SanityProduct = {
    _id: `product-${slugValue}`,
    _type: "product",
    title,
    slug: { _type: "slug", current: slugValue },
    price,
    visibility,
    isFeatured: row.isFeatured,
  };

  if (row.description.trim()) doc.description = row.description.trim();
  if (row.priceUnit.trim()) doc.priceUnit = row.priceUnit.trim();

  // Filter fields
  const validMaterialTypes = MATERIAL_TYPES.map((m) => m.value) as string[];
  if (row.materialType?.trim() && validMaterialTypes.includes(row.materialType.trim())) {
    doc.materialType = row.materialType.trim() as MaterialType;
  }
  const validFinishes = FINISH_TYPES.map((f) => f.value) as string[];
  if (row.finish?.trim() && validFinishes.includes(row.finish.trim())) {
    doc.finish = row.finish.trim() as FinishType;
  }
  if (row.isCommercial) doc.isCommercial = true;
  if (row.isOnSale) {
    doc.isOnSale = true;
    const sp = parseFloat(row.salePrice);
    if (!isNaN(sp) && sp >= 0) doc.salePrice = sp;
  }
  if (row.isBestValue) doc.isBestValue = true;
  const tagList = row.tags
    ?.split(",")
    .map((t) => t.trim())
    .filter(Boolean);
  if (tagList && tagList.length > 0) doc.tags = tagList;
  const sortNum = parseInt(row.sortOrder ?? "", 10);
  if (!isNaN(sortNum)) doc.sortOrder = sortNum;

  if (hasSpecs) {
    const specs: Partial<Record<SpecField, string>> = {};
    for (const field of SPEC_FIELDS) {
      const val = row.specs[field]?.trim();
      if (val) specs[field] = val;
    }
    doc.specifications = specs;
  }
  if (imageRefs.length > 0) doc.images = imageRefs;
  if (row.categoryId.trim()) {
    doc.category = { _type: "reference", _ref: row.categoryId.trim() };
  }

  return doc;
}

// ─── Validation ───────────────────────────────────────────────────────────────

export interface RowValidationError {
  field: "title" | "price";
  message: string;
}

export function validateRow(row: ImportRow): RowValidationError[] {
  const errors: RowValidationError[] = [];
  if (!row.title.trim()) {
    errors.push({ field: "title", message: "Title is required" });
  }
  const price = parseFloat(row.price);
  if (!row.price.trim() || isNaN(price) || price < 0) {
    errors.push({ field: "price", message: "Valid price is required" });
  }
  return errors;
}
