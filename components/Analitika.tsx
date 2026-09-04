'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Meta pixel pri promeni rute.
 *
 * Skripte za Google Analytics i Meta pixel se učitavaju u `(site)/layout.tsx`
 * i same okinu PageView pri prvom učitavanju strane. Ali posle prijave se na
 * `/uplata` i `/hvala` stiže klijentskom navigacijom (`router.push`), bez
 * novog učitavanja, pa pixel bez ovoga ne bi video baš one strane zbog kojih
 * i postoje kao zasebni linkovi. Google Analytics 4 promene istorije prati
 * sam („enhanced measurement"), pa mu se ovde ništa ne šalje da ne bi brojao
 * dvaput.
 *
 * Prvi render se preskače: za njega je PageView već poslao inline snippet.
 */
declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

export default function Analitika() {
  const pathname = usePathname();
  const prvi = useRef(true);

  useEffect(() => {
    if (prvi.current) {
      prvi.current = false;
      return;
    }
    window.fbq?.('track', 'PageView');
  }, [pathname]);

  return null;
}
