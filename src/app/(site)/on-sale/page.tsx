import type { Metadata } from "next";
import Container from "@/components/layout/Container";
import { sanityFetch } from "@/lib/sanity/fetch";
import { getOnSaleProductsQuery } from "@/lib/sanity/queries";
import { getUserRole, getVisibilityOptions } from "@/lib/sanity/visibility";
import { SITE_URL } from "@/lib/constants";
import OnSaleCatalog from "./OnSaleCatalog";

export const metadata: Metadata = {
  title: "On Sale | Hardwood Living",
  description: "Browse all our on-sale flooring products at discounted prices.",
  alternates: {
    canonical: `${SITE_URL}/on-sale`,
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
  priceUnit?: string;
  images?: { asset?: { _ref: string } }[];
  category?: {
    _id: string;
    title: string;
    slug: { current: string };
  } | null;
}

export default async function OnSalePage() {
  const role = await getUserRole();
  const visibility = getVisibilityOptions(role);
  const revalidate = role === "public" ? 60 : 0;

  const products = await sanityFetch<Product[]>({
    query: getOnSaleProductsQuery,
    params: { visibility },
    tags: ["product"],
    revalidate,
  });

  return (
    <>
      <section className="bg-charcoal py-16">
        <Container>
          <h1 className="text-3xl font-bold uppercase tracking-wider text-white sm:text-4xl">
            On Sale
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-gray-300">
            Discover our best deals — premium flooring at discounted prices.
          </p>
        </Container>
      </section>

      <Container className="py-12">
        <OnSaleCatalog products={products ?? []} />
      </Container>
    </>
  );
}
