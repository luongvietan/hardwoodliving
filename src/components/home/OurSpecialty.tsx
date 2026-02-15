import Link from 'next/link';

interface SpecialtyItem {
  number?: string;
  title?: string;
  description?: string;
}

interface OurSpecialtyProps {
  intro?: string;
  items?: SpecialtyItem[];
  ctaText?: string;
  ctaLink?: string;
}

/** Olive green for icon backgrounds — muted sage/olive from design */
const ICON_BG = '#6b7f5c';

const ICONS: Record<string, React.ReactNode> = {
  supply: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  ),
  installation: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7">
      <path d="M5 12c0-3.3 2.7-6 6-6s6 2.7 6 6-2.7 6-6 6-6-2.7-6-6z" />
      <path d="M19 12c0-3.3-2.7-6-6-6s-6 2.7-6 6 2.7 6 6 6 6-2.7 6-6z" />
    </svg>
  ),
  contracting: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  ),
  maintenance: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7">
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
    </svg>
  ),
};

function getIconForItem(title?: string, index: number = 0): React.ReactNode {
  const key = (title ?? '').toLowerCase();
  if (key.includes('supply')) return ICONS.supply;
  if (key.includes('install')) return ICONS.installation;
  if (key.includes('contract')) return ICONS.contracting;
  if (key.includes('maintain')) return ICONS.maintenance;
  const fallbacks = [ICONS.supply, ICONS.installation, ICONS.contracting, ICONS.maintenance];
  return fallbacks[index % 4] ?? ICONS.supply;
}

/**
 * "Our Specialty" — 4 steps (01 Supply, 02 Installation, etc.).
 * Content from Sanity; layout per design with icons in olive-green rounded squares.
 */
export default function OurSpecialty({
  intro,
  items,
  ctaText,
  ctaLink,
}: OurSpecialtyProps) {
  if (!intro && (!items || items.length === 0)) return null;

  return (
    <section className="bg-stone-100 py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="section-heading">Our Specialty</h2>
        {intro && (
          <p className="mx-auto mt-4 max-w-2xl text-center text-stone-600">
            {intro}
          </p>
        )}
        {items && items.length > 0 && (
          <div className="mt-12 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {items.map((item, i) => (
              <div key={i} className="flex flex-col text-left">
                {item.number && (
                  <span className="text-2xl font-semibold tracking-tight text-stone-400">
                    {item.number}
                  </span>
                )}
                {item.title && (
                  <h3 className="mt-2 text-lg font-bold text-stone-800" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
                    {item.title}
                  </h3>
                )}
                <div
                  className="mt-4 flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-white"
                  style={{ backgroundColor: ICON_BG }}
                  aria-hidden
                >
                  {getIconForItem(item.title, i)}
                </div>
                {item.description && (
                  <p className="mt-4 text-sm leading-relaxed text-stone-600">
                    {item.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
        {ctaLink && ctaText && (
          <div className="mt-14 text-center">
            <Link href={ctaLink} className="btn-primary">
              {ctaText.replace(/\bshwroom\b/i, 'showroom')}
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
