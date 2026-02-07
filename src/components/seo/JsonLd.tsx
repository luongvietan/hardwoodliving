/**
 * Generic JSON-LD structured data component.
 * Renders a <script type="application/ld+json"> tag with the provided data.
 * Escapes closing script tags to prevent XSS via user-generated content.
 */
export default function JsonLd({ data }: { data: Record<string, unknown> }) {
  // Escape </script> sequences to prevent breaking out of the script tag
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
}: {
  name: string;
  description?: string;
  image?: string;
  price?: number;
  currency?: string;
  url: string;
}): Record<string, unknown> {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    url,
  };

  if (description) schema.description = description;
  if (image) schema.image = image;

  if (price !== undefined && price > 0) {
    schema.offers = {
      "@type": "Offer",
      price: price.toString(),
      priceCurrency: currency,
      availability: "https://schema.org/InStock",
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
