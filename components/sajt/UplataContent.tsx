'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { UPLATA, svrhaUplate, ibanZaPrikaz } from '@/lib/uplata';
import './fs-c.css';

/**
 * Stranica sa podacima za uplatu školarine — `/uplata`.
 *
 * Otvara se posle uspešne prijave za školu, ali NIJE zaključana: Marko
 * je 31.08. izabrao da ostane javna i samo neindeksirana, da bi link bio
 * stalan i da bi konverzija mogla lako da se veže na analitiku. Zbog toga
 * stranica ne sme ni u čemu da zavisi od toga šta je korisnik pre nje
 * uradio — sve što joj treba stoji u `lib/uplata.ts`.
 *
 * Isti podaci idu i mejlom (`skolaPrijava` u `lib/email/templates.ts`).
 * Oba čitaju iz istog modula, pa ne mogu da se raziđu.
 */

/* Forme su iz brend simbola, geometrija izmerena iz `public/logo/simbol-20.png`. */
const Oznaka = () => (
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
    <circle cx="7" cy="7" r="5.5" />
  </svg>
);

const IkonaKopiraj = () => (
  <svg width={15} height={15} viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <rect x="5.4" y="5.4" width="8.1" height="8.1" rx="1.6" stroke="currentColor" strokeWidth="1.4" />
    <path
      d="M10.6 5.4V4a1.6 1.6 0 0 0-1.6-1.6H4A1.6 1.6 0 0 0 2.4 4v5a1.6 1.6 0 0 0 1.6 1.6h1.4"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
    />
  </svg>
);

const IkonaKvacica = () => (
  <svg width={15} height={15} viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path
      d="M3.2 8.5l3.1 3.1 6.5-6.9"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

interface RedProps {
  naziv: string;
  vrednost: string;
  /**
   * Tekst koji ide u ostavu. Razlikuje se od prikazanog kod iznosa:
   * e-bankarstvo ne prima „33.550 RSD", prima „33550".
   */
  kopija?: string;
  /**
   * Pristupačno ime dugmeta „kopiraj", kada naziv polja nije dovoljan.
   * Dva reda se zovu „Iznos" — jedan u dinarima, jedan u evrima — pa bi
   * čitač ekrana oba pročitao kao „Kopiraj: Iznos".
   */
  opisKopije?: string;
  istaknuto?: boolean;
}

const Red = ({ naziv, vrednost, kopija, opisKopije, istaknuto }: RedProps) => {
  const [kopirano, setKopirano] = useState(false);

  const kopiraj = async () => {
    if (!kopija) return;
    try {
      await navigator.clipboard.writeText(kopija);
      setKopirano(true);
      window.setTimeout(() => setKopirano(false), 1800);
    } catch {
      // Ostava ne radi bez HTTPS-a i bez dozvole. Nije greška vredna
      // poruke — vrednost je ispisana i može se označiti prstom.
    }
  };

  return (
    <div className={`uplata-red${istaknuto ? ' uplata-red-istaknut' : ''}`}>
      <span className="uplata-naziv">{naziv}</span>
      <span className="uplata-desno">
        <span className="uplata-vrednost">{vrednost}</span>
        {kopija && (
          <button
            type="button"
            className="uplata-kopiraj"
            onClick={kopiraj}
            aria-label={`Kopiraj: ${opisKopije || naziv}`}
          >
            {kopirano ? <IkonaKvacica /> : <IkonaKopiraj />}
            <span aria-hidden="true">{kopirano ? 'Kopirano' : 'Kopiraj'}</span>
          </button>
        )}
        {/* Promena natpisa se čitaču ekrana ne javlja sama: natpis je
            `aria-hidden`, a izmenjen `aria-label` se ne čita pouzdano.
            Zato zasebno polje koje se najavljuje kada se napuni. */}
        {kopija && (
          <span role="status" className="samo-citac">
            {kopirano ? `Kopirano: ${opisKopije || naziv}` : ''}
          </span>
        )}
      </span>
    </div>
  );
};

const UplataContent = () => {
  const primalac = `${UPLATA.primalac}, ${UPLATA.mesto}`;

  return (
    <div className="fs-c">
      {/* VRH — potvrda da je mesto rezervisano */}
      <section className="card c-cream uplata-vrh">
        <div className="wrap stack g24">
          <span className="eyebrow omeni-nad">
            <Oznaka />
            Prijava primljena
          </span>
          <h1>Hvala na rezervaciji</h1>
          <p className="lead omeni-pasus">
            Vaše mesto u grupi je rezervisano. Prijava se potvrđuje uplatom u
            roku od {UPLATA.rokSati} sati.
          </p>
          <p className="micro uplata-napomena">
            Iste podatke poslali smo vam i na email adresu. Ako poruka ne stigne
            za nekoliko minuta, pogledajte i neželjenu poštu.
          </p>
        </div>
      </section>

      {/* PODACI ZA UPLATU */}
      <section className="card c-sand">
        <div className="wrap stack g32">
          <div className="stack g12">
            <span className="eyebrow">Podaci za uplatu</span>
            <p className="lead omeni-pasus">
              Uplatu možete izvršiti preko elektronskog bankarstva, u banci ili
              u pošti.
            </p>
          </div>

          <div className="uplata-tabla">
            <Red naziv="Primalac" vrednost={primalac} />
            <Red naziv="Broj računa" vrednost={UPLATA.racun} kopija={UPLATA.racun} />
            <Red
              naziv="Svrha uplate"
              vrednost={svrhaUplate()}
              kopija={svrhaUplate()}
            />
            <Red
              naziv="Iznos"
              vrednost={UPLATA.iznosRsd}
              kopija={UPLATA.iznosRsdSirov}
              opisKopije="Iznos u dinarima"
              istaknuto
            />
          </div>

          <div className="uplata-tabla uplata-tabla-strano">
            <p className="uplata-podnaslov">Za plaćanje iz inostranstva</p>
            <Red naziv="Primalac" vrednost={primalac} />
            {/* Prikaz je u grupama po četiri, u ostavu ide neprekinut. */}
            <Red naziv="IBAN" vrednost={ibanZaPrikaz()} kopija={UPLATA.iban} />
            <Red naziv="SWIFT" vrednost={UPLATA.swift} kopija={UPLATA.swift} />
            {UPLATA.bankaNaziv && <Red naziv="Banka" vrednost={UPLATA.bankaNaziv} />}
            {UPLATA.bankaAdresa && (
              <Red naziv="Adresa banke" vrednost={UPLATA.bankaAdresa} />
            )}
            <Red
              naziv="Iznos"
              vrednost={UPLATA.iznosEur}
              kopija={UPLATA.iznosEurSirov}
              opisKopije="Iznos u evrima"
              istaknuto
            />
          </div>

          <p className="micro uplata-napomena">
            Uz uplatu obavezno upišite svoje ime i prezime u polje „svrha
            uplate&rdquo;, da bismo je povezali sa vašom prijavom.
          </p>
        </div>
      </section>

      {/* ROK I POVRATAK */}
      <section className="card c-accent">
        <div className="wrap stack g24">
          <h2>
            Uplatom u roku od {UPLATA.rokSati} sati potvrđujete svoju prijavu
          </h2>
          <p className="lead">
            Potvrdu vam Dragana šalje istog dana kada uplata stigne, zajedno sa
            pristupnim podacima za platformu.
          </p>
          <div className="uplata-dno">
            <Link href="/school" className="btn btn-white">
              Vrati se na školu
            </Link>
            <a className="micro uplata-telefon" href={`tel:${UPLATA.telefonZaLink}`}>
              Pitanje oko uplate? {UPLATA.telefon}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default UplataContent;
