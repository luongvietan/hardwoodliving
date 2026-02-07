/**
 * FeaturedProducts – Real rendering tests using @testing-library/react + jsdom.
 * Mocks for next/image, next/link and @/lib/sanity/image are provided by test-setup.ts.
 */
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import FeaturedProducts from "./FeaturedProducts";

const mockProducts = [
  {
    _id: "prod-1",
    title: "Oak Flooring",
    slug: { current: "oak-flooring" },
    price: 5.99,
    priceUnit: "/ sq ft",
    images: [{ asset: { _ref: "img-1", _type: "reference" as const } }],
  },
  {
    _id: "prod-2",
    title: "Maple Flooring",
    slug: { current: "maple-flooring" },
    price: 7.49,
    priceUnit: "/ box",
    images: [],
  },
  {
    _id: "prod-3",
    title: "Walnut Planks",
    slug: { current: "walnut-planks" },
    price: 12.0,
    images: [{ asset: { _ref: "img-3", _type: "reference" as const } }],
  },
];

describe("FeaturedProducts", () => {
  // ── Empty state ──────────────────────────────────────────────────────

  it("renders nothing when products prop is undefined", () => {
    const { container } = render(<FeaturedProducts />);
    expect(container.innerHTML).toBe("");
  });

  it("renders nothing when products array is empty", () => {
    const { container } = render(<FeaturedProducts products={[]} />);
    expect(container.innerHTML).toBe("");
  });

  // ── Section heading ──────────────────────────────────────────────────

  it("renders 'Featured Products' heading", () => {
    render(<FeaturedProducts products={mockProducts} />);
    expect(screen.getByText("Featured Products")).toBeInTheDocument();
  });

  // ── Product cards ────────────────────────────────────────────────────

  it("renders one card per product", () => {
    render(<FeaturedProducts products={mockProducts} />);
    expect(screen.getByText("Oak Flooring")).toBeInTheDocument();
    expect(screen.getByText("Maple Flooring")).toBeInTheDocument();
    expect(screen.getByText("Walnut Planks")).toBeInTheDocument();
  });

  it("links each card to /products/[slug]", () => {
    render(<FeaturedProducts products={mockProducts} />);
    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(3);
    expect(links[0]).toHaveAttribute("href", "/products/oak-flooring");
    expect(links[1]).toHaveAttribute("href", "/products/maple-flooring");
    expect(links[2]).toHaveAttribute("href", "/products/walnut-planks");
  });

  it("passes priceUnit through to ProductCard", () => {
    render(<FeaturedProducts products={mockProducts} />);
    // Oak and Walnut both use "/ sq ft" (default), Maple uses "/ box"
    const sqftElements = screen.getAllByText(/\/ sq ft/);
    expect(sqftElements.length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/\/ box/)).toBeInTheDocument();
  });

  // ── Accessibility ────────────────────────────────────────────────────

  it("has an accessible section with aria-labelledby", () => {
    render(<FeaturedProducts products={mockProducts} />);
    const heading = screen.getByText("Featured Products");
    expect(heading).toHaveAttribute("id", "featured-products-heading");

    const section = heading.closest("section");
    expect(section).toHaveAttribute("aria-labelledby", "featured-products-heading");
  });

  // ── Layout ───────────────────────────────────────────────────────────

  it("uses a responsive grid layout", () => {
    render(<FeaturedProducts products={mockProducts} />);
    const grid = screen.getByText("Oak Flooring").closest("a")?.parentElement;
    expect(grid?.className).toMatch(/grid-cols-1/);
    expect(grid?.className).toMatch(/lg:grid-cols-3/);
  });
});
