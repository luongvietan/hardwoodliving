import type { Metadata } from "next";
import Container from "@/components/layout/Container";
import ProductGrid from "@/components/products/ProductGrid";
import { sanityFetch } from "@/lib/sanity/fetch";
import { searchProductsQuery } from "@/lib/sanity/queries";
import type { SanityImageValue } from "@/lib/sanity/types";

interface SearchProduct {
  _id: string;
  title: string;
  slug: { current: string };
  description?: string;
  price: number;
  priceUnit?: string;
  images?: SanityImageValue[];
  category?: {
    title: string;
    slug: { current: string };
  };
}

export const metadata: Metadata = {
  title: "Search Results",
  description: "Search our product catalog.",
  alternates: {
    canonical: "/search",
  },
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q?.trim() || "";

  let results: SearchProduct[] = [];

  if (query) {
    try {
      // GROQ match requires wildcard for partial matching
      const searchTerm = `${query}*`;
      results = await sanityFetch<SearchProduct[]>({
        query: searchProductsQuery,
        params: { query: searchTerm, limit: 20 },
        tags: ["product"],
        revalidate: 0, // No cache for search results
      });
    } catch (error) {
      console.error("Search failed:", error);
    }
  }

  return (
    <>
      {/* Page Header — Magna dark banner */}
      <section className="bg-charcoal py-16">
        <Container>
          <h1 className="text-3xl font-bold uppercase tracking-wider text-white sm:text-4xl">
            Search Results
          </h1>
          {query && (
            <p className="mt-4 text-lg text-gray-300">
              Showing results for &ldquo;<span className="text-accent-orange">{query}</span>&rdquo;
            </p>
          )}
        </Container>
      </section>

      <Container className="py-12">
        {!query ? (
          <p className="text-center text-lg text-gray-600">
            Enter a search term to find products.
          </p>
        ) : results.length === 0 ? (
          <div className="text-center">
            <p className="text-lg text-gray-600">
              No products found matching your search.
            </p>
            <p className="mt-2 text-sm text-gray-500">
              Try adjusting your search terms or browse our product categories.
            </p>
          </div>
        ) : (
          <>
            <p className="mb-6 text-sm text-gray-500">
              {results.length} product{results.length !== 1 ? "s" : ""} found
            </p>
            <ProductGrid products={results} />
          </>
        )}
      </Container>
    </>
  );
}
