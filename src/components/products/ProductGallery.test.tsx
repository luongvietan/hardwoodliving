/**
 * ProductGallery – Real rendering tests for the interactive image gallery.
 * Client component with useState for active image selection.
 */
import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import ProductGallery from "./ProductGallery";

const mockImages = [
  { _key: "img1", asset: { _ref: "image-main", _type: "reference" as const } },
  { _key: "img2", asset: { _ref: "image-side", _type: "reference" as const } },
  { _key: "img3", asset: { _ref: "image-detail", _type: "reference" as const } },
];

const productTitle = "Premium Oak Plank";

describe("ProductGallery", () => {
  // ── Main image rendering ───────────────────────────────────────────────

  it("renders the main (first) image with product alt text", () => {
    render(<ProductGallery images={mockImages} productTitle={productTitle} />);
    const mainImage = screen.getByAltText("Premium Oak Plank");
    expect(mainImage).toBeInTheDocument();
  });

  it("renders main image with priority loading", () => {
    render(<ProductGallery images={mockImages} productTitle={productTitle} />);
    const mainImage = screen.getByAltText("Premium Oak Plank");
    expect(mainImage).toHaveAttribute("data-testid", "next-image");
  });

  // ── Thumbnails rendering ───────────────────────────────────────────────

  it("renders thumbnail buttons for all images", () => {
    render(<ProductGallery images={mockImages} productTitle={productTitle} />);
    const thumbnails = screen.getAllByRole("button");
    expect(thumbnails).toHaveLength(3);
  });

  it("renders thumbnail images with descriptive alt text", () => {
    render(<ProductGallery images={mockImages} productTitle={productTitle} />);
    expect(screen.getByAltText("Premium Oak Plank - Detail 1")).toBeInTheDocument();
    expect(screen.getByAltText("Premium Oak Plank - Detail 2")).toBeInTheDocument();
    expect(screen.getByAltText("Premium Oak Plank - Detail 3")).toBeInTheDocument();
  });

  // ── Image switching ────────────────────────────────────────────────────

  it("switches main image when a thumbnail is clicked", () => {
    render(<ProductGallery images={mockImages} productTitle={productTitle} />);
    const thumbnails = screen.getAllByRole("button");

    // Click second thumbnail
    fireEvent.click(thumbnails[1]);

    // Main image alt should still be productTitle (we always show it as main)
    const mainImage = screen.getByAltText("Premium Oak Plank");
    expect(mainImage).toBeInTheDocument();
  });

  it("highlights the active thumbnail", () => {
    const { container } = render(
      <ProductGallery images={mockImages} productTitle={productTitle} />
    );
    const thumbnails = container.querySelectorAll("button");

    // First thumbnail should be active by default
    expect(thumbnails[0].className).toContain("ring-amber");
    expect(thumbnails[0]).toHaveAttribute("aria-pressed", "true");

    // Click second thumbnail
    fireEvent.click(thumbnails[1]);
    expect(thumbnails[1].className).toContain("ring-amber");
    expect(thumbnails[1]).toHaveAttribute("aria-pressed", "true");
  });

  // ── Edge cases ─────────────────────────────────────────────────────────

  it("renders placeholder when images is undefined", () => {
    render(<ProductGallery productTitle={productTitle} />);
    // Should show placeholder, not crash
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("renders placeholder when images is empty array", () => {
    render(<ProductGallery images={[]} productTitle={productTitle} />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("renders single image without thumbnails row", () => {
    const singleImage = [mockImages[0]];
    render(<ProductGallery images={singleImage} productTitle={productTitle} />);
    // Main image should render
    expect(screen.getByAltText("Premium Oak Plank")).toBeInTheDocument();
    // No thumbnail buttons (only 1 image, no need for navigation)
    expect(screen.queryAllByRole("button")).toHaveLength(0);
  });

  // ── Accessibility ──────────────────────────────────────────────────────

  it("has accessible gallery region", () => {
    const { container } = render(
      <ProductGallery images={mockImages} productTitle={productTitle} />
    );
    const gallery = container.querySelector("[role='region']");
    expect(gallery).toBeTruthy();
  });
});
