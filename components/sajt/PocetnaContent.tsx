'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import PrijavaModal from './PrijavaModal';
import { useEnrollTrigger } from './enrollTrigger';
import './fs-c.css';

type ModalIntent = 'konsultacije' | 'nekretnina' | 'radionice' | 'prijava';

/**
 * Samo `prijava` je upis u školu: jedina vodi na podatke za uplatu i
 * jedina pokreće mejl sa instrukcijama. Ostale tri su upiti na koje se
 * Dragana javlja lično, pa idu na zajedničku stranicu zahvalnice.
 */
const modalCopy: Record<
  ModalIntent,
  {
    title: string;
    subtitle: string;
    serviceType: string;
    intent: 'prijava' | 'konsultacije';
    redirectTo: string;
  }
> = {
  konsultacije: {
    title: 'Zakažite besplatnu konsultaciju',
    subtitle:
      'Ostavite podatke i dogovaramo razgovor o vašem prostoru, bez obaveze.',
    serviceType: 'Individualne konsultacije',
    intent: 'konsultacije',
    redirectTo: '/hvala',
  },
  nekretnina: {
    title: 'Asistencija pri izboru nekretnine',
    subtitle: 'Ostavite podatke i javljamo se sa detaljima procene prostora.',
    serviceType: 'Asistencija pri izboru nekretnine',
    intent: 'konsultacije',
    redirectTo: '/hvala',
  },
  radionice: {
    title: 'Radionice',
    subtitle: 'Ostavite podatke i obavestićemo vas čim otvorimo nove termine.',
    serviceType: 'Radionice',
    intent: 'konsultacije',
    redirectTo: '/hvala',
  },
  /* Otvara ga „Sačuvaj svoje mesto" iz navigacije. Natpis obećava upis u
     školu, pa i modal mora da govori o školi, a ne o konsultacijama. */
  prijava: {
    title: 'Prijava za Feng Shui školu',
    subtitle: 'Popunite podatke i odmah dobijate instrukcije za uplatu.',
    serviceType: 'Feng Shui škola',
    intent: 'prijava',
    redirectTo: '/uplata',
  },
};

/**
 * Početna ("Mobilna kartica"), ugrađena u Next.js app.
 * Sadržaj i dizajn-jezik potiču iz HTML prototipa „verzija C" (obrisan iz
 * repoa pri prelasku 09.2026.; u istoriji: design/pocetna/verzija-c.html).
 * Nav i footer daje (site) layout (Header/Footer). Kontakt = deljeni modal.
 * Uslovni video ("Zašto Feng Shui") i iskakanje ebooka su izostavljeni dok
 * ne stigne materijal/odluka klijenta (vidi tabla → Backlog).
 */
const PocetnaContent = () => {
  const [modal, setModal] = useState<ModalIntent | null>(null);
  const open = (intent: ModalIntent) => () => setModal(intent);

  useEnrollTrigger(() => setModal('prijava'));

  return (
    <div className="fs-c">
      {/* HERO */}
      <header className="hero hero-pocetna">
        {/* Originalna fotografija, sa svojom svetlom studijskom pozadinom.
            Zelenu preko leve polovine crta `.hero-bg::after` iz CSS-a, ne
            slika, da se preliv sam prilagodi širini ekrana.
            Desktop platno je 2200x1000: portret je uspravan, pa je zid
            levo od nje razvučen iz čistog pojasa (0..134 skalirane slike,
            levo od njene ivice na 148). Ogledanje tog pojasa je u prvom
            pokušaju uhvatilo i nju i po zidu su se videli njeni duhovi. */}
        <picture className="hero-bg hero-foto">
          <source
            media="(max-width: 767px)"
            type="image/avif"
            srcSet="/images/pocetna-c-hero-bela-mobile.avif"
          />
          <source
            media="(max-width: 767px)"
            srcSet="/images/pocetna-c-hero-bela-mobile.jpg"
          />
          {/* Uski desktop dobija svoje platno: ono široko (odnos 1,9) je na
              768px `cover` sekao za 634px sleva i Dragana je klizila u
              sredinu, pravo preko naslova. Tablet platno je skoro kvadratno
              (1,10), pa jedva da se seče i ona stoji stabilno na 56–59%. */}
          <source
            media="(max-width: 1199px)"
            type="image/avif"
            srcSet="/images/pocetna-c-hero-bela-tablet.avif"
          />
          <source
            media="(max-width: 1199px)"
            srcSet="/images/pocetna-c-hero-bela-tablet.jpg"
          />
          <source type="image/avif" srcSet="/images/pocetna-c-hero-bela.avif" />
          <img
            src="/images/pocetna-c-hero-bela.jpg"
            alt="Dragana Jović, Feng Shui konsultant"
            fetchPriority="high"
          />
        </picture>
        <div className="hero-in">
          <div className="hero-body stack g24">
            {/* Naslov u dva reda, sa tačkom posle „Feng Shui." — klijent,
                01.09. Prelom je tvrd, ne prepušten širini. */}
            <h1>
              Feng Shui.
              <br />
              Da vam se život konačno pokrene.
            </h1>
            {/* Boju vodi `.hero-pocetna .lead` iz CSS-a; hero je sada beo,
                pa bež iz vremena zelene podloge više ne važi. */}
            <p className="lead">
              Milioni širom sveta već osećaju blagodeti Feng Shui-ja. Više
              napretka, sklada i mira. Vaš dom je sledeći.
            </p>
            {/* Samo upis. „Zakažite besplatnu konsultaciju" je iz heroja
                izbačeno 01.09. na klijentov zahtev: uz upis je delovalo kao
                da se analiza deli besplatno. Ostaje u zelenoj sekciji pred
                kraj i u lepljivoj traci, po Markovoj odluci istog dana. */}
            <div className="stack g8 hero-cta">
              <button className="btn btn-zlatno" onClick={open('prijava')}>
                Upis u Feng Shui školu
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* KPI — traka odmah ispod heroa. Zlatna podloga iza nje je blago
          zarotirana i viri gore i dole; crta je `.kpi::before`, pa nema
          dodatnog elementa u HTML-u.
          Geometrija formi je IZMERENA iz `public/logo/simbol-20.png`, ne
          crtana od oka: krug je upisan u kvadrat (odnos prečnika i
          stranice 1,0000), a trougao je jednakostraničan i upisan u krug,
          temenom nagore — osnovica na 0,7495 stranice i široka 0,8666
          (teorijski 0,7500 i 0,8660). Trougao je pomeren 3,88 naniže da
          mu okvir optički stoji u sredini pored druge dve forme. */}
      <section className="kpi" aria-label="Feng Shui u brojkama">
        <div className="wrap kpi-in">
          <div>
            <svg className="kpi-ikona" viewBox="0 0 40 40" aria-hidden="true">
              <rect x="4.5" y="4.5" width="31" height="31" />
            </svg>
            <b>1000+</b>
            <span>Projekata</span>
          </div>
          <div>
            <svg className="kpi-ikona" viewBox="0 0 40 40" aria-hidden="true">
              <circle cx="20" cy="20" r="15.5" />
            </svg>
            <b>25+</b>
            <span>Godina iskustva</span>
          </div>
          <div>
            <svg className="kpi-ikona" viewBox="0 0 40 40" aria-hidden="true">
              <polygon points="20,8.38 33.42,31.62 6.58,31.62" />
            </svg>
            <b>180+</b>
            <span>Radionica</span>
          </div>
        </div>
      </section>

      {/* USLUGE — krugovi */}
      <section className="card c-cream" id="usluge">
        <div className="wrap stack g32">
          <div className="stack g12">
            <span className="eyebrow">Usluge</span>
            <h2>Izaberite svoj put ka ravnoteži</h2>
          </div>
          <div className="circles">
            <div className="circ">
              <div className="disc">
                <span className="tint t-2" />
                <span className="lbl">
                  <i>naučite sami</i>
                  <b>Feng Shui Škola</b>
                  <Link className="pill" href="/school">
                    Saznajte više
                  </Link>
                </span>
              </div>
              <p>
                Namenjena je onima koji vole sami da uređuju svoj dom. Kroz
                energetsko uređenje dobijate mogućnost da poboljšate zdravlje,
                stabilizujete odnose i uvećate prihode.
              </p>
            </div>

            <div className="circ">
              <div className="disc">
                <span className="tint t-1" />
                <span className="lbl">
                  <i>za vaš dom</i>
                  <b>Individualne konsultacije</b>
                  {/* Ne otvara modal nego vodi na „Tri koraka" ispod: klijent
                      hoće da posetilac prvo vidi kako proces ide, pa tek
                      onda obrazac. Sidro, ne dugme — to je navigacija. */}
                  <a className="pill" href="#tri-koraka">
                    Saznajte više
                  </a>
                </span>
              </div>
              <p>
                Personalizovani proračun prostora i harmonizacija doma, uz konkretne instrukcije šta promeniti da biste otklonili zastoj u
                prilivu novca, komunikaciji, zdravlju ili karijeri.
              </p>
            </div>

            <div className="circ">
              <div className="disc">
                <span className="tint t-3" />
                <span className="lbl">
                  <i>pre kupovine</i>
                  <b>Izbor nekretnine</b>
                  <button className="pill" onClick={open('nekretnina')}>
                    Saznajte više
                  </button>
                </span>
              </div>
              <p>
                Izaberite dom ili radni prostor usklađen sa vašom energijom.
                Ekspertiza koja vam pomaže da izbegnete ponude sa energetskim
                zamkama.
              </p>
            </div>

            <div className="circ">
              <div className="disc">
                <span className="tint t-4" />
                <span className="lbl">
                  <i>uživo, u grupi</i>
                  <b>Radionice</b>
                  <button className="pill" onClick={open('radionice')}>
                    Prijavi interes
                  </button>
                </span>
              </div>
              <p>
                Grupni susreti uživo, kroz rad na konkretnim primerima. Novi
                termini se najavljuju uskoro.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* TRI KORAKA — prenet sa žive početne 01.09. na klijentov zahtev, a
          istog dana prerađen u pravac „B — Nit" koji je Marko izabrao od tri
          predloga: tri bela kruga sa zelenim obrubom na zelenoj niti koja
          talasa iza njih. Krugovi su isti motiv kao zlatni krugovi usluga
          iznad, samo beli da se ne pomešaju sa njima.

          Tekst je pročitan IZ BAZE (`site_content`, strana `home`, ključ
          `thePlan`), ne iz `data/defaultContent.ts`: admin ga je menjao i
          verzija u kodu je zastarela.

          Dugme vodi na `/upitnik`, kao i na starom sajtu — prvi
          korak i glasi „Popunite upitnik". Sitan red „Besplatno. Bez
          obaveze." ispod dugmeta sa žive verzije je IZOSTAVLJEN: klijent ga
          je 30.08. već izbacio iz heroja iz istog razloga zbog kog sada
          sklanja i besplatnu konsultaciju.

          Nit su dve SVG krivulje, vodoravna za desktop i uspravna za telefon;
          CSS pokazuje jednu od dve. `preserveAspectRatio="none"` ih rasteže
          na širinu kontejnera, a `vector-effect` drži liniju na 2px i kada
          se rastegne. Koraci su `<ol>`, jer jesu redosled. */}
      <section className="card c-sand tri-koraka" id="tri-koraka">
        <div className="wrap stack g32">
          <div className="stack g12">
            <span className="eyebrow">Kako funkcioniše</span>
            <h2>Tri koraka do doma koji vas podržava</h2>
            <p className="lead">
              Jednostavan, jasan proces - bez komplikacija, bez nagađanja.
            </p>
          </div>

          <div className="nit">
            <svg
              className="nit-linija nit-linija-siroka"
              viewBox="0 0 996 320"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path d="M -40 236 C 140 236 140 84 319 84 S 498 236 677 236 S 856 84 1040 84" />
              <circle cx="319" cy="84" r="5" />
              <circle cx="677" cy="236" r="5" />
            </svg>
            <svg
              className="nit-linija nit-linija-uska"
              viewBox="0 0 347 876"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path d="M 60 -20 C 60 140 287 140 287 308 S 60 476 60 616 S 287 784 287 900" />
              <circle cx="287" cy="308" r="5" />
              <circle cx="60" cy="616" r="5" />
            </svg>

            {/* `role="list"` uz `list-style: none`: WebKit (Safari, VoiceOver)
                listu bez vidljivih markera izlaže kao običnu grupu, pa bez
                ovoga ne kaže „lista, 3 stavke". Chrome i NVDA je zadrže. */}
            <ol className="nit-krugovi" role="list">
              <li className="nit-krug">
                <svg className="nit-oznaka" viewBox="0 0 16 16" aria-hidden="true">
                  <rect x="1.5" y="1.5" width="13" height="13" />
                </svg>
                <span className="eyebrow">Korak 01</span>
                <h3>Popunite upitnik</h3>
                <p>
                  Ispričajte nam o svom domu, ciljevima i izazovima. Saradnja
                  počinje sa razumevanjem.
                </p>
              </li>
              <li className="nit-krug">
                <svg className="nit-oznaka" viewBox="0 0 16 16" aria-hidden="true">
                  <circle cx="8" cy="8" r="6.3" />
                </svg>
                <span className="eyebrow">Korak 02</span>
                <h3>Dobijate personalizovanu analizu</h3>
                <p>
                  Dragana čita energetsku matricu vašeg prostora i kreira
                  poseban plan za vas - sa konkretnim koracima za
                  transformaciju.
                </p>
              </li>
              <li className="nit-krug">
                <svg className="nit-oznaka" viewBox="0 0 16 16" aria-hidden="true">
                  <polygon points="8,3.29 13.44,12.71 2.56,12.71" />
                </svg>
                <span className="eyebrow">Korak 03</span>
                <h3>Osetite promenu</h3>
                <p>
                  Primenjujete preporuke, prostor se menja. Uz 3 meseca podrške,
                  jasnoća i opuštenost postaju nova svakodnevica.
                </p>
              </li>
            </ol>
          </div>

          <Link href="/upitnik" className="btn btn-accent">
            Započnite proces
          </Link>
        </div>
      </section>

      {/* KONTAKT */}
      <section className="card c-accent" id="kontakt">
        <div className="wrap stack g24">
          <h2>
            Saznajte kako Feng Shui može da Vam pomogne kroz razgovor sa mnom.
          </h2>
          <button className="btn btn-white" onClick={open('konsultacije')}>
            Zakažite besplatnu konsultaciju
          </button>
        </div>
      </section>

      {/* Lepljiva traka (mobilno) */}
      <div className="sticky">
        <div className="meta">
          <b>Feng Shui</b>
          <span>put ka ravnoteži</span>
        </div>
        <button className="btn btn-accent" onClick={open('konsultacije')}>
          Zakažite poziv
        </button>
      </div>

      <PrijavaModal
        open={modal !== null}
        onClose={() => setModal(null)}
        title={modal ? modalCopy[modal].title : undefined}
        subtitle={modal ? modalCopy[modal].subtitle : undefined}
        serviceType={modal ? modalCopy[modal].serviceType : 'Feng Shui (opšti upit)'}
        heardFrom="Početna"
        intent={modal ? modalCopy[modal].intent : 'konsultacije'}
        redirectTo={modal ? modalCopy[modal].redirectTo : undefined}
      />
    </div>
  );
};

export default PocetnaContent;
