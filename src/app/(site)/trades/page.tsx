import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/layout/Container";
import PortableText from "@/components/sanity/PortableText";
import { sanityFetch } from "@/lib/sanity/fetch";
import { getTradesPageQuery } from "@/lib/sanity/queries";
import { urlFor } from "@/lib/sanity/image";
import type { SanityImageValue } from "@/lib/sanity/types";

interface TradesPageData {
  title: string;
  body?: Record<string, unknown>[];
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    openGraphImage?: SanityImageValue;
  };
}

export async function generateMetadata(): Promise<Metadata> {
  const page = await sanityFetch<TradesPageData | null>({
    query: getTradesPageQuery,
    tags: ["page"],
  });

  if (page?.seo) {
    const metadata: Metadata = {
      title: page.seo.metaTitle || page.title,
      description: page.seo.metaDescription,
      alternates: {
        canonical: "/trades",
      },
    };

    if (page.seo.openGraphImage?.asset?._ref) {
      metadata.openGraph = {
        images: [
          {
            url: urlFor(page.seo.openGraphImage)
              .width(1200)
              .height(630)
              .auto("format")
              .url(),
            width: 1200,
            height: 630,
          },
        ],
      };
    }

    return metadata;
  }

  return {
    title: page?.title,
    alternates: {
      canonical: "/trades",
    },
  };
}

export default async function TradesPage() {
  const page = await sanityFetch<TradesPageData | null>({
    query: getTradesPageQuery,
    tags: ["page"],
  });

  return (
    <>
      {/* Page Header — Magna dark banner */}
      <section className="bg-charcoal py-16">
        <Container>
          {page?.title && (
            <h1 className="text-3xl font-bold uppercase tracking-wider text-white sm:text-4xl">
              {page.title}
            </h1>
          )}
        </Container>
      </section>

      <Container className="py-12">
        {/* CMS Body Content */}
        {page?.body && (
          <div className="mx-auto max-w-3xl">
            <div className="prose-content">
              <PortableText value={page.body} />
            </div>
          </div>
        )}

        {/* CTA Section */}
        <div className="mx-auto mt-16 max-w-xl text-center">
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/trades/register"
              className="bg-accent-orange px-6 py-3 text-sm font-semibold uppercase tracking-wider text-white transition-colors hover:bg-accent-orange-hover"
            >
              Register for Trade Account
            </Link>
            <Link
              href="/trades/login"
              className="border border-charcoal px-6 py-3 text-sm font-semibold uppercase tracking-wider text-charcoal-dark transition-colors hover:bg-charcoal hover:text-white"
            >
              Log In
            </Link>
          </div>
        </div>
      </Container>
    </>
  );
}
