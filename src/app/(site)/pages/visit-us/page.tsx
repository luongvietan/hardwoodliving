import type { Metadata } from 'next';
import Container from '@/components/layout/Container';

export const metadata: Metadata = {
  title: 'Visit Us',
  description: 'Visit our showroom to experience premium hardwood in person.',
};

export default function VisitUsPage() {
  return (
    <Container className="py-16">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900">Visit Us</h1>
      <p className="mt-4 text-lg text-gray-600">
        Showroom information and location details are coming soon.
      </p>
    </Container>
  );
}
