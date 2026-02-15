import type { SanityImageValue } from "@/lib/sanity/types";
import HeroSection from "@/components/home/HeroSection";
import ChoosingSection from "@/components/home/ChoosingSection";
import WhyLoveUs from "@/components/home/WhyLoveUs";
import BookVisitForm from "@/components/home/BookVisitForm";
import JsonLd, { buildOrganizationJsonLd } from "@/components/seo/JsonLd";
import { sanityFetch } from "@/lib/sanity/fetch";
import { getHomepageQuery, getTopLevelCategoriesQuery } from "@/lib/sanity/queries";
import { getSiteSettings } from "@/lib/sanity/siteSettings";
import { SITE_URL } from "@/lib/constants";
import Link from "next/link";

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

interface CategoryBrief {
  _id: string;
  title?: string;
  slug?: { current?: string };
}

/** Simplified landing page — hero, intro, browse collections CTA, why us, book visit */
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

  const [settings, categories] = await Promise.all([
    getSiteSettings(),
    sanityFetch<CategoryBrief[] | null>({
      query: getTopLevelCategoriesQuery,
      tags: ["category"],
    }),
  ]);

  const description =
    data?.choosingSection?.tagline ||
    "Premium flooring solutions for your home.";

  const topCategories = categories ?? [];

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
        image1={data?.choosingSection?.image1}
        tagline={data?.choosingSection?.tagline}
        solutionBullets={data?.choosingSection?.solutionBullets}
        image2={data?.choosingSection?.image2}
        ctaText={data?.choosingSection?.ctaText}
        ctaLink={data?.choosingSection?.ctaLink}
      />

      {/* Browse Collections — quick links to main sections */}
      <section className="bg-stone-50 py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="section-heading">Browse Our Collections</h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-stone-600">
            Explore hardwood, engineered, vinyl, laminate, and more. Find the
            perfect floor for your space.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/collections"
              className="btn-primary rounded-lg px-6 py-3"
            >
              View All Collections
            </Link>
            {topCategories.slice(0, 4).map((cat) => (
              <Link
                key={cat._id}
                href={`/categories/${cat.slug?.current ?? ""}`}
                className="rounded-lg border border-charcoal/20 bg-white px-6 py-3 text-sm font-semibold text-charcoal transition-colors hover:border-accent-orange hover:bg-accent-orange/5 hover:text-accent-orange"
              >
                {cat.title}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <WhyLoveUs
        heading={data?.whyLoveUs?.heading}
        items={data?.whyLoveUs?.items}
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
