# draganajovic.com

Sajt Feng Shui konsultantkinje Dragane Jović: javne strane, online škola
(prijava, uplata, polaznički deo) i admin panel.

## Stek

- Next.js 16 (App Router, Turbopack), React 19, TypeScript
- Tailwind v4 za zaglavlje, podnožje, admin i polaznički deo; javne strane
  nose sopstveni CSS pod klasom `.fs-c` (`components/sajt/fs-c.css`)
- Supabase (baza, auth, storage), Resend (mejlovi), Vercel (hosting)

## Pokretanje

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # produkcioni build, isto što radi Vercel
npx tsc --noEmit   # provera tipova
```

`.env.local` (nije u repou): `NEXT_PUBLIC_SUPABASE_URL`,
`NEXT_PUBLIC_SUPABASE_ANON_KEY`, `RESEND_API_KEY`, `SKOLA_OBAVESTENJA_EMAIL`
(adresa na koju stižu obaveštenja o prijavama), po želji
`NEXT_PUBLIC_SITE_URL`.

## Raspored

- `app/(site)/` javne strane: `/`, `/school`, `/about`, `/upitnik`,
  `/uplata`, `/hvala`; komponente u `components/sajt/`
- `app/api/prijava` prijem prijava i upita (upis u bazu, pa mejlovi)
- `app/(dashboard)/`, `app/course/` polaznički deo; `app/admin/` admin panel
- `lib/uplata.ts` podaci za uplatu, jedno mesto za stranu i mejl
- `lib/upitnikOpcije.ts` šifre i nazivi opcija u kontakt upitniku

`main` je produkcija: svaki merge gradi draganajovic.com. Izvorne
fotografije i brend paket ne idu u repo (javan je); čuvaju se van njega.
