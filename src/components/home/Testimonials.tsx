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

/**
 * Testimonials section — "What Our Customers Are Saying".
 * Cards with quote, author, role. Content from Sanity.
 */
export default function Testimonials({ heading, testimonials }: TestimonialsProps) {
  if (!testimonials || testimonials.length === 0) return null;

  return (
    <section className="bg-charcoal-dark py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="section-heading-light mb-10">
          {heading || 'What Our Customers Are Saying'}
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t) => (
            <div
              key={t._id}
              className="rounded-xl border border-stone-600/50 bg-charcoal p-6 shadow-lg"
            >
              {/* Quote Icon */}
              <svg
                className="mb-4 h-8 w-8 opacity-90"
                style={{ color: 'var(--color-accent-orange)' }}
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10H14.017zM0 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151C7.546 6.068 5.983 8.789 5.983 11H10v10H0z" />
              </svg>

              {t.content && (
                <p className="mb-4 text-sm leading-relaxed text-stone-300">
                  {t.content}
                </p>
              )}

              <div className="flex items-center gap-3">
                {t.image?.asset?._ref && (
                  <Image
                    src={urlFor(t.image).width(48).height(48).auto('format').url()}
                    alt={t.author || ''}
                    width={48}
                    height={48}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                )}
                <div>
                  {t.author && (
                    <span
                      className="text-sm font-semibold"
                      style={{ color: 'var(--color-accent-orange)' }}
                    >
                      {t.author}
                    </span>
                  )}
                  {t.role && (
                    <span className="block text-xs text-stone-400">{t.role}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
