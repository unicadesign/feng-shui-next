import type { Metadata } from 'next';
import KontaktContent from '@/components/sajt/KontaktContent';

/**
 * Kontakt upitnik. Adresa `/upitnik` je zadržana pri prelasku na novi
 * dizajn (09.2026.) zbog postojećih linkova i Google istorije; strana JESTE
 * za pretragu, za razliku od `/uplata` i `/hvala`.
 */
export const metadata: Metadata = {
  title: 'Kontakt | Dragana Jović',
  description:
    'Popunite upitnik i Dragana Jović će vam se javiti sa predlogom za vaš prostor. Feng Shui konsultacije, procena nekretnina i škola.',
};

export default function KontaktPage() {
  return <KontaktContent />;
}
