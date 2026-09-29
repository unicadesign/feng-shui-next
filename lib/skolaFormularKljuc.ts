/**
 * Tajni deo adrese prijavnog formulara: `/skola/<kljuc>`.
 *
 * Ključ NIJE u kodu jer je repozitorijum javan; stoji u promenljivoj
 * `SKOLA_FORMULAR_KLJUC` (Vercel i `.env.local`). Ako link procuri,
 * menja se samo vrednost promenljive i ponovo se objavi sajt: stari
 * link tada vodi na 404.
 *
 * Isti ključ proverava i `/api/skola-formular`, da niko ko je pročitao
 * javni kod ne bi mogao da šalje mejlove preko tog endpointa.
 *
 * Samo za server: promenljiva nema `NEXT_PUBLIC_` pa je u pretraživaču
 * prazna, a prazan ključ nikad ne prolazi.
 */
export function jeIspravanKljuc(kljuc: unknown): boolean {
  const ocekivan = (process.env.SKOLA_FORMULAR_KLJUC || '').trim();
  return ocekivan.length >= 8 && typeof kljuc === 'string' && kljuc === ocekivan;
}
