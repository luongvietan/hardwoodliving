import type { Metadata } from "next";
import Container from "@/components/layout/Container";
import PortableText from "@/components/sanity/PortableText";
import { sanityFetch } from "@/lib/sanity/fetch";
import { getPageQuery } from "@/lib/sanity/queries";
import { defineQuery } from "next-sanity";
import { notFound } from "next/navigation";

/* eslint-disable @typescript-eslint/no-explicit-any */

const getAllPageSlugsQuery = defineQuery(`*[_type == "page"]{ "slug": slug.current }`);

interface PageData {
  title: string;
  body?: any[];
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    openGraphImage?: any;
  };
}

export async function generateStaticParams() {
  const pages = await sanityFetch<{ slug: string }[]>({
    query: getAllPageSlugsQuery,
    tags: ["page"],
  });
  return pages.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = await sanityFetch<PageData | null>({
    query: getPageQuery,
    params: { slug },
    tags: ["page"],
  });
  if (!page) return { title: "Page Not Found" };
  return {
    title: page.seo?.metaTitle || page.title,
    description: page.seo?.metaDescription || undefined,
  };
}

export default async function ContentPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const page = await sanityFetch<PageData | null>({
    query: getPageQuery,
    params: { slug },
    tags: ["page"],
  });

  if (!page) notFound();

  return (
    <Container className="py-12">
      <article className="mx-auto max-w-3xl">
        <h1 className="mb-8 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          {page.title}
        </h1>
        {page.body ? (
          <div className="prose-content">
            <PortableText value={page.body} />
          </div>
        ) : (
          <p className="text-lg text-gray-600">Content coming soon.</p>
        )}
      </article>
    </Container>
  );
}
