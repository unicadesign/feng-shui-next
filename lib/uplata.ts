/**
 * Podaci za uplatu školarine — JEDNO mesto za stranicu `/uplata` i za
 * email koji ide posle prijave.
 *
 * Namerno u zajedničkom modulu. Da iznos i broj računa stoje na dva
 * mesta, pre ili kasnije bi se razišli, a razlika između onoga što piše
 * na stranici i onoga što piše u mejlu je razlika koju plaća klijent.
 *
 * ─── PROVERENO ──────────────────────────────────────────────────────
 * Broj računa: IBAN `RS35115003816338009895` prolazi mod-97 proveru
 * (ostatak 1) i raspada se na banku `115`, račun `0038163380098` i
 * kontrolu `95`. Pun oblik je dakle `115-0038163380098-95`. Instrukcije
 * od klijenta su na jednom mestu (u tekstu mejla) imale skraćen oblik
 * bez kontrolne dvocifre; ovde stoji pun, jer je taj tačan.
 *
 * SWIFT `AAAARSBG`: Marko je 04.09.2026. potvrdio da je to kod koji je
 * klijent dostavio. (Ranija sumnja: četiri ista slova liče na popunu iz
 * šablona; ostaje zabeleženo, vrednost nije menjana.)
 *
 * ─── ČEKA PODATKE ───────────────────────────────────────────────────
 * Strane banke uz IBAN po pravilu traže NAZIV I ADRESU
 * BANKE, kojih u instrukcijama nema. Kada stignu, idu u `bankaNaziv` i
 * `bankaAdresa` ispod i same se pojave na stranici i u mejlu.
 *
 * ─── ODLUKA O IZNOSU ────────────────────────────────────────────────
 * Instrukcije su za inostranstvo pominjale 286 €, a stranica škole 289 €.
 * Marko je 31.08. odlučio: bez preračunavanja, ostaju cene kako ih je
 * klijent dao — 33.550 RSD i 289 €. Zato ovde nema kursa; dva iznosa su
 * dva podatka, ne jedan izveden iz drugog.
 */

export const UPLATA = {
  primalac: 'Dragana Jović',
  mesto: 'Beograd',
  racun: '115-0038163380098-95',

  /** Za prikaz. */
  iznosRsd: '33.550 RSD',
  /** Za dugme „kopiraj" — e-bankarstvo neće tačku ni oznaku valute. */
  iznosRsdSirov: '33550',

  /**
   * Svrha uplate NIJE bila u instrukcijama, a bez nje Dragana ne može da
   * spoji uplatu sa osobom. Ime se dodaje na stranici i u mejlu, jer se
   * tek tamo zna ko je prijavljen.
   */
  svrhaOsnov: 'Feng Shui škola',

  iban: 'RS35115003816338009895',
  swift: 'AAAARSBG',
  iznosEur: '289 €',
  iznosEurSirov: '289',

  /** Prazno dok klijent ne pošalje; prikaz ih preskače kada su prazni. */
  bankaNaziv: '',
  bankaAdresa: '',

  rokSati: 48,

  telefon: '+381 63 380 098',
  telefonZaLink: '+38163380098',
} as const;

/** „Feng Shui škola, Ana Anić" — svrha uplate sa imenom prijavljenog. */
export function svrhaUplate(imePrezime?: string): string {
  const ime = (imePrezime || '').trim();
  return ime ? `${UPLATA.svrhaOsnov}, ${ime}` : UPLATA.svrhaOsnov;
}

/**
 * IBAN za ČITANJE, u grupama po četiri: „RS35 1150 0381 6338 0098 95".
 * Tako se i propisuje da se ispisuje na papiru, i tako se prepisuje bez
 * gubljenja mesta u nizu od 22 znaka. U ostavu i u polje e-bankarstva
 * ide neprekinut oblik, `UPLATA.iban`.
 */
export function ibanZaPrikaz(): string {
  return UPLATA.iban.replace(/(.{4})/g, '$1 ').trim();
}
