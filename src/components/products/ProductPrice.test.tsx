/**
 * ProductPrice – Real rendering tests.
 */
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ProductPrice from "./ProductPrice";

describe("ProductPrice", () => {
  it("renders price with default priceUnit", () => {
    render(<ProductPrice price={5.99} />);
    expect(screen.getByText(/\$5\.99/)).toBeInTheDocument();
    expect(screen.getByText(/\/ sq ft/)).toBeInTheDocument();
  });

  it("renders price with custom priceUnit", () => {
    render(<ProductPrice price={12.5} priceUnit="/ box" />);
    expect(screen.getByText(/\$12\.50/)).toBeInTheDocument();
    expect(screen.getByText(/\/ box/)).toBeInTheDocument();
  });

  it("formats price to 2 decimal places", () => {
    render(<ProductPrice price={3} />);
    expect(screen.getByText(/\$3\.00/)).toBeInTheDocument();
  });

  it("renders nothing when price is 0", () => {
    const { container } = render(<ProductPrice price={0} />);
    expect(container.innerHTML).toBe("");
  });

  it("renders nothing when price is negative", () => {
    const { container } = render(<ProductPrice price={-1} />);
    expect(container.innerHTML).toBe("");
  });

  it("uses amber styling for the price", () => {
    const { container } = render(<ProductPrice price={9.99} />);
    const priceEl = container.querySelector("[class*='text-amber']");
    expect(priceEl).toBeTruthy();
  });

  it("renders price in larger text size", () => {
    const { container } = render(<ProductPrice price={9.99} />);
    const priceEl = container.querySelector("[class*='text-2xl']");
    expect(priceEl).toBeTruthy();
  });
});
