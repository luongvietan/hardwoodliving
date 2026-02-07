'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { SanityImageValue } from '@/lib/sanity/types';
import { urlFor } from '@/lib/sanity/image';

interface HeroSectionProps {
  heading?: string;
  subheading?: string;
  images?: SanityImageValue[];
  ctaLink?: string;
  ctaText?: string;
}

/**
 * Magna-style hero section with full-width image slideshow.
 * Large centered text overlay (uppercase, white, bold).
 * Auto-advances every 6 seconds with dot indicators.
 * All content from Sanity CMS — renders nothing if no data.
 */
export default function HeroSection({
  heading,
  subheading,
  images,
  ctaLink,
  ctaText,
}: HeroSectionProps) {
  const validImages = images?.filter((img) => img.asset?._ref) ?? [];
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = useCallback(() => {
    if (validImages.length <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % validImages.length);
  }, [validImages.length]);

  // Auto-advance slideshow
  useEffect(() => {
    if (validImages.length <= 1) return;
    const interval = setInterval(nextSlide, 6000);
    return () => clearInterval(interval);
  }, [nextSlide, validImages.length]);

  // Don't render if no content at all
  if (!heading && !subheading && validImages.length === 0) return null;

  return (
    <section className="relative flex min-h-[60vh] items-center justify-center overflow-hidden bg-charcoal-dark lg:min-h-[70vh]">
      {/* Slideshow Images */}
      {validImages.length > 0 &&
        validImages.map((img, index) => (
          <Image
            key={img._key || index}
            src={urlFor(img).width(1920).height(900).auto('format').url()}
            alt={img.alt || heading || ''}
            fill
            priority={index === 0}
            sizes="100vw"
            className={`object-cover transition-opacity duration-1000 ${
              index === currentIndex ? 'opacity-50' : 'opacity-0'
            }`}
          />
        ))}

      {/* Fallback gradient when no images */}
      {validImages.length === 0 && (
        <div className="absolute inset-0 bg-gradient-to-br from-charcoal-dark via-charcoal to-charcoal-dark" />
      )}

      {/* Text Overlay */}
      <div className="relative z-10 px-4 py-24 text-center">
        {heading && (
          <h1 className="text-4xl font-bold uppercase tracking-wider text-white sm:text-5xl lg:text-6xl">
            {heading}
          </h1>
        )}
        {subheading && (
          <p className="mt-4 text-sm font-semibold uppercase tracking-[0.2em] text-gray-300 sm:text-base lg:text-lg">
            {subheading}
          </p>
        )}
        {ctaLink && ctaText && (
          <Link
            href={ctaLink}
            className="mt-8 inline-block border border-white/50 bg-white/10 px-8 py-3 text-sm font-semibold uppercase tracking-wider text-white backdrop-blur-sm transition-colors hover:bg-white/20"
          >
            {ctaText}
          </Link>
        )}
      </div>

      {/* Slideshow Dots */}
      {validImages.length > 1 && (
        <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-2">
          {validImages.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setCurrentIndex(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentIndex
                  ? 'w-8 bg-white'
                  : 'w-2 bg-white/50 hover:bg-white/75'
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
