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
}));
