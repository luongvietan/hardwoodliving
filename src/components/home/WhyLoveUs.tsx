interface LoveUsItem {
  title?: string;
  description?: string;
}

interface WhyLoveUsProps {
  heading?: string;
  items?: LoveUsItem[];
}

/**
 * "Why Homeowners & Designers Love Us" — 4 value prop cards.
 * Content from Sanity; layout per design.
 */
export default function WhyLoveUs({ heading, items }: WhyLoveUsProps) {
  if (!heading && (!items || items.length === 0)) return null;

  return (
    <section className="bg-stone-50 py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="section-heading">Why Homeowners & Designers Love Us</h2>
        {heading && (
          <p className="mx-auto mt-4 max-w-2xl text-center text-stone-600">
            {heading}
          </p>
        )}
        {items && items.length > 0 && (
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {items.map((item, i) => (
              <div key={i} className="hardfloor-card text-center">
                {item.title && (
                  <h3 className="text-lg font-bold text-stone-800">
                    {item.title}
                  </h3>
                )}
                {item.description && (
                  <p className="mt-2 text-sm leading-relaxed text-stone-600">
                    {item.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
