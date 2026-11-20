# Šabloni Supabase Auth mejlova

Kopije šablona upisanih u Supabase (Authentication → Emails), da se zna šta
je tamo i da izmena ide kroz git. Upisuju se preko Management API-ja
(`PATCH /v1/projects/<ref>/config/auth`), ne čitaju se odavde automatski.

| Fajl | Polje u Supabase-u | Naslov mejla |
|---|---|---|
| `promena-lozinke.html` | `mailer_templates_recovery_content` | Nova lozinka za vaš nalog |
| `lozinka-promenjena.html` | `mailer_templates_password_changed_notification_content` | Lozinka je promenjena |

Link u mejlu za novu lozinku vodi na `{{ .SiteURL }}/nova-lozinka` sa
`token_hash`, a ne na `{{ .ConfirmationURL }}`: strana troši link tek kad
polaznica sačuva lozinku (programi za poštu znaju sami da otvore link) i
radi i kad se mejl otvori na drugom uređaju. Zato `site_url` mora biti
adresa sajta (`https://www.draganajovic.com`).
