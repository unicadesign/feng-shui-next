import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import {
  sendSkolaPrijava,
  sendSkolaPrijavaObavestenje,
  sendUpitPotvrda,
  sendUpitObavestenje,
} from '@/lib/email/send';
import type { InquiryInsert } from '@/types/inquiry';

/**
 * Prijave i upiti sa javnih strana (Škola / Početna / O meni / Kontakt).
 *
 * ZAŠTO POSTOJI: i `PrijavaModal` i upitnik su upisivali red u Supabase direktno
 * iz pretraživača. To radi, ali iz pretraživača se ne može poslati mejl, pa
 * je i prijava za školu i kontakt upit ostajao bez ijedne pisane potvrde.
 * Upis je prebačen ovamo da bi uz njega mogla da ide i pošta.
 *
 * Redosled je namerno ovakav: prvo upis u bazu, pa tek onda mejlovi. Ako
 * pošta padne, prijava je i dalje sačuvana i vidi se u admin pregledu.
 * Obrnuto ne važi, pa se ne radi obrnuto.
 *
 * Tri namere, tri ponašanja:
 *   prijava      upis u školu   -> podaci za uplatu + obaveštenje Dragani
 *   upit         kontakt strana -> potvrda prijema + obaveštenje Dragani
 *   konsultacije kratki modal   -> bez pošte, Dragana zove
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Oznake stižu iz pretraživača i završe u admin pregledu — kratimo ih. */
const MAX_OZNAKA = 120;
const MAX_IME = 160;
/** Slobodan tekst iz `textarea` polja; duži je od oznake, ali ne beskonačan. */
const MAX_TEKST = 2000;
/** Ciljeva ima deset ponuđenih; gornja granica je zaštita, ne pravilo. */
const MAX_CILJEVA = 20;

type Namera = 'prijava' | 'konsultacije' | 'upit';

function ocisti(v: unknown, max: number): string {
  return String(v ?? '')
    // Kontrolni znaci (prelom reda, tab, DEL) bi razbili prikaz u
    // admin tabeli i u mejlu. Sve ostalo prolazi netaknuto: crtica
    // mora da prezivi zbog prezimena tipa „Marić-Petrović“ i broja
    // telefona, a dijakritika zbog svih ostalih.
    .replace(/[\u0000-\u001F\u007F]+/g, ' ')
    .trim()
    .slice(0, max);
}

/**
 * Slobodan tekst zadržava prelome reda (bez njih se pasusi iz `textarea`
 * slepe u jedan blok), ali gubi ostale kontrolne znake.
 */
function ocistiTekst(v: unknown, max: number): string {
  return String(v ?? '')
    .replace(/\r\n?/g, '\n')
    .replace(/[\u0000-\u0009\u000B-\u001F\u007F]+/g, ' ')
    .trim()
    .slice(0, max);
}

function nameraIz(v: unknown): Namera {
  return v === 'prijava' || v === 'upit' ? v : 'konsultacije';
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Neispravan zahtev.' }, { status: 400 });
  }

  const namera = nameraIz(body.intent);

  const fullName = ocisti(body.full_name, MAX_IME);
  const email = ocisti(body.email, MAX_OZNAKA).toLowerCase();
  const phone = ocisti(body.phone, 60) || null;
  const serviceType = ocisti(body.service_type, MAX_OZNAKA) || 'Feng Shui (opšti upit)';
  const heardFrom = ocisti(body.heard_from, MAX_OZNAKA) || null;

  // Kratki modal šalje jedan cilj kao `goal`, upitnik listu kao `main_goals`.
  const goal = ocisti(body.goal, MAX_OZNAKA) || null;
  const mainGoals = Array.isArray(body.main_goals)
    ? body.main_goals
        .slice(0, MAX_CILJEVA)
        .map((g) => ocisti(g, MAX_OZNAKA))
        .filter(Boolean)
    : goal
      ? [goal]
      : [];

  // Samo upitnik ih šalje; modal ostavlja prazno.
  const preferredContact = body.preferred_contact === 'phone' ? 'phone' : 'email';
  const preferredTime = ocisti(body.preferred_time, 40) || null;
  const homeType = ocisti(body.home_type, MAX_OZNAKA) || null;
  const challenges = ocistiTekst(body.challenges, MAX_TEKST) || null;
  const additionalInfo = ocistiTekst(body.additional_info, MAX_TEKST) || null;

  if (!fullName) {
    return NextResponse.json({ error: 'Unesite vaše ime i prezime.' }, { status: 400 });
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: 'Unesite ispravnu email adresu.' }, { status: 400 });
  }

  const payload: InquiryInsert = {
    full_name: fullName,
    email,
    phone,
    preferred_contact: preferredContact,
    preferred_time: preferredTime,
    service_type: serviceType,
    home_type: homeType,
    main_goals: mainGoals,
    challenges,
    heard_from: heardFrom,
    additional_info: additionalInfo,
  };

  const supabase = await createClient();
  const { error } = await supabase.from('inquiries').insert([payload]);

  if (error) {
    console.error('[prijava] insert error:', error.message);
    return NextResponse.json(
      { error: 'Došlo je do greške. Pokušajte ponovo.' },
      { status: 500 },
    );
  }

  // Nijedan neuspeh pošte ne obara prijavu — red je već u bazi.
  if (namera === 'prijava') {
    const [zaPolaznika] = await Promise.all([
      sendSkolaPrijava(email, { fullName }),
      sendSkolaPrijavaObavestenje({ fullName, email, phone, goal, heardFrom }),
    ]);
    if (!zaPolaznika.sent) {
      console.error('[prijava] mejl sa podacima za uplatu nije poslat:', zaPolaznika.error);
    }
  } else if (namera === 'upit') {
    const [zaPosiljaoca] = await Promise.all([
      sendUpitPotvrda(email, { fullName, serviceType }),
      sendUpitObavestenje({
        fullName,
        email,
        phone,
        serviceType,
        homeType,
        mainGoals,
        challenges,
        heardFrom,
        additionalInfo,
        preferredContact,
        preferredTime,
      }),
    ]);
    if (!zaPosiljaoca.sent) {
      console.error('[prijava] potvrda upita nije poslata:', zaPosiljaoca.error);
    }
  }

  return NextResponse.json({ success: true });
}
