# Promene od klijenta — treća runda

Izvor: klijentova poruka Marku, prosleđena 01.09.2026. Za „Tri koraka"
klijent upućuje na dokument „Promena"; taj Google dokument nije otvaran
(Drive nije povezan) niti je trebalo — sekcija je sa žive početne i tekst
joj je pročitan iz baze.

**Urađeno 01.09.:** sve stavke. Pitanja koja su iskrsla su postavljena Marku
i odgovorena istog dana; odgovori su ugrađeni u tabele.

**Legenda:** ✅ urađeno · 🅼 Markova odluka na moje pitanje · ✍️ moja odluka,
navedena da se vidi

---

## Svuda

| # | Traženo | Status |
|---|---|---|
| 1 | „F i S od Feng Shui svuda veliko, ako može automatski" | ✅ automatski |

Skripta je prošla kroz sve `-c` komponente, modal i mejlove i ispravila
**12 mesta** („feng shui", „Feng shui", „feng shui-ju"). Živi sajt nije
diran; njegov sadržaj je u bazi.

Dve odluke uz to (✍️):

- Padež je **„Feng Shui-ja"**, sa crticom. Klijent ga tako piše na dva od
  tri mesta; treće („svet Feng Shuija" u novom tekstu O meni) je
  izjednačeno.
- **Jovanin citat** na Školi („…principe feng šui prakse…") nije diran. To
  je fonetski zapis, njene reči, a nije „Feng Shui" sa F i S nego drugi
  pravopis.

---

## Početna (`/pocetna-c`)

| # | Traženo | Gde | Status |
|---|---|---|---|
| 2 | Naslov: „Feng Shui." pa novi red „Da vam se život…" | [PocetnaCContent.tsx](components/fs-c/PocetnaCContent.tsx) | ✅ |
| 3 | Podnaslov: „Milioni širom sveta već osećaju blagodeti Feng Shui-ja…" | isto | ✅ |
| 4 | Ostaje samo dugme „Upis", konsultacija se sklanja | isto | ✅ 🅼 |
| 5 | Krug „Individualne konsultacije" vodi na „Tri koraka" sa sadašnjeg sajta | isto | ✅ |

**Naslov (2).** Klijent je drugi red skratio tačkicama („Da vam se
život........"); uzeta je rečenica koja je već stajala, „Da vam se život
konačno pokrene." Prelom je tvrd (`<br>`), ne prepušten širini.

**Konsultacija (4) 🅼.** Isto dugme stoji na još dva mesta na početnoj: u
zelenoj sekciji pred kraj i u lepljivoj traci na telefonu. Marko: **skida se
samo iz heroja**, ta dva ostaju.

**Tri koraka (5).** Sekcija na `-c` početnoj nije postojala, pa je
napravljena u C dizajnu, odmah ispod krugova, sa sidrom `#tri-koraka`.
Tekst je pročitan **iz baze** (`site_content`, strana `home`, ključ
`thePlan`), ne iz `data/defaultContent.ts` — admin ga je menjao i verzija
u kodu je zastarela („Saradnja počinje sa razumevanjem" naspram „Razgovor
počinje sa razumevanjem — ne sa prodajom" u kodu).

- Naslov „Tri koraka do doma koji vas podržava", podnaslov i tri koraka
  doslovno iz baze.
- Dugme „Započnite proces" vodi na `/kontakt-c`, kao što živo vodi na
  `/upitnik`; prvi korak i glasi „Popunite upitnik".
- Sitan red **„Besplatno. Bez obaveze."** ispod dugmeta je **izostavljen**
  (✍️): klijent ga je 30.08. već izbacio iz heroja, iz istog razloga zbog
  kog sada sklanja besplatnu konsultaciju.
- **Izgled sekcije** je istog dana prerađen: od tri predloga na platnu
  (A strelice, B nit, C velike brojke) Marko je izabrao **B — Nit**: tri
  bela kruga sa zelenim obrubom na zelenoj niti koja talasa iza njih, na
  bež podlozi. Na desktopu su krugovi u redu (280px), na telefonu jedan
  ispod drugog (260px) sa uspravnom niti. Obrub i nit su prvo bili
  zlatni, na Markov zahtev prešli su na brend zelenu.
- Sidro ima `scroll-margin-top: 96px`, jer plutajući navbar na telefonu
  pokriva 76px; opštih 64px iz `.card` bi naslov stavilo pod njega.
  Provereno klikom: naslov staje na 214px, navbar se završava na 74.

---

## Škola (`/skola-c`)

| # | Traženo | Gde | Status |
|---|---|---|---|
| 6 | „Plan za 8 nedelja": dugme vodi na obrazac kao „Zakaži konsultacije" | [SkolaCContent.tsx](components/skola-c/SkolaCContent.tsx) | ✅ |
| 7 | „…škola je za vas ako": briše se „Predznanje nije potrebno." | isto | ✅ |
| 8 | „Vaš prostor ima energetsku mapu": dugme isto kao 6 | isto | ✅ |
| 9 | „Šta kažu polaznice": zelena podloga, krupnija imena | isto + [fs-c.css](components/fs-c/fs-c.css) | ✅ |

**Dugmad (6, 8).** Oba su otvarala prijavu za školu (`prijava`), sada
otvaraju modal za konsultaciju (`konsultacije`), isti kao hero. Natpis
„Pokaži mi kako moj prostor utiče na moj život" ostaje.

**Predznanje (7).** Obrisana je samo ta rečenica; ostaje „Ponesite otvoren
um i spremnost da svoj prostor vidite drugačije."

**Utisci (9).** Sekcija je sa bež (`c-sand`) prešla na brend zelenu
(`c-navy`, ista kao „Plan za 8 nedelja"). Kartice ostaju bele, pa se
kontrast citata i imena ne menja (7,36 i 13,51). Imena su sa 0,82rem
podignuta na **1,05rem** (16,8px).

---

## O meni (`/o-meni-c`)

| # | Traženo | Gde | Status |
|---|---|---|---|
| 10 | Naslov samo „Dragana Jović" | [OMeniCContent.tsx](components/fs-c/OMeniCContent.tsx) | ✅ |
| 11 | Svi ostali naslovi i podnaslovi se sklanjaju | isto | ✅ |
| 12 | Postojeći tekst se menja novim (osam pasusa) | isto | ✅ 🅼 |
| 13 | Kraj strane: umesto „Vaš sledeći korak…" ide „Ako ste spremni za promenu…", većim slovima | isto | ✅ 🅼 |

**Naslov (10) ✍️.** U poruci stoji „Dragana Jovic," sa zarezom; zarez je
shvaćen kao deo klijentove rečenice, ne naslova. Ako je zarez namerno u
naslovu, to je jedna reč.

**Nadnaslovi (11).** Izbačena su sva tri: „O Dragani" iznad naslova i dva
uz trake („Promena je počela od mog doma", „Stotine porodica"). Ta dva su
ionako bila moja, ne klijentova.

**Tekst (12).** Prenet doslovno, sa četiri odstupanja (✍️ / 🅼):

- „korak po **karak**" → „korak po korak", očigledna greška u kucanju
- dupli razmak u „svom  najbližem" skinut
- „Feng Shuija" → „Feng Shui-ja", vidi „Svuda"
- emođi 🙏 na kraju šestog pasusa: **izostavljen** 🅼

Raspored 🅼: naslov i prva dva pasusa na kremu, fotografija preko cele
širine, pa tri pasusa na bež i tri na kremu — isti ritam naizmeničnih traka
koji strana već ima. Alternativa (fotografija pa svih osam u jednoj koloni)
je ponuđena i odbijena.

**Novi tekst vraća ono što je 31.08. izbačeno:** fakultet, Mastery Academy,
25 godina i 1000 porodica. Klijent to potvrđuje („bio si u pravu, tekst
mora da se menja"), pa je samo ažurirana beleška u fajlu koja je tvrdila da
strana to nigde ne pominje.

**Završnica (13) 🅼.** Rečenica ide kao naslov sekcije (`h2`, 52px), pasusa
ispod nema. Pošto rečenica imenuje dva puta („kroz konsultacije ili kroz
učenje"), ispod nje stoje **dva dugmeta**: „Zakažite besplatan razgovor" i
„Upis u Feng Shui školu". Alternative (jedno dugme, bez dugmeta) su
ponuđene.

---

## Šta je iskrslo u radu

### Broj koraka na svetloj podlozi je padao

Opšte pravilo `.step .n` je `--gold-400`, birano za zelenu sekciju Škole.
Na beloj kartici u „Tri koraka" ista zlatna daje **2,29**, ispod praga 3:1
za krupan tekst. Svetle sekcije sada za broj koriste `--gold-700`, isti ton
koji već nose nadnaslovi na svetlom; na beloj daje 7,15.

### Kontrast, izmereno iz izračunatog CSS-a (podloge su ravne)

```
POČETNA   naslov 4,05 (prag 3, zlatna na beloj, poznato)   podnaslov 7,36
          Tri koraka: nadnaslov 5,16 · naslov 9,76 · podnaslov 5,32
                      korak naslov 13,51 · opis 7,36 · broj 7,15 (bio 2,29)
ŠKOLA     utisci: nadnaslov 9,56 · naslov 13,33 · citat 7,36 · ime 13,51
O MENI    naslov 12,37 · pasus na bež 7,95 · završna rečenica 11,51
```

### Drugi prolaz nad „Nit" je našao tri greške koje sam propustio

Posle ugradnje sekcije, nezavisan pregled iz tri ugla (raspored, pristupačnost,
regresije) sa protivnikom koji svaki nalaz pokušava da obori. Potvrđeno:

- **Ikonica u drugom krugu je bila stisnuta na 0px** i nije se videla — na
  snimku je stajalo pred očima, a promaklo je. U koloni fiksne visine flex
  prvo stiska ono što sme, a ikonica je bila jedino bez `flex: none`.
- **Tekst je pri uvećanom fontu izlazio iz kruga**: pri 16px je drugi krug na
  desktopu već imao nula slobodnog prostora, a pri Chrome-ovom „Large"
  (20px) je tekst padao preko obruba na bež. Sve mere su prešle u rem, krug
  ima `min-height` umesto `height` (ako ipak preraste, izduži se u oval a
  tekst ostane unutra), a širina mu je ograničena na 30% reda da tri kruga
  ne izađu iz kolone. Sada pri 16px ima 15–73px prostora, pri 20px 19–92.
- **`<ol>` sa `list-style: none` u Safariju gubi semantiku liste** — dodat
  `role="list"`.
- mrtvo pravilo za stare kartice koraka je uklonjeno.

Odbijeno: glatki skrol do sidra bez `prefers-reduced-motion` je globalan i
od ranije, ne od ove promene.

Pri 20px osnovnog fonta na 768px preliva se **podnožje** (Tailwind klasa u
`Footer.tsx`), ne ova sekcija; zatečeno, nije dirano.

### Dev server je bio pao

Tokom mapiranja `curl` na živu početnu nije nalazio ništa, ni jedan `h2`.
Ispostavilo se da je lokalni server bio ugašen, a ne da živa strana nema
sekciju. Podignut je ponovo; tekst „Tri koraka" je svakako uzet iz baze.

---

## Šta ostaje otvoreno od ranije

- **SWIFT `AAAARSBG`** i **naziv i adresa banke** za uplatu iz inostranstva
- **`SKOLA_OBAVESTENJA_EMAIL`** na Vercelu, adresa za obaveštenja Dragani
- tekstovi na `/hvala-c` i dva mejla za kontakt upitnik su moji, traže
  pregled
- **datum početka škole** „14. oktobar 2026." je i dalje izmišljen
- izvorne fotografije `skola-hero.jpg` i `IMG_8130.jpg` stoje u `public/`
  netrackovane; ako se ikad komituju biće javno dostupne u punoj rezoluciji
