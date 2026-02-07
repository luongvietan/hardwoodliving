/**
 * Category Page (Server Component) – Integration tests.
 *
 * Renders the /categories/[slug] page which shows products in a category.
 * sanityFetch is mocked globally in test-setup.ts and overridden per-test.
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import CategoryPage from "./page";
import { sanityFetch } from "@/lib/sanity/fetch";

// Helper: call the async Server Component with params and render its output
async function renderCategoryPage(slug = "hardwood-flooring") {
  const jsx = await CategoryPage({ params: Promise.resolve({ slug }) });
  return render(<>{jsx}</>);
}

const mockCategory = {
  _id: "cat-1",
  title: "Hardwood Flooring",
  slug: { current: "hardwood-flooring" },
  description: "Premium hardwood flooring for every room",
  image: { asset: { _ref: "image-cat1", _type: "reference" as const } },
  parent: null,
};

const mockProducts = [
  {
    _id: "prod-1",
    title: "Oak Plank",
    slug: { current: "oak-plank" },
    description: "Classic oak plank",
    price: 5.99,
    priceUnit: "/ sq ft",
    images: [{ asset: { _ref: "image-p1", _type: "reference" as const } }],
    isFeatured: true,
  },
  {
    _id: "prod-2",
    title: "Maple Plank",
    slug: { current: "maple-plank" },
    description: "Smooth maple finish",
    price: 7.49,
    priceUnit: "/ sq ft",
    images: [{ asset: { _ref: "image-p2", _type: "reference" as const } }],
    isFeatured: false,
  },
];

const mockAllCategories = [
  mockCategory,
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

const mockSubcategories = [
  mockAllCategories[2],
];

beforeEach(() => {
  vi.mocked(sanityFetch).mockReset();
});

describe("Category Page", () => {
  // ── Full data rendering ──────────────────────────────────────────────

  it("renders category title as heading", async () => {
    vi.mocked(sanityFetch)
      .mockResolvedValueOnce(mockCategory) // category
      .mockResolvedValueOnce(mockAllCategories) // all categories
      .mockResolvedValueOnce(mockSubcategories) // subcategories
      .mockResolvedValueOnce(mockProducts); // products
    await renderCategoryPage();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Hardwood Flooring");
  });

  it("renders category description", async () => {
    vi.mocked(sanityFetch)
      .mockResolvedValueOnce(mockCategory)
      .mockResolvedValueOnce(mockAllCategories)
      .mockResolvedValueOnce(mockSubcategories)
      .mockResolvedValueOnce(mockProducts);
    await renderCategoryPage();
    expect(screen.getByText("Premium hardwood flooring for every room")).toBeInTheDocument();
  });

  it("renders products using ProductGrid", async () => {
    vi.mocked(sanityFetch)
      .mockResolvedValueOnce(mockCategory)
      .mockResolvedValueOnce(mockAllCategories)
      .mockResolvedValueOnce(mockSubcategories)
      .mockResolvedValueOnce(mockProducts);
    await renderCategoryPage();
    expect(screen.getByText("Oak Plank")).toBeInTheDocument();
    expect(screen.getByText("Maple Plank")).toBeInTheDocument();
  });

  it("renders product links to detail pages", async () => {
    vi.mocked(sanityFetch)
      .mockResolvedValueOnce(mockCategory)
      .mockResolvedValueOnce(mockAllCategories)
      .mockResolvedValueOnce(mockSubcategories)
      .mockResolvedValueOnce(mockProducts);
    await renderCategoryPage();
    const links = screen.getAllByRole("link");
    const productLinks = links.filter((l) =>
      l.getAttribute("href")?.startsWith("/products/")
    );
    expect(productLinks).toHaveLength(2);
    expect(productLinks[0]).toHaveAttribute("href", "/products/oak-plank");
  });

  it("renders product prices", async () => {
    vi.mocked(sanityFetch)
      .mockResolvedValueOnce(mockCategory)
      .mockResolvedValueOnce(mockAllCategories)
      .mockResolvedValueOnce(mockSubcategories)
      .mockResolvedValueOnce(mockProducts);
    await renderCategoryPage();
    expect(screen.getByText(/From \$5\.99/)).toBeInTheDocument();
    expect(screen.getByText(/From \$7\.49/)).toBeInTheDocument();
  });

  // ── Empty products ─────────────────────────────────────────────────────

  it("renders empty message when no products in category", async () => {
    vi.mocked(sanityFetch)
      .mockResolvedValueOnce(mockCategory)
      .mockResolvedValueOnce(mockAllCategories)
      .mockResolvedValueOnce(mockSubcategories)
      .mockResolvedValueOnce([]);
    await renderCategoryPage();
    expect(screen.getByText(/No products/i)).toBeInTheDocument();
  });

  // ── Not found ──────────────────────────────────────────────────────────

  it("calls notFound when category does not exist", async () => {
    vi.mocked(sanityFetch)
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([]);

    await expect(renderCategoryPage("nonexistent")).rejects.toThrow("NEXT_NOT_FOUND");
  });

  // ── Responsive grid ────────────────────────────────────────────────────

  it("uses ProductGrid with responsive 4-column layout", async () => {
    vi.mocked(sanityFetch)
      .mockResolvedValueOnce(mockCategory)
      .mockResolvedValueOnce(mockAllCategories)
      .mockResolvedValueOnce(mockSubcategories)
      .mockResolvedValueOnce(mockProducts);
    const { container } = await renderCategoryPage();
    const grid = container.querySelector("[class*='grid']");
    expect(grid).toBeTruthy();
    expect(grid!.className).toContain("xl:grid-cols-4");
  });

  it("renders ProductFilter with subcategories", async () => {
    vi.mocked(sanityFetch)
      .mockResolvedValueOnce(mockCategory)
      .mockResolvedValueOnce(mockAllCategories)
      .mockResolvedValueOnce(mockSubcategories)
      .mockResolvedValueOnce(mockProducts);
    await renderCategoryPage();
    expect(screen.getByText(/Filter by Category/i)).toBeInTheDocument();
    expect(screen.getByText(/Filter by Product Type/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Wide Plank" })).toBeInTheDocument();
  });

  it("renders subcategory navigation links", async () => {
    vi.mocked(sanityFetch)
      .mockResolvedValueOnce(mockCategory)
      .mockResolvedValueOnce(mockAllCategories)
      .mockResolvedValueOnce(mockSubcategories)
      .mockResolvedValueOnce(mockProducts);
    await renderCategoryPage();
    const link = screen.getByRole("link", { name: "Wide Plank" });
    expect(link).toHaveAttribute("href", "/categories/wide-plank");
  });
});
