import type { SanityImageValue } from "@/lib/sanity/types";
import HeroSection from "@/components/home/HeroSection";
import IntroBlurb from "@/components/home/IntroBlurb";
import CategoryHighlights from "@/components/home/CategoryHighlights";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import CtaSection from "@/components/home/CtaSection";
import Testimonials from "@/components/home/Testimonials";
import JsonLd, { buildOrganizationJsonLd } from "@/components/seo/JsonLd";
import { sanityFetch } from "@/lib/sanity/fetch";
import { getHomepageQuery } from "@/lib/sanity/queries";
import { getSiteSettings } from "@/lib/sanity/siteSettings";
import { SITE_URL } from "@/lib/constants";

interface HomepageData {
  hero?: {
    heading?: string;
    subheading?: string;
    images?: SanityImageValue[];
    ctaLink?: string;
    ctaText?: string;
  };
  introHeading?: string;
  introBlurb?: string;
  categoryHighlights?: {
    _id: string;
    title?: string;
    slug?: { current?: string };
    description?: string;
    image?: SanityImageValue;
  }[];
  featuredProducts?: {
    _id: string;
    title?: string;
    slug?: { current?: string };
    price?: number;
    priceUnit?: string;
    images?: SanityImageValue[];
  }[];
  ctaSection?: {
    heading?: string;
    text?: string;
    image?: SanityImageValue;
    linkText?: string;
    linkUrl?: string;
  };
  testimonials?: {
    _id: string;
    author?: string;
    content?: string;
    image?: SanityImageValue;
  }[];
}

export default async function Home() {
  let data: HomepageData | null = null;
  try {
    data = await sanityFetch<HomepageData | null>({
      query: getHomepageQuery,
      tags: ["homepage"],
    });
  } catch (error) {
    console.error("Failed to fetch homepage data:", error);
  }

  // Fetch siteName for JSON-LD from CMS
  const settings = await getSiteSettings();

  return (
    <>
      {/* Organization Schema */}
      <JsonLd
        data={buildOrganizationJsonLd({
          name: settings.siteName || "",
          url: SITE_URL,
          description: data?.introBlurb || "",
        })}
      />

      {/* Hero Section — slideshow with CMS images */}
      <HeroSection
        heading={data?.hero?.heading}
        subheading={data?.hero?.subheading}
        images={data?.hero?.images}
        ctaLink={data?.hero?.ctaLink}
        ctaText={data?.hero?.ctaText}
      />

      {/* Intro Blurb */}
      <IntroBlurb heading={data?.introHeading} text={data?.introBlurb} />

      {/* Category Highlights Grid */}
      <CategoryHighlights categories={data?.categoryHighlights} />

      {/* Featured Products */}
      <FeaturedProducts products={data?.featuredProducts} />

      {/* CTA Section */}
      <CtaSection
        heading={data?.ctaSection?.heading}
        text={data?.ctaSection?.text}
        image={data?.ctaSection?.image}
        linkText={data?.ctaSection?.linkText}
        linkUrl={data?.ctaSection?.linkUrl}
      />

      {/* Testimonials */}
      <Testimonials testimonials={data?.testimonials} />
    </>
  );
}
