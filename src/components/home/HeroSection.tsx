import Link from "next/link";
import Image from "next/image";
import Container from "@/components/layout/Container";

interface HeroSectionProps {
  heading?: string;
  subheading?: string;
  imageUrl?: string | null;
  ctaLink?: string;
  ctaText?: string;
}

/**
 * Hero section for the homepage with background image, heading, subheading, and CTA buttons.
 * Uses Next.js Image with priority for optimal LCP performance.
 * Falls back to gradient background and default text when CMS data is missing.
 */
export default function HeroSection({
  heading: rawHeading,
  subheading: rawSubheading,
  imageUrl,
  ctaLink: rawCtaLink,
  ctaText: rawCtaText,
}: HeroSectionProps) {
  const heading = rawHeading || "Premium Hardwood";
  const subheading =
    rawSubheading ||
    "Discover our curated collection of hardwood flooring and cabinetry, crafted for residential and commercial spaces across Canada.";
  const ctaLink = rawCtaLink || "/categories/flooring";
  const ctaText = rawCtaText || "Browse Flooring";

  return (
    <section className="relative flex min-h-[60vh] items-center justify-center overflow-hidden bg-gray-900">
      {imageUrl && (
        <Image
          src={imageUrl}
          alt=""
          role="presentation"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-40"
        />
      )}
      {!imageUrl && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-amber-950 to-gray-900" />
      )}
      <Container className="relative z-10 py-24">
        <div className="flex flex-col items-center justify-center gap-6 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            {heading.includes(" ") ? (
              <>
                {heading.split(" ").slice(0, -1).join(" ")}{" "}
                <span className="text-amber-400">
                  {heading.split(" ").slice(-1)}
                </span>
              </>
            ) : (
              <span className="text-amber-400">{heading}</span>
            )}
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-gray-300">
            {subheading}
          </p>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Link
              href={ctaLink}
              className="rounded-md bg-amber-700 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-amber-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500"
            >
              {ctaText}
            </Link>
            <Link
              href="/contact"
              className="rounded-md border border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold text-white shadow-sm backdrop-blur-sm transition-colors hover:bg-white/20"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
