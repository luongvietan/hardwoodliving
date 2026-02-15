import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/layout/Container";
import PortableText from "@/components/sanity/PortableText";
import JsonLd, { buildBreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { sanityFetch } from "@/lib/sanity/fetch";
import { getPageByIdQuery, getAllPagesForPathResolutionQuery } from "@/lib/sanity/queries";
import { urlFor } from "@/lib/sanity/image";
import type { SanityImageValue } from "@/lib/sanity/types";
import { notFound } from "next/navigation";
import {
  resolvePageIdByPath,
  getAllPagePaths,
  getAncestorTitlesByPath,
  type PageForPath,
} from "@/lib/page-path";
import { SITE_URL } from "@/lib/constants";

interface PageData {
  title: string;
  body?: Record<string, unknown>[];
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    openGraphImage?: SanityImageValue;
  };
  slug: { current: string };
}

export async function generateStaticParams() {
  const allPages = await sanityFetch<PageForPath[]>({
    query: getAllPagesForPathResolutionQuery,
    tags: ["page"],
  });
  const paths = getAllPagePaths(allPages);
  return [
    { path: [] as string[] },
    ...paths.map((path) => ({ path })),
  ];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ path?: string[] }>;
}): Promise<Metadata> {
  const { path } = await params;
  if (!path?.length) return { title: "Pages" };

  const allPages = await sanityFetch<PageForPath[]>({
    query: getAllPagesForPathResolutionQuery,
    tags: ["page"],
  });
  const pageId = resolvePageIdByPath(allPages, path);
  if (!pageId) return { title: "Page Not Found" };

  const page = await sanityFetch<PageData | null>({
    query: getPageByIdQuery,
    params: { id: pageId },
    tags: ["page"],
  });
  if (!page) return { title: "Page Not Found" };

  const canonicalPath = `/pages/${path.join("/")}`;
  const metadata: Metadata = {
    title: page.seo?.metaTitle || page.title,
    description: page.seo?.metaDescription || undefined,
    alternates: { canonical: canonicalPath },
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
  params: Promise<{ path?: string[] }>;
}) {
  const { path: pathParam } = await params;
  const path = pathParam ?? [];

  const allPages = await sanityFetch<PageForPath[]>({
    query: getAllPagesForPathResolutionQuery,
    tags: ["page"],
  });

  if (path.length === 0) {
    const rootPages = allPages.filter((p) => !p.parentRef);
    return (
      <section className="bg-charcoal py-16">
        <Container>
          <h1 className="text-3xl font-bold uppercase tracking-wider text-white sm:text-4xl">
            Pages
          </h1>
          <ul className="mt-8 space-y-2">
            {rootPages.length === 0 ? (
              <li className="text-gray-300">No pages yet.</li>
            ) : (
              rootPages.map((p) => (
                <li key={p._id}>
                  <Link
                    href={`/pages/${p.slug}`}
                    className="text-lg text-white underline hover:text-accent-orange"
                  >
                    {p.title}
                  </Link>
                </li>
              ))
            )}
          </ul>
        </Container>
      </section>
    );
  }

  const pageId = resolvePageIdByPath(allPages, path);
  if (!pageId) notFound();

  const page = await sanityFetch<PageData | null>({
    query: getPageByIdQuery,
    params: { id: pageId },
    tags: ["page"],
  });

  if (!page) notFound();

  const ancestors = getAncestorTitlesByPath(allPages, path);
  const breadcrumbItems = [
    { name: "Home", url: SITE_URL },
    { name: "Pages", url: `${SITE_URL}/pages` },
    ...ancestors.map((a, i) => ({
      name: a.title,
      url: `${SITE_URL}/pages/${path.slice(0, i + 1).join("/")}`,
    })),
    {
      name: page.title,
      url: `${SITE_URL}/pages/${path.join("/")}`,
    },
  ];

  return (
    <>
      <JsonLd data={buildBreadcrumbJsonLd(breadcrumbItems)} />

      <section className="bg-charcoal py-16">
        <Container>
          {ancestors.length > 0 && (
            <nav className="mb-4 text-sm text-gray-400" aria-label="Breadcrumb">
              <Link href="/pages" className="hover:text-white">
                Pages
              </Link>
              {ancestors.map((a, i) => (
                <span key={a.slug}>
                  {" / "}
                  <Link
                    href={`/pages/${path.slice(0, i + 1).join("/")}`}
                    className="hover:text-white"
                  >
                    {a.title}
                  </Link>
                </span>
              ))}
              {" / "}
              <span className="text-white">{page.title}</span>
            </nav>
          )}
          <h1 className="text-3xl font-bold uppercase tracking-wider text-white sm:text-4xl">
            {page.title}
          </h1>
        </Container>
      </section>

      <Container className="py-12">
        <article className="mx-auto max-w-3xl">
          {page.body && page.body.length > 0 ? (
            <div className="prose-content">
              <PortableText value={page.body} />
            </div>
          ) : (
            <p className="text-gray-500">Content coming soon.</p>
          )}
        </article>
      </Container>
    </>
  );
}
