'use client';

import React, { useState, useEffect } from 'react';
import { CalendarCheck, CheckCircle, Loader2, X } from 'lucide-react';
import { formatWebinarDate } from '@/lib/webinarDate';
import type { HomeContent } from '@/types/content';

interface Props {
  content: HomeContent['webinarSection'];
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const initialForm = {
  full_name: '',
  email: '',
  phone: '',
  note: '',
};

const labelClasses = 'block text-xs font-body font-semibold uppercase tracking-[0.12em] text-charcoal-500 mb-1.5';
const inputClasses =
  'w-full rounded-xl border border-sand-300 bg-cream-50 px-4 py-3 text-sm font-body text-charcoal placeholder:text-charcoal-500/50 focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-500 transition-colors';

const WebinarRegistrationModal: React.FC<Props> = ({ content, open, onClose, onSuccess }) => {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open) {
      setStatus('idle');
      setError('');
      setForm(initialForm);
    }
  }, [open]);

  if (!open) return null;

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
        body: JSON.stringify({ ...form, starts_at: content.startsAt }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Greška. Pokušajte ponovo.');
        setStatus('error');
        return;
      }
      setStatus('success');
      setForm(initialForm);
      onSuccess();
      setTimeout(() => {
        onClose();
      }, 1600);
    } catch {
      setError('Greška u mreži. Pokušajte ponovo.');
      setStatus('error');
    }
  };

  const formattedDate = formatWebinarDate(content.startsAt);

  return (
    <div
      className="fixed inset-0 z-[60] flex items-start sm:items-center justify-center overflow-y-auto bg-charcoal/60 backdrop-blur-sm p-4 py-8"
      role="dialog"
      aria-modal="true"
      aria-label={content.title}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg rounded-2xl bg-white shadow-warm border border-sand-200 p-6 md:p-8 my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
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
              {formattedDate && (
                <p className="mt-1 inline-flex items-center gap-2 text-navy-600 text-sm font-heading font-semibold">
                  <CalendarCheck size={16} /> {formattedDate}
                </p>
              )}
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className={labelClasses}>Ime i prezime</label>
                <input type="text" required value={form.full_name} onChange={(e) => set('full_name', e.target.value)} placeholder="Unesite ovde" className={inputClasses} autoFocus />
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
  );
};

export default WebinarRegistrationModal;
