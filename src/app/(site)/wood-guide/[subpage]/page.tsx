import type { Metadata } from "next";
import Container from "@/components/layout/Container";
import ChoosingSection from "@/components/home/ChoosingSection";
import FlooringGrades from "@/components/home/FlooringGrades";
import LumberCuts from "@/components/home/LumberCuts";
import JsonLd, { buildBreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { sanityFetch } from "@/lib/sanity/fetch";
import { getHomepageQuery } from "@/lib/sanity/queries";
import { SITE_URL } from "@/lib/constants";
import { WOOD_GUIDE_PAGES } from "@/lib/url-structure";
import { notFound } from "next/navigation";

const validSlugs = WOOD_GUIDE_PAGES.map((p) => p.slug);

export async function generateStaticParams() {
  return validSlugs.map((subpage) => ({ subpage }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ subpage: string }>;
}): Promise<Metadata> {
  const { subpage } = await params;
  const page = WOOD_GUIDE_PAGES.find((p) => p.slug === subpage);
  if (!page) return { title: "Not Found" };
  return {
    title: `${page.title} | Wood Guide`,
    description: `Learn about ${page.title.toLowerCase()} for flooring selection.`,
    alternates: { canonical: `${SITE_URL}/wood-guide/${subpage}` },
  };
}

export default async function WoodGuideSubpage({
  params,
}: {
  params: Promise<{ subpage: string }>;
}) {
  const { subpage } = await params;
  const page = WOOD_GUIDE_PAGES.find((p) => p.slug === subpage);
  if (!page) notFound();

  const data = await sanityFetch<{
    choosingSection?: Record<string, unknown>;
    lumberCuts?: Record<string, unknown>;
    flooringGrades?: Record<string, unknown>;
  } | null>({ query: getHomepageQuery, tags: ["homepage"] });

  const breadcrumbItems = [
    { name: "Home", url: SITE_URL },
    { name: "Wood Guide", url: `${SITE_URL}/wood-guide` },
    { name: page.title, url: `${SITE_URL}/wood-guide/${subpage}` },
  ];

  return (
    <>
      <JsonLd data={buildBreadcrumbJsonLd(breadcrumbItems)} />
      <section className="bg-charcoal py-16">
        <Container>
          <h1 className="text-3xl font-bold uppercase tracking-wider text-white sm:text-4xl">
            {page.title}
          </h1>
        </Container>
      </section>
      {subpage === "lumber-cuts" && (
        <LumberCuts
          heading={data?.lumberCuts?.heading as string | undefined}
          intro={data?.lumberCuts?.intro as string | undefined}
          cuts={data?.lumberCuts?.cuts as { name?: string; description?: string }[] | undefined}
        />
      )}
      {subpage === "flooring-grades" && (
        <FlooringGrades
          heading={data?.flooringGrades?.heading as string | undefined}
          subheading={data?.flooringGrades?.subheading as string | undefined}
          grades={data?.flooringGrades?.grades as { name?: string; bullets?: string[] }[] | undefined}
        />
      )}
      {subpage === "how-to-choose-flooring" && (
        <ChoosingSection
          heading1={data?.choosingSection?.heading1 as string | undefined}
          heading2={data?.choosingSection?.heading2 as string | undefined}
          painPoints={data?.choosingSection?.painPoints as string[] | undefined}
          resultText={data?.choosingSection?.resultText as string | undefined}
          image1={data?.choosingSection?.image1 ?? undefined}
          tagline={data?.choosingSection?.tagline as string | undefined}
          solutionBullets={data?.choosingSection?.solutionBullets as string[] | undefined}
          image2={data?.choosingSection?.image2 ?? undefined}
          ctaText={data?.choosingSection?.ctaText as string | undefined}
          ctaLink={data?.choosingSection?.ctaLink as string | undefined}
        />
      )}
      {subpage === "floor-maintenance-guide" && (
        <section className="bg-stone-50 py-16">
          <Container>
            <div className="mx-auto max-w-2xl">
              <p className="text-stone-600">
                Proper care and maintenance will keep your hardwood floors looking
                beautiful for decades. Regular sweeping, avoid excess moisture, use
                felt pads under furniture, and follow manufacturer guidelines for
                cleaning products.
              </p>
            </div>
          </Container>
        </section>
      )}
    </>
  );
}
