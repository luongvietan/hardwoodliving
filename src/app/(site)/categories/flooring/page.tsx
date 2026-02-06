import type { Metadata } from 'next';
import Container from '@/components/layout/Container';

export const metadata: Metadata = {
  title: 'Flooring',
  description: 'Browse our premium hardwood flooring collection.',
};

export default function FlooringPage() {
  return (
    <Container className="py-16">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900">Flooring</h1>
      <p className="mt-4 text-lg text-gray-600">
        Our premium hardwood flooring collection is coming soon. Check back for updates.
      </p>
    </Container>
  );
}
