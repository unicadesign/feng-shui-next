import type { Metadata } from 'next';
import KontaktCContent from '@/components/fs-c/KontaktCContent';

/**
 * Blizanac žive rute `/upitnik`, u novom dizajnu. Živa ostaje netaknuta
 * dok klijent ne odobri redizajn; navbar na `-c` stranama preusmerava
 * „Kontakt" ovamo (`C_PREVIEW_ROUTES` u `components/Header.tsx`).
 *
 * Za razliku od `/uplata-c` i `/hvala-c`, ova strana JESTE za pretragu
 * kada C preuzme prave rute. Do tada je neindeksirana, da se preview ne
 * takmiči sa živim `/upitnik` u rezultatima.
 */
export const metadata: Metadata = {
  title: 'Kontakt | Dragana Jović',
  description:
    'Popunite upitnik i Dragana Jović će vam se javiti sa predlogom za vaš prostor. Feng Shui konsultacije, procena nekretnina i škola.',
  robots: { index: false, follow: false },
};

export default function KontaktCPage() {
  return <KontaktCContent />;
}
