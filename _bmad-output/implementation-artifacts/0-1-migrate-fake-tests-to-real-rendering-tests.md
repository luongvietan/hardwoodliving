# Story 0.1 – Migrate Fake Tests to Real Rendering Tests

**Epic:** Infrastructure / Testing  
**Status:** done  
**Priority:** High  
**Points:** 3

---

## Description

Migrate all "fake tests" (static source code inspection via `fs.readFileSync`) to **real rendering tests** using `vitest` + `@testing-library/react` + `jsdom`. Fake tests only scan source code strings for keywords — they never actually render components, so they cannot catch runtime bugs, prop type mismatches, or broken conditional rendering.

## Acceptance Criteria

- [x] Install `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `@vitejs/plugin-react`, `jsdom`
- [x] Create `vitest.config.ts` with jsdom environment, path aliases, and React plugin
- [x] Create `src/test-setup.ts` with global mocks for `next/image`, `next/link`, `next/navigation`, `@/lib/sanity/image`, `@/lib/sanity/fetch`, `@/lib/sanity/queries`
- [x] Rewrite `ProductCard.test.ts` → `ProductCard.test.tsx` with real rendering (12 tests)
- [x] Rewrite `FeaturedProducts.test.ts` → `FeaturedProducts.test.tsx` with real rendering (8 tests)
- [x] Rewrite `HeroSection.test.ts` → `HeroSection.test.tsx` with real rendering (15 tests)
- [x] Rewrite `Testimonials.test.ts` → `Testimonials.test.tsx` with real rendering (10 tests)
- [x] Rewrite `IntroBlurb.test.ts` → `IntroBlurb.test.tsx` with real rendering (8 tests)
- [x] Rewrite `homepage.test.ts` → `homepage.test.tsx` with async Server Component integration tests (9 tests)
- [x] All 62 vitest component tests pass
- [x] Update `package.json` scripts: `test:components` (vitest), `test:unit` (node:test), `test` (both)

## File List

- [x] `vitest.config.ts` (new)
- [x] `src/test-setup.ts` (new)
- [x] `src/components/products/ProductCard.test.tsx` (new, replaces .test.ts)
- [x] `src/components/home/FeaturedProducts.test.tsx` (new, replaces .test.ts)
- [x] `src/components/home/HeroSection.test.tsx` (new, replaces .test.ts)
- [x] `src/components/home/Testimonials.test.tsx` (new, replaces .test.ts)
- [x] `src/components/home/IntroBlurb.test.tsx` (new, replaces .test.ts)
- [x] `src/app/(site)/homepage.test.tsx` (new, replaces .test.ts)
- [x] `package.json` (modified - added vitest deps + scripts)

## Tasks

- [x] 1. Install vitest + @testing-library/react + jsdom + @vitejs/plugin-react
- [x] 2. Create vitest.config.ts with jsdom, React plugin, path aliases
- [x] 3. Create src/test-setup.ts with mocks for Next.js modules + Sanity
- [x] 4. Rewrite ProductCard tests → real rendering with @testing-library/react
- [x] 5. Rewrite FeaturedProducts tests → real rendering
- [x] 6. Rewrite HeroSection tests → real rendering
- [x] 7. Rewrite Testimonials tests → real rendering
- [x] 8. Rewrite IntroBlurb tests → real rendering
- [x] 9. Rewrite homepage integration tests → async Server Component rendering
- [x] 10. Update package.json scripts + verify all 62 tests pass

## Technical Notes

### Why fake tests are problematic

Fake tests read source code as strings and check for keyword presence:
```ts
const content = fs.readFileSync(path, 'utf-8');
assert.ok(content.includes('className'), 'should have className');
```

This approach:
- Never renders the component → cannot catch runtime errors
- Cannot verify props are passed correctly between components
- Cannot detect broken conditional rendering
- Cannot verify accessibility (ARIA roles, labels)
- Gives false confidence — tests pass even when components are completely broken

### Real rendering approach

```tsx
import { render, screen } from '@testing-library/react';
render(<ProductCard title="Oak" slug={{ current: "oak" }} price={5.99} />);
expect(screen.getByText("Oak")).toBeInTheDocument();
expect(screen.getByRole("link")).toHaveAttribute("href", "/products/oak");
```

### Test infrastructure

- **vitest** — Fast, Vite-native test runner with built-in jsdom support
- **@testing-library/react** — Renders real React components in jsdom DOM
- **test-setup.ts** — Global mocks for Next.js Image/Link, Sanity urlFor/sanityFetch
- **async Server Component testing** — `await Home()` gets JSX, then `render(<>{jsx}</>)`

### Future work (out of scope)

- Migrate `tests/unit/layout/components.test.ts` fake parts to vitest
- Fix 27 pre-existing node:test failures (unrelated to this story)
- Add vitest coverage reporting

---

## Dev Agent Record

**Agent:** Claude  
**Started:** 2026-02-07  
**Completed:** 2026-02-07  
**Result:** 62/62 vitest tests PASS. All 6 fake test files migrated to real rendering tests.
