import ProductCard from '@/components/products/ProductCard';
import type { SanityImageValue } from '@/lib/sanity/types';

interface FeaturedProduct {
  _id: string;
  title?: string;
  slug?: { current?: string };
  price?: number;
  priceUnit?: string;
  images?: SanityImageValue[];
}

interface FeaturedProductsProps {
  products?: FeaturedProduct[];
}

/**
 * Featured products section on the homepage.
 * Renders a grid of ProductCard components.
 * All content from Sanity CMS — renders nothing if no data.
 */
export default function FeaturedProducts({ products }: FeaturedProductsProps) {
  if (!products || products.length === 0) return null;

  return (
    <section className="py-12 lg:py-16">
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="mb-8 text-center text-2xl font-bold text-charcoal-dark lg:text-3xl">
          Featured Products
        </h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              title={product.title}
              slug={product.slug?.current}
              price={product.price}
              priceUnit={product.priceUnit}
              image={product.images?.[0]}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
