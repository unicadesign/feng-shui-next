'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Meta pixel, ceo u jednoj klijentskoj komponenti.
 *
 * Zašto ne inline snippet u layoutu: `next/script` inline skriptu izvrši
 * samo jednom po `id`-u. Kada posetilac klijentskom navigacijom ode na
 * `/login` ili `/dashboard` (van `(site)` layouta) pa se vrati, layout se
 * ponovo montira, skript se ne izvršava drugi put i taj povratak bi ostao
 * bez PageView-a. Ovde je sve idempotentno: učitavanje `fbevents.js` i
 * `init` se dese jednom po stranici (čuvari na `window`), a PageView ide
 * pri SVAKOJ promeni putanje, uključujući prvu. Time su pokrivene i
 * `/uplata` i `/hvala`, na koje se posle prijave stiže klijentskom
 * navigacijom bez novog učitavanja.
 *
 * Google Analytics 4 se učitava u layoutu i promene istorije prati sam
 * („enhanced measurement"), pa mu se odavde ništa ne šalje.
 *
 * U dev režimu React Strict Mode izvršava efekte dvaput, pa se PageView
 * pri učitavanju vidi dva puta; u produkciji jednom.
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

/* Isto što radi Metin zvanični snippet: privremeni `fbq` koji pozive stavlja
   u red dok se `fbevents.js` ne učita, pa ih on preuzme. */
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
  const pathname = usePathname();

  useEffect(() => {
    const fbq = osigurajPixel();
    if (!window.__metaPixelInit) {
      fbq('init', META_PIXEL_ID);
      window.__metaPixelInit = true;
    }
    fbq('track', 'PageView');
  }, [pathname]);

  return null;
}
