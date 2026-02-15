import Image from 'next/image';
import Link from 'next/link';
import type { SanityImageValue } from '@/lib/sanity/types';
import { urlFor } from '@/lib/sanity/image';

interface ProjectsPreviewProps {
  heading?: string;
  images?: SanityImageValue[];
}

/**
 * Projects Preview — 3 featured images linking to gallery.
 * Conversion teaser: "See our work before you visit."
 */
export default function ProjectsPreview({ heading, images }: ProjectsPreviewProps) {
  const validImages = images?.filter((img) => img?.asset?._ref) ?? [];
  if (validImages.length === 0) return null;

  return (
    <section className="bg-white py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4">
        {heading && (
          <h2 className="section-heading mb-4">{heading}</h2>
        )}
        <p className="mx-auto mb-12 max-w-2xl text-center text-stone-600">
          See our work before you visit. Real projects, real results.
        </p>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {validImages.slice(0, 3).map((img, i) => (
            <Link
              key={img._key ?? i}
              href="/gallery"
              className="group relative aspect-[4/3] overflow-hidden rounded-xl shadow-md transition-transform hover:scale-[1.02]"
            >
              <Image
                src={urlFor(img).width(640).height(480).auto('format').url()}
                alt={`Project ${i + 1}`}
                fill
                sizes="(max-width: 640px) 100vw, 33vw"
                className="object-cover"
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-charcoal/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100"
                aria-hidden
              />
            </Link>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link href="/gallery" className="btn-secondary">
            View Full Gallery
          </Link>
        </div>
      </div>
    </section>
  );
}
