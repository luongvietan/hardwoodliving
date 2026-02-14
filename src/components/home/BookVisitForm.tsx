'use client';

import { useState } from 'react';
import Link from 'next/link';

interface BookVisitFormProps {
  heading?: string;
  subheading?: string;
  primaryCtaText?: string;
  secondaryCtaText?: string;
}

/**
 * "Book Your Showroom Visit" form — Full Name, Email, Phone, Preferred Visit Date.
 * Placeholders per design; CTAs from Sanity.
 */
export default function BookVisitForm({
  heading,
  subheading,
  primaryCtaText = 'Book a showroom visit',
  secondaryCtaText = 'Request a quote',
}: BookVisitFormProps) {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section className="bg-stone-50 py-16 lg:py-20">
      <div className="mx-auto max-w-xl px-4">
        {heading && <h2 className="section-heading">{heading}</h2>}
        {subheading && (
          <p className="mt-4 text-center text-stone-600">{subheading}</p>
        )}
        {submitted ? (
          <p className="mt-8 text-center font-medium text-stone-800">
            Thank you. Our team will get back to you quickly.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div>
              <label htmlFor="fullName" className="mb-1 block text-sm font-medium text-stone-700">
                Full Name
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                placeholder="John Doe"
                className="w-full rounded-lg border border-stone-300 bg-white px-4 py-2.5 text-stone-900 focus:border-[var(--color-accent-orange)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent-orange)]"
              />
            </div>
            <div>
              <label htmlFor="email" className="mb-1 block text-sm font-medium text-stone-700">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="john@example.com"
                className="w-full rounded-lg border border-stone-300 bg-white px-4 py-2.5 text-stone-900 focus:border-[var(--color-accent-orange)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent-orange)]"
              />
            </div>
            <div>
              <label htmlFor="phone" className="mb-1 block text-sm font-medium text-stone-700">
                Phone Number
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                placeholder="+1 (555) 000-0000"
                className="w-full rounded-lg border border-stone-300 bg-white px-4 py-2.5 text-stone-900 focus:border-[var(--color-accent-orange)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent-orange)]"
              />
            </div>
            <div>
              <label htmlFor="visitDate" className="mb-1 block text-sm font-medium text-stone-700">
                Preferred Visit Date (optional)
              </label>
              <input
                id="visitDate"
                name="visitDate"
                type="text"
                placeholder="mm/dd/yyyy"
                className="w-full rounded-lg border border-stone-300 bg-white px-4 py-2.5 text-stone-900 focus:border-[var(--color-accent-orange)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent-orange)]"
              />
            </div>
            <div className="flex flex-wrap gap-4 pt-4">
              <button type="submit" className="btn-primary">
                {primaryCtaText}
              </button>
              <Link href="/contact" className="btn-secondary">
                {secondaryCtaText}
              </Link>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
