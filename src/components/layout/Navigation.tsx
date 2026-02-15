'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import type { NavItem } from '@/lib/sanity/siteSettings';

interface NavigationProps {
  links: NavItem[];
}

/**
 * Desktop navigation component — items evenly distributed across full width.
 * Supports dropdown menus for items with children.
 * Hidden on mobile (< md breakpoint), shown on tablet and desktop.
 * All navigation data from Sanity CMS.
 */
export default function Navigation({ links }: NavigationProps) {
  if (!links || links.length === 0) return null;

  return (
    <nav className="hidden w-full items-center justify-between gap-1 md:flex" aria-label="Main navigation">
      {links.map((item) =>
        item.children && item.children.length > 0 ? (
          <DropdownItem key={item._key} item={item} />
        ) : (
          item.path && (
            <Link
              key={item._key}
              href={item.path}
              className="px-2.5 py-2 text-xs font-semibold uppercase tracking-wider text-gray-200 transition-colors hover:text-accent-orange sm:text-sm"
            >
              {item.title}
            </Link>
          )
        )
      )}
    </nav>
  );
}

/** Dropdown navigation item with hover/click toggle */
function DropdownItem({ item }: { item: NavItem }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null);

  const openDropdown = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
  }, []);

  const closeDropdown = useCallback(() => {
    timeoutRef.current = setTimeout(() => setIsOpen(false), 150);
  }, []);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Close on click outside
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div
      ref={dropdownRef}
      className="relative"
      onMouseEnter={openDropdown}
      onMouseLeave={closeDropdown}
    >
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-1 px-2.5 py-2 text-xs font-semibold uppercase tracking-wider text-gray-200 transition-colors hover:text-accent-orange sm:text-sm"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {item.title}
        <svg
          className={`h-3 w-3 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      {isOpen && item.children && (
        <div
          className="absolute left-0 top-full z-50 mt-0 min-w-[220px] rounded-b-md bg-charcoal-dark py-2 shadow-lg"
          role="menu"
        >
          {item.children.map((child) => (
            <Link
              key={child._key}
              href={child.path}
              role="menuitem"
              className="block px-4 py-2 text-sm text-gray-300 transition-colors hover:bg-charcoal-light hover:text-accent-orange"
              onClick={() => setIsOpen(false)}
            >
              {child.title}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
