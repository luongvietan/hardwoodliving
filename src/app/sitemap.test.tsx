import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the Sanity client directly
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

describe("sitemap", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns static pages plus dynamic Sanity content", async () => {
    mockFetch
      .mockResolvedValueOnce([
        { slug: "oak-flooring", _updatedAt: "2026-01-15T00:00:00Z" },
      ])
      .mockResolvedValueOnce([
        { slug: "hardwood", _updatedAt: "2026-01-10T00:00:00Z" },
      ])
      .mockResolvedValueOnce([
        { slug: "about", _updatedAt: "2026-01-05T00:00:00Z" },
      ]);

    const result = await sitemap();

    // Static pages: home, products, contact, trades
    expect(result.length).toBe(4 + 1 + 1 + 1); // 4 static + 1 product + 1 category + 1 page

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
    mockFetch
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(null);

    const result = await sitemap();

    // Should still have 4 static pages
    expect(result.length).toBe(4);
  });

  it("filters out trades page from content pages to avoid duplicates", async () => {
    mockFetch
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([
        { slug: "trades", _updatedAt: "2026-01-01T00:00:00Z" },
        { slug: "about", _updatedAt: "2026-01-01T00:00:00Z" },
      ]);

    const result = await sitemap();

    const urls = result.map((r) => r.url);
    // trades should exist as static page but NOT as /pages/trades
    expect(urls.some((u) => u.endsWith("/trades"))).toBe(true);
    expect(urls.some((u) => u.includes("/pages/trades"))).toBe(false);
  });

  it("sets correct priority levels", async () => {
    mockFetch
      .mockResolvedValueOnce([
        { slug: "product-1", _updatedAt: "2026-01-01T00:00:00Z" },
      ])
      .mockResolvedValueOnce([
        { slug: "cat-1", _updatedAt: "2026-01-01T00:00:00Z" },
      ])
      .mockResolvedValueOnce([]);

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
