import type { Metadata } from "next";
import Container from "@/components/layout/Container";
import PortableText from "@/components/sanity/PortableText";
import { sanityFetch } from "@/lib/sanity/fetch";
import { getPageQuery, getAllPageSlugsQuery } from "@/lib/sanity/queries";
import { urlFor } from "@/lib/sanity/image";
import type { SanityImageValue } from "@/lib/sanity/types";
import { notFound } from "next/navigation";

interface PageData {
  title: string;
  body?: Record<string, unknown>[];
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    openGraphImage?: SanityImageValue;
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

  const metadata: Metadata = {
    title: page.seo?.metaTitle || page.title,
    description: page.seo?.metaDescription || undefined,
    alternates: {
      canonical: `/pages/${slug}`,
    },
  };

  if (page.seo?.openGraphImage?.asset?._ref) {
    metadata.openGraph = {
      images: [
        {
          url: urlFor(page.seo.openGraphImage)
            .width(1200)
            .height(630)
            .auto("format")
            .url(),
          width: 1200,
          height: 630,
        },
      ],
    };
  }

  return metadata;
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
    <>
      {/* Page Header — Magna dark banner */}
      <section className="bg-charcoal py-16">
        <Container>
          <h1 className="text-3xl font-bold uppercase tracking-wider text-white sm:text-4xl">
            {page.title}
          </h1>
        </Container>
      </section>

      <Container className="py-12">
        <article className="mx-auto max-w-3xl">
          {page.body && (
            <div className="prose-content">
              <PortableText value={page.body} />
            </div>
          )}
        </article>
      </Container>
    </>
  );
}
