import Image from 'next/image';
import Link from 'next/link';
import { urlFor } from '@/lib/sanity/image';
import type { SanityImageValue } from '@/lib/sanity/types';

interface CategoryHighlight {
  _id: string;
  title?: string;
  slug?: { current?: string };
  description?: string;
  image?: SanityImageValue;
}

interface CategoryHighlightsProps {
  categories?: CategoryHighlight[];
}

/**
 * Magna-style category highlights grid.
 * Each card shows a category image with a dark overlay and centered white text.
 * Links to the category page. All data from Sanity CMS.
 */
export default function CategoryHighlights({ categories }: CategoryHighlightsProps) {
  if (!categories || categories.length === 0) return null;

  return (
    <section className="py-12 lg:py-16">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((cat) => (
            <Link
              key={cat._id}
              href={`/categories/${cat.slug?.current || ''}`}
              className="group relative flex min-h-[200px] items-center justify-center overflow-hidden sm:min-h-[250px]"
            >
              {/* Background Image */}
              {cat.image?.asset?._ref ? (
                <Image
                  src={urlFor(cat.image).width(600).height(400).auto('format').url()}
                  alt={cat.title || ''}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-charcoal to-charcoal-light" />
              )}

              {/* Dark Overlay */}
              <div className="absolute inset-0 bg-black/40 transition-colors group-hover:bg-black/30" />

              {/* Category Title */}
              {cat.title && (
                <span className="relative z-10 border border-white/40 px-6 py-3 text-center text-sm font-bold uppercase tracking-wider text-white transition-colors group-hover:border-accent-orange group-hover:text-accent-orange sm:text-base">
                  {cat.title}
                </span>
              )}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
