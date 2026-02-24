import type { Metadata } from "next";
import Container from "@/components/layout/Container";
import { sanityFetch } from "@/lib/sanity/fetch";
import { getBestValueProductsQuery } from "@/lib/sanity/queries";
import { getUserRole, getVisibilityOptions } from "@/lib/sanity/visibility";
import { SITE_URL } from "@/lib/constants";
import type { SanityImageValue } from "@/lib/sanity/types";
import BestValueCatalog from "./BestValueCatalog";

export const metadata: Metadata = {
  title: "Best Value | Hardwood Living",
  description: "Browse our best-value flooring products — premium quality at unbeatable prices.",
  alternates: {
    canonical: `${SITE_URL}/best-value`,
  },
};

interface Product {
  _id: string;
  title: string;
  slug: { current: string };
  description?: string;
  price: number;
  salePrice?: number | null;
  isOnSale?: boolean;
  isBestValue?: boolean;
  priceUnit?: string;
  images?: SanityImageValue[];
  category?: {
    _id: string;
    title: string;
    slug: { current: string };
  } | null;
}

export default async function BestValuePage() {
  const role = await getUserRole();
  const visibility = getVisibilityOptions(role);
  const revalidate = role === "public" ? 60 : 0;

  const products = await sanityFetch<Product[]>({
    query: getBestValueProductsQuery,
    params: { visibility },
    tags: ["product"],
    revalidate,
  });

  return (
    <>
      <section className="bg-charcoal py-16">
        <Container>
          <h1 className="text-3xl font-bold uppercase tracking-wider text-white sm:text-4xl">
            Best Value
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-gray-300">
            Premium flooring products offering exceptional quality at unbeatable prices.
          </p>
        </Container>
      </section>

      <Container className="py-12">
        <BestValueCatalog products={products ?? []} />
      </Container>
    </>
  );
}
