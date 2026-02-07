import Link from 'next/link';

interface NavLink {
  label: string;
  href: string;
}

interface NavigationProps {
  links?: NavLink[];
}

/**
 * Desktop navigation component with horizontal link layout.
 * Hidden on mobile (< md breakpoint), shown on tablet and desktop.
 * Receives navigation data from Sanity CMS via Header.
 */
export default function Navigation({ links = [] }: NavigationProps) {
  return (
    <nav className="hidden md:flex md:items-center md:gap-1" aria-label="Main navigation">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-amber-50 hover:text-amber-900 focus-visible:bg-amber-50 focus-visible:text-amber-900"
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
