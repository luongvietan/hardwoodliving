/**
 * ContentPage (Server Component) – Integration tests for dynamic CMS-editable pages.
 *
 * Tests the pages/[slug] route that fetches Sanity page data, renders Portable
 * Text body content, generates SEO metadata, and handles 404 for missing slugs.
 *
 * Mocks for sanityFetch, next/navigation (notFound), next/image, and
 * @/lib/sanity/image are provided by test-setup.ts.
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import ContentPage, { generateMetadata, generateStaticParams } from "./page";
import { sanityFetch } from "@/lib/sanity/fetch";

// ── Helper: render async Server Component ────────────────────────────────────

async function renderContentPage(slug: string) {
  const jsx = await ContentPage({ params: Promise.resolve({ slug }) });
  return render(<>{jsx}</>);
}

// ── Test data ────────────────────────────────────────────────────────────────

const careGuidePage = {
  title: "Care Guide",
  body: [
    {
      _type: "block",
      _key: "b1",
      style: "normal",
      children: [
        { _type: "span", _key: "s1", text: "Keep your hardwood floors beautiful.", marks: [] },
      ],
      markDefs: [],
    },
  ],
  seo: {
    metaTitle: "Hardwood Care Guide",
    metaDescription: "Learn how to maintain your hardwood floors",
  },
};

const pageWithoutBody = {
  title: "Coming Soon Page",
  body: null,
  seo: null,
};

const pageWithoutSeo = {
  title: "Visit Us",
  body: [
    {
      _type: "block",
      _key: "b2",
      style: "h2",
      children: [
        { _type: "span", _key: "s2", text: "Our Showroom", marks: [] },
      ],
      markDefs: [],
    },
  ],
  seo: null,
};

// ── Setup ────────────────────────────────────────────────────────────────────

beforeEach(() => {
  vi.mocked(sanityFetch).mockReset();
});

// ── Tests ────────────────────────────────────────────────────────────────────

describe("ContentPage", () => {
  // ── Page rendering with full data ────────────────────────────────────────

  it("renders the page title as an h1", async () => {
    vi.mocked(sanityFetch).mockResolvedValue(careGuidePage);
    await renderContentPage("care-guide");

    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveTextContent("Care Guide");
  });

  it("renders the page body content using Portable Text", async () => {
    vi.mocked(sanityFetch).mockResolvedValue(careGuidePage);
    await renderContentPage("care-guide");

    expect(
      screen.getByText("Keep your hardwood floors beautiful."),
    ).toBeInTheDocument();
  });

  it("renders body content inside a prose-content wrapper", async () => {
    vi.mocked(sanityFetch).mockResolvedValue(careGuidePage);
    const { container } = await renderContentPage("care-guide");

    const proseDiv = container.querySelector(".prose-content");
    expect(proseDiv).toBeInTheDocument();
  });

  // ── Page without body ───────────────────────────────────────────────────

  it("shows 'Content coming soon' when body is null", async () => {
    vi.mocked(sanityFetch).mockResolvedValue(pageWithoutBody);
    await renderContentPage("coming-soon");

    expect(screen.getByText("Content coming soon.")).toBeInTheDocument();
  });

  it("still renders the title when body is null", async () => {
    vi.mocked(sanityFetch).mockResolvedValue(pageWithoutBody);
    await renderContentPage("coming-soon");

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Coming Soon Page",
    );
  });

  // ── 404 handling ────────────────────────────────────────────────────────

  it("calls notFound() when page data is null (404)", async () => {
    vi.mocked(sanityFetch).mockResolvedValue(null);

    await expect(
      renderContentPage("nonexistent-page"),
    ).rejects.toThrow("NEXT_NOT_FOUND");
  });

  // ── Article structure ──────────────────────────────────────────────────

  it("wraps content in an <article> element", async () => {
    vi.mocked(sanityFetch).mockResolvedValue(careGuidePage);
    const { container } = await renderContentPage("care-guide");

    const article = container.querySelector("article");
    expect(article).toBeInTheDocument();
  });

  it("constrains article width with max-w-3xl", async () => {
    vi.mocked(sanityFetch).mockResolvedValue(careGuidePage);
    const { container } = await renderContentPage("care-guide");

    const article = container.querySelector("article");
    expect(article?.className).toMatch(/max-w-3xl/);
  });

  // ── Renders multiple block types ──────────────────────────────────────

  it("renders heading blocks within the body", async () => {
    vi.mocked(sanityFetch).mockResolvedValue(pageWithoutSeo);
    await renderContentPage("visit-us");

    // h1 = page title, h2 = body content
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Visit Us");
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("Our Showroom");
  });
});

// ── generateMetadata ────────────────────────────────────────────────────────

describe("generateMetadata", () => {
  beforeEach(() => {
    vi.mocked(sanityFetch).mockReset();
  });

  it("returns SEO meta title from CMS", async () => {
    vi.mocked(sanityFetch).mockResolvedValue(careGuidePage);
    const metadata = await generateMetadata({
      params: Promise.resolve({ slug: "care-guide" }),
    });

    expect(metadata.title).toBe("Hardwood Care Guide");
  });

  it("returns SEO meta description from CMS", async () => {
    vi.mocked(sanityFetch).mockResolvedValue(careGuidePage);
    const metadata = await generateMetadata({
      params: Promise.resolve({ slug: "care-guide" }),
    });

    expect(metadata.description).toBe(
      "Learn how to maintain your hardwood floors",
    );
  });

  it("falls back to page title when seo.metaTitle is missing", async () => {
    vi.mocked(sanityFetch).mockResolvedValue(pageWithoutSeo);
    const metadata = await generateMetadata({
      params: Promise.resolve({ slug: "visit-us" }),
    });

    expect(metadata.title).toBe("Visit Us");
  });

  it("returns 'Page Not Found' when page is null", async () => {
    vi.mocked(sanityFetch).mockResolvedValue(null);
    const metadata = await generateMetadata({
      params: Promise.resolve({ slug: "nonexistent" }),
    });

    expect(metadata.title).toBe("Page Not Found");
  });
});

// ── generateStaticParams ────────────────────────────────────────────────────

describe("generateStaticParams", () => {
  beforeEach(() => {
    vi.mocked(sanityFetch).mockReset();
  });

  it("returns slug params for all pages", async () => {
    vi.mocked(sanityFetch).mockResolvedValue([
      { slug: "care-guide" },
      { slug: "visit-us" },
      { slug: "why-wood" },
    ]);

    const params = await generateStaticParams();

    expect(params).toEqual([
      { slug: "care-guide" },
      { slug: "visit-us" },
      { slug: "why-wood" },
    ]);
  });

  it("returns empty array when no pages exist", async () => {
    vi.mocked(sanityFetch).mockResolvedValue([]);

    const params = await generateStaticParams();

    expect(params).toEqual([]);
  });
});
