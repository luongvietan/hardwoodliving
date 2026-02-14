interface OurWorksProps {
  heading?: string;
  subline?: string;
}

/**
 * "Our works" — short section heading + optional subline.
 * Design: "Our works" / "We've helped thousands create their dream spaces."
 */
export default function OurWorks({ heading, subline }: OurWorksProps) {
  if (!heading && !subline) return null;

  return (
    <section className="bg-white py-12 lg:py-14">
      <div className="mx-auto max-w-4xl px-4 text-center">
        {heading && <h2 className="section-heading">{heading}</h2>}
        {subline && <p className="mt-2 text-stone-600">{subline}</p>}
      </div>
    </section>
  );
}
