import type { Metadata } from 'next';
import PocetnaContent from '@/components/sajt/PocetnaContent';

export const metadata: Metadata = {
  title: 'Feng Shui: put ka miru i radosti | Dragana Jović',
  description:
    'Feng Shui konsultacije, škola i harmonizacija prostora sa Draganom Jović. Zakažite besplatnu konsultaciju i uskladite svoj dom sa sobom.',
};

export default function PocetnaPage() {
  return <PocetnaContent />;
}
