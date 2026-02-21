'use client';

import { usePathname } from 'next/navigation';
import Header from './Header';
import type { SanityImageValue } from '@/lib/sanity/types';
import type { NavItem, ContactInfo, SocialLink } from '@/lib/sanity/siteSettings';

interface ConditionalHeaderProps {
  siteName?: string;
  logo?: SanityImageValue;
  navigation?: NavItem[];
  contactInfo?: ContactInfo;
  socialLinks?: SocialLink[];
}

/**
 * Conditionally renders Header component.
 * Hidden on homepage (/) since Header is integrated into HeroSection.
 * Visible on all other pages.
 */
export default function ConditionalHeader(props: ConditionalHeaderProps) {
  const pathname = usePathname();
  const isHomepage = pathname === '/';

  // Don't render Header on homepage - it's integrated into HeroSection
  if (isHomepage) {
    return null;
  }

  return <Header {...props} />;
}
