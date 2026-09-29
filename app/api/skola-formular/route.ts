import { NextResponse } from 'next/server';
import { ocistiFormular, greskeFormulara } from '@/lib/skolaFormular';
import { jeIspravanKljuc } from '@/lib/skolaFormularKljuc';
import { sendSkolaFormularObavestenje, sendSkolaFormularKopija } from '@/lib/email/send';

/**
 * Prijavni formular škole (`/skola/<kljuc>`).
 *
 * Za razliku od `/api/prijava` ovde NEMA upisa u bazu (Marko, 29.09.2026.:
 * „to ćemo kasnije"). Mejl Dragani je jedini zapis, pa je redosled:
 *   1. mejl Dragani; ako ne ode, polaznica dobija grešku i šalje ponovo,
 *      a njeni odgovori ostaju u formularu;
 *   2. tek onda kopija polaznici, jer kopija kaže da su odgovori stigli.
 *      Neuspeh kopije se samo beleži: Dragana ih već ima.
 *
 * Bez ispravnog ključa endpoint ne radi ništa, da se preko njega ne bi
 * slali mejlovi na proizvoljne adrese (repozitorijum je javan).
 */
export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Neispravan zahtev.' }, { status: 400 });
  }

  if (!jeIspravanKljuc(body.kljuc)) {
    return NextResponse.json({ error: 'Formular nije pronađen.' }, { status: 404 });
  }

  const formular = ocistiFormular(body.odgovori);
  // Formular proverava isto u pretraživaču; ovo hvata samo zaobiđen formular.
  if (Object.keys(greskeFormulara(formular)).length) {
    return NextResponse.json({ error: 'Proverite formular: neko obavezno polje nije popunjeno ispravno.' }, { status: 400 });
  }

  const zaDraganu = await sendSkolaFormularObavestenje(formular);
  if (!zaDraganu.sent) {
    console.error('[skola-formular] mejl Dragani nije poslat:', zaDraganu.error);
    return NextResponse.json(
      { error: 'Slanje nije uspelo. Vaši odgovori su i dalje ovde, pokušajte ponovo za minut.' },
      { status: 502 },
    );
  }

  const kopija = await sendSkolaFormularKopija(formular);
  if (!kopija.sent) {
    console.error('[skola-formular] kopija polaznici nije poslata:', kopija.error);
  }

  return NextResponse.json({ success: true });
}
