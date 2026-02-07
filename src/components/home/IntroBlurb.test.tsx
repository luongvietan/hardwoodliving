/**
 * IntroBlurb – Real rendering tests using @testing-library/react + jsdom.
 *
 * The IntroBlurb is fully CMS-driven with no hardcoded defaults.
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

  it("renders nothing when both heading and text are empty", () => {
    const { container } = render(<IntroBlurb heading="" text="" />);
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

  it("renders orange accent line under heading", () => {
    const { container } = render(<IntroBlurb heading="Title" text="Text" />);
    const accentLine = container.querySelector(".bg-accent-orange");
    expect(accentLine).toBeInTheDocument();
  });

  // ── Structure ────────────────────────────────────────────────────────

  it("renders as a <section> element", () => {
    const { container } = render(<IntroBlurb text="Hello" />);
    expect(container.querySelector("section")).toBeInTheDocument();
  });
});
