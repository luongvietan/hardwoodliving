import Image from "next/image";
import type { SanityImageValue } from "@/lib/sanity/types";
import { urlFor } from "@/lib/sanity/image";
import Container from "@/components/layout/Container";

interface Testimonial {
  _id: string;
  author: string;
  content: string;
  image?: SanityImageValue;
}

interface TestimonialsProps {
  testimonials?: Testimonial[];
}

/**
 * Testimonials section for the homepage.
 * Displays a responsive grid of testimonial cards with author name,
 * quote content, and optional author image.
 * Renders nothing if no testimonials are provided.
 */
export default function Testimonials({ testimonials }: TestimonialsProps) {
  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby="testimonials-heading" className="bg-white py-16">
      <Container>
        <h2
          id="testimonials-heading"
          className="mb-10 text-center text-3xl font-bold tracking-tight text-gray-900"
        >
          What Our Clients Say
        </h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial._id}
              className="rounded-lg border border-gray-200 bg-gray-50 p-6"
            >
              <svg
                className="mb-4 h-8 w-8 text-amber-400"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
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
  );
}
