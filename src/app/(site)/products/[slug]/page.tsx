import type { Metadata } from "next";
import dynamic from "next/dynamic";
import Link from "next/link";
import type { SanityImageValue } from "@/lib/sanity/types";
import Container from "@/components/layout/Container";
import ProductSpecs from "@/components/products/ProductSpecs";
import ProductPrice from "@/components/products/ProductPrice";
import JsonLd, { buildProductJsonLd, buildBreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { sanityFetch } from "@/lib/sanity/fetch";
import { urlFor } from "@/lib/sanity/image";
import { getVisibleProductBySlugQuery, getPublicProductSlugsQuery } from "@/lib/sanity/queries";
import { getUserRole, getVisibilityOptions } from "@/lib/sanity/visibility";
import { notFound } from "next/navigation";
import { SITE_URL } from "@/lib/constants";

/** Dynamically import ProductGallery for code splitting (heavy component with image logic) */
const ProductGallery = dynamic(
  () => import("@/components/products/ProductGallery"),
  { ssr: true }
);

interface Product {
  _id: string;
  title: string;
  slug: { current: string };
  description?: string;
  specs?: { label: string; value: string; _key: string }[];
  price: number;
  priceUnit?: string;
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
    query: getPublicProductSlugsQuery,
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
  const role = await getUserRole();
  const visibility = getVisibilityOptions(role);
  const revalidate = role === "public" ? 60 : 0;
  const product = await sanityFetch<Product | null>({
    query: getVisibleProductBySlugQuery,
    params: { slug, visibility },
    tags: ["product"],
    revalidate,
  });
  if (!product) return { title: "Product Not Found" };
  return {
    title: product.title,
    description: product.description || `View ${product.title} details.`,
    alternates: {
      canonical: `/products/${slug}`,
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const role = await getUserRole();
  const visibility = getVisibilityOptions(role);
  const revalidate = role === "public" ? 60 : 0;

  const product = await sanityFetch<Product | null>({
    query: getVisibleProductBySlugQuery,
    params: { slug, visibility },
    tags: ["product"],
    revalidate,
  });

  if (!product) notFound();

  // Build image URL for structured data
  const productImageUrl = product.images?.[0]?.asset?._ref
    ? urlFor(product.images[0]).width(800).height(800).auto("format").url()
    : undefined;

  // Build breadcrumb items for JSON-LD
  const breadcrumbItems = [
    { name: "Home", url: SITE_URL },
    { name: "Products", url: `${SITE_URL}/products` },
    ...(product.category
      ? [{ name: product.category.title, url: `${SITE_URL}/categories/${product.category.slug.current}` }]
      : []),
    { name: product.title, url: `${SITE_URL}/products/${slug}` },
  ];

  return (
    <Container className="py-12">
      {/* Structured Data */}
      <JsonLd
        data={buildProductJsonLd({
          name: product.title,
          description: product.description,
          image: productImageUrl,
          price: product.price,
          url: `${SITE_URL}/products/${slug}`,
        })}
      />
      <JsonLd data={buildBreadcrumbJsonLd(breadcrumbItems)} />

      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-sm text-gray-500">
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
        {/* Product Image Gallery */}
        <ProductGallery images={product.images} productTitle={product.title} />

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

          <ProductPrice price={product.price} priceUnit={product.priceUnit} />

          {product.description && (
            <p className="mt-6 leading-7 text-gray-700">{product.description}</p>
          )}

          <ProductSpecs specs={product.specs} />

          {/* CTA */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href={`/contact?product=${encodeURIComponent(product.title)}`}
              className="rounded-md bg-amber-700 px-6 py-3 text-center text-sm font-semibold text-white shadow-sm transition-colors hover:bg-amber-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500"
            >
              Get Consultation
            </Link>
            {product.category && (
              <Link
                href={`/categories/${product.category.slug.current}`}
                className="rounded-md border border-gray-300 bg-white px-6 py-3 text-center text-sm font-semibold text-gray-900 shadow-sm transition-colors hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-500"
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
