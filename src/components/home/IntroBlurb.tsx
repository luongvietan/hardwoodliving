interface IntroBlurbProps {
  heading?: string;
  text?: string;
}

/**
 * Intro section displayed below the hero.
 * Magna-style centered heading + text with orange accent line.
 * All content from Sanity CMS — renders nothing if no data.
 */
export default function IntroBlurb({ heading, text }: IntroBlurbProps) {
  if (!heading && !text) return null;

  return (
    <section className="py-12 lg:py-16">
      <div className="mx-auto max-w-3xl px-4 text-center">
        {heading && (
          <>
            <h2 className="text-2xl font-bold text-charcoal-dark lg:text-3xl">
              {heading}
            </h2>
            <div className="mx-auto mt-4 h-1 w-16 bg-accent-orange" />
          </>
        )}
        {text && (
          <p className="mt-6 text-base leading-relaxed text-gray-600 lg:text-lg">
            {text}
          </p>
        )}
      </div>
    </section>
  );
}
