import type { Metadata } from 'next';
import OMeniCContent from '@/components/fs-c/OMeniCContent';

export const metadata: Metadata = {
  title: 'O meni | Dragana Jović, Feng Shui',
  description:
    '25 godina iskustva, preko 1000 projekata. Dragana Jović spaja tradicionalni Feng Shui sa modernim, holističkim pristupom prostoru.',
};

export default function OMeniCPage() {
  return <OMeniCContent />;
}
