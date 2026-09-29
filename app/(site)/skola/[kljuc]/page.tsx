import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import SkolaFormularContent from '@/components/sajt/SkolaFormularContent';
import { jeIspravanKljuc } from '@/lib/skolaFormularKljuc';

/**
 * Prijavni formular škole. Link Dragana šalje lično polaznicama koje su
 * uplatile; strane nema u navigaciji ni u `app/sitemap.ts`, a pretraživači
 * je ne indeksiraju (meta oznaka, kao `/uplata`).
 *
 * Adresa je `/skola/<kljuc>`; svaki drugi ključ je 404. Zašto ključ nije
 * u kodu: `lib/skolaFormularKljuc.ts`.
 */
export const metadata: Metadata = {
  title: 'Prijavni formular | Feng Shui online škola',
  robots: { index: false, follow: false },
};

export default async function SkolaFormularPage({
  params,
}: {
  params: Promise<{ kljuc: string }>;
}) {
  const { kljuc } = await params;
  if (!jeIspravanKljuc(kljuc)) notFound();
  return <SkolaFormularContent kljuc={kljuc} />;
}
