/**
 * Navigation configuration for Hardwood Living website.
 * Hardcoded for MVP; can be replaced with Sanity siteSettings fetch later.
 */

export interface NavLink {
  label: string;
  href: string;
}

export const navigationLinks: NavLink[] = [
  { label: 'Flooring', href: '/categories/flooring' },
  { label: 'Cabinetry', href: '/categories/cabinetry' },
  { label: 'Visit Us', href: '/pages/visit-us' },
  { label: 'Care Guide', href: '/pages/care-guide' },
  { label: 'Why Wood?', href: '/pages/why-wood' },
  { label: 'Contact', href: '/contact' },
  { label: 'Trades', href: '/trades' },
];

export const contactInfo = {
  phone: '(604) 555-0123',
  email: 'info@hardwoodliving.ca',
  address: '123 Timber Street, Vancouver, BC V6B 1A1',
};

export const socialLinks: NavLink[] = [
  { label: 'Facebook', href: 'https://facebook.com/hardwoodliving' },
  { label: 'Instagram', href: 'https://instagram.com/hardwoodliving' },
  { label: 'Pinterest', href: 'https://pinterest.com/hardwoodliving' },
];
