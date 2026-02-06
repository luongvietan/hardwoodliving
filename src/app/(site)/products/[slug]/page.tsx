import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import type { SanityImageValue } from "@/lib/sanity/types";
import Container from "@/components/layout/Container";
import { sanityFetch } from "@/lib/sanity/fetch";
import { getProductBySlugQuery } from "@/lib/sanity/queries";
import { urlFor } from "@/lib/sanity/image";
import { defineQuery } from "next-sanity";
import { notFound } from "next/navigation";

const getAllProductSlugsQuery = defineQuery(`*[_type == "product" && visibility != "hidden"]{ "slug": slug.current }`);

interface Product {
  _id: string;
  title: string;
  slug: { current: string };
  description?: string;
  specs?: { label: string; value: string; _key: string }[];
  price: number;
  images?: SanityImageValue[];
  category?: {
    _id: string;
    title: string;
    slug: { current: string };
  };
  visibility?: string;
  isFeatured?: boolean;
}

export async function generateStaticParams() {
  const products = await sanityFetch<{ slug: string }[]>({
    query: getAllProductSlugsQuery,
    tags: ["product"],
  });
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await sanityFetch<Product | null>({
    query: getProductBySlugQuery,
    params: { slug },
    tags: ["product"],
  });
  if (!product) return { title: "Product Not Found" };
  return {
    title: product.title,
    description: product.description || `View ${product.title} details.`,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const product = await sanityFetch<Product | null>({
    query: getProductBySlugQuery,
    params: { slug },
    tags: ["product"],
  });

  if (!product) notFound();

  const mainImage = product.images?.[0];

  return (
    <Container className="py-12">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-sm text-gray-500">
        <Link href="/" className="hover:text-amber-900">Home</Link>
        <span>/</span>
        {product.category && (
          <>
            <Link
              href={`/categories/${product.category.slug.current}`}
              className="hover:text-amber-900"
            >
              {product.category.title}
            </Link>
            <span>/</span>
          </>
        )}
        <span className="text-gray-900">{product.title}</span>
      </nav>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        {/* Product Images */}
        <div>
          {/* Main Image */}
          <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
            {mainImage?.asset?._ref ? (
              <Image
                src={urlFor(mainImage).width(800).height(800).auto("format").url()}
                alt={product.title}
                fill
                priority
                className="object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-gray-400">
                <svg className="h-20 w-20" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5a2.25 2.25 0 002.25-2.25V5.25a2.25 2.25 0 00-2.25-2.25H3.75a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 003.75 21z" />
                </svg>
              </div>
            )}
          </div>

          {/* Thumbnail Gallery */}
          {product.images && product.images.length > 1 && (
            <div className="mt-4 grid grid-cols-4 gap-2">
              {product.images.slice(1, 5).map((img, i) => (
                <div key={img._key || i} className="relative aspect-square overflow-hidden rounded-md bg-gray-100">
                  {img.asset?._ref && (
                    <Image
                      src={urlFor(img).width(200).height(200).auto("format").url()}
                      alt={`${product.title} - Image ${i + 2}`}
                      fill
                      className="object-cover"
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          {product.isFeatured && (
            <span className="mb-3 inline-block rounded bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800">
              Featured
            </span>
          )}
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            {product.title}
          </h1>

          {product.price > 0 && (
            <p className="mt-3 text-2xl font-semibold text-amber-900">
              ${product.price.toFixed(2)} <span className="text-base font-normal text-gray-500">/ sq ft</span>
            </p>
          )}

          {product.description && (
            <p className="mt-6 leading-7 text-gray-700">{product.description}</p>
          )}

          {/* Specifications */}
          {product.specs && product.specs.length > 0 && (
            <div className="mt-8">
              <h2 className="text-lg font-semibold text-gray-900">Specifications</h2>
              <dl className="mt-3 divide-y divide-gray-200 border-t border-gray-200">
                {product.specs.map((spec) => (
                  <div key={spec._key || spec.label} className="flex justify-between py-3 text-sm">
                    <dt className="font-medium text-gray-500">{spec.label}</dt>
                    <dd className="text-gray-900">{spec.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          {/* CTA */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/contact"
              className="rounded-md bg-amber-700 px-6 py-3 text-center text-sm font-semibold text-white shadow-sm transition-colors hover:bg-amber-600"
            >
              Request a Quote
            </Link>
            {product.category && (
              <Link
                href={`/categories/${product.category.slug.current}`}
                className="rounded-md border border-gray-300 bg-white px-6 py-3 text-center text-sm font-semibold text-gray-900 shadow-sm transition-colors hover:bg-gray-50"
              >
                View All {product.category.title}
              </Link>
            )}
          </div>
        </div>
      </div>
    </Container>
  );
}
