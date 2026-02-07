/**
 * HeroSection – Real rendering tests using @testing-library/react + jsdom.
 * Mocks for next/image and next/link are provided by test-setup.ts.
 */
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import HeroSection from "./HeroSection";

describe("HeroSection", () => {
  // ── Default / fallback content ───────────────────────────────────────

  it("renders default heading when none provided", () => {
    render(<HeroSection />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Premium Hardwood");
  });

  it("renders default subheading when none provided", () => {
    render(<HeroSection />);
    expect(screen.getByText(/curated collection/i)).toBeInTheDocument();
  });

  it("renders default CTA text when none provided", () => {
    render(<HeroSection />);
    expect(screen.getByText("Browse Flooring")).toBeInTheDocument();
  });

  it("renders 'Contact Us' CTA always", () => {
    render(<HeroSection />);
    expect(screen.getByText("Contact Us")).toBeInTheDocument();
  });

  it("links default CTA to /categories/flooring", () => {
    render(<HeroSection />);
    const link = screen.getByText("Browse Flooring").closest("a");
    expect(link).toHaveAttribute("href", "/categories/flooring");
  });

  it("links Contact Us to /contact", () => {
    render(<HeroSection />);
    const link = screen.getByText("Contact Us").closest("a");
    expect(link).toHaveAttribute("href", "/contact");
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
    render(<HeroSection ctaText="Shop Now" ctaLink="/products" />);
    const link = screen.getByText("Shop Now").closest("a");
    expect(link).toHaveAttribute("href", "/products");
  });

  // ── Hero image ──────────────────────────────────────────────────────

  it("renders background image when imageUrl is provided", () => {
    render(<HeroSection imageUrl="https://cdn.sanity.io/hero.jpg" />);
    const img = screen.getByRole("presentation");
    expect(img).toHaveAttribute("src", "https://cdn.sanity.io/hero.jpg");
  });

  it("renders gradient background when no imageUrl", () => {
    const { container } = render(<HeroSection />);
    // Should have gradient div, not an img[role=presentation]
    expect(screen.queryByRole("presentation")).not.toBeInTheDocument();
    const gradient = container.querySelector(".bg-gradient-to-br");
    expect(gradient).toBeInTheDocument();
  });

  // ── Heading text splitting (last word highlighted in amber) ─────────

  it("highlights last word of multi-word heading in amber", () => {
    render(<HeroSection heading="Premium Hardwood" />);
    const amberSpan = screen.getByText("Hardwood");
    expect(amberSpan.className).toMatch(/text-amber-400/);
  });

  it("highlights single-word heading entirely in amber", () => {
    render(<HeroSection heading="Flooring" />);
    const amberSpan = screen.getByText("Flooring");
    expect(amberSpan.className).toMatch(/text-amber-400/);
  });

  // ── Accessibility & structure ───────────────────────────────────────

  it("renders as a <section> element", () => {
    const { container } = render(<HeroSection />);
    expect(container.querySelector("section")).toBeInTheDocument();
  });

  it("has exactly one h1 heading", () => {
    render(<HeroSection />);
    const headings = screen.getAllByRole("heading", { level: 1 });
    expect(headings).toHaveLength(1);
  });
});
