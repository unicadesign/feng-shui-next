import React from 'react';
import Link from 'next/link';
import { UPLATA } from '@/lib/uplata';
import './fs-c.css';

/**
 * Zahvalnica za sve upite koji NISU upis u školu — `/hvala`.
 *
 * Pokriva besplatnu konsultaciju sa Škole i O meni, i konsultacije,
 * nekretninu i radionice sa Početne. Zato je tekst namerno opšti: ne
 * pominje ni školu ni određenu uslugu, jer stiže sa pet različitih mesta.
 *
 * TEKST JE MOJ, nije klijentov — nije ga bilo, a stranica je izabrana
 * 31.08. umesto poruke unutar modala. Traži pregled.
 *
 * Kao i `/uplata`: javna, neindeksirana, stalan link zbog analitike,
 * bez zavisnosti od toga šta je korisnik pre nje uradio.
 */

/* Forma je iz brend simbola, geometrija izmerena iz `public/logo/simbol-20.png`. */
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
    <polygon points="7,2.88 11.76,11.12 2.24,11.12" />
  </svg>
);

const HvalaContent = () => (
  <div className="fs-c">
    <section className="card c-cream uplata-vrh">
      <div className="wrap stack g24">
        <span className="eyebrow omeni-nad">
          <Oznaka />
          Poruka je stigla
        </span>
        <h1>Hvala na prijavi</h1>
        <p className="lead omeni-pasus">
          Vaši podaci su stigli Dragani. Javiće vam se lično, u najkraćem roku,
          na email ili telefon koji ste ostavili.
        </p>
      </div>
    </section>

    <section className="card c-accent">
      <div className="wrap stack g24">
        <h2>Dok čekate</h2>
        <p className="lead">
          Ako razmišljate i o tome da Feng Shui naučite sami, program online
          škole i termini su na stranici škole.
        </p>
        <div className="uplata-dno">
          <Link href="/school" className="btn btn-white">
            Pogledajte školu
          </Link>
          <Link href="/" className="btn btn-line">
            Nazad na početnu
          </Link>
        </div>
        <a className="micro uplata-telefon" href={`tel:${UPLATA.telefonZaLink}`}>
          Hitno je? {UPLATA.telefon}
        </a>
      </div>
    </section>
  </div>
);

export default HvalaContent;
