-- ─────────────────────────────────────────────────────────────
-- Newsletter + Webinar tables, RLS, and ptPLAN → Dragana Jović rebrand
-- Run once in the Supabase SQL editor.
-- ─────────────────────────────────────────────────────────────

-- 1) Newsletter subscribers ------------------------------------------------
create table if not exists newsletter_subscribers (
  id         uuid primary key default gen_random_uuid(),
  email      text not null unique,
  created_at timestamptz not null default now()
);
alter table newsletter_subscribers enable row level security;
create policy "newsletter public insert" on newsletter_subscribers
  for insert to anon, authenticated with check (true);
create policy "newsletter auth read"     on newsletter_subscribers
  for select to authenticated using (true);
create policy "newsletter auth delete"   on newsletter_subscribers
  for delete to authenticated using (true);

-- 2) Webinar registrations -------------------------------------------------
create table if not exists webinar_registrations (
  id         uuid primary key default gen_random_uuid(),
  full_name  text not null,
  birth_date date,
  city       text,
  email      text not null,
  phone      text,
  note       text,
  status     text not null default 'new',
  created_at timestamptz not null default now()
);
alter table webinar_registrations enable row level security;
create policy "webinar public insert" on webinar_registrations
  for insert to anon, authenticated with check (true);
create policy "webinar auth read"     on webinar_registrations
  for select to authenticated using (true);
create policy "webinar auth update"   on webinar_registrations
  for update to authenticated using (true);
create policy "webinar auth delete"   on webinar_registrations
  for delete to authenticated using (true);

-- 3) Brand rebrand in stored CMS content -----------------------------------
-- Case-sensitive replaces: the lowercase contact email "ptplan.rs@gmail.com"
-- is intentionally left untouched. Method phrasings are rewritten first so we
-- never produce the awkward "Dragana Jović metode/metodu".
update site_content set content = (
  replace(replace(replace(replace(replace(replace(replace(replace(
    content::text,
    'ptPLAN metode',        'autorske Feng Shui metode'),
    'ptPLAN metodu',        'autorsku metodu'),
    'ptPLAN metodologiju',  'autorsku metodologiju'),
    'ptPlan metodu',        'autorsku metodu'),
    'ptPlan metode',        'autorske Feng Shui metode'),
    'planiranja- ptPLAN',   'planiranja'),
    'ptPLAN',               'Dragana Jović'),
    'ptPlan',               'Dragana Jović')
)::jsonb
where page in ('global', 'home', 'about', 'school', 'services', 'vaza');
