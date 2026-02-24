'use client';

import { useId } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { SanityImageValue } from '@/lib/sanity/types';
import { urlFor } from '@/lib/sanity/image';

export interface HeroContactInfo {
  phone?: string;
  email?: string;
}

interface HeroCategory {
  label: string;
  link?: string;
}

interface HeroSectionProps {
  heading?: string;
  subheading?: string;
  subheading2?: string;
  images?: SanityImageValue[];
  ctaLink?: string;
  ctaText?: string;
  cta2Link?: string;
  cta2Text?: string;
  categories?: HeroCategory[];
  contactInfo?: HeroContactInfo;
  siteName?: string;
  logo?: SanityImageValue;
}

/** Checkmark for category bar */
function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
    </svg>
  );
}

/**
 * Hero section: top utility bar (black), transparent main nav,
 * centered hero content (dark brown headline, dual CTAs), dark category bar.
 * Content synced with Sanity.
 */
export default function HeroSection({
  heading = "CRAFTED BY NATURE",
  subheading = "SELECT FLOORING, PERSONALIZED SERVICE",
  subheading2 = "VISION TO REALITY",
  images,
  ctaLink = "/contact",
  ctaText = "Book a Showroom Visit",
  cta2Link = "/contact",
  cta2Text = "Request More Info",
  categories,
  contactInfo,
  siteName = "HardwoodLiving",
  logo,
}: HeroSectionProps) {
  const validImages = images?.filter((img) => img.asset?._ref) ?? [];
  const heroImage = validImages.length > 0 ? validImages[0] : null;

  const defaultImageUrl =
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCodIDl2cGpofws4g7ZivY6eZ0bUUUMHDz5GjrajVd5WYHXEUQx-vg3wpE8joVSdNKb09O3APkN-UHQ4zOL3S45bORFtxhTSfrVo8KIpFEBYt9DSY6YlaMrs8ktw9Mpk5kM9ZgScqpgokIL0l_LgvKIBmA9q7dFQlCODKq18NZtWiEW4-LBILS1JyZnmmYGCp2A40S5VSD9ui60jyRZmn9qXF71UjUfiZq40Md0gIDXa-IWKy2VsrI2eRtgJK7-RVVWpVJAoKjYuT4';

  const defaultCategories: HeroCategory[] = [
    { label: 'Hardwoods', link: '/collections/hardwood' },
    { label: 'Engineered', link: '/collections/engineered-hardwood' },
    { label: 'Laminates', link: '/collections/laminate' },
    { label: 'Vinyl', link: '/collections/luxury-vinyl-plank' },
    { label: 'Mats', link: '/accessories' },
  ];

  const heroCategories = categories?.length ? categories : defaultCategories;
  const woodFilterId = `hero-cta-wood-${useId().replace(/:/g, '')}`;

  return (
    <section className="relative flex w-full flex-col" style={{ height: 'calc(100vh - 6.5rem)' }}>
      {/* Background image — overflow-hidden only here so sticky can work on section */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {heroImage ? (
          <Image
            src={urlFor(heroImage).width(1920).height(1080).auto('format').url()}
            alt={heading || 'Hero'}
            fill
            priority
            sizes="100vw"
            className="object-cover"
            quality={90}
          />
        ) : (
          <Image
            src={defaultImageUrl}
            alt="Hero"
            fill
            priority
            sizes="100vw"
            className="object-cover"
            quality={90}
          />
        )}
        {/* Subtle overlay: lighter in center so dark headline is readable */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" aria-hidden="true" />
      </div>

      {/* Wood-grain SVG filter for primary CTA (template pattern) */}
      <svg xmlns="http://www.w3.org/2000/svg" className="absolute h-0 w-0 overflow-hidden" aria-hidden="true">
        <defs>
          <filter id={woodFilterId} x="-30%" y="-30%" width="160%" height="160%">
            <feTurbulence baseFrequency=".002 .02" numOctaves={9} result="n" />
            <feDiffuseLighting surfaceScale={9} lightingColor="#ba8c63">
              <feDistantLight elevation={60} azimuth={-90} />
            </feDiffuseLighting>
            <feDisplacementMap in2="n" scale={50} />
          </filter>
        </defs>
      </svg>

      {/* Hero content — centered, dark brown headline + two subheadings + CTAs; min-h-0 so category bar stays in viewport */}
      <div className="relative z-10 flex min-h-0 flex-1 flex-col items-center justify-center px-4 sm:px-8 md:px-16 pb-6 md:pb-8 text-center">
        <div className="max-w-4xl">
          <h1 className="mb-3 text-4xl font-bold uppercase leading-tight tracking-tight drop-shadow-sm sm:text-5xl md:mb-4 md:text-6xl lg:text-7xl [font-family:var(--font-playfair),Georgia,serif] [color:var(--hero-headline-color)]">
            {heading.split('\n').map((line, i, arr) => (
              <span key={i}>
                {line}
                {i < arr.length - 1 && <br />}
              </span>
            ))}
          </h1>
          {subheading && (
            <p className="text-sm font-semibold uppercase tracking-widest sm:text-base md:text-lg [color:var(--hero-headline-color)]">
              {subheading}
            </p>
          )}
          {subheading2 && (
            <p className="mt-1 text-xs font-medium uppercase tracking-widest sm:text-sm md:mt-2 md:text-base [color:var(--hero-headline-muted)]">
              {subheading2}
            </p>
          )}
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row md:mt-10">
            {ctaLink && ctaText && (
              <div className="w-full min-w-[200px] overflow-hidden rounded-sm sm:w-auto">
                <Link
                  href={ctaLink}
                  className="group relative flex w-full items-center justify-center rounded-sm px-8 py-4 text-center text-xs font-semibold uppercase tracking-widest text-white shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  {/* Wood texture: layer slightly larger so displacement still covers edges */}
                  <span
                    className="absolute -inset-[15%] rounded-sm transition-colors [background-color:var(--hero-cta-primary-bg)] group-hover:[background-color:var(--hero-cta-primary-bg-hover)]"
                    style={{ filter: `url(#${woodFilterId})` }}
                    aria-hidden
                  />
                  <span className="relative z-10">{ctaText}</span>
                </Link>
              </div>
            )}
            {cta2Link && cta2Text && (
              <Link
                href={cta2Link}
                className="w-full min-w-[200px] rounded-sm border-2 bg-white/95 px-8 py-4 text-center text-xs font-semibold uppercase tracking-widest transition-all hover:bg-white hover:scale-[1.02] active:scale-[0.98] sm:w-auto [border-color:color-mix(in_srgb,var(--hero-cta-secondary-border)_60%,transparent)] [color:var(--hero-headline-color)] hover:[border-color:var(--hero-cta-secondary-border)]"
              >
                {cta2Text}
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Bottom category bar — dark strip, white text, checkmarks; shrink-0 so it stays in first viewport */}
      <div className="relative z-10 w-full shrink-0 py-5 shadow-lg backdrop-blur-sm md:py-6 [background-color:color-mix(in_srgb,var(--hero-bar-bg)_90%,transparent)]">
        <div className="px-4 sm:px-8 md:px-16">
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
            {heroCategories.map((category, index) => (
              <Link
                key={category.label || index}
                href={category.link || '#'}
                className="flex items-center gap-2 transition-colors [color:var(--hero-bar-text)] hover:text-amber-200"
              >
                <span className="text-xs font-medium uppercase tracking-widest sm:text-sm">
                  {category.label}
                </span>
                <CheckIcon className="h-4 w-4 [color:var(--hero-bar-icon)]" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
