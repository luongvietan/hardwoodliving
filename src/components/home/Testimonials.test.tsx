/**
 * Testimonials – Real rendering tests using @testing-library/react + jsdom.
 * Mocks for next/image and @/lib/sanity/image are provided by test-setup.ts.
 */
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Testimonials from "./Testimonials";

const mockTestimonials = [
  {
    _id: "t-1",
    author: "Jane Smith",
    content: "Beautiful hardwood floors! Highly recommended.",
    image: { asset: { _ref: "img-jane", _type: "reference" as const } },
  },
  {
    _id: "t-2",
    author: "Mike Johnson",
    content: "Excellent quality and professional service.",
  },
  {
    _id: "t-3",
    author: "Sarah Lee",
    content: "We love our new kitchen cabinets.",
    image: { asset: { _ref: "img-sarah", _type: "reference" as const } },
  },
];

describe("Testimonials", () => {
  // ── Empty state ──────────────────────────────────────────────────────

  it("renders nothing when testimonials is undefined", () => {
    const { container } = render(<Testimonials />);
    expect(container.innerHTML).toBe("");
  });

  it("renders nothing when testimonials is empty array", () => {
    const { container } = render(<Testimonials testimonials={[]} />);
    expect(container.innerHTML).toBe("");
  });

  // ── Section heading ──────────────────────────────────────────────────

  it("renders 'What Our Clients Say' heading", () => {
    render(<Testimonials testimonials={mockTestimonials} />);
    expect(screen.getByText("What Our Clients Say")).toBeInTheDocument();
  });

  // ── Testimonial cards ────────────────────────────────────────────────

  it("renders all testimonial cards", () => {
    render(<Testimonials testimonials={mockTestimonials} />);
    expect(screen.getByText("Jane Smith")).toBeInTheDocument();
    expect(screen.getByText("Mike Johnson")).toBeInTheDocument();
    expect(screen.getByText("Sarah Lee")).toBeInTheDocument();
  });

  it("renders testimonial content text", () => {
    render(<Testimonials testimonials={mockTestimonials} />);
    expect(screen.getByText("Beautiful hardwood floors! Highly recommended.")).toBeInTheDocument();
    expect(screen.getByText("Excellent quality and professional service.")).toBeInTheDocument();
    expect(screen.getByText("We love our new kitchen cabinets.")).toBeInTheDocument();
  });

  // ── Author images ───────────────────────────────────────────────────

  it("renders author image when image asset is available", () => {
    render(<Testimonials testimonials={mockTestimonials} />);
    const images = screen.getAllByRole("img");
    // Only Jane and Sarah have images, Mike doesn't
    expect(images).toHaveLength(2);
  });

  it("uses author name as image alt text", () => {
    render(<Testimonials testimonials={mockTestimonials} />);
    expect(screen.getByAltText("Jane Smith")).toBeInTheDocument();
    expect(screen.getByAltText("Sarah Lee")).toBeInTheDocument();
  });

  it("does NOT render image for testimonial without image", () => {
    render(<Testimonials testimonials={[mockTestimonials[1]]} />);
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  // ── Accessibility ────────────────────────────────────────────────────

  it("has an accessible section with aria-labelledby", () => {
    render(<Testimonials testimonials={mockTestimonials} />);
    const heading = screen.getByText("What Our Clients Say");
    expect(heading).toHaveAttribute("id", "testimonials-heading");

    const section = heading.closest("section");
    expect(section).toHaveAttribute("aria-labelledby", "testimonials-heading");
  });

  // ── Layout ───────────────────────────────────────────────────────────

  it("uses responsive grid layout", () => {
    render(<Testimonials testimonials={mockTestimonials} />);
    const grid = screen.getByText("Jane Smith").closest(".grid");
    expect(grid?.className).toMatch(/grid-cols-1/);
    expect(grid?.className).toMatch(/lg:grid-cols-3/);
  });
});
