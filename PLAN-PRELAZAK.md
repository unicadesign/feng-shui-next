# Plan prelaska: verzija C postaje sajt

Stanje 04.09.2026. Radna grana `feat/prelazak`, napravljena iz `feat/skola-c`
na komitu `e41bd27` (31 komit ispred `main`, `main` nema nijedan komit koji
grana nema, probni merge daje nula konflikata). Klijent je 02.09. potvrdio da
je sve traženo ugrađeno. Taj komit nosi tag `verzija-c-odobrena`.

**Cilj, Markova definicija od 04.09.: sajt postaje 1:1 ono što je danas na
verziji C.** Ono što živi na `/pocetna-c`, `/skola-c`, `/o-meni-c`,
`/kontakt-c`, `/uplata-c` i `/hvala-c` (komit `e41bd27`) postaje sajt na
pravim adresama, doslovno, spaja se na `main` i time ide uživo na
draganajovic.com. Sve javne strane koje C nema (`/vaza-izobilja`,
`/services`, `/vodic`, `/galerija`) nestaju. Admin panel se ne dira dok UI ne
prođe; faza 11 je samo popis onoga što ga čeka.

Šta 1:1 znači u praksi:

- **Ostaje doslovno**, i ono što bih inače ispravljao: tekst svih šest strana,
  traka Škole „kreće u oktobru 2026.", opis „4-mesečni program obuke" na
  kontakt strani (iako Škola kaže „8 nedelja"), moji tekstovi na `/hvala` i u
  mejlovima, dupli „| Dragana Jović" u kartici pregledača na četiri strane,
  podaci za uplatu, mejl u podnožju kakav je u bazi, vebinar traka i popup
  kakvi se vide na preview-u.
- **Ne može da bude 1:1**, jer „verzija C" prestaje da postoji: adrese bez
  `-c`, naslov Škole bez „(verzija C)", oznaka izvora prijave bez
  „(verzija C)" u bazi i u Draganinom mejlu.
- **Nije deo C, pa se ne dira:** `/login`, `/signup`, `/dashboard`,
  `/course/*`, `/admin`, strana 404. Ostaju u starom dizajnu, sa novim
  zajedničkim zaglavljem i podnožjem, do admin faze.

**Kako se prati.** Svaki korak je čekboks. Kad je urađen, uz njega ide
skraćeni heš komita. Ništa se ne štiklira bez provere iz faze 9. Ovaj fajl
se ažurira uz svaki komit i briše se kad se završi admin faza.

**Šta je izvor.** Sedam nezavisnih pregleda repoa (rute, zaglavlje, mrtav
kod, sadržaj i admin, radni fajlovi, deploy i env, SEO stringovi), 150
nalaza, svaki sa putanjom i linijom; plus provera žive produkcije i Vercela.
Brojevi linija su iz `e41bd27` i pomeraju se čim krene rad.

## Pravila koja važe tokom celog posla

- `main` je produkcija: Vercel gradi `draganajovic.com` i
  `www.draganajovic.com` isključivo sa `main`. Do faze 10 ništa ne ide na
  `main`. Pravi host je `www` (goli domen daje 307 na `www`).
- **`feat/skola-c` je zamrznuta i na nju se više ništa ne gura.** Sav rad ide
  na `feat/prelazak`. Dok je zamrznuta, njen Vercel preview
  (`feng-shui-next-git-fea-26daae-…vercel.app`) ostaje živa referenca na
  odobrenu verziju: naspram njega se rade poređenja 9.7 i 9.11, i to je link
  koji klijent ima. Tag `verzija-c-odobrena` na `e41bd27` je ista referenca u
  git-u, nezavisna od grane.
- Ništa od testiranja ne upisuje u klijentovu bazu. Jedini izuzetak je jedna
  probna prijava u koraku 9.6, uz Markovo odobrenje, i red se posle briše.
- `git add` samo po imenu fajla, nikad `git add -A`: u `public/` stoji 28
  netrackovanih originala (fotografije u punoj rezoluciji i brend paket) koji
  ne smeju na javni GitHub repo.
- Grana ni u jednom komitu ne sme da bude u stanju „rute prebačene, Header
  nije": ceo Header radi po `pathname.endsWith('-c')`, pa bi nove strane
  dobile staro zaglavlje. Rute, Header i linkovi idu u isti komit (K1).
- Bez crta (em-dash) u tekstu vidljivom na sajtu. Komit poruke na srpskom,
  malim slovom, sa telom.
- **Odobreni tekst je zamrznut.** Sve što posetilac čita na šest strana
  verzije C, u zaglavlju, podnožju i modalima, prenosi se doslovno: ni reč,
  ni broj, ni naslov u kartici pregledača se ne menja. Jedini izuzeci su u
  tabeli „Šta se ipak menja" odmah ispod. Provera 9.7 (piksel poređenje) i
  9.11 (poređenje teksta) to dokazuju posle svakog komita.

---

## Šta se ipak menja u odnosu na odobrenu verziju C

Nezavisna provera plana (tri čitača, 26 kandidata, svaki protivnički
proveren) našla je 11 mesta gde je prva verzija plana dodirivala čitljiv
tekst. Pod pravilom 1:1 ostaju samo ova:

| # | Korak | Šta se menja | Ko to čita | Zašto ne može 1:1 |
|---|---|---|---|---|
| Z2 | 3.2 | Naslov Škole „Feng Shui škola (verzija C)" → „Feng Shui škola" | posetilac (kartica), Google | oznaka preview-a |
| Z9 | 5.3 | Oznaka izvora „Početna (verzija C)" → „Početna" (isto Škola, O meni); ide u bazu, u Draganin mejl obaveštenja i u admin | Dragana, admin | oznaka preview-a; posetilac je ne vidi |
| Z11 | 4.1 do 4.5 | `/dashboard` (polaznice, iza prijave) deli zaglavlje sa sajtom: dobija „Početna", gubi natpis „Dragana Jović" pored znaka | polaznice | zaglavlje je jedno za ceo sajt |

Ovo se **ne menja**, iako sam prvo predlagao (1:1 pobeđuje):

| # | Šta ostaje kakvo je na C | Zašto sam predlagao izmenu | Ako Marko ipak hoće |
|---|---|---|---|
| Z1 | Kartica pregledača na Početnoj, O meni, Kontaktu i Hvala ima dva puta „\| Dragana Jović" (šablon dodaje sufiks na tvrdo upisan) | tehnička greška, ne tekst | jedna linija po strani, `title: { absolute }` sa današnjim naslovom bez ponovljenog dela |
| Z3 | Traka Škole na telefonu „Upis u toku / kreće u oktobru 2026." | mesec je od klijenta, dan je bio izmišljen ali se ne renderuje | klijent da drugi termin |
| Z4 | „4-mesečni program obuke…" na 2. koraku kontakt upitnika, dok Škola kaže „8 nedelja" | protivrečnost na istom sajtu | klijent kaže koje trajanje važi |
| Z5 | Podnožje bez linka za prijavu polaznica; na desktopu ulaz u `/login` postoji samo kucanjem adrese ili iz mobilnog menija | polaznice gube ulaz | link u podnožju |
| Z6 | Mejl u podnožju kakav je u bazi (vidi se na preview-u) | možda još `ptplan.rs@gmail.com` | klijent kaže, menja se u adminu |
| Z7 | SWIFT `AAAARSBG` i tabela bez redova „Banka" i „Adresa banke" | SWIFT u kodu piše „čeka potvrdu"; pogrešan SWIFT znači da uplate iz inostranstva ne prolaze | banka potvrdi ili ispravi (1.2) |
| Z8 | `/hvala` i tri mejla sa mojim tekstom | klijent ih nije ciljano čitao | klijent zatraži izmene |
| Z10 | Admin uređivači Početna, Škola, O nama bez upozorenja da sajt više ne čita te podatke | Dragana može da uređuje u prazno | ide u fazu 11 |

Provereno da se **ne** menja: sav tekst na šest strana, svi natpisi u
zaglavlju (Početna, Škola sa četiri stavke, „Sačuvaj svoje mesto", mobilni
meni), podnožje, tekst oba modala, meta opisi (prenose se doslovno,
uključujući i crtu u opisu Škole), cena „289 €", sve `alt` i `aria` oznake,
poruke grešaka, četiri C mejla.

---

## 0. Odluke koje čekaju Marka

Za svaku stoji predlog. Kad je odluka doneta, upisati je u kolonu i
štiklirati. Koraci niže pozivaju se na ove brojeve.

| # | Pitanje | Predlog | Odluka |
|---|---|---|---|
| 0.1 | Adrese ostaju `/`, `/school`, `/about`, `/upitnik`? Nove strane `/uplata` i `/hvala`? | **Da.** Na te adrese pokazuje 29+8 mesta u kodu, red `global` u bazi (navigacija, podnožje) i Google istorija. Promena bi tražila 301 sa svake i izmenu reda u bazi. | **Da** (Marko, 04.09.) |
| 0.2 | Skinuti „C" iz imena: `PocetnaCContent` → `PocetnaContent`, `components/fs-c` → `components/sajt`, `components/skola-c` u isti folder? | **Da za fajlove i komponente** (TypeScript hvata svaku propuštenu referencu). **Ne za CSS**: klasa `.fs-c` i `fs-c.css` ostaju, 1.600 linija CSS-a bez ikakve koristi za korisnika. | **Da** (Marko, 04.09.) |
| 0.3 | Ulaz u `/login` za polaznice na desktopu (novo zaglavlje ga nema, dugme je „Sačuvaj svoje mesto") | Link „Prijava za polaznice" u podnožju, u koloni „Povežimo se". Mobilni meni ga već ima. | **Ne**, 1:1 (Z5). Vraća se kao pitanje u admin fazi. |
| 0.4 | Vebinar traka i popup (stari dizajn, uključeni u bazi, vide se i na novim stranama, boje već preslikane na zelenu) | **Ostaju kao mehanizam**; Dragana ih pali i gasi u adminu. Izgled u admin fazi. Ako klijent neće traku na novom sajtu, gasi se u adminu, bez koda. | **Ostaju**, 1:1: vide se na preview-u. |
| 0.5 | `/vaza-izobilja`: javna, u sitemap-u, stari dizajn, sakrivena iz podnožja na zahtev klijenta 27.08. | Pitati klijenta: (a) ostaje kakva je, (b) ostaje ali van sitemap-a i noindex, (c) briše se uz 308 na `/`. | **Briše se** (Marko, 04.09.: „više nemamo vaza izobilja stranicu"). Ruta, komponenta, iz sitemap-a, 308 na `/`. Admin uređivač „Vaza" u fazu 11. |
| 0.6 | `/services`, `/vodic`, `/galerija`: javno već vraćaju na `/`, vidi ih samo admin | **Obrisati** strane i komponente (1.700 linija). Admin uređivač „Usluge" ostaje do admin faze. | **Brišu se**, 1:1: C ih nema. 308 na `/`, isto što posetilac i danas dobija. |
| 0.7 | Radni fajlovi: `design/` (19 fajlova), `PLAN-IZMENA.md`, `PROMENE-02.md`, `PROMENE-03.md` | **Obrisati sve.** Istorija komitova ih čuva; otvorene stavke iz njih su prenete ovde (faza 1). `PROMENE-02.md:3` nosi link ka klijentovom Google dokumentu na javnom repou. | **Da** (Marko, 04.09.) |
| 0.8 | Spajanje i grana | Marko, 04.09.: rad ide na **novoj grani `feat/prelazak`** iz `feat/skola-c`, da `feat/skola-c` ostane netaknut izvor istine za poređenje. PR `feat/prelazak` → `main`, običan merge komit (ne squash). | **Da**; grana i tag napravljeni 04.09. |
| 0.9 | `public/images/dodela-diploma-2.mp4` (47 MB, praktično ceo repo) koristi samo stara početna | **Obrisati iz stabla.** Klon se ne smanjuje bez prepisa istorije; to nije deo ovog plana. | **Da** (Marko, 04.09.) |
| 0.10 | Do admin faze uređivači Početna, Škola i O nama u adminu menjaju podatke koje sajt više ne čita | Jedna rečenica upozorenja na vrhu ta tri uređivača, da Dragana ne uređuje u prazno. | **Ne sada**, admin se ne dira (Z10). Klijentu se kaže rečima u 10.6; u fazu 11. |
| 0.11 | Analitika: nema je. `/uplata` i `/hvala` su pravljeni kao stalni linkovi baš za nju. | Van obima prelaska. Pitanje: Vercel Analytics odmah uz prelazak ili posle? | **Marko 04.09.: Google Analytics 4 (G-8V0PQW65GG) i Meta pixel (1411230116531391), odmah.** Urađeno u K6a `ffb23d0`. |
| 0.12 | Z1: dupli „\| Dragana Jović" u kartici pregledača na četiri strane | Tehnička greška, jedna linija po strani. Pod 1:1 ostaje. | |

- [ ] Sve odluke upisane (otvoreno: 0.12 dupli sufiks; ne blokira)

## 1. Podaci od klijenta

Pod pravilom 1:1 tekst ostaje kakav je, pa od ovoga puštanje blokira samo ono
što nije tekst nego činjenica koja mora da bude tačna da bi prijava i uplata
radile. Ostalo se prosleđuje klijentu kao napomena, bez čekanja.

**Blokira puštanje**

- [x] 1.4 **Adresa za obaveštenja Dragani** (`SKOLA_OBAVESTENJA_EMAIL`). Bez (Marko 04.09.: ptplan.rs@gmail.com)
      nje se svaka prijava upiše u bazu, a niko ne sazna (2.1).
- [x] 1.2 **SWIFT** `AAAARSBG` u [lib/uplata.ts](lib/uplata.ts): Marko je
      04.09. potvrdio da je to kod koji je dobio od klijenta. Komentar
      „čeka potvrdu" u fajlu se prepravlja u K1 (5.6).

**Ne blokira, prosleđuje se klijentu kao napomena (1:1 ostaje dok ne kaže)**

- [ ] 1.1 Traka Škole „kreće u oktobru 2026."
      ([SkolaCContent.tsx:649](components/skola-c/SkolaCContent.tsx#L649)):
      mesec je od klijenta; potvrditi da važi.
- [ ] 1.3 Naziv i adresa banke: prazni, redovi se ne prikazuju. Ako ih pošalje,
      pojave se na `/uplata` i u mejlu (Z7).
- [ ] 1.5 Moji tekstovi: `/hvala`
      ([HvalaCContent.tsx](components/fs-c/HvalaCContent.tsx)), mejl potvrde
      upita, mejl obaveštenja o upitu
      ([templates.ts:288-420](lib/email/templates.ts#L288-L420)) i mejl
      obaveštenja o prijavi za školu
      ([templates.ts:238-284](lib/email/templates.ts#L238-L284)). Ostaju
      doslovno ako ništa ne traži (Z8).
- [ ] 1.6 Trajanje škole: kontakt strana „4-mesečni", Škola „8 nedelja", meta
      opis Škole „Dvomesečni", opis sajta „4-mesečnu". Protivrečnost na istom
      sajtu; klijent kaže koje važi (Z4).
- [ ] 1.7 Kontakt mejl u podnožju iz baze (`siteConfig.email`); ako je još
      `ptplan.rs@gmail.com`, klijent kaže da li ostaje (Z6, menja se u adminu).

## 2. Okruženje pre spajanja (Vercel, Resend, Supabase)

Provereno 04.09.: lokalni Vercel CLI je prijavljen i projekat je povezan
(`.vercel/`, u `.gitignore`), pa env promenljive čitam i dodajem sam. Resend
odgovara na API ključ iz projekta. Admin panel ostaje jedino do čega ne mogu.

- [x] 2.1 `vercel env add SKOLA_OBAVESTENJA_EMAIL` za **Production i Preview**, (urađeno 04.09.: Production i Preview (feat/prelazak))
      čim Marko dostavi adresu. Bez nje se obaveštenja Dragani tiho preskaču
      ([send.ts:70-74, 98-102](lib/email/send.ts#L70-L102)), prijava se upiše
      u bazu, a niko ne sazna. Radim ja.
- [x] 2.2 `RESEND_API_KEY` postoji na Production i Preview (od pre 105 dana),
      kao i obe Supabase promenljive. Provereno `vercel env ls` 04.09.
- [x] 2.3 Resend: domen `draganajovic.com` je `verified`, region `eu-west-1`.
      Poslednjih šest mejlova sa preview-a (01.09. i 03.09., podaci za uplatu i
      potvrda upita) su `delivered`. Provereno preko API-ja 04.09.
- [ ] 2.4 `/admin/content/global`: `navigation`, `footer.exploreLinks`,
      `consultationButtonLink` pokazuju na `/school`, `/about`, `/upitnik`
      (uz 0.1 je to samo provera); ako `exploreLinks` još sadrži
      `/vaza-izobilja`, skloniti ga (Footer ga i sada filtrira, ali red u bazi
      ne treba da pokazuje na obrisanu stranu); `siteConfig.email` po 1.7.
- [x] 2.5 `NEXT_PUBLIC_SITE_URL=https://www.draganajovic.com` na Vercelu (urađeno 04.09., Production i Preview)
      (Production i Preview). Sitemap danas ispisuje goli domen koji
      preusmerava na `www`; zatečeno, ali jeftino za ispraviti. Radim ja, uz
      2.1.
- [x] 2.6 Lokalno `.env.local`: `SKOLA_OBAVESTENJA_EMAIL` sa Markovom adresom (urađeno 04.09., ista adresa)
      za probu iz 9.6.

## 3. Rute i meta podaci

- [x] 3.1 [app/(site)/page.tsx](app/(site)/page.tsx) renderuje novu početnu (K1 3d1c477)
      (bez `getContent`); naslov i opis preneti doslovno iz `pocetna-c`
      (stari opis sa „4-mesečnu" nestaje sa tom stranom).
- [x] 3.2 [app/(site)/school/page.tsx](app/(site)/school/page.tsx) renderuje (K1 3d1c477)
      novu Školu; naslov „Feng Shui škola" bez „(verzija C)" (Z2); opis
      prenet doslovno iz `skola-c`.
- [x] 3.3 [app/(site)/about/page.tsx](app/(site)/about/page.tsx) renderuje (K1 3d1c477)
      novo O meni; naslov i opis preneti doslovno iz `o-meni-c` (ne ostaje
      staro „O nama").
- [x] 3.4 [app/(site)/upitnik/page.tsx](app/(site)/upitnik/page.tsx) renderuje (K1 3d1c477)
      novi kontakt upitnik; naslov i opis preneti doslovno iz `kontakt-c` (ne
      ostaje staro „Upitnik"); **skinuti `robots: noindex`** (stajao je samo
      da se preview ne takmiči sa živim `/upitnik`).
- [x] 3.5 Nove rute `app/(site)/uplata/` i `app/(site)/hvala/` iz `-c` (K1 3d1c477)
      verzija; obe ostaju `noindex, nofollow` i van sitemap-a (stalni linkovi
      za analitiku, namerno).
- [x] 3.6 Obrisati `app/(site)/{pocetna-c,skola-c,o-meni-c,kontakt-c,uplata-c,hvala-c}/`. (K1 3d1c477)
- [x] 3.7 [next.config.ts](next.config.ts) `redirects()`: šest trajnih (K2 608b301)
      preusmerenja `-c` → prava adresa. Produkcija nikad nije služila `-c`
      (404 na `www`), a preview grane nosi `x-robots-tag: noindex`, pa SEO
      rizika nema; ovo je da linkovi iz prepiske sa klijentom ne padnu u 404.
      `/payment` → `/upitnik` ostaje. Uz to `/vaza-izobilja`, `/services`,
      `/vodic`, `/galerija` → `/` (308): `/vaza-izobilja` je u živom
      sitemap-u i može da bude u Google-u, a ostale tri i danas javno vraćaju
      na `/`.
- [x] 3.8 Dupli sufiks u `<title>` (Z1, odluka 0.12): korenski šablon (ne radi se, 1:1; odluka 0.12 ostaje otvorena)
      `%s | Dragana Jović` dodaje sufiks na naslov koji ga već sadrži. Danas:
      Početna „Feng Shui: put ka miru i radosti | Dragana Jović | Dragana
      Jović", O meni „O meni | Dragana Jović, Feng Shui | Dragana Jović",
      Kontakt „Kontakt | Dragana Jović | Dragana Jović", Hvala „Hvala na
      prijavi | Dragana Jović | Dragana Jović". **Pod 1:1 ostaje tako.** Ako
      0.12 kaže da se ispravi: na te četiri strane `title: { absolute: '…' }`
      sa današnjim naslovom bez ponovljenog dela, ništa drugo. Škola i Uplata
      se ne diraju ni tada.
- [x] 3.9 [app/sitemap.ts](app/sitemap.ts): `''`, `about`, `school`, (K2 608b301)
      `upitnik`; `vaza-izobilja` izlazi. [app/robots.ts](app/robots.ts) bez
      izmene.
- [x] 3.10 [app/not-found.tsx](app/not-found.tsx): linkovi na `/` i `/upitnik` (provereno 04.09. na preview-u)
      ostaju tačni. Strana je u starom dizajnu; zabeležiti za admin fazu.
- [x] 3.11 [proxy.ts:34-38](proxy.ts#L34-L38): u izuzetke matchera dodati (K2 608b301)
      `avif|mp4|ico|txt|xml`, da hero slike, sitemap i robots ne prolaze kroz
      osvežavanje Supabase sesije. Sitnica, ne blokira.

## 4. Zaglavlje i podnožje

Sve u [components/Header.tsx](components/Header.tsx). Ovo je jedina tačka
gde stari i novi sajt dele kod, i jedini korak koji pravi štetu ako se
preskoči.

- [x] 4.1 Obrisati `isCPreview`, `C_PREVIEW_ROUTES`, `cHref` i mapiranje (K1 3d1c477)
      linkova (l.20-29, 73, 86, 102-108); oba logo linka na `/`.
- [x] 4.2 `C_SKOLA_SIDRA` → `/school#program`, `#za-koga`, `#rezultati`, (K1 3d1c477)
      `#faq`; uslov `link.to === '/skola-c'` → `/school` (l.36-43, 228).
      Inače padajući meni „Škola" tiho nestaje.
- [x] 4.3 `imaModalZaPrijavu` → `/`, `/school`, `/about` (strane koje montiraju (K1 3d1c477)
      modal); rezervni `href="/skola-c"` → `/school` (l.84-85, 366).
- [x] 4.4 Logo `logo-zlatni.png` bezuslovno (l.217, 395); obrisati span (K1 3d1c477)
      „Dragana Jović" pored znaka u obe varijante (l.209-224, 390-403).
- [x] 4.5 Stavka „Početna" u navigaciji bezuslovno iz koda (l.87-101); u bazu (K1 3d1c477)
      prelazi u admin fazi.
- [x] 4.6 [enrollTrigger.ts](components/fs-c/enrollTrigger.ts) **ostaje**: (K1 3d1c477)
      most između Header-a (van `.fs-c`) i modala u strani nije preview
      rešenje nego mehanizam. Ispraviti komentar koji tvrdi da se briše;
      preimenovati događaj bez „fs-c" po 0.2.
- [x] 4.7 Ulaz u login: **ne radi se** (0.3, 1:1). Ostaje u mobilnom meniju (ne radi se, 1:1)
      i kucanjem adrese.
- [x] 4.8 Sitnica: kašnjenje animacije mobilnog menija računa (K1 3d1c477)
      `navLinks.length` umesto `navLinksResolved.length` (l.497).
- [x] 4.9 [Footer.tsx](components/Footer.tsx): bez izmena u kodu; linkovi (K1 3d1c477)
      dolaze iz baze (2.4). `HIDDEN_ROUTES` u Header-u i Footer-u ostaju kao
      zaštita od starih vrednosti u bazi.
- [x] 4.10 Blok `body:has(.fs-c) { --color-* }` u (K1 3d1c477)
      [fs-c.css:1016-1061](components/fs-c/fs-c.css#L1016-L1061) **ostaje**:
      on boji Header, Footer i vebinar na novim stranama, dok `/login`,
      `/signup`, `/dashboard` i `/admin` i dalje nose staru paletu iz
      `globals.css`. Komentar koji kaže „briše se u Izmeni 03" prepraviti.
- [x] 4.11 Lepljiva traka: pravilo `body:has(.fs-c .sticky) .fs-c ~ footer` (K1 3d1c477)
      traži da `.fs-c` i `<footer>` budu braća u
      [app/(site)/layout.tsx](app/(site)/layout.tsx). Ne uvijati `{children}`.

## 5. Nove komponente

- [x] 5.1 Preimenovanje po 0.2 (fajlovi, izvozi, uvozi; `tsc` posle). (K1 3d1c477)
- [x] 5.2 Svi linkovi na `-c` rute: PocetnaC 32, 39, 46, 55, 190, 353; OMeniC (K1 3d1c477)
      45, 52; SkolaC 28, 35; UplataC 211; HvalaC 60, 63; KontaktC 250.
      Provera: grep za `/pocetna-c`, `/skola-c`, `/o-meni-c`, `/kontakt-c`,
      `/uplata-c` i `/hvala-c` u `app`, `components`, `lib` daje nula
      (klasa `fs-c` namerno ostaje).
- [x] 5.3 `heardFrom` koji ide u bazu i u Draganin mejl: „Početna (verzija C)" (K1 3d1c477)
      → „Početna", „Škola (verzija C)" → „Škola", „O meni (verzija C)" →
      „O meni" (PocetnaC 388, SkolaC 664, OMeniC 194). Redovi već upisani
      tokom pregleda zadržavaju staru oznaku; mapa u adminu ide u fazu 11.
- [x] 5.4 Lepljiva traka Škole ostaje „kreće u oktobru 2026." (Z3); menja se (K4 285d35f)
      samo ako klijent odgovori na 1.1. Sakriveni blok „Upis" (SkolaC
      572-643) sa izmišljenim datumom se **briše**: ne renderuje se, a
      ostavljen bi jednog dana bio otkomentarisan sa izmišljenim datumom.
- [x] 5.5 Cena „289 €" upisana dvaput u SkolaC (331, 605) → `UPLATA.iznosEur`, (K1 3d1c477)
      jedan izvor za jedan broj; renderovani tekst identičan.
- [x] 5.6 Komentari koji pominju „verzija C", „preseljenje", „Izmena 03" i (K1 3d1c477)
      putanje `design/…` postaju trajni opisi: route.ts 12, FsCModal 53,
      PocetnaC 60-61, SkolaC 67-68, OMeniC 9, KontaktC 15-27, HvalaC 7 i 16,
      UplataC 9, fs-c.css 2, 644, 1021-1029, 1170-1171, 1242-1257,
      lib/uplata.ts 2, upitnikOpcije.ts 9-14, templates.ts 16-21 i 243.
- [ ] 5.7 Trajanje škole (upitnikOpcije.ts 44, app/layout.tsx 19) ostaje
      „4-mesečni" (Z4); menja se samo ako klijent odgovori na 1.6.
- [x] 5.8 Imena slika sa `-c` (`pocetna-c-hero-bela*`, `skola-c-hero-zeleni*`, (K1 3d1c477)
      `o-meni-c-traka*`, `skola-c-o-meni.jpg`) **ostaju**: vide se samo u
      URL-u slike, a preimenovanje je 16 referenci bez koristi.

## 6. Mejlovi i API

- [x] 6.1 [templates.ts:14](lib/email/templates.ts#L14): `ACCENT` (stara plava (K3 bef965e)
      `#1f3a5f`) → `BREND_ZELENA`; newsletter i vebinar mejlovi prelaze na
      zelenu, kao što komentar predviđa.
- [x] 6.2 [app/api/prijava/route.ts](app/api/prijava/route.ts): samo komentar (K1 3d1c477)
      (5.6), bez logičkih izmena.
- [ ] 6.3 [lib/uplata.ts](lib/uplata.ts): SWIFT po 1.2 (blokira), naziv i
      adresa banke po 1.3 (samo ako stignu).
- [ ] 6.4 Šabloni sa mojim tekstom: bez izmene, osim ako klijent posle 1.5
      nešto zatraži.

## 7. Brisanje starog koda

Nijedna nova komponenta ne uvozi ništa iz starog skupa (provereno po svakom
uvozu), pa stari skup može u jednom potezu. Ostaje sve što dele admin, kurs,
login i API: `Button`, `CmsImage`, `lib/animations` (deo), `lib/content`,
`data/defaultContent` (deo), tipovi.

- [x] 7.1 Komponente koje uvoze samo stare rute (24 fajla, 5.400 linija): (K4 285d35f)
      `components/home/*` (HomeContent, NewsletterSignup, ServiceCard,
      TestimonialCard, WebinarCTA), `school/SchoolContent.tsx`,
      `about/AboutContent.tsx`, `upitnik/UpitnikContent.tsx`,
      `services/ServicesContent.tsx`, `guide/*` (6), `gallery/GalleryContent.tsx`,
      `ui/container-scroll-animation.tsx`, `Section.tsx`, `SectionTitle.tsx`,
      `TrustBadges.tsx` i ostali iz pregleda; `vaza/VazaContent.tsx` i
      `CTASection.tsx` (poslednji korisnik je Vaza). `Button.tsx` ostaje
      (login, signup, kurs, admin).
- [x] 7.2 Rute `app/(site)/{services,vodic,galerija,vaza-izobilja}/`. (K4 285d35f)
      Admin uređivači „Usluge" i „Vaza" (i redovi `services`, `vaza` u bazi)
      ostaju do faze 11.
- [x] 7.3 [lib/animations.ts](lib/animations.ts): `staggerContainer`, (K4 285d35f)
      `staggerItem`, `scrollRevealDelayed`, `fadeInScale` gube poslednjeg
      korisnika; `scrollReveal` i `viewportOnce` ostaju (kurs).
- [x] 7.4 [types/content.ts](types/content.ts) tipovi za `gallery` i `guide` (K4 285d35f)
      (396-430, 462-511, ključevi 520 i 522) i njihove sekcije u
      [data/defaultContent.ts](data/defaultContent.ts) (1078-1106, 1148-1415),
      uz reference u `lib/content.ts:6` i `context/ContentContext.tsx:10`.
      Sekcije `home`, `school`, `about`, `services`, `vaza` **ostaju** do admin
      faze: admin uređivači ih tipiziraju.
- [x] 7.5 [app/globals.css:76-102](app/globals.css#L76-L102): `fadeIn` (K4 285d35f)
      animacije (samo stari upitnik) i `grain` (bez korisnika).
- [x] 7.6 `react-intersection-observer` iz `package.json` (samo stara Škola i (K4 285d35f)
      Usluge); `npm install` da se osveži lock.
- [x] 7.7 `public/`: `images/bg-hero.png`, `images/logo-bg.png`, (K4 285d35f)
      `logo/logo-transparent.png` (979 KB, beli kvadrat), `images/dragana-hero.avif`
      i `.webp` (nikad referencirane), `logo/Logo bez linija i pozadine-24-04.png`,
      `-24-06.png` (izvor za `logo-zlatni`, čuva se van repoa), `logo/simbol-20.png`
      (samo u pet komentara kao izvor geometrije; van repoa, komentari
      prepravljeni), `file.svg`, `globe.svg`, `next.svg`, `vercel.svg`,
      `window.svg` (create-next-app), `images/dodela-diploma-2.mp4` po 0.9.
      `images/hero.jpeg` i `images/dragana-joivc.webp` **ostaju** do admin
      faze (baza i admin Početne ih još pominju).
- [x] 7.8 [README.md](README.md): create-next-app tekst → kratak opis (K4 285d35f)
      projekta (stek, env promenljive, kako se pokreće).
- [x] 7.9 Provera posle brisanja: `npx tsc --noEmit`, `npm run build`, (K4 285d35f)
      `npx eslint .` bez novih grešaka (zatečeno: 60 grešaka u admin i vebinar
      fajlovima, nula u novim komponentama).

## 8. Čišćenje radnog stabla i repoa

- [x] 8.1 28 netrackovanih fajlova iz `public/` premestiti van repoa, npr. u (K5 347e184)
      `~/Documents/____wbsites/feng-shui-izvori/` (2 fotografije, 26 PNG iz
      brend paketa); `git status` čist.
- [x] 8.2 [.gitignore](.gitignore): pravila koja štite `public/` od originala (K5 347e184)
      (`public/images/IMG_*.jpg`, `public/images/*-hero.jpg`,
      `public/logo/LOGO GAGA*`, `public/logo/prvenc*`, `public/logo/Paleta*`,
      `public/logo/Logo bez linija*`). Danas ih ništa ne štiti od `git add`.
- [x] 8.3 `design/` obrisati po 0.7; tri komentara koja ga citiraju su u 5.6. (K5 347e184)
- [x] 8.4 `PLAN-IZMENA.md`, `PROMENE-02.md`, `PROMENE-03.md` po 0.7. (K5 347e184)
- [x] 8.5 Provereno: u repou nema scratch skripti, `.env*` nikad nije (K5 347e184)
      procureo, nema stash-a. Ništa za raditi.

## 9. Provera pre spajanja

Radi se na lokalnom buildu i na preview deploymentu grane
(`feng-shui-next-git-fea-26daae-…vercel.app`), po svakom komitu K1 do K5 i
jednom u celini na kraju.

- [x] 9.1 `npm run build` lokalno čist; Vercel preview zelen. (build čist posle K1, K4; Vercel preview grane Ready za svaki push)
- [x] 9.2 Rute: `/`, `/school`, `/about`, `/upitnik`, `/uplata`, `/hvala` (04.09. na preview-u grane: 23 adrese, sve po očekivanju)
      daju 200; šest `-c` adresa daje 308 na pravu; `/payment` 308 na
      `/upitnik`; `/services`, `/vodic`, `/galerija`, `/vaza-izobilja` 308
      na `/`; `/login`, `/signup` 200; `/dashboard` i `/admin` preusmeravaju
      na login; `/sitemap.xml` (bez vaze) i `/robots.txt` tačni.
- [x] 9.3 Meta: `<title>` bez duplog sufiksa i bez „verzija C"; `noindex` (04.09. na preview-u: naslovi kao odobreni, noindex samo /uplata i /hvala, sitemap četiri adrese sa www)
      samo na `/uplata` i `/hvala`; opisi usklađeni (1.6).
- [x] 9.4 Zaglavlje na svih šest strana na 360, 768 i 1280 px: zlatni logo (04.09. skript na preview-u: 18 od 18 kombinacija)
      bez natpisa, „Početna", padajući meni „Škola" sa četiri sidra koja
      skroluju do sekcije, „Sačuvaj svoje mesto" otvara modal na tri strane i
      vodi na `/school` na ostale tri; mobilni meni; ulaz u login po 0.3.
- [x] 9.5 Tokovi bez upisa u bazu (CDP presretanje `POST /api/prijava`): (04.09. lokalno, dva puta (posle K1 i posle K5): 9 od 9)
      modal prijava → `/uplata`; modal konsultacije → `/hvala`; kontakt
      upitnik → `/hvala`; greška servera pokazuje poruku, dugme se otključa.
- [ ] 9.6 **Jedna prava probna prijava** na preview-u, uz Markovo odobrenje.
      Resend pokazuje da su mejlovi posetiocu (podaci za uplatu, potvrda
      upita) već stizali sa preview-a 01.09. i 03.09., pa taj krak nije
      sporan. Neprovereno je jedino obaveštenje Dragani, jer adresa još ne
      postoji: kad stigne, prvo je postaviti na Markovu adresu, poslati jednu
      prijavu i jedan upit, potvrditi da oba obaveštenja stižu i da se redovi
      vide u `/admin/inquiries` sa oznakom bez „(verzija C)", obrisati redove,
      pa prebaciti adresu na Draganinu.
- [x] 9.7 Vizuelno: snimci šest strana na tri širine, piksel poređenje sa (04.09. preview grane naspram zamrznutog preview-a: 17 od 18 nula razlike, na / pri 360 px jedan piksel; dimenzije identične)
      istim `-c` stranama na zamrznutom preview-u grane `feat/skola-c`
      (`e41bd27`, tag `verzija-c-odobrena`); sme da se razlikuje samo ono
      što je navedeno u tabeli (Z2 naslov Škole, linkovi bez `-c`). Pod 1:1
      razlika sme da bude nula piksela na sadržaju strane. Podnožje na
      telefonu ima rezervu za lepljivu traku (68 px).
- [x] 9.8 Strane koje ostaju u starom dizajnu (`/login`, `/signup`, (04.09. na preview-u: login i signup 200, dashboard i admin vode na login)
      `/dashboard`, `/admin`) i dalje se renderuju, stara paleta, ništa
      polomljeno. Na `/dashboard` zaglavlje sada nosi „Početna" i nema natpis
      pored znaka (Z11); potvrditi da izgleda razumno.
- [x] 9.9 Grep provere daju nulu: `-c` rute, `isCPreview`, `C_PREVIEW_ROUTES`, (04.09.: grep nula)
      „verzija C" u `app/`, `components/`, `lib/`.
- [x] 9.10 Kontrast se ne meri ponovo: podloge i boje su iste kao na `-c` (nije potrebno)
      stranama izmerenim 27.08. do 02.09. Meri se samo ono što je novo (0.3).
- [x] 9.11 **Poređenje teksta**: za svaku od šest strana skinuti sav vidljivi (04.09. preview grane naspram zamrznutog: tekst identičan 18 od 18, jedina razlika naslov Škole (Z2))
      tekst (`innerText`) i `<title>` sa `-c` rute na zamrznutom preview-u
      `feat/skola-c` i sa prave rute na preview-u `feat/prelazak`; `diff` sme da pokaže samo Z2 (naslov Škole)
      i, ako 0.12 to odobri, Z1. Isto za četiri C mejla (renderovan HTML na
      istim probnim podacima): razlika sme da bude samo oznaka izvora (Z9).
      Ovo je dokaz za pravilo 1:1.

## 10. Spajanje i puštanje

- [ ] 10.0 **Uslov za spajanje:** 1.4 postavljeno na Vercelu i 1.2 potvrđeno
      (ili klijent svesno pušta bez potvrde, upisano u 1.2). Ostalo iz faze 1
      ne čeka se: pod 1:1 tekst ide kakav je na preview-u.
- [x] 10.1 PR `feat/prelazak` → `main`: opis šta se menja za posetioce, šta za (otvoren 04.09.: https://github.com/unicadesign/feng-shui-next/pull/11)
      Draganu (tekst do admin faze ide preko Marka), kako se vraća.
- [x] 10.2 Pre klika zabeležiti trenutni produkcioni deployment (zabeleženo, vidi tekst koraka)
      `dpl_r6vNxQ8xBjK4AmxSaB9g7tpBmo6e` (komit `daa2eb6`, 18.06.). Povratak:
      Vercel → Deployments → taj deployment → „Promote to Production", traje
      sekunde, ne dira git.
- [ ] 10.3 Merge (običan merge komit); pratiti produkcioni build do „Ready".
- [ ] 10.4 Smoke test na `https://www.draganajovic.com`: 9.2 i 9.3 skraćeno,
      zaglavlje na telefonu i desktopu, jedan modal otvoren bez slanja. Na
      produkciji se ništa ne šalje; 9.6 je to pokrio.
- [ ] 10.5 Google Search Console: sitemap poslati ponovo, zatražiti
      indeksiranje `/`, `/school`, `/about`, `/upitnik`.
- [ ] 10.6 Poruka klijentu: šta je novo, da provere da im stižu obaveštenja
      na adresu iz 1.4, da izmene teksta do admin faze idu preko Marka i da
      uređivači Početna, Škola i O nama u adminu do tada ne utiču na sajt
      (Z10); uz to napomene iz 1.1, 1.3, 1.5, 1.6, 1.7.
- [ ] 10.7 48 sati posle: `/admin/inquiries`, Resend log, Vercel runtime
      errors (Hobby plan čuva logove oko sat vremena, pa se gleda odmah).
- [ ] 10.8 `feat/skola-c` ostaje zamrznuta do kraja admin faze kao referenca
      (tag `verzija-c-odobrena` ostaje zauvek); ovaj fajl se ažurira i onda
      briše.

## 11. Admin faza (popis, radi se posle UI)

Ništa od ovoga se ne radi sada. Popis stoji da se ne zaboravi.

- Odluka 2 iz starog plana: koji delovi novih strana idu na `getContent`
  (predlog od ranije: cena, datumi upisa, utisci, FAQ; naslovi i opisi
  sekcija ostaju u kodu).
- Uređivači Početna (13 od 14 sekcija), Škola (sve) i O nama (sve) menjaju
  podatke koje sajt ne čita; `Usluge` i `Vaza` uređuju strane koje više ne
  postoje. Ostaju samo `Podešavanja` (navigacija, podnožje, kontakt) i
  prekidač vebinara. Do tada: upozorenje u tim uređivačima (Z10) ili
  njihovo sklanjanje.
- Ulaz u `/login` za polaznice na desktopu (Z5): link u podnožju ili u
  zaglavlju, kad se zaglavlje bude prevezivalo na admin.
- `heardFromLabels` u [AdminInquiriesContent.tsx:40-47](components/admin/AdminInquiriesContent.tsx#L40-L47):
  dodati „Početna", „Škola", „O meni" i stare „(verzija C)" varijante.
- `service_type` iz modala je slobodan srpski tekst u sedam varijanti
  (isti upis u školu stiže kao `fengShuiSchool`, „Feng Shui škola" i
  „Feng Shui škola (kurs)"); svesti na šifre iz `lib/upitnikOpcije.ts`.
- Tri kopije rečnika šifara (`lib/upitnikOpcije.ts`, stari upitnik koji
  nestaje u 7.1, admin mape) → jedna. Postojeći raskorak: `newConstruction`
  „Objekat u izgradnji" naspram „Novogradnja" u adminu.
- Natpis „Sačuvaj svoje mesto" i stavka „Početna" iz koda u bazu
  (`global.header`, `global.navigation`).
- Mrtva polja u adminu: `footer.tagline`, `home.newsletter.*`.
- Vebinar traka, popup i modal u novom dizajnu.
- `/login` i `/signup` nose natpis „ptPLAN"; `not-found` u starom dizajnu.
- 60 eslint grešaka u admin i vebinar fajlovima; engleski `aria-label`
  „Toggle menu" i „Close menu".

## Redosled komitova na grani `feat/prelazak`

Prvi komit na grani je ovaj fajl (K0), da plan i rad idu zajedno.

Svaki komit prolazi `tsc`, `build` i 9.2 pre nego što se gurne.

| Komit | Sadržaj | Faze |
|---|---|---|
| K1 | rute na nove komponente, Header bez `-c` prekidača, linkovi i oznake u komponentama, preimenovanje | 3.1 do 3.6, 3.8, 4.1 do 4.6, 4.8, 4.10, 5.1 do 5.3, 5.6 |
| K2 | preusmerenja, sitemap, proxy | 3.7, 3.9, 3.11 |
| K3 | mejlovi na zelenu | 6.1, 6.2 |
| K4 | brisanje starog koda i mrtvih fajlova | 7.1 do 7.9 |
| K5 | čišćenje repoa | 8.1 do 8.4 |
| pregled | `5735752` | 04.09. | faza 9 | nezavisni pregled cele grane naspram `main` (4 čitača + provera): 0 stvarnih nalaza od 5 kandidata |
| K6a | `ffb23d0` | 04.09. | 1.4, 2.1, 2.6, 0.11 (analitika) | tsc i eslint čisti; GA i pixel provereni sa presretnutim zahtevima: po jedan PageView na učitavanje, klik kroz meni i posle prijave; piksel poređenje sa zamrznutim preview-om nepromenjeno; nezavisni pregled izmene |
| K6b | `aa031bb` | 04.09. | ispravka analitike posle pregleda (pixel u klijentskoj komponenti, preview bez merenja) | test sa presretnutim zahtevima: 4 od 4 slučaja po jedan PageView; tsc i eslint čisti |
| K6 | samo ako klijent nešto promeni ili potvrdi (1.2 SWIFT pre spajanja; ostalo kad i ako stigne) | 1.x → 5.4, 5.7, 6.3, 6.4 |

K1 je jedini koji ne sme da se deli: rute i Header idu zajedno. Od K6 pre
spajanja ide samo SWIFT (10.0); ostalo može i posle, kao obična izmena.

## Dnevnik komita na `feat/prelazak`

Ovde se vidi dokle se stiglo, ako se sesija prekine. Svaki red je jedan
komit, sa proverama koje su prošle pre guranja.

| Komit | Heš | Datum | Zatvoreni koraci | Provere pre guranja |
|---|---|---|---|---|
| K0 | `ca6d5ce` | 04.09. | plan | |
| K1 | `3d1c477` | 04.09. | 3.1 do 3.6, 4.1 do 4.6, 4.8 do 4.11, 5.1 do 5.3, 5.5, 5.6, 5.8, 6.2, SWIFT iz 6.3, 2.5 | tsc čist; `next build` čist; šest ruta 200, stare `-c` 404; vidljivi tekst identičan zamrznutom preview-u na 18 od 18 kombinacija (jedina razlika naslov Škole, Z2); piksel poređenje 0 različitih piksela na 18 od 18; tokovi prijave, konsultacija, kontakta i greške servera 9 od 9 sa presretnutim `/api/prijava`; nezavisni pregled (3 čitača + provera): 1 stvaran nalaz o kompletnosti komita i 1 o zastarelim komentarima, oba ispravljena pre komita |
| K2 | `608b301` | 04.09. | 3.7, 3.9, 3.11 | tsc čist; 11 preusmerenja 308 sa tačnim odredištem; sitemap četiri adrese; šest ruta 200 |
| K3 | `bef965e` | 04.09. | 6.1 | tsc čist; stara plava više nigde u šablonima |
| K4 | `285d35f` | 04.09. | 7.1 do 7.9, 5.4 (sakriveni blok obrisan; traka ostaje) | tsc čist; build čist (17 ruta, bez ugašenih); grep bez zaostalih referenci; rute 200 i 308; vidljivi tekst identičan zamrznutom preview-u 18 od 18 |
| K5 | `347e184` | 04.09. | 8.1 do 8.5 | radno stablo bez nepraćenih fajlova; 28 originala u ../feng-shui-izvori |

## Zatečeno, van obima

Zabeleženo da se zna da nije zaboravljeno; ne dira se u prelasku.

- Podnožje se preliva pri 20 px osnovnog fonta na 768 px (Tailwind klasa).
- Glatki skrol do sidra bez `prefers-reduced-motion` je globalan.
- `localStorage` ključevi sa prefiksom `ptplan_`.
- 42 `picsum.photos` URL-a u `defaultContent.ts` (fallback slike admina).
- Na Vercelu je isključena svaka zaštita preview deploymenata; preview link
  je javan za svakog ko ga ima.
