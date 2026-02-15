import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: "/images/**",
      },
    ],
  },
  // 301 Redirects: Map legacy URLs to new site structure.
  // Add more redirects as legacy URL list is provided by client.
  async redirects() {
    return [
      // Example legacy redirects (expand with actual legacy URLs from client)
      {
        source: "/index.html",
        destination: "/",
        permanent: true,
      },
      {
        source: "/home",
        destination: "/",
        permanent: true,
      },
      {
        source: "/contact-us",
        destination: "/contact",
        permanent: true,
      },
      {
        source: "/catalogue",
        destination: "/products",
        permanent: true,
      },
      {
        source: "/catalog",
        destination: "/products",
        permanent: true,
      },
      {
        source: "/trade",
        destination: "/trades",
        permanent: true,
      },
      {
        source: "/trade-program",
        destination: "/trades",
        permanent: true,
      },
      // LVP alias → canonical
      {
        source: "/collections/lvp",
        destination: "/collections/luxury-vinyl-plank",
        permanent: true,
      },
      {
        source: "/collections/lvp/:path*",
        destination: "/collections/luxury-vinyl-plank/:path*",
        permanent: true,
      },
      // Selecting Guide → Wood Guide (SEO rename)
      {
        source: "/selecting-guide",
        destination: "/wood-guide",
        permanent: true,
      },
      {
        source: "/selecting-guide/:path*",
        destination: "/wood-guide/:path*",
        permanent: true,
      },
    ];
  },
  // TODO: Add Content-Security-Policy headers (Architecture requirement)
  // CSP should allow Sanity Studio at /admin, Sanity CDN for images,
  // and Supabase API for data operations.
  // Reference: Architecture doc → Security Measures
};

export default nextConfig;
