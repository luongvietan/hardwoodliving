import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/layout/Container";
import JsonLd, { buildBreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { SITE_URL } from "@/lib/constants";
import { COMMERCIAL_SECTIONS } from "@/lib/url-structure";

export const metadata: Metadata = {
  title: "Commercial Flooring | Premium B2B Solutions",
  description:
    "Commercial flooring for offices, retail, healthcare, education. Vinyl, specialty, and trusted brands.",
  alternates: { canonical: `${SITE_URL}/commercial` },
};

export default function CommercialPage() {
  const breadcrumbItems = [
    { name: "Home", url: SITE_URL },
    { name: "Commercial", url: `${SITE_URL}/commercial` },
  ];

  return (
    <>
      <JsonLd data={buildBreadcrumbJsonLd(breadcrumbItems)} />
      <section className="bg-charcoal py-16">
        <Container>
          <h1 className="text-3xl font-bold uppercase tracking-wider text-white sm:text-4xl">
            Commercial
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-gray-300">
            Durable flooring solutions for high-traffic commercial spaces —
            offices, retail, healthcare, education, and more.
          </p>
        </Container>
      </section>
      <Container className="py-12">
        <div className="grid gap-6 sm:grid-cols-3">
          {COMMERCIAL_SECTIONS.map((s) => (
            <Link
              key={s.slug}
              href={`/commercial/${s.slug}`}
              className="group flex flex-col rounded-lg border border-charcoal/20 bg-white p-6 shadow-sm transition-all hover:border-accent-orange/50 hover:shadow-md"
            >
              <h2 className="text-xl font-bold text-charcoal group-hover:text-accent-orange">
                {s.title}
              </h2>
              <span className="mt-3 text-sm font-semibold text-accent-orange">
                View →
              </span>
            </Link>
          ))}
        </div>
      </Container>
    </>
  );
}
