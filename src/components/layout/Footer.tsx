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
  readyToFindSubheading?: string;
  readyToFindPrimaryText?: string;
  readyToFindSecondaryText?: string;
  copyrightText?: string;
  socialLinks?: SocialLink[];
}

const DEFAULT_CTA_SUBHEADING = 'Limited showroom slots this week — book now!';

/** Subtle oak-leaf pattern for CTA background */
function LeafPattern() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-[0.06]" aria-hidden>
      <svg className="h-full w-full" viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice">
        <defs>
          <path
            id="leaf"
            d="M20 80 Q60 20 100 60 Q80 100 60 140 Q30 120 20 80"
            fill="currentColor"
          />
        </defs>
        <g fill="#1c1917">
          {[0, 1, 2, 3, 4].map((i) => (
            <use
              key={i}
              href="#leaf"
              x={i * 90}
              y={(i % 2) * 100}
              width="80"
              height="80"
              transform={`rotate(${i * 25} ${i * 90 + 40} ${(i % 2) * 100 + 40})`}
            />
          ))}
          {[0, 1, 2].map((i) => (
            <use
              key={`b-${i}`}
              href="#leaf"
              x={i * 120 + 50}
              y={200 + (i % 2) * 80}
              width="70"
              height="70"
              transform={`rotate(${-15 - i * 20} ${i * 120 + 85} ${200 + (i % 2) * 80 + 35})`}
            />
          ))}
        </g>
      </svg>
    </div>
  );
}

export default function Footer({
  siteName,
  logo,
  navigation,
  contactInfo,
  footerTagline,
  businessHours,
  footerPhone,
  readyToFindHeading,
  readyToFindSubheading,
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

  const showCta =
    readyToFindHeading || readyToFindPrimaryText || readyToFindSecondaryText;

  return (
    <footer className="text-stone-800">
      {/* CTA — light beige, leaf motif, heading + subheading + 2 buttons */}
      {showCta && (
        <div className="relative bg-stone-100 py-14 lg:py-16">
          <LeafPattern />
          <Container className="relative">
            <div className="mx-auto max-w-2xl text-center">
              {readyToFindHeading && (
                <h2
                  className="text-2xl font-bold text-stone-800 sm:text-3xl lg:text-4xl"
                  style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
                >
                  {readyToFindHeading}
                </h2>
              )}
              <p className="mt-3 text-stone-600">
                {readyToFindSubheading || DEFAULT_CTA_SUBHEADING}
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                {readyToFindPrimaryText && (
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center rounded-xl px-7 py-3.5 text-sm font-bold text-stone-900 transition-opacity hover:opacity-90 focus-visible:outline focus-visible:ring-2 focus-visible:ring-stone-400 focus-visible:ring-offset-2"
                    style={{ backgroundColor: 'var(--color-hardfloor-green)' }}
                  >
                    {readyToFindPrimaryText}
                  </Link>
                )}
                {readyToFindSecondaryText && (
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center rounded-xl border-2 border-stone-700 bg-stone-50 px-7 py-3.5 text-sm font-bold text-stone-800 transition-colors hover:bg-stone-100 focus-visible:outline focus-visible:ring-2 focus-visible:ring-stone-400 focus-visible:ring-offset-2"
                  >
                    {readyToFindSecondaryText}
                  </Link>
                )}
              </div>
            </div>
          </Container>
        </div>
      )}

      {/* Footer — dark brown, 3–4 columns, same items */}
      <div
        className="bg-[#1c1917] text-stone-200"
        style={{ backgroundColor: 'var(--color-charcoal-dark)' }}
      >
        <Container className="py-12 lg:py-14">
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {/* Column 1: Logo + Tagline (Hardfloor Showroom) */}
            <div>
              <Link href="/" className="inline-block">
                {hasLogo ? (
                  <Image
                    src={urlFor(logo!).width(160).height(120).auto('format').url()}
                    alt={siteName || 'Logo'}
                    width={160}
                    height={120}
                    className="h-auto max-h-[100px] w-auto brightness-0 invert opacity-95"
                  />
                ) : (
                  siteName && (
                    <span className="text-xl font-bold tracking-tight text-stone-100">
                      {siteName}
                    </span>
                  )
                )}
              </Link>
              {footerTagline && (
                <p className="mt-4 max-w-xs text-sm leading-relaxed text-stone-400">
                  {footerTagline}
                </p>
              )}
            </div>

            {/* Column 2: Quick Links */}
            {quickLinks.length > 0 && (
              <div>
                <h3 className="text-base font-semibold tracking-tight text-stone-100">
                  Quick Links
                </h3>
                <ul className="mt-4 space-y-3">
                  {quickLinks.map((link) => (
                    <li key={link._key}>
                      <Link
                        href={link.path!}
                        className="text-sm text-stone-400 transition-colors hover:text-stone-200"
                      >
                        {link.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Column 3: Our Products / Collections */}
            {productNav && productNav.children && (
              <div>
                <h3 className="text-base font-semibold tracking-tight text-stone-100">
                  {productNav.title}
                </h3>
                <ul className="mt-4 space-y-3">
                  {productNav.children.map((child) => (
                    <li key={child._key}>
                      <Link
                        href={child.path}
                        className="text-sm text-stone-400 transition-colors hover:text-stone-200"
                      >
                        {child.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Column 4: Contact — with map pin, phone, clock icons */}
            {contactInfo && (
              <div>
                <h3 className="text-base font-semibold tracking-tight text-stone-100">
                  Contact
                </h3>
                <div className="mt-4 space-y-4 text-sm text-stone-400">
                  {contactInfo?.address && (
                    <p className="flex gap-3">
                      <span className="mt-0.5 shrink-0 text-stone-500" aria-hidden>
                        <MapPinIcon />
                      </span>
                      <span className="whitespace-pre-line leading-relaxed">
                        {contactInfo.address}
                      </span>
                    </p>
                  )}
                  {displayPhone && (
                    <p className="flex items-center gap-3">
                      <span className="shrink-0 text-stone-500" aria-hidden>
                        <PhoneIcon />
                      </span>
                      <a
                        href={`tel:${displayPhone.replace(/\s/g, '')}`}
                        className="transition-colors hover:text-stone-200"
                      >
                        {displayPhone}
                      </a>
                    </p>
                  )}
                  {contactInfo.tollFree && (
                    <p className="flex items-center gap-3">
                      <span className="shrink-0 text-stone-500" aria-hidden>
                        <PhoneIcon />
                      </span>
                      <a
                        href={`tel:${contactInfo.tollFree}`}
                        className="transition-colors hover:text-stone-200"
                      >
                        {contactInfo.tollFree}
                      </a>
                    </p>
                  )}
                  {contactInfo.email && (
                    <p className="flex items-center gap-3">
                      <span className="shrink-0 text-stone-500" aria-hidden>
                        <MailIcon />
                      </span>
                      <a
                        href={`mailto:${contactInfo.email}`}
                        className="transition-colors hover:text-stone-200"
                      >
                        {contactInfo.email}
                      </a>
                    </p>
                  )}
                  {businessHours && (
                    <p className="flex gap-3">
                      <span className="mt-0.5 shrink-0 text-stone-500" aria-hidden>
                        <ClockIcon />
                      </span>
                      <span className="whitespace-pre-line leading-relaxed">
                        {businessHours}
                      </span>
                    </p>
                  )}
                  {social.length > 0 && (
                    <div className="flex gap-4 pt-2">
                      {social.map((link) => (
                        <a
                          key={link._key}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-stone-500 transition-colors hover:text-stone-300"
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

        {/* Copyright — light brown line, centered text */}
        <div className="border-t border-stone-600/80">
          <Container className="py-5">
            <p className="text-center text-sm text-stone-500">
              {copyrightText || `© ${currentYear} ${siteName}. All rights reserved.`}
            </p>
          </Container>
        </div>
      </div>
    </footer>
  );
}

function MapPinIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
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
