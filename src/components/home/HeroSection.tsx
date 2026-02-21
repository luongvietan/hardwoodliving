'use client';

import { useId } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { SanityImageValue } from '@/lib/sanity/types';
import { urlFor } from '@/lib/sanity/image';
import type { NavItem, ContactInfo } from '@/lib/sanity/siteSettings';
import MobileMenu from '@/components/layout/MobileMenu';

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
  navigation?: NavItem[];
}

/** Stylized H icon for logo */
function LogoHIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="currentColor" aria-hidden="true">
      <path d="M10 6v20h4V17h4v9h4V6h-4v9h-4V6h-4z" />
    </svg>
  );
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
  navigation = [],
}: HeroSectionProps) {
  const validImages = images?.filter((img) => img.asset?._ref) ?? [];
  const heroImage = validImages.length > 0 ? validImages[0] : null;
  const nav = navigation ?? [];
  const hasLogo = !!logo?.asset?._ref;

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
  const displayName = siteName ? `${siteName}®` : 'HARDWOODLIVING®';
  const woodFilterId = `hero-cta-wood-${useId().replace(/:/g, '')}`;

  return (
    <section className="relative flex min-h-screen w-full flex-col">
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

      {/* Fixed header: top bar + navbar stay visible when scrolling (fixed to viewport) */}
      <div className="fixed left-0 right-0 top-0 z-50 w-full">
        {/* Top utility bar — black, logo left, FAQ + phone + email right */}
        <div className="w-full bg-black px-4 py-3 sm:px-6 md:px-16">
          <div className="flex items-center justify-between gap-4 text-sm text-white">
            <Link href="/" className="flex items-center gap-2 shrink-0" aria-label={`${siteName} - Home`}>
              <LogoHIcon className="h-6 w-6 sm:h-7 sm:w-7" />
              <span className="font-semibold uppercase tracking-tight">{displayName}</span>
            </Link>
            <div className="flex flex-wrap items-center justify-end gap-4 sm:gap-6">
              <Link href="/wood-guide" className="hover:underline">
                FAQ
              </Link>
              {contactInfo?.phone && (
                <a href={`tel:${contactInfo.phone.replace(/\D/g, '')}`} className="hover:underline">
                  {contactInfo.phone}
                </a>
              )}
              {contactInfo?.email && (
                <a href={`mailto:${contactInfo.email}`} className="hover:underline truncate max-w-[180px] sm:max-w-none">
                  {contactInfo.email}
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Main navbar — white bar, nav items spread evenly, bold text */}
        <header className="w-full bg-white border-b border-stone-100">
          <nav className="flex w-full items-center px-4 py-4 sm:px-8 md:px-16">
            <ul className="hidden lg:flex flex-1 items-center justify-between text-[11px] xl:text-xs font-bold uppercase tracking-[0.12em] text-stone-700 [font-family:var(--font-playfair),Georgia,serif]">
              {nav.map((item) => (
                <li key={item._key}>
                  <Link
                    href={item.path || (item.children?.[0]?.path) || '#'}
                    className="hover:text-stone-900 transition-colors whitespace-nowrap"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="flex flex-1 justify-end lg:hidden">
              <MobileMenu navigation={nav} contactInfo={contactInfo} />
            </div>
          </nav>
        </header>
      </div>

      {/* Spacer so hero content is not hidden under fixed header (top bar + navbar height) */}
      <div className="h-[7.25rem] shrink-0 md:h-[7.5rem]" aria-hidden="true" />

      {/* Wood-grain SVG filter for primary CTA (template pattern) */}
      <svg xmlns="http://www.w3.org/2000/svg" className="absolute h-0 w-0 overflow-hidden" aria-hidden="true">
        <defs>
          <filter id={woodFilterId} x="-30%" y="-30%" width="160%" height="160%">
            <feTurbulence baseFrequency=".002 .02" numOctaves={9} result="n" />
            <feDiffuseLighting surfaceScale={9} lightingColor="#BA8C63">
              <feDistantLight elevation={60} azimuth={-90} />
            </feDiffuseLighting>
            <feDisplacementMap in2="n" scale={50} />
          </filter>
        </defs>
      </svg>

      {/* Hero content — centered, dark brown headline + two subheadings + CTAs */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 sm:px-8 md:px-16 pb-24 md:pb-32 text-center">
        <div className="max-w-4xl">
          <h1 className="mb-3 text-4xl font-bold uppercase leading-tight tracking-tight text-[#3d2e24] drop-shadow-sm sm:text-5xl md:mb-4 md:text-6xl lg:text-7xl [font-family:var(--font-playfair),Georgia,serif]">
            {heading.split('\n').map((line, i, arr) => (
              <span key={i}>
                {line}
                {i < arr.length - 1 && <br />}
              </span>
            ))}
          </h1>
          {subheading && (
            <p className="text-sm font-semibold uppercase tracking-widest text-[#3d2e24] sm:text-base md:text-lg">
              {subheading}
            </p>
          )}
          {subheading2 && (
            <p className="mt-1 text-xs font-medium uppercase tracking-widest text-[#3d2e24]/90 sm:text-sm md:mt-2 md:text-base">
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
                    className="absolute -inset-[15%] rounded-sm bg-[#d97706] transition-colors group-hover:bg-[#b45309]"
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
                className="w-full min-w-[200px] rounded-sm border-2 border-[#5d3a1a]/60 bg-white/95 px-8 py-4 text-center text-xs font-semibold uppercase tracking-widest text-[#3d2e24] transition-all hover:border-[#5d3a1a] hover:bg-white hover:scale-[1.02] active:scale-[0.98] sm:w-auto"
              >
                {cta2Text}
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Bottom category bar — dark strip, white text, checkmarks */}
      <div className="relative z-10 w-full bg-[#2d2218]/90 py-5 shadow-lg backdrop-blur-sm md:py-6">
        <div className="px-4 sm:px-8 md:px-16">
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
            {heroCategories.map((category, index) => (
              <Link
                key={category.label || index}
                href={category.link || '#'}
                className="flex items-center gap-2 text-white transition-colors hover:text-amber-200"
              >
                <span className="text-xs font-medium uppercase tracking-widest sm:text-sm">
                  {category.label}
                </span>
                <CheckIcon className="h-4 w-4 text-amber-300" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
