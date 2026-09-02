'use client';

import React, { useState } from 'react';
import FsCModal from './FsCModal';
import { useFsCEnrollTrigger } from './enrollTrigger';
import './fs-c.css';

/**
 * O meni — verzija C, „naizmenične trake".
 *
 * Tekst je 01.09. ponovo napisan ispočetka na klijentov zahtev: osam pasusa
 * umesto tri, prenetih doslovno. Time se VRAĆA ono što je 31.08. bilo
 * izbačeno — fakultet, Mastery Academy, 25 godina i 1000 porodica — i to
 * je klijentova svesna odluka („bio si u pravu, tekst mora da se menja").
 * Beleška iz prethodne verzije da strana nigde ne pominje obrazovanje ni
 * iskustvo više NE VAŽI.
 *
 * Nadnaslova nema: ni „O Dragani" ni ona dva uz trake. Sva tri su izbačena
 * na isti zahtev, a naslov je samo „Dragana Jović".
 *
 * Četiri odstupanja od doslovnog prenosa, sva namerna:
 *  - „korak po karak" -> „korak po korak", očigledna greška u kucanju
 *  - dupli razmak u „svom  najbližem" je skinut
 *  - padež je svuda „Feng Shui-ja" sa crticom: klijent ga tako piše na dva
 *    od tri mesta, treće („Feng Shuija") je izjednačeno
 *  - emođi na kraju šestog pasusa je izostavljen, po Markovoj odluci
 *
 * Raspored, Markov izbor 01.09.: naslov i prva dva pasusa na kremu,
 * fotografija preko cele širine, pa tri pasusa na bež i tri na kremu — isti
 * ritam naizmeničnih traka koji ide kroz Školu i Početnu.
 */
const OMeniCContent = () => {
  // Dva povoda za isti modal: dugmad na strani zovu na razgovor ili na
  // upis, a „Sačuvaj svoje mesto" iz navigacije na upis u školu. Natpis
  // obećava različite stvari, pa i modal mora da govori različito.
  const [modal, setModal] = useState<'razgovor' | 'prijava' | null>(null);
  const modalCopy =
    modal === 'prijava'
      ? {
          title: 'Prijava za Feng Shui školu',
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
      {/* TRAKA 1 — naslov i prva dva pasusa, na kremu */}
      <section className="card c-cream omeni-vrh">
        <div className="wrap stack g32">
          {/* Brend znak kao vodeni žig, da desna strana pored naslova ne
              ostane prazna. Ukras, ne sadržaj — otud `aria-hidden` i prazan
              element umesto slike sa opisom. Jačina je ista kao vodeni žig
              upečen u hero Početne: tamo znak obara podlogu za 11,4%
              (izmereno, 255 -> 226), pa je ovde `opacity: .114`. */}
          <span className="omeni-znak" aria-hidden="true" />
          <h1 className="omeni-naslov">Dragana Jović</h1>
          <div className="stack g24">
            <p className="lead omeni-pasus">
              Kada razmišljam o tome kada je krenulo moje izučavanje Feng
              Shui-ja, shvatam da je to bilo još za vreme studija. Učeći o
              prelasku energije iz jednog oblika u drugi, i o prenosu energije
              - već tada sam gradila temelje za ono čime se danas bavim.
            </p>
            <p className="lead omeni-pasus">
              Posle Tehnološko-metalurškog fakulteta i rada u prosveti, sasvim
              „slučajno&rdquo; otkrila sam svet Feng Shui-ja. Vrlo brzo sam
              upisala Mastery Academy of Chinese Metaphysics. Tu sam počela da
              spoznajem energije koje se osećaju i vide mnogo suptilnijim
              čulima: za koje do tada nisam ni znala da postoje.
            </p>
          </div>
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

      {/* TRAKA 2 — tri pasusa, na bež */}
      <section className="card c-sand">
        <div className="wrap stack g24">
          <p className="lead omeni-pasus omeni-pasus-bez">
            Zatim je došla radiestezija, kojom sam upotpunila Feng Shui analizu
            prostora. Uz pomoć viska, naučila sam da otkrijem uticaje poput
            elektro-magnetnih zračenja, podzemnih voda ili negativnih promena u
            tlu, uglavnom izazvanih ljudskim delovanjem.
          </p>
          <p className="lead omeni-pasus omeni-pasus-bez">
            Potom je u moj rad ušla i ornamentika specifična za Balkan, ona
            kroz koju se povezujemo sa svojim korenima i iskonskom snagom. Jer
            kroz tradiciju dobijamo stabilnost i utemeljenost u ono što jesmo.
          </p>
          <p className="lead omeni-pasus omeni-pasus-bez">
            Znanja o proporciji i sakralnoj geometriji dala su poslednji deo
            slagalice: kako prostor u kom čovek boravi može biti podsticaj za
            njegov život, u miru sa sobom i svime što ga okružuje.
          </p>
        </div>
      </section>

      {/* TRAKA 3 — tri pasusa, nazad na krem */}
      <section className="card c-cream">
        <div className="wrap stack g24">
          <p className="lead omeni-pasus">
            Feng Shui online školu sa holističkim i autorskim pristupom sam
            kreirala nakon 25 godina rada i primenjene edukacije sa sjajnim
            rezultatima u preko 1000 porodica.
          </p>
          <p className="lead omeni-pasus">
            Svaki put kada mi klijenti podele svoja poboljšanja u životu,
            pomislim: još ljudi treba da otkrije ova znanja, da ih primeni i
            time obogati sopstveni život.
          </p>
          <p className="lead omeni-pasus">
            Zato sam osmislila Feng Shui online školu u kojoj korak po korak
            saznajete kako da poboljšate svoj život korekcijama u svom
            najbližem okruženju, u svom domu. Kroz program dolazite do
            konkretnih usklađivanja vašeg prostora. A kada uvedete te promene,
            počinjete da živite ispunjen život u blagostanju.
          </p>
        </div>
      </section>

      {/* ZAVRŠNICA — jedna rečenica u veličini naslova, bez pasusa ispod,
          po klijentovom zahtevu 01.09. Rečenica imenuje dva puta,
          konsultacije i učenje, pa oba dobijaju dugme (Markov izbor). */}
      <section className="card c-accent" id="kontakt">
        <div className="wrap stack g24">
          <h2>
            Ako ste spremni za promenu, proverite energiju doma kroz
            konsultacije ili kroz učenje Feng Shui-ja, tu sam za vas.
          </h2>
          <div className="uplata-dno">
            <button className="btn btn-white" onClick={() => setModal('razgovor')}>
              Zakažite besplatan razgovor
            </button>
            <button className="btn btn-line" onClick={() => setModal('prijava')}>
              Upis u Feng Shui školu
            </button>
          </div>
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
