import Image from 'next/image';
import Link from 'next/link';
import { urlFor } from '@/lib/sanity/image';
import type { SanityImageValue } from '@/lib/sanity/types';

interface CtaSectionProps {
  heading?: string;
  text?: string;
  image?: SanityImageValue;
  linkText?: string;
  linkUrl?: string;
}

/**
 * Magna-style CTA section with split layout (image + text).
 * All content from Sanity CMS — renders nothing if no data.
 */
export default function CtaSection({
  heading,
  text,
  image,
  linkText,
  linkUrl,
}: CtaSectionProps) {
  if (!heading && !text) return null;

  return (
    <section className="bg-gray-100 py-12 lg:py-16">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2">
          {/* Image */}
          {image?.asset?._ref && (
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image
                src={urlFor(image).width(800).height(600).auto('format').url()}
                alt={heading || ''}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          )}

          {/* Text Content */}
          <div className="space-y-4">
            {heading && (
              <h2 className="text-2xl font-bold text-charcoal-dark lg:text-3xl">
                {heading}
              </h2>
            )}
            {text && (
              <p className="leading-relaxed text-gray-600">{text}</p>
            )}
            {linkUrl && linkText && (
              <Link
                href={linkUrl}
                className="inline-block bg-accent-orange px-8 py-3 text-sm font-semibold uppercase tracking-wider text-white transition-colors hover:bg-accent-orange-hover"
              >
                {linkText}
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
