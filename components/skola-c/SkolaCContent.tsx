'use client';

import React, { useState } from 'react';
import FsCModal from '../fs-c/FsCModal';
import { useFsCEnrollTrigger } from '../fs-c/enrollTrigger';
import '../fs-c/fs-c.css';

type ModalIntent = 'prijava' | 'konsultacije';

const modalCopy: Record<ModalIntent, { title: string; subtitle: string }> = {
  prijava: {
    title: 'Prijava za feng shui školu',
    subtitle: 'Ostavite podatke i Dragana će vam se javiti. Bez obaveze.',
  },
  konsultacije: {
    title: 'Zakažite konsultaciju',
    subtitle:
      'Ostavite podatke i dogovaramo besplatan razgovor o vašem prostoru.',
  },
};

/** Ishodi po delovima programa; lista ih prikazuje jedan ispod drugog. */
const ishodi = [
  {
    br: '01',
    naslov: 'Kako da prostor gledate na drugačiji način',
    opis:
      'Okolina, ulaz i raspored prostorija utiču na kvalitet energije i kvalitet života',
  },
  {
    br: '02',
    naslov: 'Znaćete da prepoznate blokade i kako da ih otklonite',
    opis:
      'Jer određeni obrasci ukazuju da prostorija, pravac ili sektor zaslužuju posebnu pažnju',
  },
  {
    br: '03',
    naslov: 'Pratite praktičan redosled',
    opis: 'I svaku prostoriju energetski oplemenite za njenu namenu',
  },
  {
    br: '04',
    naslov: 'Da aktivirate prostor',
    opis:
      'Koristeći jednostavne principe aktivaciju vašeg doma uz pomoć 5 elemenata',
  },
];

/**
 * Feng Shui Škola — verzija C ("Mobilna kartica"), ugrađena u Next.js app.
 * Sadržaj i dizajn-jezik su porat iz prototipa design/skola/verzija-c.html.
 * Nav i footer NE renderujemo ovde — daje ih (site) layout (Header/Footer).
 * Kontakt = modal (SkolaCModal) umesto inline formi iz prototipa.
 */
const SkolaCContent = () => {
  const [modal, setModal] = useState<ModalIntent | null>(null);
  const open = (intent: ModalIntent) => () => setModal(intent);

  // „Sačuvaj svoje mesto" iz navigacije otvara istu prijavu kao dugmad na strani.
  useFsCEnrollTrigger(() => setModal('prijava'));

  return (
    <div className="fs-c">
      {/* BLOK 1 — HERO */}
      <header className="hero">
        {/*
          Pozadina je art-directed: desktop verzija ima praznu levu trećinu,
          mobilna praznu gornju polovinu — tekst u oba slučaja stoji na
          praznini, a Dragana ostaje neisečena. <picture> je namerno umesto
          next/image jer garantuje da se skida samo jedna od dve slike.
        */}
        <picture className="hero-bg">
          {/* Redosled je bitan: pregledač uzima prvi `source` koji odgovara,
              pa mobilne varijante moraju pre desktop varijanti, a AVIF pre
              JPEG-a. Skida se tačno jedan fajl. AVIF je upola lakši od
              JPEG-a pri istom kvalitetu (66 KB naspram 129 KB na desktopu),
              a JPEG ostaje za starije pregledače, pre svega Edge ispod 121. */}
          <source
            media="(max-width: 767px)"
            type="image/avif"
            srcSet="/images/skola-c-hero-mobile.avif"
          />
          <source
            media="(max-width: 767px)"
            srcSet="/images/skola-c-hero-mobile.jpg"
          />
          <source type="image/avif" srcSet="/images/skola-c-hero-desktop.avif" />
          <img
            src="/images/skola-c-hero-desktop.jpg"
            alt="Dragana Jović, Feng Shui"
            fetchPriority="high"
          />
        </picture>
        <div className="hero-in">
          <div className="hero-body stack g24">
            <span className="eyebrow" style={{ color: 'var(--gold-200)' }}>
              Online program · dostupan uvek i svuda
            </span>
            <div className="stack g12">
              <h1>Feng Shui Online program</h1>
              <p className="hero-sub">
                Naučite kako da uskladite dom sa svojim ciljevima
              </p>
            </div>
            <div className="stack g8 hero-cta">
              <button className="btn btn-white" onClick={open('prijava')}>
                Prijavi se
              </button>
              <button className="btn btn-line" onClick={open('konsultacije')}>
                Zakaži besplatnu konsultaciju
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* BLOK 2 — UVOD */}
      <section className="card c-cream">
        <div className="wrap stack g24">
          <h2>Znate li da vaš dom čak sa 30% utiče na vašu sreću?</h2>
          <p className="lead">
            Tokom ove dvomesečne obuke Dragana Jović će vam pokazati kako da
            identifikujete oblasti u vašem prostoru koje vam crpe energiju i
            blokiraju dotok bogatstva, dobre odnose i zdravlje.
          </p>
          <p className="lead">
            Feng shui vam pomaže da otkrijete na koji način vaš prostor može da
            podržava vaš napredak i kako da izbegnete zamke u prostoru koje
            život čini težim.
          </p>
        </div>
      </section>

      {/* BLOK 3 — PROGRAM */}
      <section className="card c-navy" id="program">
        <div className="wrap stack g32">
          <div className="stack g12">
            <span className="eyebrow">Feng shui online program</span>
            <h2>Plan za 8 nedelja obuke</h2>
          </div>
          <div className="steps steps-4">
            <div className="step">
              <span className="n">01</span>
              <h3>Osnovne postavke</h3>
              <p>Kako se uskladiti sa energijom svog prostora</p>
            </div>
            <div className="step">
              <span className="n">02</span>
              <h3>Dijagnostika prostora</h3>
              <p>Blokade i kako ih otkloniti</p>
            </div>
            <div className="step">
              <span className="n">03</span>
              <h3>Delovi prostora</h3>
              <p>I kako ih organizovati u skladu sa vašom energijom</p>
            </div>
            <div className="step">
              <span className="n">04</span>
              <h3>Aktivacija</h3>
              <p>Kako da pokrenete uzlaznu spiralu života</p>
            </div>
          </div>
          <p className="lead">
            Svaka sesija se nadovezuje na prethodnu. Počećete sa ulogom Chi-ja,
            ispitati feng shui plan prostora, locirati moguće izvore blokada i
            videti kako se biraju korekcije.
          </p>
          <button className="btn btn-gold" onClick={open('prijava')}>
            Pokaži mi kako moj prostor utiče na moj život
          </button>
        </div>
      </section>

      {/* BLOK 4 — CITAT + PRIJAVA */}
      <section className="card c-sand" id="prijava">
        <div className="wrap stack g32">
          <h2
            style={{
              fontSize: 'clamp(1.5rem,5.4vw,2.4rem)',
              fontWeight: 600,
              lineHeight: 1.3,
            }}
          >
            „Nije potrebno da sve u vašem domu promenite kada znate šta ugrožava
            vašu energiju i kako da precizno primenite feng shui&rdquo;
          </h2>
          <div className="stack g24">
            <div className="stack g12">
              <h3>Program se održava online.</h3>
              <p className="lead">
                Broj mesta je ograničen kako bi svaki od učesnika dobio punu
                pažnju i konkretna rešenja za svoj prostor.
              </p>
            </div>
            <button className="btn btn-white" onClick={open('prijava')}>
              Prijavi se
            </button>
          </div>
        </div>
      </section>

      {/* BLOK 5 — ZAŠTO PROSTOR UTIČE */}
      <section className="card c-navy">
        <div className="wrap stack g32">
          <div className="emap-head stack g12">
            <span className="eyebrow">Zašto prostor utiče na vas</span>
            <h2>Vaš prostor ima energetsku mapu</h2>
            <p className="lead">
              Feng shui se bavi životnom energijom Chi i kako se ona kreće.
            </p>
          </div>

          <p className="emap-p">
            Način na koji Chi ulazi, sakuplja se i kreće kroz vaš dom može
            uticati na to koliko je to okruženje podržavajuće. Kada energija
            dobro teče, prostor je pogodan za oporavak, fokus, povezivanje i
            napredak.
          </p>

          <div className="stack g16">
            <p className="emap-cue">
              Kada postane slab, blokiran ili loše raspoređen, možete iskusiti:
            </p>
            <ul className="emap-grid">
              <li>Kašnjenja uprkos stalnim naporima</li>
              <li>Niska energija bez očiglednog razloga</li>
              <li>Teškoće sa koncentracijom ili donošenjem odluka</li>
              <li>Napetost u određenim oblastima života</li>
              <li>Osećaj da svakodnevni zadaci zahtevaju previše truda</li>
              <li>Imate osećaj da trčite u mestu</li>
            </ul>
          </div>

          <p className="emap-p">
            Feng shui vam daje sistem za otklanjanje ovih obrazaca.
          </p>
          <p className="emap-p is-muted">
            Videćete kako se oblici, forme, sektori i oblasti koriste zajedno za
            procenu prostora. Ovo vam daje praktičnu početnu tačku za
            odlučivanje na šta je prvo potrebno obratiti pažnju.
          </p>

          <button
            className="btn btn-gold emap-cta"
            onClick={open('prijava')}
          >
            Pokaži mi kako moj prostor utiče na moj život
          </button>
        </div>
      </section>

      {/* BLOK 6 — ZA KOGA JE */}
      <section className="card c-cream" id="za-koga">
        <div className="wrap">
          <div className="whofor">
            <div className="whofor-aside">
              <div>
                <h2>Feng shui online škola je za vas ako&hellip;</h2>
              </div>
              <p className="whofor-note">
                Predznanje nije potrebno. Ponesite otvoren um i spremnost da
                svoj prostor vidite drugačije.
              </p>
            </div>
            <ul className="whofor-list">
              <li>
                <span>Volite sami da uređujete svoj dom i želite da znate kako
                da kroz prostor unosite poboljšanje za sebe i svoju
                porodicu.</span>
              </li>
              <li>
                <span>Čuli ste za feng shui, ali ne znate odakle da počnete da
                ga primenjujete u svom domu.</span>
              </li>
              <li>
                <span>Želite jasan smer umesto razbacanih saveta sa interneta i
                „srećnih predmeta&rdquo;.</span>
              </li>
              <li>
                <span>Radite na sebi, ali osećate da ulažete veliki napor a
                rezultati su mali.</span>
              </li>
              <li>
                <span>Želite korekcije koje se mogu primeniti i bez velikih
                renoviranja i skupih predmeta.</span>
              </li>
              <li>
                <span>Selite se, gradite ili renovirate i želite da to odmah uradite
                kako treba.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* BLOK 7 — ŠTA ĆETE NAUČITI */}
      <section className="card c-sand">
        <div className="wrap stack g32">
          <div className="stack g12">
            <span className="eyebrow">Ishod</span>
            <h2>Tokom programa ćete naučiti</h2>
          </div>

          <div className="learn">
            <div className="learn-col">
            <div className="learn-list">
              {ishodi.map((it) => (
                <div key={it.br} className="learn-item">
                  <span className="ln">{it.br}</span>
                  <span className="lt">{it.naslov}</span>
                  <span className="ld">{it.opis}</span>
                </div>
              ))}
            </div>
              <button className="btn btn-accent" onClick={open('prijava')}>
                Rezerviši mi mesto
              </button>
            </div>

            <aside className="learn-price">
              <span className="lp-label">Cena programa</span>
              <span className="lp-value">289 &euro;</span>
              <p className="lp-note">
                Broj mesta je ograničen. Rezervišite svoje mesto na vreme.
              </p>
            </aside>
          </div>
        </div>
      </section>

      {/* BLOK 8 — KAKO IZGLEDA KURS */}
      <section className="card c-cream">
        <div className="wrap stack g32">
          <div className="stack g12">
            <span className="eyebrow">Kako izgleda kurs</span>
            <h2>
              Osam nedelja, tempo koji možete da pratite uz posao i porodicu
            </h2>
          </div>

          <div>
            {/* Traka deli grid sa kolonama ispod, pa tačke stoje tačno
                iznad naslova. Dekoracija — čitaču ekrana ne govori ništa
                što tekst ispod već ne kaže. */}
            <div className="course-rail" aria-hidden="true">
              <span className="rail-dot is-on" />
              <span className="rail-dot" />
              <span className="rail-dot" />
              <span className="rail-dot" />
              <span className="rail-end">nedelja 8</span>
            </div>

            <div className="course-cols">
              <div className="course-col">
                <h3>Sesije uživo</h3>
                <p>
                  Interaktivni časovi sa demonstracijama i pitanjima. Sve se
                  snima, pa ništa ne propuštate.
                </p>
              </div>
              <div className="course-col">
                <h3>Materijali</h3>
                <p>
                  Detaljni materijali i vizuelni vodiči kroz onlajn platformu,
                  dostupni i nakon završetka kursa.
                </p>
              </div>
              <div className="course-col">
                <h3>Mala grupa</h3>
                <p>
                  Broj polaznica je ograničen, da bih svakome od vas mogla lično
                  da se posvetim.
                </p>
              </div>
              <div className="course-col">
                <h3>Praktični zadaci</h3>
                <p>
                  Vaš dom je učionica: svaka lekcija se odmah primenjuje, uz
                  povratnu informaciju.
                </p>
              </div>
            </div>
          </div>

          <p className="course-note">
            Feng shui postaje korisniji kada znate šta tražite i zašto je
            potrebna određena korekcija.
          </p>
        </div>
      </section>

      {/* BLOK 9 — UTISCI */}
      <section className="card c-sand" id="rezultati">
        <div className="wrap stack g32">
          <div className="stack g12">
            <span className="eyebrow">Rezultati</span>
            <h2>Šta kažu polaznice</h2>
          </div>
          {/* Metrika „10 dana" je izbačena 27.08. na klijentov zahtev, pa
              su sva tri utiska sada obični citati. Izabelin i dalje stoji
              sam u redu, kao istaknut. */}
          <article className="tst tst-lead">
            <q>
              Mnogo sam zahvalna na kursu, znanju i nesebičnom predavanju koje
              ste nam davali. Zato učim i dalje i zato sam nastavila obuku.
              Postavkom mog severa, u roku od deset dana promenio mi se poslovni
              svet i aktivirale su se mnoge poslovne okolnosti. Radujem se
              svemu što nam tek predstoji.
            </q>
            <footer className="who">Izabela</footer>
          </article>
          <div className="quotes">
            <article className="tst">
              <q>
                Ova škola je najbolja moguća ulaznica u principe feng šui
                prakse, vođena na iskren i prijateljski način, a utemeljena na
                velikom znanju i iskustvu predavača. Dragana majstorski vodi
                svoje učenike i stara se da iz svih aspekata sagledamo tajne ove
                drevne veštine i filozofije života, kroz dobro osmišljena
                predavanja i detaljne diskusije na razne teme. Škola nas je
                povezala u misiju koja oplemenjuje, kako naše živote, tako i
                naše okruženje i koju sada, sa radošću, nastavljamo zajedničkim
                snagama. Pridružite nam se.
              </q>
              <footer className="who">Jovana</footer>
            </article>
            <article className="tst">
              <q>
                Naučila sam da usaglasim energiju prostora sa svojom energijom i
                to itekako radi! Hvala Dragani na svemu i radujem se novim
                temama i izazovima. Moja topla preporuka za školu, početnicima
                savetujem da sve što rade u stanu, zapisuju jer će tako najbolje
                da uvide povezanost sa dobrim dešavanjima.
              </q>
              <footer className="who">Mara</footer>
            </article>
          </div>
        </div>
      </section>

      {/* BLOK 10 — O MENI */}
      <section className="card c-navy about" id="o-meni">
        <div className="about-bg">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/skola-c-o-meni.jpg"
            alt="Dragana Jović"
            loading="lazy"
            decoding="async"
          />
        </div>
        <div className="wrap about-in">
          <div className="about-col stack g24">
            <div className="stack g16">
              <span className="eyebrow">O meni</span>
              <h2>Dragana Jović</h2>
              <p className="lead">
                Moj put je počeo daleko od Feng Shui, na Tehničko-metalurškom
                fakultetu u Beogradu. Ta osnova dala mi je sposobnost da vidim
                prostor ne samo kao estetiku, već kao sistem koji utiče na sve
                oko sebe.
              </p>
              <p className="lead">
                Danas, nakon 25 godina i više od 1000 projekata, ono što me
                pokreće nije tehnika, već trenutak kada klijentkinja kaže:
                „Konačno se osećam kao kod kuće u sopstvenom domu.&rdquo;
              </p>
            </div>
            <div className="stats">
              <div>
                <b>25</b>
                <span>godina iskustva</span>
              </div>
              <div>
                <b>1000+</b>
                <span>projekata</span>
              </div>
              <div>
                <b>180+</b>
                <span>radionica</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BLOK 12 — FAQ */}
      <section className="card c-cream" id="faq">
        <div className="wrap stack g24">
          <div className="stack g12">
            <span className="eyebrow">Pitanja</span>
            <h2>Pre nego što se prijavite</h2>
          </div>
          {/* Zajednicki `name` pravi harmoniku: otvaranje jednog
              pitanja zatvara prethodno, bez JavaScript-a. Stariji
              pregledaci koji atribut ne poznaju samo zadrze staro
              ponasanje, gde ostaju svi otvoreni. */}
          <div className="faq">
            <details name="faq" open>
              <summary>Da li mi treba prethodno znanje o feng shui-ju?</summary>
              <p>
                Nije potrebno. Program počinje od osnova i postepeno gradi
                naprednije koncepte. Pristupačan je potpunim početnicima, a i
                dalje vredan onima sa nešto iskustva.
              </p>
            </details>
            <details name="faq">
              <summary>Šta ako propustim sesiju uživo?</summary>
              <p>
                Sve sesije uživo se snimaju i postaju dostupne u roku od 24 sata.
                Prisustvo uživo je korisnije zbog pitanja, ali mnogi polaznici
                uspešno završe program gledajući snimke.
              </p>
            </details>
            <details name="faq">
              <summary>Koliko vremena treba da izdvojim nedeljno?</summary>
              <p>
                Računajte na nekoliko sati nedeljno: sesiju, čitanje i praktični
                zadatak na sopstvenom prostoru.
              </p>
            </details>
            <details name="faq">
              <summary>
                Mogu li da primenim ovo ako živim u stanu ili iznajmljenom
                prostoru?
              </summary>
              <p>
                Da. Program pokriva prilagođavanja za sve situacije, uključujući
                iznajmljene i male prostore, bez građevinskih zahvata.
              </p>
            </details>
            <details name="faq">
              <summary>Koliko dugo imam pristup materijalima?</summary>
              <p>
                Materijalima i snimcima sesija imate pristup tokom celog trajanja
                kursa.
              </p>
            </details>
            <details name="faq">
              <summary>Kako se vrši plaćanje?</summary>
              <p>
                Detalje oko plaćanja dobijate nakon prijave. Javićemo vam se sa
                svim informacijama i načinima uplate.
              </p>
            </details>
          </div>
        </div>
      </section>

      {/* BLOK 11 — UPIS I ZATVARANJE (spojeni 27.08.)
          Terakota sekcija „Upis" i zatvaranje pred footerom bile su dva
          bloka koja su govorila istu stvar. Sada su jedan zeleni: osnovne
          informacije, poziv na prijavu i tri brojke. */}
      <section className="card c-navy" id="upis">
        <div className="wrap close">
          <span className="eyebrow">Upis</span>
          <h2>Mesto se rezerviše prijavom</h2>
          <p className="lead">
            Ostavite svoje podatke i javićemo vam se sa detaljima oko uplate i
            pristupa kursu.
          </p>

          {/* PAŽNJA: datum i vreme su IZMIŠLJENI, na zahtev, dok ne stigne
              tačan termin. Menjaju se ovde i nigde više. */}
          <div className="upis-fakti">
            <div>
              <span className="lbl">Program kreće</span>
              <span className="val">14. oktobar 2026.</span>
              <span className="sub">utorkom u 19h</span>
            </div>
            <div>
              <span className="lbl">Trajanje</span>
              <span className="val">8 nedelja</span>
              <span className="sub">online, sve se snima</span>
            </div>
            <div>
              <span className="lbl">Cena</span>
              <span className="val">289 &euro;</span>
              <span className="sub">broj mesta je ograničen</span>
            </div>
          </div>

          <ul className="enroll-chips">
            <li>8 nedelja lekcija, dostupnih celo vreme</li>
            <li>Konsultacije uživo sa Draganom</li>
            <li>Praktični zadaci nakon svake lekcije</li>
            <li>Grupa za podršku polaznica</li>
          </ul>

          <div className="close-cta">
            <button className="btn btn-white" onClick={open('prijava')}>
              Prijavi se
            </button>
            <button className="btn btn-line" onClick={open('konsultacije')}>
              Zakaži konsultaciju
            </button>
          </div>

          <div className="close-proof">
            <div>
              <b>1000+</b>
              <span>projekata</span>
            </div>
            <div>
              <b>25</b>
              <span>godina iskustva</span>
            </div>
            <div>
              <b>180+</b>
              <span>održanih radionica</span>
            </div>
          </div>
        </div>
      </section>

      {/* Lepljiva traka (mobilno) */}
      <div className="sticky">
        <div className="meta">
          <b>Upis u toku</b>
          <span>kreće u oktobru 2026.</span>
        </div>
        <button className="btn btn-accent" onClick={open('prijava')}>
          Prijavi se
        </button>
      </div>

      <FsCModal
        open={modal !== null}
        onClose={() => setModal(null)}
        title={modal ? modalCopy[modal].title : undefined}
        subtitle={modal ? modalCopy[modal].subtitle : undefined}
        serviceType="Feng Shui škola (kurs)"
        heardFrom="Škola (verzija C)"
      />
    </div>
  );
};

export default SkolaCContent;
