/**
 * ContentPage (Server Component) – Integration tests for path-based CMS-editable pages.
 *
 * Tests the pages/[[...path]] route: path resolution, Portable Text body,
 * SEO metadata, breadcrumbs, and 404 for missing paths.
 *
 * Mocks for sanityFetch, next/navigation (notFound), next/image, and
 * @/lib/sanity/image are provided by test-setup.ts.
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import ContentPage, { generateMetadata, generateStaticParams } from "./page";
import { sanityFetch } from "@/lib/sanity/fetch";

async function renderContentPage(path: string[]) {
  const jsx = await ContentPage({ params: Promise.resolve({ path }) });
  return render(<>{jsx}</>);
}

const allPagesForPath = [
  { _id: "id-care-guide", title: "Care Guide", slug: "care-guide", parentRef: null },
  { _id: "id-visit-us", title: "Visit Us", slug: "visit-us", parentRef: null },
  { _id: "id-why-wood", title: "Why Wood", slug: "why-wood", parentRef: null },
];

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
  slug: { current: "care-guide" },
};

const pageWithoutBody = {
  title: "Coming Soon Page",
  body: null,
  seo: null,
  slug: { current: "coming-soon" },
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
  slug: { current: "visit-us" },
};

beforeEach(() => {
  vi.mocked(sanityFetch).mockReset();
});

describe("ContentPage", () => {
  it("renders the page title as an h1", async () => {
    vi.mocked(sanityFetch)
      .mockResolvedValueOnce(allPagesForPath)
      .mockResolvedValueOnce(careGuidePage);
    await renderContentPage(["care-guide"]);

    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveTextContent("Care Guide");
  });

  it("renders the page body content using Portable Text", async () => {
    vi.mocked(sanityFetch)
      .mockResolvedValueOnce(allPagesForPath)
      .mockResolvedValueOnce(careGuidePage);
    await renderContentPage(["care-guide"]);

    expect(
      screen.getByText("Keep your hardwood floors beautiful."),
    ).toBeInTheDocument();
  });

  it("renders body content inside a prose-content wrapper", async () => {
    vi.mocked(sanityFetch)
      .mockResolvedValueOnce(allPagesForPath)
      .mockResolvedValueOnce(careGuidePage);
    const { container } = await renderContentPage(["care-guide"]);

    const proseDiv = container.querySelector(".prose-content");
    expect(proseDiv).toBeInTheDocument();
  });

  it("shows 'Content coming soon' when body is null", async () => {
    vi.mocked(sanityFetch)
      .mockResolvedValueOnce(allPagesForPath)
      .mockResolvedValueOnce(pageWithoutBody);
    await renderContentPage(["coming-soon"]);

    expect(screen.getByText("Content coming soon.")).toBeInTheDocument();
  });

  it("still renders the title when body is null", async () => {
    vi.mocked(sanityFetch)
      .mockResolvedValueOnce(allPagesForPath)
      .mockResolvedValueOnce(pageWithoutBody);
    await renderContentPage(["coming-soon"]);

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Coming Soon Page",
    );
  });

  it("calls notFound() when path does not resolve to a page", async () => {
    vi.mocked(sanityFetch).mockResolvedValueOnce(allPagesForPath);

    await expect(
      renderContentPage(["nonexistent-page"]),
    ).rejects.toThrow("NEXT_NOT_FOUND");
  });

  it("wraps content in an <article> element", async () => {
    vi.mocked(sanityFetch)
      .mockResolvedValueOnce(allPagesForPath)
      .mockResolvedValueOnce(careGuidePage);
    const { container } = await renderContentPage(["care-guide"]);

    const article = container.querySelector("article");
    expect(article).toBeInTheDocument();
  });

  it("renders heading blocks within the body", async () => {
    vi.mocked(sanityFetch)
      .mockResolvedValueOnce(allPagesForPath)
      .mockResolvedValueOnce(pageWithoutSeo);
    await renderContentPage(["visit-us"]);

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Visit Us");
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("Our Showroom");
  });

  it("shows Pages index when path is empty", async () => {
    vi.mocked(sanityFetch).mockResolvedValueOnce(allPagesForPath);
    await renderContentPage([]);

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Pages");
    expect(screen.getByText("Care Guide")).toBeInTheDocument();
  });
});

describe("generateMetadata", () => {
  beforeEach(() => {
    vi.mocked(sanityFetch).mockReset();
  });

  it("returns SEO meta title from CMS", async () => {
    vi.mocked(sanityFetch)
      .mockResolvedValueOnce(allPagesForPath)
      .mockResolvedValueOnce(careGuidePage);
    const metadata = await generateMetadata({
      params: Promise.resolve({ path: ["care-guide"] }),
    });

    expect(metadata.title).toBe("Hardwood Care Guide");
  });

  it("falls back to page title when seo.metaTitle is missing", async () => {
    vi.mocked(sanityFetch)
      .mockResolvedValueOnce(allPagesForPath)
      .mockResolvedValueOnce(pageWithoutSeo);
    const metadata = await generateMetadata({
      params: Promise.resolve({ path: ["visit-us"] }),
    });

    expect(metadata.title).toBe("Visit Us");
  });

  it("returns 'Page Not Found' when path does not resolve", async () => {
    vi.mocked(sanityFetch).mockResolvedValueOnce(allPagesForPath);
    const metadata = await generateMetadata({
      params: Promise.resolve({ path: ["nonexistent"] }),
    });

    expect(metadata.title).toBe("Page Not Found");
  });
});

describe("generateStaticParams", () => {
  beforeEach(() => {
    vi.mocked(sanityFetch).mockReset();
  });

  it("returns path params for all pages including root", async () => {
    vi.mocked(sanityFetch).mockResolvedValue(allPagesForPath);

    const params = await generateStaticParams();

    expect(params).toContainEqual({ path: [] });
    expect(params).toContainEqual({ path: ["care-guide"] });
    expect(params).toContainEqual({ path: ["visit-us"] });
    expect(params).toContainEqual({ path: ["why-wood"] });
  });

  it("returns only root when no pages exist", async () => {
    vi.mocked(sanityFetch).mockResolvedValue([]);

    const params = await generateStaticParams();

    expect(params).toEqual([{ path: [] }]);
  });
});
