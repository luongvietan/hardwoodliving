import Link from 'next/link';
import Image from 'next/image';
import Navigation from './Navigation';
import MobileMenu from './MobileMenu';
import { urlFor } from '@/lib/sanity/image';
import type { SanityImageValue } from '@/lib/sanity/types';
import type { NavItem, ContactInfo, SocialLink } from '@/lib/sanity/siteSettings';

interface HeaderProps {
  siteName?: string;
  logo?: SanityImageValue;
  navigation?: NavItem[];
  contactInfo?: ContactInfo;
  socialLinks?: SocialLink[];
}

/** Eco icon (leaf) for logo */
function EcoIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
    </svg>
  );
}

/**
 * Sticky header for non-homepage pages.
 * White background with logo + eco icon on left,
 * navigation links on right, and mobile menu.
 * All data from Sanity CMS — no hardcoded content.
 * 
 * Note: Header is hidden on homepage (/) where HeroSection
 * includes its own integrated navbar.
 */
export default function Header({
  siteName = "HardwoodLiving",
  logo,
  navigation = [],
  contactInfo,
  socialLinks,
}: HeaderProps) {
  const nav = navigation ?? [];
  const hasLogo = !!logo?.asset?._ref;

  return (
    <header className="sticky top-0 z-40 w-full bg-white shadow-sm">
      <nav className="flex items-center justify-between gap-4 md:gap-12 px-6 sm:px-8 md:px-16 py-4 md:py-6">
        {/* Logo + Eco Icon */}
        <Link
          href="/"
          className="flex items-center gap-2 shrink-0"
          aria-label={`${siteName} - Home`}
        >
          {hasLogo ? (
            <Image
              src={urlFor(logo!).width(200).height(48).auto('format').url()}
              alt={siteName}
              width={200}
              height={48}
              priority
              className="h-6 md:h-8 w-auto transition-opacity hover:opacity-90"
            />
          ) : (
            <span className="text-gray-900 text-xl sm:text-2xl font-bold tracking-tighter uppercase transition-opacity hover:opacity-90">
              {siteName}
            </span>
          )}
          <EcoIcon className="text-gray-900 text-xl sm:text-2xl transition-transform hover:scale-110" />
        </Link>

        {/* Desktop Navigation — hidden on mobile, shown on lg+ */}
        <ul className="hidden lg:flex items-center gap-4 xl:gap-6 text-[10px] xl:text-[11px] font-semibold text-gray-700 uppercase tracking-widest">
          {nav.map((item) => {
            // Check if this is "Instant Discount" for special styling
            const isInstantDiscount = item.title?.toLowerCase().includes('instant') || 
                                     item.title?.toLowerCase().includes('discount');
            
            if (item.children && item.children.length > 0) {
              // For dropdown items, render parent link
              return (
                <li key={item._key}>
                  <Link
                    href={item.path || '#'}
                    className={`hover:text-gray-900 transition-colors duration-200 ${
                      isInstantDiscount ? 'text-amber-600' : ''
                    }`}
                  >
                    {item.title}
                  </Link>
                </li>
              );
            }
            
            return (
              item.path && (
                <li key={item._key}>
                  <Link
                    href={item.path}
                    className={`hover:text-gray-900 transition-colors duration-200 ${
                      isInstantDiscount ? 'text-amber-600' : ''
                    }`}
                  >
                    {item.title}
                  </Link>
                </li>
              )
            );
          })}
        </ul>

        {/* Mobile Menu */}
        <MobileMenu
          navigation={nav}
          contactInfo={contactInfo}
        />
      </nav>
    </header>
  );
}
