import type { SanityImageValue } from "@/lib/sanity/types";
import HeroSection from "@/components/home/HeroSection";
import ChoosingSection from "@/components/home/ChoosingSection";
import WhatWeOffer from "@/components/home/WhatWeOffer";
import OurSpecialty from "@/components/home/OurSpecialty";
import FlooringGrades from "@/components/home/FlooringGrades";
import LumberCuts from "@/components/home/LumberCuts";
import LimitedTimeOffer from "@/components/home/LimitedTimeOffer";
import WhyLoveUs from "@/components/home/WhyLoveUs";
import OurWorks from "@/components/home/OurWorks";
import Faq from "@/components/home/Faq";
import Testimonials from "@/components/home/Testimonials";
import BookVisitForm from "@/components/home/BookVisitForm";
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
    cta2Link?: string;
    cta2Text?: string;
  };
  choosingSection?: {
    heading1?: string;
    heading2?: string;
    painPoints?: string[];
    resultText?: string;
    tagline?: string;
    solutionBullets?: string[];
    ctaText?: string;
    ctaLink?: string;
  };
  whatWeOffer?: {
    intro?: string;
    items?: { title?: string; description?: string }[];
  };
  ourSpecialty?: {
    intro?: string;
    items?: { number?: string; title?: string; description?: string }[];
    ctaText?: string;
    ctaLink?: string;
  };
  flooringGrades?: {
    heading?: string;
    subheading?: string;
    grades?: { name?: string; bullets?: string[] }[];
  };
  lumberCuts?: {
    heading?: string;
    intro?: string;
    cuts?: { name?: string; description?: string }[];
  };
  limitedTimeOffer?: {
    heading?: string;
    body?: string;
    ctaText?: string;
    ctaLink?: string;
    cta2Text?: string;
    cta2Link?: string;
  };
  whyLoveUs?: {
    heading?: string;
    items?: { title?: string; description?: string }[];
  };
  ourWorksHeading?: string;
  faq?: {
    heading?: string;
    items?: { question?: string; answer?: string }[];
  };
  testimonialsHeading?: string;
  testimonials?: {
    _id: string;
    author?: string;
    content?: string;
    image?: SanityImageValue;
    role?: string;
  }[];
  bookVisitForm?: {
    heading?: string;
    subheading?: string;
    primaryCtaText?: string;
    secondaryCtaText?: string;
  };
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

  const settings = await getSiteSettings();
  const description =
    data?.whatWeOffer?.intro ||
    data?.choosingSection?.tagline ||
    "Premium flooring solutions for your home.";

  return (
    <>
      <JsonLd
        data={buildOrganizationJsonLd({
          name: settings.siteName || "",
          url: SITE_URL,
          description,
        })}
      />

      <HeroSection
        heading={data?.hero?.heading}
        subheading={data?.hero?.subheading}
        images={data?.hero?.images}
        ctaLink={data?.hero?.ctaLink}
        ctaText={data?.hero?.ctaText}
        cta2Link={data?.hero?.cta2Link}
        cta2Text={data?.hero?.cta2Text}
        contactInfo={settings.contactInfo}
      />

      <ChoosingSection
        heading1={data?.choosingSection?.heading1}
        heading2={data?.choosingSection?.heading2}
        painPoints={data?.choosingSection?.painPoints}
        resultText={data?.choosingSection?.resultText}
        tagline={data?.choosingSection?.tagline}
        solutionBullets={data?.choosingSection?.solutionBullets}
        ctaText={data?.choosingSection?.ctaText}
        ctaLink={data?.choosingSection?.ctaLink}
      />

      <WhatWeOffer
        intro={data?.whatWeOffer?.intro}
        items={data?.whatWeOffer?.items}
      />

      <OurSpecialty
        intro={data?.ourSpecialty?.intro}
        items={data?.ourSpecialty?.items}
        ctaText={data?.ourSpecialty?.ctaText}
        ctaLink={data?.ourSpecialty?.ctaLink}
      />

      <FlooringGrades
        heading={data?.flooringGrades?.heading}
        subheading={data?.flooringGrades?.subheading}
        grades={data?.flooringGrades?.grades}
      />

      <LumberCuts
        heading={data?.lumberCuts?.heading}
        intro={data?.lumberCuts?.intro}
        cuts={data?.lumberCuts?.cuts}
      />

      <LimitedTimeOffer
        heading={data?.limitedTimeOffer?.heading}
        body={data?.limitedTimeOffer?.body}
        ctaText={data?.limitedTimeOffer?.ctaText}
        ctaLink={data?.limitedTimeOffer?.ctaLink}
        cta2Text={data?.limitedTimeOffer?.cta2Text}
        cta2Link={data?.limitedTimeOffer?.cta2Link}
      />

      <WhyLoveUs
        heading={data?.whyLoveUs?.heading}
        items={data?.whyLoveUs?.items}
      />

      <OurWorks
        heading={data?.ourWorksHeading}
        subline={data?.whyLoveUs?.heading}
      />

      <Faq
        heading={data?.faq?.heading}
        items={data?.faq?.items}
      />

      <Testimonials
        heading={data?.testimonialsHeading}
        testimonials={data?.testimonials}
      />

      <BookVisitForm
        heading={data?.bookVisitForm?.heading}
        subheading={data?.bookVisitForm?.subheading}
        primaryCtaText={data?.bookVisitForm?.primaryCtaText}
        secondaryCtaText={data?.bookVisitForm?.secondaryCtaText}
      />
    </>
  );
}
