import { describe, it, expect, vi, beforeEach } from "vitest";

const mockFetch = vi.fn();
vi.mock("@/lib/sanity/client", () => ({
  client: {
    fetch: (...args: unknown[]) => mockFetch(...args),
  },
  projectId: "test-project",
  dataset: "production",
  apiVersion: "2026-02-07",
}));

import sitemap from "./sitemap";
import { sanityFetch } from "@/lib/sanity/fetch";

describe("sitemap", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns static pages plus dynamic Sanity content", async () => {
    mockFetch.mockResolvedValueOnce([
      { slug: "oak-flooring", _updatedAt: "2026-01-15T00:00:00Z" },
    ]);
    vi.mocked(sanityFetch)
      .mockResolvedValueOnce([
        {
          _id: "id-about",
          slug: "about",
          parentRef: null,
          _updatedAt: "2026-01-05T00:00:00Z",
        },
      ])
      .mockResolvedValueOnce([{ slug: "hardwood" }]);

    const result = await sitemap();

    // At least static + 1 product + 1 category + 1 content page
    expect(result.length).toBeGreaterThanOrEqual(7);

    // Check static pages exist
    const urls = result.map((r) => r.url);
    expect(urls.some((u) => u.endsWith("/products"))).toBe(true);
    expect(urls.some((u) => u.endsWith("/contact"))).toBe(true);
    expect(urls.some((u) => u.endsWith("/trades"))).toBe(true);

    // Check dynamic pages
    expect(urls.some((u) => u.includes("/products/oak-flooring"))).toBe(true);
    expect(urls.some((u) => u.includes("/categories/hardwood"))).toBe(true);
    expect(urls.some((u) => u.includes("/pages/about"))).toBe(true);
  });

  it("handles empty Sanity responses gracefully", async () => {
    mockFetch.mockResolvedValueOnce(null);
    vi.mocked(sanityFetch).mockResolvedValueOnce(null).mockResolvedValueOnce(null);

    const result = await sitemap();

    // Should still have core static pages when Sanity returns empty/null
    expect(result.length).toBeGreaterThanOrEqual(4);
  });

  it("filters out trades page from content pages to avoid duplicates", async () => {
    mockFetch.mockResolvedValueOnce([]);
    vi.mocked(sanityFetch)
      .mockResolvedValueOnce([
        {
          _id: "id-trades",
          slug: "trades",
          parentRef: null,
          _updatedAt: "2026-01-01T00:00:00Z",
        },
        {
          _id: "id-about",
          slug: "about",
          parentRef: null,
          _updatedAt: "2026-01-01T00:00:00Z",
        },
      ])
      .mockResolvedValueOnce([]);

    const result = await sitemap();

    const urls = result.map((r) => r.url);
    // trades should exist as static page but NOT as /pages/trades
    expect(urls.some((u) => u.endsWith("/trades"))).toBe(true);
    expect(urls.some((u) => u.includes("/pages/trades"))).toBe(false);
  });

  it("sets correct priority levels", async () => {
    mockFetch.mockResolvedValueOnce([
      { slug: "product-1", _updatedAt: "2026-01-01T00:00:00Z" },
    ]);
    vi.mocked(sanityFetch).mockResolvedValueOnce([]).mockResolvedValueOnce([{ slug: "cat-1" }]);

    const result = await sitemap();

    // Home should have highest priority
    const homePage = result.find((r) => r.url && !r.url.includes("/products") && !r.url.includes("/contact") && !r.url.includes("/trades") && !r.url.includes("/categories") && !r.url.includes("/pages"));
    expect(homePage?.priority).toBe(1.0);

    // Products catalog
    const productsPage = result.find((r) => r.url?.endsWith("/products"));
    expect(productsPage?.priority).toBe(0.9);

    // Product detail
    const productDetail = result.find((r) => r.url?.includes("/products/product-1"));
    expect(productDetail?.priority).toBe(0.8);
  });
});
