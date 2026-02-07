/**
 * PortableText – Real rendering tests using @testing-library/react + jsdom.
 * Tests that the PortableText component correctly renders Portable Text blocks
 * with custom component overrides for headings, paragraphs, lists, links, and images.
 *
 * Mocks for next/image and @/lib/sanity/image are provided by test-setup.ts.
 */
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import PortableText from "./PortableText";

// ── Portable Text block helpers ─────────────────────────────────────────────

function makeBlock(
  style: string,
  text: string,
  key = "k1",
  extra: Record<string, unknown> = {},
) {
  return {
    _type: "block",
    _key: key,
    style,
    children: [{ _type: "span", _key: `${key}-span`, text, marks: [] }],
    markDefs: [],
    ...extra,
  };
}

function makeLinkBlock(
  text: string,
  href: string,
  key = "link-block",
) {
  const markKey = `${key}-mark`;
  return {
    _type: "block",
    _key: key,
    style: "normal",
    children: [
      { _type: "span", _key: `${key}-span`, text, marks: [markKey] },
    ],
    markDefs: [{ _key: markKey, _type: "link", href }],
  };
}

function makeImageBlock(
  ref: string,
  alt = "",
  key = "img-block",
) {
  return {
    _type: "image",
    _key: key,
    asset: { _ref: ref, _type: "reference" },
    alt,
  };
}

function makeListItem(text: string, key = "li1") {
  return {
    _type: "block",
    _key: key,
    style: "normal",
    listItem: "bullet",
    level: 1,
    children: [{ _type: "span", _key: `${key}-span`, text, marks: [] }],
    markDefs: [],
  };
}

// ── Tests ───────────────────────────────────────────────────────────────────

describe("PortableText", () => {
  // ── Null / empty handling ──────────────────────────────────────────────

  it("renders nothing when value is null", () => {
    const { container } = render(<PortableText value={null} />);
    expect(container.innerHTML).toBe("");
  });

  it("renders nothing when value is undefined", () => {
    const { container } = render(<PortableText value={undefined} />);
    expect(container.innerHTML).toBe("");
  });

  // ── Paragraphs ─────────────────────────────────────────────────────────

  it("renders a paragraph with correct text", () => {
    render(<PortableText value={[makeBlock("normal", "Hello world")]} />);
    expect(screen.getByText("Hello world")).toBeInTheDocument();
  });

  it("renders paragraph with appropriate styling", () => {
    render(<PortableText value={[makeBlock("normal", "Styled paragraph")]} />);
    const p = screen.getByText("Styled paragraph");
    expect(p.tagName).toBe("P");
    expect(p.className).toMatch(/text-gray-700/);
  });

  // ── Headings ───────────────────────────────────────────────────────────

  it("renders h1 headings", () => {
    render(<PortableText value={[makeBlock("h1", "Main Title")]} />);
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveTextContent("Main Title");
  });

  it("renders h2 headings", () => {
    render(<PortableText value={[makeBlock("h2", "Section Title")]} />);
    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading).toHaveTextContent("Section Title");
  });

  it("renders h3 headings", () => {
    render(<PortableText value={[makeBlock("h3", "Subsection Title")]} />);
    const heading = screen.getByRole("heading", { level: 3 });
    expect(heading).toHaveTextContent("Subsection Title");
  });

  // ── Blockquote ─────────────────────────────────────────────────────────

  it("renders blockquote content", () => {
    render(
      <PortableText value={[makeBlock("blockquote", "A famous quote")]} />,
    );
    const blockquote = screen.getByText("A famous quote").closest("blockquote");
    expect(blockquote).toBeInTheDocument();
    expect(blockquote?.className).toMatch(/border-amber-300/);
  });

  // ── Bullet list ────────────────────────────────────────────────────────

  it("renders a bullet list", () => {
    render(
      <PortableText
        value={[
          makeListItem("First item", "li1"),
          makeListItem("Second item", "li2"),
        ]}
      />,
    );
    expect(screen.getByText("First item")).toBeInTheDocument();
    expect(screen.getByText("Second item")).toBeInTheDocument();
    // Should be in a <ul>
    const list = screen.getByText("First item").closest("ul");
    expect(list).toBeInTheDocument();
  });

  // ── Links ──────────────────────────────────────────────────────────────

  it("renders links with correct href", () => {
    render(
      <PortableText
        value={[makeLinkBlock("Visit us", "https://example.com")]}
      />,
    );
    const link = screen.getByText("Visit us");
    expect(link.tagName).toBe("A");
    expect(link).toHaveAttribute("href", "https://example.com");
  });

  it("renders links with target=_blank and rel=noopener", () => {
    render(
      <PortableText
        value={[makeLinkBlock("External", "https://external.com")]}
      />,
    );
    const link = screen.getByText("External");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("renders links with amber styling", () => {
    render(
      <PortableText
        value={[makeLinkBlock("Styled link", "https://example.com")]}
      />,
    );
    const link = screen.getByText("Styled link");
    expect(link.className).toMatch(/text-amber-900/);
  });

  // ── Images ─────────────────────────────────────────────────────────────

  it("renders images with alt text", () => {
    render(
      <PortableText
        value={[makeImageBlock("image-abc-800x600-jpg", "Wood floor")]}
      />,
    );
    const img = screen.getByTestId("next-image");
    expect(img).toHaveAttribute("alt", "Wood floor");
  });

  it("renders images inside a figure element", () => {
    render(
      <PortableText
        value={[makeImageBlock("image-def-800x600-jpg", "Gallery")]}
      />,
    );
    const img = screen.getByTestId("next-image");
    const figure = img.closest("figure");
    expect(figure).toBeInTheDocument();
  });

  it("does not render image when asset ref is missing", () => {
    render(
      <PortableText
        value={[{ _type: "image", _key: "no-asset" }]}
      />,
    );
    expect(screen.queryByTestId("next-image")).not.toBeInTheDocument();
  });

  // ── Mixed content ──────────────────────────────────────────────────────

  it("renders mixed content blocks correctly", () => {
    render(
      <PortableText
        value={[
          makeBlock("h2", "Care Guide", "h"),
          makeBlock("normal", "Keep your floors clean.", "p"),
          makeListItem("Sweep daily", "li"),
        ]}
      />,
    );
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
      "Care Guide",
    );
    expect(screen.getByText("Keep your floors clean.")).toBeInTheDocument();
    expect(screen.getByText("Sweep daily")).toBeInTheDocument();
  });
});
