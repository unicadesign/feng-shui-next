'use client';

import React, { useState } from 'react';
import FsCModal from './FsCModal';
import './fs-c.css';

/**
 * O meni — verzija C ("Mobilna kartica"), ugrađena u Next.js app.
 * Sadržaj i dizajn-jezik su porat iz prototipa design/o-meni/verzija-c.html.
 * Nav i footer daje (site) layout (Header/Footer). Kontakt = deljeni modal.
 * Blok "Šta izdvaja moj pristup" koristi ikone (bez foto placeholder-a) dok
 * ne stignu prave slike.
 */

const pristup = [
  {
    ico: '✧',
    h: 'Personalizacija',
    p: 'Nijedna dva čoveka, pa ni dva doma, nisu ista. Slušam vaš prostor i vašu priču da bih oblikovala rešenja koja odražavaju vašu energiju, ciljeve i ritam života.',
  },
  {
    ico: '☯',
    h: 'Harmonija',
    p: 'Povezujem drevnu kinesku mudrost sa modernom realnošću, spajajući metafizički uvid sa praktičnim dizajnom za bezvremeno, negujuće okruženje.',
  },
  {
    ico: '❁',
    h: 'Transformacija',
    p: 'Feng Shui nije u vezi sa nameštajem. Radi se o energiji. Koristim prostor kao alat za isceljenje, usklađivanje i lični razvoj, iznutra ka spolja.',
  },
  {
    ico: '◈',
    h: 'Ukorenjeno u pravoj tradiciji',
    p: 'Godine posvećenog učenja kod priznatih Feng Shui majstora znače da dobijate autentičnu mudrost, a ne razvodnjene internet koncepte.',
  },
  {
    ico: '◉',
    h: 'Praksa, ne teorija',
    p: 'Polaznice ne uče samo koncepte, već vide opipljive promene u svojim domovima. Metoda se oslanja na praktičnu primenu sa merljivim rezultatima.',
  },
  {
    ico: '⟡',
    h: 'Istočnjačka mudrost, naši domovi',
    p: 'Prevođenje drevnih principa u moderne domove našeg regiona, sa njegovim arhitektonskim i energetskim obrascima, a ne uopštenim savetima.',
  },
];

const OMeniCContent = () => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="fs-c">
      {/* HERO — tekst + portret */}
      <section className="card c-cream">
        <div className="wrap stack g24">
          <span className="eyebrow">O Dragani</span>
          <h1>Vaš vodič na putu ka prostoru koji vas podržava</h1>
          <p className="lead">
            Dragana Jović, 25 godina iskustva, preko 1000 projekata, i jedno
            uverenje: kada se prostor uskladi sa vama, sve u životu počinje da
            teče.
          </p>
          <div className="portrait">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/dragana-joivc.webp" alt="Dragana Jović" />
          </div>
        </div>
      </section>

      {/* BIOGRAFIJA + CITAT */}
      <section className="card c-sand">
        <div className="wrap stack g24">
          <p className="lead" style={{ maxWidth: 'none' }}>
            Moj put je počeo daleko od Feng Shui, na Tehničko-metalurškom
            fakultetu u Beogradu. Ali ta osnova u strukturi i nauci dala mi je
            nešto dragoceno: sposobnost da vidim prostor ne samo kao estetiku,
            već kao sistem koji utiče na sve oko sebe.
          </p>
          <p className="lead" style={{ maxWidth: 'none' }}>
            Intenzivne studije na Mastery Academy of Chinese Metaphysics otvorile
            su mi potpuno novu dimenziju. Shvatila sam da drevna mudrost nije
            suprotna nauci, već njena dopuna. To me je inspirisalo da kreiram
            sopstvenu metodologiju, prilagođenu energetskim potrebama našeg
            regiona i naših domova.
          </p>
          <p className="lead" style={{ maxWidth: 'none' }}>
            Danas, nakon 25 godina i više od 1000 projekata, moja praksa spaja
            tradicionalni Feng Shui sa radiestezijom, kristalnom terapijom,
            svetom geometrijom i holističkim dizajnom. Ali ono što me zaista
            pokreće nije tehnika, već trenutak kada klijentkinja kaže: „Konačno
            se osećam kao kod kuće u sopstvenom domu.&rdquo;
          </p>
          <h2
            style={{
              fontSize: 'clamp(1.4rem,5vw,2rem)',
              fontWeight: 600,
              lineHeight: 1.35,
            }}
          >
            „Vibracije prostora, misli i hrane duboko oblikuju kvalitet života.
            Njihova harmonizacija je temelj istinske radosti.&rdquo;
          </h2>
        </div>
      </section>

      {/* ŠTA IZDVAJA MOJ PRISTUP */}
      <section className="card c-cream">
        <div className="wrap stack g32">
          <div className="stack g12">
            <span className="eyebrow">Pristup</span>
            <h2>Šta izdvaja moj pristup</h2>
          </div>
          <div className="six">
            {pristup.map((it) => (
              <div className="it6" key={it.h}>
                <div className="ico" aria-hidden="true">
                  {it.ico}
                </div>
                <div>
                  <h3>{it.h}</h3>
                  <p>{it.p}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* KVALIFIKACIJE */}
      <section className="card c-navy">
        <div className="wrap stack g24">
          <span className="eyebrow">Kvalifikacije</span>
          <h2>Obuka i put</h2>
          <ul className="big-list">
            <li>
              Tehničko-metalurški fakultet, Beograd: temelj u nauci i strukturi
            </li>
            <li>
              Mastery Academy of Chinese Metaphysics: međunarodno priznata obuka
            </li>
            <li>Kreator autorske Feng Shui metode: prilagođene našem regionu</li>
            <li>TV i medijski nastupi: prepoznata stručnost</li>
            <li>Holistička Akademija Maya: kontinuirano usavršavanje</li>
          </ul>
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
      </section>

      {/* CTA */}
      <section className="card c-accent" id="kontakt">
        <div className="wrap stack g24">
          <h2>Vaš sledeći korak počinje sa namerom</h2>
          <p className="lead">
            Bilo da ste spremni da promenite energiju u svom domu ili da
            produbite znanje kroz školu, tu sam.
          </p>
          <div className="stack g8">
            <button className="btn btn-white" onClick={() => setModalOpen(true)}>
              Zakažite besplatan razgovor
            </button>
            <span className="micro">Otvara se ovde, bez napuštanja stranice.</span>
          </div>
        </div>
      </section>

      {/* Lepljiva traka (mobilno) */}
      <div className="sticky">
        <div className="meta">
          <b>Dragana Jović</b>
          <span>25 godina · 1000+ projekata</span>
        </div>
        <button className="btn btn-accent" onClick={() => setModalOpen(true)}>
          Zakažite poziv
        </button>
      </div>

      <FsCModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Zakažite besplatan razgovor"
        subtitle="Ostavite podatke i Dragana će vam se javiti. Bez obaveze."
        serviceType="Feng Shui razgovor (O meni)"
        heardFrom="O meni (verzija C)"
      />
    </div>
  );
};

export default OMeniCContent;
