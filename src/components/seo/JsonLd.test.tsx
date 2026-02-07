import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import JsonLd, {
  buildProductJsonLd,
  buildOrganizationJsonLd,
  buildBreadcrumbJsonLd,
} from "./JsonLd";

describe("JsonLd component", () => {
  it("renders a script tag with type application/ld+json", () => {
    const data = { "@context": "https://schema.org", "@type": "Organization", name: "Test" };
    const { container } = render(<JsonLd data={data} />);

    const script = container.querySelector('script[type="application/ld+json"]');
    expect(script).toBeTruthy();
    expect(JSON.parse(script!.textContent!)).toEqual(data);
  });
});

describe("buildProductJsonLd", () => {
  it("builds a valid Product schema", () => {
    const result = buildProductJsonLd({
      name: "Oak Flooring",
      description: "Premium oak",
      image: "https://example.com/oak.jpg",
      price: 12.99,
      url: "https://example.com/products/oak-flooring",
    });

    expect(result["@context"]).toBe("https://schema.org");
    expect(result["@type"]).toBe("Product");
    expect(result.name).toBe("Oak Flooring");
    expect(result.description).toBe("Premium oak");
    expect(result.image).toBe("https://example.com/oak.jpg");
    expect((result.offers as Record<string, unknown>)["@type"]).toBe("Offer");
    expect((result.offers as Record<string, unknown>).price).toBe("12.99");
    expect((result.offers as Record<string, unknown>).priceCurrency).toBe("CAD");
  });

  it("omits optional fields when not provided", () => {
    const result = buildProductJsonLd({
      name: "Test Product",
      url: "https://example.com/products/test",
    });

    expect(result.name).toBe("Test Product");
    expect(result.description).toBeUndefined();
    expect(result.image).toBeUndefined();
    expect(result.offers).toBeUndefined();
  });

  it("omits offers when price is 0", () => {
    const result = buildProductJsonLd({
      name: "Test",
      price: 0,
      url: "https://example.com/products/test",
    });

    expect(result.offers).toBeUndefined();
  });
});

describe("buildOrganizationJsonLd", () => {
  it("builds a valid Organization schema", () => {
    const result = buildOrganizationJsonLd({
      name: "Hardwood Living",
      url: "https://hardwoodliving.com",
      logo: "https://hardwoodliving.com/logo.png",
      description: "Premium hardwood",
    });

    expect(result["@context"]).toBe("https://schema.org");
    expect(result["@type"]).toBe("Organization");
    expect(result.name).toBe("Hardwood Living");
    expect(result.url).toBe("https://hardwoodliving.com");
    expect(result.logo).toBe("https://hardwoodliving.com/logo.png");
    expect(result.description).toBe("Premium hardwood");
  });

  it("omits optional fields when not provided", () => {
    const result = buildOrganizationJsonLd({
      name: "Test",
      url: "https://example.com",
    });

    expect(result.logo).toBeUndefined();
    expect(result.description).toBeUndefined();
  });
});

describe("buildBreadcrumbJsonLd", () => {
  it("builds a valid BreadcrumbList schema", () => {
    const items = [
      { name: "Home", url: "https://example.com" },
      { name: "Products", url: "https://example.com/products" },
      { name: "Oak", url: "https://example.com/products/oak" },
    ];

    const result = buildBreadcrumbJsonLd(items);

    expect(result["@context"]).toBe("https://schema.org");
    expect(result["@type"]).toBe("BreadcrumbList");
    expect(result.itemListElement).toHaveLength(3);

    const listItems = result.itemListElement as Record<string, unknown>[];
    expect(listItems[0]).toEqual({
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: "https://example.com",
    });
    expect(listItems[2]).toEqual({
      "@type": "ListItem",
      position: 3,
      name: "Oak",
      item: "https://example.com/products/oak",
    });
  });

  it("handles empty list", () => {
    const result = buildBreadcrumbJsonLd([]);

    expect(result.itemListElement).toHaveLength(0);
  });
});
