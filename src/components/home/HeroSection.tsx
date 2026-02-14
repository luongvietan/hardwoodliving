'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { SanityImageValue } from '@/lib/sanity/types';
import { urlFor } from '@/lib/sanity/image';

export interface HeroContactInfo {
  phone?: string;
  email?: string;
}

interface HeroSectionProps {
  heading?: string;
  subheading?: string;
  images?: SanityImageValue[];
  ctaLink?: string;
  ctaText?: string;
  cta2Link?: string;
  cta2Text?: string;
  contactInfo?: HeroContactInfo;
}

/** Gold star for rating display */
function StarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

/**
 * Hero section with room imagery, centered headline/subheading,
 * social proof, dual CTAs, and optional contact strip (phone/email).
 * Content from Sanity CMS; contact from site settings.
 */
export default function HeroSection({
  heading,
  subheading,
  images,
  ctaLink,
  ctaText,
  cta2Link,
  cta2Text,
  contactInfo,
}: HeroSectionProps) {
  const validImages = images?.filter((img) => img.asset?._ref) ?? [];
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = useCallback(() => {
    if (validImages.length <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % validImages.length);
  }, [validImages.length]);

  useEffect(() => {
    if (validImages.length <= 1) return;
    const interval = setInterval(nextSlide, 6000);
    return () => clearInterval(interval);
  }, [nextSlide, validImages.length]);

  if (!heading && !subheading && validImages.length === 0) return null;

  const hasContactStrip = contactInfo?.phone || contactInfo?.email;

  return (
    <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden bg-stone-200 lg:min-h-[80vh]">
      {/* Background images */}
      {validImages.length > 0 &&
        validImages.map((img, index) => (
          <Image
            key={img._key || index}
            src={urlFor(img).width(1920).height(1080).auto('format').url()}
            alt={img.alt || heading || ''}
            fill
            priority={index === 0}
            sizes="100vw"
            className={`object-cover transition-opacity duration-1000 ${
              index === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ))}

      {validImages.length === 0 && (
        <div className="absolute inset-0 bg-gradient-to-br from-stone-300 via-stone-200 to-stone-400" />
      )}

      {/* Light overlay for readability (dark text on light) */}
      <div
        className="absolute inset-0 bg-white/50 lg:bg-white/40"
        aria-hidden
      />

      {/* Hero content — upper third of section, horizontally centered (per design) */}
      <div className="relative z-10 flex min-h-[70vh] flex-col items-center justify-start px-4 pt-[min(26vh,7rem)] pb-24 text-center lg:min-h-[80vh] lg:pt-[min(28vh,9rem)]">
        {heading && (
          <h1 className="font-serif text-4xl font-bold tracking-tight text-stone-900 sm:text-5xl lg:text-6xl xl:text-7xl [font-family:var(--font-playfair),Georgia,serif]">
            {heading}
          </h1>
        )}
        {subheading && (
          <p className="mt-5 max-w-xl text-base text-stone-700 sm:text-lg lg:text-xl">
            {subheading}
          </p>
        )}

        {/* Social proof: 5K + stars + rating (design) */}
        <div className="mt-5 flex flex-col items-center gap-1.5">
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-9 w-9 rounded-full border-2 border-white bg-stone-400 shadow-sm"
                  aria-hidden
                />
              ))}
            </div>
            <span
              className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold"
              style={{ backgroundColor: 'var(--color-accent-orange)', color: 'white' }}
            >
              5K
            </span>
            <div className="flex items-center gap-0.5" aria-hidden>
              {[1, 2, 3, 4, 5].map((i) => (
                <StarIcon key={i} className="h-5 w-5 text-amber-500" />
              ))}
            </div>
          </div>
          <p className="text-sm font-medium text-stone-700">Rated 5.0/5.0 by users</p>
        </div>

        {/* Dual CTAs — design tokens */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
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

      {/* Contact strip — bottom left: two panels with thin vertical divider (design) */}
      {hasContactStrip && (
        <div className="absolute bottom-6 left-4 z-10 flex overflow-hidden rounded-lg shadow-md sm:left-6 lg:left-8">
          {contactInfo?.phone && (
            <a
              href={`tel:${contactInfo.phone.replace(/\s/g, '')}`}
              className="bg-white/95 px-4 py-3 text-sm font-medium text-stone-800 backdrop-blur-sm transition-colors hover:bg-white"
            >
              {contactInfo.phone}
            </a>
          )}
          {contactInfo?.phone && contactInfo?.email && (
            <div className="w-px bg-gray-300/80" aria-hidden />
          )}
          {contactInfo?.email && (
            <a
              href={`mailto:${contactInfo.email}`}
              className="bg-white/95 px-4 py-3 text-sm font-medium text-stone-800 backdrop-blur-sm transition-colors hover:bg-white"
            >
              {contactInfo.email}
            </a>
          )}
        </div>
      )}

      {/* Slideshow dots */}
      {validImages.length > 1 && (
        <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-2">
          {validImages.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setCurrentIndex(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentIndex
                  ? 'w-8 bg-gray-800'
                  : 'w-2 bg-gray-500/70 hover:bg-gray-600'
              }`}
              aria-label={`Go to slide ${index + 1}`}
              aria-current={index === currentIndex}
            />
          ))}
        </div>
      )}
    </section>
  );
}
