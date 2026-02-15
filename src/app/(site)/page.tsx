import type { SanityImageValue } from "@/lib/sanity/types";
import HeroSection from "@/components/home/HeroSection";
import AnimatedSection from "@/components/ui/AnimatedSection";
import ChoosingSection from "@/components/home/ChoosingSection";
import CoreCollections from "@/components/home/CoreCollections";
import OurSpecialty from "@/components/home/OurSpecialty";
import WhyLoveUs from "@/components/home/WhyLoveUs";
import ProjectsPreview from "@/components/home/ProjectsPreview";
import LimitedTimeOffer from "@/components/home/LimitedTimeOffer";
import Testimonials from "@/components/home/Testimonials";
import Faq from "@/components/home/Faq";
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
    image1?: SanityImageValue | null;
    tagline?: string;
    solutionBullets?: string[];
    image2?: SanityImageValue | null;
    ctaText?: string;
    ctaLink?: string;
  };
  ourSpecialty?: {
    intro?: string;
    items?: { number?: string; title?: string; description?: string }[];
    ctaText?: string;
    ctaLink?: string;
  };
  limitedTimeOffer?: {
    badgeText?: string;
    heading?: string;
    body?: string;
    body2?: string;
    backgroundImage?: SanityImageValue | null;
    ctaText?: string;
    ctaLink?: string;
    cta2Text?: string;
    cta2Link?: string;
  };
  whyLoveUs?: {
    heading?: string;
    items?: { title?: string; description?: string; image?: SanityImageValue }[];
  };
  projectsPreview?: {
    heading?: string;
    images?: SanityImageValue[];
  };
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

/** Optimal homepage: Hero → Pain Points → Solution → Core Collections (4) → Specialty → Why Us → Projects → Limited Offer → Testimonials → FAQ (3) → Booking */
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

  const [settings] = await Promise.all([
    getSiteSettings(),
  ]);

  const description =
    data?.choosingSection?.tagline ||
    "Premium flooring solutions for your home.";

  const testimonials = (data?.testimonials ?? []).slice(0, 4);
  const faqItems = (data?.faq?.items ?? []).slice(0, 3);

  return (
    <>
      <JsonLd
        data={buildOrganizationJsonLd({
          name: settings.siteName || "",
          url: SITE_URL,
          description,
        })}
      />

      {/* 1. Hero — Find Your Perfect Hardfloor, 5.0 rating, 2 CTAs */}
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

      {/* 2. Pain Points + 3. Solution (See It. Choose Confidently.) */}
      <AnimatedSection variant="fadeUp">
        <ChoosingSection
        heading1={data?.choosingSection?.heading1}
        heading2={data?.choosingSection?.heading2}
        painPoints={data?.choosingSection?.painPoints}
        resultText={data?.choosingSection?.resultText}
        image1={data?.choosingSection?.image1}
        tagline={data?.choosingSection?.tagline}
        solutionBullets={data?.choosingSection?.solutionBullets}
        image2={data?.choosingSection?.image2}
        ctaText={data?.choosingSection?.ctaText}
        ctaLink={data?.choosingSection?.ctaLink}
      />
      </AnimatedSection>

      {/* 4. Core Collections — Hardwood, Engineered, Luxury Vinyl, Laminate */}
      <AnimatedSection variant="fadeUp">
        <CoreCollections />
      </AnimatedSection>

      {/* 5. Our Specialty — Supply, Installation, Contracting, Maintenance (4 icon blocks) */}
      <AnimatedSection variant="fadeUp">
        <OurSpecialty
        intro={data?.ourSpecialty?.intro}
        items={data?.ourSpecialty?.items}
        ctaText={data?.ourSpecialty?.ctaText}
        ctaLink={data?.ourSpecialty?.ctaLink}
      />
      </AnimatedSection>

      {/* 6. Why Choose Us — Premium / Expert / Seamless / Durable */}
      <AnimatedSection variant="fadeUp">
        <WhyLoveUs
        heading={data?.whyLoveUs?.heading}
        items={data?.whyLoveUs?.items}
      />
      </AnimatedSection>

      {/* 7. Projects Preview — 3 images */}
      <AnimatedSection variant="fadeUp">
        <ProjectsPreview
        heading={data?.projectsPreview?.heading}
        images={data?.projectsPreview?.images}
      />
      </AnimatedSection>

      {/* 8. Limited Time Offer — conversion booster */}
      <AnimatedSection variant="fadeUp">
        <LimitedTimeOffer
        badgeText={data?.limitedTimeOffer?.badgeText}
        heading={data?.limitedTimeOffer?.heading}
        body={data?.limitedTimeOffer?.body}
        body2={data?.limitedTimeOffer?.body2}
        backgroundImage={data?.limitedTimeOffer?.backgroundImage}
        ctaText={data?.limitedTimeOffer?.ctaText}
        ctaLink={data?.limitedTimeOffer?.ctaLink}
        cta2Text={data?.limitedTimeOffer?.cta2Text}
        cta2Link={data?.limitedTimeOffer?.cta2Link}
      />
      </AnimatedSection>

      {/* 9. Testimonials — 3–4 best */}
      <AnimatedSection variant="fadeUp">
        <Testimonials
        heading={data?.testimonialsHeading}
        testimonials={testimonials}
      />
      </AnimatedSection>

      {/* FAQ — 3 most popular questions */}
      {faqItems.length > 0 && (
        <AnimatedSection variant="fadeUp">
          <Faq heading={data?.faq?.heading} items={faqItems} />
        </AnimatedSection>
      )}

      {/* 10. Booking Form — bottom conversion */}
      <AnimatedSection variant="fadeUp">
        <BookVisitForm
        heading={data?.bookVisitForm?.heading}
        subheading={data?.bookVisitForm?.subheading}
        primaryCtaText={data?.bookVisitForm?.primaryCtaText}
        secondaryCtaText={data?.bookVisitForm?.secondaryCtaText}
      />
      </AnimatedSection>
    </>
  );
}
