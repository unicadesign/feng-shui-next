'use client';

import { useEffect } from 'react';

/**
 * Meta pixel: učitavanje `fbevents.js`, `init` i prvi PageView.
 *
 * Sve dalje PageView-e po ruti šalje sam `fbevents.js`: on kači
 * `pushState`, `replaceState` i `popstate` i pri svakoj promeni adrese
 * pošalje automatski PageView (osim ako se postavi `fbq.disablePushState`,
 * što se ovde namerno NE radi). Time su pokrivene i `/uplata` i `/hvala`,
 * na koje se posle prijave stiže klijentskom navigacijom. Ručni
 * `fbq('track', 'PageView')` po ruti bi bio mrtav: posle prvog, Meta svaki
 * dalji ne-automatski PageView za isti pixel odbacuje kao duplikat
 * (provereno na `fbevents.js` v2.9, 04.09.2026.).
 *
 * Google Analytics 4 se učitava u layoutu i promene istorije prati sam
 * („enhanced measurement"), pa mu se odavde ništa ne šalje.
 *
 * Skripte se učitavaju samo u dokumentu koji je počeo na javnoj strani.
 * Da ne bi „procurile" na `/login`, `/dashboard` i `/admin` (obe skripte
 * prate istoriju celog dokumenta, ne samo ovog layouta), linkovi ka tim
 * stranama u Header-u su obični `<a>`, pa je to uvek puno učitavanje.
 *
 * Isto što radi Metin zvanični snippet: privremeni `fbq` koji pozive stavlja
 * u red dok se `fbevents.js` ne učita, pa ih on preuzme.
 */

const META_PIXEL_ID = '1411230116531391';

type Fbq = {
  (...args: unknown[]): void;
  callMethod?: (...args: unknown[]) => void;
  queue: unknown[][];
  push: unknown;
  loaded: boolean;
  version: string;
};

declare global {
  interface Window {
    fbq?: Fbq;
    _fbq?: Fbq;
    __metaPixelInit?: boolean;
  }
}

function osigurajPixel(): Fbq {
  if (window.fbq) return window.fbq;
  const n = function (...args: unknown[]) {
    if (n.callMethod) n.callMethod(...args);
    else n.queue.push(args);
  } as Fbq;
  n.queue = [];
  n.push = n;
  n.loaded = true;
  n.version = '2.0';
  window.fbq = n;
  if (!window._fbq) window._fbq = n;
  const t = document.createElement('script');
  t.async = true;
  t.src = 'https://connect.facebook.net/en_US/fbevents.js';
  const s = document.getElementsByTagName('script')[0];
  if (s?.parentNode) s.parentNode.insertBefore(t, s);
  else document.head.appendChild(t);
  return n;
}

export default function Analitika() {
  useEffect(() => {
    if (window.__metaPixelInit) return;
    window.__metaPixelInit = true;
    const fbq = osigurajPixel();
    fbq('init', META_PIXEL_ID);
    fbq('track', 'PageView');
  }, []);

  return null;
}
