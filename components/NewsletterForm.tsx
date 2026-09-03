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
 * na javnim stranama (`.fs-c`) preusmereni na novu paletu a na login,
 * dashboard i admin stranama nose staru, pa bi podnožje ispalo dvojako.
 *   #6B5518  dugme i naglasak     7,15:1 sa belim slovima
 *   #665243  tekst                7,36:1 na beloj
 *   #DCC5A6  ivica polja
 */
type Stanje = 'miruje' | 'salje' | 'uspeh' | 'greska';

const NewsletterForm = () => {
  const [email, setEmail] = useState('');
  const [stanje, setStanje] = useState<Stanje>('miruje');
  const [poruka, setPoruka] = useState('');

  // Dugme je isključeno dok polje ne dobije nešto. Namerno NIJE uslovljeno
  // ispravnom adresom: prag „mora da bude validan email" ostavlja dugme
  // mrtvim dok korisnik kuca, pa deluje pokvareno. Ispravnost proverava
  // `/api/newsletter` i vraća svoju poruku.
  const prazno = email.trim() === '';

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
      {/* Dugme je samo strelica, bez natpisa. Razlog nije ušteda prostora
          nego zabuna: „Prijavi se" na ovom sajtu svuda znači upis na kurs, a
          na strani škole je isto takvo zlatno dugme stajalo dvestotinak
          piksela iznad ovog. Bez natpisa sudara nema.
          Time otpada i prelamanje na uskim ekranima — polje sada uvek ima
          punu širinu, pa `flex-wrap` više ne treba. */}
      <div className="flex items-center gap-2.5">
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
          className="flex-grow min-w-0 min-h-[48px] rounded-full border border-[#DCC5A6] bg-white px-5 py-3 text-[15px] text-[#3E2A1E] placeholder:text-[#665243] focus:outline-none focus:border-[#6B5518]"
        />
        {/* `aria-label` je obavezan: dugme bez natpisa čitač ekrana inače
            pročita samo kao „dugme". 48px je i donja granica za pouzdan
            dodir na telefonu. */}
        <button
          type="submit"
          disabled={prazno || stanje === 'salje'}
          aria-label="Prijavi se na newsletter"
          className="flex-none flex h-12 w-12 items-center justify-center rounded-full bg-[#6B5518] text-white transition-colors duration-200 hover:bg-[#3E2A1E] disabled:bg-[#DCC5A6] disabled:text-[#665243] disabled:cursor-not-allowed"
        >
          {stanje === 'salje' ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" className="animate-spin">
              <path d="M21 12a9 9 0 1 1-6.2-8.6" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          )}
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
