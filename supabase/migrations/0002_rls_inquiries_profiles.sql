-- 0002: zatvaranje javnog čitanja tabela `inquiries` i `profiles`.
--
-- Nađeno 07.09.2026. pri proveri kontakt upitnika: javni (anon) ključ, koji
-- je ugrađen u JavaScript sajta i dostupan svakom posetiocu, mogao je da
-- PROČITA sve prijave (31 red sa imenima, mejlovima i telefonima) i sve
-- profile korisnika. Stanje je zatečeno, starije od redizajna: politike
-- su na strani baze i kod ih nije menjao.
--
-- OVAJ FAJL NIJE PRIMENJEN AUTOMATSKI. Vercel ne izvršava migracije.
-- Primena: Supabase → SQL Editor → nalepiti ceo fajl → Run; ili
-- `supabase login` pa `supabase link` i `supabase db push`.
--
-- Šta posle ovoga sme ko:
--   anon (sajt, API ruta /api/prijava)   inquiries: samo INSERT
--   prijavljen korisnik                  profiles: svoj red (čita, upiše, menja, ali samo role = 'user')
--   admin (profiles.role = 'admin')      inquiries: sve; profiles: sve
--
-- Šta se oslanja na ovo u kodu:
--   app/api/prijava/route.ts             insert u inquiries sa anon ključem
--   context/InquiryContext.tsx           admin čita i menja status prijava
--   context/AuthContext.tsx:103          posle registracije upsert sopstvenog profila sa role 'user'
--   lib/auth.ts, components/admin/*      čitanje profila (svoj red, odnosno svi za admina)

-- Ko je admin: security definer da bi se moglo proveriti i kad sam `profiles`
-- ima RLS. Funkcija ne vraća ništa osim da/ne.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;
revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

-- ───────────────────────── inquiries ─────────────────────────
alter table public.inquiries enable row level security;

-- Postojeće politike se brišu po imenu iz kataloga, jer njihova imena nisu
-- poznata iz repoa (nema migracije koja ih je napravila).
do $$
declare p record;
begin
  for p in
    select policyname from pg_policies
    where schemaname = 'public' and tablename = 'inquiries'
  loop
    execute format('drop policy %I on public.inquiries', p.policyname);
  end loop;
end $$;

create policy "inquiries public insert"
  on public.inquiries for insert
  to anon, authenticated
  with check (true);

create policy "inquiries admin select"
  on public.inquiries for select
  to authenticated
  using (public.is_admin());

create policy "inquiries admin update"
  on public.inquiries for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "inquiries admin delete"
  on public.inquiries for delete
  to authenticated
  using (public.is_admin());

-- ───────────────────────── profiles ──────────────────────────
alter table public.profiles enable row level security;

do $$
declare p record;
begin
  for p in
    select policyname from pg_policies
    where schemaname = 'public' and tablename = 'profiles'
  loop
    execute format('drop policy %I on public.profiles', p.policyname);
  end loop;
end $$;

create policy "profiles own or admin select"
  on public.profiles for select
  to authenticated
  using (id = auth.uid() or public.is_admin());

-- Sopstveni profil sme da se napravi samo kao običan korisnik: bez ovoga
-- bi svako posle registracije mogao da upiše role = 'admin'.
create policy "profiles own insert"
  on public.profiles for insert
  to authenticated
  with check (id = auth.uid() and role = 'user');

create policy "profiles own or admin update"
  on public.profiles for update
  to authenticated
  using (id = auth.uid() or public.is_admin())
  with check (public.is_admin() or (id = auth.uid() and role = 'user'));

create policy "profiles admin delete"
  on public.profiles for delete
  to authenticated
  using (public.is_admin());

-- Provera posle primene (iz terminala, sa anon ključem): oba treba da vrate
-- content-range: */0
--   curl -I -H "apikey: $ANON" -H "Authorization: Bearer $ANON" \
--        -H "Prefer: count=exact" "$URL/rest/v1/inquiries?select=id"
--   curl -I -H "apikey: $ANON" -H "Authorization: Bearer $ANON" \
--        -H "Prefer: count=exact" "$URL/rest/v1/profiles?select=id"
-- a admin panel (/admin/inquiries, /admin/users) i dalje vidi sve.
