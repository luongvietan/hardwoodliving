import type { Metadata } from 'next';
import Container from '@/components/layout/Container';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with our team for consultations and inquiries.',
};

export default function ContactPage() {
  return (
    <Container className="py-16">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900">Contact Us</h1>
      <p className="mt-4 text-lg text-gray-600">
        Our contact form and consultation booking are coming soon.
      </p>
    </Container>
  );
}
