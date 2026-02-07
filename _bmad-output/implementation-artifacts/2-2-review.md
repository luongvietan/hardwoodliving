**🔥 CODE REVIEW FINDINGS, Viet An!**

**Story:** 2-2-display-featured-products-on-homepage.md
**Git vs Story Discrepancies:** 1 found
**Issues Found:** 1 High, 2 Medium, 1 Low

## 🔴 CRITICAL ISSUES
- **Test Quality**: The tests in `ProductCard.test.ts`, `FeaturedProducts.test.ts`, and `homepage.test.ts` are **fake tests**. They use `node:fs` to read the source code as strings and check for the presence of keywords (e.g., `content.includes('grid')`). This is static analysis, not unit testing. It does not verify that the component actually renders, that props are passed correctly, or that the grid is applied to the correct element. It completely fails to test runtime behavior.

## 🟡 MEDIUM ISSUES
- **Undocumented File Change**: `src/lib/sanity/queries.ts` was modified (added `getFeaturedProductsQuery`, updated `getHomepageQuery`) but is NOT listed in the Story's **File List**. All changed files must be documented.
- **Hardcoded Pricing Unit**: `ProductCard.tsx` hardcodes the unit as `/ sq ft` (`From ${price.toFixed(2)} / sq ft`). This will be incorrect for products sold by the box, piece, or linear foot (like cabinetry or molding), which are part of the catalog.

## 🟢 LOW ISSUES
- **Unused Code**: `getFeaturedProductsQuery` is exported in `queries.ts` but not used in `page.tsx` (which uses `getHomepageQuery`). While good for future use, it's currently dead code.

