/**
 * IntroBlurb – Real rendering tests using @testing-library/react + jsdom.
 */
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import IntroBlurb from "./IntroBlurb";

describe("IntroBlurb", () => {
  // ── Empty state ──────────────────────────────────────────────────────

  it("renders nothing when text is undefined", () => {
    const { container } = render(<IntroBlurb />);
    expect(container.innerHTML).toBe("");
  });

  it("renders nothing when text is empty string", () => {
    const { container } = render(<IntroBlurb text="" />);
    expect(container.innerHTML).toBe("");
  });

  // ── Content rendering ────────────────────────────────────────────────

  it("renders paragraph text", () => {
    render(<IntroBlurb text="Welcome to Hardwoodliving." />);
    expect(screen.getByText("Welcome to Hardwoodliving.")).toBeInTheDocument();
  });

  it("renders heading when provided", () => {
    render(<IntroBlurb heading="About Us" text="Some intro text." />);
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("About Us");
  });

  it("does NOT render heading when not provided", () => {
    render(<IntroBlurb text="Some intro text." />);
    expect(screen.queryByRole("heading")).not.toBeInTheDocument();
  });

  // ── Accessibility ────────────────────────────────────────────────────

  it("uses heading as aria-label when heading provided", () => {
    render(<IntroBlurb heading="Our Story" text="Some text" />);
    const section = screen.getByText("Some text").closest("section");
    expect(section).toHaveAttribute("aria-label", "Our Story");
  });

  it("falls back to 'About Hardwoodliving' aria-label when no heading", () => {
    render(<IntroBlurb text="Some text" />);
    const section = screen.getByText("Some text").closest("section");
    expect(section).toHaveAttribute("aria-label", "About Hardwoodliving");
  });

  // ── Structure ────────────────────────────────────────────────────────

  it("renders as a <section> element", () => {
    const { container } = render(<IntroBlurb text="Hello" />);
    expect(container.querySelector("section")).toBeInTheDocument();
  });
});
