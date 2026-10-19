-- Nedelje kursa idu po kalendaru, od ponedeljka do nedelje, po UTC vremenu
-- (Marko, 19.10.2026.: „ko je upisan ove nedelje dobija odmah tu nedelju").
--
-- Do sada: lekcija se otvarala `available_after_weeks * 7` dana posle
-- datuma upisa polaznice, pa je svaka polaznica imala svoj dan u nedelji.
-- Sada: nedelja u kojoj je polaznica upisana je njena nedelja 1, a svaka
-- sledeća se otvara u ponedeljak u 00:00 UTC. `date_trunc('week', ...)` daje
-- ponedeljak te nedelje; `at time zone 'UTC'` vreme tumači kao UTC, bez
-- obzira na vremensku zonu sesije.
--
-- Uslovi uplate su prepisani nepromenjeni iz postojećeg pravila. Isto
-- računanje ima i sajt, u `components/course/LessonList.tsx`.
--
-- Primena: `supabase db query --linked -f supabase/migrations/0004_nedelje_od_ponedeljka.sql`

begin;

drop policy if exists "Enrolled, time-gated, paid users read course videos" on storage.objects;

create policy "Enrolled, time-gated, paid users read course videos"
  on storage.objects
  for select
  to public
  using (
    bucket_id = 'course-videos'
    and exists (
      select 1
      from lesson_videos lv
      join lessons l on l.id = lv.lesson_id
      join enrollments e on e.course_id = l.course_id
      where lv.video_path = objects.name
        and e.user_id = auth.uid()
        and e.start_date is not null
        and now() >= (
          date_trunc('week', e.start_date::timestamp)
          + l.available_after_weeks * interval '7 days'
        ) at time zone 'UTC'
        and (
          (
            e.payment_type = 'installment'
            and exists (
              select 1 from payments p
              where p.enrollment_id = e.id
                and p.month::numeric = ceil(l.week_number::numeric / 4)
                and p.status = 'paid'
            )
          )
          or (
            e.payment_type = 'full'
            and exists (
              select 1 from payments p
              where p.enrollment_id = e.id
                and p.status = 'paid'
            )
          )
        )
    )
  );

commit;
