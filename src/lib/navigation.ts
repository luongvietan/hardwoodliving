/**
 * Navigation type definitions for Hardwood Living website.
 * All navigation data is fetched from Sanity CMS siteSettings.
 * No hardcoded navigation items — CMS is the single source of truth.
 */

export interface NavChild {
  _key: string;
  title: string;
  path: string;
}

export interface NavItem {
  _key: string;
  title: string;
  path?: string;
  position: 'left' | 'right';
  children?: NavChild[];
}
