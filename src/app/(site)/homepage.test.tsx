/**
 * Homepage (Server Component) – Integration tests using @testing-library/react.
 *
 * Because this is an async Server Component, we await the component function
 * to get the JSX, then render it. sanityFetch is mocked globally in test-setup.ts
 * and overridden per-test as needed.
 *
 * All content is CMS-driven — no hardcoded defaults.
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import Home from "./page";
import { sanityFetch } from "@/lib/sanity/fetch";

// Helper: call the async Server Component and render its output
async function renderHome() {
  const jsx = await Home();
  return render(<>{jsx}</>);
}

const fullHomepageData = {
  hero: {
    heading: "Premium Hardwood",
    subheading: "Discover our collection.",
    images: [{ _key: "img1", asset: { _ref: "img-hero", _type: "reference" as const } }],
    ctaLink: "/products",
    ctaText: "Shop Now",
  },
  introHeading: "Welcome to Hardwood Living",
  introBlurb: "Welcome to Hardwoodliving, your premium hardwood destination.",
  categoryHighlights: [
    {
      _id: "cat-1",
      title: "Hardwood Flooring",
      slug: { current: "hardwood-flooring" },
      image: { asset: { _ref: "img-cat1", _type: "reference" as const } },
    },
  ],
  featuredProducts: [
    {
      _id: "p1",
      title: "Oak Flooring",
      slug: { current: "oak-flooring" },
      price: 5.99,
      priceUnit: "/ sq ft",
      images: [{ asset: { _ref: "img-p1", _type: "reference" as const } }],
    },
    {
      _id: "p2",
      title: "Maple Flooring",
      slug: { current: "maple-flooring" },
      price: 7.49,
      images: [],
    },
  ],
  ctaSection: {
    heading: "View Our Products",
    text: "Try our room visualizer.",
    linkText: "View All",
    linkUrl: "/products",
  },
  testimonials: [
    {
      _id: "t1",
      author: "Jane Doe",
      content: "Absolutely beautiful flooring!",
      image: { asset: { _ref: "img-t1", _type: "reference" as const } },
    },
  ],
};

beforeEach(() => {
  vi.mocked(sanityFetch).mockReset();
});

describe("Homepage", () => {
  // ── Full data rendering ──────────────────────────────────────────────

  it("renders all homepage sections when data is available", async () => {
    vi.mocked(sanityFetch)
      .mockResolvedValueOnce(fullHomepageData)  // getHomepageQuery
      .mockResolvedValueOnce({ siteName: "Hardwood Living" }); // getSiteSettingsQuery
    await renderHome();

    // Hero
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Premium Hardwood");
    expect(screen.getByText("Shop Now")).toBeInTheDocument();

    // Intro
    expect(screen.getByText(/Welcome to Hardwoodliving/)).toBeInTheDocument();
    expect(screen.getByText("Welcome to Hardwood Living")).toBeInTheDocument();

    // Category Highlights
    expect(screen.getByText("Hardwood Flooring")).toBeInTheDocument();

    // Featured Products
    expect(screen.getByText("Featured Products")).toBeInTheDocument();
    expect(screen.getByText("Oak Flooring")).toBeInTheDocument();
    expect(screen.getByText("Maple Flooring")).toBeInTheDocument();

    // CTA Section
    expect(screen.getByText("View Our Products")).toBeInTheDocument();

    // Testimonials
    expect(screen.getByText("What Our Customers Say")).toBeInTheDocument();
    expect(screen.getByText("Absolutely beautiful flooring!")).toBeInTheDocument();
  });

  // ── Graceful degradation (no data / fetch error) ─────────────────────

  it("renders gracefully when sanityFetch returns null", async () => {
    vi.mocked(sanityFetch)
      .mockResolvedValueOnce(null)  // getHomepageQuery
      .mockResolvedValueOnce(null); // getSiteSettingsQuery
    await renderHome();

    // No hero, no sections — page renders without error
    expect(screen.queryByText("Featured Products")).not.toBeInTheDocument();
    expect(screen.queryByText("What Our Customers Say")).not.toBeInTheDocument();
  });

  it("renders gracefully when sanityFetch throws an error", async () => {
    vi.mocked(sanityFetch)
      .mockRejectedValueOnce(new Error("Network error"))
      .mockResolvedValueOnce(null);
    await renderHome();

    // Optional sections don't render
    expect(screen.queryByText("Featured Products")).not.toBeInTheDocument();
  });

  // ── Hero section integration ─────────────────────────────────────────

  it("passes CMS hero data to HeroSection", async () => {
    vi.mocked(sanityFetch)
      .mockResolvedValueOnce(fullHomepageData)
      .mockResolvedValueOnce({ siteName: "Hardwood Living" });
    await renderHome();

    const ctaLink = screen.getByText("Shop Now").closest("a");
    expect(ctaLink).toHaveAttribute("href", "/products");
  });

  // ── Featured Products integration ────────────────────────────────────

  it("links featured products to detail pages", async () => {
    vi.mocked(sanityFetch)
      .mockResolvedValueOnce(fullHomepageData)
      .mockResolvedValueOnce({ siteName: "Hardwood Living" });
    await renderHome();

    const links = screen.getAllByRole("link");
    const productLinks = links.filter((l) =>
      l.getAttribute("href")?.startsWith("/products/")
    );
    expect(productLinks).toHaveLength(2);
    expect(productLinks[0]).toHaveAttribute("href", "/products/oak-flooring");
  });

  // ── Partial data rendering ───────────────────────────────────────────

  it("renders only hero and intro when no products or testimonials", async () => {
    vi.mocked(sanityFetch)
      .mockResolvedValueOnce({
        hero: { heading: "Welcome" },
        introBlurb: "Hello world",
      })
      .mockResolvedValueOnce({ siteName: "Hardwood Living" });
    await renderHome();

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Welcome");
    expect(screen.getByText("Hello world")).toBeInTheDocument();
    expect(screen.queryByText("Featured Products")).not.toBeInTheDocument();
    expect(screen.queryByText("What Our Customers Say")).not.toBeInTheDocument();
  });
});
