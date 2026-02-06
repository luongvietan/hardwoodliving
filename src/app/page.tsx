import Link from "next/link";
import Container from "@/components/layout/Container";

export default function Home() {
  return (
    <Container className="py-16">
      <div className="flex flex-col items-center justify-center gap-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
          Premium Hardwood
          <span className="block text-amber-900">For Every Space</span>
        </h1>
        <p className="max-w-2xl text-lg leading-8 text-gray-600">
          Discover our curated collection of hardwood flooring and cabinetry,
          crafted for residential and commercial spaces across Canada.
        </p>
        <div className="flex flex-col gap-4 sm:flex-row">
          <Link
            href="/categories/flooring"
            className="rounded-md bg-amber-900 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-amber-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-900"
          >
            Browse Flooring
          </Link>
          <Link
            href="/contact"
            className="rounded-md border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-900 shadow-sm transition-colors hover:bg-gray-50"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </Container>
  );
}
