import Link from 'next/link';

interface ChoosingSectionProps {
  heading1?: string;
  heading2?: string;
  painPoints?: string[];
  resultText?: string;
  tagline?: string;
  solutionBullets?: string[];
  ctaText?: string;
  ctaLink?: string;
}

/**
 * "Choosing the Right Floor — Doesn't Have to Be Hard" section.
 * Content from Sanity; layout per design.
 */
export default function ChoosingSection({
  heading1,
  heading2,
  painPoints,
  resultText,
  tagline,
  solutionBullets,
  ctaText,
  ctaLink,
}: ChoosingSectionProps) {
  if (!heading1 && !heading2) return null;

  return (
    <section className="bg-white py-16 lg:py-20">
      <div className="mx-auto max-w-4xl px-4 text-center">
        {heading1 && (
          <h2 className="section-heading">
            {heading1}
          </h2>
        )}
        {heading2 && (
          <p className="mt-2 text-xl font-semibold text-stone-600 lg:text-2xl">
            {heading2}
          </p>
        )}
        <p className="mt-6 text-left text-base text-stone-600">
          Buying flooring is a big investment — but most homeowners feel stuck because:
        </p>
        {painPoints && painPoints.length > 0 && (
          <ul className="mt-4 list-inside list-disc space-y-1 text-left text-stone-600">
            {painPoints.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        )}
        {resultText && (
          <>
            <p className="mt-6 font-semibold text-stone-800">The result?</p>
            <p className="mt-2 text-left text-stone-600">{resultText}</p>
          </>
        )}
        {tagline && (
          <p className="mt-8 text-xl font-bold tracking-tight text-stone-800 lg:text-2xl">
            {tagline}
          </p>
        )}
        <p className="mt-4 text-left text-stone-600">
          That&apos;s why we created a simple, stress free way to find your perfect floor:
        </p>
        {solutionBullets && solutionBullets.length > 0 && (
          <ul className="mt-4 list-inside list-disc space-y-1 text-left text-stone-600">
            {solutionBullets.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        )}
        {ctaLink && ctaText && (
          <div className="mt-8">
            <Link href={ctaLink} className="btn-primary">
              {ctaText}
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
