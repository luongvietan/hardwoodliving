import { PortableText as PortableTextReact } from "@portabletext/react";
import Image from "next/image";
import { urlFor } from "@/lib/sanity/image";
import type { SanityImageValue } from "@/lib/sanity/types";

type PortableTextImageValue = SanityImageValue & { alt?: string };

const components = {
  types: {
    image: ({ value }: { value: PortableTextImageValue }) => {
      if (!value?.asset?._ref) return null;
      return (
        <figure className="my-8">
          <Image
            src={urlFor(value).width(800).auto("format").url()}
            alt={value.alt || ""}
            width={800}
            height={450}
            className="rounded-lg"
          />
        </figure>
      );
    },
  },
  marks: {
    link: ({
      children,
      value,
    }: {
      children: React.ReactNode;
      value?: { href?: string };
    }) => {
      const href = value?.href || "";
      const isExternal = href.startsWith("http") || href.startsWith("//");
      return (
        <a
          href={href}
          {...(isExternal
            ? { target: "_blank", rel: "noopener noreferrer" }
            : {})}
          className="text-amber-900 underline hover:text-amber-700"
        >
          {children}
        </a>
      );
    },
  },
  block: {
    h1: ({ children }: { children?: React.ReactNode }) => (
      <h1 className="mb-4 mt-8 text-3xl font-bold text-gray-900">
        {children}
      </h1>
    ),
    h2: ({ children }: { children?: React.ReactNode }) => (
      <h2 className="mb-3 mt-6 text-2xl font-bold text-gray-900">
        {children}
      </h2>
    ),
    h3: ({ children }: { children?: React.ReactNode }) => (
      <h3 className="mb-2 mt-4 text-xl font-semibold text-gray-900">
        {children}
      </h3>
    ),
    normal: ({ children }: { children?: React.ReactNode }) => (
      <p className="mb-4 leading-7 text-gray-700">{children}</p>
    ),
    blockquote: ({ children }: { children?: React.ReactNode }) => (
      <blockquote className="my-6 border-l-4 border-amber-300 pl-4 italic text-gray-600">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }: { children?: React.ReactNode }) => (
      <ul className="mb-4 ml-6 list-disc space-y-1 text-gray-700">
        {children}
      </ul>
    ),
  },
};

interface PortableTextProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Portable Text blocks from Sanity have dynamic structure; library requires its own internal types
  value: any;
}

export default function PortableText({ value }: PortableTextProps) {
  if (!value) return null;
  return <PortableTextReact value={value} components={components} />;
}
