import Link from "next/link";
import Image from "next/image";
import type { SanityImageValue } from "@/lib/sanity/types";
import { urlFor } from "@/lib/sanity/image";

interface ProductCardProps {
  title: string;
  slug: { current: string };
  price: number;
  priceUnit?: string;
  images?: SanityImageValue[];
}

/**
 * Reusable product card component displaying a thumbnail image, title, and price.
 * Links to the product detail page at /products/[slug].
 * Handles missing images with a placeholder icon.
 */
export default function ProductCard({
  title,
  slug,
  price,
  priceUnit = "/ sq ft",
  images,
}: ProductCardProps) {
  const firstImage = images?.[0];
  const hasImage = !!firstImage?.asset?._ref;

  return (
    <Link
      href={`/products/${slug.current}`}
      className="group overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        {hasImage ? (
          <Image
            src={urlFor(firstImage!)
              .width(600)
              .height(450)
              .auto("format")
              .url()}
            alt={title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-gray-400">
            <svg
              className="h-12 w-12"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1}
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5a2.25 2.25 0 002.25-2.25V5.25a2.25 2.25 0 00-2.25-2.25H3.75a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 003.75 21z"
              />
            </svg>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-amber-900">
          {title}
        </h3>
        {price > 0 && (
          <p className="mt-1 text-sm text-gray-600">
            From ${price.toFixed(2)} {priceUnit}
          </p>
        )}
      </div>
    </Link>
  );
}
