import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/layout/Container";
import JsonLd, { buildBreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { SITE_URL } from "@/lib/constants";
import { CUSTOM_FLOORING_PAGES } from "@/lib/url-structure";

export const metadata: Metadata = {
  title: "Custom Flooring | Engineered to Your Specs",
  description:
    "Create a one-of-a-kind floor designed around your style, space, and exact project needs. Custom engineered, stain, and dimensions.",
  alternates: { canonical: `${SITE_URL}/custom-flooring` },
};

export default function CustomFlooringPage() {
  const breadcrumbItems = [
    { name: "Home", url: SITE_URL },
    { name: "Custom Flooring", url: `${SITE_URL}/custom-flooring` },
  ];

  return (
    <>
      <JsonLd data={buildBreadcrumbJsonLd(breadcrumbItems)} />
      <section className="bg-charcoal py-16">
        <Container>
          <h1 className="text-3xl font-bold uppercase tracking-wider text-white sm:text-4xl">
            Custom Flooring
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-gray-300">
            Create a one-of-a-kind floor designed around your style, your space,
            and your exact project needs.
          </p>
        </Container>
      </section>
      <Container className="py-12">
        <div className="grid gap-6 sm:grid-cols-3">
          {CUSTOM_FLOORING_PAGES.map((p) => (
            <Link
              key={p.slug}
              href={`/custom-flooring/${p.slug}`}
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
        <div className="mt-12 text-center">
          <Link
            href="/contact"
            className="inline-block rounded-lg bg-accent-orange px-6 py-3 font-semibold text-white transition-colors hover:bg-accent-orange/90"
          >
            Request a Custom Quote
          </Link>
        </div>
      </Container>
    </>
  );
}
