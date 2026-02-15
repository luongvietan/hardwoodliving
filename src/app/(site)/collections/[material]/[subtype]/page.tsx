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
import { getCollectionMaterial, isValidCollectionSubtype } from "@/lib/url-structure";
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
  const params: { material: string; subtype: string }[] = [];
  const materials = [
    { slug: "hardwood", subs: ["unfinished", "prefinished"] },
    { slug: "engineered", subs: ["unfinished", "prefinished"] },
    { slug: "luxury-vinyl-plank", subs: ["spc", "wpc"] },
  ];
  for (const m of materials) {
    for (const s of m.subs) {
      params.push({ material: m.slug, subtype: s });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ material: string; subtype: string }>;
}): Promise<Metadata> {
  const { material, subtype } = await params;
  const mat = getCollectionMaterial(material);
  if (!mat || !isValidCollectionSubtype(material, subtype)) return { title: "Not Found" };
  const sub = mat.subtypes.find((s) => s.slug === subtype);
  return {
    title: `${mat.title} — ${sub?.title ?? subtype} | Collections`,
    description: mat.description,
    alternates: { canonical: `${SITE_URL}/collections/${mat.slug}/${subtype}` },
    ...(!mat.indexable && { robots: { index: false, follow: false } }),
  };
}

export default async function CollectionSubtypePage({
  params,
}: {
  params: Promise<{ material: string; subtype: string }>;
}) {
  const { material, subtype } = await params;
  const mat = getCollectionMaterial(material);
  if (!mat || !isValidCollectionSubtype(material, subtype)) notFound();

  const sub = mat.subtypes.find((s) => s.slug === subtype)!;

  const breadcrumbItems = [
    { name: "Home", url: SITE_URL },
    { name: "Collections", url: `${SITE_URL}/collections` },
    { name: mat.title, url: `${SITE_URL}/collections/${mat.slug}` },
    { name: sub.title, url: `${SITE_URL}/collections/${mat.slug}/${sub.slug}` },
  ];

  const role = await getUserRole();
  const visibility = getVisibilityOptions(role);
  const products = await sanityFetch<Product[]>({
    query: getVisibleProductsByCategoryAndTypeQuery,
    params: { category: mat.categorySlug, type: subtype, visibility },
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

  const pageTitle = `${mat.title} — ${sub.title}`;

  return (
    <>
      <JsonLd data={buildBreadcrumbJsonLd(breadcrumbItems)} />
      <section className="relative bg-charcoal py-16">
        {category?.image?.asset?._ref && (
          <Image
            src={urlFor(category.image).width(1920).height(400).auto("format").url()}
            alt={pageTitle}
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-30"
          />
        )}
        <Container className="relative z-10">
          <h1 className="text-3xl font-bold uppercase tracking-wider text-white sm:text-4xl">
            {pageTitle}
          </h1>
          {(category?.description || mat.description) && (
            <p className="mt-4 max-w-2xl text-lg text-gray-300">
              {category?.description ?? mat.description}
            </p>
          )}
          <nav className="mt-4 flex flex-wrap gap-2">
            <Link
              href={`/collections/${mat.slug}`}
              className="text-sm text-gray-400 hover:text-white"
            >
              All {mat.title}
            </Link>
            {mat.subtypes.map((s) => (
              <Link
                key={s.slug}
                href={`/collections/${mat.slug}/${s.slug}`}
                className={`text-sm ${s.slug === subtype ? "font-semibold text-accent-orange" : "text-gray-400 hover:text-white"}`}
              >
                {s.title}
              </Link>
            ))}
          </nav>
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
