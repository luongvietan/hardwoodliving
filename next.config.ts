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
  // TODO: Add Content-Security-Policy headers (Architecture requirement)
  // CSP should allow Sanity Studio at /admin, Sanity CDN for images,
  // and Supabase API for data operations.
  // Reference: Architecture doc → Security Measures
};

export default nextConfig;
