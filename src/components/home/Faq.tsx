'use client';

import { useState } from 'react';

interface FaqItem {
  question?: string;
  answer?: string;
}

interface FaqProps {
  heading?: string;
  items?: FaqItem[];
}

/**
 * "Have Questions? We've Got Answers" — accordion FAQ.
 * Content from Sanity; layout per design.
 */
export default function Faq({ heading, items }: FaqProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  if (!heading && (!items || items.length === 0)) return null;

  return (
    <section className="bg-stone-50 py-16 lg:py-20">
      <div className="mx-auto max-w-3xl px-4">
        {heading && <h2 className="section-heading">{heading}</h2>}
        {items && items.length > 0 && (
          <div className="mt-12 space-y-3">
            {items.map((item, i) => (
              <div
                key={i}
                className="overflow-hidden rounded-xl border border-stone-200/80 bg-white shadow-sm"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className="flex w-full items-center justify-between px-6 py-4 text-left text-base font-semibold text-stone-800 transition-colors hover:bg-stone-50"
                >
                  {item.question}
                  <span className="text-stone-500">
                    {openIndex === i ? '−' : '+'}
                  </span>
                </button>
                {openIndex === i && item.answer && (
                  <div className="border-t border-stone-100 px-6 py-4 text-sm text-stone-600">
                    {item.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
