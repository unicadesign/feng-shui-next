import type { Metadata } from 'next';
import OMeniContent from '@/components/sajt/OMeniContent';

export const metadata: Metadata = {
  title: 'O meni | Dragana Jović, Feng Shui',
  description:
    '25 godina iskustva, preko 1000 projekata. Dragana Jović spaja tradicionalni Feng Shui sa modernim, holističkim pristupom prostoru.',
};

export default function OMeniPage() {
  return <OMeniContent />;
}
