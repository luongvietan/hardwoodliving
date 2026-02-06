import Link from "next/link";
import Image from "next/image";
import Container from "@/components/layout/Container";
import { sanityFetch } from "@/lib/sanity/fetch";
import { getHomepageQuery } from "@/lib/sanity/queries";
import { urlFor } from "@/lib/sanity/image";

interface HomepageData {
  hero?: {
    heading?: string;
    subheading?: string;
    image?: { asset?: { _ref: string } };
    ctaLink?: string;
    ctaText?: string;
  };
  introBlurb?: string;
  featuredProducts?: {
    _id: string;
    title: string;
    slug: { current: string };
    price: number;
    images?: { asset?: { _ref: string } }[];
  }[];
  testimonials?: {
    author: string;
    content: string;
    image?: { asset?: { _ref: string } };
  }[];
}

export default async function Home() {
  const data = await sanityFetch<HomepageData | null>({
    query: getHomepageQuery,
    tags: ["homepage"],
  });

  // Fallback content if CMS data is not available yet
  const hero = data?.hero;
  const heading = hero?.heading || "Premium Hardwood";
  const subheading =
    hero?.subheading ||
    "Discover our curated collection of hardwood flooring and cabinetry, crafted for residential and commercial spaces across Canada.";
  const ctaLink = hero?.ctaLink || "/categories/flooring";
  const ctaText = hero?.ctaText || "Browse Flooring";
  const heroImage = hero?.image?.asset?._ref ? urlFor(hero.image).width(1920).height(800).auto("format").url() : null;

  return (
    <>
      {/* Hero Section */}
      <section className="relative flex min-h-[60vh] items-center justify-center overflow-hidden bg-gray-900">
        {heroImage && (
          <Image
            src={heroImage}
            alt={heading}
            fill
            priority
            className="object-cover opacity-40"
          />
        )}
        {!heroImage && (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-amber-950 to-gray-900" />
        )}
        <Container className="relative z-10 py-24">
          <div className="flex flex-col items-center justify-center gap-6 text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              {heading.includes(" ") ? (
                <>
                  {heading.split(" ").slice(0, -1).join(" ")}{" "}
                  <span className="text-amber-400">
                    {heading.split(" ").slice(-1)}
                  </span>
                </>
              ) : (
                <span className="text-amber-400">{heading}</span>
              )}
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-gray-300">
              {subheading}
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                href={ctaLink}
                className="rounded-md bg-amber-700 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-amber-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500"
              >
                {ctaText}
              </Link>
              <Link
                href="/contact"
                className="rounded-md border border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold text-white shadow-sm backdrop-blur-sm transition-colors hover:bg-white/20"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* Intro Blurb */}
      {data?.introBlurb && (
        <section className="bg-white py-16">
          <Container>
            <p className="mx-auto max-w-3xl text-center text-lg leading-8 text-gray-600">
              {data.introBlurb}
            </p>
          </Container>
        </section>
      )}

      {/* Featured Products */}
      {data?.featuredProducts && data.featuredProducts.length > 0 && (
        <section className="bg-gray-50 py-16">
          <Container>
            <h2 className="mb-10 text-center text-3xl font-bold tracking-tight text-gray-900">
              Featured Products
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {data.featuredProducts.map((product) => (
                <Link
                  key={product._id}
                  href={`/products/${product.slug.current}`}
                  className="group overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                    {product.images?.[0]?.asset?._ref ? (
                      <Image
                        src={urlFor(product.images[0])
                          .width(600)
                          .height(450)
                          .auto("format")
                          .url()}
                        alt={product.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-gray-400">
                        <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5a2.25 2.25 0 002.25-2.25V5.25a2.25 2.25 0 00-2.25-2.25H3.75a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 003.75 21z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-amber-900">
                      {product.title}
                    </h3>
                    {product.price > 0 && (
                      <p className="mt-1 text-sm text-gray-600">
                        From ${product.price.toFixed(2)} / sq ft
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* Testimonials */}
      {data?.testimonials && data.testimonials.length > 0 && (
        <section className="bg-white py-16">
          <Container>
            <h2 className="mb-10 text-center text-3xl font-bold tracking-tight text-gray-900">
              What Our Clients Say
            </h2>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {data.testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="rounded-lg border border-gray-200 bg-gray-50 p-6"
                >
                  <svg className="mb-4 h-8 w-8 text-amber-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                  <p className="mb-4 text-gray-700">{testimonial.content}</p>
                  <div className="flex items-center gap-3">
                    {testimonial.image?.asset?._ref && (
                      <Image
                        src={urlFor(testimonial.image)
                          .width(40)
                          .height(40)
                          .auto("format")
                          .url()}
                        alt={testimonial.author}
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                    )}
                    <span className="text-sm font-semibold text-gray-900">
                      {testimonial.author}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </section>
      )}
    </>
  );
}
