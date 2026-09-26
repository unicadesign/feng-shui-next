import type { HomeContent } from '@/types/content';

type WebinarSection = HomeContent['webinarSection'];

// Live iff admin enabled it AND (no start time set OR start time is in the future).
// When the start time passes, every renderer hides the section automatically.
export function isWebinarLive(c: WebinarSection, now: number = Date.now()): boolean {
  if (!c.enabled) return false;
  if (!c.startsAt) return true;
  const t = new Date(c.startsAt).getTime();
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

// Short countdown for the navbar bar. "3d 12h" / "12h 24m" / "24m" / "Uskoro".
export function countdownString(now: number, startsAt: string): string {
  if (!startsAt) return '';
  const t = new Date(startsAt).getTime();
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
