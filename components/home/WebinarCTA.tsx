'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CalendarCheck, CheckCircle, Loader2 } from 'lucide-react';
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

const WebinarCTA: React.FC<WebinarCTAProps> = ({ content }) => {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');

  // Safety net: never render if disabled (HomeContent also guards).
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
        className="max-w-2xl mx-auto px-6 lg:px-8"
        variants={scrollReveal}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
      >
        <div className="text-center mb-8">
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
        </div>

        {status === 'success' ? (
          <div className="rounded-2xl bg-cream-50 border border-sand-200 p-8 text-center">
            <CheckCircle size={32} className="text-green-600 mx-auto mb-3" />
            <p className="text-charcoal font-body">{content.successMessage}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="rounded-2xl bg-white shadow-warm border border-sand-200 p-6 md:p-8 space-y-4">
            <div>
              <label className={labelClasses}>Ime i prezime</label>
              <input type="text" required value={form.full_name} onChange={(e) => set('full_name', e.target.value)} placeholder="Unesite ovde" className={inputClasses} />
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
              <textarea value={form.note} onChange={(e) => set('note', e.target.value)} placeholder="Ovde možete ostaviti dodatne informacije ili pitanja" className={`${inputClasses} resize-y min-h-[100px]`} />
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
        )}
      </motion.div>
    </section>
  );
};

export default WebinarCTA;
