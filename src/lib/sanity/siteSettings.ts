import type { SanityImageValue } from "./types";
import { sanityFetch } from "./fetch";
import { getSiteSettingsQuery } from "./queries";

export interface SiteSettings {
  siteName?: string;
  logo?: SanityImageValue;
  navigation?: { title: string; path: string; _key: string }[];
  contactInfo?: {
    email?: string;
    phone?: string;
    address?: string;
  };
  socialLinks?: { platform: string; url: string; _key: string }[];
}

/**
 * Fetch site settings from Sanity with caching.
 * Falls back to hardcoded defaults if CMS data is unavailable.
 */
export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const data = await sanityFetch<SiteSettings | null>({
      query: getSiteSettingsQuery,
      tags: ["siteSettings"],
    });
    return data || {};
  } catch {
    return {};
  }
}

// Default fallbacks
export const defaultNavigation = [
  { title: "Flooring", path: "/categories/flooring" },
  { title: "Cabinetry", path: "/categories/cabinetry" },
  { title: "Visit Us", path: "/pages/visit-us" },
  { title: "Care Guide", path: "/pages/care-guide" },
  { title: "Why Wood?", path: "/pages/why-wood" },
  { title: "Contact", path: "/contact" },
  { title: "Trades", path: "/trades" },
];

export const defaultContactInfo = {
  phone: "(604) 555-0123",
  email: "info@hardwoodliving.ca",
  address: "123 Timber Street, Vancouver, BC V6B 1A1",
};

export const defaultSocialLinks = [
  { platform: "Facebook", url: "https://facebook.com/hardwoodliving" },
  { platform: "Instagram", url: "https://instagram.com/hardwoodliving" },
  { platform: "Pinterest", url: "https://pinterest.com/hardwoodliving" },
];
