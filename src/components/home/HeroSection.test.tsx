/**
 * HeroSection – Real rendering tests using @testing-library/react + jsdom.
 * Mocks for next/image and next/link are provided by test-setup.ts.
 *
 * The HeroSection is fully CMS-driven with no hardcoded defaults.
 */
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import HeroSection from "./HeroSection";

describe("HeroSection", () => {
  // ── Empty state ───────────────────────────────────────────────────────

  it("renders nothing when no data provided", () => {
    const { container } = render(<HeroSection />);
    expect(container.innerHTML).toBe("");
  });

  // ── Custom CMS content ──────────────────────────────────────────────

  it("renders custom heading from CMS", () => {
    render(<HeroSection heading="Canadian Oak Collection" />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Canadian Oak Collection");
  });

  it("renders custom subheading from CMS", () => {
    render(<HeroSection subheading="Best flooring in Canada" />);
    expect(screen.getByText("Best flooring in Canada")).toBeInTheDocument();
  });

  it("renders custom CTA text and link from CMS", () => {
    render(<HeroSection heading="Test" ctaText="Shop Now" ctaLink="/products" />);
    const link = screen.getByText("Shop Now").closest("a");
    expect(link).toHaveAttribute("href", "/products");
  });

  it("does NOT render CTA when ctaLink or ctaText is missing", () => {
    render(<HeroSection heading="Test" ctaText="Shop Now" />);
    expect(screen.queryByText("Shop Now")?.closest("a")).toBeNull();
  });

  // ── Hero images (slideshow) ───────────────────────────────────────────

  it("renders image when images array is provided", () => {
    const images = [{ _key: "img1", asset: { _ref: "img-ref-1", _type: "reference" as const } }];
    render(<HeroSection heading="Test" images={images} />);
    const img = screen.getByRole("img");
    expect(img).toBeInTheDocument();
  });

  it("renders gradient background when no images", () => {
    const { container } = render(<HeroSection heading="No Image Hero" />);
    const gradient = container.querySelector(".bg-gradient-to-br");
    expect(gradient).toBeInTheDocument();
  });

  it("does NOT show slideshow dots for single image", () => {
    const images = [{ _key: "img1", asset: { _ref: "img-ref-1", _type: "reference" as const } }];
    render(<HeroSection heading="Test" images={images} />);
    expect(screen.queryByLabelText(/Go to slide/)).not.toBeInTheDocument();
  });

  it("shows slideshow dots for multiple images", () => {
    const images = [
      { _key: "img1", asset: { _ref: "img-ref-1", _type: "reference" as const } },
      { _key: "img2", asset: { _ref: "img-ref-2", _type: "reference" as const } },
    ];
    render(<HeroSection heading="Test" images={images} />);
    expect(screen.getByLabelText("Go to slide 1")).toBeInTheDocument();
    expect(screen.getByLabelText("Go to slide 2")).toBeInTheDocument();
  });

  // ── Accessibility & structure ───────────────────────────────────────

  it("renders as a <section> element", () => {
    const { container } = render(<HeroSection heading="Test" />);
    expect(container.querySelector("section")).toBeInTheDocument();
  });

  it("has exactly one h1 heading when heading is provided", () => {
    render(<HeroSection heading="Test" />);
    const headings = screen.getAllByRole("heading", { level: 1 });
    expect(headings).toHaveLength(1);
  });
});
