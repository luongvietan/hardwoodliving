'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import gsap from 'gsap';
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

/** Phone icon for contact strip */
function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

/** Mail icon for contact strip */
function MailIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
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
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    gsap.from(el, {
      opacity: 0,
      y: 30,
      duration: 0.9,
      ease: 'power3.out',
    });
  }, []);

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
      <div
        ref={contentRef}
        className="relative z-10 flex min-h-[70vh] flex-col items-center justify-start px-4 pt-[min(26vh,7rem)] pb-24 text-center lg:min-h-[80vh] lg:pt-[min(28vh,9rem)]"
      >
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

        {/* Social proof: avatars + 5K | stars + rating (per design) */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-6">
          {/* Left group: overlapping avatars + 5K circle */}
          <div className="flex items-center">
            <div className="flex -space-x-3">
              {[
                'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=96&h=96&fit=crop&crop=face',
                'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&fit=crop&crop=face',
                'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=96&h=96&fit=crop&crop=face',
                'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=96&h=96&fit=crop&crop=face',
              ].map((src, i) => (
                <Image
                  key={i}
                  src={src}
                  alt=""
                  width={40}
                  height={40}
                  className="h-10 w-10 shrink-0 rounded-full border-2 border-white object-cover shadow-sm"
                  aria-hidden
                />
              ))}
              {/* 5K circle — overlaps last avatar, dark mocha */}
              <span
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-white text-white shadow-sm"
                style={{ backgroundColor: '#5c4033' }}
              >
                <span className="text-sm font-bold leading-none">
                  5<span className="text-[10px] align-top">K</span>
                </span>
              </span>
            </div>
          </div>
          {/* Right group: stars + rating text */}
          <div className="flex flex-col items-center gap-0.5">
            <div className="flex items-center gap-0.5" aria-hidden>
              {[1, 2, 3, 4, 5].map((i) => (
                <StarIcon key={i} className="h-5 w-5 shrink-0 text-amber-700" />
              ))}
            </div>
            <p className="text-sm font-medium text-stone-600">
              <span className="font-normal">Rated </span>
              <span className="font-semibold text-stone-700">5.0/5.0</span>
              <span className="font-normal"> by users</span>
            </p>
          </div>
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

      {/* Contact strip — outer border frame + inner band with icons */}
      {hasContactStrip && (
        <div className="absolute bottom-0 left-0 z-10 w-full max-w-md">
          {/* Viền ngoài: border + nền beige + padding */}
          <div
            className="border border-b-0 border-stone-200/80 bg-[#faf8f5] p-1.5 shadow-sm"
            style={{
              clipPath: 'polygon(0 0, calc(100% - 16px) 0, 100% 100%, 0 100%)',
            }}
          >
            <div
              className="overflow-hidden rounded-tr-md"
              style={{
                clipPath: 'polygon(0 0, calc(100% - 18px) 0, 100% 100%, 0 100%)',
              }}
            >
              <div className="flex divide-x divide-stone-200/80">
              {contactInfo?.phone && (
                <a
                  href={`tel:${contactInfo.phone.replace(/\s/g, '')}`}
                  className="group flex flex-1 items-center justify-center gap-3 bg-white/95 px-5 py-4 text-stone-700 transition-colors hover:bg-stone-50 hover:text-stone-900 sm:gap-4 sm:px-6 sm:py-4"
                  style={{
                    clipPath: 'polygon(0 0, calc(100% - 20px) 0, calc(100% - 6px) 100%, 0 100%)',
                  }}
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-stone-100 text-stone-600 transition-colors group-hover:bg-amber-100 group-hover:text-amber-800">
                    <PhoneIcon className="h-4 w-4" />
                  </span>
                  <span className="text-left font-medium text-stone-800 sm:text-base [font-family:var(--font-playfair),Georgia,serif]">
                    {contactInfo.phone}
                  </span>
                </a>
              )}
              {contactInfo?.email && (
                <a
                  href={`mailto:${contactInfo.email}`}
                  className="group flex flex-1 items-center justify-center gap-3 bg-white/95 px-5 py-4 text-stone-700 transition-colors hover:bg-stone-50 hover:text-stone-900 sm:gap-4 sm:px-6 sm:py-4"
                  style={{
                    clipPath: 'polygon(10px 0, calc(100% - 12px) 0, 100% 100%, 20px 100%)',
                  }}
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-stone-100 text-stone-600 transition-colors group-hover:bg-amber-100 group-hover:text-amber-800">
                    <MailIcon className="h-4 w-4" />
                  </span>
                  <span className="truncate text-left text-sm font-medium text-stone-800 sm:text-base [font-family:var(--font-playfair),Georgia,serif]">
                    {contactInfo.email}
                  </span>
                </a>
              )}
              </div>
            </div>
          </div>
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
