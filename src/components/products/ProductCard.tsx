import Link from "next/link";
import Image from "next/image";
import type { SanityImageValue } from "@/lib/sanity/types";
import { urlFor } from "@/lib/sanity/image";

interface ProductCardProps {
  title?: string;
  slug?: string;
  price?: number;
  salePrice?: number | null;
  isOnSale?: boolean;
  priceUnit?: string;
  image?: SanityImageValue;
}

/**
 * Reusable product card component (Magna-style).
 * Displays a thumbnail image, title, and optional price.
 * Links to the product detail page at /products/[slug].
 * All data from Sanity CMS — renders nothing if no slug.
 */
export default function ProductCard({
  title,
  slug,
  price,
  salePrice,
  isOnSale,
  priceUnit = "/ sq ft",
  image,
}: ProductCardProps) {
  if (!slug) return null;

  const hasImage = !!image?.asset?._ref;
  const displayPrice = isOnSale && salePrice != null ? salePrice : price;

  return (
    <Link
      href={`/products/${slug}`}
      className="group overflow-hidden border border-gray-200 bg-white transition-shadow hover:shadow-lg"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        {hasImage ? (
          <Image
            src={urlFor(image!).width(600).height(450).auto("format").url()}
            alt={title || ""}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            loading="lazy"
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
        {title && (
          <h3 className="text-base font-semibold text-charcoal-dark group-hover:text-accent-orange">
            {title}
          </h3>
        )}
        {displayPrice != null && displayPrice > 0 ? (
          <div className="mt-1 flex items-baseline gap-2">
            {isOnSale && salePrice != null && price != null && price > 0 && (
              <span className="text-sm text-gray-400 line-through">
                ${price.toFixed(2)}
              </span>
            )}
            <span className={`text-sm ${isOnSale && salePrice != null ? "font-semibold text-accent-orange" : "text-gray-600"}`}>
              From ${displayPrice.toFixed(2)} {priceUnit}
            </span>
          </div>
        ) : displayPrice === 0 ? (
          <p className="mt-1 text-sm text-gray-500">Contact for price</p>
        ) : null}
      </div>
    </Link>
  );
}
