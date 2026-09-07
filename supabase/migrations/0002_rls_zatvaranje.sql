-- 0002: zatvaranje pristupa podacima (RLS i grantovi), 07.09.2026.
--
-- Zatečeno stanje, pročitano iz pg_policies pre izmene:
--   inquiries      SELECT i UPDATE za sve (using true): javni ključ čita i menja
--                  sve prijave (31 red sa imenima, mejlovima i telefonima)
--   profiles       SELECT za sve, INSERT za sve (check true), UPDATE za sve
--                  (using true): javni ključ može da bilo kom profilu upiše
--                  role = 'admin', tj. da napravi sebi admin nalog
--   newsletter_subscribers, webinar_registrations
--                  svaki prijavljen korisnik (i polaznik) čita, menja i briše
--                  sve pretplatnike i prijave za vebinar
--   courses, course_modules, lessons
--                  javni ključ čita objavljene kurseve, module i lekcije
--                  (uključujući video_url u lessons); kursevi su iza prijave
--   grantovi       anon i authenticated imaju sve privilegije (i TRUNCATE) na
--                  svakoj tabeli; RLS je jedina brana
--   u redu:        enrollments, payments, zoom_links (svoje ili admin),
--                  lesson_videos (upisani ili admin), site_content (javno
--                  čitanje, admin piše), storage: images javno, course-videos
--                  po upisu i uplati
--
-- Posle ovog fajla:
--   anon           site_content čita; inquiries, newsletter_subscribers,
--                  webinar_registrations samo INSERT (API rute rade sa anon
--                  ključem na serveru); ništa drugo
--   authenticated  svoj profil (može da ga upiše i menja samo kao 'user');
--                  objavljeni kursevi, moduli i lekcije; svoje upise, uplate,
--                  zoom linkove i videe (postojeće politike)
--   admin          sve (profiles.role = 'admin', preko is_admin())
--
-- Primena: `supabase db query --linked -f supabase/migrations/0002_rls_zatvaranje.sql`
-- (primenjeno 07.09.2026. iz ove sesije), ili SQL Editor. Ceo fajl je jedna
-- transakcija: ili prođe sve, ili ništa.

begin;

-- ───────────────────────── is_admin() ─────────────────────────
-- security definer: proverava ulogu i kad sam `profiles` ima RLS, bez
-- rekurzije kroz politike. Vraća samo da/ne.
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

-- ───────────────────────── inquiries ──────────────────────────
alter table public.inquiries enable row level security;
drop policy if exists "Anyone can read inquiries" on public.inquiries;
drop policy if exists "Anyone can submit inquiry" on public.inquiries;
drop policy if exists "Anyone can update inquiries" on public.inquiries;

create policy "inquiries public insert"
  on public.inquiries for insert to anon, authenticated
  with check (true);
create policy "inquiries admin select"
  on public.inquiries for select to authenticated
  using (public.is_admin());
create policy "inquiries admin update"
  on public.inquiries for update to authenticated
  using (public.is_admin()) with check (public.is_admin());
create policy "inquiries admin delete"
  on public.inquiries for delete to authenticated
  using (public.is_admin());

-- ───────────────────────── profiles ───────────────────────────
-- Profil pravi trigger on_auth_user_created (handle_new_user, security
-- definer, zaobilazi RLS); context/AuthContext.tsx posle registracije radi i
-- upsert sopstvenog reda sa role 'user'. Niko sebi ne može da upiše 'admin'.
alter table public.profiles enable row level security;
drop policy if exists "Anyone can read profiles" on public.profiles;
drop policy if exists "Service role can insert profiles" on public.profiles;
drop policy if exists "Users can update own profile" on public.profiles;
drop policy if exists "profiles_insert" on public.profiles;
drop policy if exists "profiles_select" on public.profiles;
drop policy if exists "profiles_update" on public.profiles;

create policy "profiles own or admin select"
  on public.profiles for select to authenticated
  using (id = auth.uid() or public.is_admin());
create policy "profiles own insert as user"
  on public.profiles for insert to authenticated
  with check (id = auth.uid() and role = 'user');
create policy "profiles own or admin update"
  on public.profiles for update to authenticated
  using (id = auth.uid() or public.is_admin())
  with check (public.is_admin() or (id = auth.uid() and role = 'user'));
create policy "profiles admin delete"
  on public.profiles for delete to authenticated
  using (public.is_admin());

-- ─────────────── newsletter_subscribers, webinar_registrations ───────────────
-- Javni upis ostaje (podnožje i vebinar modal idu kroz API rute sa anon
-- ključem); čitanje, izmena i brisanje samo admin.
drop policy if exists "newsletter auth read"   on public.newsletter_subscribers;
drop policy if exists "newsletter auth delete" on public.newsletter_subscribers;
create policy "newsletter admin select"
  on public.newsletter_subscribers for select to authenticated using (public.is_admin());
create policy "newsletter admin update"
  on public.newsletter_subscribers for update to authenticated
  using (public.is_admin()) with check (public.is_admin());
create policy "newsletter admin delete"
  on public.newsletter_subscribers for delete to authenticated using (public.is_admin());

drop policy if exists "webinar auth read"   on public.webinar_registrations;
drop policy if exists "webinar auth update" on public.webinar_registrations;
drop policy if exists "webinar auth delete" on public.webinar_registrations;
create policy "webinar admin select"
  on public.webinar_registrations for select to authenticated using (public.is_admin());
create policy "webinar admin update"
  on public.webinar_registrations for update to authenticated
  using (public.is_admin()) with check (public.is_admin());
create policy "webinar admin delete"
  on public.webinar_registrations for delete to authenticated using (public.is_admin());

-- ─────────────── courses, course_modules, lessons ───────────────
-- Isti uslovi kao do sada (objavljen kurs), ali samo za prijavljene: javne
-- strane sajta ne čitaju kurseve, a strane kursa su iza prijave.
drop policy if exists "Anyone can read published courses" on public.courses;
create policy "courses authenticated read published"
  on public.courses for select to authenticated
  using (published = true);

drop policy if exists "Anyone can read modules of published courses" on public.course_modules;
create policy "modules authenticated read published"
  on public.course_modules for select to authenticated
  using (exists (select 1 from public.courses c where c.id = course_modules.course_id and c.published = true));

drop policy if exists "Anyone can read lessons of published courses" on public.lessons;
create policy "lessons authenticated read published"
  on public.lessons for select to authenticated
  using (exists (select 1 from public.courses c where c.id = lessons.course_id and c.published = true));

-- ───────────────────────── grantovi ───────────────────────────
-- RLS ne važi za TRUNCATE; anon ne treba ni INSERT/UPDATE/DELETE osim tri
-- javna upisa. SELECT anon zadržava (RLS odlučuje red po red; site_content
-- mora da se čita javno).
revoke truncate, references, trigger on all tables in schema public from anon, authenticated;
revoke insert, update, delete on all tables in schema public from anon;
grant insert on public.inquiries, public.newsletter_subscribers, public.webinar_registrations to anon;

commit;

-- Provera posle primene (anon ključ, samo broj redova):
--   inquiries, profiles, courses, lessons  ->  content-range: */0
--   site_content                           ->  i dalje čitljiv
-- i simulacija uloga u transakciji sa rollback (vidi PLAN-PRELAZAK.md).
