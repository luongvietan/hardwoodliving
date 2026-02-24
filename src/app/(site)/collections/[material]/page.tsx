import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Container from "@/components/layout/Container";
import ProductGrid from "@/components/products/ProductGrid";
import JsonLd, { buildBreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { sanityFetch } from "@/lib/sanity/fetch";
import { urlFor } from "@/lib/sanity/image";
import {
  getVisibleProductsByCategoryAndTypeQuery,
  getCategoryBySlugQuery,
} from "@/lib/sanity/queries";
import { getUserRole, getVisibilityOptions } from "@/lib/sanity/visibility";
import { notFound } from "next/navigation";
import { SITE_URL } from "@/lib/constants";
import { getCollectionMaterial } from "@/lib/url-structure";
import type { SanityImageValue } from "@/lib/sanity/types";

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
  const materials = [
    "hardwood",
    "engineered",
    "luxury-vinyl-plank",
    "laminate",
    "tile",
    "carpet-tile",
  ];
  return materials.map((material) => ({ material }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ material: string }>;
}): Promise<Metadata> {
  const { material } = await params;
  const mat = getCollectionMaterial(material);
  if (!mat) return { title: "Not Found" };
  return {
    title: `${mat.title} | Collections`,
    description: mat.description,
    alternates: { canonical: `${SITE_URL}/collections/${mat.slug}` },
    ...(!mat.indexable && { robots: { index: false, follow: false } }),
  };
}

export default async function CollectionMaterialPage({
  params,
}: {
  params: Promise<{ material: string }>;
}) {
  const { material } = await params;
  const mat = getCollectionMaterial(material);
  if (!mat) notFound();

  const breadcrumbItems = [
    { name: "Home", url: SITE_URL },
    { name: "Collections", url: `${SITE_URL}/collections` },
    { name: mat.title, url: `${SITE_URL}/collections/${mat.slug}` },
  ];

  const role = await getUserRole();
  const visibility = getVisibilityOptions(role);
  const products = await sanityFetch<Product[]>({
    query: getVisibleProductsByCategoryAndTypeQuery,
    params: { category: mat.categorySlug, materialType: mat.materialType, type: "", visibility },
    tags: ["product"],
    revalidate: role === "public" ? 60 : 0,
  });

  const category = await sanityFetch<{
    image?: SanityImageValue;
    description?: string;
  } | null>({
    query: getCategoryBySlugQuery,
    params: { slug: mat.categorySlug },
    tags: ["category"],
  });

  return (
    <>
      <JsonLd data={buildBreadcrumbJsonLd(breadcrumbItems)} />
      <section className="relative bg-charcoal py-16">
        {category?.image?.asset?._ref && (
          <Image
            src={urlFor(category.image).width(1920).height(400).auto("format").url()}
            alt={mat.title}
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-30"
          />
        )}
        <Container className="relative z-10">
          <h1 className="text-3xl font-bold uppercase tracking-wider text-white sm:text-4xl">
            {mat.title}
          </h1>
          {(category?.description || mat.description) && (
            <p className="mt-4 max-w-2xl text-lg text-gray-300">
              {category?.description ?? mat.description}
            </p>
          )}
          {mat.subtypes.length > 0 && (
            <nav className="mt-4 flex flex-wrap gap-2">
              {mat.subtypes.map((s) => (
                <Link
                  key={s.slug}
                  href={`/collections/${mat.slug}/${s.slug}`}
                  className="rounded border border-white/40 px-3 py-1.5 text-sm text-gray-300 transition-colors hover:border-accent-orange hover:text-accent-orange"
                >
                  {s.title}
                </Link>
              ))}
            </nav>
          )}
        </Container>
      </section>
      <Container className="py-12">
        <ProductGrid
          products={products}
          emptyMessage="No products in this collection yet. Check back soon!"
        />
      </Container>
    </>
  );
}
