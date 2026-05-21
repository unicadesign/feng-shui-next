import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { sendNewsletterWelcome } from '@/lib/email/send';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let email: string;
  try {
    const body = await request.json();
    email = String(body.email ?? '').trim().toLowerCase();
  } catch {
    return NextResponse.json({ error: 'Neispravan zahtev.' }, { status: 400 });
  }

  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: 'Unesite ispravnu email adresu.' }, { status: 400 });
  }

  const supabase = await createClient();
  const { error } = await supabase.from('newsletter_subscribers').insert([{ email }]);

  if (error) {
    // Unique violation → already subscribed; treat as success for UX.
    if (error.code === '23505') {
      return NextResponse.json({ success: true, alreadySubscribed: true });
    }
    console.error('[newsletter] insert error:', error.message);
    return NextResponse.json({ error: 'Greška pri upisu. Pokušajte ponovo.' }, { status: 500 });
  }

  // Email failure must not fail the signup.
  await sendNewsletterWelcome(email);

  return NextResponse.json({ success: true });
}
