/**
 * ProductCard – Real rendering tests using @testing-library/react + jsdom.
 * Mocks for next/image, next/link and @/lib/sanity/image are provided by test-setup.ts.
 */
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ProductCard from "./ProductCard";

const baseProps = {
  title: "Oak Hardwood Flooring",
  slug: { current: "oak-hardwood-flooring" },
  price: 5.99,
  priceUnit: "/ sq ft",
  images: [{ asset: { _ref: "image-abc123", _type: "reference" as const } }],
};

describe("ProductCard", () => {
  // ── Rendering ────────────────────────────────────────────────────────

  it("renders product title", () => {
    render(<ProductCard {...baseProps} />);
    expect(screen.getByText("Oak Hardwood Flooring")).toBeInTheDocument();
  });

  it("renders product price with priceUnit", () => {
    render(<ProductCard {...baseProps} />);
    expect(screen.getByText(/From \$5\.99 \/ sq ft/)).toBeInTheDocument();
  });

  it("uses default priceUnit '/ sq ft' when not provided", () => {
    const { priceUnit, ...rest } = baseProps;
    render(<ProductCard {...rest} />);
    expect(screen.getByText(/\/ sq ft/)).toBeInTheDocument();
  });

  it("renders custom priceUnit when provided", () => {
    render(<ProductCard {...baseProps} priceUnit="/ box" />);
    expect(screen.getByText(/\/ box/)).toBeInTheDocument();
  });

  // ── Links ────────────────────────────────────────────────────────────

  it("links to /products/[slug]", () => {
    render(<ProductCard {...baseProps} />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/products/oak-hardwood-flooring");
  });

  // ── Images ───────────────────────────────────────────────────────────

  it("renders product image via urlFor when images are available", () => {
    render(<ProductCard {...baseProps} />);
    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("alt", "Oak Hardwood Flooring");
    expect(img).toHaveAttribute("src", "https://cdn.sanity.io/mock-image.jpg");
  });

  it("renders placeholder SVG when no images provided", () => {
    render(<ProductCard {...baseProps} images={undefined} />);
    // No <img> should exist — placeholder is an inline SVG
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it("renders placeholder when images array is empty", () => {
    render(<ProductCard {...baseProps} images={[]} />);
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  // ── Price edge cases ─────────────────────────────────────────────────

  it("does NOT render price when price is 0", () => {
    render(<ProductCard {...baseProps} price={0} />);
    expect(screen.queryByText(/From \$/)).not.toBeInTheDocument();
  });

  it("renders price correctly for large values", () => {
    render(<ProductCard {...baseProps} price={199.5} />);
    expect(screen.getByText(/From \$199\.50/)).toBeInTheDocument();
  });

  // ── Accessibility & UX ───────────────────────────────────────────────

  it("has a single link wrapping the entire card", () => {
    render(<ProductCard {...baseProps} />);
    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(1);
  });

  it("applies hover styles for interactive feedback", () => {
    render(<ProductCard {...baseProps} />);
    const link = screen.getByRole("link");
    expect(link.className).toMatch(/hover:/);
  });
});
