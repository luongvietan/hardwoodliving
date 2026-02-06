import Link from 'next/link';
import { navigationLinks } from '@/lib/navigation';

/**
 * Desktop navigation component with horizontal link layout.
 * Hidden on mobile (< md breakpoint), shown on tablet and desktop.
 */
export default function Navigation() {
  return (
    <nav className="hidden md:flex md:items-center md:gap-1" aria-label="Main navigation">
      {navigationLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-amber-50 hover:text-amber-900"
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
