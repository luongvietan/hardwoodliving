interface GradeItem {
  name?: string;
  bullets?: string[];
}

interface FlooringGradesProps {
  heading?: string;
  subheading?: string;
  grades?: GradeItem[];
}

/**
 * "Flooring grades" — Prime/AB, Select/ABc, etc. with bullet lists.
 * Content from Sanity; layout per design.
 */
export default function FlooringGrades({
  heading,
  subheading,
  grades,
}: FlooringGradesProps) {
  if (!heading && (!grades || grades.length === 0)) return null;

  return (
    <section className="bg-stone-50 py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4">
        {heading && <h2 className="section-heading">{heading}</h2>}
        {subheading && (
          <p className="mx-auto mt-4 max-w-2xl text-center text-stone-600">
            {subheading}
          </p>
        )}
        {grades && grades.length > 0 && (
          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {grades.map((grade, i) => (
              <div key={i} className="hardfloor-card">
                {grade.name && (
                  <h3 className="text-lg font-bold text-stone-800">
                    {grade.name}
                  </h3>
                )}
                {grade.bullets && grade.bullets.length > 0 && (
                  <ul className="mt-3 space-y-1 text-sm text-stone-600">
                    {grade.bullets.map((b, j) => (
                      <li key={j}>{b}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
