import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { sendNovaRegistracija } from '@/lib/email/send';

/**
 * Obaveštenje Dragani o novom nalogu (Marko, 13.10.2026.).
 *
 * Poziva ga `/signup` odmah posle uspešne registracije. Ko je korisnik, ruta
 * NE uzima iz tela zahteva nego iz sesije (kolačić koji Supabase upravo
 * postavio), proverene preko Supabase-a. Tako niko ne može da pošalje
 * obaveštenje u tuđe ime ili za izmišljenu adresu.
 *
 * Šalje se samo za nalog napravljen u poslednjih 15 minuta, da prijavljen
 * korisnik ne bi mogao da ponavljanjem poziva zatrpa Draganin sanduče.
 */
const SVEZ_NALOG_MS = 15 * 60 * 1000;

export async function POST() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    return NextResponse.json({ error: 'Niste prijavljeni.' }, { status: 401 });
  }

  const napravljen = new Date(user.created_at).getTime();
  if (!Number.isFinite(napravljen) || Date.now() - napravljen > SVEZ_NALOG_MS) {
    return NextResponse.json({ success: true, preskoceno: true });
  }

  const ime = typeof user.user_metadata?.name === 'string' ? user.user_metadata.name : '';
  const rezultat = await sendNovaRegistracija({
    ime: ime.slice(0, 160),
    email: user.email,
    napravljen: user.created_at,
  });
  if (!rezultat.sent) {
    console.error('[nova-registracija] obaveštenje nije poslato:', rezultat.error);
  }

  return NextResponse.json({ success: true });
}
