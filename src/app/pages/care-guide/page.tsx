import type { Metadata } from 'next';
import Container from '@/components/layout/Container';

export const metadata: Metadata = {
  title: 'Care Guide',
  description: 'Learn how to care for and maintain your hardwood products.',
};

export default function CareGuidePage() {
  return (
    <Container className="py-16">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900">Care Guide</h1>
      <p className="mt-4 text-lg text-gray-600">
        Hardwood care and maintenance guides are coming soon.
      </p>
    </Container>
  );
}
