'use client';

import Link from 'next/link';
import Image from 'next/image';
import type { SanityImageValue } from '@/lib/sanity/types';
import { urlFor } from '@/lib/sanity/image';

interface LimitedTimeOfferProps {
  badgeText?: string;
  heading?: string;
  body?: string;
  body2?: string;
  backgroundImage?: SanityImageValue | null;
  ctaText?: string;
  ctaLink?: string;
  cta2Text?: string;
  cta2Link?: string;
}

/**
 * "Special Offer — Save on Selected Floors" section with dual CTAs.
 * Design: badge, dark overlay background (optional image), white typography, two CTAs.
 */
export default function LimitedTimeOffer({
  badgeText,
  heading,
  body,
  body2,
  backgroundImage,
  ctaText,
  ctaLink,
  cta2Text,
  cta2Link,
}: LimitedTimeOfferProps) {
  const hasContent = heading || body || body2;
  const showBadge = badgeText || (hasContent ? 'Limited Time Offer' : '');
  if (!hasContent && !showBadge) return null;

  const bgImageUrl = backgroundImage
    ? urlFor(backgroundImage).width(1920).height(1080).auto('format').url()
    : null;

  return (
    <section className="relative min-h-[420px] overflow-hidden py-20 lg:min-h-[480px] lg:py-28">
      {/* Background: image (blurred) + dark overlay */}
      {bgImageUrl && (
        <div className="absolute inset-0">
          <Image
            src={bgImageUrl}
            alt=""
            fill
            className="object-cover blur-[4px] scale-105"
            sizes="100vw"
            priority={false}
          />
        </div>
      )}
      <div
        className="absolute inset-0 bg-gradient-to-b from-stone-900/90 via-stone-800/92 to-stone-900/90"
        aria-hidden
      />

      <div className="relative mx-auto max-w-3xl px-4 text-center">
        {/* Badge: e.g. "% Limited Time Offer" */}
        {showBadge && (
          <div
            className="inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-semibold uppercase tracking-wide text-white"
            style={{ backgroundColor: 'var(--color-accent-orange)' }}
          >
            <span aria-hidden>%</span>
            <span>{showBadge}</span>
          </div>
        )}

        {heading && (
          <h2 className="mt-5 text-3xl font-bold tracking-tight text-white lg:text-4xl xl:text-5xl [font-family:var(--font-playfair),Georgia,serif]">
            {heading}
          </h2>
        )}

        {body && (
          <p className="mt-5 text-base leading-relaxed text-white/95 lg:text-lg">
            {body}
          </p>
        )}
        {body2 && (
          <p className="mt-2 text-sm italic text-white/85 lg:text-base">
            {body2}
          </p>
        )}

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          {ctaLink && ctaText && (
            <Link href={ctaLink} className="btn-primary">
              {ctaText}
            </Link>
          )}
          {cta2Link && cta2Text && (
            <Link href={cta2Link} className="btn-secondary">
              {cta2Text}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
