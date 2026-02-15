import Link from 'next/link';
import { COLLECTION_MATERIALS } from '@/lib/url-structure';

/** Core collections shown on homepage: Hardwood, Engineered, Vinyl, Laminate. */
const CORE_MATERIALS = COLLECTION_MATERIALS.filter((m) => m.indexable).slice(0, 4);

/** Display copy per design — title + description for "What We Offer" section. */
const DESIGN_COPY: Record<string, { title: string; description: string }> = {
  hardwood: {
    title: 'Hardwood',
    description:
      'Bring timeless elegance into your home with authentic natural wood floors built to last for generations.',
  },
  engineered: {
    title: 'Engineered',
    description:
      'Enjoy the beauty of real hardwood with added stability, making it ideal for modern homes and changing climates.',
  },
  'luxury-vinyl-plank': {
    title: 'Vinyl',
    description:
      'A stylish, waterproof flooring option that stands up to busy families, pets, and everyday life with ease.',
  },
  laminate: {
    title: 'Laminate',
    description:
      'Get the look of hardwood at a budget-friendly price, with durable performance made for high-traffic spaces.',
  },
};

/** Placeholder graphic: two overlapping rotated rectangles (swatch style). */
function PlaceholderGraphic() {
  return (
    <div className="relative h-16 w-20 shrink-0 sm:h-20 sm:w-24" aria-hidden>
      <div
        className="absolute left-0 top-0 h-12 w-14 rounded-sm bg-stone-300/80 sm:h-14 sm:w-16"
        style={{ transform: 'rotate(-6deg)' }}
      />
      <div
        className="absolute bottom-0 right-0 h-12 w-14 rounded-sm bg-stone-300/60 sm:h-14 sm:w-16"
        style={{ transform: 'rotate(8deg)' }}
      />
    </div>
  );
}

/**
 * Core Collections — "What We Offer" section.
 * Design: heading + subheading, then list of 4 flooring types (graphic | title | description) with dividers.
 */
export default function CoreCollections() {
  return (
    <section className="bg-stone-50 py-16 lg:py-20">
      <div className="mx-auto max-w-4xl px-4">
        <h2 className="section-heading">What We Offer</h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-stone-600">
          Complete flooring solutions — installation, maintenance, and custom designs for every home.
        </p>

        <div className="mt-12">
          {CORE_MATERIALS.map((material, index) => {
            const copy = DESIGN_COPY[material.slug] ?? {
              title: material.title,
              description: material.description,
            };
            return (
              <div key={material.slug}>
                {index > 0 && (
                  <hr className="border-stone-200/80" aria-hidden />
                )}
                <Link
                  href={`/collections/${material.slug}`}
                  className="group flex flex-col gap-4 py-6 sm:flex-row sm:items-center sm:gap-8"
                >
                  <PlaceholderGraphic />
                  <h3 className="min-w-0 shrink-0 text-lg font-bold text-stone-800 group-hover:text-accent-orange sm:w-28">
                    {copy.title}
                  </h3>
                  <p className="min-w-0 flex-1 text-sm leading-relaxed text-stone-600">
                    {copy.description}
                  </p>
                </Link>
              </div>
            );
          })}
        </div>

        <div className="mt-10 text-center">
          <Link href="/collections" className="btn-primary">
            View All Collections
          </Link>
        </div>
      </div>
    </section>
  );
}
