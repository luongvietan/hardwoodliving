import type { Metadata } from "next";
import Container from "@/components/layout/Container";
import ContactForm from "@/components/forms/ContactForm";
import { getSiteSettings } from "@/lib/sanity/siteSettings";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with our team for consultations, quotes, and inquiries about premium hardwood products.",
  alternates: {
    canonical: "/contact",
  },
};

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ product?: string }>;
}) {
  const { product } = await searchParams;
  const settings = await getSiteSettings();
  const contactInfo = settings.contactInfo;

  return (
    <>
      {/* Page Header — Magna dark banner */}
      <section className="bg-charcoal py-16">
        <Container>
          <h1 className="text-3xl font-bold uppercase tracking-wider text-white sm:text-4xl">
            Get In Touch
          </h1>
        </Container>
      </section>

      <Container className="py-12">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          {/* Contact information sidebar */}
          <aside className="lg:col-span-1">
            <h2 className="text-lg font-bold uppercase tracking-wider text-charcoal-dark">
              Contact Details
            </h2>

            <dl className="mt-6 space-y-4 text-sm text-gray-600">
              {contactInfo?.phone && (
                <div className="flex items-start gap-3">
                  <dt>
                    <span className="sr-only">Phone</span>
                    <svg
                      className="mt-0.5 h-5 w-5 shrink-0 text-accent-orange"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
                      />
                    </svg>
                  </dt>
                  <dd>
                    <a href={`tel:${contactInfo.phone}`} className="text-accent-orange hover:text-accent-orange-hover">
                      {contactInfo.phone}
                    </a>
                  </dd>
                </div>
              )}

              {contactInfo?.tollFree && (
                <div className="flex items-start gap-3">
                  <dt>
                    <span className="sr-only">Toll Free</span>
                    <svg
                      className="mt-0.5 h-5 w-5 shrink-0 text-accent-orange"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
                      />
                    </svg>
                  </dt>
                  <dd>
                    <a href={`tel:${contactInfo.tollFree}`} className="text-accent-orange hover:text-accent-orange-hover">
                      {contactInfo.tollFree} (Toll Free)
                    </a>
                  </dd>
                </div>
              )}

              {contactInfo?.email && (
                <div className="flex items-start gap-3">
                  <dt>
                    <span className="sr-only">Email</span>
                    <svg
                      className="mt-0.5 h-5 w-5 shrink-0 text-accent-orange"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                      />
                    </svg>
                  </dt>
                  <dd>
                    <a href={`mailto:${contactInfo.email}`} className="text-accent-orange hover:text-accent-orange-hover">
                      {contactInfo.email}
                    </a>
                  </dd>
                </div>
              )}

              {contactInfo?.address && (
                <div className="flex items-start gap-3">
                  <dt>
                    <span className="sr-only">Address</span>
                    <svg
                      className="mt-0.5 h-5 w-5 shrink-0 text-accent-orange"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                      />
                    </svg>
                  </dt>
                  <dd className="whitespace-pre-line">{contactInfo.address}</dd>
                </div>
              )}
            </dl>
          </aside>

          {/* Contact form */}
          <div id="contact-form" className="lg:col-span-2">
            <ContactForm defaultProductInterest={product || ""} />
          </div>
        </div>
      </Container>
    </>
  );
}
