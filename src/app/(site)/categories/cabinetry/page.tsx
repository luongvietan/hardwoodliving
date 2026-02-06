import type { Metadata } from 'next';
import Container from '@/components/layout/Container';

export const metadata: Metadata = {
  title: 'Cabinetry',
  description: 'Browse our premium hardwood cabinetry collection.',
};

export default function CabinetryPage() {
  return (
    <Container className="py-16">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900">Cabinetry</h1>
      <p className="mt-4 text-lg text-gray-600">
        Our premium hardwood cabinetry collection is coming soon. Check back for updates.
      </p>
    </Container>
  );
}
