import type { MetadataRoute } from "next";
import { client } from "@/lib/sanity/client";
import { SITE_URL } from "@/lib/constants";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Fetch all public content slugs from Sanity with graceful error handling
  type SitemapEntry = { slug: string; _updatedAt: string };
  const results = await Promise.allSettled([
    client.fetch<SitemapEntry[]>(
      `*[_type == "product" && visibility == "public"]{ "slug": slug.current, _updatedAt }`
    ),
    client.fetch<SitemapEntry[]>(
      `*[_type == "category"]{ "slug": slug.current, _updatedAt }`
    ),
    client.fetch<SitemapEntry[]>(
      `*[_type == "page"]{ "slug": slug.current, _updatedAt }`
    ),
  ]);

  const products = results[0].status === "fulfilled" ? results[0].value : [];
  const categories = results[1].status === "fulfilled" ? results[1].value : [];
  const pages = results[2].status === "fulfilled" ? results[2].value : [];

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/products`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/trades`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  // Product pages
  const productPages: MetadataRoute.Sitemap = (products || []).map((p) => ({
    url: `${SITE_URL}/products/${p.slug}`,
    lastModified: new Date(p._updatedAt),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // Category pages
  const categoryPages: MetadataRoute.Sitemap = (categories || []).map((c) => ({
    url: `${SITE_URL}/categories/${c.slug}`,
    lastModified: new Date(c._updatedAt),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // Content pages
  const contentPages: MetadataRoute.Sitemap = (pages || [])
    .filter((p) => p.slug !== "trades") // Avoid duplicate with static trades page
    .map((p) => ({
      url: `${SITE_URL}/pages/${p.slug}`,
      lastModified: new Date(p._updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    }));

  return [...staticPages, ...productPages, ...categoryPages, ...contentPages];
}
