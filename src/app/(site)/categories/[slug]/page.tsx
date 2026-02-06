import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Container from "@/components/layout/Container";
import { sanityFetch } from "@/lib/sanity/fetch";
import { urlFor } from "@/lib/sanity/image";
import { defineQuery } from "next-sanity";
import { notFound } from "next/navigation";

const getCategoryBySlugQuery = defineQuery(`*[_type == "category" && slug.current == $slug][0] {
  _id,
  title,
  slug,
  description,
  image
}`);

const getProductsByCategoryQuery = defineQuery(`*[_type == "product" && category._ref == $categoryId && visibility != "hidden"] | order(title asc) {
  _id,
  title,
  slug,
  description,
  price,
  images,
  isFeatured
}`);

const getAllCategorySlugsQuery = defineQuery(`*[_type == "category"]{ "slug": slug.current }`);

interface Category {
  _id: string;
  title: string;
  slug: { current: string };
  description?: string;
  image?: { asset?: { _ref: string } };
}

interface Product {
  _id: string;
  title: string;
  slug: { current: string };
  description?: string;
  price: number;
  images?: { asset?: { _ref: string } }[];
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
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const category = await sanityFetch<Category | null>({
    query: getCategoryBySlugQuery,
    params: { slug },
    tags: ["category"],
  });

  if (!category) notFound();

  const products = await sanityFetch<Product[]>({
    query: getProductsByCategoryQuery,
    params: { categoryId: category._id },
    tags: ["product"],
  });

  return (
    <>
      {/* Category Header */}
      <section className="relative bg-gray-900 py-16">
        {category.image?.asset?._ref && (
          <Image
            src={urlFor(category.image).width(1920).height(400).auto("format").url()}
            alt={category.title}
            fill
            className="object-cover opacity-30"
          />
        )}
        <Container className="relative z-10">
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            {category.title}
          </h1>
          {category.description && (
            <p className="mt-4 max-w-2xl text-lg text-gray-300">
              {category.description}
            </p>
          )}
        </Container>
      </section>

      {/* Products Grid */}
      <Container className="py-12">
        {products.length === 0 ? (
          <p className="text-center text-lg text-gray-600">
            No products in this category yet. Check back soon!
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <Link
                key={product._id}
                href={`/products/${product.slug.current}`}
                className="group overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                  {product.images?.[0]?.asset?._ref ? (
                    <Image
                      src={urlFor(product.images[0]).width(600).height(450).auto("format").url()}
                      alt={product.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-gray-400">
                      <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5a2.25 2.25 0 002.25-2.25V5.25a2.25 2.25 0 00-2.25-2.25H3.75a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 003.75 21z" />
                      </svg>
                    </div>
                  )}
                  {product.isFeatured && (
                    <span className="absolute right-2 top-2 rounded bg-amber-600 px-2 py-0.5 text-xs font-medium text-white">
                      Featured
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-amber-900">
                    {product.title}
                  </h3>
                  {product.description && (
                    <p className="mt-1 line-clamp-2 text-sm text-gray-600">
                      {product.description}
                    </p>
                  )}
                  {product.price > 0 && (
                    <p className="mt-2 text-sm font-medium text-amber-900">
                      From ${product.price.toFixed(2)} / sq ft
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </Container>
    </>
  );
}
