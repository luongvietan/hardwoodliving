import Link from 'next/link';
import Container from './Container';
import Navigation from './Navigation';
import MobileMenu from './MobileMenu';

interface NavLink {
  label: string;
  href: string;
}

interface HeaderProps {
  siteName?: string;
  navigation?: NavLink[];
}

/**
 * Site header with logo, desktop navigation, and mobile menu.
 * Sticky at the top of the viewport on all screen sizes.
 * Receives navigation data from Sanity CMS via layout.
 */
export default function Header({ siteName = 'Hardwood Living', navigation = [] }: HeaderProps) {
  // Split name for styling (first word = amber, rest = gray)
  const nameParts = siteName.split(/(?=[A-Z])|\s+/);
  const firstName = nameParts[0] || 'Hardwood';
  const restName = nameParts.slice(1).join('') || 'Living';

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/95 backdrop-blur-sm">
      <Container>
        <div className="relative flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight text-amber-900">
              {firstName}<span className="text-gray-700">{restName}</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <Navigation links={navigation} />

          {/* Mobile Menu Toggle */}
          <MobileMenu links={navigation} />
        </div>
      </Container>
    </header>
  );
}
