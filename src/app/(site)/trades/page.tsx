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

const defaultBenefits = [
  {
    title: "Wholesale Pricing",
    description:
      "Access exclusive trade pricing on our full range of premium hardwood products.",
  },
  {
    title: "Dedicated Support",
    description:
      "Get priority support from our team of hardwood specialists for your projects.",
  },
  {
    title: "Bulk Ordering",
    description:
      "Streamlined bulk ordering process with flexible delivery options.",
  },
  {
    title: "Extended Product Range",
    description:
      "View our complete wholesale catalog including trade-exclusive products.",
  },
];

export async function generateMetadata(): Promise<Metadata> {
  const page = await sanityFetch<TradesPageData | null>({
    query: getTradesPageQuery,
    tags: ["page"],
  });

  if (page?.seo) {
    const metadata: Metadata = {
      title: page.seo.metaTitle || page.title || "Trades | Hardwood Living",
      description:
        page.seo.metaDescription ||
        "Join our Trade Program for exclusive pricing, dedicated support, and wholesale access to premium hardwood products.",
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
    title: page?.title || "Trades | Hardwood Living",
    description:
      "Join our Trade Program for exclusive pricing, dedicated support, and wholesale access to premium hardwood products.",
  };
}

export default async function TradesPage() {
  const page = await sanityFetch<TradesPageData | null>({
    query: getTradesPageQuery,
    tags: ["page"],
  });

  return (
    <Container className="py-16">
      {/* Page Header */}
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          {page?.title || "Trade Program"}
        </h1>
        {!page?.body && (
          <p className="mt-4 text-lg leading-8 text-gray-600">
            Partner with Hardwood Living and unlock exclusive benefits designed
            for trade professionals, contractors, and installers.
          </p>
        )}
      </div>

      {/* CMS Body Content */}
      {page?.body && (
        <div className="mx-auto mt-10 max-w-3xl">
          <div className="prose-content">
            <PortableText value={page.body} />
          </div>
        </div>
      )}

      {/* Default Benefits Section (shown when no CMS content) */}
      {!page?.body && (
        <div className="mx-auto mt-16 max-w-4xl">
          <h2 className="text-center text-2xl font-bold text-gray-900">
            Trade Program Benefits
          </h2>
          <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2">
            {defaultBenefits.map((benefit) => (
              <div
                key={benefit.title}
                className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
              >
                <h3 className="text-lg font-semibold text-gray-900">
                  {benefit.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-gray-600">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CTA Section */}
      <div className="mx-auto mt-16 max-w-xl text-center">
        <h2 className="text-2xl font-bold text-gray-900">Get Started Today</h2>
        <p className="mt-4 text-gray-600">
          Ready to join our trade program? Register for an account or log in to
          access your trade dashboard.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/trades/register"
            className="inline-flex items-center rounded-md bg-amber-700 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-amber-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-700"
          >
            Register for Trade Account
          </Link>
          <Link
            href="/trades/login"
            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-500"
          >
            Log In
          </Link>
        </div>
      </div>
    </Container>
  );
}
