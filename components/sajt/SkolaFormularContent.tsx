'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  SEKCIJE,
  OZNAKE,
  OBLASTI,
  OCENE,
  prazanFormular,
  greskeFormulara,
  type SkolaFormular,
} from '@/lib/skolaFormular';
import './fs-c.css';

/**
 * Prijavni formular Feng Shui online škole, `/skola/<kljuc>`.
 *
 * Ista četiri koraka i isto ruho kao kontakt upitnik (`KontaktContent`),
 * jer je to jedini obrazac na sajtu koji je klijent već video. Koraci su
 * sekcije iz klijentovog dokumenta; tekst pitanja je u `lib/skolaFormular.ts`.
 *
 * Razlike od upitnika:
 *  - Nacrt se čuva u `sessionStorage` dok se formular ne pošalje. Odgovori
 *    su dugi, a telefon ume da osveži karticu kad se polaznica vrati iz
 *    druge aplikacije. `sessionStorage` a ne `localStorage`: lični podaci
 *    ne ostaju na uređaju kad se kartica zatvori.
 *  - Posle slanja nema prelaza na `/hvala` (ona govori o upisu u školu);
 *    zahvalnica stoji na mestu obrasca.
 */

const NACRT = 'skola_formular_nacrt';

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
    <rect x="1.5" y="1.5" width="11" height="11" />
  </svg>
);

const Strelica = ({ nazad = false }: { nazad?: boolean }) => (
  <svg
    width={16}
    height={16}
    viewBox="0 0 16 16"
    fill="none"
    aria-hidden="true"
    style={nazad ? { transform: 'scaleX(-1)' } : undefined}
  >
    <path
      d="M3 8h10M9 4l4 4-4 4"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

type Tekstualno = Exclude<keyof SkolaFormular, 'zadovoljstvo' | 'pohadjao'>;

const SkolaFormularContent = ({ kljuc }: { kljuc: string }) => {
  const [korak, setKorak] = useState<1 | 2 | 3 | 4>(1);
  const [obrazac, setObrazac] = useState<SkolaFormular>(prazanFormular);
  const [greske, setGreske] = useState<Record<string, string>>({});
  const [salje, setSalje] = useState(false);
  const [greskaSlanja, setGreskaSlanja] = useState('');
  const [poslato, setPoslato] = useState(false);
  const [ucitano, setUcitano] = useState(false);

  const vrhObrasca = useRef<HTMLDivElement>(null);
  const naslovKoraka = useRef<HTMLHeadingElement>(null);

  // Nacrt se čita posle prvog crtanja, da server i pretraživač nacrtaju isto.
  // Zato je `setState` u efektu ovde namerno: čitanje u `useState` bi dalo
  // drugačiji HTML od serverskog čim nacrt postoji.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    try {
      const sacuvano = sessionStorage.getItem(NACRT);
      if (sacuvano) {
        const n = JSON.parse(sacuvano) as { obrazac?: Partial<SkolaFormular>; korak?: number };
        if (n.obrazac) setObrazac((p) => ({ ...p, ...n.obrazac }));
        if (n.korak && n.korak >= 1 && n.korak <= 4) setKorak(n.korak as 1 | 2 | 3 | 4);
      }
    } catch {
      /* bez nacrta */
    }
    setUcitano(true);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  useEffect(() => {
    if (!ucitano || poslato) return;
    try {
      sessionStorage.setItem(NACRT, JSON.stringify({ obrazac, korak }));
    } catch {
      /* bez nacrta */
    }
  }, [obrazac, korak, ucitano, poslato]);

  const naVrh = () => {
    const el = vrhObrasca.current;
    if (el) {
      // Plutajući navbar je visok 76px; 24px je vazduh ispod njega.
      const y = el.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
    window.setTimeout(() => naslovKoraka.current?.focus(), 60);
  };

  const skloniGresku = (ime: string) => {
    if (greske[ime]) {
      setGreske((prev) => {
        const novo = { ...prev };
        delete novo[ime];
        return novo;
      });
    }
  };

  const promena = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const ime = e.target.name as Tekstualno;
    const vrednost = e.target.value;
    setObrazac((prev) => ({ ...prev, [ime]: vrednost }));
    skloniGresku(ime);
  };

  const oceni = (i: number, slovo: string) => {
    const zadovoljstvo = [...obrazac.zadovoljstvo];
    zadovoljstvo[i] = slovo;
    setObrazac((prev) => ({ ...prev, zadovoljstvo }));
    // Greška se skida tek kad su ocenjene SVE oblasti.
    if (zadovoljstvo.every(Boolean)) skloniGresku('zadovoljstvo');
  };

  const proveriKorak = () => {
    const g = greskeFormulara(obrazac, korak);
    setGreske(g);
    return Object.keys(g).length === 0;
  };

  const napred = () => {
    if (!proveriKorak()) return;
    if (korak < 4) {
      setKorak((korak + 1) as 2 | 3 | 4);
      naVrh();
    }
  };

  const nazad = () => {
    if (korak > 1) {
      setKorak((korak - 1) as 1 | 2 | 3);
      naVrh();
    }
  };

  const posalji = async (e: React.FormEvent) => {
    e.preventDefault();
    setGreskaSlanja('');
    if (!proveriKorak()) return;

    // Poslednja provera celog formulara: nacrt vraćen iz sesije može da
    // preskoči proveru ranijeg koraka.
    const sve = greskeFormulara(obrazac);
    if (Object.keys(sve).length) {
      const prviKorak = (['imePrezime', 'datumRodjenja', 'mesto', 'email', 'telefon'].some((k) => sve[k])
        ? 1
        : ['zasto', 'pohadjao', 'zaintrigiralo', 'vreme'].some((k) => sve[k])
          ? 2
          : sve.zadovoljstvo
            ? 3
            : 4) as 1 | 2 | 3 | 4;
      setGreske(sve);
      setKorak(prviKorak);
      naVrh();
      return;
    }

    setSalje(true);

    let odgovor: Response;
    try {
      odgovor = await fetch('/api/skola-formular', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kljuc, odgovori: obrazac }),
      });
    } catch {
      setSalje(false);
      setGreskaSlanja('Nema veze sa internetom. Vaši odgovori su i dalje ovde, pokušajte ponovo.');
      return;
    }

    if (!odgovor.ok) {
      setSalje(false);
      const podaci = await odgovor.json().catch(() => null);
      setGreskaSlanja(podaci?.error || 'Došlo je do greške. Pokušajte ponovo.');
      return;
    }

    try {
      sessionStorage.removeItem(NACRT);
    } catch {
      /* bez nacrta */
    }
    setPoslato(true);
    naVrh();
  };

  const poljeKlase = (ime: string) => `upit-unos${greske[ime] ? ' upit-unos-greska' : ''}`;

  /** Tekstualno polje sa oznakom i greškom; `obavezno` crta zvezdicu. */
  const polje = (
    ime: Tekstualno,
    oznaka: string,
    {
      tip = 'text',
      obavezno = true,
      viseRedova = false,
      autoComplete,
    }: { tip?: string; obavezno?: boolean; viseRedova?: boolean; autoComplete?: string } = {},
  ) => {
    const id = `f-${ime}`;
    const zajednicko = {
      id,
      name: ime,
      value: obrazac[ime],
      onChange: promena,
      className: poljeKlase(ime),
      'aria-invalid': !!greske[ime],
      'aria-describedby': greske[ime] ? `g-${ime}` : undefined,
      autoComplete,
    };
    return (
      <div className="upit-polje">
        <label className="upit-oznaka" htmlFor={id}>
          {oznaka} {obavezno && <span className="upit-obavezno">*</span>}
        </label>
        {viseRedova ? (
          <textarea rows={4} {...zajednicko} />
        ) : (
          <input
            type={tip}
            {...zajednicko}
            // Današnji datum tek u pretraživaču, da se ne razlikuje od serverskog crtanja.
            max={tip === 'date' && ucitano ? new Date().toISOString().slice(0, 10) : undefined}
          />
        )}
        {greske[ime] && (
          <p className="upit-greska" id={`g-${ime}`}>
            {greske[ime]}
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="fs-c">
      {/* VRH */}
      <section className="card c-cream uplata-vrh">
        <div className="wrap stack g24">
          <span className="eyebrow omeni-nad">
            <Oznaka />
            Feng Shui online škola
          </span>
          <h1>Prijavni formular</h1>
        </div>
      </section>

      {/* OBRAZAC */}
      <section className="card c-sand">
        <div className="wrap stack g32">
          {poslato ? (
            <div ref={vrhObrasca} className="upit-tabla formular-hvala">
              <h2 className="upit-naslov" ref={naslovKoraka} tabIndex={-1}>
                Hvala!
              </h2>
              <p className="formular-hvala-tekst">
                Vaši odgovori su poslati Dragani. Kopiju smo vam poslali na e-mail.
              </p>
            </div>
          ) : (
            <>
              <div ref={vrhObrasca} className="upit-koraci" aria-hidden="true">
                {SEKCIJE.map((naziv, i) => (
                  <div
                    key={naziv}
                    className={`upit-korak${korak >= i + 1 ? ' upit-korak-dostignut' : ''}`}
                  >
                    <span className="upit-crta" />
                    <span className="upit-ime">{naziv}</span>
                  </div>
                ))}
              </div>

              <form className="upit-tabla" onSubmit={posalji} noValidate>
                <p className="upit-brojac" aria-live="polite">
                  Korak {korak} od 4
                </p>

                <h2 className="upit-naslov" ref={naslovKoraka} tabIndex={-1}>
                  {SEKCIJE[korak - 1]}
                </h2>

                {/* KORAK 1: LIČNI PODACI */}
                {korak === 1 && (
                  <div className="stack g24">
                    {polje('imePrezime', OZNAKE.imePrezime, { autoComplete: 'name' })}
                    {polje('datumRodjenja', OZNAKE.datumRodjenja, { tip: 'date', autoComplete: 'bday' })}
                    {polje('mesto', OZNAKE.mesto, { autoComplete: 'address-level2' })}
                    {polje('email', OZNAKE.email, { tip: 'email', autoComplete: 'email' })}
                    {polje('facebook', OZNAKE.facebook, { obavezno: false })}
                    {polje('telefon', OZNAKE.telefon, { tip: 'tel', autoComplete: 'tel' })}
                  </div>
                )}

                {/* KORAK 2: MOTIVACIJA I ISKUSTVO */}
                {korak === 2 && (
                  <div className="stack g24">
                    {polje('zasto', OZNAKE.zasto, { viseRedova: true })}

                    <fieldset className="upit-polje upit-skup">
                      <legend className="upit-oznaka">
                        {OZNAKE.pohadjao} <span className="upit-obavezno">*</span>
                      </legend>
                      <div className="upit-red-izbora formular-da-ne">
                        {(
                          [
                            ['da', 'Da'],
                            ['ne', 'Ne'],
                          ] as const
                        ).map(([vrednost, natpis]) => (
                          <label
                            key={vrednost}
                            htmlFor={`f-pohadjao-${vrednost}`}
                            className={`upit-pilula${
                              obrazac.pohadjao === vrednost ? ' upit-pilula-aktivna' : ''
                            }`}
                          >
                            <input
                              type="radio"
                              id={`f-pohadjao-${vrednost}`}
                              name="pohadjao"
                              value={vrednost}
                              checked={obrazac.pohadjao === vrednost}
                              onChange={() => {
                                setObrazac((p) => ({ ...p, pohadjao: vrednost }));
                                skloniGresku('pohadjao');
                              }}
                            />
                            <span>{natpis}</span>
                          </label>
                        ))}
                      </div>
                      {greske.pohadjao && <p className="upit-greska">{greske.pohadjao}</p>}
                    </fieldset>

                    {obrazac.pohadjao === 'da' &&
                      polje('kojiKurs', OZNAKE.kojiKurs, { obavezno: false })}

                    {polje('zaintrigiralo', OZNAKE.zaintrigiralo, { viseRedova: true })}
                    {polje('vreme', OZNAKE.vreme)}
                  </div>
                )}

                {/* KORAK 3: ZADOVOLJSTVO ŽIVOTNIM OBLASTIMA */}
                {korak === 3 && (
                  <div className="stack g24">
                    <div className="stack g12">
                      <p className="upit-oznaka" id="f-zadovoljstvo">
                        {OZNAKE.zadovoljstvo} <span className="upit-obavezno">*</span>
                      </p>
                      <ul className="formular-legenda">
                        {OCENE.map(([slovo, opis]) => (
                          <li key={slovo}>
                            <span className="formular-znak" aria-hidden="true">
                              {slovo}
                            </span>
                            <span>
                              <span className="samo-citac">{slovo}: </span>
                              {opis}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {greske.zadovoljstvo && (
                      <p className="upit-greska">{greske.zadovoljstvo}</p>
                    )}

                    <div className="formular-oblasti">
                      <div className="formular-zaglavlje" aria-hidden="true">
                        <span>Oblast života</span>
                        <span>Ocena (A–D)</span>
                      </div>
                      {OBLASTI.map((oblast, i) => {
                        const neocenjena = !!greske.zadovoljstvo && !obrazac.zadovoljstvo[i];
                        return (
                          <div
                            key={oblast}
                            role="radiogroup"
                            aria-labelledby={`f-oblast-${i}`}
                            aria-invalid={neocenjena || undefined}
                            className={`formular-oblast${neocenjena ? ' formular-oblast-greska' : ''}`}
                          >
                            <span className="formular-oblast-ime" id={`f-oblast-${i}`}>
                              {oblast}
                            </span>
                            <span className="formular-slova">
                              {OCENE.map(([slovo, opis]) => {
                                const izabrano = obrazac.zadovoljstvo[i] === slovo;
                                return (
                                  <label
                                    key={slovo}
                                    className={`formular-slovo${izabrano ? ' formular-slovo-aktivno' : ''}`}
                                  >
                                    <input
                                      type="radio"
                                      name={`oblast-${i}`}
                                      value={slovo}
                                      checked={izabrano}
                                      onChange={() => oceni(i, slovo)}
                                    />
                                    <span aria-hidden="true">{slovo}</span>
                                    <span className="samo-citac">
                                      {slovo}, {opis}
                                    </span>
                                  </label>
                                );
                              })}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* KORAK 4: PROCENA ZNANJA I OČEKIVANJA */}
                {korak === 4 && (
                  <div className="stack g24">
                    <fieldset className="upit-polje upit-skup">
                      <legend className="upit-oznaka">
                        {OZNAKE.znanje} <span className="upit-obavezno">*</span>
                      </legend>
                      <p className="formular-napomena">{OZNAKE.znanjeRaspon}</p>
                      <div className="formular-skala">
                        {Array.from({ length: 10 }, (_, i) => String(i + 1)).map((broj) => {
                          const izabrano = obrazac.znanje === broj;
                          return (
                            <label
                              key={broj}
                              className={`formular-slovo formular-broj${
                                izabrano ? ' formular-slovo-aktivno' : ''
                              }`}
                            >
                              <input
                                type="radio"
                                name="znanje"
                                value={broj}
                                checked={izabrano}
                                onChange={() => {
                                  setObrazac((p) => ({ ...p, znanje: broj }));
                                  skloniGresku('znanje');
                                }}
                              />
                              <span>{broj}</span>
                            </label>
                          );
                        })}
                      </div>
                      {greske.znanje && <p className="upit-greska">{greske.znanje}</p>}
                    </fieldset>

                    {polje('ocekivanja', OZNAKE.ocekivanja, { viseRedova: true })}
                  </div>
                )}

                {greskaSlanja && (
                  <p className="upit-greska upit-greska-slanja" role="alert">
                    {greskaSlanja}
                  </p>
                )}

                <div className="upit-dno">
                  {korak > 1 ? (
                    <button
                      type="button"
                      className="btn btn-braon-linija upit-dugme"
                      onClick={nazad}
                      disabled={salje}
                    >
                      <Strelica nazad />
                      Prethodni korak
                    </button>
                  ) : (
                    <span className="upit-praznina" />
                  )}

                  {korak < 4 ? (
                    <button type="button" className="btn btn-accent upit-dugme" onClick={napred}>
                      Sledeći korak
                      <Strelica />
                    </button>
                  ) : (
                    <button type="submit" className="btn btn-accent upit-dugme" disabled={salje}>
                      {salje ? 'Šaljem…' : 'Pošalji formular'}
                      {!salje && <Strelica />}
                    </button>
                  )}
                </div>
              </form>
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default SkolaFormularContent;
