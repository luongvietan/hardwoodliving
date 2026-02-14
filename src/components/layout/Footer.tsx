import Link from 'next/link';
import Image from 'next/image';
import Container from './Container';
import { urlFor } from '@/lib/sanity/image';
import type { SanityImageValue } from '@/lib/sanity/types';
import type { NavItem, ContactInfo, SocialLink } from '@/lib/sanity/siteSettings';

interface FooterProps {
  siteName?: string;
  logo?: SanityImageValue;
  navigation?: NavItem[];
  contactInfo?: ContactInfo;
  footerTagline?: string;
  businessHours?: string;
  footerPhone?: string;
  readyToFindHeading?: string;
  readyToFindPrimaryText?: string;
  readyToFindSecondaryText?: string;
  copyrightText?: string;
  socialLinks?: SocialLink[];
}

/**
 * Magna-style footer with dark charcoal background.
 * 4-column layout: Logo | Product links | Quick links | Contact info
 * All data from Sanity CMS — no hardcoded content.
 */
export default function Footer({
  siteName,
  logo,
  navigation,
  contactInfo,
  footerTagline,
  businessHours,
  footerPhone,
  readyToFindHeading,
  readyToFindPrimaryText,
  readyToFindSecondaryText,
  copyrightText,
  socialLinks,
}: FooterProps) {
  const currentYear = new Date().getFullYear();
  const hasLogo = !!logo?.asset?._ref;
  const nav = navigation ?? [];
  const social = socialLinks ?? [];
  const displayPhone = footerPhone || contactInfo?.phone;

  const productNav = nav.find(
    (item) => item.children && item.children.length > 0
  );
  const quickLinks = nav.filter(
    (item) => item.path && (!item.children || item.children.length === 0)
  );

  return (
    <footer className="bg-charcoal-dark text-gray-300">
      {/* Ready to Find Your Perfect Floor? — Book Your Visit | Request Info (raw design) */}
      {(readyToFindHeading || readyToFindPrimaryText || readyToFindSecondaryText) && (
        <div className="border-b border-charcoal-light">
          <Container className="py-8">
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-6">
              {readyToFindHeading && (
                <p className="text-lg font-semibold text-white">
                  {readyToFindHeading}
                </p>
              )}
              <div className="flex flex-wrap justify-center gap-3">
                {readyToFindPrimaryText && (
                  <Link
                    href="/contact"
                    className="btn-primary rounded-lg px-6 py-2.5"
                  >
                    {readyToFindPrimaryText}
                  </Link>
                )}
                {readyToFindSecondaryText && (
                  <Link
                    href="/contact"
                    className="rounded-lg border border-white/50 px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-white/10"
                  >
                    {readyToFindSecondaryText}
                  </Link>
                )}
              </div>
            </div>
          </Container>
        </div>
      )}
      <Container className="py-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Logo + Tagline Column (design: Hardfloor Showroom + tagline) */}
          <div>
            <Link href="/" className="inline-block">
              {hasLogo ? (
                <Image
                  src={urlFor(logo!).width(160).height(120).auto('format').url()}
                  alt={siteName || 'Logo'}
                  width={160}
                  height={120}
                  className="h-auto max-h-[100px] w-auto brightness-0 invert"
                />
              ) : (
                siteName && (
                  <span className="text-xl font-bold tracking-tight text-white">
                    {siteName}
                  </span>
                )
              )}
            </Link>
            {footerTagline && (
              <p className="mt-3 max-w-xs text-sm text-gray-400">
                {footerTagline}
              </p>
            )}
          </div>

          {/* Quick Links (design: Book a Visit, Our Collections, About Us, Contact) */}
          {quickLinks.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
                Quick Links
              </h3>
              <ul className="mt-4 space-y-2">
                {quickLinks.map((link) => (
                  <li key={link._key}>
                    <Link
                      href={link.path!}
                      className="text-sm text-accent-orange transition-colors hover:text-accent-orange-light"
                    >
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Our Products / Collections */}
          {productNav && productNav.children && (
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
                {productNav.title}
              </h3>
              <ul className="mt-4 space-y-2">
                {productNav.children.map((child) => (
                  <li key={child._key}>
                    <Link
                      href={child.path}
                      className="text-sm text-accent-orange transition-colors hover:text-accent-orange-light"
                    >
                      {child.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Contact + Address + Hours */}
          {contactInfo && (
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
                Contact
              </h3>
              <div className="mt-4 space-y-3 text-sm">
                {contactInfo?.address && (
                  <p className="whitespace-pre-line text-gray-400">
                    {contactInfo.address}
                  </p>
                )}
                {displayPhone && (
                  <p>
                    <a
                      href={`tel:${displayPhone.replace(/\s/g, '')}`}
                      className="text-accent-orange hover:text-accent-orange-light"
                    >
                      {displayPhone}
                    </a>
                  </p>
                )}
                {contactInfo.tollFree && (
                  <p>
                    <span className="font-semibold text-white">Toll Free: </span>
                    <a
                      href={`tel:${contactInfo.tollFree}`}
                      className="text-accent-orange hover:text-accent-orange-light"
                    >
                      {contactInfo.tollFree}
                    </a>
                  </p>
                )}
                {contactInfo.email && (
                  <p>
                    <a
                      href={`mailto:${contactInfo.email}`}
                      className="text-accent-orange hover:text-accent-orange-light"
                    >
                      {contactInfo.email}
                    </a>
                  </p>
                )}
                {businessHours && (
                  <p className="whitespace-pre-line text-gray-400">
                    {businessHours}
                  </p>
                )}
                {social.length > 0 && (
                  <div className="flex gap-3 pt-2">
                    {social.map((link) => (
                      <a
                        key={link._key}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 transition-colors hover:text-white"
                        aria-label={link.platform}
                      >
                        <FooterSocialIcon platform={link.platform} />
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </Container>

      <div className="border-t border-charcoal-light">
        <Container className="py-4">
          <p className="text-center text-xs text-gray-500">
            {copyrightText || `© ${currentYear} ${siteName}`}
          </p>
        </Container>
      </div>
    </footer>
  );
}

function FooterSocialIcon({ platform }: { platform: string }) {
  switch (platform.toLowerCase()) {
    case 'facebook':
      return (
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
        </svg>
      );
    case 'instagram':
      return (
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" />
        </svg>
      );
    default:
      return (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
        </svg>
      );
  }
}
