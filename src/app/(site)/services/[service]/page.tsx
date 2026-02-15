import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/layout/Container";
import JsonLd, { buildBreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { SITE_URL } from "@/lib/constants";
import { SERVICE_PAGES } from "@/lib/url-structure";
import { notFound } from "next/navigation";

const SERVICE_CONTENT: Record<
  string,
  { title: string; description: string; ctaLink: string }
> = {
  installation: {
    title: "Installation",
    description:
      "Professional floor installation is key to long-lasting results. We provide expert, unbiased guidance to ensure a smooth, reliable, and beautiful finish. Our team coordinates with trusted professionals to deliver quality workmanship.",
    ctaLink: "/contact",
  },
  "sanding-finishing": {
    title: "Sanding & Finishing",
    description:
      "Refinish your existing hardwood floors with professional sanding and finishing services. Restore the natural beauty of your wood floors or update the stain and finish to match your current style.",
    ctaLink: "/contact",
  },
  maintenance: {
    title: "Maintenance",
    description:
      "Tips and products to keep your floors looking pristine for years to come. Learn about cleaning, protection, and care for hardwood, vinyl, laminate, and more. Regular sweeping, avoid excess moisture, use felt pads under furniture, and follow manufacturer guidelines.",
    ctaLink: "/wood-guide/floor-maintenance-guide",
  },
};

const validSlugs = SERVICE_PAGES.map((p) => p.slug);

export async function generateStaticParams() {
  return validSlugs.map((service) => ({ service }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ service: string }>;
}): Promise<Metadata> {
  const { service } = await params;
  const info = SERVICE_CONTENT[service];
  if (!info) return { title: "Not Found" };
  return {
    title: `${info.title} | Flooring Services`,
    description: info.description,
    alternates: { canonical: `${SITE_URL}/services/${service}` },
  };
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ service: string }>;
}) {
  const { service } = await params;
  const info = SERVICE_CONTENT[service];
  if (!info) notFound();

  const breadcrumbItems = [
    { name: "Home", url: SITE_URL },
    { name: "Services", url: `${SITE_URL}/services` },
    { name: info.title, url: `${SITE_URL}/services/${service}` },
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
            href={info.ctaLink}
            className="mt-6 inline-block rounded-lg bg-accent-orange px-6 py-3 font-semibold text-white transition-colors hover:bg-accent-orange/90"
          >
            Get in Touch
          </Link>
        </div>
      </Container>
    </>
  );
}
