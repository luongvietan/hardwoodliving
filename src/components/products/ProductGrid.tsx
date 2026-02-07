import type { SanityImageValue } from "@/lib/sanity/types";
import ProductCard from "./ProductCard";

interface Product {
  _id: string;
  title: string;
  slug: { current: string };
  price: number;
  priceUnit?: string;
  images?: SanityImageValue[];
}

interface ProductGridProps {
  products?: Product[];
  emptyMessage?: string;
}

/**
 * Responsive product grid layout.
 * Arranges ProductCard components: 1-column mobile, 2-column tablet,
 * 3-column laptop, 4-column desktop.
 * Displays an empty-state message when no products are available.
 */
export default function ProductGrid({
  products,
  emptyMessage = "No products found. Check back soon!",
}: ProductGridProps) {
  if (!products || products.length === 0) {
    return (
      <p className="text-center text-lg text-gray-600">{emptyMessage}</p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
  );
}
