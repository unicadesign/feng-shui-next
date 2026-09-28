import type { HomeContent } from '@/types/content';

type WebinarSection = HomeContent['webinarSection'];

/* ─── Termin je BEOGRADSKO vreme ──────────────────────────────────────
   Admin upisuje „2026-10-05T19:00" bez oznake zone. `new Date()` takav
   zapis čita u zoni sredine u kojoj radi: u pretraživaču u Beogradu to je
   19h po beogradskom, a na Vercelu, koji radi po UTC-u, 19h po UTC-u, dva
   sata kasnije. Server je zato do 28.09.2026. smatrao da vebinar traje još
   dva sata posle početka: traka i popup su za to vreme ponovo treperili,
   a sekcija na početnoj je ostajala vidljiva.

   Za POREĐENJE sa trenutnim vremenom (da li je vebinar prošao, odbrojavanje)
   termin se zato čita kao beogradski, gde god kod radi. Za PRIKAZ („5.10.",
   „19h") to ne treba: zidni sat je isti u obe sredine. */
const ZONA = 'Europe/Belgrade';

/** Koliko je Beograd ispred UTC-a u datom trenutku (1h zimi, 2h leti), u ms. */
function pomerajZone(ms: number): number {
  const delovi = new Intl.DateTimeFormat('en-US', {
    timeZone: ZONA,
    hourCycle: 'h23',
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  }).formatToParts(new Date(ms));
  const v = (tip: string) => Number(delovi.find((p) => p.type === tip)?.value);
  const zidniKaoUtc = Date.UTC(v('year'), v('month') - 1, v('day'), v('hour'), v('minute'), v('second'));
  return zidniKaoUtc - Math.floor(ms / 1000) * 1000;
}

/** „2026-10-05T19:00" (beogradsko vreme iz admina) → pravi trenutak u ms. */
export function trenutakVebinara(startsAt: string): number {
  const m = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/.exec(startsAt);
  if (!m) return new Date(startsAt).getTime();
  const [g, mes, d, h, min] = m.slice(1).map(Number);
  const kaoDaJeUtc = Date.UTC(g, mes - 1, d, h, min);
  const pomeraj = pomerajZone(kaoDaJeUtc);
  const t = kaoDaJeUtc - pomeraj;
  // Oko promene sata (mart, oktobar) pomeraj u samom trenutku može da bude
  // drugačiji od onog kojim smo računali; jedna ispravka to pokrije.
  const tacan = pomerajZone(t);
  return tacan === pomeraj ? t : kaoDaJeUtc - tacan;
}

// Live iff admin enabled it AND (no start time set OR start time is in the future).
// When the start time passes, every renderer hides the section automatically.
export function isWebinarLive(c: WebinarSection, now: number = Date.now()): boolean {
  if (!c.enabled) return false;
  if (!c.startsAt) return true;
  const t = trenutakVebinara(c.startsAt);
  if (Number.isNaN(t)) return true;
  return now < t;
}

/**
 * Ključ u `localStorage` kojim pretraživač pamti da se ovaj posetilac već
 * prijavio, pa mu traka, popup i sekcija na početnoj ne nude prijavu opet.
 * Vezan je za termin, da prijava na prošli vebinar ne pokrije sledeći.
 * Pamti SAMO ovaj pretraživač; server ne zna ništa o tome.
 */
export const prijavljenKljuc = (c: WebinarSection) =>
  `webinar_registered:${c.startsAt || c.title}`;

const pad = (n: number) => String(n).padStart(2, '0');

// "2026-06-25T20:00" → "25.06.2026 u 20h" / "25.06.2026 u 20:30h"
export function formatWebinarDate(startsAt: string): string {
  if (!startsAt) return '';
  const d = new Date(startsAt);
  if (Number.isNaN(d.getTime())) return '';
  const day = pad(d.getDate());
  const month = pad(d.getMonth() + 1);
  const year = d.getFullYear();
  const h = d.getHours();
  const m = d.getMinutes();
  const time = m === 0 ? `${h}h` : `${pad(h)}:${pad(m)}h`;
  return `${day}.${month}.${year} u ${time}`;
}

/* Prikaz termina u sekciji na početnoj (predlog M, 28.09.2026.).
   Čita se zidni sat kako ga je admin upisao („2026-10-05T19:00"), isto kao
   `formatWebinarDate`: na serveru i u pretraživaču dobija se isti dan i sat,
   pa HTML sa servera i prvi prikaz u pretraživaču ne mogu da se razlikuju. */
const DANI = ['nedelja', 'ponedeljak', 'utorak', 'sreda', 'četvrtak', 'petak', 'subota'];
const MESECI = [
  'januara', 'februara', 'marta', 'aprila', 'maja', 'juna',
  'jula', 'avgusta', 'septembra', 'oktobra', 'novembra', 'decembra',
];

function termin(startsAt: string): Date | null {
  if (!startsAt) return null;
  const d = new Date(startsAt);
  return Number.isNaN(d.getTime()) ? null : d;
}

const sat = (d: Date) =>
  d.getMinutes() === 0 ? `${d.getHours()}h` : `${pad(d.getHours())}:${pad(d.getMinutes())}h`;

// "2026-10-05T19:00" → "5.10."  (veliki broj u sekciji)
export function webinarKratakDatum(startsAt: string): string {
  const d = termin(startsAt);
  return d ? `${d.getDate()}.${d.getMonth() + 1}.` : '';
}

// "2026-10-05T19:00" → "ponedeljak · 19h"
export function webinarDanISat(startsAt: string): string {
  const d = termin(startsAt);
  return d ? `${DANI[d.getDay()]} · ${sat(d)}` : '';
}

// "2026-10-05T19:00" → "ponedeljak, 5. oktobra 2026. u 19h"  (za čitač ekrana)
export function webinarPunDatum(startsAt: string): string {
  const d = termin(startsAt);
  return d
    ? `${DANI[d.getDay()]}, ${d.getDate()}. ${MESECI[d.getMonth()]} ${d.getFullYear()}. u ${sat(d)}`
    : '';
}

// Short countdown for the navbar bar. "3d 12h" / "12h 24m" / "24m" / "Uskoro".
export function countdownString(now: number, startsAt: string): string {
  if (!startsAt) return '';
  const t = trenutakVebinara(startsAt);
  if (Number.isNaN(t)) return '';
  const diff = t - now;
  if (diff <= 0) return '';
  const sec = Math.floor(diff / 1000);
  const days = Math.floor(sec / 86400);
  const hours = Math.floor((sec % 86400) / 3600);
  const minutes = Math.floor((sec % 3600) / 60);
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  if (minutes > 0) return `${minutes}m`;
  return 'Uskoro';
}
