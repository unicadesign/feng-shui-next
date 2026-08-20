'use client';

import React, { useState } from 'react';
import FsCModal from '../fs-c/FsCModal';
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

/** Talas ispred naslova kartice; sa tačkom označava energiju koja zastane. */
const Talas = ({ tacka = false }: { tacka?: boolean }) => (
  <svg width="38" height="12" viewBox="0 0 38 12" fill="none" aria-hidden="true" focusable="false">
    <path
      d="M2 6c2.2-4.5 4.4-4.5 6.6 0s4.4 4.5 6.6 0 4.4-4.5 6.6 0"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
    />
    {tacka && <circle cx="30.5" cy="6" r="2.6" fill="currentColor" />}
  </svg>
);

/** Ishodi po delovima programa. `kratko` nosi lista, `puno` panel. */
const ishodi = [
  {
    br: '01',
    eyebrow: 'posle prvog dela',
    naslov: 'Da čitate tlocrt',
    kratko: 'Tlocrt sa pravcem kompasa',
    puno:
      'Nacrtaćete tlocrt svog doma sa pravcem kompasa i videti kuda energija ulazi i kuda odlazi.',
  },
  {
    br: '02',
    eyebrow: 'posle drugog dela',
    naslov: 'Da prepoznate blokadu',
    kratko: 'Nered ili stvarna blokada',
    puno:
      'Znaćete da razlikujete običan nered od stvarne energetske blokade i šta vam koja govori.',
  },
  {
    br: '03',
    eyebrow: 'posle trećeg dela',
    naslov: 'Da uredite prostorije',
    kratko: 'Svaka prostorija po svojim pravilima',
    puno:
      'Spavaća soba, radni ugao, kuhinja i kupatilo. Svaka ima svoju logiku i svoja pravila.',
  },
  {
    br: '04',
    eyebrow: 'posle četvrtog dela',
    naslov: 'Da aktivirate prostor',
    kratko: 'Lični energetski broj i korekcije',
    puno:
      'Izračunaćete svoj lični energetski broj i znati koje korekcije podržavaju baš vaše ciljeve.',
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
  const [ishod, setIshod] = useState(0);
  const open = (intent: ModalIntent) => () => setModal(intent);

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
          <source
            media="(max-width: 767px)"
            srcSet="/images/skola-c-hero-mobile.jpg"
          />
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
            <h1>NOVI dvomesečni feng shui kurs sa Draganom Jović</h1>
            <div className="stack g8">
              <button className="btn btn-accent" onClick={open('prijava')}>
                Pokaži mi kako moj prostor utiče na moj život
              </button>
              <button className="btn btn-white" onClick={open('konsultacije')}>
                Zakaži besplatnu konsultaciju
              </button>
              <span className="micro">
                Besplatno i bez obaveze · odgovor u roku od 24h
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Skok-navigacija (krugovi) */}
      <div className="c-cream" style={{ paddingTop: '1.5rem' }}>
        <div className="wrap">
          <nav className="jump">
            <a href="#program">
              <span className="dot">◷</span>Program
            </a>
            <a href="#za-koga">
              <span className="dot">◈</span>Za koga je
            </a>
            <a href="#rezultati">
              <span className="dot">❝</span>Rezultati
            </a>
            <a href="#o-meni">
              <span className="dot">✧</span>O meni
            </a>
            <a href="#upis">
              <span className="dot">◉</span>Upis
            </a>
            <a href="#faq">
              <span className="dot">?</span>Pitanja
            </a>
          </nav>
        </div>
      </div>

      {/* BLOK 2 — UVOD */}
      <section className="card c-cream">
        <div className="wrap stack g24">
          <h2>
            Vi i vaše okruženje ste u stalnoj interakciji i međusobnom uticaju
          </h2>
          <p className="lead">
            Tokom ove dvomesečne obuke Dragana Jović će vam pokazati kako da
            identifikujete oblasti u vašem prostoru koje vam možda crpe energiju
            i prave blokade za vaše bogatstvo, odnose i zdravlje.
          </p>
          <p className="lead">
            Feng shui vam pomaže da otkrijete da li vaš prostor podržava vaš
            napredak ili vam život čini težim.
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
              <p>Kako da feng shui funkcioniše na pravi način</p>
            </div>
            <div className="step">
              <span className="n">02</span>
              <h3>Blokade u prostoru</h3>
              <p>Kako ih pronaći i šta nam govore</p>
            </div>
            <div className="step">
              <span className="n">03</span>
              <h3>Delovi prostora</h3>
              <p>I kako da rade za našu korist</p>
            </div>
            <div className="step">
              <span className="n">04</span>
              <h3>Aktivacija</h3>
              <p>Kako da pokrenete uzlaznu spiralu</p>
            </div>
          </div>
          <p className="lead">
            Obuka je podeljena na četiri dela i svaki se nadovezuje na prethodni.
            Krećete od toga kako energija ulazi i kreće se kroz prostor, učite da
            prepoznate gde zastaje, pa tek onda kako se bira korekcija. Tako menjate ono što ima efekta, a ne sve odjednom.
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
            „Nije potrebno da sve u vašem domu promenite, ali morate da znate šta
            ugrožava vašu energiju i kako da to precizno promenite&rdquo;
          </h2>
          <div className="stack g24">
            <div className="stack g12">
              <h3>Program se održava online.</h3>
              <p className="lead">
                Broj mesta je ograničen kako bi svaki od učesnika dobio punu
                pažnju i konkretna rešenja za svoj prostor.
              </p>
            </div>
            <div className="stack g8">
              <button className="btn btn-accent" onClick={open('prijava')}>
                Prijavi se za besplatne konsultacije
              </button>
              <span className="micro">
                Popunjavate kratak upitnik. Otvara se ovde, bez napuštanja
                stranice.
              </span>
            </div>
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
              Feng Shui je za dom ono što je akupunktura za telo: otkriva blokade
              koje ne vidite i vraća prirodan protok energije.
            </p>
          </div>

          <div className="emap">
            <div className="emap-card emap-flow">
              <header>
                <Talas />
                <b>Kada teče</b>
              </header>
              <p>
                Prostor podržava san, fokus i odnose. Dom vas dočeka i napuni.
              </p>
            </div>

            <div className="emap-card emap-stall">
              <header>
                <Talas tacka />
                <b>Kada zastane</b>
              </header>
              <ul className="emap-list">
                <li>Umesto mira kod kuće osetite težinu.</li>
                <li>Nered se vraća, fokus stalno beži.</li>
                <li>Nešto „ne štima&rdquo;, a ne znate šta.</li>
                <li>Radite na sebi, ali dom vas ne podržava.</li>
                <li>Soba koju izbegavate, ugao koji odbija.</li>
              </ul>
            </div>
          </div>

          <p className="emap-close">
            <span className="a">Ne popravljamo dom.</span>
            <span className="b">Usklađujemo ga sa vama.</span>
          </p>
        </div>
      </section>

      {/* BLOK 6 — ZA KOGA JE */}
      <section className="card c-cream" id="za-koga">
        <div className="wrap">
          <div className="whofor">
            <div className="whofor-aside">
              <div>
                <span className="eyebrow">Za koga je</span>
                <h2>Feng shui online škola je za vas ako&hellip;</h2>
              </div>
              <p className="whofor-note">
                Predznanje nije potrebno. Ponesite tlocrt svog stana, otvoren um
                i spremnost da svoj prostor vidite drugačije.
              </p>
            </div>
            <ul className="whofor-list">
              <li>
                <span>Volite sami da uređujete svoj dom i želite da znate{' '}
                <em>zašto</em> nešto radite, a ne samo šta.</span>
              </li>
              <li>
                <span>Čuli ste za feng shui termine, ali ne znate odakle da počnete sa
                sopstvenim prostorom.</span>
              </li>
              <li>
                <span>Želite jasan okvir umesto razbacanih saveta sa interneta i
                „srećnih predmeta&rdquo;.</span>
              </li>
              <li>
                <span>Radite na sebi, ali osećate da vas dom u tome ne prati.</span>
              </li>
              <li>
                <span>Želite korekcije koje se primenjuju bez renoviranja i bez velikih
                troškova.</span>
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
            <div className="learn-list" role="tablist" aria-label="Ishodi po delovima programa">
              {ishodi.map((it, i) => (
                <button
                  key={it.br}
                  type="button"
                  role="tab"
                  aria-selected={ishod === i}
                  className="learn-item"
                  onClick={() => setIshod(i)}
                  onMouseEnter={() => setIshod(i)}
                  onFocus={() => setIshod(i)}
                >
                  <span className="ln">{it.br}</span>
                  <span className="lt">{it.naslov}</span>
                  <span className="ld">{it.kratko}</span>
                  <span className="la" aria-hidden="true">
                    &rarr;
                  </span>
                </button>
              ))}
            </div>
              <button className="btn btn-accent" onClick={open('prijava')}>
                Rezerviši mi mesto
              </button>
            </div>

            <aside className="learn-panel" aria-live="polite">
              <span className="pe">{ishodi[ishod].eyebrow}</span>
              <span className="pt">{ishodi[ishod].naslov}</span>
              <p className="pd">{ishodi[ishod].puno}</p>
              <div className="pc">
                Deo {ishodi[ishod].br} od {ishodi.length}
              </div>
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
                  dostupni celo vreme.
                </p>
              </div>
              <div className="course-col">
                <h3>Mala grupa</h3>
                <p>
                  Broj polaznica je namerno ograničen, da svaka dobije prostor i
                  pažnju.
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
            <h2>Šta se promenilo u brojkama</h2>
          </div>
          <div className="results">
            <article className="tst">
              <div className="res">12 klijenata</div>
              <p className="res-note">od polaznice do sopstvene prakse</p>
              <q>
                Pre škole sam mislila da Feng Shui znači staviti bambus u ugao.
                Sada radim konsultacije i već imam 12 stalnih klijenata.
              </q>
              <footer className="who">Jelena M. · Beograd</footer>
            </article>
            <article className="tst">
              <div className="res">2 prostora</div>
              <p className="res-note">dom i kancelarija, po istim principima</p>
              <q>
                Upisao sam se jer je žena insistirala. Naš dom se transformisao,
                ali najviše me iznenadilo koliko se promenio moj fokus na poslu.
              </q>
              <footer className="who">Milan D. · Novi Sad</footer>
            </article>
            <article className="tst">
              <div className="res">15 godina</div>
              <p className="res-note">u struci, pa ipak nova dimenzija</p>
              <q>
                Kao dizajnerka enterijera sa 15 godina iskustva, mislila sam da
                znam sve o prostoru. Sada kombinujem dizajn sa Feng Shui
                principima i klijenti osećaju razliku, čak i skeptici.
              </q>
              <footer className="who">Svetlana K. · Ljubljana</footer>
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

      {/* BLOK 11 — UPIS / CENA */}
      <section className="card c-accent" id="upis">
        <div className="wrap">
          <div className="enroll">
            <div className="enroll-rule" aria-hidden="true" />
            <span className="eyebrow">Upis</span>
            <h2>Feng shui online program u 8 nedelja</h2>

            <div className="enroll-when">
              <div>
                <span className="lbl">Program kreće</span>
                <span className="val">oktobar 2026.</span>
              </div>
            </div>
            <p className="enroll-note">
              Cena i tačan datum upisa biće objavljeni uskoro.
            </p>

            <ul className="enroll-chips">
              <li>8 nedelja lekcija, dostupnih celo vreme</li>
              <li>Konsultacije uživo sa Draganom</li>
              <li>Praktični zadaci nakon svake lekcije</li>
              <li>Grupa za podršku polaznica</li>
            </ul>

            <button className="btn btn-white" onClick={open('prijava')}>
              Rezervišite mesto
            </button>
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

      {/* BLOK 13 — FINALNI CTA */}
      <section className="card c-navy" id="upis-dole">
        <div className="wrap close">
          <h2>Mesto se rezerviše prijavom</h2>
          <p className="lead">
            Ostavite svoje podatke i javićemo vam se sa detaljima oko uplate i
            pristupa kursu.
          </p>
          <div className="close-cta">
            <button className="btn btn-accent" onClick={open('prijava')}>
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
