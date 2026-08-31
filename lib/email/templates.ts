// Pure functions returning { subject, html } for each transactional email.
// Add new templates here as features grow (course purchase, week unlocked, …).

import { UPLATA, svrhaUplate, ibanZaPrikaz } from '@/lib/uplata';
import {
  nazivUsluge,
  nazivProstora,
  nazivCilja,
  nazivIzvora,
  nazivVremena,
} from '@/lib/upitnikOpcije';

const BRAND = 'Dragana Jović';
const ACCENT = '#1f3a5f'; // navy-ish, matches site palette

/**
 * Zelena iz redizajna (--navy-700 iz `components/fs-c/fs-c.css`).
 * Postojeći mejlovi (newsletter, vebinar) namerno OSTAJU na staroj
 * plavoj: oni idu sa živog sajta i nisu deo redizajna. Novi mejlovi
 * vezani za `-c` stranice nose brend zelenu. Kada klijent odobri
 * redizajn, `ACCENT` se menja u ovu vrednost i sve se izjednači.
 */
const BREND_ZELENA = '#12403C';

function shell(title: string, bodyHtml: string, accent: string = ACCENT): string {
  return `<!DOCTYPE html>
<html lang="sr">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;background:#f6f1ea;font-family:Helvetica,Arial,sans-serif;color:#2b2b2b;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:32px 0;">
    <tr><td align="center">
      <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#fffdf9;border-radius:16px;overflow:hidden;border:1px solid #e8ddcc;">
        <tr><td style="padding:28px 36px;border-bottom:1px solid #efe6d6;">
          <span style="font-size:20px;font-weight:700;color:${accent};">${BRAND}</span>
        </td></tr>
        <tr><td style="padding:32px 36px;">
          <h1 style="margin:0 0 16px;font-size:22px;line-height:1.25;color:#2b2b2b;">${title}</h1>
          ${bodyHtml}
        </td></tr>
        <tr><td style="padding:20px 36px;border-top:1px solid #efe6d6;font-size:12px;color:#8a8175;">
          ${BRAND} · Feng Shui konsalting i edukacija
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

// Minimal HTML escape for user-provided strings inserted into the templates.
function esc(s: string): string {
  return s.replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] as string),
  );
}

export function newsletterWelcome(): { subject: string; html: string } {
  return {
    subject: 'Dobrodošli — Dragana Jović Feng Shui',
    html: shell(
      'Hvala na prijavi!',
      `<p style="margin:0 0 14px;line-height:1.6;">Uspešno ste se prijavili na naš newsletter. Povremeno ćete dobijati savete o protoku energije, ritualima i usklađenom životu kroz Feng Shui.</p>
       <p style="margin:0;line-height:1.6;">Srdačno,<br>Dragana</p>`,
    ),
  };
}

export interface WebinarConfirmationData {
  fullName: string;
  startsAt?: string;
  zoomLink?: string;
}

export function webinarConfirmation(data: WebinarConfirmationData): { subject: string; html: string } {
  // Inlined to avoid pulling client/server boundary types into the email template.
  const formatted = (() => {
    if (!data.startsAt) return '';
    const d = new Date(data.startsAt);
    if (Number.isNaN(d.getTime())) return '';
    const pad = (n: number) => String(n).padStart(2, '0');
    const day = pad(d.getDate());
    const month = pad(d.getMonth() + 1);
    const year = d.getFullYear();
    const h = d.getHours();
    const m = d.getMinutes();
    const time = m === 0 ? `${h}h` : `${pad(h)}:${pad(m)}h`;
    return `${day}.${month}.${year} u ${time}`;
  })();
  const when = formatted
    ? `<p style="margin:0 0 14px;line-height:1.6;"><strong>Termin:</strong> ${formatted}</p>`
    : '';
  const link = (data.zoomLink || '').trim();
  const access = link
    ? `<p style="margin:0 0 14px;line-height:1.6;">Pristupite vebinaru klikom na dugme ispod. Ako dugme ne radi, kopirajte link ispod njega i otvorite ga u pretraživaču.</p>
       <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 14px;">
         <tr><td style="border-radius:9999px;background:${ACCENT};">
           <a href="${esc(link)}" target="_blank" rel="noopener" style="display:inline-block;padding:12px 28px;color:#fffdf9;text-decoration:none;font-weight:600;font-size:14px;border-radius:9999px;">Pristupite vebinaru</a>
         </td></tr>
       </table>
       <p style="margin:0 0 14px;line-height:1.6;word-break:break-all;font-size:12px;color:#6b6258;"><a href="${esc(link)}" target="_blank" rel="noopener" style="color:#6b6258;">${esc(link)}</a></p>`
    : '';
  return {
    subject: 'Potvrda prijave na besplatan vebinar',
    html: shell(
      'Vaša prijava je primljena',
      `<p style="margin:0 0 14px;line-height:1.6;">Zdravo ${esc(data.fullName)},</p>
       <p style="margin:0 0 14px;line-height:1.6;">Hvala što ste se prijavili za besplatan Feng Shui vebinar. Vaše mesto je rezervisano.</p>
       ${when}
       ${access}
       <p style="margin:0;line-height:1.6;">Vidimo se uskoro,<br>Dragana</p>`,
    ),
  };
}

/* ══════════════════════════════════════════════════════════════════
   PRIJAVA ZA ŠKOLU — mejl sa podacima za uplatu.

   Tekst je klijentov, prenet gotovo doslovno. Četiri odstupanja, sva
   namerna (traženo od Marka 31.08., odgovoreno; detalji u `lib/uplata.ts`):

   1. BROJ RAČUNA je pun, `115-0038163380098-95`. U instrukcijama je
      bio bez kontrolne dvocifre, a IBAN dokazuje da ide sa njom.
   2. IZNOS ZA INOSTRANSTVO je 289 €, ne 286 €, po Markovoj odluci da
      se cene ostave onako kako ih klijent daje, bez preračunavanja.
   3. SVRHA UPLATE je dodata, sa imenom prijavljenog. Nije je bilo, a
      bez nje se uplata ne može spojiti sa osobom.
   4. POTPIS je jedan. U instrukcijama se pojavljivao dvaput („Radujem
      se što ćemo raditi zajedno / Dragana Jović / telefon", pa odmah i
      „Svako dobro! / Dragana Jović / …"). Kontakti iz drugog potpisa
      su prebačeni u nogu mejla, pa nijedan podatak nije izgubljen.
   5. OSLOVLJAVANJE nosi ime: „Poštovana Ana," umesto golog „Poštovana,".

   Ostaje ženski rod, kako je klijent napisao. Ako se prijavi muškarac,
   mejl mu se obraća pogrešno. Rešenje bi bilo obraćanje samo imenom
   („Draga Ana," / „Poštovani Marko,") ili neutralno „Poštovani/a", ali
   to je promena tona koju bira klijent, ne mi.
   ══════════════════════════════════════════════════════════════════ */

const TAMNI_TEKST = '#2b2b2b';
const SITAN_TEKST = '#6b6258';

/**
 * Jedan red tabele „podaci za uplatu": naziv levo, vrednost desno.
 * Vrednost SME da sadrži HTML (npr. `mailto:` link), pa je ekranizacija
 * na pozivaocu — svaki poziv sa korisničkim tekstom prolazi kroz `esc`.
 */
interface RedPodataka {
  naziv: string;
  vrednost: string;
  istaknuto?: boolean;
}

/**
 * Sklapa tabelu iz redova. Prazni redovi se izbacuju, a POSLEDNJEM se
 * ne crta donja linija — `border-bottom:0` na poslednjem `<tr>` preko
 * CSS-a ne prolazi u svim klijentima, pa se odlučuje ovde.
 */
function tabelaPodataka(redovi: (RedPodataka | null)[]): string {
  const vidljivi = redovi.filter((r): r is RedPodataka => r !== null);
  const html = vidljivi
    .map((r, i) => {
      const linija =
        i === vidljivi.length - 1 ? 'none' : '1px solid #efe6d6';
      return `<tr>
    <td style="padding:9px 0;border-bottom:${linija};font-size:13px;color:${SITAN_TEKST};white-space:nowrap;vertical-align:top;">${r.naziv}</td>
    <td style="padding:9px 0 9px 16px;border-bottom:${linija};font-size:${r.istaknuto ? '17px' : '14px'};font-weight:${r.istaknuto ? '700' : '600'};color:${TAMNI_TEKST};text-align:right;word-break:break-word;">${r.vrednost}</td>
  </tr>`;
    })
    .join('');

  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 22px;border-collapse:collapse;background:#fffaf2;border:1px solid #e8ddcc;border-radius:12px;">
    <tr><td style="padding:6px 18px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">${html}</table>
    </td></tr>
  </table>`;
}

function podnaslov(tekst: string): string {
  return `<p style="margin:0 0 12px;font-size:11px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:#6B5518;">${tekst}</p>`;
}

export interface SkolaPrijavaData {
  fullName: string;
}

export function skolaPrijava(data: SkolaPrijavaData): { subject: string; html: string } {
  const ime = esc(data.fullName);
  const primalac = `${UPLATA.primalac}, ${UPLATA.mesto}`;

  const domaci: (RedPodataka | null)[] = [
    { naziv: 'Primalac', vrednost: primalac },
    { naziv: 'Broj računa', vrednost: UPLATA.racun },
    { naziv: 'Svrha uplate', vrednost: esc(svrhaUplate(data.fullName)) },
    { naziv: 'Iznos', vrednost: UPLATA.iznosRsd, istaknuto: true },
  ];

  const inostranstvo: (RedPodataka | null)[] = [
    { naziv: 'Primalac', vrednost: primalac },
    // Grupe po četiri: u mejlu se broj prepisuje očima, ne kopira.
    { naziv: 'IBAN', vrednost: ibanZaPrikaz() },
    { naziv: 'SWIFT', vrednost: UPLATA.swift },
    UPLATA.bankaNaziv ? { naziv: 'Banka', vrednost: UPLATA.bankaNaziv } : null,
    UPLATA.bankaAdresa ? { naziv: 'Adresa banke', vrednost: UPLATA.bankaAdresa } : null,
    { naziv: 'Iznos', vrednost: UPLATA.iznosEur, istaknuto: true },
  ];

  return {
    subject: `Prijava primljena: podaci za uplatu (${UPLATA.svrhaOsnov})`,
    html: shell(
      'Vaše mesto u grupi je rezervisano',
      `<p style="margin:0 0 14px;line-height:1.6;">Poštovana ${ime},</p>
       <p style="margin:0 0 22px;line-height:1.6;">hvala vam na prijavi. Vaše mesto u grupi je rezervisano, a prijava se potvrđuje uplatom u roku od ${UPLATA.rokSati} sati.</p>

       ${podnaslov('Podaci za uplatu')}
       <p style="margin:0 0 14px;line-height:1.6;">Uplatu možete izvršiti preko elektronskog bankarstva, u banci ili u pošti.</p>
       ${tabelaPodataka(domaci)}

       ${podnaslov('Za plaćanje iz inostranstva')}
       <p style="margin:0 0 14px;line-height:1.6;">Iznos od ${UPLATA.iznosEur} možete uplatiti na sledeći račun.</p>
       ${tabelaPodataka(inostranstvo)}

       ${podnaslov('Šta sledi posle uplate')}
       <p style="margin:0 0 22px;line-height:1.6;">Potvrdu vam šaljem istog dana kada uplata stigne, zajedno sa pristupnim podacima za platformu.</p>

       <p style="margin:0 0 14px;line-height:1.6;">Radujem se što ćemo raditi zajedno.</p>
       <p style="margin:0 0 4px;line-height:1.6;">Svako dobro,<br><strong>${BRAND}</strong></p>
       <p style="margin:0;line-height:1.7;font-size:13px;color:${SITAN_TEKST};">
         Uređenje prostora-Feng Shui<br>
         Tel: <a href="tel:${UPLATA.telefonZaLink}" style="color:${SITAN_TEKST};">${UPLATA.telefon}</a><br>
         Web: <a href="https://draganajovic.com" style="color:${SITAN_TEKST};">draganajovic.com</a><br>
         Instagram: <a href="https://instagram.com/dragana_feng_shui" style="color:${SITAN_TEKST};">dragana_feng_shui</a>
       </p>`,
      BREND_ZELENA,
    ),
  };
}

export interface SkolaPrijavaObavestenjeData {
  fullName: string;
  email: string;
  phone?: string | null;
  goal?: string | null;
  /** Sa koje `-c` stranice je prijava stigla. */
  heardFrom?: string | null;
}

/**
 * Obaveštenje Dragani da je neko rezervisao mesto. Postoji jer rok za
 * uplatu teče 48 sati: bez ovoga bi početak tog roka zavisio od toga
 * koliko često ona otvara admin panel.
 */
export function skolaPrijavaObavestenje(
  data: SkolaPrijavaObavestenjeData,
): { subject: string; html: string } {
  const ime = esc(data.fullName);
  const telefon = (data.phone || '').trim();
  const cilj = (data.goal || '').trim();
  const odakle = (data.heardFrom || '').trim();

  const redovi: (RedPodataka | null)[] = [
    { naziv: 'Ime i prezime', vrednost: ime },
    {
      naziv: 'Email',
      vrednost: `<a href="mailto:${esc(data.email)}" style="color:${TAMNI_TEKST};">${esc(data.email)}</a>`,
    },
    {
      naziv: 'Telefon',
      vrednost: telefon
        ? `<a href="tel:${esc(telefon.replace(/[^\d+]/g, ''))}" style="color:${TAMNI_TEKST};">${esc(telefon)}</a>`
        : '<span style="color:#a2988c;font-weight:400;">nije ostavljen</span>',
    },
    cilj ? { naziv: 'Najvažnije joj je', vrednost: esc(cilj) } : null,
    odakle ? { naziv: 'Stranica', vrednost: esc(odakle) } : null,
  ];

  return {
    subject: `Nova prijava za školu: ${data.fullName}`,
    html: shell(
      'Novo rezervisano mesto',
      `<p style="margin:0 0 22px;line-height:1.6;">Mesto u grupi je rezervisano. Podaci za uplatu su poslati na email, a rok od ${UPLATA.rokSati} sati teče od sada.</p>
       ${tabelaPodataka(redovi)}
       <p style="margin:0;line-height:1.6;font-size:13px;color:${SITAN_TEKST};">Prijava je upisana i u admin pregled, među ostale upite.</p>`,
      BREND_ZELENA,
    ),
  };
}

/* ══════════════════════════════════════════════════════════════════
   KONTAKT UPITNIK — potvrda pošiljaocu i obaveštenje Dragani.

   Do sada nijedan od dva nije postojao: upitnik je upisivao red u bazu
   i to je bilo sve, pa je posetilac koji popuni četiri koraka ostajao
   bez ijednog pisanog traga da je nešto poslao.

   OBA TEKSTA SU MOJA, nema ih u klijentovim materijalima. Traže pregled.

   Šifre (`homeConsultation`, `betterSleep`) se ovde prevode u srpski
   preko `lib/upitnikOpcije.ts`, jer Dragana u mejlu treba da čita ime
   usluge, ne oznaku iz baze.
   ══════════════════════════════════════════════════════════════════ */

export interface UpitPotvrdaData {
  fullName: string;
  /** Šifra usluge; prevodi se u naziv. */
  serviceType?: string | null;
}

export function upitPotvrda(data: UpitPotvrdaData): { subject: string; html: string } {
  const ime = esc(data.fullName);
  const usluga = nazivUsluge(data.serviceType);

  const zaUslugu = usluga
    ? `<p style="margin:0 0 22px;line-height:1.6;">Zabeležili smo da vas zanima: <strong>${esc(usluga)}</strong>.</p>`
    : '';

  return {
    subject: usluga
      ? `Vaš upit je primljen: ${usluga}`
      : 'Vaš upit je primljen',
    html: shell(
      'Vaš upit je stigao',
      `<p style="margin:0 0 14px;line-height:1.6;">Zdravo ${ime},</p>
       <p style="margin:0 0 14px;line-height:1.6;">hvala što ste popunili upitnik. Vaš upit je stigao Dragani i ona će vam se javiti lično, u najkraćem roku.</p>
       ${zaUslugu}
       <p style="margin:0 0 22px;line-height:1.6;">Do tada ne treba da radite ništa. Ako se u međuvremenu setite nečega što bi bilo korisno da zna, samo odgovorite na ovaj mejl.</p>
       <p style="margin:0 0 4px;line-height:1.6;">Svako dobro,<br><strong>${BRAND}</strong></p>
       <p style="margin:0;line-height:1.7;font-size:13px;color:${SITAN_TEKST};">
         Uređenje prostora-Feng Shui<br>
         Tel: <a href="tel:${UPLATA.telefonZaLink}" style="color:${SITAN_TEKST};">${UPLATA.telefon}</a><br>
         Web: <a href="https://draganajovic.com" style="color:${SITAN_TEKST};">draganajovic.com</a>
       </p>`,
      BREND_ZELENA,
    ),
  };
}

export interface UpitObavestenjeData {
  fullName: string;
  email: string;
  phone?: string | null;
  serviceType?: string | null;
  homeType?: string | null;
  mainGoals?: string[];
  challenges?: string | null;
  heardFrom?: string | null;
  additionalInfo?: string | null;
  preferredContact?: string | null;
  preferredTime?: string | null;
}

/** Slobodan tekst iz `textarea`: prelomi reda moraju da prežive u HTML-u. */
function pasus(tekst: string): string {
  return esc(tekst).replace(/\n/g, '<br>');
}

export function upitObavestenje(
  data: UpitObavestenjeData,
): { subject: string; html: string } {
  const ime = esc(data.fullName);
  const usluga = nazivUsluge(data.serviceType);
  const telefon = (data.phone || '').trim();
  const ciljevi = (data.mainGoals || []).map(nazivCilja).filter(Boolean);
  const izazovi = (data.challenges || '').trim();
  const dodatno = (data.additionalInfo || '').trim();

  const kakoDaGaDobije =
    data.preferredContact === 'phone' ? 'telefonom' : 'mejlom';
  const kada = nazivVremena(data.preferredTime);

  const redovi: (RedPodataka | null)[] = [
    { naziv: 'Ime i prezime', vrednost: ime },
    {
      naziv: 'Email',
      vrednost: `<a href="mailto:${esc(data.email)}" style="color:${TAMNI_TEKST};">${esc(data.email)}</a>`,
    },
    {
      naziv: 'Telefon',
      vrednost: telefon
        ? `<a href="tel:${esc(telefon.replace(/[^\d+]/g, ''))}" style="color:${TAMNI_TEKST};">${esc(telefon)}</a>`
        : '<span style="color:#a2988c;font-weight:400;">nije ostavljen</span>',
    },
    {
      naziv: 'Javiti se',
      vrednost: kada ? `${kakoDaGaDobije}, ${esc(kada.toLowerCase())}` : kakoDaGaDobije,
    },
    usluga ? { naziv: 'Usluga', vrednost: esc(usluga) } : null,
    data.homeType
      ? { naziv: 'Tip prostora', vrednost: esc(nazivProstora(data.homeType)) }
      : null,
    ciljevi.length
      ? { naziv: 'Ciljevi', vrednost: esc(ciljevi.join(', ')) }
      : null,
    data.heardFrom
      ? { naziv: 'Saznali za nas', vrednost: esc(nazivIzvora(data.heardFrom)) }
      : null,
  ];

  const slobodanTekst = [
    izazovi
      ? `${podnaslov('Izazovi u prostoru')}<p style="margin:0 0 22px;line-height:1.6;">${pasus(izazovi)}</p>`
      : '',
    dodatno
      ? `${podnaslov('Dodatne informacije')}<p style="margin:0 0 22px;line-height:1.6;">${pasus(dodatno)}</p>`
      : '',
  ].join('');

  return {
    subject: usluga
      ? `Nov upit: ${data.fullName} (${usluga})`
      : `Nov upit: ${data.fullName}`,
    html: shell(
      'Stigao je nov upit',
      `<p style="margin:0 0 22px;line-height:1.6;">Stigao je preko kontakt upitnika na sajtu.</p>
       ${tabelaPodataka(redovi)}
       ${slobodanTekst}
       <p style="margin:0;line-height:1.6;font-size:13px;color:${SITAN_TEKST};">Upit je upisan i u admin pregled, među ostale.</p>`,
      BREND_ZELENA,
    ),
  };
}
