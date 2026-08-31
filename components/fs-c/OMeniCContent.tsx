'use client';

import React, { useState } from 'react';
import FsCModal from './FsCModal';
import { useFsCEnrollTrigger } from './enrollTrigger';
import './fs-c.css';

/**
 * O meni — verzija C, „naizmenične trake".
 *
 * Strana je 31.08. napisana ispočetka na klijentov zahtev: sve što je bilo
 * (blok „Šta izdvaja moj pristup", „Obuka i put", brojke 25 godina i 1000+
 * projekata, pomen fakulteta i Mastery Academy) je izbačeno, a tekst je nov
 * i prenet doslovno. Zadržani su nadnaslov i zeleni CTA blok na dnu.
 *
 * Zbog toga strana više NIGDE ne pominje obrazovanje ni godine iskustva.
 *
 * Raspored: naslov i prvi pasus na kremu, pa fotografija preko cele širine,
 * pa drugi pasus na bež i treći na kremu — isti ritam naizmeničnih traka
 * koji već ide kroz Školu i Početnu.
 */

/* Forme uz nadnaslove su iz brend simbola. Geometrija je IZMERENA iz
   `public/logo/simbol-20.png`, ne crtana od oka: krug je upisan u kvadrat
   (odnos 1,0000), a trougao je jednakostraničan i upisan u krug, temenom
   nagore. Trougao je pomeren naniže da mu okvir optički stoji u sredini. */
const Oznaka = ({ oblik }: { oblik: 'krug' | 'trougao' }) => (
  <svg
    width={14}
    height={14}
    viewBox="0 0 14 14"
    fill="none"
    stroke="currentColor"
    strokeWidth={1}
    className="omeni-oznaka"
    aria-hidden="true"
  >
    {oblik === 'krug' && <circle cx="7" cy="7" r="5.5" />}
    {oblik === 'trougao' && <polygon points="7,2.88 11.76,11.12 2.24,11.12" />}
  </svg>
);

const OMeniCContent = () => {
  // Dva povoda za isti modal: dugmad na strani zovu na razgovor, a
  // „Sačuvaj svoje mesto" iz navigacije na upis u školu. Natpis obećava
  // različite stvari, pa i modal mora da govori različito.
  const [modal, setModal] = useState<'razgovor' | 'prijava' | null>(null);
  const modalCopy =
    modal === 'prijava'
      ? {
          title: 'Prijava za feng shui školu',
          subtitle: 'Popunite podatke i odmah dobijate instrukcije za uplatu.',
          serviceType: 'Feng Shui škola',
          intent: 'prijava' as const,
          // Upis u školu vodi na podatke za uplatu, razgovor na zahvalnicu.
          redirectTo: '/uplata-c',
        }
      : {
          title: 'Zakažite besplatan razgovor',
          subtitle: 'Ostavite podatke i Dragana će vam se javiti. Bez obaveze.',
          serviceType: 'Feng Shui razgovor (O meni)',
          intent: 'konsultacije' as const,
          redirectTo: '/hvala-c',
        };

  useFsCEnrollTrigger(() => setModal('prijava'));

  return (
    <div className="fs-c">
      {/* TRAKA 1 — naslov i prvi pasus, na kremu */}
      <section className="card c-cream omeni-vrh">
        <div className="wrap stack g32">
          {/* Brend znak kao vodeni žig, da desna strana pored naslova ne
              ostane prazna. Ukras, ne sadržaj — otud `aria-hidden` i prazan
              element umesto slike sa opisom. Jačina je ista kao vodeni žig
              upečen u hero Početne: tamo znak obara podlogu za 11,4%
              (izmereno, 255 -> 226), pa je ovde `opacity: .114`. */}
          <span className="omeni-znak" aria-hidden="true" />
          <div className="stack g12">
            <span className="eyebrow">O Dragani</span>
            <h1 className="omeni-naslov">
              Vaš vodič na putu ka prostoru koji vas podržava
            </h1>
          </div>
          <p className="lead omeni-pasus">
            Razlog moje zaljubljenosti u feng shui leži u tome što sam kroz ovu
            metodu dobila potvrdu da je istina ono što sam celog života osećala.
            A to je da je sve povezano, i na makro i na mikro planu. Sve što nam
            se dešava ima smisla i nije puka slučajnost. Naše je samo da
            otkrijemo način kako da bolje prepoznajemo poruke koje nam stižu
            nekad kroz drage ljude a nekada kroz bolesti i neprijatne događaje.
            Feng Shui mi je pomogao da shvatim povezanost između uzroka i
            posledice na najjednostavniji način, kroz svoj dom.
          </p>
        </div>
      </section>

      {/* FOTOGRAFIJA preko cele širine, deli pripovest na pola.
          `<picture>` sa art-direkcijom, ne next/image: na telefonu je traka
          znatno uspravnija (odnos 1,3 naspram 2,571), pa se seče poseban
          kadar da Dragana ne ostane sićušna u širokom. Oba su isečena u
          TAČNOM odnosu svog okvira, pa `cover` nema šta dodatno da doseca —
          u prvoj verziji je odsecao vrh glave. */}
      <div className="omeni-traka">
        <picture>
          <source
            media="(max-width: 767px)"
            type="image/avif"
            srcSet="/images/o-meni-c-traka-mobile.avif"
          />
          <source
            media="(max-width: 767px)"
            srcSet="/images/o-meni-c-traka-mobile.jpg"
          />
          <source type="image/avif" srcSet="/images/o-meni-c-traka.avif" />
          <img
            src="/images/o-meni-c-traka.jpg"
            alt="Dragana Jović u svom radnom prostoru"
          />
        </picture>
      </div>

      {/* TRAKA 2 — drugi pasus, na bež */}
      <section className="card c-sand">
        <div className="wrap stack g24">
          <span className="eyebrow omeni-nad">
            <Oznaka oblik="trougao" />
            Promena je počela od mog doma
          </span>
          <p className="lead omeni-pasus omeni-pasus-bez">
            Menjajući svoje mikro okruženje, nastajale su promene u meni koje su
            me vodile do samospoznaje i pravih mogućnosti za korišćenje svega
            što sam dobila po rođenju. Kroz Feng Shui sam uspela da svoj život
            zavolim na potpuno drugačiji način, da mu dam dublji smisao i
            probudim radost koja je bila zatrpana gomilom dnevnih obaveza i
            bespotrebnih briga.
          </p>
        </div>
      </section>

      {/* TRAKA 3 — treći pasus, nazad na krem */}
      <section className="card c-cream">
        <div className="wrap stack g24">
          <span className="eyebrow omeni-nad">
            <Oznaka oblik="krug" />
            Stotine porodica
          </span>
          <p className="lead omeni-pasus">
            Moja želja da pomažem ljudima je dobila jasnu formu, kroz Feng Shui
            uspela sam da dođem do stotine porodica čiji je život doživeo
            boljitak u svim segmentima. Moji klijenti i ja zajedno otkrivamo
            njihove skrivene talente, nalazimo puteve do isceljenja tela i duše.
            Imati hrabrost i krenuti u nepoznata znanja i promene nije uvek
            lako, ali uvek donosi dobrobit za one koji imaju hrabrosti da krenu
            napred, bez obzira na sve, i na iskustva, i na težinu sadašnjeg
            trenutka, i na godine sa verom da smo rođeni sa razlogom i da je
            život divna igra koju može da prođe u radosti i sreći ako smo
            dovoljno otvoreni za to.
          </p>
        </div>
      </section>

      {/* CTA — zadržan sa prethodne verzije strane */}
      <section className="card c-accent" id="kontakt">
        <div className="wrap stack g24">
          <h2>Vaš sledeći korak počinje sa namerom</h2>
          <p className="lead">
            Bilo da ste spremni da promenite energiju u svom domu ili da
            produbite znanje kroz školu, tu sam.
          </p>
          <button className="btn btn-white" onClick={() => setModal('razgovor')}>
            Zakažite besplatan razgovor
          </button>
        </div>
      </section>

      {/* Lepljiva traka (mobilno) */}
      <div className="sticky">
        <div className="meta">
          <b>Dragana Jović</b>
          <span>Feng Shui konsultant</span>
        </div>
        <button className="btn btn-accent" onClick={() => setModal('razgovor')}>
          Zakažite poziv
        </button>
      </div>

      <FsCModal
        open={modal !== null}
        onClose={() => setModal(null)}
        title={modalCopy.title}
        subtitle={modalCopy.subtitle}
        serviceType={modalCopy.serviceType}
        heardFrom="O meni (verzija C)"
        intent={modalCopy.intent}
        redirectTo={modalCopy.redirectTo}
      />
    </div>
  );
};

export default OMeniCContent;
