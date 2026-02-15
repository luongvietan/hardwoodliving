import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/layout/Container";
import JsonLd, { buildBreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { SITE_URL } from "@/lib/constants";
import { COMMERCIAL_SECTIONS, COMMERCIAL_BRANDS } from "@/lib/url-structure";
import { notFound } from "next/navigation";

const SECTIONS: Record<string, { title: string; description: string }> = {
  vinyl: {
    title: "Vinyl",
    description: "Durable commercial vinyl flooring for high-traffic spaces.",
  },
  specialty: {
    title: "Specialty",
    description: "Specialty commercial flooring solutions for unique applications.",
  },
  brands: {
    title: "Brands",
    description: "Trusted commercial flooring brands — Harbinger, Dynoflex, Acoustiguard, Acrylic Infused.",
  },
};

const validSections = COMMERCIAL_SECTIONS.map((s) => s.slug);

export async function generateStaticParams() {
  return validSections.map((section) => ({ section }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ section: string }>;
}): Promise<Metadata> {
  const { section } = await params;
  const info = SECTIONS[section];
  if (!info) return { title: "Not Found" };
  return {
    title: `${info.title} | Commercial Flooring`,
    description: info.description,
    alternates: { canonical: `${SITE_URL}/commercial/${section}` },
  };
}

export default async function CommercialSectionPage({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section } = await params;
  const info = SECTIONS[section];
  if (!info || !validSections.includes(section)) notFound();

  const breadcrumbItems = [
    { name: "Home", url: SITE_URL },
    { name: "Commercial", url: `${SITE_URL}/commercial` },
    { name: info.title, url: `${SITE_URL}/commercial/${section}` },
  ];

  const isBrands = section === "brands";

  return (
    <>
      <JsonLd data={buildBreadcrumbJsonLd(breadcrumbItems)} />
      <section className="bg-charcoal py-16">
        <Container>
          <h1 className="text-3xl font-bold uppercase tracking-wider text-white sm:text-4xl">
            {info.title}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-gray-300">{info.description}</p>
        </Container>
      </section>
      <Container className="py-12">
        {isBrands ? (
          <div className="grid gap-6 sm:grid-cols-2">
            {COMMERCIAL_BRANDS.map((brand) => (
              <Link
                key={brand.slug}
                href={`/commercial/brands/${brand.slug}`}
                className="group flex flex-col rounded-lg border border-charcoal/20 bg-white p-6 shadow-sm transition-all hover:border-accent-orange/50 hover:shadow-md"
              >
                <h2 className="text-xl font-bold text-charcoal group-hover:text-accent-orange">
                  {brand.title}
                </h2>
                <span className="mt-3 text-sm font-semibold text-accent-orange">
                  View products →
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-stone-600">Browse our commercial {info.title.toLowerCase()} products.</p>
        )}
      </Container>
    </>
  );
}
