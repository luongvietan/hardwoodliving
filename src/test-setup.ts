import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";
import { createElement, type ImgHTMLAttributes, type AnchorHTMLAttributes, type ReactNode } from "react";

// ---------------------------------------------------------------------------
// Mock: next/image -> renders a plain <img> with src, alt, and data attributes
// ---------------------------------------------------------------------------
vi.mock("next/image", () => ({
  default: (props: ImgHTMLAttributes<HTMLImageElement> & Record<string, unknown>) => {
    // Strip Next.js-specific props that aren't valid HTML attributes
    const { fill, priority, sizes, quality, loader, placeholder, blurDataURL, ...htmlProps } = props as Record<string, unknown>;
    return createElement("img", {
      ...htmlProps,
      "data-testid": "next-image",
    });
  },
}));

// ---------------------------------------------------------------------------
// Mock: next/link -> renders a plain <a> with href and children
// ---------------------------------------------------------------------------
vi.mock("next/link", () => ({
  default: ({ children, href, ...props }: AnchorHTMLAttributes<HTMLAnchorElement> & { children?: ReactNode }) => {
    return createElement("a", { href, ...props }, children);
  },
}));

// ---------------------------------------------------------------------------
// Mock: next/navigation -> usePathname, useRouter, useSearchParams
// ---------------------------------------------------------------------------
vi.mock("next/navigation", () => ({
  usePathname: () => "/",
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    prefetch: vi.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
  notFound: () => {
    throw new Error("NEXT_NOT_FOUND");
  },
  redirect: (url: string) => {
    throw new Error(`NEXT_REDIRECT:${url}`);
  },
}));

// ---------------------------------------------------------------------------
// Mock: @/lib/sanity/image -> urlFor returns a chainable builder
// ---------------------------------------------------------------------------
vi.mock("@/lib/sanity/image", () => {
  const builder = {
    width: () => builder,
    height: () => builder,
    auto: () => builder,
    url: () => "https://cdn.sanity.io/mock-image.jpg",
  };
  return { urlFor: () => builder };
});

// ---------------------------------------------------------------------------
// Mock: @/lib/sanity/fetch -> sanityFetch returns null by default
// (individual tests can override with vi.mocked)
// ---------------------------------------------------------------------------
vi.mock("@/lib/sanity/fetch", () => ({
  sanityFetch: vi.fn().mockResolvedValue(null),
}));

// ---------------------------------------------------------------------------
// Mock: @/lib/sanity/queries -> export query strings
// ---------------------------------------------------------------------------
vi.mock("@/lib/sanity/queries", () => ({
  getHomepageQuery: 'mock-homepage-query',
  getProductsQuery: 'mock-products-query',
  getFeaturedProductsQuery: 'mock-featured-query',
  getPageQuery: 'mock-page-query',
  getAllPageSlugsQuery: 'mock-all-page-slugs-query',
  getAllCategoriesQuery: 'mock-all-categories-query',
  getTopLevelCategoriesQuery: 'mock-top-level-categories-query',
  getSubcategoriesByParentSlugQuery: 'mock-subcategories-by-parent-query',
  getCategoryBySlugQuery: 'mock-category-by-slug-query',
  getProductsByCategorySlugQuery: 'mock-products-by-category-slug-query',
  getAllCategorySlugsQuery: 'mock-all-category-slugs-query',
  getAllProductSlugsQuery: 'mock-all-product-slugs-query',
  getPublicProductSlugsQuery: 'mock-public-product-slugs-query',
  getProductBySlugQuery: 'mock-product-by-slug-query',
  getVisibleProductsByCategoryAndTypeQuery: 'mock-visible-products-by-category-type-query',
  getVisibleProductsQuery: 'mock-visible-products-query',
  getVisibleProductBySlugQuery: 'mock-visible-product-by-slug-query',
  getVisibleProductsByCategoryQuery: 'mock-visible-products-by-category-query',
  getTradesPageQuery: 'mock-trades-page-query',
}));

// ---------------------------------------------------------------------------
// Mock: @/lib/sanity/visibility -> default to public role
// ---------------------------------------------------------------------------
vi.mock("@/lib/sanity/visibility", () => ({
  getVisibilityOptions: (role: string) =>
    role === "trade" ? ["public", "wholesale"] : ["public"],
  getUserRole: vi.fn().mockResolvedValue("public"),
}));
