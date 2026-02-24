import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/layout/Container";
import WhyLoveUs from "@/components/home/WhyLoveUs";
import Faq from "@/components/home/Faq";
import Testimonials from "@/components/home/Testimonials";
import JsonLd, { buildBreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { sanityFetch } from "@/lib/sanity/fetch";
import { getHomepageQuery } from "@/lib/sanity/queries";
import { SITE_URL } from "@/lib/constants";
import type { SanityImageValue } from "@/lib/sanity/types";

interface HomepageAbout {
  whyLoveUs?: { heading?: string; items?: { title?: string; description?: string; image?: SanityImageValue }[] };
  faq?: { heading?: string; items?: { question?: string; answer?: string }[] };
  testimonialsHeading?: string;
  testimonials?: {
    _id: string;
    author?: string;
    content?: string;
    image?: SanityImageValue;
    role?: string;
  }[];
}

export const metadata: Metadata = {
  title: "About Us | Hardwood Living – Vancouver Flooring Showroom",
  description:
    "Learn about Hardwood Living — Vancouver's trusted flooring showroom. We help homeowners and designers find premium hardwood, engineered wood, vinyl, and laminate floors.",
  keywords: [
    "about Hardwood Living",
    "flooring showroom Vancouver",
    "flooring experts BC",
    "trusted flooring company Canada",
  ],
  openGraph: {
    title: "About Us | Hardwood Living – Vancouver Flooring Showroom",
    description:
      "Learn about Hardwood Living — Vancouver's trusted flooring showroom since 2005. Expert guidance for homeowners, designers, and contractors.",
    url: `${SITE_URL}/about`,
  },
  alternates: { canonical: `${SITE_URL}/about` },
};

export default async function AboutPage() {
  const data = await sanityFetch<HomepageAbout | null>({
    query: getHomepageQuery,
    tags: ["homepage"],
  });

  const breadcrumbItems = [
    { name: "Home", url: SITE_URL },
    { name: "About", url: `${SITE_URL}/about` },
  ];

  return (
    <>
      <JsonLd data={buildBreadcrumbJsonLd(breadcrumbItems)} />

      <section className="bg-charcoal py-16">
        <Container>
          <h1 className="text-3xl font-bold uppercase tracking-wider text-white sm:text-4xl">
            About
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-gray-300">
            Premium flooring solutions for homeowners, designers, and contractors.
            Visit our showroom to explore and find your perfect floor.
          </p>
        </Container>
      </section>

      <WhyLoveUs
        heading={data?.whyLoveUs?.heading}
        items={data?.whyLoveUs?.items}
      />

      <Faq
        heading={data?.faq?.heading}
        items={data?.faq?.items}
      />

      <Testimonials
        heading={data?.testimonialsHeading}
        testimonials={data?.testimonials}
      />

      <section className="bg-stone-50 py-12">
        <Container>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              className="rounded-lg bg-accent-orange px-6 py-3 font-semibold text-white transition-colors hover:bg-accent-orange/90"
            >
              Book a Visit
            </Link>
            <Link
              href="/collections"
              className="rounded-lg border border-charcoal/30 px-6 py-3 font-semibold text-charcoal transition-colors hover:border-accent-orange hover:text-accent-orange"
            >
              Browse Collections
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
