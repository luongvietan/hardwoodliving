/**
 * TradesPage (Server Component) – Integration tests for the Trades landing page.
 *
 * Tests the /trades route that fetches Sanity page data for trade information,
 * renders CMS content or default benefits, provides Register/Login CTAs,
 * and generates SEO metadata.
 *
 * Mocks for sanityFetch, next/navigation, next/image, and
 * @/lib/sanity/image are provided by test-setup.ts.
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import TradesPage, { generateMetadata } from "./page";
import { sanityFetch } from "@/lib/sanity/fetch";

// ── Helper: render async Server Component ────────────────────────────────────

async function renderTradesPage() {
  const jsx = await TradesPage();
  return render(<>{jsx}</>);
}

// ── Test data ────────────────────────────────────────────────────────────────

const cmsTradesPage = {
  title: "Trade Professionals",
  body: [
    {
      _type: "block",
      _key: "b1",
      style: "normal",
      children: [
        {
          _type: "span",
          _key: "s1",
          text: "Welcome to our exclusive Trade Program.",
          marks: [],
        },
      ],
      markDefs: [],
    },
  ],
  seo: {
    metaTitle: "Trade Program | Hardwood Living",
    metaDescription: "Exclusive trade program for hardwood professionals.",
  },
};

const cmsPageNoBody = {
  title: "Trade Info",
  body: null,
  seo: null,
};

// ── Setup ────────────────────────────────────────────────────────────────────

beforeEach(() => {
  vi.mocked(sanityFetch).mockReset();
});

// ── Tests ────────────────────────────────────────────────────────────────────

describe("TradesPage", () => {
  // ── Default rendering (no CMS data) ──────────────────────────────────────

  it("renders default title 'Trade Program' when no CMS data", async () => {
    vi.mocked(sanityFetch).mockResolvedValue(null);
    await renderTradesPage();

    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveTextContent("Trade Program");
  });

  it("renders default benefits section when no CMS body content", async () => {
    vi.mocked(sanityFetch).mockResolvedValue(null);
    await renderTradesPage();

    expect(screen.getByText("Trade Program Benefits")).toBeInTheDocument();
    expect(screen.getByText("Wholesale Pricing")).toBeInTheDocument();
    expect(screen.getByText("Dedicated Support")).toBeInTheDocument();
    expect(screen.getByText("Bulk Ordering")).toBeInTheDocument();
    expect(screen.getByText("Extended Product Range")).toBeInTheDocument();
  });

  it("renders default intro paragraph when no CMS body", async () => {
    vi.mocked(sanityFetch).mockResolvedValue(null);
    await renderTradesPage();

    expect(
      screen.getByText(/Partner with Hardwood Living/),
    ).toBeInTheDocument();
  });

  // ── CMS content rendering ────────────────────────────────────────────────

  it("renders CMS title from Sanity data", async () => {
    vi.mocked(sanityFetch).mockResolvedValue(cmsTradesPage);
    await renderTradesPage();

    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveTextContent("Trade Professionals");
  });

  it("renders CMS body content via Portable Text", async () => {
    vi.mocked(sanityFetch).mockResolvedValue(cmsTradesPage);
    await renderTradesPage();

    expect(
      screen.getByText("Welcome to our exclusive Trade Program."),
    ).toBeInTheDocument();
  });

  it("does not render default benefits when CMS body is present", async () => {
    vi.mocked(sanityFetch).mockResolvedValue(cmsTradesPage);
    await renderTradesPage();

    expect(
      screen.queryByText("Trade Program Benefits"),
    ).not.toBeInTheDocument();
  });

  // ── CTA buttons ──────────────────────────────────────────────────────────

  it("renders Register for Trade Account CTA link", async () => {
    vi.mocked(sanityFetch).mockResolvedValue(null);
    await renderTradesPage();

    const registerLink = screen.getByRole("link", {
      name: /Register for Trade Account/,
    });
    expect(registerLink).toBeInTheDocument();
    expect(registerLink).toHaveAttribute("href", "/trades/register");
  });

  it("renders Log In CTA link", async () => {
    vi.mocked(sanityFetch).mockResolvedValue(null);
    await renderTradesPage();

    const loginLink = screen.getByRole("link", { name: /Log In/ });
    expect(loginLink).toBeInTheDocument();
    expect(loginLink).toHaveAttribute("href", "/trades/login");
  });

  it("renders 'Get Started Today' heading", async () => {
    vi.mocked(sanityFetch).mockResolvedValue(null);
    await renderTradesPage();

    expect(screen.getByText("Get Started Today")).toBeInTheDocument();
  });

  // ── CMS page with title but no body shows defaults ───────────────────────

  it("renders CMS title but shows default benefits when body is null", async () => {
    vi.mocked(sanityFetch).mockResolvedValue(cmsPageNoBody);
    await renderTradesPage();

    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveTextContent("Trade Info");
    expect(screen.getByText("Trade Program Benefits")).toBeInTheDocument();
  });
});

// ── generateMetadata ────────────────────────────────────────────────────────

describe("generateMetadata", () => {
  beforeEach(() => {
    vi.mocked(sanityFetch).mockReset();
  });

  it("returns CMS SEO meta title when available", async () => {
    vi.mocked(sanityFetch).mockResolvedValue(cmsTradesPage);
    const metadata = await generateMetadata();

    expect(metadata.title).toBe("Trade Program | Hardwood Living");
  });

  it("returns CMS SEO meta description when available", async () => {
    vi.mocked(sanityFetch).mockResolvedValue(cmsTradesPage);
    const metadata = await generateMetadata();

    expect(metadata.description).toBe(
      "Exclusive trade program for hardwood professionals.",
    );
  });

  it("falls back to default title when no CMS data", async () => {
    vi.mocked(sanityFetch).mockResolvedValue(null);
    const metadata = await generateMetadata();

    expect(metadata.title).toBe("Trade Program");
  });

  it("falls back to CMS page title when SEO title is missing", async () => {
    vi.mocked(sanityFetch).mockResolvedValue(cmsPageNoBody);
    const metadata = await generateMetadata();

    expect(metadata.title).toBe("Trade Info");
  });

  it("provides default meta description when no CMS data", async () => {
    vi.mocked(sanityFetch).mockResolvedValue(null);
    const metadata = await generateMetadata();

    expect(metadata.description).toMatch(/Trade Program/);
  });
});
