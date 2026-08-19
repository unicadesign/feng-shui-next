import type { Metadata } from 'next';
import SkolaCContent from '@/components/skola-c/SkolaCContent';

export const metadata: Metadata = {
  title: 'Feng Shui škola — verzija C',
  description:
    'Dvomesečni online Feng Shui kurs sa Draganom Jović — od osnovnih principa do primene na sopstvenom prostoru. Prijava i besplatne konsultacije.',
};

export default function SkolaCPage() {
  return <SkolaCContent />;
}
