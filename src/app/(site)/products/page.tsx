import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import type { SanityImageValue } from "@/lib/sanity/types";
import Container from "@/components/layout/Container";
import ProductGrid from "@/components/products/ProductGrid";
import ProductFilter from "@/components/products/ProductFilter";
import { sanityFetch } from "@/lib/sanity/fetch";
import { urlFor } from "@/lib/sanity/image";
import {
  getAllCategoriesQuery,
  getAllCategoriesWithParentQuery,
  getTopLevelCategoriesQuery,
  getVisibleProductsByCategoryAndDescendantsQuery,
} from "@/lib/sanity/queries";
import { getUserRole, getVisibilityOptions } from "@/lib/sanity/visibility";
import { getDescendantSlugs } from "@/lib/category-tree";

interface Category {
  _id: string;
  title: string;
  slug: { current: string };
  description?: string;
  image?: SanityImageValue | null;
  parent?: { _id: string; title: string; slug: { current: string } } | null;
}

interface Product {
  _id: string;
  title: string;
  slug: { current: string };
  description?: string;
  price: number;
  priceUnit?: string;
  images?: SanityImageValue[];
  isFeatured?: boolean;
}

export const metadata: Metadata = {
  title: "Flooring Product Catalog | Shop Hardwood, Vinyl & Laminate",
  description:
    "Browse our complete range of premium flooring products — hardwood, engineered wood, luxury vinyl, and laminate. Filter by category and find your perfect floor.",
  keywords: [
    "buy hardwood flooring",
    "flooring products Canada",
    "shop hardwood floors online",
    "engineered wood floors",
    "vinyl flooring products",
  ],
  openGraph: {
    title: "Flooring Product Catalog | Shop Hardwood, Vinyl & Laminate",
    description:
      "Browse premium flooring products — hardwood, engineered wood, luxury vinyl, and laminate. Filter by category at Hardwood Living.",
    url: `${SITE_URL}/products`,
  },
  alternates: {
    canonical: `${SITE_URL}/products`,
  },
};

export default async function ProductsCatalogPage({
  searchParams,
}: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = searchParams ? await searchParams : {};
  const categoryFilter = typeof params.category === "string" ? params.category : undefined;
  const typeFilter = typeof params.type === "string" ? params.type : undefined;

  const [allCategoriesRaw, allWithParentRaw, topLevelCategoriesRaw] = await Promise.all([
    sanityFetch<Category[] | null>({
      query: getAllCategoriesQuery,
      tags: ["category"],
    }),
    sanityFetch<{ slug: string; parentSlug: string | null }[] | null>({
      query: getAllCategoriesWithParentQuery,
      tags: ["category"],
    }),
    sanityFetch<Category[] | null>({
      query: getTopLevelCategoriesQuery,
      tags: ["category"],
    }),
  ]);

  const allCategories = allCategoriesRaw ?? [];
  const allWithParent = allWithParentRaw ?? [];
  const topLevelCategories = topLevelCategoriesRaw ?? [];

  const subcategories = allCategories.filter((category) => category.parent?.slug?.current);

  const inferredCategoryFromType = typeFilter
    ? allCategories.find((c) => c.slug.current === typeFilter)?.parent?.slug.current
    : undefined;

  const activeCategorySlug = categoryFilter ?? inferredCategoryFromType;
  const activeTypeSlug = typeFilter;

  const productTypeOptions = activeCategorySlug
    ? subcategories.filter((category) => category.parent?.slug.current === activeCategorySlug)
    : subcategories;

  // Fetch products when filters are active (category + all descendants)
  let filteredProducts: Product[] | null = null;
  if (activeCategorySlug || activeTypeSlug) {
    const role = await getUserRole();
    const visibility = getVisibilityOptions(role);
    const revalidate = role === "public" ? 60 : 0;
    const categorySlugs = activeCategorySlug
      ? [activeCategorySlug, ...getDescendantSlugs(activeCategorySlug, allWithParent)]
      : activeTypeSlug
        ? [activeTypeSlug]
        : [];
    filteredProducts = await sanityFetch<Product[]>({
      query: getVisibleProductsByCategoryAndDescendantsQuery,
      params: {
        categorySlugs,
        type: activeTypeSlug ?? "",
        visibility,
      },
      tags: ["product"],
      revalidate,
    });
  }

  // Determine active category title for display
  const activeCategoryData = activeCategorySlug
    ? allCategories.find((c) => c.slug.current === activeCategorySlug)
    : null;

  return (
    <>
      {/* Page Header */}
      <section className="bg-charcoal py-16">
        <Container>
          <h1 className="text-3xl font-bold uppercase tracking-wider text-white sm:text-4xl">
            {activeCategoryData?.title || "Product Catalog"}
          </h1>
          {activeCategoryData?.description && (
            <p className="mt-4 max-w-2xl text-lg text-gray-300">
              {activeCategoryData.description}
            </p>
          )}
        </Container>
      </section>

      <Container className="py-12">
        {/* Filter bar */}
        <ProductFilter
          basePath="/products"
          categories={topLevelCategories}
          productTypes={productTypeOptions}
          activeCategory={activeCategorySlug}
          activeType={activeTypeSlug}
        />

        {/* Show filtered products or category grid */}
        {(activeCategorySlug || activeTypeSlug) && filteredProducts !== null ? (
          <ProductGrid
            products={filteredProducts}
            emptyMessage={`No products found in ${activeCategoryData?.title || "this category"}. Check back soon!`}
          />
        ) : (
          <>
            {topLevelCategories.length === 0 ? (
              <p className="text-center text-lg text-gray-600">
                No categories found. Check back soon!
              </p>
            ) : (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {topLevelCategories.map((category) => {
                  const childCategories = subcategories.filter(
                    (sub) => sub.parent?.slug.current === category.slug.current
                  );
                  return (
                    <div
                      key={category._id}
                      className="group overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md"
                    >
                      <Link href={`/categories/${category.slug.current}`}>
                        <div className="relative aspect-[16/9] overflow-hidden bg-gray-100">
                          {category.image?.asset?._ref ? (
                            <Image
                              src={urlFor(category.image)
                                .width(800)
                                .height(450)
                                .auto("format")
                                .url()}
                              alt={category.title}
                              fill
                              sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                              loading="lazy"
                              className="object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center text-gray-400">
                              <svg
                                className="h-16 w-16"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1}
                                stroke="currentColor"
                                aria-hidden="true"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M2.25 7.125C2.25 6.504 2.754 6 3.375 6h6c.621 0 1.125.504 1.125 1.125v3.75c0 .621-.504 1.125-1.125 1.125h-6a1.125 1.125 0 01-1.125-1.125v-3.75zM14.25 8.625c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v8.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 01-1.125-1.125v-8.25zM3.75 16.125c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v2.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 01-1.125-1.125v-2.25z"
                                />
                              </svg>
                            </div>
                          )}
                        </div>
                      </Link>
                      <div className="p-4">
                        <Link href={`/categories/${category.slug.current}`}>
                          <h2 className="text-lg font-semibold text-charcoal-dark group-hover:text-accent-orange">
                            {category.title}
                          </h2>
                        </Link>
                        {category.description && (
                          <p className="mt-1 line-clamp-2 text-sm text-gray-600">
                            {category.description}
                          </p>
                        )}
                        {childCategories.length > 0 && (
                          <div className="mt-2 text-xs text-gray-500">
                            <span className="font-semibold uppercase tracking-wide text-gray-400">
                              Subcategories:
                            </span>
                            <div className="mt-1 flex flex-wrap gap-2">
                              {childCategories.slice(0, 4).map((sub) => (
                                <Link
                                  key={sub._id}
                                  href={`/categories/${sub.slug.current}`}
                                  className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] text-gray-600 hover:bg-gray-200"
                                >
                                  {sub.title}
                                </Link>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </Container>
    </>
  );
}
