"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import type { SanityImageValue } from "@/lib/sanity/types";
import { urlFor } from "@/lib/sanity/image";

const LENS_SIZE = 160;
const ZOOM_LEVEL = 2.2;

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
      <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
        <div className="flex h-full items-center justify-center text-gray-400">
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

  return (
    <div role="region" aria-label={`${productTitle} image gallery`}>
      {/* Main Image with hover zoom */}
      <div
        ref={containerRef}
        className="relative aspect-square overflow-hidden rounded-lg bg-gray-100 cursor-zoom-in"
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
            className="pointer-events-none absolute z-10 rounded-full border-2 border-white/90 shadow-xl bg-white/5"
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

      {/* Thumbnails (only show if more than 1 image) */}
      {validImages.length > 1 && (
        <div className="mt-4 grid grid-cols-4 gap-2 sm:grid-cols-5 md:grid-cols-6">
          {validImages.map((img, index) => (
            <button
              key={img._key || index}
              type="button"
              onClick={() => setSelectedIndex(index)}
              className={`relative aspect-square overflow-hidden rounded-md bg-gray-100 transition-all ${
                index === selectedIndex
                  ? "ring-2 ring-amber-600 ring-offset-1"
                  : "ring-1 ring-gray-200 hover:ring-gray-400"
              }`}
              aria-label={`View image ${index + 1} of ${validImages.length}`}
              aria-pressed={index === selectedIndex}
              aria-current={index === selectedIndex}
            >
              <Image
                src={urlFor(img).width(200).height(200).auto("format").url()}
                alt={img.alt || `${productTitle} - Detail ${index + 1}`}
                fill
                sizes="(min-width: 1024px) 120px, 80px"
                loading="lazy"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
