import type { Metadata } from 'next';
import SkolaContent from '@/components/sajt/SkolaContent';

export const metadata: Metadata = {
  title: 'Feng Shui škola',
  description:
    'Dvomesečni online Feng Shui kurs sa Draganom Jović — od osnovnih principa do primene na sopstvenom prostoru. Prijava i besplatne konsultacije.',
};

export default function SkolaPage() {
  return <SkolaContent />;
}
