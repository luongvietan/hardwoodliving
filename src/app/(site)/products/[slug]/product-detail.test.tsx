/**
 * Product Detail Page (Server Component) – Integration tests.
 *
 * Renders /products/[slug] page with product details, specs, and price.
 * sanityFetch is mocked globally in test-setup.ts and overridden per-test.
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import ProductPage from "./page";
import { sanityFetch } from "@/lib/sanity/fetch";

async function renderProductPage(slug = "oak-plank") {
  const jsx = await ProductPage({ params: Promise.resolve({ slug }) });
  return render(<>{jsx}</>);
}

const fullProduct = {
  _id: "prod-1",
  title: "Premium Oak Plank",
  slug: { current: "oak-plank" },
  description: "Beautiful solid oak hardwood flooring with a natural finish.",
  specs: [
    { _key: "s1", label: "Species", value: "Red Oak" },
    { _key: "s2", label: "Thickness", value: '3/4"' },
    { _key: "s3", label: "Width", value: '5"' },
  ],
  price: 8.99,
  priceUnit: "/ sq ft",
  images: [
    { _key: "img1", asset: { _ref: "image-main", _type: "reference" as const } },
    { _key: "img2", asset: { _ref: "image-thumb1", _type: "reference" as const } },
  ],
  category: {
    _id: "cat-1",
    title: "Hardwood Flooring",
    slug: { current: "hardwood-flooring" },
  },
  visibility: "public",
  isFeatured: true,
};

beforeEach(() => {
  vi.mocked(sanityFetch).mockReset();
});

describe("Product Detail Page", () => {
  // ── Full data rendering ──────────────────────────────────────────────

  it("renders product title as h1", async () => {
    vi.mocked(sanityFetch).mockResolvedValueOnce(fullProduct);
    await renderProductPage();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Premium Oak Plank");
  });

  it("renders product description", async () => {
    vi.mocked(sanityFetch).mockResolvedValueOnce(fullProduct);
    await renderProductPage();
    expect(screen.getByText(/Beautiful solid oak/)).toBeInTheDocument();
  });

  it("renders product price via ProductPrice component", async () => {
    vi.mocked(sanityFetch).mockResolvedValueOnce(fullProduct);
    await renderProductPage();
    expect(screen.getByText(/\$8\.99/)).toBeInTheDocument();
    expect(screen.getByText(/\/ sq ft/)).toBeInTheDocument();
  });

  it("renders product specifications via ProductSpecs component", async () => {
    vi.mocked(sanityFetch).mockResolvedValueOnce(fullProduct);
    await renderProductPage();
    expect(screen.getByText("Specifications")).toBeInTheDocument();
    expect(screen.getByText("Species")).toBeInTheDocument();
    expect(screen.getByText("Red Oak")).toBeInTheDocument();
    expect(screen.getByText("Thickness")).toBeInTheDocument();
  });

  it("renders product gallery with main image", async () => {
    vi.mocked(sanityFetch).mockResolvedValueOnce(fullProduct);
    await renderProductPage();
    const mainImage = screen.getByAltText("Premium Oak Plank");
    expect(mainImage).toBeInTheDocument();
  });

  it("renders gallery with thumbnail navigation", async () => {
    vi.mocked(sanityFetch).mockResolvedValueOnce(fullProduct);
    await renderProductPage();
    const thumbnails = screen.getAllByRole("button");
    expect(thumbnails.length).toBeGreaterThanOrEqual(2);
  });

  it("renders gallery region with aria-label", async () => {
    vi.mocked(sanityFetch).mockResolvedValueOnce(fullProduct);
    const { container } = await renderProductPage();
    const gallery = container.querySelector("[role='region']");
    expect(gallery).toBeTruthy();
  });

  it("renders Featured badge when product is featured", async () => {
    vi.mocked(sanityFetch).mockResolvedValueOnce(fullProduct);
    await renderProductPage();
    expect(screen.getByText("Featured")).toBeInTheDocument();
  });

  // ── Breadcrumb ─────────────────────────────────────────────────────────

  it("renders breadcrumb with Home link", async () => {
    vi.mocked(sanityFetch).mockResolvedValueOnce(fullProduct);
    await renderProductPage();
    const homeLink = screen.getByText("Home");
    expect(homeLink.closest("a")).toHaveAttribute("href", "/");
  });

  it("renders breadcrumb with category link", async () => {
    vi.mocked(sanityFetch).mockResolvedValueOnce(fullProduct);
    await renderProductPage();
    const catLink = screen.getByText("Hardwood Flooring");
    expect(catLink.closest("a")).toHaveAttribute("href", "/categories/hardwood-flooring");
  });

  // ── CTA buttons ────────────────────────────────────────────────────────

  it("renders Get Consultation CTA linking to /contact with product name", async () => {
    vi.mocked(sanityFetch).mockResolvedValueOnce(fullProduct);
    await renderProductPage();
    const cta = screen.getByText("Get Consultation");
    expect(cta.closest("a")).toHaveAttribute("href", `/contact?product=${encodeURIComponent("Premium Oak Plank")}`);
  });

  it("renders View All category CTA", async () => {
    vi.mocked(sanityFetch).mockResolvedValueOnce(fullProduct);
    await renderProductPage();
    const catCta = screen.getByText(/View All Hardwood Flooring/);
    expect(catCta.closest("a")).toHaveAttribute("href", "/categories/hardwood-flooring");
  });

  // ── 404 handling ───────────────────────────────────────────────────────

  it("calls notFound when product does not exist", async () => {
    vi.mocked(sanityFetch).mockResolvedValueOnce(null);
    await expect(renderProductPage("nonexistent")).rejects.toThrow("NEXT_NOT_FOUND");
  });

  // ── Edge cases ─────────────────────────────────────────────────────────

  it("renders without specs when product has no specs", async () => {
    const noSpecs = { ...fullProduct, specs: undefined };
    vi.mocked(sanityFetch).mockResolvedValueOnce(noSpecs);
    await renderProductPage();
    expect(screen.queryByText("Specifications")).not.toBeInTheDocument();
  });

  it("renders without price when price is 0", async () => {
    const noPrice = { ...fullProduct, price: 0 };
    vi.mocked(sanityFetch).mockResolvedValueOnce(noPrice);
    await renderProductPage();
    expect(screen.queryByText(/\$0\.00/)).not.toBeInTheDocument();
  });

  it("renders gallery placeholder when no product image", async () => {
    const noImage = { ...fullProduct, images: undefined };
    vi.mocked(sanityFetch).mockResolvedValueOnce(noImage);
    await renderProductPage();
    // No thumbnail buttons should exist
    expect(screen.queryAllByRole("button")).toHaveLength(0);
  });

  it("does not render Featured badge when not featured", async () => {
    const notFeatured = { ...fullProduct, isFeatured: false };
    vi.mocked(sanityFetch).mockResolvedValueOnce(notFeatured);
    await renderProductPage();
    expect(screen.queryByText("Featured")).not.toBeInTheDocument();
  });
});
