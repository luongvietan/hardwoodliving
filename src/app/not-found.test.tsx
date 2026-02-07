import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import NotFound from "./not-found";

describe("NotFound page", () => {
  it("renders 404 heading", () => {
    render(<NotFound />);

    expect(screen.getByText("Page Not Found")).toBeTruthy();
    expect(screen.getByText("404 Error")).toBeTruthy();
  });

  it("renders navigation links to Home and Products", () => {
    render(<NotFound />);

    const homeLink = screen.getByRole("link", { name: /go home/i });
    expect(homeLink).toBeTruthy();
    expect(homeLink.getAttribute("href")).toBe("/");

    const productsLink = screen.getByRole("link", { name: /browse products/i });
    expect(productsLink).toBeTruthy();
    expect(productsLink.getAttribute("href")).toBe("/products");
  });

  it("renders a descriptive message", () => {
    render(<NotFound />);

    expect(
      screen.getByText(/couldn't find the page/i)
    ).toBeTruthy();
  });
});
