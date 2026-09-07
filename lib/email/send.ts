import { getResend, EMAIL_FROM } from './client';
import {
  newsletterWelcome,
  webinarConfirmation,
  skolaPrijava,
  skolaPrijavaObavestenje,
  upitPotvrda,
  upitObavestenje,
  razgovorPotvrda,
  razgovorObavestenje,
  type WebinarConfirmationData,
  type SkolaPrijavaData,
  type SkolaPrijavaObavestenjeData,
  type UpitPotvrdaData,
  type UpitObavestenjeData,
  type RazgovorPotvrdaData,
  type RazgovorObavestenjeData,
} from './templates';

type SendResult = { sent: boolean; error?: string };

async function send(to: string, subject: string, html: string): Promise<SendResult> {
  const resend = getResend();
  if (!resend) {
    console.warn('[email] RESEND_API_KEY missing — skipping send to', to);
    return { sent: false, error: 'email_not_configured' };
  }
  try {
    const { error } = await resend.emails.send({ from: EMAIL_FROM, to, subject, html });
    if (error) {
      console.error('[email] Resend error:', error);
      return { sent: false, error: error.message };
    }
    return { sent: true };
  } catch (err) {
    console.error('[email] send threw:', err);
    return { sent: false, error: err instanceof Error ? err.message : 'unknown' };
  }
}

export async function sendNewsletterWelcome(to: string): Promise<SendResult> {
  const { subject, html } = newsletterWelcome();
  return send(to, subject, html);
}

export async function sendWebinarConfirmation(
  to: string,
  data: WebinarConfirmationData,
): Promise<SendResult> {
  const { subject, html } = webinarConfirmation(data);
  return send(to, subject, html);
}

/** Prijavljenom: podaci za uplatu školarine. */
export async function sendSkolaPrijava(
  to: string,
  data: SkolaPrijavaData,
): Promise<SendResult> {
  const { subject, html } = skolaPrijava(data);
  return send(to, subject, html);
}

/**
 * Dragani: obaveštenje da je neko rezervisao mesto.
 *
 * Adresa se čita iz `SKOLA_OBAVESTENJA_EMAIL` da bi mogla da se promeni
 * bez diranja koda. Ako promenljiva nije postavljena, obaveštenje se
 * PRESKAČE — ovo je propratna radnja, prijava korisnika ne sme da padne
 * zbog nje, a slanje na pogodjenu adresu je gore nego neslanje.
 */
export async function sendSkolaPrijavaObavestenje(
  data: SkolaPrijavaObavestenjeData,
): Promise<SendResult> {
  const to = (process.env.SKOLA_OBAVESTENJA_EMAIL || '').trim();
  if (!to) {
    console.warn('[email] SKOLA_OBAVESTENJA_EMAIL nije postavljen — obaveštenje o prijavi se preskače');
    return { sent: false, error: 'notify_address_not_configured' };
  }
  const { subject, html } = skolaPrijavaObavestenje(data);
  return send(to, subject, html);
}

/** Pošiljaocu kontakt upitnika: potvrda da je upit stigao. */
export async function sendUpitPotvrda(
  to: string,
  data: UpitPotvrdaData,
): Promise<SendResult> {
  const { subject, html } = upitPotvrda(data);
  return send(to, subject, html);
}

/**
 * Dragani: nov upit sa kontakt strane, sa svim odgovorima.
 *
 * Ista adresa kao i za prijave u školu (`SKOLA_OBAVESTENJA_EMAIL`) —
 * jedno mesto za sve što stigne sa sajta. Bez nje se obaveštenje
 * preskače; upit je i tako već upisan u bazu.
 */
export async function sendUpitObavestenje(
  data: UpitObavestenjeData,
): Promise<SendResult> {
  const to = (process.env.SKOLA_OBAVESTENJA_EMAIL || '').trim();
  if (!to) {
    console.warn('[email] SKOLA_OBAVESTENJA_EMAIL nije postavljen — obaveštenje o upitu se preskače');
    return { sent: false, error: 'notify_address_not_configured' };
  }
  const { subject, html } = upitObavestenje(data);
  return send(to, subject, html);
}

/** Posetiocu koji je zakazao razgovor: potvrda da će ga Dragana pozvati. */
export async function sendRazgovorPotvrda(
  to: string,
  data: RazgovorPotvrdaData,
): Promise<SendResult> {
  const { subject, html } = razgovorPotvrda(data);
  return send(to, subject, html);
}

/**
 * Dragani: nova prijava za razgovor (konsultacija, nekretnina, radionice).
 * Ista adresa i isto pravilo kao za školu i upitnik: bez
 * `SKOLA_OBAVESTENJA_EMAIL` se preskače, red je već u bazi.
 */
export async function sendRazgovorObavestenje(
  data: RazgovorObavestenjeData,
): Promise<SendResult> {
  const to = (process.env.SKOLA_OBAVESTENJA_EMAIL || '').trim();
  if (!to) {
    console.warn('[email] SKOLA_OBAVESTENJA_EMAIL nije postavljen — obaveštenje o razgovoru se preskače');
    return { sent: false, error: 'notify_address_not_configured' };
  }
  const { subject, html } = razgovorObavestenje(data);
  return send(to, subject, html);
}
