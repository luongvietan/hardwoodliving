/**
 * Generic JSON-LD structured data component.
 * Renders a <script type="application/ld+json"> tag with the provided data.
 * Escapes closing script tags to prevent XSS via user-generated content.
 */
export default function JsonLd({ data }: { data: Record<string, unknown> }) {
  const safeJson = JSON.stringify(data).replace(/<\/script/gi, "<\\/script");

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJson }}
    />
  );
}

/** Build JSON-LD Product schema */
export function buildProductJsonLd({
  name,
  description,
  image,
  price,
  currency = "CAD",
  url,
  brand,
  sku,
}: {
  name: string;
  description?: string;
  image?: string;
  price?: number;
  currency?: string;
  url: string;
  brand?: string;
  sku?: string;
}): Record<string, unknown> {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    url,
  };

  if (description) schema.description = description;
  if (image) schema.image = image;
  if (sku) schema.sku = sku;
  if (brand) {
    schema.brand = { "@type": "Brand", name: brand };
  }

  if (price !== undefined && price > 0) {
    schema.offers = {
      "@type": "Offer",
      price: price.toString(),
      priceCurrency: currency,
      availability: "https://schema.org/InStock",
      seller: { "@type": "Organization", name: "Hardwood Living" },
    };
  }

  return schema;
}

/** Build JSON-LD Organization schema */
export function buildOrganizationJsonLd({
  name,
  url,
  logo,
  description,
}: {
  name: string;
  url: string;
  logo?: string;
  description?: string;
}): Record<string, unknown> {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name,
    url,
  };

  if (logo) schema.logo = logo;
  if (description) schema.description = description;

  return schema;
}

/** Build JSON-LD LocalBusiness schema for flooring showroom */
export function buildLocalBusinessJsonLd({
  name,
  url,
  logo,
  description,
  phone,
  email,
  address,
  geo,
  openingHours,
  priceRange = "$$",
}: {
  name: string;
  url: string;
  logo?: string;
  description?: string;
  phone?: string;
  email?: string;
  address?: {
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry: string;
  };
  geo?: { latitude: number; longitude: number };
  openingHours?: string[];
  priceRange?: string;
}): Record<string, unknown> {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "FlooringStore",
    "@id": `${url}/#local-business`,
    name,
    url,
    priceRange,
  };

  if (logo) schema.logo = { "@type": "ImageObject", url: logo };
  if (description) schema.description = description;
  if (phone) schema.telephone = phone;
  if (email) schema.email = email;
  if (address) {
    schema.address = {
      "@type": "PostalAddress",
      ...address,
    };
  }
  if (geo) {
    schema.geo = {
      "@type": "GeoCoordinates",
      latitude: geo.latitude,
      longitude: geo.longitude,
    };
  }
  if (openingHours && openingHours.length > 0) {
    schema.openingHoursSpecification = openingHours;
  }

  return schema;
}

/** Build JSON-LD WebSite schema with SearchAction (Sitelinks Searchbox) */
export function buildWebSiteJsonLd({
  name,
  url,
  description,
}: {
  name: string;
  url: string;
  description?: string;
}): Record<string, unknown> {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${url}/#website`,
    name,
    url,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${url}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  if (description) schema.description = description;

  return schema;
}

/** Build JSON-LD FAQPage schema */
export function buildFaqJsonLd(
  items: { question: string; answer: string }[]
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

/** Build JSON-LD BreadcrumbList schema */
export function buildBreadcrumbJsonLd(
  items: { name: string; url: string }[]
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
