/**
 * ProductGrid – Real rendering tests using @testing-library/react + jsdom.
 * Mocks for next/image, next/link and @/lib/sanity/image are provided by test-setup.ts.
 */
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ProductGrid from "./ProductGrid";

const mockProducts = [
  {
    _id: "prod-1",
    title: "Oak Hardwood Flooring",
    slug: { current: "oak-hardwood-flooring" },
    price: 5.99,
    priceUnit: "/ sq ft",
    images: [{ asset: { _ref: "image-abc123", _type: "reference" as const } }],
  },
  {
    _id: "prod-2",
    title: "Maple Hardwood Flooring",
    slug: { current: "maple-hardwood-flooring" },
    price: 7.49,
    priceUnit: "/ sq ft",
    images: [{ asset: { _ref: "image-def456", _type: "reference" as const } }],
  },
  {
    _id: "prod-3",
    title: "Walnut Hardwood Flooring",
    slug: { current: "walnut-hardwood-flooring" },
    price: 9.99,
    priceUnit: "/ sq ft",
    images: [],
  },
];

describe("ProductGrid", () => {
  // ── Rendering ──────────────────────────────────────────────────────────

  it("renders all products as ProductCard components", () => {
    render(<ProductGrid products={mockProducts} />);
    expect(screen.getByText("Oak Hardwood Flooring")).toBeInTheDocument();
    expect(screen.getByText("Maple Hardwood Flooring")).toBeInTheDocument();
    expect(screen.getByText("Walnut Hardwood Flooring")).toBeInTheDocument();
  });

  it("renders product prices", () => {
    render(<ProductGrid products={mockProducts} />);
    expect(screen.getByText(/From \$5\.99/)).toBeInTheDocument();
    expect(screen.getByText(/From \$7\.49/)).toBeInTheDocument();
    expect(screen.getByText(/From \$9\.99/)).toBeInTheDocument();
  });

  it("renders product links to detail pages", () => {
    render(<ProductGrid products={mockProducts} />);
    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(3);
    expect(links[0]).toHaveAttribute("href", "/products/oak-hardwood-flooring");
    expect(links[1]).toHaveAttribute("href", "/products/maple-hardwood-flooring");
    expect(links[2]).toHaveAttribute("href", "/products/walnut-hardwood-flooring");
  });

  // ── Empty state ────────────────────────────────────────────────────────

  it("renders empty-state message when no products", () => {
    render(<ProductGrid products={[]} />);
    expect(
      screen.getByText(/No products found/i)
    ).toBeInTheDocument();
  });

  it("renders empty-state message when products is undefined", () => {
    render(<ProductGrid />);
    expect(
      screen.getByText(/No products found/i)
    ).toBeInTheDocument();
  });

  // ── Custom empty message ───────────────────────────────────────────────

  it("renders custom empty message when provided", () => {
    render(<ProductGrid products={[]} emptyMessage="Check back soon!" />);
    expect(screen.getByText("Check back soon!")).toBeInTheDocument();
  });

  // ── Grid structure ─────────────────────────────────────────────────────

  it("renders a grid container with responsive classes", () => {
    const { container } = render(<ProductGrid products={mockProducts} />);
    const grid = container.querySelector("[class*='grid']");
    expect(grid).toBeTruthy();
    expect(grid!.className).toContain("grid-cols-1");
    expect(grid!.className).toContain("md:grid-cols-2");
    expect(grid!.className).toContain("lg:grid-cols-3");
    expect(grid!.className).toContain("xl:grid-cols-4");
  });
});
