'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import FsCModal from './FsCModal';
import { useFsCEnrollTrigger } from './enrollTrigger';
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
    redirectTo: '/hvala-c',
  },
  nekretnina: {
    title: 'Asistencija pri izboru nekretnine',
    subtitle: 'Ostavite podatke i javljamo se sa detaljima procene prostora.',
    serviceType: 'Asistencija pri izboru nekretnine',
    intent: 'konsultacije',
    redirectTo: '/hvala-c',
  },
  radionice: {
    title: 'Radionice',
    subtitle: 'Ostavite podatke i obavestićemo vas čim otvorimo nove termine.',
    serviceType: 'Radionice',
    intent: 'konsultacije',
    redirectTo: '/hvala-c',
  },
  /* Otvara ga „Sačuvaj svoje mesto" iz navigacije. Natpis obećava upis u
     školu, pa i modal mora da govori o školi, a ne o konsultacijama. */
  prijava: {
    title: 'Prijava za feng shui školu',
    subtitle: 'Popunite podatke i odmah dobijate instrukcije za uplatu.',
    serviceType: 'Feng Shui škola',
    intent: 'prijava',
    redirectTo: '/uplata-c',
  },
};

/**
 * Početna — verzija C ("Mobilna kartica"), ugrađena u Next.js app.
 * Sadržaj i dizajn-jezik su porat iz prototipa design/pocetna/verzija-c.html.
 * Nav i footer daje (site) layout (Header/Footer). Kontakt = deljeni modal.
 * Uslovni video ("Zašto Feng Shui") i iskakanje ebooka su izostavljeni dok
 * ne stigne materijal/odluka klijenta (vidi tabla → Backlog).
 */
const PocetnaCContent = () => {
  const [modal, setModal] = useState<ModalIntent | null>(null);
  const open = (intent: ModalIntent) => () => setModal(intent);

  useFsCEnrollTrigger(() => setModal('prijava'));

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
            <h1>Feng Shui - da vam se život konačno pokrene.</h1>
            {/* Boju vodi `.hero-pocetna .lead` iz CSS-a; hero je sada beo,
                pa bež iz vremena zelene podloge više ne važi. */}
            <p className="lead">
              Oko 1000 osoba je osetilo promenu u odnosima, napretku i
              svakodnevnom miru uz pomoć naše Feng Shui konsultacije. Vaš dom je
              sledeći.
            </p>
            {/* Upis vodi pravo u modal, isto kao „Sačuvaj svoje mesto" u
                navigaciji: prijava se otvara na licu mesta. Zbog toga je
                puno belo dugme, a konsultacija ostaje kontura. */}
            <div className="stack g8 hero-cta">
              <button className="btn btn-zlatno" onClick={open('prijava')}>
                Upis u Feng Shui školu
              </button>
              <button className="btn btn-braon-linija" onClick={open('konsultacije')}>
                Zakažite besplatnu konsultaciju
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
                  <Link className="pill" href="/skola-c">
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
                  <button className="pill" onClick={open('konsultacije')}>
                    Saznajte više
                  </button>
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

      <FsCModal
        open={modal !== null}
        onClose={() => setModal(null)}
        title={modal ? modalCopy[modal].title : undefined}
        subtitle={modal ? modalCopy[modal].subtitle : undefined}
        serviceType={modal ? modalCopy[modal].serviceType : 'Feng Shui (opšti upit)'}
        heardFrom="Početna (verzija C)"
        intent={modal ? modalCopy[modal].intent : 'konsultacije'}
        redirectTo={modal ? modalCopy[modal].redirectTo : undefined}
      />
    </div>
  );
};

export default PocetnaCContent;
