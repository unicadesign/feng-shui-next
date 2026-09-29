/**
 * Prijavni formular Feng Shui online škole: pitanja, provera i prikaz.
 *
 * Formular popunjavaju samo polaznice koje su uplatile; Dragana im šalje
 * link lično. Strana nije povezana nigde na sajtu, a adresa je tajna
 * (vidi `lib/skolaFormularKljuc.ts`).
 *
 * Odgovori se NE čuvaju u bazi (Marko, 29.09.2026.: „to ćemo kasnije"):
 * mejl Dragani je jedini zapis, a polaznica dobija kopiju.
 *
 * Tekst pitanja je klijentov, 1:1. Izmene u odnosu na njen dokument:
 * „zadovoljan" je svuda „zadovoljan/na" (Marko, 29.09.), naslov je podeljen
 * na nadnaslov i naslov umesto duge crte, a emoji ispred „Motivacija i
 * iskustvo" je izbačen jer ga ostale sekcije nemaju.
 *
 * Pitanja stoje ovde, na jednom mestu, da bi formular i oba mejla
 * nosili isti tekst.
 */

export const SEKCIJE = [
  'Lični podaci',
  'Motivacija i iskustvo',
  'Zadovoljstvo životnim oblastima',
  'Procena znanja i očekivanja',
] as const;

export const OZNAKE = {
  imePrezime: 'Ime i prezime',
  datumRodjenja: 'Datum rođenja',
  mesto: 'Mesto stanovanja',
  email: 'E-mail adresa',
  facebook: 'Ime na Facebook profilu',
  telefon: 'Broj telefona',
  zasto: '1. Zašto ste se odlučili za Feng Shui online školu?',
  pohadjao: '2. Da li ste do sada pohađali neki kurs o Feng Shui metodi?',
  kojiKurs: 'Ako jeste, navedite koji:',
  zaintrigiralo: '3. Šta je ono što vas je zaintrigiralo vezano za Feng Shui?',
  vreme: '4. Koliko vremena dnevno ili nedeljno možete da izdvojite za ovaj program?',
  zadovoljstvo: 'Ocenite nivo zadovoljstva sledećim oblastima života:',
  znanje: '1. Kojom biste ocenom od 1 do 10 ocenili svoje sadašnje znanje o Feng Shui-ju?',
  znanjeRaspon: '(1 – početnik, 10 – napredno znanje)',
  ocekivanja: '2. Šta očekujete od Feng Shui online škole?',
} as const;

export const OBLASTI = [
  'Karijera',
  'Emotivne veze, brak',
  'Odnosi sa roditeljima',
  'Porodični odnosi',
  'Odnosi sa decom',
  'Blagostanje',
  'Prosperitet',
  'Priznanja',
  'Zdravlje',
  'Pomoć okruženja',
  'Kreativnost',
  'Životna radost',
  'Učenje',
] as const;

export const OCENE = [
  ['A', 'veoma sam zadovoljan/na'],
  ['B', 'umereno sam zadovoljan/na'],
  ['C', 'nisam baš zadovoljan/na'],
  ['D', 'nezadovoljan/na sam'],
] as const;

export interface SkolaFormular {
  imePrezime: string;
  /** Kako ga daje `<input type="date">`: GGGG-MM-DD. */
  datumRodjenja: string;
  mesto: string;
  email: string;
  facebook: string;
  telefon: string;
  zasto: string;
  pohadjao: '' | 'da' | 'ne';
  kojiKurs: string;
  zaintrigiralo: string;
  vreme: string;
  /** Ocena A-D za svaku oblast, istim redom kao `OBLASTI`; '' dok nije ocenjena. */
  zadovoljstvo: string[];
  /** '1' do '10'; '' dok nije izabrano. */
  znanje: string;
  ocekivanja: string;
}

export const prazanFormular = (): SkolaFormular => ({
  imePrezime: '',
  datumRodjenja: '',
  mesto: '',
  email: '',
  facebook: '',
  telefon: '',
  zasto: '',
  pohadjao: '',
  kojiKurs: '',
  zaintrigiralo: '',
  vreme: '',
  zadovoljstvo: OBLASTI.map(() => ''),
  znanje: '',
  ocekivanja: '',
});

const MAX_KRATKO = 160;
/** Slobodan tekst iz `textarea`; dugačak odgovor je dobrodošao, beskonačan nije. */
const MAX_TEKST = 4000;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DATUM_RE = /^(\d{4})-(\d{2})-(\d{2})$/;

/** Jedan red: kontrolni znaci (prelom, tab) postaju razmak. */
function ocisti(v: unknown, max = MAX_KRATKO): string {
  return String(v ?? '')
    .replace(/[\u0000-\u001F\u007F]+/g, ' ')
    .trim()
    .slice(0, max);
}

/** Slobodan tekst zadržava prelome reda, bez njih se pasusi slepe. */
function ocistiTekst(v: unknown): string {
  return String(v ?? '')
    .replace(/\r\n?/g, '\n')
    .replace(/[\u0000-\u0009\u000B-\u001F\u007F]+/g, ' ')
    .trim()
    .slice(0, MAX_TEKST);
}

/** Sa servera: od bilo čega što stigne pravi ispravan oblik formulara. */
export function ocistiFormular(v: unknown): SkolaFormular {
  const o = (v && typeof v === 'object' ? v : {}) as Record<string, unknown>;
  const ocene = Array.isArray(o.zadovoljstvo) ? o.zadovoljstvo : [];
  const pohadjao = o.pohadjao === 'da' || o.pohadjao === 'ne' ? o.pohadjao : '';
  return {
    imePrezime: ocisti(o.imePrezime),
    datumRodjenja: ocisti(o.datumRodjenja, 10),
    mesto: ocisti(o.mesto),
    email: ocisti(o.email).toLowerCase(),
    facebook: ocisti(o.facebook),
    telefon: ocisti(o.telefon, 60),
    zasto: ocistiTekst(o.zasto),
    pohadjao,
    // Naziv kursa ima smisla samo uz „Da".
    kojiKurs: pohadjao === 'da' ? ocisti(o.kojiKurs, 300) : '',
    zaintrigiralo: ocistiTekst(o.zaintrigiralo),
    vreme: ocisti(o.vreme, 300),
    zadovoljstvo: OBLASTI.map((_, i) => {
      const s = String(ocene[i] ?? '');
      return OCENE.some(([slovo]) => slovo === s) ? s : '';
    }),
    znanje: /^(10|[1-9])$/.test(String(o.znanje ?? '')) ? String(o.znanje) : '',
    ocekivanja: ocistiTekst(o.ocekivanja),
  };
}

function jeIspravanDatum(iso: string): boolean {
  const m = DATUM_RE.exec(iso);
  if (!m) return false;
  const [g, mes, d] = [Number(m[1]), Number(m[2]), Number(m[3])];
  const datum = new Date(Date.UTC(g, mes - 1, d));
  return (
    datum.getUTCFullYear() === g &&
    datum.getUTCMonth() === mes - 1 &&
    datum.getUTCDate() === d &&
    g >= 1900 &&
    datum.getTime() <= Date.now()
  );
}

const OBAVEZNO = 'Ovo polje je obavezno.';

/**
 * Greške po polju. Bez `korak` proverava ceo formular (server), sa njim
 * samo polja tog koraka (dugme „Sledeći korak").
 */
export function greskeFormulara(f: SkolaFormular, korak?: 1 | 2 | 3 | 4): Record<string, string> {
  const g: Record<string, string> = {};
  const u = (k: number) => korak === undefined || korak === k;

  if (u(1)) {
    if (!f.imePrezime.trim()) g.imePrezime = OBAVEZNO;
    if (!f.datumRodjenja) g.datumRodjenja = OBAVEZNO;
    else if (!jeIspravanDatum(f.datumRodjenja)) g.datumRodjenja = 'Unesite ispravan datum rođenja.';
    if (!f.mesto.trim()) g.mesto = OBAVEZNO;
    if (!f.email.trim()) g.email = OBAVEZNO;
    else if (!EMAIL_RE.test(f.email.trim())) g.email = 'Unesite ispravnu e-mail adresu.';
    if (!f.telefon.trim()) g.telefon = OBAVEZNO;
  }
  if (u(2)) {
    if (!f.zasto.trim()) g.zasto = OBAVEZNO;
    if (!f.pohadjao) g.pohadjao = 'Izaberite Da ili Ne.';
    if (!f.zaintrigiralo.trim()) g.zaintrigiralo = OBAVEZNO;
    if (!f.vreme.trim()) g.vreme = OBAVEZNO;
  }
  if (u(3)) {
    if (f.zadovoljstvo.some((o) => !o)) g.zadovoljstvo = 'Ocenite sve oblasti.';
  }
  if (u(4)) {
    if (!f.znanje) g.znanje = 'Izaberite ocenu od 1 do 10.';
    if (!f.ocekivanja.trim()) g.ocekivanja = OBAVEZNO;
  }
  return g;
}

/** 1980-03-12 → 12.03.1980. */
export function datumZaPrikaz(iso: string): string {
  const m = DATUM_RE.exec(iso);
  return m ? `${m[3]}.${m[2]}.${m[1]}.` : iso;
}

/** „A" → „veoma sam zadovoljan/na". */
export function opisOcene(slovo: string): string {
  return OCENE.find(([s]) => s === slovo)?.[1] ?? '';
}
