'use client';

import Image from 'next/image';
import type { SanityImageValue } from '@/lib/sanity/types';
import { urlFor } from '@/lib/sanity/image';

interface LoveUsItem {
  title?: string;
  description?: string;
  image?: SanityImageValue | null;
}

interface WhyLoveUsProps {
  heading?: string;
  items?: LoveUsItem[];
}

const SECTION_TITLE = 'Why Homeowners & Designers Love Us';

/** Ô placeholder khi không có ảnh */
function PlaceholderCell() {
  return (
    <div
      className="flex h-full min-h-[160px] w-full items-center justify-center bg-gradient-to-br from-stone-200 to-stone-300"
      aria-hidden
    >
      <svg
        viewBox="0 0 48 48"
        fill="none"
        className="h-12 w-12 text-stone-400/80"
        aria-hidden
      >
        <rect x="4" y="8" width="40" height="32" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <path d="M4 20h40M4 28h40M12 8v32M24 8v32M36 8v32" stroke="currentColor" strokeWidth="1.2" />
      </svg>
    </div>
  );
}

/**
 * "Why Homeowners & Designers Love Us" — 1 hình chữ nhật chia 8 ô (2 hàng × 4 cột).
 * Hàng 1: Chữ | Ảnh | Chữ | Ảnh. Hàng 2: Ảnh | Chữ | Ảnh | Chữ.
 */
export default function WhyLoveUs({ heading, items }: WhyLoveUsProps) {
  if (!items || items.length === 0) return null;

  const list = items.slice(0, 4);

  // Thứ tự 8 ô: text0, img0, text1, img1, img2, text2, img3, text3
  const cells: { type: 'text' | 'image'; itemIndex: number }[] = [];
  for (let i = 0; i < 4; i++) {
    if (i < 2) {
      cells.push({ type: 'text', itemIndex: i });
      cells.push({ type: 'image', itemIndex: i });
    } else {
      cells.push({ type: 'image', itemIndex: i });
      cells.push({ type: 'text', itemIndex: i });
    }
  }

  return (
    <section className="bg-stone-50 py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="section-heading">{SECTION_TITLE}</h2>
        {heading && (
          <p className="mx-auto mt-4 max-w-2xl text-center text-stone-600">
            {heading}
          </p>
        )}
        {/* 1 hình chữ nhật — 8 ô: 2 hàng × 4 cột */}
        <div className="mt-12 grid grid-cols-2 gap-0 overflow-hidden rounded-2xl border border-stone-200/80 bg-white shadow-sm lg:grid-cols-4">
          {cells.map((cell, idx) => {
            const item = list[cell.itemIndex];
            const imageUrl = item?.image
              ? urlFor(item.image).width(600).height(400).auto('format').url()
              : null;

            if (cell.type === 'text') {
              return (
                <div
                  key={idx}
                  className="flex flex-col justify-center bg-stone-50/90 p-5 sm:p-6 lg:p-8"
                >
                  {item?.title && (
                    <h3
                      className="text-base font-bold text-stone-800 sm:text-lg lg:text-xl"
                      style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
                    >
                      {item.title}
                    </h3>
                  )}
                  {item?.description && (
                    <p className="mt-2 text-sm leading-relaxed text-stone-600 lg:mt-3 lg:text-base">
                      {item.description}
                    </p>
                  )}
                </div>
              );
            }

            return (
              <div key={idx} className="relative aspect-[4/3] min-h-[180px] sm:aspect-square lg:min-h-[240px]">
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt={item?.title ?? ''}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
                  />
                ) : (
                  <PlaceholderCell />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
