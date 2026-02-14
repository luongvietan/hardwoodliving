interface CutItem {
  name?: string;
  description?: string;
}

interface LumberCutsProps {
  heading?: string;
  intro?: string;
  cuts?: CutItem[];
}

/**
 * "Lumber cuts" — Plainsawn, Riftsawn, Quartersawn, Livesawn.
 * Content from Sanity; layout per design.
 */
export default function LumberCuts({
  heading,
  intro,
  cuts,
}: LumberCutsProps) {
  if (!heading && (!cuts || cuts.length === 0)) return null;

  return (
    <section className="bg-white py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4">
        {heading && <h2 className="section-heading">{heading}</h2>}
        {intro && (
          <p className="mx-auto mt-4 max-w-3xl text-center text-stone-600">
            {intro}
          </p>
        )}
        {cuts && cuts.length > 0 && (
          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {cuts.map((cut, i) => (
              <div key={i} className="hardfloor-card">
                {cut.name && (
                  <h3 className="text-lg font-bold text-stone-800">
                    {cut.name}
                  </h3>
                )}
                {cut.description && (
                  <p className="mt-2 text-sm leading-relaxed text-stone-600">
                    {cut.description}
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
