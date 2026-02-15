import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/layout/Container";
import JsonLd, { buildBreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Accessories | Trims, Underlayment & More",
  description:
    "Flooring accessories — trims, underlayment, adhesives, and finishing touches to complete your flooring project.",
  alternates: { canonical: `${SITE_URL}/accessories` },
};

export default function AccessoriesPage() {
  const breadcrumbItems = [
    { name: "Home", url: SITE_URL },
    { name: "Accessories", url: `${SITE_URL}/accessories` },
  ];

  return (
    <>
      <JsonLd data={buildBreadcrumbJsonLd(breadcrumbItems)} />

      <section className="bg-charcoal py-16">
        <Container>
          <h1 className="text-3xl font-bold uppercase tracking-wider text-white sm:text-4xl">
            Accessories
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-gray-300">
            From trims to underlayment — the essential finishing touches that
            make your flooring project complete.
          </p>
        </Container>
      </section>

      <Container className="py-12">
        <div className="mx-auto max-w-2xl">
          <p className="text-stone-600">
            We offer a full range of flooring accessories including transition
            strips, reducers, quarter round, underlayment, adhesives, and more.
            Browse our products or visit the showroom to see samples.
          </p>
          <Link
            href="/products"
            className="mt-6 inline-block rounded-lg bg-accent-orange px-6 py-3 font-semibold text-white transition-colors hover:bg-accent-orange/90"
          >
            Browse All Products
          </Link>
        </div>
      </Container>
    </>
  );
}
