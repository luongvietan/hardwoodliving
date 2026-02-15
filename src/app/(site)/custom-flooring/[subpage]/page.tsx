import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/layout/Container";
import JsonLd, { buildBreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { SITE_URL } from "@/lib/constants";
import { CUSTOM_FLOORING_PAGES } from "@/lib/url-structure";
import { notFound } from "next/navigation";

const CONTENT: Record<string, { title: string; description: string }> = {
  "custom-engineered": {
    title: "Custom Engineered",
    description:
      "Custom engineered hardwood flooring for residential and commercial projects. Choose your species, width, length, finish, and more. Our team crafts floors to your exact specifications.",
  },
  "custom-stain": {
    title: "Custom Stain",
    description:
      "Create the perfect finish for your floors. From natural to dark stains, we offer custom staining to match your design vision. Samples available in showroom.",
  },
  "custom-dimensions": {
    title: "Custom Dimensions",
    description:
      "Need non-standard widths, lengths, or thicknesses? We can source and mill custom dimensions for your unique project requirements.",
  },
};

const validSlugs = CUSTOM_FLOORING_PAGES.map((p) => p.slug);

export async function generateStaticParams() {
  return validSlugs.map((subpage) => ({ subpage }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ subpage: string }>;
}): Promise<Metadata> {
  const { subpage } = await params;
  const info = CONTENT[subpage];
  if (!info) return { title: "Not Found" };
  return {
    title: `${info.title} | Custom Flooring`,
    description: info.description,
    alternates: { canonical: `${SITE_URL}/custom-flooring/${subpage}` },
  };
}

export default async function CustomFlooringSubpage({
  params,
}: {
  params: Promise<{ subpage: string }>;
}) {
  const { subpage } = await params;
  const info = CONTENT[subpage];
  if (!info) notFound();

  const breadcrumbItems = [
    { name: "Home", url: SITE_URL },
    { name: "Custom Flooring", url: `${SITE_URL}/custom-flooring` },
    { name: info.title, url: `${SITE_URL}/custom-flooring/${subpage}` },
  ];

  return (
    <>
      <JsonLd data={buildBreadcrumbJsonLd(breadcrumbItems)} />
      <section className="bg-charcoal py-16">
        <Container>
          <h1 className="text-3xl font-bold uppercase tracking-wider text-white sm:text-4xl">
            {info.title}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-gray-300">
            {info.description}
          </p>
        </Container>
      </section>
      <Container className="py-12">
        <div className="mx-auto max-w-2xl">
          <p className="text-stone-600">{info.description}</p>
          <Link
            href="/contact"
            className="mt-6 inline-block rounded-lg bg-accent-orange px-6 py-3 font-semibold text-white transition-colors hover:bg-accent-orange/90"
          >
            Request a Quote
          </Link>
        </div>
      </Container>
    </>
  );
}
