import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Hardwood Living | Premium Hardwood Flooring in Canada",
    template: "%s | Hardwood Living",
  },
  description:
    "Discover premium hardwood flooring, engineered wood, and luxury vinyl options for residential and commercial spaces across Canada. Visit our Vancouver showroom.",
  keywords: [
    "hardwood flooring Canada",
    "engineered hardwood flooring",
    "luxury vinyl plank",
    "laminate flooring",
    "hardwood flooring Vancouver",
    "flooring showroom Vancouver",
    "hardwood flooring installation",
    "premium flooring",
    "wood flooring",
    "flooring store BC",
  ],
  authors: [{ name: "Hardwood Living" }],
  creator: "Hardwood Living",
  publisher: "Hardwood Living",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_CA",
    url: SITE_URL,
    siteName: "Hardwood Living",
    title: "Hardwood Living | Premium Hardwood Flooring in Canada",
    description:
      "Discover premium hardwood flooring, engineered wood, and luxury vinyl options for residential and commercial spaces across Canada. Visit our Vancouver showroom.",
    images: [
      {
        url: `${SITE_URL}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "Hardwood Living – Premium Hardwood Flooring in Canada",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hardwood Living | Premium Hardwood Flooring in Canada",
    description:
      "Premium hardwood flooring, engineered wood, and luxury vinyl for homes and businesses across Canada.",
    images: [`${SITE_URL}/og-image.jpg`],
  },
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" style={{ colorScheme: "light" }}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} ${inter.variable} antialiased bg-white text-gray-900`}
      >
        {children}
      </body>
    </html>
  );
}
