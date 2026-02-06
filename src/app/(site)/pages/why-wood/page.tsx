import type { Metadata } from 'next';
import Container from '@/components/layout/Container';

export const metadata: Metadata = {
  title: 'Why Wood?',
  description: 'Discover why hardwood is the premier choice for flooring and cabinetry.',
};

export default function WhyWoodPage() {
  return (
    <Container className="py-16">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900">Why Wood?</h1>
      <p className="mt-4 text-lg text-gray-600">
        Learn about the benefits and beauty of hardwood. Content coming soon.
      </p>
    </Container>
  );
}
