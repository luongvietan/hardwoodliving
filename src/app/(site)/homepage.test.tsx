/**
 * Homepage (Server Component) – Integration tests using @testing-library/react.
 *
 * Because this is an async Server Component, we await the component function
 * to get the JSX, then render it. sanityFetch is mocked globally in test-setup.ts
 * and overridden per-test as needed.
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
    image: { asset: { _ref: "img-hero", _type: "reference" as const } },
    ctaLink: "/products",
    ctaText: "Shop Now",
  },
  introBlurb: "Welcome to Hardwoodliving, your premium hardwood destination.",
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
    vi.mocked(sanityFetch).mockResolvedValueOnce(fullHomepageData);
    await renderHome();

    // Hero
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Premium Hardwood");
    expect(screen.getByText("Shop Now")).toBeInTheDocument();

    // Intro
    expect(screen.getByText(/Welcome to Hardwoodliving/)).toBeInTheDocument();

    // Featured Products
    expect(screen.getByText("Featured Products")).toBeInTheDocument();
    expect(screen.getByText("Oak Flooring")).toBeInTheDocument();
    expect(screen.getByText("Maple Flooring")).toBeInTheDocument();

    // Testimonials
    expect(screen.getByText("What Our Clients Say")).toBeInTheDocument();
    expect(screen.getByText("Absolutely beautiful flooring!")).toBeInTheDocument();
  });

  // ── Graceful degradation (no data / fetch error) ─────────────────────

  it("renders with defaults when sanityFetch returns null", async () => {
    vi.mocked(sanityFetch).mockResolvedValueOnce(null);
    await renderHome();

    // Hero still renders with defaults
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Premium Hardwood");
    expect(screen.getByText("Browse Flooring")).toBeInTheDocument();

    // Optional sections don't render
    expect(screen.queryByText("Featured Products")).not.toBeInTheDocument();
    expect(screen.queryByText("What Our Clients Say")).not.toBeInTheDocument();
  });

  it("renders with defaults when sanityFetch throws an error", async () => {
    vi.mocked(sanityFetch).mockRejectedValueOnce(new Error("Network error"));
    await renderHome();

    // Hero still renders with defaults
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Premium Hardwood");

    // Optional sections don't render
    expect(screen.queryByText("Featured Products")).not.toBeInTheDocument();
  });

  // ── Hero section integration ─────────────────────────────────────────

  it("passes CMS hero data to HeroSection", async () => {
    vi.mocked(sanityFetch).mockResolvedValueOnce(fullHomepageData);
    await renderHome();

    const ctaLink = screen.getByText("Shop Now").closest("a");
    expect(ctaLink).toHaveAttribute("href", "/products");
  });

  it("renders hero image when hero has image asset", async () => {
    vi.mocked(sanityFetch).mockResolvedValueOnce(fullHomepageData);
    await renderHome();

    // The hero image is rendered via urlFor mock
    const heroImg = screen.getByRole("presentation");
    expect(heroImg).toHaveAttribute("src", "https://cdn.sanity.io/mock-image.jpg");
  });

  // ── Featured Products integration ────────────────────────────────────

  it("links featured products to detail pages", async () => {
    vi.mocked(sanityFetch).mockResolvedValueOnce(fullHomepageData);
    await renderHome();

    const links = screen.getAllByRole("link");
    const productLinks = links.filter((l) =>
      l.getAttribute("href")?.startsWith("/products/")
    );
    expect(productLinks).toHaveLength(2);
    expect(productLinks[0]).toHaveAttribute("href", "/products/oak-flooring");
  });

  it("passes priceUnit to featured product cards", async () => {
    vi.mocked(sanityFetch).mockResolvedValueOnce(fullHomepageData);
    await renderHome();

    const sqftElements = screen.getAllByText(/\/ sq ft/);
    expect(sqftElements.length).toBeGreaterThanOrEqual(1);
  });

  // ── Testimonials integration ─────────────────────────────────────────

  it("renders testimonial author and content", async () => {
    vi.mocked(sanityFetch).mockResolvedValueOnce(fullHomepageData);
    await renderHome();

    expect(screen.getByText("Jane Doe")).toBeInTheDocument();
    expect(screen.getByText("Absolutely beautiful flooring!")).toBeInTheDocument();
  });

  // ── Partial data rendering ───────────────────────────────────────────

  it("renders only hero and intro when no products or testimonials", async () => {
    vi.mocked(sanityFetch).mockResolvedValueOnce({
      hero: { heading: "Welcome" },
      introBlurb: "Hello world",
    });
    await renderHome();

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Welcome");
    expect(screen.getByText("Hello world")).toBeInTheDocument();
    expect(screen.queryByText("Featured Products")).not.toBeInTheDocument();
    expect(screen.queryByText("What Our Clients Say")).not.toBeInTheDocument();
  });
});
