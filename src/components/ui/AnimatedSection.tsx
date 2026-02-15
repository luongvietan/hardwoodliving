'use client';

import { useRef, useEffect, type ReactNode } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export interface AnimatedSectionProps {
  children: ReactNode;
  /** Animation preset: 'fadeUp' | 'fadeIn' | 'fadeUpStagger' */
  variant?: 'fadeUp' | 'fadeIn' | 'fadeUpStagger';
  /** Delay before animation starts (seconds) */
  delay?: number;
  /** Duration of animation (seconds) */
  duration?: number;
  /** ScrollTrigger start position (default: "top 85%") */
  start?: string;
  /** Additional class names */
  className?: string;
}

/**
 * Wraps content and animates it into view when scrolling.
 * Uses GSAP ScrollTrigger for performant scroll-linked animations.
 */
export default function AnimatedSection({
  children,
  variant = 'fadeUp',
  delay = 0,
  duration = 0.7,
  start = 'top 85%',
  className,
}: AnimatedSectionProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      if (variant === 'fadeUp') {
        gsap.from(el, {
          scrollTrigger: {
            trigger: el,
            start,
            toggleActions: 'play none none reverse',
          },
          opacity: 0,
          y: 50,
          duration,
          delay,
          ease: 'power3.out',
        });
      } else if (variant === 'fadeIn') {
        gsap.from(el, {
          scrollTrigger: {
            trigger: el,
            start,
            toggleActions: 'play none none reverse',
          },
          opacity: 0,
          duration,
          delay,
          ease: 'power2.out',
        });
      } else if (variant === 'fadeUpStagger') {
        const items = el.querySelectorAll('.animate-item');
        gsap.from(items, {
          scrollTrigger: {
            trigger: el,
            start,
            toggleActions: 'play none none reverse',
          },
          opacity: 0,
          y: 40,
          duration: duration * 0.8,
          stagger: 0.12,
          delay,
          ease: 'power3.out',
        });
      }
    }, el);

    return () => ctx.revert();
  }, [variant, delay, duration, start]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
