/**
 * Products Catalog Page (Server Component) – Integration tests.
 *
 * Renders the /products catalog page which shows categories and supports filtering.
 * sanityFetch is mocked globally in test-setup.ts and overridden per-test.
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import ProductsCatalogPage from "./page";
import { sanityFetch } from "@/lib/sanity/fetch";

// Helper: call the async Server Component and render its output
async function renderCatalog(searchParams?: Record<string, string>) {
  const jsx = await ProductsCatalogPage({
    searchParams: Promise.resolve(searchParams ?? {}),
  });
  return render(<>{jsx}</>);
}

const mockCategories = [
  {
    _id: "cat-1",
    title: "Hardwood Flooring",
    slug: { current: "hardwood-flooring" },
    description: "Premium hardwood floors",
    image: { asset: { _ref: "image-cat1", _type: "reference" as const } },
    parent: null,
  },
  {
    _id: "cat-2",
    title: "Engineered Wood",
    slug: { current: "engineered-wood" },
    description: "Durable engineered options",
    image: null,
    parent: null,
  },
  {
    _id: "cat-3",
    title: "Wide Plank",
    slug: { current: "wide-plank" },
    description: "Wide plank collections",
    image: null,
    parent: {
      _id: "cat-1",
      title: "Hardwood Flooring",
      slug: { current: "hardwood-flooring" },
    },
  },
];

const mockFilteredProducts = [
  {
    _id: "prod-1",
    title: "Oak Plank",
    slug: { current: "oak-plank" },
    price: 5.99,
    priceUnit: "/ sq ft",
    images: [{ asset: { _ref: "image-p1", _type: "reference" as const } }],
  },
];

beforeEach(() => {
  vi.mocked(sanityFetch).mockReset();
});

describe("Products Catalog Page", () => {
  // ── Unfiltered (category browse) ───────────────────────────────────────

  it("renders the page heading", async () => {
    vi.mocked(sanityFetch)
      .mockResolvedValueOnce(mockCategories)
      .mockResolvedValueOnce(mockCategories.filter((c) => !c.parent));
    await renderCatalog();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(/Product Catalog/i);
  });

  it("renders all categories in category grid and filter", async () => {
    vi.mocked(sanityFetch)
      .mockResolvedValueOnce(mockCategories)
      .mockResolvedValueOnce(mockCategories.filter((c) => !c.parent));
    await renderCatalog();
    // Category names appear in both filter buttons and category cards
    expect(screen.getAllByText("Hardwood Flooring").length).toBeGreaterThanOrEqual(2);
    expect(screen.getAllByText("Engineered Wood").length).toBeGreaterThanOrEqual(2);
  });

  it("links categories to /categories/[slug]", async () => {
    vi.mocked(sanityFetch)
      .mockResolvedValueOnce(mockCategories)
      .mockResolvedValueOnce(mockCategories.filter((c) => !c.parent));
    await renderCatalog();
    const links = screen.getAllByRole("link");
    const categoryLinks = links.filter((l) =>
      l.getAttribute("href")?.startsWith("/categories/")
    );
    expect(categoryLinks.length).toBeGreaterThanOrEqual(2);
  });

  it("renders category descriptions", async () => {
    vi.mocked(sanityFetch)
      .mockResolvedValueOnce(mockCategories)
      .mockResolvedValueOnce(mockCategories.filter((c) => !c.parent));
    await renderCatalog();
    expect(screen.getByText("Premium hardwood floors")).toBeInTheDocument();
  });

  it("renders empty state when no categories exist", async () => {
    vi.mocked(sanityFetch)
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([]);
    await renderCatalog();
    expect(screen.getByText(/No categories found/i)).toBeInTheDocument();
  });

  it("renders fallback state when sanityFetch returns null", async () => {
    vi.mocked(sanityFetch)
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce([]);
    await renderCatalog();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(/Product Catalog/i);
  });

  // ── Filter bar ─────────────────────────────────────────────────────────

  it("renders the ProductFilter component with categories", async () => {
    vi.mocked(sanityFetch)
      .mockResolvedValueOnce(mockCategories)
      .mockResolvedValueOnce(mockCategories.filter((c) => !c.parent));
    await renderCatalog();
    expect(screen.getByText(/Filter by Category/i)).toBeInTheDocument();
    expect(screen.getByText(/All Products/i)).toBeInTheDocument();
  });

  // ── Filtered view (searchParams) ───────────────────────────────────────

  it("shows filtered products when category searchParam is active", async () => {
    vi.mocked(sanityFetch)
      .mockResolvedValueOnce(mockCategories)        // all categories
      .mockResolvedValueOnce(mockCategories.filter((c) => !c.parent)) // top-level
      .mockResolvedValueOnce(mockFilteredProducts);  // filtered products
    await renderCatalog({ category: "hardwood-flooring" });
    expect(screen.getByText("Oak Plank")).toBeInTheDocument();
  });

  it("shows category title as heading when filter is active", async () => {
    vi.mocked(sanityFetch)
      .mockResolvedValueOnce(mockCategories)
      .mockResolvedValueOnce(mockCategories.filter((c) => !c.parent))
      .mockResolvedValueOnce(mockFilteredProducts);
    await renderCatalog({ category: "hardwood-flooring" });
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Hardwood Flooring");
  });

  it("shows empty message when filtered category has no products", async () => {
    vi.mocked(sanityFetch)
      .mockResolvedValueOnce(mockCategories)
      .mockResolvedValueOnce(mockCategories.filter((c) => !c.parent))
      .mockResolvedValueOnce([]);
    await renderCatalog({ category: "hardwood-flooring" });
    expect(screen.getByText(/No products found/i)).toBeInTheDocument();
  });

  it("shows filtered products when product type searchParam is active", async () => {
    vi.mocked(sanityFetch)
      .mockResolvedValueOnce(mockCategories)
      .mockResolvedValueOnce(mockCategories.filter((c) => !c.parent))
      .mockResolvedValueOnce(mockFilteredProducts);
    await renderCatalog({ type: "wide-plank" });
    expect(screen.getByText("Oak Plank")).toBeInTheDocument();
  });
});
