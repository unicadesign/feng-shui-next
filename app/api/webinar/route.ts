import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getContent } from '@/lib/content';
import { sendWebinarConfirmation } from '@/lib/email/send';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Neispravan zahtev.' }, { status: 400 });
  }

  const fullName = String(body.full_name ?? '').trim();
  const email = String(body.email ?? '').trim().toLowerCase();
  const phone = body.phone ? String(body.phone).trim() : null;
  const note = body.note ? String(body.note).trim() : null;

  if (!fullName) {
    return NextResponse.json({ error: 'Unesite ime i prezime.' }, { status: 400 });
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: 'Unesite ispravnu email adresu.' }, { status: 400 });
  }

  // birth_date and city columns are kept nullable in the DB for historical
  // rows; the public form no longer collects them.
  const supabase = await createClient();
  const { error } = await supabase.from('webinar_registrations').insert([
    { full_name: fullName, email, phone, note },
  ]);

  if (error) {
    console.error('[webinar] insert error:', error.message);
    return NextResponse.json({ error: 'Greška pri prijavi. Pokušajte ponovo.' }, { status: 500 });
  }

  // Read date and Zoom link from the DB (source of truth) — the form payload
  // is ignored for these so a tampered client can't change what the email sends.
  const home = await getContent('home');
  const startsAt = home.webinarSection.startsAt || undefined;
  const zoomLink = home.webinarSection.zoomLink || undefined;

  // Email failure must not fail the registration.
  await sendWebinarConfirmation(email, { fullName, startsAt, zoomLink });

  return NextResponse.json({ success: true });
}
