'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { SanityImageValue } from '@/lib/sanity/types';
import { urlFor } from '@/lib/sanity/image';

interface ChoosingSectionProps {
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
}

/** Red warning icon (exclamation in circle) for pain points */
function WarningIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

/** Green checkmark icon for solution bullets */
function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

/**
 * "Choosing the Right Floor — Doesn't Have to Be Hard" section.
 * Two-column layout per design: problem left + image right, then image left + solution right.
 */
export default function ChoosingSection({
  heading1,
  heading2,
  painPoints,
  resultText,
  image1,
  tagline,
  solutionBullets,
  image2,
  ctaText,
  ctaLink,
}: ChoosingSectionProps) {
  if (!heading1 && !heading2 && !tagline) return null;

  const hasImage1 = Boolean(image1?.asset);
  const hasImage2 = Boolean(image2?.asset);

  const fullHeading = [heading1, heading2].filter(Boolean).join(' ');

  return (
    <section className="bg-[#faf8f5] py-16 lg:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Row 1: Problem (left) + Image (right) */}
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 lg:items-center">
          <div>
            {fullHeading && (
              <h2 className="text-2xl font-bold tracking-tight text-stone-800 lg:text-3xl [font-family:var(--font-playfair),Georgia,serif]">
                {fullHeading}
              </h2>
            )}
            <p className="mt-6 text-base text-stone-600">
              Buying flooring is a big investment – but most homeowners feel stuck because:
            </p>
            {painPoints && painPoints.length > 0 && (
              <ul className="mt-4 space-y-3 text-base text-stone-600">
                {painPoints.map((item, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center text-red-600">
                      <WarningIcon className="h-5 w-5" />
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            )}
            {resultText && (
              <div className="mt-6 rounded-lg bg-stone-200/70 p-5">
                <p className="font-semibold text-stone-800">The result?</p>
                <p className="mt-2 text-stone-600">{resultText}</p>
              </div>
            )}
          </div>

          {/* Image 1 — person examining samples */}
          <div className="relative aspect-[4/3] overflow-hidden rounded-xl shadow-md lg:aspect-[5/4]">
            {hasImage1 ? (
              <Image
                src={urlFor(image1!).width(800).height(640).auto('format').url()}
                alt="Person examining hardwood flooring samples"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-stone-300 via-stone-200 to-stone-400" aria-hidden />
            )}
          </div>
        </div>

        {/* Row 2: Image (left) + Solution (right) */}
        <div className="mt-16 grid gap-12 lg:mt-20 lg:grid-cols-2 lg:gap-16 lg:items-center">
          {/* Image 2 — showroom */}
          <div className="relative aspect-[4/3] overflow-hidden rounded-xl shadow-md lg:aspect-[5/4] order-2 lg:order-1">
            {hasImage2 ? (
              <Image
                src={urlFor(image2!).width(800).height(640).auto('format').url()}
                alt="Customer exploring flooring samples in showroom"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-stone-300 via-stone-200 to-stone-400" aria-hidden />
            )}
          </div>

          <div className="order-1 lg:order-2">
            {tagline && (
              <h2 className="text-2xl font-bold tracking-tight text-stone-800 lg:text-3xl [font-family:var(--font-playfair),Georgia,serif]">
                {tagline}
              </h2>
            )}
            <p className="mt-6 text-base text-stone-600">
              That&apos;s why we created a simple, stress-free way to find your perfect floor:
            </p>
            {solutionBullets && solutionBullets.length > 0 && (
              <ul className="mt-4 space-y-3 text-base text-stone-600">
                {solutionBullets.map((item, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center text-emerald-600">
                      <CheckIcon className="h-5 w-5" />
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            )}
            {ctaLink && ctaText && (
              <div className="mt-8">
                <Link href={ctaLink} className="btn-primary">
                  {ctaText}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
