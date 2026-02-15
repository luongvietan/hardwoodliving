/**
 * SEO-optimized URL structure config.
 * Maps collection/commercial paths to Sanity category slugs and metadata.
 */

export const COLLECTION_MATERIALS = [
  {
    slug: "hardwood",
    title: "Hardwood",
    description: "Timeless elegance with authentic natural wood floors.",
    categorySlug: "hardwood-flooring",
    subtypes: [
      { slug: "unfinished", title: "Unfinished" },
      { slug: "prefinished", title: "Prefinished" },
    ],
    indexable: true,
  },
  {
    slug: "engineered",
    title: "Engineered",
    description: "Real hardwood beauty with added stability for modern homes.",
    categorySlug: "engineered-hardwood",
    subtypes: [
      { slug: "unfinished", title: "Unfinished" },
      { slug: "prefinished", title: "Prefinished" },
    ],
    indexable: true,
  },
  {
    slug: "luxury-vinyl-plank",
    alias: "lvp",
    title: "Luxury Vinyl Plank",
    description: "Waterproof, stylish flooring for busy homes and pets.",
    categorySlug: "luxury-vinyl",
    subtypes: [
      { slug: "spc", title: "SPC" },
      { slug: "wpc", title: "WPC" },
    ],
    indexable: true,
  },
  {
    slug: "laminate",
    title: "Laminate",
    description: "The look of hardwood at a budget-friendly price.",
    categorySlug: "laminate",
    subtypes: [],
    indexable: true,
  },
  {
    slug: "tile",
    title: "Tile",
    description: "Durable tile flooring for any space.",
    categorySlug: "tile",
    subtypes: [],
    indexable: false, // hidden initially
  },
  {
    slug: "carpet-tile",
    title: "Carpet Tile",
    description: "Modular carpet solutions for commercial and residential.",
    categorySlug: "carpet-tile",
    subtypes: [],
    indexable: false, // hidden initially
  },
] as const;

export const COMMERCIAL_SECTIONS = [
  { slug: "vinyl", title: "Vinyl" },
  { slug: "specialty", title: "Specialty" },
  { slug: "brands", title: "Brands" },
] as const;

export const COMMERCIAL_BRANDS = [
  { slug: "harbinger", title: "Harbinger" },
  { slug: "dynoflex", title: "Dynoflex" },
  { slug: "acoustiguard", title: "Acoustiguard" },
  { slug: "acrylic-infused", title: "Acrylic Infused" },
] as const;

export const CUSTOM_FLOORING_PAGES = [
  { slug: "custom-engineered", title: "Custom Engineered" },
  { slug: "custom-stain", title: "Custom Stain" },
  { slug: "custom-dimensions", title: "Custom Dimensions" },
] as const;

export const SERVICE_PAGES = [
  { slug: "installation", title: "Installation" },
  { slug: "sanding-finishing", title: "Sanding & Finishing" },
  { slug: "maintenance", title: "Maintenance" },
] as const;

export const WOOD_GUIDE_PAGES = [
  { slug: "lumber-cuts", title: "Lumber Cuts" },
  { slug: "flooring-grades", title: "Flooring Grades" },
  { slug: "how-to-choose-flooring", title: "How to Choose Flooring" },
  { slug: "floor-maintenance-guide", title: "Floor Maintenance Guide" },
] as const;

export const GALLERY_SECTIONS = [
  { slug: "residential", title: "Residential" },
  { slug: "commercial", title: "Commercial" },
] as const;

type CollectionMaterial = (typeof COLLECTION_MATERIALS)[number];

export function getCollectionMaterial(slug: string): CollectionMaterial | undefined {
  return COLLECTION_MATERIALS.find(
    (m) => m.slug === slug || ("alias" in m && m.alias === slug)
  );
}

export function isValidCollectionSubtype(
  materialSlug: string,
  subtypeSlug: string
): boolean {
  const material = getCollectionMaterial(materialSlug);
  if (!material) return false;
  return material.subtypes.some((s) => s.slug === subtypeSlug);
}
