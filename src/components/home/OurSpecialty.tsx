import Link from 'next/link';

interface SpecialtyItem {
  number?: string;
  title?: string;
  description?: string;
}

interface OurSpecialtyProps {
  intro?: string;
  items?: SpecialtyItem[];
  ctaText?: string;
  ctaLink?: string;
}

/**
 * "Our Specialty" — 4 steps (01 Supply, 02 Installation, etc.).
 * Content from Sanity; layout per design.
 */
export default function OurSpecialty({
  intro,
  items,
  ctaText,
  ctaLink,
}: OurSpecialtyProps) {
  if (!intro && (!items || items.length === 0)) return null;

  return (
    <section className="bg-white py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="section-heading">Our Specialty</h2>
        {intro && (
          <p className="mx-auto mt-4 max-w-2xl text-center text-stone-600">
            {intro}
          </p>
        )}
        {items && items.length > 0 && (
          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {items.map((item, i) => (
              <div key={i} className="hardfloor-card text-center">
                {item.number && (
                  <span
                    className="text-3xl font-bold"
                    style={{ color: 'var(--color-accent-orange)' }}
                  >
                    {item.number}
                  </span>
                )}
                {item.title && (
                  <h3 className="mt-2 text-lg font-bold text-stone-800">
                    {item.title}
                  </h3>
                )}
                {item.description && (
                  <p className="mt-2 text-sm leading-relaxed text-stone-600">
                    {item.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
        {ctaLink && ctaText && (
          <div className="mt-12 text-center">
            <Link href={ctaLink} className="btn-primary">
              {ctaText}
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
