# Plan izmena — draganajovic.com

Radni spisak svih izmena koje je klijent tražio. Prvo se sve upiše, tek onda
se radi. Svaka izmena ima isti oblik: šta je traženo, šta to dodiruje u kodu,
šta je nerazjašnjeno i kolika je.

**Status oznake:** `SKUPLJA SE` (još se dopunjava) · `SPREMNO` (može da se radi)
· `U RADU` · `GOTOVO`

---

## Obim, potvrđen 24.08.2026.

Izmene se odnose **isključivo na redizajn C**, dakle na tri strane:

- `/skola-c`
- `/pocetna-c`
- `/o-meni-c`

**Ne diraju** postojeći sajt (`/`, `/school`, `/about`, `/services`, …) ni
admin panel.

Klijent je odobrio da se, ako je potrebno, menjaju i zajednički tokeni iako
bi to promenilo ceo sajt. **Ispostavilo se da nije potrebno**, osim na jednom
mestu (footer, vidi „Jedina tačka gde curi" dole).

---

## Kako boje stoje u kodu

Nijedna komponenta ne nosi svoju boju. Sve gledaju u tokene na dva odvojena
mesta:

| Fajl | Šta pokriva | Tehnika |
|---|---|---|
| [components/fs-c/fs-c.css](components/fs-c/fs-c.css) | **samo tri `-c` strane** | CSS promenljive pod `.fs-c` |
| [app/globals.css](app/globals.css) | ostatak sajta, 28 ruta, i admin | Tailwind v4 `@theme` |

Ta dva bloka su potpuno razdvojena. Sve u `fs-c.css` je skopirano pod `.fs-c`
baš zato da ne curi na ostatak sajta. **Zamena palete za redizajn C je izmena
u jednom fajlu**, i live sajt je ne oseća.

### Jedina tačka gde curi

`-c` strane žive u [app/(site)/layout.tsx](app/(site)/layout.tsx), pa im
Header i Footer dolaze sa ostatka sajta. Footer je
[crna traka](components/Footer.tsx#L72) `bg-[#1a1a1a]`. To je jedino mesto gde
će se na `-c` stranama i dalje videti crna posle svih izmena.

Tri načina:

1. Promeniti samo tu jednu liniju u `Footer.tsx` na braon. Footer postaje
   braon i na starom sajtu, ali ostatak starog sajta ostaje netaknut.
   **Ovo je predlog:** jedna linija, i crne nema nigde.
2. Napraviti da footer bude braon samo na `-c` rutama. Više koda, stari sajt
   ostaje potpuno isti.
3. Ostaviti crn footer na `-c` stranama za sada.

---

## Izmena 01 — Zelena umesto plave, braon umesto crne

**Status:** `GOTOVO` 24.08. Urađeno u `fs-c.css`, jedan blok tokena.
Zlatna i terakota su zadržane (predlog a u obe tačke ispod). Zlatna je
usput morala da potamni, vidi „Šta je iskrslo u radu".

### Šta je traženo

| Sada | Postaje |
|---|---|
| tamnoplava (navy) | **`#12403C` zelena** |
| crna (charcoal) | **`#3E2A1E` braon** (espreso) |
| — | **`#EDD8BE` bež** ulazi kao svetla površina |

### Odgovoreno

- **Plava ide u zelenu.** Potvrđeno.
- **Crna ide u braon `#3E2A1E`.** Potvrđeno 24.08.
- **Obim.** Samo redizajn C, ne stari sajt, ne admin.
- **Providna crna.** Jedino mesto u `fs-c.css` bilo je `.pricebox`, a ta
  klasa se više ne koristi (sekcija „Upis" je prešla na `.enroll`). Dakle
  nema šta da se odlučuje, mrtav kod se briše.

### Braon lestvica

Crna nije jedna boja u kodu nego četiri: puna za naslove i tri prigušene za
sporedan tekst. Braon zamene su izvedene tako da **poklope postojeće odnose
kontrasta**, mešanjem `#3E2A1E` ka bež da ton ostane topao.

| Sada | Na beloj | Postaje | Na beloj | Za šta |
|---|---|---|---|---|
| `--charcoal` `#1a1a1a` | 17,40:1 | `#3E2A1E` | **13,51:1** | naslovi, osnovni tekst |
| `--charcoal-600` `#3d3d3d` | 10,86:1 | `#4C382B` | 11,01:1 | |
| `--charcoal-500` `#555555` | 7,46:1 | `#665243` | 7,36:1 | `.lead` pasusi |
| `--charcoal-400` `#777777` | 4,48:1 | `#806C5B` | **4,98:1** | `.micro`, sitne napomene |

Jedina prava razlika je najtamniji ton: 13,51 umesto 17,40. To je i dalje
trostruko iznad praga, pa se ništa ne gubi na čitljivosti, samo naslovi
prestaju da budu oštri koliko su bili sa crnom. To je i poenta izmene.

**Usputno popravljeno:** postojeća `--charcoal-400` `#777777` daje 4,48:1,
što je taman ispod praga od 4,5 za sitan tekst. Braon zamena je namerno
malo tamnija (4,98:1) pa `.micro` natpisi prvi put prolaze.

**Napomena koju treba znati:** braon i zelena su skoro iste svetline (odnos
između njih je 1,0 do 1,5:1). Razlikuju se po tonu, ne po tamnoći. Ako se dve
tamne sekcije nađu jedna do druge, granica će biti tiha. Za tekst-na-svetlom
(braon) i tamne sekcije (zelena) to nije problem, jer se retko dodiruju.

### Još nije odgovoreno

#### 1. Šta biva sa zlatnom?

204 upotrebe: eyebrow natpisi, brojevi u statistici, ikonice u krugovima.
Zlatna nije pomenuta ni u jednom zahtevu.

- a) **ostaje** kao treći, suzdržan naglasak (predlog, jer zlato na zelenoj
  radi i drži postojeći ritam strane)
- b) zamenjuje je bež `#EDD8BE`, koja na zelenoj daje 8,31:1
- c) zamenjuje je svetlija zelena

#### 2. Šta biva sa terakotom `#A6432E`?

To je sekcija „Upis" na `/skola-c`, jedina jaka boja na strani. Terakota je
topla crveno-braon, pa se sa novom paletom slaže bolje nego sa starom plavom.

- a) **ostaje** (predlog — vidimo je uz braon i zelenu pa odlučimo)
- b) sekcija prelazi na tamnu zelenu, a razliku nosi bež tekst

### Predlog mapiranja tokena

Sve u [components/fs-c/fs-c.css](components/fs-c/fs-c.css), blok `.fs-c` na
vrhu fajla.

| Sada | Postaje | Za šta služi |
|---|---|---|
| `--navy-800` `#162A42` | zelena `#12403C` | tamne sekcije |
| `--navy-900` `#091526` | tamnija zelena `#0B2B28` | hero, najtamnije |
| `--navy-700` `#263C59` | `#0F3532` | dugmad, oznake |
| `--navy-300` `#A6DDED` | svetli ton zelene | tekst na tamnim sekcijama |
| `--charcoal` `#1a1a1a` | braon `#3E2A1E` | osnovni tekst |
| `--charcoal-600/500/400` | `#4C382B` / `#665243` / `#806C5B` | prigušen tekst |
| `--cream-50/100/200/300` | skala oko bež `#EDD8BE` | svetle površine |

#### Skala zelene

`#12403C` je 700. Tamnije se mešaju ka `#061A18`.

| Token | Boja | Bela na njoj | Za šta |
|---|---|---|---|
| green-900 | `#0B2B28` | 15,10:1 | hero, najtamnije |
| green-800 | `#0F3532` | 13,33:1 | tamne sekcije |
| green-700 | `#12403C` | **11,51:1** | **brend** |
| green-600 | `#335B57` | 7,57:1 | dugmad, ivice |
| green-500 | `#597976` | 4,75:1 | granica za sitan tekst |

#### Skala bež

`#EDD8BE` je 200.

| Token | Boja | Braon `#3E2A1E` na njoj |
|---|---|---|
| beige-50 | `#FAF4ED` | 12,37:1 |
| beige-100 | `#F4E8D8` | 11,20:1 |
| beige-200 | `#EDD8BE` | **9,76:1** |
| beige-300 | `#E1CBB0` | 8,60:1 |
| beige-400 | `#D1BA9E` | 7,22:1 |

**Zamerka na koju treba paziti:** svetli tonovi zelene, kad se mešaju sa
belom, brzo gube boju i idu ka sivoj. Za tekst na tamnim sekcijama (sada
`--navy-300`) mešanje mora da ide ka bež, ne ka beloj, da ton ostane zelen.

### Redosled rada

1. Zameniti blok tokena u `fs-c.css`. Jedan fajl, tri strane.
2. Očistiti pet mesta sa doslovnom crnom u tom fajlu
   ([17](components/fs-c/fs-c.css#L17), [120](components/fs-c/fs-c.css#L120),
   [393](components/fs-c/fs-c.css#L393) mrtav kod,
   [465](components/fs-c/fs-c.css#L465),
   [479](components/fs-c/fs-c.css#L479)).
3. Odlučiti šta sa footerom (gore, „Jedina tačka gde curi").
4. Proći sve tri strane na desktopu i na telefonu, izmeriti kontrast na
   renderu, ne na papiru.
5. Nov preview link za klijenta.

### Procena

Korak 1 i 2 su brzi. Vreme uzima korak 4, jer boja koja lepo izgleda u
tabeli ume da propadne na konkretnoj sekciji. Realno: pola dana do novog
preview linka.

---

## Izmena 02 — Pravi testimonijali umesto postojećih

**Status:** `GOTOVO` 24.08. Urađeno po varijanti b: Izabela nosi karticu
sa „10 dana", Jovana i Mara stoje ispod kao tiši citati u dve kolone.
Naslov sekcije je morao da se promeni, vidi „Šta je iskrslo u radu".

### Šta ide na sajt

Tri utiska, doslovno kako su poslati 24.08. Ovo je izvor istine, na sajt ide
sa sređenim kvačicama.

**1. Izabela**

> Mnogo sam zahvalna na kursu, znanju i nesebičnom predavanju koje ste nam
> davali. Zato učim i dalje i zato sam nastavila obuku. Postavkom mog severa,
> u roku od deset dana promenio mi se poslovni svet i aktivirale su se mnoge
> poslovne okolnosti. Radujem se svemu što nam tek predstoji.

**2. Jovana**

Stigao kao slika Instagram komentara sa naloga `jayvanderhannah`. Potpisuje
se imenom **Jovana**, ne handle-om.

> Ova škola je najbolja moguća ulaznica u principe feng šui prakse, vođena na
> iskren i prijateljski način, a utemeljena na velikom znanju i iskustvu
> predavača. Dragana majstorski vodi svoje učenike i stara se da iz svih
> aspekata sagledamo tajne ove drevne veštine i filozofije života, kroz dobro
> osmišljena predavanja i detaljne diskusije na razne teme. Škola nas je
> povezala u misiju koja oplemenjuje, kako naše živote, tako i naše okruženje
> i koju sada, sa radošću, nastavljamo zajedničkim snagama. Pridružite nam se.

**3. Mara**

> Naučila sam da usaglasim energiju prostora sa svojom energijom i to itekako
> radi! Hvala Dragani na svemu i radujem se novim temama i izazovima. Moja
> topla preporuka za školu, početnicima savetujem da sve što rade u stanu,
> zapisuju jer će tako najbolje da uvide povezanost sa dobrim dešavanjima.

Originali su poslati bez dela kvačica („Naucila", „sto", „skolu",
„desavanjima"). Na sajtu se pišu ispravno, tekst se inače ne dira.

### Gde to dodiruje kod

Jedno mesto: **BLOK 9 na `/skola-c`**,
[SkolaCContent.tsx:438](components/skola-c/SkolaCContent.tsx#L438). Tri
kartice su tamo upisane direktno u komponentu, ne dolaze iz baze.

Postojeći utisci (Jelena M. · Beograd, Milan D. · Novi Sad, Svetlana K. ·
Ljubljana) žive i u [data/defaultContent.ts:829](data/defaultContent.ts#L829),
odakle ih koristi stara strana `/school`. Ta strana se gasi (vidi Izmenu 03),
a utisci se brišu, pa taj blok podataka postaje mrtav kod.

### Problem koji treba rešiti pre rada

Sekcija se sada zove **„Šta se promenilo u brojkama"** i svaka kartica
počinje merljivim rezultatom (`12 klijenata`, `2 prostora`, `15 godina`).
Novi utisci se ne uklapaju u tu formu:

| Utisak | Ima broj? | Šta bi bio rezultat |
|---|---|---|
| Izabela | **da** | „10 dana" — od postavke severa do prvih poslovnih prilika |
| Jovana | ne | preporuka škole u celini, bez pojedinačnog ishoda |
| Mara | ne | rezultat je kvalitativan: prostor usaglašen sa sopstvenom energijom |

Uz to su i osetno duži od onoga za šta je kartica pravljena:

| | Reči |
|---|---|
| postojeće kartice | 21, 22, 28 |
| Izabela | 49 |
| Mara | 48 |
| Jovana | **81** |

Dakle nije samo zamena teksta, sekcija mora da promeni formu. Dva puta:

- **a) Sekcija prestaje da bude „u brojkama"** i postaje obična sekcija sa
  utiscima. Naslov se menja, `.res` metrika nestaje. Najjednostavnije, ali
  gubi se ono što tu sekciju sada čini jačom od uobičajenih testimonijala.
- **b) Metrika ostaje, ali samo gde postoji.** Izabela ide kao kartica sa
  „10 dana", a Jovana i Mara idu ispod kao tiši citati u drugom obliku.
  Više posla, ali zadržava se udarna snaga brojke.

**Radi se po b),** jer je „u roku od deset dana" najjači deo svega poslatog.
Ako na ekranu ispadne neuverljivo, prelazak na a) je pola sata posla.

### Odgovoreno

- **Ime uz screenshot je Jovana.** Ono „Jovana" ispod Izabelinog utiska bio
  je potpis za Instagram komentar koji je stigao kao slika, ne izgubljen
  utisak. Potpisuje se imenom, ne handle-om `jayvanderhannah`.
- **Stari utisci se brišu.** Jelena M., Milan D. i Svetlana K. odlaze,
  ne stoje uz nove.
- **Stara strana `/school` se gasi**, pa ne treba da dobije nove utiske.
  To otvara zaseban posao, vidi Izmenu 03.

### Vezano za ranije nerazrešeno

Sva tri utiska dolaze iz **postojeće, četvoromesečne škole** („nastavila sam
obuku", „radujem se novim temama"). Prodajna strana je za **dvomesečni**
kurs. Isto pitanje koje već stoji na dnu ovog fajla: da li utisci iz dužeg
programa smeju uz kraći, i pod kojim natpisom.

---

## Izmena 03 — Gašenje starih strana i preseljenje redizajna C

**Status:** `SKUPLJA SE` — otvoreno rečeno da stara `/school` neće postojati,
ali to povlači nekoliko odluka koje niko još nije doneo.

### Šta je rečeno

Stara strana `/school` se gasi. Po istoj logici, redizajn C ima parove i za
ostale dve: `pocetna-c` za početnu i `o-meni-c` za „O meni".

| Redizajn C | Zamenjuje |
|---|---|
| `/skola-c` | `/school` |
| `/pocetna-c` | `/` |
| `/o-meni-c` | `/about` |

### Odluka 1: da li URL ostaje isti

„Neće postojati" može da znači dve stvari.

- **a) Ostaje URL `/school`, menja se sadržaj.** Nestaje stari dizajn, adresa
  ostaje. **Ovo je predlog.** Na `/school` pokazuje **29 mesta** u kodu:
  navigacija, footer, dugmad na početnoj, na uslugama, na vazi. Svi nastave
  da rade bez ijedne prepravke, a Google zadržava stranu sa svom istorijom.
- **b) Menja se i adresa** (recimo `/skola`). Tada treba 301 preusmerenje sa
  `/school`, inače svaki stari link i svaki Google rezultat vodi u 404. Uz to
  se prepravlja svih 29 mesta.

Isto važi za `/about` (8 mesta) i početnu.

### Odluka 2: da li Dragana i dalje može sama da menja tekst

Ovo niko nije pomenuo, a menja obim posla.

Stara strana čita sadržaj iz baze:
[`await getContent('school')`](app/(site)/school/page.tsx), pa Dragana tekst
uređuje kroz admin panel na `/admin/content/school`.

Nove `-c` strane **nemaju to**. Sav tekst je upisan direktno u komponentu.
Ako se prebace kakve jesu, **Dragana gubi mogućnost da menja tekst škole bez
programera**.

Tri puta:

1. Povezati novu stranu na `getContent` u celini i prepraviti polja u admin
   panelu. Najviše posla, ali se ništa ne gubi.
2. Ostaviti hardkodirano. Svaka izmena teksta ide preko programera.
3. **Povezati samo ono što se stvarno menja:** cena, datumi upisa, utisci i
   FAQ. Naslovi i opisi sekcija ostaju u kodu. **Predlog**, jer pokriva ono
   zbog čega bi se admin i otvarao.

### Sitnice koje moraju uz preseljenje

- Naslov strane je i dalje `Feng Shui škola (verzija C)`
  ([page.tsx](app/(site)/skola-c/page.tsx#L5)), briše se zagrada.
- Opis stare strane kaže „4-mesečni program", nove „dvomesečni". Isto ono
  nerazrešeno pitanje o trajanju, sada blokira meta opis.
- Iz [Header.tsx](components/Header.tsx#L23) se briše `C_PREVIEW_ROUTES`,
  privremeni preklopnik koji navigaciji na `-c` stranama menja linkove.
- Utisci Jelena M. / Milan D. / Svetlana K. u
  [data/defaultContent.ts:829](data/defaultContent.ts#L829) postaju mrtav kod.
- Footer prestaje da bude crn (Izmena 01).

---

## Izmena 04 — Nov tekst po sekcijama, blokovi 1 do 8

**Status:** `GOTOVO` 24.08. Sav tekst je prenet doslovno kako je poslat.
Jezičke ispravke sa dna NISU primenjene, čekaju tvoju reč.

### Kako je čitano

Osam slika, redom kojim su poslate, odgovara blokovima 1 do 8 na `/skola-c`.
Beli i tamni okviri sa velikim slovima su izmene, sve ostalo na slici je
postojeći sajt. Gde je okvir prekrio postojeći tekst a nije ga zamenio, to
znači brisanje.

Blokovi 9 do 13 (utisci, O meni, Upis, pitanja, zatvaranje) nisu poslati.
Utisci su pokriveni Izmenom 02, za ostale se čeka.

### Blok 1 — Hero

| | |
|---|---|
| Sada | „NOVI dvomesečni feng shui kurs sa Draganom Jović" |
| Postaje | **„Feng shui program"** |
| Novo, ispod naslova | **„Naučite kako da uskladite dom sa svojim ciljevima"** |

Eyebrow, oba dugmeta i sitan red ispod ostaju kako jesu.

Naslov gubi tri stvari koje je nosio: da je **nov**, da je **dvomesečan** i
**Draganino ime**. Podnaslov je nov element, sada ga u herou nema.

### Blok 2 — Uvod

| | |
|---|---|
| Naslov sada | „Vi i vaše okruženje ste u stalnoj interakciji i međusobnom uticaju" |
| Postaje | **„Znate li da vaš dom čak sa 30% utiče na vašu sreću?"** |

Prvi pasus, sada:

> Tokom ove dvomesečne obuke Dragana Jović će vam pokazati kako da
> identifikujete oblasti u vašem prostoru koje vam **možda** crpe energiju i
> **prave blokade za vaše bogatstvo, odnose i zdravlje**.

Postaje:

> Tokom ove dvomesečne obuke Dragana Jović će vam pokazati kako da
> identifikujete oblasti u vašem prostoru koje vam crpe energiju i
> **blokiraju dotok bogatstva, dobre odnose i zdravlje**.

Drugi pasus, sada:

> Feng shui vam pomaže da otkrijete **da li** vaš prostor podržava vaš
> napredak **ili vam život čini težim**.

Postaje:

> Feng shui vam pomaže da otkrijete **na koji način** vaš prostor **može da**
> podržava vaš napredak **i kako da izbegnete zamke u prostoru koje** život
> čini težim.

### Blok 3 — Program

| Broj | Naslov sada | Naslov postaje | Opis postaje |
|---|---|---|---|
| 01 | Osnovne postavke | *ostaje* | **Kako se uskladiti sa energijom svog prostora** |
| 02 | Blokade u prostoru | **Dijagnostika prostora** | **Blokade i kako ih otkloniti** |
| 03 | Delovi prostora | *ostaje* | **I kako ih organizovati u skladu sa vašom energijom** |
| 04 | Aktivacija | *ostaje* | Kako da pokrenete uzlaznu spiralu **života** |

Pasus ispod kartica, sada:

> Obuka je podeljena na četiri dela i svaki se nadovezuje na prethodni.
> Krećete od toga kako energija ulazi i kreće se kroz prostor, učite da
> prepoznate gde zastaje, pa tek onda kako se bira korekcija. Tako menjate
> ono što ima efekta, a ne sve odjednom.

Postaje:

> Svaka sesija se nadovezuje na prethodnu. Počećete sa ulogom Chi-ja,
> ispitati feng shui plan prostora, locirati moguće izvore blokada i videti
> kako se biraju korekcije.

Naslov sekcije („Plan za 8 nedelja obuke") i dugme ostaju.

### Blok 4 — Citat i prijava

| | |
|---|---|
| Sada | „Nije potrebno da sve u vašem domu promenite, **ali morate da** znate šta ugrožava vašu energiju i kako da **to** precizno **promenite**" |
| Postaje | „Nije potrebno da sve u vašem domu promenite **kada** znate šta ugrožava vašu energiju i kako da precizno **primenite feng shui**" |

„Program se održava online." i pasus o broju mesta ostaju.

Dugme: „Prijavi se za besplatne konsultacije" postaje **„Prijavi se"**.

### Blok 5 — Vaš prostor ima energetsku mapu

Ovde nije reč o zameni rečenica nego o **drugom sadržaju sekcije**. Sada
sekcija ima dve kartice („Kada teče" i „Kada zastane") i zatvaranje u dva
reda. Na slici je predložen niz od pet stavki sa uvodom i zaključkom.

Nov tekst sekcije, potvrđen:

> Feng shui se bavi životnom energijom Chi i kako se ona kreće.
>
> Način na koji Chi ulazi, sakuplja se i kreće kroz vaš dom može uticati na
> to koliko je to okruženje podržavajuće. Kada energija dobro teče, prostor
> je pogodan za oporavak, fokus, povezivanje i napredak.
>
> Kada postane slab, blokiran ili loše raspoređen, možete iskusiti:
>
> - Kašnjenja uprkos stalnim naporima
> - Niska energija bez očiglednog razloga
> - Teškoće sa koncentracijom ili donošenjem odluka
> - Napetost u određenim oblastima života
> - Osećaj da svakodnevni zadaci zahtevaju previše truda
>
> Feng shui vam daje sistem za otklanjanje **ovih** obrazaca.
>
> Videćete kako se oblici, forme, sektori i oblasti koriste zajedno za procenu
> prostora. Ovo vam daje praktičnu početnu tačku za odlučivanje na šta je
> prvo potrebno obratiti pažnju.

Postojećih pet stavki („Umesto mira kod kuće osetite težinu", „Nered se
vraća, fokus stalno beži", …) zamenjuje se ovih pet.

**Zatvaranje se briše.** Dva reda „Ne popravljamo dom. / Usklađujemo ga sa
vama." nisu na slici, pa ih skidamo.

**Forma:** uvodni pasus, pa pet stavki u mreži, pa zaključak. Sadašnje dve
kartice („Kada teče" / „Kada zastane") nestaju, sekcija postaje jednostavnija
nego što je sada.

### Blok 6 — Za koga je

| Sada | Postaje |
|---|---|
| Volite sami da uređujete svoj dom i želite da znate *zašto* nešto radite, a ne samo šta. | Volite sami da uređujete svoj dom i želite da znate **kako da kroz prostor unosite poboljšanje za sebe i svoju porodicu** |
| Čuli ste za feng shui **termine**, ali ne znate odakle da počnete **sa sopstvenim prostorom**. | Čuli ste za feng shui, ali ne znate odakle da počnete **da ga primenjujete u svom domu** |
| Želite jasan **okvir** umesto razbacanih saveta sa interneta i „srećnih predmeta". | Želite jasan **smer** umesto razbacanih saveta sa interneta i „srećnih predmeta". |
| Radite na sebi, ali osećate **da vas dom u tome ne prati**. | Radite na sebi, ali osećate da **ulažete veliki napor a rezultati su mali** |
| Želite korekcije koje se **primenjuju bez renoviranja i bez velikih troškova**. | Želite korekcije koje se **mogu primeniti i bez velikih renoviranja i skupih predmeta** |
| Selite se, gradite ili renovirate i želite da to odmah uradite kako treba. | *ostaje* |

Napomena sa strane gubi zahtev da se donese tlocrt:

| | |
|---|---|
| Sada | Predznanje nije potrebno. Ponesite **tlocrt svog stana,** otvoren um i spremnost da svoj prostor vidite drugačije. |
| Postaje | Predznanje nije potrebno. Ponesite otvoren um i spremnost da svoj prostor vidite drugačije. |

### Blok 7 — Tokom programa ćete naučiti

| Broj | Naslov postaje | Opis postaje |
|---|---|---|
| 01 | **Kako da prostor gledate na drugačiji način** | **Okolina, ulaz i raspored prostorija utiču na kvalitet energije i kvalitet života** |
| 02 | **Znaćete da prepoznate blokade i kako da ih otklonite** | **Jer određeni obrasci ukazuju da prostorija, pravac ili sektor zaslužuju posebnu pažnju** |
| 03 | **Pratite praktičan redosled** | **I svaku prostoriju energetski oplemenite za njenu namenu** |
| 04 | Da aktivirate prostor *(ostaje)* | **Koristeći jednostavne principe aktivaciju vašeg doma uz pomoć 5 elemenata** |

**Desni panel se menja iz temelja.** Sada prikazuje pun opis stavke koju
pređete mišem. Na njegovom mestu ide:

> **Cena programa**
> **286 €**
>
> Broj mesta je ograničen. Rezervišite svoje mesto na vreme.

Ovim prvi put imamo **cenu**, koja stoji kao nerazrešena od početka posla.

**Lista postaje obična.** Bez ikakve radnje na klik ili prelazak mišem, ali
zadržava izgled: broj, naslov, opis, ista tipografija i razmaci. Tehnički to
znači da svaka stavka prestaje da bude `<button role="tab">` i postaje običan
element, pa nestaju i `aria-selected` i stanje izabrane stavke.

Jedna sitnica koja ide uz to: svaka stavka sada ima strelicu `→` desno, koja
postoji da nagovesti da se na nju može kliknuti. Kada radnje nema, strelica
obećava nešto čega nema. Predlog je da se skine, sve ostalo ostaje. Ako
treba da ostane kao ukras, ostaje.

### Blok 8 — Kako izgleda kurs

| Kolona | Sada | Postaje |
|---|---|---|
| Sesije uživo | Interaktivni časovi sa demonstracijama i pitanjima. Sve se snima, pa ništa ne propuštate. | *ostaje* |
| Materijali | Detaljni materijali i vizuelni vodiči kroz onlajn platformu, dostupni **celo vreme**. | Detaljni materijali i vizuelni vodiči kroz onlajn platformu, dostupni **i nakon završetka kursa** |
| Mala grupa | Broj polaznica je **namerno** ograničen, **da svaka dobije prostor i pažnju**. | Broj polaznica je ograničen, **da bih svakome od vas mogla lično da se posvetim** |
| Praktični zadaci | Vaš dom je učionica: svaka lekcija se odmah primenjuje, uz povratnu informaciju. | *ostaje* |

Naslov, traka sa nedeljama i rečenica na dnu ostaju.

---

### Odgovoreno 24.08.

| Pitanje | Odgovor |
|---|---|
| Blok 4, natpis na dugmetu | samo **„Prijavi se"** |
| Blok 5, prva stavka | cela glasi **„Kašnjenja uprkos stalnim naporima"**, ništa nije prekriveno |
| Blok 5, reč pred „obrazaca" | **„ovih"** |
| Blok 6, napomena sa strane | ostaje **samo ono što je vidljivo**, „tlocrt svog stana" se briše |
| Blok 5, zatvaranje | **skida se**, jer nije na slici |
| Tvrdnja od 30 procenata | **ostaje kako jeste** za sada |
| Cena | **286 €** |
| Blok 7, lista | **postaje obična**, bez ikakve radnje, izgled ostaje |

Uz cenu ide i posledica: sekcija „Upis" (blok 11) sada piše „Cena i tačan
datum upisa biće objavljeni uskoro." Cena više nije nepoznata, pa se ta
rečenica menja. Datum i dalje nedostaje.

Tvrdnja od 30 procenata ostaje uz napomenu da nema izvor. Ako je neko
zatraži, biće je potrebno potkrepiti ili ublažiti.

### Jezičke ispravke koje predlažem

Tekst je poslat kroz slike, pa je mestimično bez kvačica i sa prelomljenom
rečenicom. Ovo su mesta gde bih ispravio, ali ne diram bez tvoje reči jer je
u pitanju klijentov tekst.

| Gde | Kako je poslato | Predlog |
|---|---|---|
| Blok 2, drugi pasus | „…zamke u prostoru koje život čini težim" | „…zamke u prostoru koje vam život čine težim" |
| Blok 3, pasus | „Počećete sa ulogom Chi-ja, ispitati… locirati… videti…" | „Počećete od uloge Chi-ja, ispitaćete feng shui plan prostora, locirati moguće izvore blokada i videti kako se biraju korekcije" ili sve u istom vremenu |
| Blok 7, stavka 04 | „Koristeći jednostavne principe aktivaciju vašeg doma uz pomoć 5 elemenata" | „Koristeći jednostavne principe aktivacije vašeg doma uz pomoć 5 elemenata" |
| Blok 5, dugme | „Pokaži mi šta moj prostor utiče na moj život" | „Pokaži mi kako moj prostor utiče na moj život" |
| Svuda | reči bez kvačica („kasnjenja", „Teskoce", „pocetnu") | pišu se ispravno |

### Jedna posledica koju treba imati u vidu

Novi naslov heroja („Feng shui program") više ne kaže da je kurs **nov**, da
traje **dva meseca**, niti pominje **Draganino ime**. Sve troje je do sada
nosio prvi red strane. Podnaslov to delimično vraća, ali ne u potpunosti.
Ako je to namerno, u redu; ako nije, vredi razmisliti pre nego što se menja.

---

## Šta je i dalje nerazrešeno od ranije

Nije vezano za boje, stoji da se ne izgubi.

- **Cena kursa.** Prvi put je stigla kroz sliku bloka 7: **286e**. Traži
  potvrdu (vidi Izmenu 04, odluka 2), pa onda ide i u sekciju „Upis".
- **Tačan datum upisa.** Sekcija „Upis" na `/skola-c` i dalje piše samo
  „oktobar 2026." i „Cena i tačan datum upisa biće objavljeni uskoro."
- **Kontakt podaci za footer:** email, telefon, Instagram.
- **Sukob trajanja:** postojeća škola na sajtu je četvoromesečna (16 lekcija,
  grupa do 15), a novi kurs dvomesečni. Isti proizvod u kraćem formatu ili
  dva odvojena?
- **Opis radionica.** Dokument traži četvrtu uslugu u krugovima, ali opis ne
  postoji nigde.
- **Brojevi u zatvaranju `/skola-c`** se ponavljaju iz sekcije „O meni".
  Treba odluka da li ostaju na oba mesta.

---

## Šta je iskrslo u radu, 24.08.

Stvari koje nisu bile u planu nego su se pokazale tek kad je paleta ušla
u kod.

### Zlatna je morala da potamni

Zlatna je ostala kao treći naglasak, ali je stara vrednost `--gold-500`
`#b8952f` na novoj bež podlozi davala **2,06:1**, a sitan verzal (svi
„eyebrow" natpisi: ISHOD, REZULTATI, PITANJA) traži 4,5. Isti problem je
postojao i pre, na starom kremu je bilo 2,51, samo se sada pogoršao.

Uveden je `--gold-700: #6B5518`, koji daje **5,16** na bež i **6,55** na
bež-50. Nosi ga eyebrow, veliki brojevi u listi „Tokom programa ćete
naučiti" (tamo je stara zlatna davala 1,65 i broj se praktično gubio) i
ikonice u krugovima za skok-navigaciju.

### Zaglavlje i podnožje su curili starom paletom

Header i Footer dolaze iz zajedničkog layouta, pa je na zelenoj strani
ostajala plava pilula „Prijava" i plave ikonice u podnožju.

Rešeno bez diranja starog sajta: `body:has(.fs-c)` pogađa tačno tri `-c`
strane, jer samo one renderuju `.fs-c` omotač, i tu se redefinišu
Tailwind-ove `--color-*` promenljive. Njegove klase su definisane kao
`var(--color-navy-500)` pa se povlače za njima. Nijedan HTML nije diran,
stari sajt ne oseća ništa. Kad ceo sajt pređe na novu paletu, taj blok
se briše.

### Naslov sekcije sa utiscima

Sekcija se zvala „Šta se promenilo u brojkama", a od tri utiska samo
jedan ima brojku. Naslov je promenjen u **„Šta kažu polaznice"**, jer bi
stari obećavao tri merljiva ishoda kojih nema. To nije bilo u klijentovom
tekstu, pa reci ako treba drugačije.

### Fotografije: hero rešen 25.08, „O meni" još nije

Slike su bile generisane u tamnoplavoj. **Hero je zamenjen zelenim
verzijama** (desktop i mobilni), pa je i preliv preko njega prebačen na
zeleno. Ostala je još samo pozadina sekcije „O meni".

Mereno na renderu cele strane: plavkastih piksela je sa 4,69% palo na
**1,75%**, a od toga je gotovo sve u „O meni" fotografiji. U herou je
ostalo 2.388 piksela, i to je Draganina sivoplava haljina, ne paleta.

Preliv preko `#020B1E` u sekciji „O meni" namerno ostaje plav dok je
slika plava, jer bi zelen preliv preko plave slike pravio šav.

Tri puta za tu jednu sliku:

1. Prepravi se u Higgsfieldu u zelenoj, pa se i preliv prebaci.
   **Predlog.**
2. Ostaje plava, kao namerni kontrast.
3. Zamenjuje se običnom fotografijom bez pozadine u boji.

### Cena je ušla na dva mesta

`286 €` sada stoji u kartici pored liste „Tokom programa ćete naučiti" i
u sekciji „Upis", pored datuma početka. Rečenica „Cena i tačan datum
upisa biće objavljeni uskoro" je zamenjena sa „Tačan datum upisa biće
objavljen uskoro".

---

## Izmena 05 — Navigacija vodi u prijavu, ne u login

**Status:** `GOTOVO` 24.08.

### Šta je traženo

Dugme u navigaciji na desktopu prestaje da bude „Prijava" i postaje
**„Sačuvaj svoje mesto"**, a klik otvara prijavu kao modal, na licu mesta,
umesto da vodi na drugu stranu. Na telefonu ostaje kako jeste, tu tu ulogu
već ima lepljiva traka pri dnu sa natpisom „Prijavi se".

### Kako je rešeno

Header dolazi iz `(site)/layout.tsx` i stoji van `.fs-c` stabla, pa ne može
da dosegne stanje modala koje živi u komponenti strane. Umesto provlačenja
konteksta kroz layout (koji je serverska komponenta), uveden je
[components/fs-c/enrollTrigger.ts](components/fs-c/enrollTrigger.ts): Header
javi prozoru, a strana koja je otvorena to čuje i otvori svoj modal.

Prolazno rešenje, kao i `C_PREVIEW_ROUTES`. Briše se kada redizajn C
preuzme prave rute i Header prestane da bude deljen između dve verzije.

Provereno preko CDP-a na sve tri strane: natpis je „Sačuvaj svoje mesto" i
klik otvara modal „Prijava za feng shui školu". Na `/`, `/school` i
`/about` navigacija je nedirnuta, i dalje „Prijava" koja vodi na `/login`.

### Posledica koju treba znati

Na `-c` stranama posetilac koji nije ulogovan **više nema ulaz u login iz
navigacije na desktopu**. Postojeće polaznice koje idu na `/dashboard` bi
morale drugim putem. Ako to smeta, može tih link „Prijavite se" pored
dugmeta, ili ostaje samo na starom sajtu do preseljenja.

### Usput

Natpisi na modalu su morali da se razlikuju po strani. Na Početnoj i „O
meni" modal je do sada govorio o konsultacijama i razgovoru, a natpis
dugmeta obećava upis u školu. Obe strane su dobile zaseban tekst za
prijavu, da natpis i modal govore isto.

### Hero preliv nikada nije radio (otkriveno 25.08.)

`.hero-bg::after` je imao `z-index: -1`, a stoji unutar `.hero-bg` koji je
na `-2`. To ga je gurnulo u negativni sloj, **ispod** `<img>`, pa se preliv
nikada nije video. Na staroj slici se to nije primetilo jer je bila dovoljno
tamna sama po sebi; nova zelena ima svetao logo-znak i tirkizni sjaj tačno
ispod teksta, pa je odmah izbilo.

Popravljeno uklanjanjem `z-index`-a. Izmereno pre popravke: podnaslov je na
1500px imao **2,20**, a na 1024px naslov **2,83**. Posle: sve prolazi na
svakoj širini od 360 do 1920.

Uz to su trebale tri stvari koje se iz tabele ne vide:

- Zaseban, gušći zastor za **uski desktop (768–999px)**. Tu se kadar
  najjače seče po visini pa logo-znak sklizne najdalje ulevo, tačno pod
  naslov. Iznad 1000px se taj zastor ne koristi jer bi prešao preko Dragane.
- `.micro` u herou ide na **punu belu** umesto 78%; na tirkiznom sjaju je
  gubio prag.
- Podnaslov je sužen sa 34ch na **28ch** da se prelomi pre logo-znaka.