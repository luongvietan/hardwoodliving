"use client";

import { useRouter } from "next/navigation";

interface Category {
  _id: string;
  title: string;
  slug: { current: string };
}

interface ProductFilterProps {
  allCategoriesPath?: string;
  basePath?: string;
  categoryRouteBase?: string;
  categories: Category[];
  productTypes?: Category[];
  activeCategory?: string;
  activeType?: string;
}

/**
 * Product filter component (Magna-style sidebar).
 * Vertical list of category links with active state highlighted in orange.
 * Client Component for interactive filtering.
 */
export default function ProductFilter({
  allCategoriesPath,
  basePath = "/products",
  categoryRouteBase,
  categories,
  productTypes = [],
  activeCategory,
  activeType,
}: ProductFilterProps) {
  const router = useRouter();

  if (!categories || categories.length === 0) return null;

  const buildUrl = (category: string | null, type: string | null) => {
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (type) params.set("type", type);
    const query = params.toString();
    return query ? `${basePath}?${query}` : basePath;
  };

  const handleCategoryClick = (slug: string | null) => {
    if (slug === null) {
      router.push(allCategoriesPath ?? basePath);
      return;
    }
    if (categoryRouteBase) {
      router.push(`${categoryRouteBase}/${slug}`);
      return;
    }
    router.push(buildUrl(slug, null));
  };

  const handleTypeClick = (slug: string | null) => {
    router.push(buildUrl(activeCategory ?? null, slug));
  };

  const isActive = (slug: string | null) => {
    if (slug === null) return !activeCategory;
    return activeCategory === slug;
  };

  const isTypeActive = (slug: string | null) => {
    if (slug === null) return !activeType;
    return activeType === slug;
  };

  return (
    <div className="mb-8 border-b border-gray-200 pb-6">
      <h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-charcoal-dark">
        Categories
      </h2>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Category filters">
        <button
          type="button"
          onClick={() => handleCategoryClick(null)}
          aria-pressed={isActive(null)}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            isActive(null)
              ? "bg-accent-orange text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          All Products
        </button>
        {categories.map((cat) => (
          <button
            key={cat._id}
            type="button"
            onClick={() => handleCategoryClick(cat.slug.current)}
            aria-pressed={isActive(cat.slug.current)}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              isActive(cat.slug.current)
                ? "bg-accent-orange text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {cat.title}
          </button>
        ))}
      </div>

      {productTypes.length > 0 && (
        <>
          <h3 className="mb-3 mt-6 text-xs font-bold uppercase tracking-wider text-charcoal-dark">
            Product Type
          </h3>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Product type filters">
            <button
              type="button"
              onClick={() => handleTypeClick(null)}
              aria-pressed={isTypeActive(null)}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                isTypeActive(null)
                  ? "bg-accent-orange text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              All Types
            </button>
            {productTypes.map((type) => (
              <button
                key={type._id}
                type="button"
                onClick={() => handleTypeClick(type.slug.current)}
                aria-pressed={isTypeActive(type.slug.current)}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  isTypeActive(type.slug.current)
                    ? "bg-accent-orange text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {type.title}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
