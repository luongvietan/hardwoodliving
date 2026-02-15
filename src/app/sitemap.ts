import type { MetadataRoute } from "next";
import { client } from "@/lib/sanity/client";
import { SITE_URL } from "@/lib/constants";
import { getAllCategorySlugsQuery, getAllPagesForPathResolutionQuery } from "@/lib/sanity/queries";
import { sanityFetch } from "@/lib/sanity/fetch";
import { getAllPagePathsWithIds, type PageForPath } from "@/lib/page-path";
import {
  COLLECTION_MATERIALS,
  COMMERCIAL_SECTIONS,
  COMMERCIAL_BRANDS,
  CUSTOM_FLOORING_PAGES,
  SERVICE_PAGES,
  WOOD_GUIDE_PAGES,
  GALLERY_SECTIONS,
} from "@/lib/url-structure";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  type SitemapEntry = { slug: string; _updatedAt: string };
  const results = await Promise.allSettled([
    client.fetch<SitemapEntry[]>(
      `*[_type == "product" && visibility == "public"]{ "slug": slug.current, _updatedAt }`
    ),
    sanityFetch<PageForPath[]>({
      query: getAllPagesForPathResolutionQuery,
      tags: ["page"],
    }),
    sanityFetch<{ slug: string }[]>({ query: getAllCategorySlugsQuery, tags: ["category"] }),
  ]);

  const products = results[0].status === "fulfilled" ? results[0].value : [];
  const allPagesForPathRaw = results[1].status === "fulfilled" ? results[1].value : null;
  const allPagesForPath = Array.isArray(allPagesForPathRaw) ? allPagesForPathRaw : [];
  const categoriesRaw = results[2].status === "fulfilled" ? results[2].value : null;
  const categories = Array.isArray(categoriesRaw) ? categoriesRaw : [];

  const now = new Date();

  // Static + structure pages (SEO-optimized hierarchy)
  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${SITE_URL}/collections`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/products`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/commercial`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/custom-flooring`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/services`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/wood-guide`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/gallery`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/trades`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: `${SITE_URL}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
  ];

  // Collections (indexable only)
  const collectionPages: MetadataRoute.Sitemap = COLLECTION_MATERIALS
    .filter((m) => m.indexable)
    .flatMap((m) => {
      const base = { lastModified: now, changeFrequency: "weekly" as const, priority: 0.8 };
      const list = [
        { url: `${SITE_URL}/collections/${m.slug}`, ...base },
        ...m.subtypes.map((s) => ({
          url: `${SITE_URL}/collections/${m.slug}/${s.slug}`,
          ...base,
        })),
      ];
      return list;
    });

  // Commercial
  const commercialPages: MetadataRoute.Sitemap = [
    ...COMMERCIAL_SECTIONS.map((s) => ({
      url: `${SITE_URL}/commercial/${s.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...COMMERCIAL_BRANDS.map((b) => ({
      url: `${SITE_URL}/commercial/brands/${b.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];

  // Custom flooring, services, wood guide, gallery sub-pages
  const subPages: MetadataRoute.Sitemap = [
    ...CUSTOM_FLOORING_PAGES.map((p) => ({
      url: `${SITE_URL}/custom-flooring/${p.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...SERVICE_PAGES.map((p) => ({
      url: `${SITE_URL}/services/${p.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...WOOD_GUIDE_PAGES.map((p) => ({
      url: `${SITE_URL}/wood-guide/${p.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...GALLERY_SECTIONS.map((s) => ({
      url: `${SITE_URL}/gallery/${s.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
  ];

  const productPages: MetadataRoute.Sitemap = (products || []).map((p) => ({
    url: `${SITE_URL}/products/${p.slug}`,
    lastModified: new Date(p._updatedAt),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const categoryPages: MetadataRoute.Sitemap = (categories || []).map((c) => ({
    url: `${SITE_URL}/categories/${c.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const pagePathsWithIds = getAllPagePathsWithIds(allPagesForPath);
  const updatedAtById = new Map(allPagesForPath.map((p) => [p._id, p._updatedAt]));
  const contentPages: MetadataRoute.Sitemap = pagePathsWithIds
    .filter(({ path }) => !(path.length === 1 && path[0] === "trades"))
    .map(({ path, id }) => ({
      url: `${SITE_URL}/pages/${path.join("/")}`,
      lastModified: new Date(updatedAtById.get(id) ?? now),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    }));

  return [
    ...staticPages,
    ...collectionPages,
    ...commercialPages,
    ...subPages,
    ...productPages,
    ...categoryPages,
    ...contentPages,
  ];
}
