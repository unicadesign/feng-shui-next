/**
 * Provera MP4 fajla pre slanja u Supabase (admin, upload videa lekcije).
 *
 * Čita samo zaglavlja fajla, ne ceo fajl: spisak glavnih „kutija" (atoma)
 * i kutiju `moov` sa opisom snimka. Iz toga se vidi:
 *  - da li je fajl uopšte MP4 (kutija `ftyp` na početku);
 *  - da li video kreće odmah: `moov` mora biti PRE `mdat` (podaci). Ako je
 *    posle, pretraživač mora da skine ceo fajl pre puštanja; popravlja se
 *    izvozom sa opcijom „Fast start" / „Web optimized";
 *  - da li je video H.265/HEVC (`hvc1`/`hev1`), koji ne radi u svim
 *    pretraživačima, za razliku od H.264 (`avc1`).
 *
 * `citaj(od, do)` vraća bajtove iz opsega [od, do); u pretraživaču je to
 * `File.slice`, u testovima čitanje sa diska.
 */

export type Citac = (od: number, doBajta: number) => Promise<Uint8Array>;

export interface RezultatProvere {
  /** Fajl se ne šalje; poruka za admina. */
  greska?: string;
  /** Fajl se šalje, ali admin treba da zna. */
  upozorenja: string[];
}

export const MAX_VIDEO_BAJTOVA = 2 * 1024 ** 3; // 2 GB, isto kao limit u Supabase-u
/** `moov` se čita da bi se našao kodek; veći od ovoga se ne proverava. */
const MAX_MOOV_BAJTOVA = 32 * 1024 * 1024;

const tip = (b: Uint8Array, i: number) => String.fromCharCode(b[i], b[i + 1], b[i + 2], b[i + 3]);

const sadrzi = (b: Uint8Array, rec: string) => {
  const k = [...rec].map((c) => c.charCodeAt(0));
  outer: for (let i = 0; i <= b.length - k.length; i++) {
    for (let j = 0; j < k.length; j++) if (b[i + j] !== k[j]) continue outer;
    return true;
  }
  return false;
};

/** Glavne kutije redom: tip, početak i veličina. */
export async function glavneKutije(
  citaj: Citac,
  velicina: number,
): Promise<{ tip: string; od: number; velicina: number }[]> {
  const kutije: { tip: string; od: number; velicina: number }[] = [];
  let pos = 0;
  while (pos + 8 <= velicina && kutije.length < 64) {
    const z = await citaj(pos, Math.min(pos + 16, velicina));
    const dv = new DataView(z.buffer, z.byteOffset, z.byteLength);
    let vel = dv.getUint32(0);
    const t = tip(z, 4);
    if (vel === 1 && z.length >= 16) {
      vel = Number(dv.getBigUint64(8));
    } else if (vel === 0) {
      vel = velicina - pos; // kutija do kraja fajla
    }
    if (vel < 8) break; // oštećen fajl
    kutije.push({ tip: t, od: pos, velicina: vel });
    pos += vel;
  }
  return kutije;
}

export async function proveriVideo(
  ime: string,
  velicina: number,
  mime: string,
  citaj: Citac,
): Promise<RezultatProvere> {
  const upozorenja: string[] = [];
  const nastavak = ime.toLowerCase().split('.').pop() || '';

  if (nastavak === 'mov' || mime === 'video/quicktime') {
    return {
      upozorenja,
      greska: 'Ovo je .mov snimak (na primer sa iPhone-a), koji ne radi u svim pretraživačima. Izvezite ga kao MP4 (H.264) i izaberite ponovo.',
    };
  }
  if (velicina > MAX_VIDEO_BAJTOVA) {
    return { upozorenja, greska: `Video je veći od 2 GB (${(velicina / 1024 ** 3).toFixed(2)} GB). Izvezite ga u manjoj rezoluciji (npr. 720p) ili ga podelite na delove.` };
  }

  const kutije = await glavneKutije(citaj, velicina);
  if (kutije[0]?.tip !== 'ftyp' || nastavak !== 'mp4') {
    return { upozorenja, greska: 'Ovo nije MP4 video. Izvezite snimak kao MP4 (H.264) i izaberite ponovo.' };
  }

  const moov = kutije.find((k) => k.tip === 'moov');
  const mdat = kutije.find((k) => k.tip === 'mdat');
  if (!moov) {
    return { upozorenja, greska: 'MP4 fajl nije potpun (nedostaje opis snimka). Izvezite ga ponovo.' };
  }
  if (mdat && moov.od > mdat.od) {
    upozorenja.push('Video neće krenuti odmah: polaznica mora da sačeka da se učita veći deo fajla. Pri izvozu uključite „Fast start" ili „Web optimized" i podignite ga ponovo, ako možete.');
  }
  if (moov.velicina <= MAX_MOOV_BAJTOVA) {
    const opis = await citaj(moov.od, moov.od + moov.velicina);
    if (sadrzi(opis, 'hvc1') || sadrzi(opis, 'hev1')) {
      upozorenja.push('Video je u formatu H.265 (HEVC), koji ne radi u svim pretraživačima. Bolje ga je izvesti kao H.264.');
    }
  }
  return { upozorenja };
}

/** „Nacrt stana – Nedelja 2 (č).mp4" → „nacrt-stana-nedelja-2-c". */
export function imeZaPutanju(ime: string): string {
  return (
    ime
      .replace(/\.[a-z0-9]+$/i, '')
      .replace(/đ/g, 'dj')
      .replace(/Đ/g, 'Dj')
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 60) || 'video'
  );
}

/**
 * Putanja videa u `course-videos`. Uvek ista za isti fajl (ime, veličina,
 * vreme izmene): ako upload pukne, ponovni izbor istog fajla nastavlja
 * tamo gde je stao, a već podignut fajl se ne šalje dvaput.
 */
export function putanjaVidea(ime: string, velicina: number, izmenjen: number): string {
  return `videi/${imeZaPutanju(ime)}-${velicina.toString(36)}${izmenjen.toString(36)}.mp4`;
}
