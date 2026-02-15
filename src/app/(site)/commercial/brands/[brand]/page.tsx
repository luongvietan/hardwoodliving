import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/layout/Container";
import ProductGrid from "@/components/products/ProductGrid";
import JsonLd, { buildBreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { sanityFetch } from "@/lib/sanity/fetch";
import { getUserRole, getVisibilityOptions } from "@/lib/sanity/visibility";
import { getVisibleProductsByCategoryAndTypeQuery } from "@/lib/sanity/queries";
import { notFound } from "next/navigation";
import { SITE_URL } from "@/lib/constants";
import { COMMERCIAL_BRANDS } from "@/lib/url-structure";
import type { SanityImageValue } from "@/lib/sanity/types";

const BRAND_CATEGORY_MAP: Record<string, string> = {
  harbinger: "harbinger-vinyl",
  dynoflex: "dynoflex",
  acoustiguard: "acoustiguard",
  "acrylic-infused": "acrylic-infused",
};

interface Product {
  _id: string;
  title: string;
  slug: { current: string };
  description?: string;
  price: number;
  priceUnit?: string;
  images?: SanityImageValue[];
}

export async function generateStaticParams() {
  return COMMERCIAL_BRANDS.map((b) => ({ brand: b.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ brand: string }>;
}): Promise<Metadata> {
  const { brand } = await params;
  const b = COMMERCIAL_BRANDS.find((x) => x.slug === brand);
  if (!b) return { title: "Not Found" };
  return {
    title: `${b.title} | Commercial Brands`,
    description: `Explore ${b.title} commercial flooring products.`,
    alternates: { canonical: `${SITE_URL}/commercial/brands/${b.slug}` },
  };
}

export default async function CommercialBrandPage({
  params,
}: {
  params: Promise<{ brand: string }>;
}) {
  const { brand } = await params;
  const b = COMMERCIAL_BRANDS.find((x) => x.slug === brand);
  if (!b) notFound();

  const categorySlug = BRAND_CATEGORY_MAP[brand];
  const role = await getUserRole();
  const visibility = getVisibilityOptions(role);
  const products = await sanityFetch<Product[]>({
    query: getVisibleProductsByCategoryAndTypeQuery,
    params: { category: categorySlug, type: null, visibility },
    tags: ["product"],
    revalidate: role === "public" ? 60 : 0,
  });

  const breadcrumbItems = [
    { name: "Home", url: SITE_URL },
    { name: "Commercial", url: `${SITE_URL}/commercial` },
    { name: "Brands", url: `${SITE_URL}/commercial/brands` },
    { name: b.title, url: `${SITE_URL}/commercial/brands/${b.slug}` },
  ];

  return (
    <>
      <JsonLd data={buildBreadcrumbJsonLd(breadcrumbItems)} />
      <section className="bg-charcoal py-16">
        <Container>
          <h1 className="text-3xl font-bold uppercase tracking-wider text-white sm:text-4xl">
            {b.title}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-gray-300">
            Commercial flooring products from {b.title}.
          </p>
        </Container>
      </section>
      <Container className="py-12">
        <ProductGrid
          products={products}
          emptyMessage={`No ${b.title} products yet. Check back soon!`}
        />
      </Container>
    </>
  );
}
