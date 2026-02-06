import type { Metadata } from 'next';
import Container from '@/components/layout/Container';

export const metadata: Metadata = {
  title: 'Trades',
  description: 'Trade professionals program with exclusive pricing and benefits.',
};

export default function TradesPage() {
  return (
    <Container className="py-16">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900">Trades</h1>
      <p className="mt-4 text-lg text-gray-600">
        Our trade professionals program information is coming soon.
      </p>
    </Container>
  );
}
