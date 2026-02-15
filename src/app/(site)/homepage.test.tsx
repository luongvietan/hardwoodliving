/**
 * Homepage (Server Component) – Integration tests using @testing-library/react.
 *
 * Because this is an async Server Component, we await the component function
 * to get the JSX, then render it. sanityFetch is mocked globally in test-setup.ts
 * and overridden per-test as needed.
 *
 * All content is CMS-driven — no hardcoded defaults.
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import Home from "./page";
import { sanityFetch } from "@/lib/sanity/fetch";

// Helper: call the async Server Component and render its output
async function renderHome() {
  const jsx = await Home();
  return render(<>{jsx}</>);
}

const fullHomepageData = {
  hero: {
    heading: "Find Your Perfect Hardfloor",
    subheading: "Discover our collection.",
    images: [{ _key: "img1", asset: { _ref: "img-hero", _type: "reference" as const } }],
    ctaLink: "/contact",
    ctaText: "Book Visit",
    cta2Link: "/contact",
    cta2Text: "Request Quote",
  },
  choosingSection: {
    heading1: "Choosing the Right Floor",
    heading2: "Doesn't Have to Be Hard",
    painPoints: ["So many options", "Uncertain about quality"],
    tagline: "See It. Choose Confidently.",
    solutionBullets: ["Visit showroom", "Personalized guidance"],
  },
  ourSpecialty: {
    intro: "Full-service flooring solutions",
    items: [
      { number: "01", title: "Supply", description: "Quality materials" },
      { number: "02", title: "Installation", description: "Expert install" },
    ],
  },
  whyLoveUs: {
    heading: "Why homeowners trust us",
    items: [
      { title: "Premium Quality", description: "Top-grade materials" },
    ],
  },
  limitedTimeOffer: {
    heading: "Limited Time Offer",
    body: "Save on selected floors",
    ctaText: "Claim Offer",
    ctaLink: "/contact",
  },
  projectsPreview: {
    heading: "Our Projects",
    images: [{ asset: { _ref: "img-p1", _type: "reference" as const } }],
  },
  faq: {
    heading: "Frequently Asked Questions",
    items: [
      { question: "How long does installation take?", answer: "Typically 1-3 days." },
    ],
  },
  testimonialsHeading: "What Our Customers Are Saying",
  testimonials: [
    {
      _id: "t1",
      author: "Jane Doe",
      content: "Absolutely beautiful flooring!",
      image: { asset: { _ref: "img-t1", _type: "reference" as const } },
    },
  ],
  bookVisitForm: {
    heading: "Book Your Showroom Visit",
    subheading: "Schedule a visit today",
    primaryCtaText: "Book Visit",
    secondaryCtaText: "Request Quote",
  },
};

beforeEach(() => {
  vi.mocked(sanityFetch).mockReset();
});

describe("Homepage", () => {
  // ── Full data rendering ──────────────────────────────────────────────

  it("renders all homepage sections when data is available", async () => {
    vi.mocked(sanityFetch)
      .mockResolvedValueOnce(fullHomepageData)  // getHomepageQuery
      .mockResolvedValueOnce({ siteName: "Hardwood Living" }); // getSiteSettingsQuery
    await renderHome();

    // Hero
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Find Your Perfect Hardfloor");
    expect(screen.getByText("Book Visit")).toBeInTheDocument();

    // Pain Points + Solution
    expect(screen.getByText(/Choosing the Right Floor/)).toBeInTheDocument();
    expect(screen.getByText(/See It. Choose Confidently/)).toBeInTheDocument();

    // Core Collections (hardcoded from url-structure)
    expect(screen.getByText("Core Collections")).toBeInTheDocument();
    expect(screen.getByText("Hardwood")).toBeInTheDocument();
    expect(screen.getByText("Laminate")).toBeInTheDocument();

    // Our Specialty
    expect(screen.getByText("Our Specialty")).toBeInTheDocument();
    expect(screen.getByText("Supply")).toBeInTheDocument();

    // Why Love Us
    expect(screen.getByText("Why Homeowners & Designers Love Us")).toBeInTheDocument();
    expect(screen.getByText("Premium Quality")).toBeInTheDocument();

    // Limited Offer
    expect(screen.getByText("Limited Time Offer")).toBeInTheDocument();
    expect(screen.getByText("Claim Offer")).toBeInTheDocument();

    // Testimonials
    expect(screen.getByText("What Our Customers Are Saying")).toBeInTheDocument();
    expect(screen.getByText("Absolutely beautiful flooring!")).toBeInTheDocument();

    // FAQ
    expect(screen.getByText("Frequently Asked Questions")).toBeInTheDocument();

    // Booking Form
    expect(screen.getByText("Book Your Showroom Visit")).toBeInTheDocument();
  });

  // ── Graceful degradation (no data / fetch error) ─────────────────────

  it("renders gracefully when sanityFetch returns null", async () => {
    vi.mocked(sanityFetch)
      .mockResolvedValueOnce(null)  // getHomepageQuery
      .mockResolvedValueOnce(null); // getSiteSettingsQuery
    await renderHome();

    // Core Collections always renders (from url-structure)
    expect(screen.getByText("Core Collections")).toBeInTheDocument();
    // Testimonials section only renders when testimonials exist
    expect(screen.queryByText("Absolutely beautiful flooring!")).not.toBeInTheDocument();
  });

  it("renders gracefully when sanityFetch throws an error", async () => {
    vi.mocked(sanityFetch)
      .mockRejectedValueOnce(new Error("Network error"))
      .mockResolvedValueOnce(null);
    await renderHome();

    // Core Collections still renders (static content)
    expect(screen.getByText("Core Collections")).toBeInTheDocument();
  });

  // ── Hero section integration ─────────────────────────────────────────

  it("passes CMS hero data to HeroSection", async () => {
    vi.mocked(sanityFetch)
      .mockResolvedValueOnce(fullHomepageData)
      .mockResolvedValueOnce({ siteName: "Hardwood Living" });
    await renderHome();

    const ctaLink = screen.getByText("Book Visit").closest("a");
    expect(ctaLink).toHaveAttribute("href", "/contact");
  });

  // ── Core Collections links ────────────────────────────────────────────

  it("links core collections to /collections/*", async () => {
    vi.mocked(sanityFetch)
      .mockResolvedValueOnce(fullHomepageData)
      .mockResolvedValueOnce({ siteName: "Hardwood Living" });
    await renderHome();

    const hardwoodLink = screen.getByRole("link", { name: /Hardwood/i });
    expect(hardwoodLink).toHaveAttribute("href", "/collections/hardwood");
  });

  // ── Partial data rendering ───────────────────────────────────────────

  it("renders hero and core collections when minimal data", async () => {
    vi.mocked(sanityFetch)
      .mockResolvedValueOnce({
        hero: { heading: "Welcome", subheading: "Hello world" },
      })
      .mockResolvedValueOnce({ siteName: "Hardwood Living" });
    await renderHome();

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Welcome");
    expect(screen.getByText("Hello world")).toBeInTheDocument();
    expect(screen.getByText("Core Collections")).toBeInTheDocument();
    expect(screen.queryByText("Absolutely beautiful flooring!")).not.toBeInTheDocument();
  });
});
