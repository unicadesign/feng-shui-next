# Promene iz dokumenta „Promene" — druga runda

Izvor: [Google dokument](https://docs.google.com/document/d/1bAXSx3Wc3JFhXfV6nuWOYyEB8wejfPKgSGwBzfQj2eY/edit)
· pročitano 26.08.2026.

Dokument ima **28 uputstava i 17 slika**. Slike su isečci sa preview linka,
a uputstva stoje oko njih. Redosled u dokumentu nije pouzdan (neko uputstvo
stoji iznad svoje slike, neko ispod), pa je svako povezano **po sadržaju
slike**, ne po položaju.

**Urađeno 27.08.:** sve osim stavki 8, 17 i 18, koje čekaju fotografije.
Detalji na dnu, pod „Šta je iskrslo u radu".

**Legenda:** ✅ jasno, može odmah · ❓ traži tvoju reč · ⏳ čeka materijal
· ⚠️ dodiruje i stari sajt

> **Dopunjeno 27.08.** Odgovori su ugrađeni u tabele, izmene su urađene.

---

## Škola (`/skola-c`)

### Zaglavlje

| # | Traženo | Gde | Status |
|---|---|---|---|
| 1 | Logo u **zlatnoj**, bez bele pozadine iza znaka | [Header.tsx](components/Header.tsx#L117) | ✅⚠️ |
| 2 | Bež krugovi (Program, Za koga je, …) **se brišu** | [SkolaCContent.tsx:105](components/skola-c/SkolaCContent.tsx#L105) | ✅ |
| 3 | Umesto njih **padajući meni** na klik na „Škola" | [Header.tsx](components/Header.tsx#L51) | ✅ |

**Logo je sređen 27.08.** Iz `Logo bez linija i pozadine-24-06.png` je
skinuta bela i napravljen [logo-zlatni.png](public/logo/logo-zlatni.png):
512×512, providan, 57 KB. Bela nije samo isečena po pragu nego je izvučena
iz mešavine na ivicama, pa nema belog oreola ni na zelenoj podlozi
(provereno: nula poluprovidnih skoro belih piksela). Znak zauzima 77%
platna, tačno kao stari logo, da se veličina u navigaciji ne promeni.

**Padajući meni** sadrži istih šest sidara koje su nosili krugovi: Program,
Za koga je, Rezultati, O meni, Upis, Pitanja. Otvara se na klik, kako
dokument i traži.

### Blok 1 — Hero

| # | Traženo | Status |
|---|---|---|
| 4 | „Naučite kako da uskladite dom sa svojim ciljevima" u **zlatnoj** | ✅ |
| 5 | Naslov postaje „Feng Shui Online program", **ostaje beo** | ✅ |
| 6 | Prvo dugme **belo**, bez terakote, natpis **„Prijavi se"** | ✅ |
| 6b | „Zakaži besplatnu konsultaciju" postaje **sekundarno**: bela kontura, beo tekst | ✅ |
| 7 | Briše se „Besplatno i bez obaveze · odgovor u roku od 24h" | ✅ |
| 8 | Slika: ona **u belom** umesto ove (Dragana u plavoj haljini) | ⏳ |

Za 6b već postoji varijanta `.btn-line`, napravljena za zatvaranje pred
footerom. Ivica na zelenoj daje 3,77:1, iznad praga 3:1 za elemente, pa se
koristi ista.

Slika (8) stiže od tebe.

### Blok 4 — Citat i prijava

| # | Traženo | Status |
|---|---|---|
| 9 | Dugme **belo sa tamnim tekstom** umesto terakote na bež podlozi | ✅ |
| 10 | Briše se „Popunjavate kratak upitnik. Otvara se ovde, bez napuštanja stranice." | ✅ |

### Blok 5 — Vaš prostor ima energetsku mapu

| # | Traženo | Status |
|---|---|---|
| 11 | **Šesta kartica**: „Imate osećaj da trčite u mestu" | ✅ |
| 12 | Dugme: ispraviti „Pokaži mi **šta**" → „Pokaži mi **kako** moj prostor utiče na moj život" | ✅ |

### Blok 6 — Za koga je

| # | Traženo | Status |
|---|---|---|
| 13 | Briše se mali natpis „ZA KOGA JE" iznad naslova | ✅ |

### Blok 7 — Tokom programa ćete naučiti

| # | Traženo | Status |
|---|---|---|
| 14 | Cena **289 €** umesto 286 € | ✅ |

### Blok 9 — Utisci

| # | Traženo | Status |
|---|---|---|
| 15 | **Boldovati imena** polaznica (Izabela, Jovana, Mara) | ✅ |
| 16 | Brišu se **„10 dana"** i **„od postavke severa do prvih poslovnih prilika"** | ✅ |

### Blok 10 — O meni

| # | Traženo | Status |
|---|---|---|
| 17 | **Zelena pozadina** umesto tamnoplave | ⏳ |
| 18 | Slika: ona **u plavoj haljini**, **bez ičega u pozadini** | ⏳ |

Ovo dvoje ide zajedno. Sadašnja pozadina sekcije je `#020B1E`, izvučena iz
same fotografije da se preliv ne vidi kao šav. Dok fotografija ne stigne,
promena boje bi taj šav napravila, pa se radi u istom potezu.

### Blokovi 11 i 13 — spajaju se u jedan zeleni blok

| # | Traženo | Status |
|---|---|---|
| 19+20 | Terakota „Upis" i zatvaranje pred footerom **postaju jedan zeleni blok** sa osnovnim informacijama (kada počinje, koliko traje…) | ✅ |

Urađeno ovako:

- naslov i rečenica iz zatvaranja („Mesto se rezerviše prijavom")
- red sa tri podatka: **kada počinje**, **koliko traje**, **cena**
- četiri čipa sa onim što je bilo u „Upisu"
- dva dugmeta: „Prijavi se" i „Zakaži konsultaciju"
- tri brojke ispod tanke linije

Time se gubi terakota kao jedina jaka boja na strani. Ostaje još samo na
dugmadima, koja su ionako većinom prešla na belo.

### Footer

Za footer je data odrešena ruka.

| # | Traženo | Gde | Status |
|---|---|---|---|
| 21 | **Beo umesto braon**, sa braon slovima | [Footer.tsx:72](components/Footer.tsx#L72) | ✅⚠️ |
| 22 | Logo **zlatan**, ne plavo-beo | [Footer.tsx](components/Footer.tsx) | ✅⚠️ |
| 23 | Izbaciti link **„Vaza Izobilja"** | [defaultContent.ts:1135](data/defaultContent.ts#L1135) | ✅⚠️ |
| 24 | Brisati opis „Harmonizacija domova, srca i energije…" | [Footer.tsx](components/Footer.tsx) | ✅⚠️ |

### Kontakt forma (modal)

| # | Traženo | Gde | Status |
|---|---|---|---|
| 25 | Telefon: **ne 060**, jer se prijavljuju i ljudi iz inostranstva | [FsCModal.tsx:209](components/fs-c/FsCModal.tsx#L209) | ✅ |

---

## Početna (`/pocetna-c`)

| # | Traženo | Gde | Status |
|---|---|---|---|
| 26 | **Brisati** grupnu fotografiju iz heroja | [PocetnaCContent.tsx](components/fs-c/PocetnaCContent.tsx) | ✅ |

---

## Oba preostala pitanja su odgovorena

**„Feng Shui Online program" je naslov.** Naslov je promenjen iz „Feng shui
program" u „Feng Shui Online program" i ostao beo. Podnaslov je prešao u
zlatno. Natpis iznad naslova nije diran.

**Početna: briše se fotografija.** Pitanje je bilo loše postavljeno, jer sam
mislio da fotografija stoji pored teksta. Ne stoji: ona je zaseban blok
iznad teksta, pa njenim brisanjem tekst jednostavno ide gore. Nema praznog
mesta i nema šta da se popunjava.

---

## Potvrđeno, ne pitam više

- **Crne nema**, tekst na belom dugmetu ide u braon `#3E2A1E` (13,51:1).
- **Fotografije** za hero i „O meni" dostavljaš ti.
- **Blokovi 11 i 13** se spajaju u jedan zeleni.
- **Footer** radim slobodno.
- **Padajući meni** nosi istih šest sidara, otvara se na klik.

### Tri stavke i dalje menjaju stari sajt (21, 23, 24)

Footer je zajednički. Belo, izbačen opis i izbačena „Vaza Izobilja" videće
se i na starim stranama. Rekao si da je footer slobodan, pa ovo stoji samo
kao zapis šta se tačno menja izvan redizajna C.

---

## Šta ostaje otvoreno od ranije

Nije iz ovog dokumenta, ali čeka:

- **Tačan datum upisa.** Sada je poznat samo mesec („oktobar 2026."), a
  spojeni blok traži red „kada počinje". Ako datuma i dalje nema, tu ostaje
  mesec.
- **Pet jezičkih ispravki** iz Izmene 04 u [PLAN-IZMENA.md](PLAN-IZMENA.md);
  jedna od njih (dugme „Pokaži mi šta") je sada stigla i kroz ovaj dokument
- **Gašenje starih strana i admin panel** (Izmena 03)

---

## Šta je iskrslo u radu, 27.08.

### Zlatna je tamnija od bele, pa je podnaslov u herou pao

Podnaslov je prešao sa bele na zlatnu. Zlatna `--gold-200` ima svetlinu
0,70 naspram 1,0 za belu, pa je na svetlom delu fotografije pao na
**3,32:1** tamo gde je bela imala 11,2.

Nije stvar u boji slova nego u podlozi: na istom mestu ni **čisto belo** ne
bi prošlo komotno (4,63), a `--gold-100` bi dalo 3,97 i `--gold-50` 4,36.
Dakle podloga je presvetla.

Rešeno zastorom: gušći pojas je proširen sa 999 na **1149px**, a široki
zastor je podignut za oko 0,06. Izmereno na renderu, samo tamo gde ima
mastila, na jedanaest širina od 360 do 1920: **nema nijednog pada.**
Podnaslov je sada između 5,76 i 9,15.

### Dugmad u herou stoje u redu, ne jedno pod drugim

Dok je prvo dugme nosilo dugu rečenicu, slaganje je imalo smisla. Sa
kratkim „Prijavi se" ispod dužeg „Zakaži besplatnu konsultaciju" stub je
ispadao razuđen, pa na desktopu idu jedno pored drugog. Na telefonu ostaje
kako je bilo.

### Zlatni znak je i u mobilnom zaglavlju

Dokument pominje logo jednom, ali zaglavlje ima dve verzije, za desktop i
za telefon. Obe su prešle na zlatnu, inače bi na telefonu ostao beli
kvadrat.

### Sekcija „Upis" je otišla na dno strane

Spajanjem sa zatvaranjem, „Upis" je sada iza FAQ-a. Zato je i u padajućem
meniju „Upis" premešten iza „Pitanja", da meni prati redosled na strani.

### Datum i vreme su izmišljeni

Na tvoj zahtev, dok ne stigne tačan termin: **14. oktobar 2026., utorkom u
19h**. Stoji na jednom mestu u kodu, uz vidljivu napomenu. Mora da se
promeni pre nego što strana ode u produkciju.

### Jedno pitanje koje se otvorilo

Uputstvo 9 traži da terakota dugme na bež podlozi u bloku 4 pređe u belo.
**Isti slučaj je i dugme „Rezerviši mi mesto" u bloku 7** — takođe terakota
na bež podlozi. Slika u dokumentu pokazuje samo ono iz bloka 4 („Prijavi
se"), pa sam promenio samo njega. Ako treba i drugo, to je jedna reč.

Posle ove runde terakota je ostala samo na tom dugmetu i u lepljivoj traci
na telefonu.
