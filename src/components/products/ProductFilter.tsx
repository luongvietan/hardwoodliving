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
 * Product filter component using URL search params for shareable filter state.
 * Renders category filter buttons with active state indication.
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
    <div className="mb-8">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-500">
        Filter by Category
      </h2>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Category filters">
        <button
          type="button"
          onClick={() => handleCategoryClick(null)}
          aria-pressed={isActive(null)}
          className={`rounded-full px-4 py-2 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 ${
            isActive(null)
              ? "bg-amber-700 text-white"
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
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 ${
              isActive(cat.slug.current)
                ? "bg-amber-700 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {cat.title}
          </button>
        ))}
      </div>

      {productTypes.length > 0 && (
        <>
          <h3 className="mb-3 mt-6 text-sm font-semibold uppercase tracking-wider text-gray-500">
            Filter by Product Type
          </h3>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Product type filters">
            <button
              type="button"
              onClick={() => handleTypeClick(null)}
              aria-pressed={isTypeActive(null)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 ${
                isTypeActive(null)
                  ? "bg-amber-700 text-white"
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
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 ${
                  isTypeActive(type.slug.current)
                    ? "bg-amber-700 text-white"
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
