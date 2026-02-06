import Link from 'next/link';
import Container from './Container';
import Navigation from './Navigation';
import MobileMenu from './MobileMenu';

/**
 * Site header with logo, desktop navigation, and mobile menu.
 * Sticky at the top of the viewport on all screen sizes.
 */
export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/95 backdrop-blur-sm">
      <Container>
        <div className="relative flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight text-amber-900">
              Hardwood<span className="text-gray-700">Living</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <Navigation />

          {/* Mobile Menu Toggle */}
          <MobileMenu />
        </div>
      </Container>
    </header>
  );
}
