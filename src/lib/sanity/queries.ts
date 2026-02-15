import { defineQuery } from "next-sanity";

export const getProductsQuery = defineQuery(`*[_type == "product" && visibility != "hidden"] | order(title asc) {
  _id,
  title,
  slug,
  description,
  price,
  priceUnit,
  images,
  category->{
    title,
    slug
  },
  isFeatured
}`);

export const getProductBySlugQuery = defineQuery(`*[_type == "product" && slug.current == $slug][0] {
  _id,
  title,
  slug,
  description,
  specifications,
  specs,
  price,
  priceUnit,
  images,
  category->{
    _id,
    title,
    slug
  },
  visibility,
  isFeatured
}`);

export const getFeaturedProductsQuery = defineQuery(`*[_type == "product" && isFeatured == true && visibility != "hidden"] | order(title asc) {
  _id,
  title,
  slug,
  price,
  priceUnit,
  images
}`);

export const getAllCategoriesQuery = defineQuery(`*[_type == "category"] | order(title asc) {
  _id,
  title,
  slug,
  description,
  image,
  parent->{
    _id,
    title,
    slug
  }
}`);

export const getTopLevelCategoriesQuery = defineQuery(`*[_type == "category" && !defined(parent)] | order(title asc) {
  _id,
  title,
  slug,
  description,
  image
}`);

export const getSubcategoriesByParentSlugQuery = defineQuery(`*[_type == "category" && parent->slug.current == $slug] | order(title asc) {
  _id,
  title,
  slug,
  description,
  image
}`);

export const getPageQuery = defineQuery(`*[_type == "page" && slug.current == $slug][0] {
  title,
  body,
  seo
}`);

export const getHomepageQuery = defineQuery(`*[_type == "homepage"][0] {
  hero {
    heading,
    subheading,
    images,
    ctaLink,
    ctaText,
    cta2Link,
    cta2Text
  },
  choosingSection {
    heading1,
    heading2,
    painPoints,
    resultText,
    image1,
    tagline,
    solutionBullets,
    image2,
    ctaText,
    ctaLink
  },
  whatWeOffer {
    intro,
    items[] { title, description }
  },
  ourSpecialty {
    intro,
    items[] { number, title, description },
    ctaText,
    ctaLink
  },
  flooringGrades {
    heading,
    subheading,
    grades[] { name, bullets }
  },
  lumberCuts {
    heading,
    intro,
    cuts[] { name, description }
  },
  limitedTimeOffer {
    heading,
    body,
    ctaText,
    ctaLink,
    cta2Text,
    cta2Link
  },
  whyLoveUs {
    heading,
    items[] { title, description }
  },
  ourWorksHeading,
  projectsPreview {
    heading,
    images
  },
  faq {
    heading,
    items[] { question, answer }
  },
  testimonialsHeading,
  testimonials[]->{
    _id,
    author,
    content,
    image,
    role
  },
  bookVisitForm {
    heading,
    subheading,
    primaryCtaText,
    secondaryCtaText
  },
  introHeading,
  introBlurb,
  categoryHighlights[]->{ _id, title, slug, description, image },
  featuredProducts[]->{ _id, title, slug, price, priceUnit, images },
  ctaSection
}`);

export const getSiteSettingsQuery = defineQuery(`*[_type == "siteSettings"][0] {
  siteName,
  logo,
  navigation[] {
    _key,
    title,
    path,
    position,
    children[] {
      _key,
      title,
      path
    }
  },
  contactInfo {
    email,
    phone,
    address,
    tollFree
  },
  footerTagline,
  businessHours,
  footerPhone,
  readyToFindHeading,
  readyToFindPrimaryText,
  readyToFindSecondaryText,
  copyrightText,
  socialLinks[] {
    _key,
    platform,
    url
  }
}`);

// Plain string query — uses $searchTerm to avoid name conflict with sanityFetch's `query` param
export const searchProductsQuery = `*[_type == "product" && visibility == "public" && (title match $searchTerm || description match $searchTerm)] | order(title asc) [0...$maxResults] {
  _id,
  title,
  slug,
  description,
  price,
  priceUnit,
  images,
  category->{
    title,
    slug
  }
}`;

export const getAllPageSlugsQuery = defineQuery(`*[_type == "page"]{ "slug": slug.current }`);

export const getCategoryBySlugQuery = defineQuery(`*[_type == "category" && slug.current == $slug][0] {
  _id,
  title,
  slug,
  description,
  image,
  parent->{
    _id,
    title,
    slug
  }
}`);

export const getProductsByCategorySlugQuery = defineQuery(`*[_type == "product" && category->slug.current == $slug && visibility != "hidden"] | order(title asc) {
  _id,
  title,
  slug,
  description,
  price,
  priceUnit,
  images,
  isFeatured
}`);

export const getAllCategorySlugsQuery = defineQuery(`*[_type == "category"]{ "slug": slug.current }`);

export const getAllProductSlugsQuery = defineQuery(`*[_type == "product" && visibility != "hidden"]{ "slug": slug.current }`);

export const getPublicProductSlugsQuery = defineQuery(`*[_type == "product" && visibility == "public"]{ "slug": slug.current }`);

export const getVisibleProductsByCategoryAndTypeQuery = defineQuery(`*[_type == "product"
  && visibility in $visibility
  && (!defined($category) || category->slug.current == $category || category->parent->slug.current == $category)
  && (!defined($type) || category->slug.current == $type)
] | order(title asc) {
  _id,
  title,
  slug,
  description,
  price,
  priceUnit,
  images,
  category->{
    _id,
    title,
    slug,
    parent->{
      _id,
      title,
      slug
    }
  },
  isFeatured
}`);

// Visibility-aware queries: accept $visibility array parameter
export const getVisibleProductsQuery = defineQuery(`*[_type == "product" && visibility in $visibility] | order(title asc) {
  _id,
  title,
  slug,
  description,
  price,
  priceUnit,
  images,
  category->{
    title,
    slug
  },
  isFeatured
}`);

export const getVisibleProductBySlugQuery = defineQuery(`*[_type == "product" && slug.current == $slug && visibility in $visibility][0] {
  _id,
  title,
  slug,
  description,
  specifications,
  specs,
  price,
  priceUnit,
  images,
  category->{
    _id,
    title,
    slug
  },
  visibility,
  isFeatured
}`);

export const getTradesPageQuery = defineQuery(`*[_type == "page" && slug.current == "trades"][0] {
  title,
  body,
  seo
}`);

export const getVisibleProductsByCategoryQuery = defineQuery(`*[_type == "product" && visibility in $visibility && category->slug.current == $category] | order(title asc) {
  _id,
  title,
  slug,
  description,
  price,
  priceUnit,
  images,
  isFeatured
}`);
