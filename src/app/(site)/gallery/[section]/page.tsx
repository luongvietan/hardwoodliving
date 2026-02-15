import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/layout/Container";
import JsonLd, { buildBreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { SITE_URL } from "@/lib/constants";
import { GALLERY_SECTIONS } from "@/lib/url-structure";
import { notFound } from "next/navigation";

const SECTION_CONTENT: Record<string, { title: string; description: string }> = {
  residential: {
    title: "Residential",
    description:
      "Browse our residential flooring projects. From classic hardwood to modern vinyl, see how we've transformed homes.",
  },
  commercial: {
    title: "Commercial",
    description:
      "Commercial flooring installations — offices, retail, healthcare, and more. Durable solutions for high-traffic spaces.",
  },
};

const validSlugs = GALLERY_SECTIONS.map((s) => s.slug);

export async function generateStaticParams() {
  return validSlugs.map((section) => ({ section }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ section: string }>;
}): Promise<Metadata> {
  const { section } = await params;
  const info = SECTION_CONTENT[section];
  if (!info) return { title: "Not Found" };
  return {
    title: `${info.title} Gallery | Our Works`,
    description: info.description,
    alternates: { canonical: `${SITE_URL}/gallery/${section}` },
  };
}

export default async function GallerySectionPage({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section } = await params;
  const info = SECTION_CONTENT[section];
  if (!info) notFound();

  const breadcrumbItems = [
    { name: "Home", url: SITE_URL },
    { name: "Gallery", url: `${SITE_URL}/gallery` },
    { name: info.title, url: `${SITE_URL}/gallery/${section}` },
  ];

  return (
    <>
      <JsonLd data={buildBreadcrumbJsonLd(breadcrumbItems)} />
      <section className="bg-charcoal py-16">
        <Container>
          <h1 className="text-3xl font-bold uppercase tracking-wider text-white sm:text-4xl">
            {info.title} Gallery
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-gray-300">{info.description}</p>
        </Container>
      </section>
      <Container className="py-12">
        <p className="mx-auto max-w-2xl text-center text-stone-600">
          Visit our showroom to see real samples and finished {info.title.toLowerCase()} projects.
        </p>
      </Container>
    </>
  );
}
