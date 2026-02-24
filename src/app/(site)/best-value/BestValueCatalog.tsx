"use client";

import { useState, useMemo } from "react";
import ProductCard from "@/components/products/ProductCard";
import type { SanityImageValue } from "@/lib/sanity/types";

interface Category {
  _id: string;
  title: string;
  slug: { current: string };
}

interface Product {
  _id: string;
  title: string;
  slug: { current: string };
  price: number;
  salePrice?: number | null;
  isOnSale?: boolean;
  isBestValue?: boolean;
  priceUnit?: string;
  images?: SanityImageValue[];
  category?: Category | null;
}

interface BestValueCatalogProps {
  products: Product[];
}

export default function BestValueCatalog({ products }: BestValueCatalogProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const categories = useMemo(() => {
    const seen = new Map<string, Category>();
    for (const p of products) {
      if (p.category && !seen.has(p.category._id)) {
        seen.set(p.category._id, p.category);
      }
    }
    return Array.from(seen.values()).sort((a, b) =>
      a.title.localeCompare(b.title)
    );
  }, [products]);

  const filtered = useMemo(() => {
    if (!activeCategory) return products;
    return products.filter((p) => p.category?._id === activeCategory);
  }, [products, activeCategory]);

  if (products.length === 0) {
    return (
      <p className="text-center text-lg text-gray-600">
        No best-value products found. Check back soon!
      </p>
    );
  }

  return (
    <>
      {categories.length > 1 && (
        <div className="mb-8 border-b border-gray-200 pb-6">
          <h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-charcoal-dark">
            Categories
          </h2>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Category filters">
            <button
              type="button"
              onClick={() => setActiveCategory(null)}
              aria-pressed={activeCategory === null}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                activeCategory === null
                  ? "bg-accent-orange text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              All Best Value
            </button>
            {categories.map((cat) => (
              <button
                key={cat._id}
                type="button"
                onClick={() => setActiveCategory(cat._id)}
                aria-pressed={activeCategory === cat._id}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  activeCategory === cat._id
                    ? "bg-accent-orange text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {cat.title}
              </button>
            ))}
          </div>
        </div>
      )}

      {filtered.length === 0 ? (
        <p className="text-center text-lg text-gray-600">
          No best-value products in this category.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((product) => (
            <ProductCard
              key={product._id}
              title={product.title}
              slug={product.slug.current}
              price={product.price}
              salePrice={product.salePrice}
              isOnSale={product.isOnSale}
              priceUnit={product.priceUnit}
              image={product.images?.[0]}
            />
          ))}
        </div>
      )}
    </>
  );
}
