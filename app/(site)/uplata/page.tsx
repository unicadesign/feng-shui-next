import type { Metadata } from 'next';
import UplataContent from '@/components/sajt/UplataContent';

/**
 * Zasebna ruta da bi konverzija „prijavio se za školu" imala svoj link
 * koji se lako veže na analitiku. Stranica je javna ali NEINDEKSIRANA:
 * nema je ni u navigaciji, ni u `app/sitemap.ts`, ni u pretrazi.
 *
 * `noindex` ide preko meta oznake, a NE preko `robots.txt`. Zabrana u
 * robots.txt bi sprečila pretraživač da uopšte pročita stranicu, pa ni
 * ne bi video da je označena kao neindeksirana.
 */
export const metadata: Metadata = {
  title: 'Podaci za uplatu | Feng Shui škola',
  description:
    'Instrukcije za uplatu školarine za Feng Shui online školu Dragane Jović.',
  robots: { index: false, follow: false },
};

export default function UplataPage() {
  return <UplataContent />;
}
