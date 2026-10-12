/**
 * Prikaz cene kursa na nalogu polaznice: sekcija „Izaberite način
 * plaćanja" na stranici kursa i cena na kartici dostupnog kursa.
 *
 * PRIVREMENO isključeno (Marko, 12.10.2026.), dok polaznice ulaze u školu
 * preko uplate na račun (`/uplata`) i upisa u adminu. Dugme „Kupi kurs
 * putem PayPal" ionako još ne radi. Vraća se postavljanjem na `true`.
 */
export const PRIKAZI_CENU_KURSA = false;

/**
 * Prikaz plaćanja polaznici: kartica „Plaćanje" (npr. „1/3 uplata") na
 * stranici kursa, sekcija „Vaša plaćanja" na „Moji kursevi" i okvir
 * „Status uplata" pored lekcije.
 *
 * PRIVREMENO isključeno (Marko, 13.10.2026.: „to nećemo da se sada
 * prikazuje korisniku"). Pravila pristupa lekcijama i dalje gledaju uplate,
 * a poruka na zaključanoj lekciji ostaje. Vraća se postavljanjem na `true`.
 */
export const PRIKAZI_PLACANJE_POLAZNICI = false;
