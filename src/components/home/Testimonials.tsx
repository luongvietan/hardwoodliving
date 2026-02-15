'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import { urlFor } from '@/lib/sanity/image';
import type { SanityImageValue } from '@/lib/sanity/types';

interface Testimonial {
  _id: string;
  author?: string;
  content?: string;
  image?: SanityImageValue;
  role?: string;
}

interface TestimonialsProps {
  heading?: string;
  testimonials?: Testimonial[];
}

const CARDS_PER_PAGE = 4;
const STAR_COLOR = 'var(--color-accent-orange)';

function StarRating({ count = 5 }: { count?: number }) {
  return (
    <div className="flex gap-0.5" aria-hidden>
      {Array.from({ length: count }).map((_, i) => (
        <svg
          key={i}
          className="h-5 w-5 shrink-0"
          viewBox="0 0 20 20"
          fill="currentColor"
          style={{ color: STAR_COLOR }}
          aria-hidden
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

/**
 * Testimonials — "What Our Customers Are Saying".
 * Light theme: cards with 5 stars, quote, author, role; carousel with pagination dots.
 */
export default function Testimonials({ heading, testimonials }: TestimonialsProps) {
  const [page, setPage] = useState(0);

  if (!testimonials || testimonials.length === 0) return null;

  const totalPages = Math.ceil(testimonials.length / CARDS_PER_PAGE);
  const start = page * CARDS_PER_PAGE;
  const visible = testimonials.slice(start, start + CARDS_PER_PAGE);

  const goToPage = useCallback(
    (index: number) => {
      setPage(Math.max(0, Math.min(index, totalPages - 1)));
    },
    [totalPages]
  );

  return (
    <section className="bg-stone-50 py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4">
        <h2
          className="section-heading"
          style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
        >
          {heading || 'What Our Customers Are Saying'}
        </h2>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {visible.map((t) => (
            <article
              key={t._id}
              className="flex flex-col rounded-2xl border border-stone-200/80 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <StarRating />
              {t.content && (
                <p className="mt-4 text-stone-700 leading-relaxed">
                  &ldquo;{t.content}&rdquo;
                </p>
              )}
              <div className="mt-5 flex items-center gap-3 border-t border-stone-100 pt-4">
                {t.image?.asset?._ref && (
                  <Image
                    src={urlFor(t.image).width(48).height(48).auto('format').url()}
                    alt={t.author || ''}
                    width={48}
                    height={48}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                )}
                <div>
                  {t.author && (
                    <p className="font-semibold text-stone-900">{t.author}</p>
                  )}
                  {t.role && (
                    <p className="text-sm text-stone-500">{t.role}</p>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="mt-8 flex justify-center gap-2" aria-label="Testimonial pages">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goToPage(i)}
                className="h-2 rounded-full transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-400 focus-visible:ring-offset-2"
                style={{
                  width: i === page ? 24 : 8,
                  backgroundColor: i === page ? 'var(--color-charcoal-dark)' : 'var(--color-charcoal-light)',
                  opacity: i === page ? 1 : 0.5,
                }}
                aria-label={`Page ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
