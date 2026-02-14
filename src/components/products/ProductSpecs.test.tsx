/**
 * ProductSpecs – Real rendering tests.
 */
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ProductSpecs from "./ProductSpecs";

const mockSpecs = [
  { _key: "s1", label: "Species", value: "Red Oak" },
  { _key: "s2", label: "Thickness", value: '3/4"' },
  { _key: "s3", label: "Width", value: '5"' },
  { _key: "s4", label: "Finish", value: "UV Polyurethane" },
];

describe("ProductSpecs", () => {
  it("renders 'Specifications' heading", () => {
    render(<ProductSpecs specs={mockSpecs} />);
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("Specifications");
  });

  it("renders all spec labels", () => {
    render(<ProductSpecs specs={mockSpecs} />);
    expect(screen.getByText("Species")).toBeInTheDocument();
    expect(screen.getByText("Thickness")).toBeInTheDocument();
    expect(screen.getByText("Width")).toBeInTheDocument();
    expect(screen.getByText("Finish")).toBeInTheDocument();
  });

  it("renders all spec values", () => {
    render(<ProductSpecs specs={mockSpecs} />);
    expect(screen.getByText("Red Oak")).toBeInTheDocument();
    expect(screen.getByText('3/4"')).toBeInTheDocument();
    expect(screen.getByText('5"')).toBeInTheDocument();
    expect(screen.getByText("UV Polyurethane")).toBeInTheDocument();
  });

  it("renders specs as a definition list (dl/dt/dd)", () => {
    const { container } = render(<ProductSpecs specs={mockSpecs} />);
    const dl = container.querySelector("dl");
    expect(dl).toBeTruthy();
    const terms = container.querySelectorAll("dt");
    const defs = container.querySelectorAll("dd");
    expect(terms).toHaveLength(4);
    expect(defs).toHaveLength(4);
  });

  it("renders nothing when specs is undefined", () => {
    const { container } = render(<ProductSpecs />);
    expect(container.innerHTML).toBe("");
  });

  it("renders nothing when specs is empty array", () => {
    const { container } = render(<ProductSpecs specs={[]} />);
    expect(container.innerHTML).toBe("");
  });

  it("renders structured specifications when provided", () => {
    render(
      <ProductSpecs
        specifications={{
          species: "W. Oak",
          width: "7",
          thickness: "5/8",
        }}
      />
    );
    expect(screen.getByText("Species")).toBeInTheDocument();
    expect(screen.getByText("W. Oak")).toBeInTheDocument();
    expect(screen.getByText("W")).toBeInTheDocument();
    expect(screen.getByText("7")).toBeInTheDocument();
    expect(screen.getByText("T")).toBeInTheDocument();
    expect(screen.getByText("5/8")).toBeInTheDocument();
  });

  it("renders both specifications and legacy specs", () => {
    render(
      <ProductSpecs
        specifications={{ species: "Oak" }}
        specs={[{ _key: "x", label: "Custom", value: "Value" }]}
      />
    );
    expect(screen.getByText("Species")).toBeInTheDocument();
    expect(screen.getByText("Oak")).toBeInTheDocument();
    expect(screen.getByText("Custom")).toBeInTheDocument();
    expect(screen.getByText("Value")).toBeInTheDocument();
  });

  it("renders nothing when specifications is empty object and specs is empty", () => {
    const { container } = render(<ProductSpecs specifications={{}} specs={[]} />);
    expect(container.innerHTML).toBe("");
  });
});
