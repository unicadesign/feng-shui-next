'use client';

import { useEffect, useRef } from 'react';

/**
 * Most između zajedničkog Header-a i modala na `-c` stranama.
 *
 * Header dolazi iz `(site)/layout.tsx` i stoji van `.fs-c` stabla, pa ne
 * može da dosegne stanje modala koje živi u komponenti strane. Umesto da
 * se kroz layout provlači kontekst (layout je serverska komponenta), Header
 * javi prozoru, a strana koja je trenutno otvorena to čuje i otvori svoj
 * modal.
 *
 * Prolazno rešenje, kao i `C_PREVIEW_ROUTES` u Header-u: briše se kada
 * redizajn C preuzme prave rute i kada Header prestane da bude deljen
 * između dve verzije sajta.
 */
export const FS_C_ENROLL_EVENT = 'fs-c:enroll';

/** Zove Header kada se klikne „Sačuvaj svoje mesto". */
export function requestFsCEnroll() {
  window.dispatchEvent(new Event(FS_C_ENROLL_EVENT));
}

/** Zove svaka `-c` strana; `onEnroll` otvara njen modal za prijavu. */
export function useFsCEnrollTrigger(onEnroll: () => void) {
  // Ref drži poslednju funkciju, pa se slušalac veže samo jednom i ne
  // otkačinje se pri svakom renderu ako pozivalac prosledi inline strelicu.
  // Upisuje se u efektu, ne u renderu: React ref tokom rendera ne sme da
  // se dira, i eslint pravilo `react-hooks/refs` to i traži.
  const najnoviji = useRef(onEnroll);
  useEffect(() => {
    najnoviji.current = onEnroll;
  }, [onEnroll]);

  useEffect(() => {
    const slusalac = () => najnoviji.current();
    window.addEventListener(FS_C_ENROLL_EVENT, slusalac);
    return () => window.removeEventListener(FS_C_ENROLL_EVENT, slusalac);
  }, []);
}
