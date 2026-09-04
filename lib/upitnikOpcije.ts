/**
 * Ponuđeni odgovori u kontakt upitniku, na jednom mestu.
 *
 * ŠIFRE SU ENGLESKE I NE SMEJU DA SE MENJAJU. U bazu (`inquiries`) ide
 * `homeConsultation`, ne „Konsultacija za dom"; admin pregled ih vraća u
 * srpski preko svojih mapa. Promena ijedne šifre ovde znači da se stari
 * redovi u admin pregledu prikažu kao goli engleski tekst.
 *
 * ISTE VREDNOSTI POSTOJE I U ADMIN PANELU:
 *   `components/admin/AdminInquiriesContent.tsx` — mape za prikaz
 * Admin po dogovoru čeka svoju fazu (PLAN-PRELAZAK.md, faza 11); tada
 * treba da uvozi odavde i dve kopije postaju jedna. Treća kopija, stari
 * upitnik u `components/upitnik/`, obrisan je pri prelasku na novi dizajn
 * (09.2026.).
 *
 * Redosled i tekstovi su preneti doslovno sa žive strane.
 */

export interface Usluga {
  sifra: string;
  naslov: string;
  opis: string;
}

export const USLUGE: Usluga[] = [
  {
    sifra: 'homeConsultation',
    naslov: 'Konsultacija za dom',
    opis: 'Analiza vašeg životnog prostora i preporuke za harmonizaciju',
  },
  {
    sifra: 'spaceDesign',
    naslov: 'Dizajn prostora',
    opis: 'Feng Shui principi za nove gradnje ili renoviranje',
  },
  {
    sifra: 'realEstate',
    naslov: 'Procena nekretnina',
    opis: 'Evaluacija nekretnina prema Feng Shui principima pre kupovine',
  },
  {
    sifra: 'fengShuiSchool',
    naslov: 'Feng Shui škola',
    opis: '4-mesečni program obuke za Feng Shui principe i praksu',
  },
  {
    sifra: 'vazaIzobilja',
    naslov: 'Vaza Izobilja',
    opis: 'Naručivanje i konsultacija za tradicionalnu Feng Shui vazu izobilja',
  },
];

export const TIPOVI_PROSTORA: [string, string][] = [
  ['apartment', 'Stan'],
  ['house', 'Kuća'],
  ['office', 'Poslovni prostor'],
  ['newConstruction', 'Objekat u izgradnji'],
  ['other', 'Drugo'],
];

export const CILJEVI: [string, string][] = [
  ['betterSleep', 'Bolji san i odmor'],
  ['improvedRelationships', 'Unapređenje odnosa'],
  ['increasedProsperity', 'Povećanje prosperiteta'],
  ['careerAdvancement', 'Napredak u karijeri'],
  ['betterHealth', 'Poboljšanje zdravlja'],
  ['reducedStress', 'Smanjenje stresa'],
  ['improvedFocus', 'Bolja koncentracija'],
  ['familyHarmony', 'Porodična harmonija'],
  ['spiritualGrowth', 'Duhovni rast'],
  ['betterWorkLifeBalance', 'Balans posla i života'],
];

export const IZVORI: [string, string][] = [
  ['friend', 'Preporuka prijatelja'],
  ['search', 'Internet pretraga'],
  ['social', 'Društvene mreže'],
  ['event', 'Predavanje ili događaj'],
  ['article', 'Članak ili publikacija'],
  ['other', 'Drugo'],
];

export const VREMENA: [string, string][] = [
  ['morning', 'Jutro (9-12h)'],
  ['afternoon', 'Popodne (12-17h)'],
  ['evening', 'Veče (17-20h)'],
];

/** Šifra u srpski naziv; nepoznata šifra se vraća takva kakva je. */
function izMape(parovi: [string, string][], sifra: string | null | undefined): string {
  if (!sifra) return '';
  return parovi.find(([s]) => s === sifra)?.[1] ?? sifra;
}

export const nazivUsluge = (sifra?: string | null) =>
  !sifra ? '' : USLUGE.find((u) => u.sifra === sifra)?.naslov ?? sifra;
export const nazivProstora = (sifra?: string | null) => izMape(TIPOVI_PROSTORA, sifra);
export const nazivCilja = (sifra?: string | null) => izMape(CILJEVI, sifra);
export const nazivIzvora = (sifra?: string | null) => izMape(IZVORI, sifra);
export const nazivVremena = (sifra?: string | null) => izMape(VREMENA, sifra);
