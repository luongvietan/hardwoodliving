import Link from 'next/link';
import { COLLECTION_MATERIALS } from '@/lib/url-structure';

/** Core collections shown on homepage: Hardwood, Engineered, Luxury Vinyl, Laminate. */
const CORE_MATERIALS = COLLECTION_MATERIALS.filter((m) => m.indexable).slice(0, 4);

/**
 * Core Collections — 4 main flooring types with links to collections.
 * Homepage shows only these; full inventory is on /collections.
 */
export default function CoreCollections() {
  return (
    <section className="bg-stone-50 py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="section-heading">Core Collections</h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-stone-600">
          Explore our main flooring categories. Find the perfect floor for your space.
        </p>
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {CORE_MATERIALS.map((material) => (
            <Link
              key={material.slug}
              href={`/collections/${material.slug}`}
              className="hardfloor-card group transition-all hover:border-accent-orange hover:shadow-lg"
            >
              <h3 className="text-lg font-bold text-stone-800 group-hover:text-accent-orange">
                {material.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-stone-600">
                {material.description}
              </p>
              <span
                className="mt-3 inline-block text-sm font-semibold"
                style={{ color: 'var(--color-accent-orange)' }}
              >
                View collection →
              </span>
            </Link>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link href="/collections" className="btn-primary">
            View All Collections
          </Link>
        </div>
      </div>
    </section>
  );
}
