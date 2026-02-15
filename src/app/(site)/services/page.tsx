import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/layout/Container";
import JsonLd, { buildBreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { SITE_URL } from "@/lib/constants";
import { SERVICE_PAGES } from "@/lib/url-structure";

export const metadata: Metadata = {
  title: "Services | Installation, Sanding & Maintenance",
  description:
    "Professional floor installation, sanding & finishing, and maintenance services. Expert guidance for your flooring project.",
  alternates: { canonical: `${SITE_URL}/services` },
};

export default function ServicesPage() {
  const breadcrumbItems = [
    { name: "Home", url: SITE_URL },
    { name: "Services", url: `${SITE_URL}/services` },
  ];

  return (
    <>
      <JsonLd data={buildBreadcrumbJsonLd(breadcrumbItems)} />
      <section className="bg-charcoal py-16">
        <Container>
          <h1 className="text-3xl font-bold uppercase tracking-wider text-white sm:text-4xl">
            Services
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-gray-300">
            Everything you need from first visit to finished floor —
            installation, sanding & finishing, and ongoing maintenance.
          </p>
        </Container>
      </section>
      <Container className="py-12">
        <div className="grid gap-6 sm:grid-cols-3">
          {SERVICE_PAGES.map((p) => (
            <Link
              key={p.slug}
              href={`/services/${p.slug}`}
              className="group flex flex-col rounded-lg border border-charcoal/20 bg-white p-6 shadow-sm transition-all hover:border-accent-orange/50 hover:shadow-md"
            >
              <h2 className="text-xl font-bold text-charcoal group-hover:text-accent-orange">
                {p.title}
              </h2>
              <span className="mt-3 text-sm font-semibold text-accent-orange">
                Learn more →
              </span>
            </Link>
          ))}
        </div>
      </Container>
    </>
  );
}
