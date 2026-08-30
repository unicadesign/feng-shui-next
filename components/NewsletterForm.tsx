'use client';

import React, { useState } from 'react';

/**
 * Prijava na newsletter u podnožju.
 *
 * Zaseban klijentski fajl jer je `Footer` serverska komponenta, a forma
 * traži stanje. Šalje na `POST /api/newsletter`, koji je već postojao i
 * do sada se nije koristio nigde na sajtu: proverava adresu, upisuje u
 * Supabase, duplikat vraća kao uspeh (da onaj ko se prijavi dvaput ne
 * dobije grešku) i šalje dobrodošlicu.
 *
 * Boje stoje doslovno, iz istog razloga kao u ostatku podnožja: tokeni su
 * na `-c` stranama preusmereni na novu paletu a na starim nose staru, pa
 * bi podnožje ispalo dvojako.
 *   #6B5518  dugme i naglasak     7,15:1 sa belim slovima
 *   #665243  tekst                7,36:1 na beloj
 *   #DCC5A6  ivica polja
 */
type Stanje = 'miruje' | 'salje' | 'uspeh' | 'greska';

const NewsletterForm = () => {
  const [email, setEmail] = useState('');
  const [stanje, setStanje] = useState<Stanje>('miruje');
  const [poruka, setPoruka] = useState('');

  const posalji = async (e: React.FormEvent) => {
    e.preventDefault();
    if (stanje === 'salje') return;
    setStanje('salje');
    try {
      const odgovor = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const podaci = await odgovor.json();
      if (!odgovor.ok) {
        setPoruka(podaci?.error ?? 'Greška pri upisu. Pokušajte ponovo.');
        setStanje('greska');
        return;
      }
      setStanje('uspeh');
    } catch {
      setPoruka('Nema veze sa mrežom. Pokušajte ponovo.');
      setStanje('greska');
    }
  };

  if (stanje === 'uspeh') {
    return (
      <p className="text-sm text-[#665243]" role="status">
        Hvala. Potvrda je poslata na vašu adresu.
      </p>
    );
  }

  return (
    <form onSubmit={posalji} noValidate>
      {/* `flex-wrap` uz donju granicu širine polja: na 320px polje i
          dugme ne staju u red (272px prostora naspram potrebnih 305), pa
          se natpis u polju sekao. Ovako se dugme prelomi u sledeći red
          umesto da se polje stisne. */}
      <div className="flex flex-wrap items-center gap-2.5">
        <label htmlFor="newsletter-email" className="sr-only">
          Email adresa za newsletter
        </label>
        <input
          id="newsletter-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Vaša email adresa"
          autoComplete="email"
          className="flex-grow min-w-[180px] min-h-[48px] rounded-full border border-[#DCC5A6] bg-white px-5 py-3 text-[15px] text-[#3E2A1E] placeholder:text-[#665243] focus:outline-none focus:border-[#6B5518]"
        />
        <button
          type="submit"
          disabled={stanje === 'salje'}
          className="flex-none min-h-[48px] rounded-full bg-[#6B5518] px-6 py-3 text-[15px] font-bold text-white whitespace-nowrap transition-opacity duration-200 hover:opacity-90 disabled:opacity-60"
        >
          {stanje === 'salje' ? 'Šalje se…' : 'Prijavi se'}
        </button>
      </div>
      {stanje === 'greska' && (
        <p className="mt-2 text-sm text-[#B3261E]" role="alert">
          {poruka}
        </p>
      )}
    </form>
  );
};

export default NewsletterForm;
