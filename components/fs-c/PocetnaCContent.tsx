'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import FsCModal from './FsCModal';
import './fs-c.css';

type ModalIntent = 'konsultacije' | 'nekretnina' | 'radionice';

const modalCopy: Record<
  ModalIntent,
  { title: string; subtitle: string; serviceType: string }
> = {
  konsultacije: {
    title: 'Zakažite besplatnu konsultaciju',
    subtitle:
      'Ostavite podatke i dogovaramo razgovor o vašem prostoru, bez obaveze.',
    serviceType: 'Individualne konsultacije',
  },
  nekretnina: {
    title: 'Asistencija pri izboru nekretnine',
    subtitle: 'Ostavite podatke i javljamo se sa detaljima procene prostora.',
    serviceType: 'Asistencija pri izboru nekretnine',
  },
  radionice: {
    title: 'Radionice',
    subtitle: 'Ostavite podatke i obavestićemo vas čim otvorimo nove termine.',
    serviceType: 'Radionice',
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

  return (
    <div className="fs-c">
      {/* HERO */}
      <header className="hero">
        <div className="hero-in">
          <div className="hero-photo">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/hero.jpeg" alt="Dragana Jović, Feng Shui" />
          </div>
          <div className="hero-body stack g24">
            <span className="eyebrow" style={{ color: 'var(--gold-200)' }}>
              Uređenje prostora
            </span>
            <h1>Feng Shui: put ka miru i radosti</h1>
            <p className="lead" style={{ color: 'var(--navy-300)' }}>
              Oko 1000 osoba je osetilo promenu u odnosima, napretku i
              svakodnevnom miru uz pomoć naše Feng Shui konsultacije. Vaš dom je
              sledeći.
            </p>
            <div className="stack g8">
              <Link className="btn btn-accent" href="/skola-c">
                Saznajte više o školi
              </Link>
              <button
                className="btn btn-white"
                onClick={open('konsultacije')}
              >
                Zakažite besplatnu konsultaciju
              </button>
              <span className="micro">Besplatno. Bez obaveze.</span>
            </div>
          </div>
        </div>
      </header>

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
          <h2>Zakažite besplatnu konsultaciju</h2>
          <p className="lead">
            Trideset minuta, onlajn, bez obaveze, da vidimo šta vaš prostor
            traži.
          </p>
          <div className="stack g8">
            <button className="btn btn-white" onClick={open('konsultacije')}>
              Popuni formu
            </button>
            <span className="micro">Otvara se ovde, bez napuštanja stranice.</span>
          </div>
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
      />
    </div>
  );
};

export default PocetnaCContent;
