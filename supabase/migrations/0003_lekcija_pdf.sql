-- Lekcija dobija mešanu listu sadržaja: video ili PDF dokument, u redosledu
-- koji admin izabere (Marko, 13.10.2026.).
--
-- Dokument je red u istoj tabeli `lesson_videos`, sa `kind = 'document'`.
-- Fajl se čuva u istom privatnom bucket-u `course-videos` (pod `dokumenti/`)
-- i njegova putanja ide u `video_path`. Zato ga štiti postojeće pravilo
-- „Enrolled, time-gated, paid users read course videos", koje poredi
-- `lesson_videos.video_path` sa imenom fajla: PDF vidi samo upisana polaznica
-- koja je uplatila i kojoj je lekcija otključana, kao i video.
--
-- Postojeći redovi dobijaju `kind = 'video'` i ponašaju se kao do sada.
--
-- Primena: `supabase db query --linked -f supabase/migrations/0003_lekcija_pdf.sql`

alter table public.lesson_videos
  add column if not exists kind text not null default 'video',
  -- Originalno ime fajla, za prikaz i za ime pri preuzimanju.
  add column if not exists file_name text;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'lesson_videos_kind_check'
  ) then
    alter table public.lesson_videos
      add constraint lesson_videos_kind_check check (kind in ('video', 'document'));
  end if;
end $$;
