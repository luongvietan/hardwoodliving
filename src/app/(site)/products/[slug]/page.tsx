import type { Metadata } from "next";
import dynamic from "next/dynamic";
import Link from "next/link";
import type { SanityImageValue } from "@/lib/sanity/types";
import Container from "@/components/layout/Container";
import ProductSpecs, { type ProductSpecifications } from "@/components/products/ProductSpecs";
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
  specifications?: ProductSpecifications | null;
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
  const hasSpecs =
    (product.specifications && Object.values(product.specifications).some((v) => v != null && String(v).trim() !== "")) ||
    (product.specs && product.specs.length > 0);

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
        <Link href="/" className="uppercase text-accent-orange hover:text-accent-orange-hover">Home</Link>
        <span>/</span>
        {product.category && (
          <>
            <Link
              href={`/categories/${product.category.slug.current}`}
              className="uppercase text-accent-orange hover:text-accent-orange-hover"
            >
              {product.category.title}
            </Link>
            <span>/</span>
          </>
        )}
        <span className="font-medium text-gray-900">{product.title}</span>
      </nav>

      {/* Product details: left = image + title/price/description, right = specifications */}
      <div
        className={`grid gap-6 lg:items-stretch ${hasSpecs ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1"}`}
      >
        {/* Left column: image on top, product title & price & description below */}
        <div className="flex flex-col gap-6">
          <div className="overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
            <ProductGallery images={product.images} productTitle={product.title} />
          </div>
          <div className="rounded-lg border border-gray-200 p-6">
            {product.isFeatured && (
              <span className="mb-3 inline-block bg-accent-orange px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-white">
                Featured
              </span>
            )}
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 md:text-3xl">
              {product.title}
            </h1>
            <ProductPrice price={product.price} priceUnit={product.priceUnit} />
            {product.description && (
              <p className="mt-4 leading-7 text-gray-700">{product.description}</p>
            )}
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                href={`/contact?product=${encodeURIComponent(product.title)}`}
                className="bg-accent-orange px-6 py-3 text-center text-sm font-semibold uppercase tracking-wider text-white transition-colors hover:bg-accent-orange-hover"
              >
                Get Consultation
              </Link>
              {product.category && (
                <Link
                  href={`/categories/${product.category.slug.current}`}
                  className="border border-charcoal px-6 py-3 text-center text-sm font-semibold uppercase tracking-wider text-charcoal-dark transition-colors hover:bg-charcoal hover:text-white"
                >
                  View All {product.category.title}
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Right column: Product Specifications (full height), only when specs exist */}
        {hasSpecs ? (
          <div className="lg:min-h-0">
            <div className="h-full rounded-lg border border-gray-200 p-6">
              <ProductSpecs
                specifications={product.specifications}
                specs={product.specs}
                title="Product Specifications"
              />
            </div>
          </div>
        ) : null}
      </div>
    </Container>
  );
}
