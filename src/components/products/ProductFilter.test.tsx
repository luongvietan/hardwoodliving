/**
 * ProductFilter – Real rendering tests for the filter UI.
 * Client component using useSearchParams and useRouter for URL-based filtering.
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import ProductFilter from "./ProductFilter";

const mockPush = vi.fn();

// Override the useRouter and useSearchParams mocks for filter tests
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    replace: vi.fn(),
    back: vi.fn(),
    prefetch: vi.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => "/products",
}));

const mockCategories = [
  { _id: "cat-1", title: "Hardwood Flooring", slug: { current: "hardwood-flooring" } },
  { _id: "cat-2", title: "Engineered Wood", slug: { current: "engineered-wood" } },
  { _id: "cat-3", title: "Laminate", slug: { current: "laminate" } },
];

const mockProductTypes = [
  { _id: "type-1", title: "Wide Plank", slug: { current: "wide-plank" } },
  { _id: "type-2", title: "Herringbone", slug: { current: "herringbone" } },
];

beforeEach(() => {
  mockPush.mockClear();
});

describe("ProductFilter", () => {
  // ── Rendering ──────────────────────────────────────────────────────────

  it("renders filter heading", () => {
    render(<ProductFilter categories={mockCategories} productTypes={mockProductTypes} />);
    expect(screen.getByText(/Filter by Category/i)).toBeInTheDocument();
  });

  it("renders all category filter options", () => {
    render(<ProductFilter categories={mockCategories} productTypes={mockProductTypes} />);
    expect(screen.getByText("Hardwood Flooring")).toBeInTheDocument();
    expect(screen.getByText("Engineered Wood")).toBeInTheDocument();
    expect(screen.getByText("Laminate")).toBeInTheDocument();
  });

  it("renders 'All Products' option", () => {
    render(<ProductFilter categories={mockCategories} productTypes={mockProductTypes} />);
    expect(screen.getByText(/All Products/i)).toBeInTheDocument();
  });

  it("renders product type filter options", () => {
    render(<ProductFilter categories={mockCategories} productTypes={mockProductTypes} />);
    expect(screen.getByText(/Filter by Product Type/i)).toBeInTheDocument();
    expect(screen.getByText(/All Types/i)).toBeInTheDocument();
    expect(screen.getByText("Wide Plank")).toBeInTheDocument();
    expect(screen.getByText("Herringbone")).toBeInTheDocument();
  });

  // ── Interaction ────────────────────────────────────────────────────────

  it("navigates to filtered URL when category is clicked", () => {
    render(<ProductFilter categories={mockCategories} productTypes={mockProductTypes} />);
    fireEvent.click(screen.getByText("Hardwood Flooring"));
    expect(mockPush).toHaveBeenCalledWith(
      expect.stringContaining("category=hardwood-flooring")
    );
  });

  it("navigates to unfiltered URL when 'All Products' is clicked", () => {
    render(<ProductFilter categories={mockCategories} productTypes={mockProductTypes} />);
    fireEvent.click(screen.getByText(/All Products/i));
    expect(mockPush).toHaveBeenCalledWith("/products");
  });

  it("navigates to type-filtered URL when product type is clicked", () => {
    render(<ProductFilter categories={mockCategories} productTypes={mockProductTypes} />);
    fireEvent.click(screen.getByText("Wide Plank"));
    expect(mockPush).toHaveBeenCalledWith(
      expect.stringContaining("type=wide-plank")
    );
  });

  // ── Active state ───────────────────────────────────────────────────────

  it("highlights active category based on activeCategory prop", () => {
    const { container } = render(
      <ProductFilter
        categories={mockCategories}
        productTypes={mockProductTypes}
        activeCategory="hardwood-flooring"
      />
    );
    // The active category should have a distinct style
    const activeButton = screen.getByText("Hardwood Flooring").closest("button");
    expect(activeButton?.className).toContain("bg-amber");
  });

  it("highlights 'All Products' when no activeCategory", () => {
    const { container } = render(
      <ProductFilter categories={mockCategories} productTypes={mockProductTypes} />
    );
    const allButton = screen.getByText(/All Products/i).closest("button");
    expect(allButton?.className).toContain("bg-amber");
  });

  it("highlights active product type based on activeType prop", () => {
    render(
      <ProductFilter
        categories={mockCategories}
        productTypes={mockProductTypes}
        activeType="wide-plank"
      />
    );
    const activeTypeButton = screen.getByText("Wide Plank").closest("button");
    expect(activeTypeButton?.className).toContain("bg-amber");
  });

  // ── Empty state ────────────────────────────────────────────────────────

  it("renders nothing when categories is empty", () => {
    const { container } = render(<ProductFilter categories={[]} />);
    expect(container.innerHTML).toBe("");
  });

  // ── Responsive ─────────────────────────────────────────────────────────

  it("renders filter buttons in a flex-wrap layout", () => {
    const { container } = render(<ProductFilter categories={mockCategories} />);
    const wrapper = container.querySelector("[class*='flex']");
    expect(wrapper).toBeTruthy();
  });
});
