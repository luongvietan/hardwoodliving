'use client';

import type { ReactNode } from 'react';

export interface AnimatedSectionProps {
  children: ReactNode;
  /** Kept for API compatibility; no longer used */
  variant?: 'fadeUp' | 'fadeIn' | 'fadeUpStagger';
  /** Kept for API compatibility; no longer used */
  delay?: number;
  /** Kept for API compatibility; no longer used */
  duration?: number;
  /** Kept for API compatibility; no longer used */
  start?: string;
  /** Additional class names */
  className?: string;
}

/**
 * Simple section wrapper. Scroll-triggered animations have been disabled.
 */
export default function AnimatedSection({
  children,
  className,
}: AnimatedSectionProps) {
  return <div className={className}>{children}</div>;
}
