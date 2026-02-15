import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/layout/Container";
import OurWorks from "@/components/home/OurWorks";
import JsonLd, { buildBreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { GALLERY_SECTIONS } from "@/lib/url-structure";
import { sanityFetch } from "@/lib/sanity/fetch";
import { getHomepageQuery } from "@/lib/sanity/queries";
import { SITE_URL } from "@/lib/constants";

interface HomepageGallery {
  ourWorksHeading?: string;
  whyLoveUs?: { heading?: string };
}

export const metadata: Metadata = {
  title: "Gallery | Our Works",
  description:
    "See how we've helped thousands create their dream spaces. Browse our flooring gallery.",
  alternates: { canonical: `${SITE_URL}/gallery` },
};

export default async function GalleryPage() {
  const data = await sanityFetch<HomepageGallery | null>({
    query: getHomepageQuery,
    tags: ["homepage"],
  });

  const breadcrumbItems = [
    { name: "Home", url: SITE_URL },
    { name: "Gallery", url: `${SITE_URL}/gallery` },
  ];

  return (
    <>
      <JsonLd data={buildBreadcrumbJsonLd(breadcrumbItems)} />

      <OurWorks
        heading={data?.ourWorksHeading || "Our Works"}
        subline={data?.whyLoveUs?.heading || "We've helped thousands create their dream spaces."}
      />

      <Container className="pb-16">
        <div className="flex flex-wrap justify-center gap-4">
          {GALLERY_SECTIONS.map((s) => (
            <Link
              key={s.slug}
              href={`/gallery/${s.slug}`}
              className="rounded-lg border border-charcoal/20 bg-white px-6 py-3 font-semibold text-charcoal transition-colors hover:border-accent-orange hover:text-accent-orange"
            >
              {s.title}
            </Link>
          ))}
        </div>
        <p className="mx-auto mt-8 max-w-2xl text-center text-stone-600">
          Visit our showroom to see real samples and finished projects. Our team
          will help you visualize how different flooring options will look in
          your space.
        </p>
      </Container>
    </>
  );
}
