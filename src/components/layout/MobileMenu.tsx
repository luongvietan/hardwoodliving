'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { NavItem, ContactInfo } from '@/lib/sanity/siteSettings';

interface MobileMenuProps {
  navigation?: NavItem[];
  contactInfo?: ContactInfo;
}

/**
 * Mobile navigation menu with hamburger toggle (Magna dark theme).
 * Client component for open/close state management.
 * Visible only on mobile (< md breakpoint).
 *
 * Accessibility features:
 * - Escape key closes the menu
 * - Click outside closes the menu
 * - Route change closes the menu
 * - Focus is trapped within the menu when open
 * - Focus returns to hamburger button when menu closes
 *
 * All data from Sanity CMS — no hardcoded links.
 */
export default function MobileMenu({ navigation = [], contactInfo }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();

  const closeMenu = useCallback(() => {
    setIsOpen(false);
    setOpenDropdown(null);
    buttonRef.current?.focus();
  }, []);

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
    if (isOpen) setOpenDropdown(null);
  };

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false);
    setOpenDropdown(null);
  }, [pathname]);

  // Escape key handler and focus trap
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeMenu();
        return;
      }

      if (e.key === 'Tab' && menuRef.current) {
        const focusableElements = menuRef.current.querySelectorAll<HTMLElement>(
          'a[href], button, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeMenu]);

  // Click outside handler
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        closeMenu();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, closeMenu]);

  return (
    <div className="md:hidden">
      {/* Hamburger Button */}
      <button
        ref={buttonRef}
        type="button"
        onClick={toggleMenu}
        className="inline-flex items-center justify-center rounded-md p-2 text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-accent-orange focus:ring-offset-2 focus:ring-offset-charcoal"
        aria-expanded={isOpen}
        aria-controls="mobile-menu"
        aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
      >
        {isOpen ? (
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        )}
      </button>

      {/* Mobile Menu Panel */}
      {isOpen && (
        <div
          ref={menuRef}
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
          className="absolute left-0 right-0 top-full z-50 bg-charcoal-dark shadow-lg"
        >
          <nav className="space-y-1 px-4 pb-4 pt-2" aria-label="Mobile navigation">
            {navigation.map((item) => (
              <div key={item._key}>
                {item.children && item.children.length > 0 ? (
                  <>
                    <button
                      type="button"
                      onClick={() =>
                        setOpenDropdown((prev) =>
                          prev === item._key ? null : item._key
                        )
                      }
                      className="flex w-full items-center justify-between rounded-md px-3 py-3 text-base font-semibold uppercase tracking-wider text-gray-200 transition-colors hover:text-accent-orange"
                      aria-expanded={openDropdown === item._key}
                    >
                      {item.title}
                      <svg
                        className={`h-4 w-4 transition-transform ${openDropdown === item._key ? 'rotate-180' : ''}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                      </svg>
                    </button>
                    {openDropdown === item._key && (
                      <div className="ml-4 space-y-1 border-l border-charcoal-light pl-4">
                        {item.children.map((child) => (
                          <Link
                            key={child._key}
                            href={child.path}
                            onClick={closeMenu}
                            className="block rounded-md px-3 py-2 text-sm text-gray-400 transition-colors hover:text-accent-orange"
                          >
                            {child.title}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  item.path && (
                    <Link
                      href={item.path}
                      onClick={closeMenu}
                      className="block rounded-md px-3 py-3 text-base font-semibold uppercase tracking-wider text-gray-200 transition-colors hover:text-accent-orange"
                    >
                      {item.title}
                    </Link>
                  )
                )}
              </div>
            ))}

            {/* Contact info in mobile menu */}
            {contactInfo?.phone && (
              <div className="mt-4 border-t border-charcoal-light pt-4">
                <a
                  href={`tel:${contactInfo.phone}`}
                  className="block px-3 py-2 text-sm text-gray-400 hover:text-accent-orange"
                >
                  {contactInfo.phone}
                </a>
              </div>
            )}
          </nav>
        </div>
      )}
    </div>
  );
}
