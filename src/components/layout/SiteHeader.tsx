'use client';

import Link from 'next/link';
import type { NavItem, ContactInfo } from '@/lib/sanity/siteSettings';
import MobileMenu from '@/components/layout/MobileMenu';

/** Stylized H icon for logo */
function LogoHIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="currentColor" aria-hidden="true">
      <path d="M10 6v20h4V17h4v9h4V6h-4v9h-4V6h-4z" />
    </svg>
  );
}

export interface SiteHeaderProps {
  siteName?: string;
  navigation?: NavItem[];
  contactInfo?: ContactInfo;
}

/**
 * Global site header: fixed top bar (black) + navbar (white).
 * Used on all pages. Data from Sanity (site settings).
 */
export default function SiteHeader({
  siteName = 'HardwoodLiving',
  navigation = [],
  contactInfo,
}: SiteHeaderProps) {
  const nav = navigation ?? [];
  const displayName = siteName ? `${siteName}®` : 'HARDWOODLIVING®';

  return (
    <>
      {/* Sticky header: top bar + navbar stay visible when scrolling, no extra gap below */}
      <div className="sticky top-0 z-50 w-full">
        {/* Top utility bar — black, logo left, FAQ + phone + email right */}
        <div className="w-full bg-black px-4 py-3 sm:px-6 md:px-16">
          <div className="flex items-center justify-between gap-4 text-sm text-white">
            <Link href="/" className="flex items-center gap-2 shrink-0" aria-label={`${siteName} - Home`}>
              <LogoHIcon className="h-6 w-6 sm:h-7 sm:w-7" />
              <span className="font-semibold uppercase tracking-tight">{displayName}</span>
            </Link>
            <div className="flex flex-wrap items-center justify-end gap-4 sm:gap-6">
              <Link href="/wood-guide" className="hover:underline">
                FAQ
              </Link>
              {contactInfo?.phone && (
                <a href={`tel:${contactInfo.phone.replace(/\D/g, '')}`} className="hover:underline">
                  {contactInfo.phone}
                </a>
              )}
              {contactInfo?.email && (
                <a href={`mailto:${contactInfo.email}`} className="hover:underline truncate max-w-[180px] sm:max-w-none">
                  {contactInfo.email}
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Main navbar — white bar, nav items spread evenly, bold text */}
        <header className="w-full bg-white border-b border-stone-100">
          <nav className="flex w-full items-center px-4 py-4 sm:px-8 md:px-16">
            <ul className="hidden lg:flex flex-1 items-center justify-between text-[11px] xl:text-xs font-bold uppercase tracking-[0.12em] text-stone-700 [font-family:var(--font-playfair),Georgia,serif]">
              {nav.map((item) => (
                <li key={item._key}>
                  <Link
                    href={item.path || (item.children?.[0]?.path) || '#'}
                    className="hover:text-stone-900 transition-colors whitespace-nowrap"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="flex flex-1 justify-end lg:hidden">
              <MobileMenu navigation={nav} contactInfo={contactInfo} />
            </div>
          </nav>
        </header>
      </div>
    </>
  );
}
