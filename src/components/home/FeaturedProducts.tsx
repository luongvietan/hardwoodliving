import type { SanityImageValue } from "@/lib/sanity/types";
import Container from "@/components/layout/Container";
import ProductCard from "@/components/products/ProductCard";

interface FeaturedProduct {
  _id: string;
  title: string;
  slug: { current: string };
  price: number;
  priceUnit?: string;
  images?: SanityImageValue[];
}

interface FeaturedProductsProps {
  products?: FeaturedProduct[];
}

/**
 * Featured products section for the homepage.
 * Displays a responsive grid of ProductCard components.
 * Renders nothing if no featured products are provided (graceful empty state).
 */
export default function FeaturedProducts({
  products,
}: FeaturedProductsProps) {
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby="featured-products-heading" className="bg-gray-50 py-16">
      <Container>
        <h2
          id="featured-products-heading"
          className="mb-10 text-center text-3xl font-bold tracking-tight text-gray-900"
        >
          Featured Products
        </h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              title={product.title}
              slug={product.slug}
              price={product.price}
              priceUnit={product.priceUnit}
              images={product.images}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
