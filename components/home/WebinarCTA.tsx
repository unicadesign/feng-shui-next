'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { CalendarCheck, CheckCircle, Loader2, X } from 'lucide-react';
import { scrollReveal, viewportOnce } from '@/lib/animations';
import type { HomeContent } from '@/types/content';

interface WebinarCTAProps {
  content: HomeContent['webinarSection'];
}

const initialForm = {
  full_name: '',
  birth_date: '',
  city: '',
  email: '',
  phone: '',
  note: '',
};

// One registration flag per webinar instance, keyed by its date/title so a new
// webinar (new date) shows the CTA again to returning visitors.
const registeredKey = (content: HomeContent['webinarSection']) =>
  `webinar_registered:${content.dateText || content.title}`;

const WebinarCTA: React.FC<WebinarCTAProps> = ({ content }) => {
  const [open, setOpen] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');

  useEffect(() => {
    try {
      if (localStorage.getItem(registeredKey(content)) === '1') setRegistered(true);
    } catch {
      /* ignore */
    }
  }, [content]);

  const closeModal = useCallback(() => setOpen(false), []);

  // Esc to close + lock body scroll while open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && closeModal();
    window.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, closeModal]);

  if (!content.enabled) return null;

  const set = (key: keyof typeof initialForm, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === 'loading') return;
    setStatus('loading');
    setError('');
    try {
      const res = await fetch('/api/webinar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, date_text: content.dateText }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Greška. Pokušajte ponovo.');
        setStatus('error');
        return;
      }
      setStatus('success');
      setForm(initialForm);
      try {
        localStorage.setItem(registeredKey(content), '1');
      } catch {
        /* ignore */
      }
      // Auto-close the modal; the section then shows the thank-you state.
      setTimeout(() => {
        setRegistered(true);
        setOpen(false);
        setStatus('idle');
      }, 1600);
    } catch {
      setError('Greška u mreži. Pokušajte ponovo.');
      setStatus('error');
    }
  };

  const labelClasses = 'block text-xs font-body font-semibold uppercase tracking-[0.12em] text-charcoal-500 mb-1.5';
  const inputClasses =
    'w-full rounded-xl border border-sand-300 bg-cream-50 px-4 py-3 text-sm font-body text-charcoal placeholder:text-charcoal-500/50 focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-500 transition-colors';

  return (
    <section className="bg-navy-50 py-20 md:py-28">
      <motion.div
        className="max-w-2xl mx-auto px-6 lg:px-8 text-center"
        variants={scrollReveal}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
      >
        <span className="inline-block rounded-full bg-gold-50 text-gold-600 px-3 py-1 text-xs uppercase tracking-[0.2em] font-body font-medium mb-4">
          {content.badge}
        </span>
        <h2 className="text-3xl md:text-4xl font-heading font-semibold tracking-tight leading-[1.05] text-charcoal mb-3">
          {content.title}
        </h2>
        <p className="text-charcoal-500 font-body leading-relaxed max-w-[55ch] mx-auto">
          {content.subtitle}
        </p>
        {content.dateText && (
          <p className="mt-4 inline-flex items-center gap-2 text-navy-600 font-heading font-semibold">
            <CalendarCheck size={18} /> {content.dateText}
          </p>
        )}

        <div className="mt-8">
          {registered ? (
            <p className="inline-flex items-center gap-2 rounded-full bg-cream-50 border border-sand-200 px-6 py-3 text-charcoal font-heading font-semibold">
              <CheckCircle size={20} className="text-green-600" />
              Hvala što ste se prijavili!
            </p>
          ) : (
            <button
              onClick={() => setOpen(true)}
              className="inline-flex items-center justify-center rounded-full bg-charcoal text-cream-50 px-8 py-4 text-sm font-heading font-semibold hover:bg-charcoal/90 transition-all duration-300 ease-out-expo active:scale-[0.98]"
            >
              {content.buttonText}
            </button>
          )}
        </div>
      </motion.div>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-start sm:items-center justify-center overflow-y-auto bg-charcoal/60 backdrop-blur-sm p-4 py-8"
          role="dialog"
          aria-modal="true"
          aria-label={content.title}
          onClick={closeModal}
        >
          <div
            className="relative w-full max-w-lg rounded-2xl bg-white shadow-warm border border-sand-200 p-6 md:p-8 my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              aria-label="Zatvori"
              className="absolute top-4 right-4 p-1.5 rounded-lg text-charcoal-400 hover:text-charcoal hover:bg-cream-100 transition-colors"
            >
              <X size={20} />
            </button>

            {status === 'success' ? (
              <div className="py-8 text-center">
                <CheckCircle size={36} className="text-green-600 mx-auto mb-3" />
                <p className="text-charcoal font-heading font-semibold text-lg">{content.successMessage}</p>
              </div>
            ) : (
              <>
                <div className="mb-6 pr-8">
                  <h3 className="text-xl font-heading font-semibold text-charcoal">{content.title}</h3>
                  {content.dateText && (
                    <p className="mt-1 inline-flex items-center gap-2 text-navy-600 text-sm font-heading font-semibold">
                      <CalendarCheck size={16} /> {content.dateText}
                    </p>
                  )}
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className={labelClasses}>Ime i prezime</label>
                    <input type="text" required value={form.full_name} onChange={(e) => set('full_name', e.target.value)} placeholder="Unesite ovde" className={inputClasses} autoFocus />
                  </div>
                  <div>
                    <label className={labelClasses}>Datum rođenja</label>
                    <input type="date" value={form.birth_date} onChange={(e) => set('birth_date', e.target.value)} className={inputClasses} />
                  </div>
                  <div>
                    <label className={labelClasses}>Mesto stanovanja</label>
                    <input type="text" value={form.city} onChange={(e) => set('city', e.target.value)} placeholder="Grad" className={inputClasses} />
                  </div>
                  <div>
                    <label className={labelClasses}>Email</label>
                    <input type="email" required value={form.email} onChange={(e) => set('email', e.target.value)} placeholder="Email" className={inputClasses} />
                  </div>
                  <div>
                    <label className={labelClasses}>Broj telefona</label>
                    <input type="tel" value={form.phone} onChange={(e) => set('phone', e.target.value)} placeholder="Unesite ovde" className={inputClasses} />
                  </div>
                  <div>
                    <label className={labelClasses}>Napomena (opciono)</label>
                    <textarea value={form.note} onChange={(e) => set('note', e.target.value)} placeholder="Ovde možete ostaviti dodatne informacije ili pitanja" className={`${inputClasses} resize-y min-h-[90px]`} />
                  </div>

                  {status === 'error' && <p className="text-sm font-body text-red-600">{error}</p>}

                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-charcoal text-cream-50 px-7 py-4 text-sm font-heading font-semibold hover:bg-charcoal/90 transition-all duration-300 ease-out-expo active:scale-[0.99] disabled:opacity-60"
                  >
                    {status === 'loading' && <Loader2 size={16} className="animate-spin" />}
                    {content.buttonText}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default WebinarCTA;
