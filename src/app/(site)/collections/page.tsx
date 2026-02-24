import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/layout/Container";
import JsonLd, { buildBreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { SITE_URL } from "@/lib/constants";
import { COLLECTION_MATERIALS } from "@/lib/url-structure";

export const metadata: Metadata = {
  title: "Flooring Collections | Hardwood, Engineered, Vinyl & Laminate",
  description:
    "Explore our premium flooring collections — hardwood, engineered wood, luxury vinyl plank (LVP), and laminate. Find the perfect floor for your home in Vancouver, BC.",
  keywords: [
    "flooring collections Canada",
    "hardwood flooring types",
    "engineered wood flooring",
    "luxury vinyl plank",
    "laminate flooring",
    "flooring styles Vancouver",
  ],
  openGraph: {
    title: "Flooring Collections | Hardwood, Engineered, Vinyl & Laminate",
    description:
      "Explore premium flooring collections — hardwood, engineered wood, luxury vinyl plank, and laminate. Visit our Vancouver showroom.",
    url: `${SITE_URL}/collections`,
  },
  alternates: { canonical: `${SITE_URL}/collections` },
};

export default function CollectionsPage() {
  const breadcrumbItems = [
    { name: "Home", url: SITE_URL },
    { name: "Collections", url: `${SITE_URL}/collections` },
  ];

  return (
    <>
      <JsonLd data={buildBreadcrumbJsonLd(breadcrumbItems)} />
      <section className="bg-charcoal py-16">
        <Container>
          <h1 className="text-3xl font-bold uppercase tracking-wider text-white sm:text-4xl">
            Collections
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-gray-300">
            Explore our full range of flooring options — hardwood, engineered,
            luxury vinyl, laminate, and more.
          </p>
        </Container>
      </section>
      <Container className="py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {COLLECTION_MATERIALS.map((col) => (
            <article
              key={col.slug}
              className="group flex flex-col rounded-lg border border-charcoal/20 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <h2 className="text-xl font-bold text-charcoal">{col.title}</h2>
              {col.description && (
                <p className="mt-2 flex-1 text-sm text-stone-600">{col.description}</p>
              )}
              {!col.indexable && (
                <span className="mt-2 inline-block text-xs font-medium text-stone-500">
                  Coming soon
                </span>
              )}
              <div className="mt-4 flex flex-wrap gap-2">
                {col.indexable && (
                  <Link
                    href={`/collections/${col.slug}`}
                    className="rounded bg-accent-orange px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-accent-orange/90"
                  >
                    View {col.title}
                  </Link>
                )}
                {col.subtypes.map((sub) => (
                  <Link
                    key={sub.slug}
                    href={`/collections/${col.slug}/${sub.slug}`}
                    className="rounded border border-charcoal/30 px-3 py-1.5 text-xs font-medium text-charcoal transition-colors hover:border-accent-orange hover:text-accent-orange"
                  >
                    {sub.title}
                  </Link>
                ))}
              </div>
            </article>
          ))}
        </div>
      </Container>
    </>
  );
}
