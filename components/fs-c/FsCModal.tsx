'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import type { InquiryInsert } from '@/types/inquiry';

interface FsCModalProps {
  open: boolean;
  onClose: () => void;
  /** Naslov modala — zavisi od toga koji CTA ga je otvorio. */
  title?: string;
  subtitle?: string;
  /**
   * Oznake za Supabase `inquiries` — da se u admin pregledu vidi
   * sa koje stranice/usluge je prijava stigla. Svaka stranica
   * prosleđuje svoje vrednosti.
   */
  serviceType: string;
  heardFrom: string;
}

const goalOptions = [
  'Mir i bolji san u domu',
  'Napredak u poslu i prihodima',
  'Odnosi u porodici',
  'Zdravlje',
  'Želim sama da naučim feng shui',
  'Još uvek ne znam',
];

const initialState = {
  fullName: '',
  email: '',
  phone: '',
  goal: '',
};

const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

/**
 * Deljeni kontakt-modal za sve "verzija C" stranice ("Markov upitnik",
 * skraćen). Piše u isti Supabase `inquiries` table kao pun /upitnik
 * obrazac, pa se sve prijave vide u istom admin pregledu.
 */
const FsCModal = ({
  open,
  onClose,
  title,
  subtitle,
  serviceType,
  heardFrom,
}: FsCModalProps) => {
  const [form, setForm] = useState(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Zaključaj skrol pozadine + zatvaranje na Escape dok je modal otvoren.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  // Resetuj stanje kad se modal zatvori, da sledeći put kreće čist.
  useEffect(() => {
    if (open) return;
    const t = setTimeout(() => {
      setForm(initialState);
      setError('');
      setSuccess(false);
      setIsSubmitting(false);
    }, 200);
    return () => clearTimeout(t);
  }, [open]);

  if (!open) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!form.fullName.trim()) {
      setError('Unesite vaše ime i prezime.');
      return;
    }
    if (!form.email.trim() || !isValidEmail(form.email)) {
      setError('Unesite ispravnu email adresu.');
      return;
    }

    setIsSubmitting(true);

    const payload: InquiryInsert = {
      full_name: form.fullName.trim(),
      email: form.email.trim(),
      phone: form.phone.trim() || null,
      preferred_contact: 'email',
      preferred_time: null,
      service_type: serviceType,
      home_type: null,
      main_goals: form.goal ? [form.goal] : [],
      challenges: null,
      heard_from: heardFrom,
      additional_info: null,
    };

    const { error: dbError } = await supabase.from('inquiries').insert([payload]);

    setIsSubmitting(false);

    if (dbError) {
      setError(dbError.message || 'Došlo je do greške. Pokušajte ponovo.');
    } else {
      setSuccess(true);
    }
  };

  return (
    <div
      className="fs-c-modal-overlay"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div className="fs-c-modal" onClick={(e) => e.stopPropagation()}>
        {success ? (
          <div className="modal-success">
            <div className="check">✓</div>
            <h3>Hvala na prijavi!</h3>
            <p>
              Vaša prijava je poslata. Dragana će vam se javiti u najkraćem roku.
            </p>
            <button
              className="modal-btn"
              style={{ marginTop: '1.25rem' }}
              onClick={onClose}
            >
              Zatvori
            </button>
          </div>
        ) : (
          <>
            <div className="modal-head">
              <div>
                <h3>{title || 'Zakažite besplatan razgovor'}</h3>
                <p>
                  {subtitle ||
                    'Ostavite podatke i Dragana će vam se javiti — bez obaveze.'}
                </p>
              </div>
              <button
                className="modal-close"
                aria-label="Zatvori"
                onClick={onClose}
                type="button"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} noValidate>
              <div className="field">
                <label htmlFor="fsc-name">Ime i prezime</label>
                <input
                  id="fsc-name"
                  name="fullName"
                  type="text"
                  placeholder="Vaše ime"
                  value={form.fullName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="field">
                <label htmlFor="fsc-email">Email adresa</label>
                <input
                  id="fsc-email"
                  name="email"
                  type="email"
                  placeholder="vas@email.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="field">
                <label htmlFor="fsc-phone">Broj telefona</label>
                <input
                  id="fsc-phone"
                  name="phone"
                  type="tel"
                  placeholder="06x xxx xxxx"
                  value={form.phone}
                  onChange={handleChange}
                />
              </div>
              <div className="field">
                <label htmlFor="fsc-goal">Šta vam je trenutno najvažnije</label>
                <select
                  id="fsc-goal"
                  name="goal"
                  value={form.goal}
                  onChange={handleChange}
                >
                  <option value="">Izaberite…</option>
                  {goalOptions.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </div>

              <button className="modal-btn" type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Šaljem…' : 'Pošalji prijavu'}
              </button>

              {error && <p className="modal-error">{error}</p>}

              <p className="modal-privacy">
                Vaši podaci se koriste isključivo za kontakt oko usluga i kursa.
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default FsCModal;
