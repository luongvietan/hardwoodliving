import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/layout/Container";
import JsonLd, { buildBreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { SITE_URL } from "@/lib/constants";
import { WOOD_GUIDE_PAGES } from "@/lib/url-structure";

export const metadata: Metadata = {
  title: "Wood Guide | Lumber Cuts, Grades & How to Choose",
  description:
    "Learn about lumber cuts, flooring grades, and how to choose the right floor for your home. Expert guidance from Hardwood Living.",
  alternates: { canonical: `${SITE_URL}/wood-guide` },
};

export default function WoodGuidePage() {
  const breadcrumbItems = [
    { name: "Home", url: SITE_URL },
    { name: "Wood Guide", url: `${SITE_URL}/wood-guide` },
  ];

  return (
    <>
      <JsonLd data={buildBreadcrumbJsonLd(breadcrumbItems)} />
      <section className="bg-charcoal py-16">
        <Container>
          <h1 className="text-3xl font-bold uppercase tracking-wider text-white sm:text-4xl">
            Wood Guide
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-gray-300">
            Lumber cuts, flooring grades, choosing guide, and maintenance — expert
            guidance to help you select the perfect floor.
          </p>
        </Container>
      </section>
      <Container className="py-12">
        <div className="grid gap-6 sm:grid-cols-2">
          {WOOD_GUIDE_PAGES.map((p) => (
            <Link
              key={p.slug}
              href={`/wood-guide/${p.slug}`}
              className="group flex flex-col rounded-lg border border-charcoal/20 bg-white p-6 shadow-sm transition-all hover:border-accent-orange/50 hover:shadow-md"
            >
              <h2 className="text-xl font-bold text-charcoal group-hover:text-accent-orange">
                {p.title}
              </h2>
              <span className="mt-3 text-sm font-semibold text-accent-orange">
                Read more →
              </span>
            </Link>
          ))}
        </div>
      </Container>
    </>
  );
}
