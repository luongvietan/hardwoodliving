import type { SanityImageValue } from "./types";
import { sanityFetch } from "./fetch";
import { getSiteSettingsQuery } from "./queries";

export interface NavChild {
  _key: string;
  title: string;
  path: string;
}

export interface NavItem {
  _key: string;
  title: string;
  path?: string;
  position: "left" | "right";
  children?: NavChild[];
}

export interface ContactInfo {
  email?: string;
  phone?: string;
  address?: string;
  tollFree?: string;
}

export interface SocialLink {
  _key: string;
  platform: string;
  url: string;
}

export interface SiteSettings {
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

/**
 * Fetch site settings from Sanity with caching.
 * All content is dynamic from CMS — no hardcoded fallbacks.
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
