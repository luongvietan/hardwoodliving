import Image from 'next/image';
import { urlFor } from '@/lib/sanity/image';
import type { SanityImageValue } from '@/lib/sanity/types';

interface Testimonial {
  _id: string;
  author?: string;
  content?: string;
  image?: SanityImageValue;
}

interface TestimonialsProps {
  testimonials?: Testimonial[];
}

/**
 * Testimonials section with Magna-style dark background.
 * Cards with author image, quote, and name.
 * All content from Sanity CMS — renders nothing if no data.
 */
export default function Testimonials({ testimonials }: TestimonialsProps) {
  if (!testimonials || testimonials.length === 0) return null;

  return (
    <section className="bg-charcoal-dark py-12 lg:py-16">
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="mb-8 text-center text-2xl font-bold uppercase tracking-wider text-white lg:text-3xl">
          What Our Customers Say
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t) => (
            <div
              key={t._id}
              className="rounded-lg border border-charcoal-light bg-charcoal p-6"
            >
              {/* Quote Icon */}
              <svg
                className="mb-4 h-8 w-8 text-accent-orange"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10H14.017zM0 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151C7.546 6.068 5.983 8.789 5.983 11H10v10H0z" />
              </svg>

              {t.content && (
                <p className="mb-4 text-sm leading-relaxed text-gray-300">
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
                {t.author && (
                  <span className="text-sm font-semibold text-accent-orange">
                    {t.author}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
