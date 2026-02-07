import Container from "@/components/layout/Container";

interface IntroBlurbProps {
  heading?: string;
  text?: string;
}

/**
 * Introductory text section for the homepage.
 * Displays an optional heading and a centered paragraph describing Hardwoodliving.
 * Renders nothing if no text is provided.
 * Uses aria-label for accessibility when no visible heading is present.
 */
export default function IntroBlurb({ heading, text }: IntroBlurbProps) {
  if (!text) {
    return null;
  }

  return (
    <section
      aria-label={heading || "About Hardwoodliving"}
      className="bg-white py-16"
    >
      <Container>
        {heading && (
          <h2 className="mb-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            {heading}
          </h2>
        )}
        <p className="mx-auto max-w-3xl text-center text-lg leading-8 text-gray-600">
          {text}
        </p>
      </Container>
    </section>
  );
}
