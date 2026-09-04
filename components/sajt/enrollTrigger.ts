'use client';

import { useEffect, useRef } from 'react';

/**
 * Most između zajedničkog Header-a i modala za prijavu na stranama koje
 * ga imaju (Početna, Škola, O meni).
 *
 * Header dolazi iz `(site)/layout.tsx` i stoji van `.fs-c` stabla, pa ne
 * može da dosegne stanje modala koje živi u komponenti strane. Umesto da
 * se kroz layout provlači kontekst (layout je serverska komponenta), Header
 * javi prozoru, a strana koja je trenutno otvorena to čuje i otvori svoj
 * modal.
 *
 * Ovo nije prolazno rešenje: dokle god Header dolazi iz serverskog layouta
 * a modal živi u strani, događaj je jedini most. Nestaje tek ako se modal
 * preseli u layout ili Header (admin faza, PLAN-PRELAZAK.md).
 */
export const ENROLL_EVENT = 'sajt:prijava';

/** Zove Header kada se klikne „Sačuvaj svoje mesto". */
export function requestEnroll() {
  window.dispatchEvent(new Event(ENROLL_EVENT));
}

/** Zove svaka strana sa modalom; `onEnroll` otvara njen modal za prijavu. */
export function useEnrollTrigger(onEnroll: () => void) {
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
    window.addEventListener(ENROLL_EVENT, slusalac);
    return () => window.removeEventListener(ENROLL_EVENT, slusalac);
  }, []);
}
