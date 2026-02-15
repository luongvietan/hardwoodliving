import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import type { SanityImageValue } from "@/lib/sanity/types";
import Container from "@/components/layout/Container";
import PortableText from "@/components/sanity/PortableText";
import ProductGrid from "@/components/products/ProductGrid";
import ProductFilter from "@/components/products/ProductFilter";
import JsonLd, { buildBreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { sanityFetch } from "@/lib/sanity/fetch";
import { urlFor } from "@/lib/sanity/image";
import {
  getCategoryBySlugQuery,
  getVisibleProductsByCategoryAndDescendantsQuery,
  getAllCategorySlugsQuery,
  getAllCategoriesQuery,
  getAllCategoriesWithParentQuery,
  getSubcategoriesByParentSlugQuery,
} from "@/lib/sanity/queries";
import { getUserRole, getVisibilityOptions } from "@/lib/sanity/visibility";
import { notFound } from "next/navigation";
import { SITE_URL } from "@/lib/constants";
import { flattenAncestors, getDescendantSlugs } from "@/lib/category-tree";

interface Category {
  _id: string;
  title: string;
  slug: { current: string };
  description?: string;
  image?: SanityImageValue;
  body?: Record<string, unknown>[];
  parent?: Category | null;
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

export async function generateStaticParams() {
  const categories = await sanityFetch<{ slug: string }[]>({
    query: getAllCategorySlugsQuery,
    tags: ["category"],
  });
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = await sanityFetch<Category | null>({
    query: getCategoryBySlugQuery,
    params: { slug },
    tags: ["category"],
  });
  if (!category) return { title: "Category Not Found" };
  return {
    title: category.title,
    description: category.description || `Browse our ${category.title} collection.`,
    alternates: {
      canonical: `/categories/${slug}`,
    },
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { slug } = await params;
  const paramsData = searchParams ? await searchParams : {};
  const categoryFilterParam = typeof paramsData.category === "string" ? paramsData.category : undefined;
  const typeFilterParam = typeof paramsData.type === "string" ? paramsData.type : undefined;

  const category = await sanityFetch<Category | null>({
    query: getCategoryBySlugQuery,
    params: { slug },
    tags: ["category"],
  });

  if (!category) notFound();

  const [allCategoriesRaw, allWithParentRaw, subcategoriesRaw] = await Promise.all([
    sanityFetch<Category[] | null>({
      query: getAllCategoriesQuery,
      tags: ["category"],
    }),
    sanityFetch<{ slug: string; parentSlug: string | null }[] | null>({
      query: getAllCategoriesWithParentQuery,
      tags: ["category"],
    }),
    sanityFetch<Category[] | null>({
      query: getSubcategoriesByParentSlugQuery,
      params: { slug: category.slug.current },
      tags: ["category"],
    }),
  ]);

  const allCategories = allCategoriesRaw ?? [];
  const allWithParent = allWithParentRaw ?? [];
  const subcategories = subcategoriesRaw ?? [];

  const ancestorChain = flattenAncestors(category);
  const descendantSlugs = getDescendantSlugs(category.slug.current, allWithParent);
  const categorySlugs = [category.slug.current, ...descendantSlugs];

  const defaultCategorySlug = ancestorChain.length > 0 ? ancestorChain[0].slug.current : category.slug.current;
  const defaultTypeSlug = categoryFilterParam ? undefined : (category.parent ? category.slug.current : undefined);
  const activeCategorySlug = categoryFilterParam ?? defaultCategorySlug;
  const activeTypeSlug = typeFilterParam ?? defaultTypeSlug;

  const productTypeOptions = allCategories.filter(
    (cat) => cat.parent?.slug?.current === activeCategorySlug
  );

  const role = await getUserRole();
  const visibility = getVisibilityOptions(role);
  const revalidate = role === "public" ? 60 : 0;

  const products = await sanityFetch<Product[]>({
    query: getVisibleProductsByCategoryAndDescendantsQuery,
    params: {
      categorySlugs,
      type: activeTypeSlug ?? "",
      visibility,
    },
    tags: ["product"],
    revalidate,
  });

  // Build breadcrumb items for JSON-LD (full ancestor chain)
  const breadcrumbItems = [
    { name: "Home", url: SITE_URL },
    { name: "Products", url: `${SITE_URL}/products` },
    ...ancestorChain.map((a) => ({ name: a.title, url: `${SITE_URL}/categories/${a.slug.current}` })),
    { name: category.title, url: `${SITE_URL}/categories/${slug}` },
  ];

  return (
    <>
      {/* Structured Data */}
      <JsonLd data={buildBreadcrumbJsonLd(breadcrumbItems)} />

      {/* Category Header */}
      <section className="relative bg-charcoal py-16">
        {category.image?.asset?._ref && (
          <Image
            src={urlFor(category.image).width(1920).height(400).auto("format").url()}
            alt={category.title}
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-30"
          />
        )}
        <Container className="relative z-10">
          <h1 className="text-3xl font-bold uppercase tracking-wider text-white sm:text-4xl">
            {category.title}
          </h1>
          {category.description && (
            <p className="mt-4 max-w-2xl text-lg text-gray-300">
              {category.description}
            </p>
          )}
        </Container>
      </section>

      {category.body && category.body.length > 0 && (
        <Container className="py-12">
          <article className="mx-auto max-w-3xl">
            <div className="prose-content">
              <PortableText value={category.body} />
            </div>
          </article>
        </Container>
      )}

      {/* Products Grid */}
      <Container className="py-12">
        <ProductFilter
          allCategoriesPath="/products"
          basePath={`/categories/${slug}`}
          categoryRouteBase="/categories"
          categories={allCategories.filter((cat) => !cat.parent)}
          productTypes={productTypeOptions}
          activeCategory={activeCategorySlug}
          activeType={activeTypeSlug}
        />

        {subcategories.length > 0 && (
          <div className="mb-8">
            <h2 className="mb-2 text-sm font-semibold uppercase tracking-wider text-gray-500">
              Browse Subcategories
            </h2>
            <div className="flex flex-wrap gap-2">
              {subcategories.map((sub) => (
                <Link
                  key={sub._id}
                  href={`/categories/${sub.slug.current}`}
                  className="bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700 hover:bg-accent-orange hover:text-white"
                >
                  {sub.title}
                </Link>
              ))}
            </div>
          </div>
        )}

        <ProductGrid
          products={products}
          emptyMessage="No products in this category yet. Check back soon!"
        />
      </Container>
    </>
  );
}
