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

export const getCategoriesQuery = defineQuery(`*[_type == "category"] | order(title asc) {
  _id,
  title,
  slug,
  image,
  parent->{
    title,
    slug
  }
}`);

export const getPageQuery = defineQuery(`*[_type == "page" && slug.current == $slug][0] {
  title,
  body,
  seo
}`);

export const getHomepageQuery = defineQuery(`*[_type == "homepage"][0] {
  hero,
  introBlurb,
  featuredProducts[]->{
    _id,
    title,
    slug,
    price,
    priceUnit,
    images
  },
  testimonials[]->{
    _id,
    author,
    content,
    image
  }
}`);

export const getSiteSettingsQuery = defineQuery(`*[_type == "siteSettings"][0] {
  siteName,
  logo,
  navigation,
  contactInfo,
  socialLinks
}`);
