import Link from 'next/link';

interface LimitedTimeOfferProps {
  heading?: string;
  body?: string;
  ctaText?: string;
  ctaLink?: string;
  cta2Text?: string;
  cta2Link?: string;
}

/**
 * "Special Offer — Save on Selected Floors" section with dual CTAs.
 * Content from Sanity; layout per design.
 */
export default function LimitedTimeOffer({
  heading,
  body,
  ctaText,
  ctaLink,
  cta2Text,
  cta2Link,
}: LimitedTimeOfferProps) {
  if (!heading && !body) return null;

  return (
    <section className="bg-amber-50/80 py-16 lg:py-20">
      <div className="mx-auto max-w-4xl px-4 text-center">
        {heading && <h2 className="section-heading">{heading}</h2>}
        {body && <p className="mt-4 text-stone-700">{body}</p>}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          {ctaLink && ctaText && (
            <Link href={ctaLink} className="btn-primary">
              {ctaText}
            </Link>
          )}
          {cta2Link && cta2Text && (
            <Link href={cta2Link} className="btn-secondary">
              {cta2Text}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
