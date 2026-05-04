import type { Metadata } from 'next';
import { getContent } from '@/lib/content';
import VazaContent from '@/components/vaza/VazaContent';

export const metadata: Metadata = {
  title: 'Vaza Izobilja',
  description:
    'Aktivirajte energiju izobilja u vašem prostoru — Vaza Izobilja, drevni Feng Shui simbol prosperiteta, prilagođen vašem domu.',
};

export default async function VazaIzobiljaPage() {
  const vaza = await getContent('vaza');
  return <VazaContent content={vaza} />;
}
