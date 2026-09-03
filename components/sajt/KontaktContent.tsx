'use client';

import React, { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  USLUGE,
  TIPOVI_PROSTORA,
  CILJEVI,
  IZVORI,
  VREMENA,
} from '@/lib/upitnikOpcije';
import './fs-c.css';

/**
 * Kontakt upitnik, `/upitnik`.
 *
 * Naslednik starog upitnika na istoj adresi (stari je obrisan pri prelasku
 * na novi dizajn, 09.2026.). Ista četiri koraka, ista polja, iste šifre
 * koje idu u bazu; promenjen je samo dizajn, po odluci od 31.08.
 *
 * Tri stvari rade drugačije nego stari upitnik, sve tri namerno:
 *
 *  1. UPIS IDE PREKO SERVERA (`/api/prijava`, namera `upit`), ne direktno
 *     iz pretraživača. Samo tako uz upis može da ode i mejl: potvrda
 *     pošiljaocu i obaveštenje Dragani. Stari upitnik nije slao ništa.
 *  2. POSLE SLANJA vodi na `/hvala`, istu zahvalnicu na koju vode i
 *     modali, da bi se konverzija merila na jednom linku.
 *  3. SAGLASNOST se proverava u JavaScript-u, jer obrazac ima `noValidate`
 *     pa se poruke drže istog jezika kao ostale greške na sajtu. I dalje
 *     se NIGDE ne beleži da je data — za to nema kolone u bazi.
 *
 * Naslov je sa „Započni" prebačen na „Započnite": ceo redizajn govori u
 * drugom licu množine, a ovo je bilo jedino mesto koje je govorilo „ti".
 */

const NAZIVI_KORAKA = [
  'Osnovne informacije',
  'Usluge',
  'Ciljevi',
  'Dodatne informacije',
];

interface Obrazac {
  fullName: string;
  email: string;
  phone: string;
  serviceType: string;
  homeType: string;
  mainGoals: string[];
  challenges: string;
  heardFrom: string;
  additionalInfo: string;
  preferredContact: string;
  preferredTime: string;
  saglasnost: boolean;
}

const pocetno: Obrazac = {
  fullName: '',
  email: '',
  phone: '',
  serviceType: '',
  homeType: '',
  mainGoals: [],
  challenges: '',
  heardFrom: '',
  additionalInfo: '',
  preferredContact: 'email',
  preferredTime: '',
  saglasnost: false,
};

const jeIspravanEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

/* Forme uz nadnaslove su iz brend simbola; geometrija je izmerena iz
   `public/logo/simbol-20.png`, ne crtana od oka. */
const Oznaka = ({ oblik }: { oblik: 'krug' | 'trougao' | 'kvadrat' }) => (
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
    {oblik === 'kvadrat' && <rect x="1.5" y="1.5" width="11" height="11" />}
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

const KontaktContent = () => {
  const router = useRouter();
  const [korak, setKorak] = useState(1);
  const [obrazac, setObrazac] = useState<Obrazac>(pocetno);
  const [greske, setGreske] = useState<Record<string, string>>({});
  const [salje, setSalje] = useState(false);
  const [greskaSlanja, setGreskaSlanja] = useState('');

  // Posle promene koraka fokus ide na naslov koraka, a pogled na vrh
  // obrasca. `window.scrollTo(0, 0)` sa žive strane bi ovde odveo čak
  // iznad zaglavlja, jer obrazac stoji u sredini strane.
  const vrhObrasca = useRef<HTMLDivElement>(null);
  const naslovKoraka = useRef<HTMLHeadingElement>(null);

  const naVrh = () => {
    const el = vrhObrasca.current;
    if (el) {
      // Plutajući navbar je visok 76px; 24px je vazduh ispod njega.
      const y = el.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
    window.setTimeout(() => naslovKoraka.current?.focus(), 60);
  };

  const promena = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setObrazac((prev) => ({ ...prev, [name]: value }));
    if (greske[name]) {
      setGreske((prev) => {
        const novo = { ...prev };
        delete novo[name];
        return novo;
      });
    }
  };

  const promenaCilja = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setObrazac((prev) => ({
      ...prev,
      mainGoals: checked
        ? [...prev.mainGoals, value]
        : prev.mainGoals.filter((c) => c !== value),
    }));
    if (greske.mainGoals) {
      setGreske((prev) => {
        const novo = { ...prev };
        delete novo.mainGoals;
        return novo;
      });
    }
  };

  const proveriKorak = () => {
    const g: Record<string, string> = {};
    if (korak === 1) {
      if (!obrazac.fullName.trim()) g.fullName = 'Ime i prezime je obavezno.';
      if (!obrazac.email.trim()) {
        g.email = 'Email adresa je obavezna.';
      } else if (!jeIspravanEmail(obrazac.email)) {
        g.email = 'Unesite ispravnu email adresu.';
      }
    }
    if (korak === 2 && !obrazac.serviceType) {
      g.serviceType = 'Izaberite uslugu.';
    }
    if (korak === 3 && obrazac.mainGoals.length === 0) {
      g.mainGoals = 'Izaberite bar jedan cilj.';
    }
    if (korak === 4 && !obrazac.saglasnost) {
      g.saglasnost = 'Potvrdite saglasnost da bismo mogli da vas kontaktiramo.';
    }
    setGreske(g);
    return Object.keys(g).length === 0;
  };

  const napred = () => {
    if (!proveriKorak()) return;
    if (korak < 4) {
      setKorak(korak + 1);
      naVrh();
    }
  };

  const nazad = () => {
    if (korak > 1) {
      setKorak(korak - 1);
      naVrh();
    }
  };

  const posalji = async (e: React.FormEvent) => {
    e.preventDefault();
    setGreskaSlanja('');
    if (!proveriKorak()) return;

    setSalje(true);

    let odgovor: Response;
    try {
      odgovor = await fetch('/api/prijava', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: obrazac.fullName.trim(),
          email: obrazac.email.trim(),
          phone: obrazac.phone.trim() || null,
          preferred_contact: obrazac.preferredContact,
          preferred_time: obrazac.preferredTime || null,
          service_type: obrazac.serviceType,
          home_type: obrazac.homeType || null,
          main_goals: obrazac.mainGoals,
          challenges: obrazac.challenges.trim() || null,
          heard_from: obrazac.heardFrom || null,
          additional_info: obrazac.additionalInfo.trim() || null,
          intent: 'upit',
        }),
      });
    } catch {
      setSalje(false);
      setGreskaSlanja('Nema veze sa internetom. Pokušajte ponovo.');
      return;
    }

    if (!odgovor.ok) {
      setSalje(false);
      const podaci = await odgovor.json().catch(() => null);
      setGreskaSlanja(podaci?.error || 'Došlo je do greške. Pokušajte ponovo.');
      return;
    }

    // `salje` NAMERNO ostaje uključeno dok traje prelaz: dugme je
    // zaključano, pa se upitnik ne može poslati dvaput.
    router.push('/hvala');
  };

  const poljeKlase = (ime?: string) =>
    `upit-unos${ime && greske[ime] ? ' upit-unos-greska' : ''}`;

  return (
    <div className="fs-c">
      {/* VRH */}
      <section className="card c-cream uplata-vrh">
        <div className="wrap stack g24">
          <span className="eyebrow omeni-nad">
            <Oznaka oblik="krug" />
            Kontakt
          </span>
          <h1>Započnite svoju Feng Shui transformaciju</h1>
          <p className="lead omeni-pasus">
            Popunite upitnik kako bismo bolje razumeli vaše potrebe i pripremili
            rešenje prilagođeno vama.
          </p>
        </div>
      </section>

      {/* OBRAZAC */}
      <section className="card c-sand">
        <div className="wrap stack g32">
          <div ref={vrhObrasca} className="upit-koraci" aria-hidden="true">
            {NAZIVI_KORAKA.map((naziv, i) => (
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
              {korak === 2 ? 'Izaberite uslugu' : NAZIVI_KORAKA[korak - 1]}
            </h2>

            {/* KORAK 1 */}
            {korak === 1 && (
              <div className="stack g24">
                <div className="upit-polje">
                  <label className="upit-oznaka" htmlFor="k-ime">
                    Ime i prezime <span className="upit-obavezno">*</span>
                  </label>
                  <input
                    id="k-ime"
                    name="fullName"
                    type="text"
                    value={obrazac.fullName}
                    onChange={promena}
                    className={poljeKlase('fullName')}
                    aria-invalid={!!greske.fullName}
                    aria-describedby={greske.fullName ? 'g-ime' : undefined}
                  />
                  {greske.fullName && (
                    <p className="upit-greska" id="g-ime">
                      {greske.fullName}
                    </p>
                  )}
                </div>

                <div className="upit-polje">
                  <label className="upit-oznaka" htmlFor="k-email">
                    Email adresa <span className="upit-obavezno">*</span>
                  </label>
                  <input
                    id="k-email"
                    name="email"
                    type="email"
                    value={obrazac.email}
                    onChange={promena}
                    className={poljeKlase('email')}
                    aria-invalid={!!greske.email}
                    aria-describedby={greske.email ? 'g-email' : undefined}
                  />
                  {greske.email && (
                    <p className="upit-greska" id="g-email">
                      {greske.email}
                    </p>
                  )}
                </div>

                <div className="upit-polje">
                  <label className="upit-oznaka" htmlFor="k-tel">
                    Broj telefona
                  </label>
                  <input
                    id="k-tel"
                    name="phone"
                    type="tel"
                    value={obrazac.phone}
                    onChange={promena}
                    className={poljeKlase()}
                  />
                </div>

                <fieldset className="upit-polje upit-skup">
                  <legend className="upit-oznaka">Preferirani način kontakta</legend>
                  <div className="upit-red-izbora">
                    {[
                      ['email', 'Email'],
                      ['phone', 'Telefon'],
                    ].map(([vrednost, natpis]) => (
                      <label
                        key={vrednost}
                        htmlFor={`k-kontakt-${vrednost}`}
                        className={`upit-pilula${
                          obrazac.preferredContact === vrednost
                            ? ' upit-pilula-aktivna'
                            : ''
                        }`}
                      >
                        <input
                          type="radio"
                          id={`k-kontakt-${vrednost}`}
                          name="preferredContact"
                          value={vrednost}
                          checked={obrazac.preferredContact === vrednost}
                          onChange={promena}
                        />
                        <span>{natpis}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>

                <div className="upit-polje">
                  <label className="upit-oznaka" htmlFor="k-vreme">
                    Preferirano vreme za kontakt
                  </label>
                  <select
                    id="k-vreme"
                    name="preferredTime"
                    value={obrazac.preferredTime}
                    onChange={promena}
                    className={poljeKlase()}
                  >
                    <option value="">Izaberite…</option>
                    {VREMENA.map(([sifra, naziv]) => (
                      <option key={sifra} value={sifra}>
                        {naziv}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* KORAK 2 */}
            {korak === 2 && (
              <div className="stack g24">
                <fieldset className="upit-polje upit-skup">
                  <legend className="upit-oznaka">
                    Koja vas usluga interesuje? <span className="upit-obavezno">*</span>
                  </legend>
                  {greske.serviceType && (
                    <p className="upit-greska">{greske.serviceType}</p>
                  )}
                  <div className="stack g12">
                    {USLUGE.map((u) => (
                      <label
                        key={u.sifra}
                        htmlFor={`k-usluga-${u.sifra}`}
                        className={`upit-izbor${
                          obrazac.serviceType === u.sifra ? ' upit-izbor-aktivan' : ''
                        }`}
                      >
                        <input
                          type="radio"
                          id={`k-usluga-${u.sifra}`}
                          name="serviceType"
                          value={u.sifra}
                          checked={obrazac.serviceType === u.sifra}
                          onChange={promena}
                        />
                        <span className="upit-izbor-tekst">
                          <span className="upit-izbor-naslov">{u.naslov}</span>
                          <span className="upit-izbor-opis">{u.opis}</span>
                        </span>
                      </label>
                    ))}
                  </div>
                </fieldset>

                <div className="upit-polje">
                  <label className="upit-oznaka" htmlFor="k-prostor">
                    Tip stambenog ili poslovnog prostora
                  </label>
                  <select
                    id="k-prostor"
                    name="homeType"
                    value={obrazac.homeType}
                    onChange={promena}
                    className={poljeKlase()}
                  >
                    <option value="">Izaberite…</option>
                    {TIPOVI_PROSTORA.map(([sifra, naziv]) => (
                      <option key={sifra} value={sifra}>
                        {naziv}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* KORAK 3 */}
            {korak === 3 && (
              <div className="stack g24">
                <fieldset className="upit-polje upit-skup">
                  <legend className="upit-oznaka">
                    Šta želite da postignete? <span className="upit-obavezno">*</span>
                  </legend>
                  {greske.mainGoals && (
                    <p className="upit-greska">{greske.mainGoals}</p>
                  )}
                  <div className="upit-mreza">
                    {CILJEVI.map(([sifra, naziv]) => (
                      <label
                        key={sifra}
                        htmlFor={`k-cilj-${sifra}`}
                        className={`upit-cilj${
                          obrazac.mainGoals.includes(sifra) ? ' upit-cilj-aktivan' : ''
                        }`}
                      >
                        <input
                          type="checkbox"
                          id={`k-cilj-${sifra}`}
                          name="mainGoals"
                          value={sifra}
                          checked={obrazac.mainGoals.includes(sifra)}
                          onChange={promenaCilja}
                        />
                        <span>{naziv}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>

                <div className="upit-polje">
                  <label className="upit-oznaka" htmlFor="k-izazovi">
                    Koji su trenutni izazovi u vašem prostoru?
                  </label>
                  <textarea
                    id="k-izazovi"
                    name="challenges"
                    rows={4}
                    value={obrazac.challenges}
                    onChange={promena}
                    className={poljeKlase()}
                    placeholder="Na primer: nedostatak svetla, loš raspored prostorija, buka…"
                  />
                </div>
              </div>
            )}

            {/* KORAK 4 */}
            {korak === 4 && (
              <div className="stack g24">
                <div className="upit-polje">
                  <label className="upit-oznaka" htmlFor="k-izvor">
                    Kako ste čuli za nas?
                  </label>
                  <select
                    id="k-izvor"
                    name="heardFrom"
                    value={obrazac.heardFrom}
                    onChange={promena}
                    className={poljeKlase()}
                  >
                    <option value="">Izaberite…</option>
                    {IZVORI.map(([sifra, naziv]) => (
                      <option key={sifra} value={sifra}>
                        {naziv}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="upit-polje">
                  <label className="upit-oznaka" htmlFor="k-dodatno">
                    Dodatne informacije ili pitanja
                  </label>
                  <textarea
                    id="k-dodatno"
                    name="additionalInfo"
                    rows={4}
                    value={obrazac.additionalInfo}
                    onChange={promena}
                    className={poljeKlase()}
                    placeholder="Sve što mislite da bi bilo korisno da Dragana zna…"
                  />
                </div>

                <div className="upit-polje">
                  <label className="upit-saglasnost" htmlFor="k-saglasnost">
                    <input
                      type="checkbox"
                      id="k-saglasnost"
                      checked={obrazac.saglasnost}
                      onChange={(e) => {
                        setObrazac((p) => ({ ...p, saglasnost: e.target.checked }));
                        if (greske.saglasnost) {
                          setGreske((p) => {
                            const novo = { ...p };
                            delete novo.saglasnost;
                            return novo;
                          });
                        }
                      }}
                      aria-invalid={!!greske.saglasnost}
                    />
                    <span>
                      Dajem saglasnost da se moji podaci koriste isključivo radi
                      odgovora na ovaj upit i pružanja usluge.
                    </span>
                  </label>
                  {greske.saglasnost && (
                    <p className="upit-greska">{greske.saglasnost}</p>
                  )}
                </div>
              </div>
            )}

            {greskaSlanja && <p className="upit-greska upit-greska-slanja">{greskaSlanja}</p>}

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
                <button
                  type="button"
                  className="btn btn-accent upit-dugme"
                  onClick={napred}
                >
                  Sledeći korak
                  <Strelica />
                </button>
              ) : (
                <button
                  type="submit"
                  className="btn btn-accent upit-dugme"
                  disabled={salje}
                >
                  {salje ? 'Šaljem…' : 'Pošalji upitnik'}
                  {!salje && <Strelica />}
                </button>
              )}
            </div>
          </form>
        </div>
      </section>

      {/* PRIVATNOST */}
      <section className="card c-accent">
        <div className="wrap stack g24">
          <h2>Vaša privatnost nam je važna</h2>
          <p className="lead">
            Sve što podelite ostaje strogo poverljivo. Podatke koristimo
            isključivo da bismo vam odgovorili i pripremili uslugu, i ne
            prosleđujemo ih trećim licima.
          </p>
          <p className="lead">
            Za sva pitanja o privatnosti pišite na{' '}
            <a className="upit-veza" href="mailto:fengshui@draganajovic.com">
              fengshui@draganajovic.com
            </a>
            .
          </p>
        </div>
      </section>
    </div>
  );
};

export default KontaktContent;
