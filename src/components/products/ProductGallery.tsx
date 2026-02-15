"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import type { SanityImageValue } from "@/lib/sanity/types";
import { urlFor } from "@/lib/sanity/image";

const LENS_SIZE = 180;
const ZOOM_LEVEL = 2.5;

interface ProductGalleryProps {
  images?: SanityImageValue[];
  productTitle: string;
}

/**
 * Interactive product image gallery with thumbnail navigation and hover-to-zoom.
 * Client Component using useState to track selected image index.
 * Images are optimized via next/image and @sanity/image-url.
 * Below-the-fold images are lazy-loaded automatically by next/image.
 */
export default function ProductGallery({
  images,
  productTitle,
}: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [containerRect, setContainerRect] = useState({ width: 400, height: 400 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setContainerRect({ width: rect.width, height: rect.height });
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }, []);

  const validImages = images?.filter((img) => img.asset?._ref) ?? [];

  if (validImages.length === 0) {
    return (
      <div className="relative aspect-square overflow-hidden rounded-xl border border-stone-200/80 bg-stone-100/60 shadow-inner">
        <div className="flex h-full items-center justify-center text-stone-400">
          <svg
            className="h-20 w-20"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1}
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5a2.25 2.25 0 002.25-2.25V5.25a2.25 2.25 0 00-2.25-2.25H3.75a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 003.75 21z"
            />
          </svg>
        </div>
      </div>
    );
  }

  const activeImage = validImages[selectedIndex] ?? validImages[0];
  const activeAlt = activeImage.alt || productTitle;
  const zoomImageUrl = urlFor(activeImage).width(1200).height(1200).auto("format").url();
  const clampedX = Math.max(LENS_SIZE / 2, Math.min(containerRect.width - LENS_SIZE / 2, mousePos.x));
  const clampedY = Math.max(LENS_SIZE / 2, Math.min(containerRect.height - LENS_SIZE / 2, mousePos.y));

  const hasMultipleImages = validImages.length > 1;

  return (
    <div
      role="region"
      aria-label={`${productTitle} image gallery`}
      className={hasMultipleImages ? "flex flex-row gap-4 sm:gap-5" : ""}
    >
      {/* Thumbnails on the left (only when multiple images) */}
      {hasMultipleImages && (
        <div className="flex shrink-0 flex-col gap-2.5 sm:gap-3">
          {validImages.map((img, index) => (
            <button
              key={img._key || index}
              type="button"
              onClick={() => setSelectedIndex(index)}
              className={`relative aspect-square w-16 overflow-hidden rounded-xl border-2 bg-white shadow-sm transition-all duration-200 sm:w-20 ${
                index === selectedIndex
                  ? "border-accent-orange ring-2 ring-accent-orange ring-offset-2 ring-offset-stone-50 shadow-md"
                  : "border-stone-200/90 hover:border-amber-200 hover:shadow-md hover:ring-2 hover:ring-amber-100"
              }`}
              aria-label={`View image ${index + 1} of ${validImages.length}`}
              aria-pressed={index === selectedIndex}
              aria-current={index === selectedIndex}
            >
              <Image
                src={urlFor(img).width(200).height(200).auto("format").url()}
                alt={img.alt || `${productTitle} - Detail ${index + 1}`}
                fill
                sizes="80px"
                loading="lazy"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Main Image with hover zoom */}
      <div
        ref={containerRef}
        className={`relative overflow-hidden rounded-xl border border-stone-200/80 bg-white shadow-md cursor-zoom-in transition-shadow duration-200 hover:shadow-lg ${hasMultipleImages ? "min-w-0 flex-1 aspect-square" : "aspect-square"}`}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        onMouseMove={handleMouseMove}
      >
        <Image
          src={urlFor(activeImage).width(800).height(800).auto("format").url()}
          alt={activeAlt}
          fill
          priority
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover"
        />
        {/* Hover magnifier lens */}
        {isHovering && (
          <div
            className="pointer-events-none absolute z-10 rounded-full border-2 border-white/90 shadow-[0_4px_20px_rgba(0,0,0,0.15),0_0_0_1px_rgba(0,0,0,0.06)]"
            style={{
              width: LENS_SIZE,
              height: LENS_SIZE,
              left: clampedX,
              top: clampedY,
              transform: "translate(-50%, -50%)",
              backgroundImage: `url(${zoomImageUrl})`,
              backgroundSize: `${containerRect.width * ZOOM_LEVEL}px ${containerRect.height * ZOOM_LEVEL}px`,
              backgroundPosition: `${LENS_SIZE / 2 - clampedX * ZOOM_LEVEL}px ${LENS_SIZE / 2 - clampedY * ZOOM_LEVEL}px`,
            }}
            aria-hidden
          />
        )}
      </div>
    </div>
  );
}
