import type { SanityImageValue } from "@/lib/sanity/types";
import HeroSection from "@/components/home/HeroSection";
import IntroBlurb from "@/components/home/IntroBlurb";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import Testimonials from "@/components/home/Testimonials";
import { sanityFetch } from "@/lib/sanity/fetch";
import { getHomepageQuery } from "@/lib/sanity/queries";
import { urlFor } from "@/lib/sanity/image";

interface HomepageData {
  hero?: {
    heading?: string;
    subheading?: string;
    image?: SanityImageValue;
    ctaLink?: string;
    ctaText?: string;
  };
  introBlurb?: string;
  featuredProducts?: {
    _id: string;
    title: string;
    slug: { current: string };
    price: number;
    priceUnit?: string;
    images?: SanityImageValue[];
  }[];
  testimonials?: {
    _id: string;
    author: string;
    content: string;
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
    // Fall through with null data — components handle missing data gracefully
  }

  // Build hero image URL from Sanity asset reference
  const heroImageUrl = data?.hero?.image?.asset?._ref
    ? urlFor(data.hero.image).width(1920).height(800).auto("format").url()
    : null;

  return (
    <>
      {/* Hero Section */}
      <HeroSection
        heading={data?.hero?.heading}
        subheading={data?.hero?.subheading}
        imageUrl={heroImageUrl}
        ctaLink={data?.hero?.ctaLink}
        ctaText={data?.hero?.ctaText}
      />

      {/* Intro Blurb */}
      <IntroBlurb text={data?.introBlurb} />

      {/* Featured Products */}
      <FeaturedProducts products={data?.featuredProducts} />

      {/* Testimonials */}
      <Testimonials testimonials={data?.testimonials} />
    </>
  );
}
