import Link from 'next/link';
import Image from 'next/image';
import Container from './Container';
import Navigation from './Navigation';
import MobileMenu from './MobileMenu';
import SearchBar from './SearchBar';
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

/**
 * Magna-style site header with:
 * 1. TopBar: social icons, phone, contact link, search, login
 * 2. MainNav: split navigation left/right of centered logo with dropdown support
 * All data from Sanity CMS — no hardcoded content.
 */
export default function Header({
  siteName,
  logo,
  navigation = [],
  contactInfo,
  socialLinks,
}: HeaderProps) {
  const nav = navigation ?? [];
  const social = socialLinks ?? [];
  const leftNav = nav.filter((item) => item.position === 'left');
  const rightNav = nav.filter((item) => item.position === 'right');
  const hasLogo = !!logo?.asset?._ref;

  return (
    <header className="sticky top-0 z-40">
      {/* Top Utility Bar — Logo + Social + Phone + Contact + Search + Login */}
      <div className="bg-charcoal-dark">
        <Container>
          <div className="flex h-14 min-h-[3.5rem] items-center justify-between gap-4 text-sm">
            {/* Left: Logo */}
            <Link
              href="/"
              className="shrink-0"
              aria-label={`${siteName || 'Home'} - Home`}
            >
              {hasLogo ? (
                <Image
                  src={urlFor(logo!).width(120).height(48).auto('format').url()}
                  alt={siteName || 'Logo'}
                  width={120}
                  height={48}
                  priority
                  className="h-8 w-auto sm:h-9"
                />
              ) : (
                <span className="text-lg font-bold tracking-tight text-white">
                  {siteName || ''}
                </span>
              )}
            </Link>

            {/* Center/Left: Social + Phone + Contact */}
            <div className="flex flex-1 items-center gap-4">
              {/* Social Icons */}
              {social.map((link) => (
                <a
                  key={link._key}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 transition-colors hover:text-white"
                  aria-label={link.platform}
                >
                  <SocialIcon platform={link.platform} />
                </a>
              ))}
              {/* Phone */}
              {contactInfo?.phone && (
                <a
                  href={`tel:${contactInfo.phone}`}
                  className="hidden text-gray-300 transition-colors hover:text-white sm:inline"
                >
                  {contactInfo.phone}
                </a>
              )}
              {/* Contact Us link */}
              <Link
                href="/contact"
                className="hidden text-xs font-semibold uppercase tracking-wider text-gray-300 transition-colors hover:text-white sm:inline"
              >
                Contact Us
              </Link>
            </div>

            {/* Right: Search + Login */}
            <div className="flex items-center gap-4">
              <SearchBar />
              <Link
                href="/trades/login"
                className="flex items-center gap-1 text-sm text-gray-300 transition-colors hover:text-white"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                </svg>
                <span className="hidden sm:inline">Login</span>
              </Link>
            </div>
          </div>
        </Container>
      </div>

      {/* Main Navigation Bar */}
      <div className="bg-charcoal">
        <Container>
          <div className="relative flex min-h-[56px] items-center justify-between md:min-h-[60px]">
            {/* Left Navigation (desktop) */}
            <Navigation links={leftNav} position="left" />

            <Navigation links={rightNav} position="right" />
            <MobileMenu
              navigation={nav}
              contactInfo={contactInfo}
            />
          </div>
        </Container>
      </div>
    </header>
  );
}

/** Render social media icon by platform name */
function SocialIcon({ platform }: { platform: string }) {
  switch (platform.toLowerCase()) {
    case 'facebook':
      return (
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
        </svg>
      );
    case 'instagram':
      return (
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" />
        </svg>
      );
    case 'pinterest':
      return (
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
        </svg>
      );
    default:
      return (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
        </svg>
      );
  }
}
