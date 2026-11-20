'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Mail, Loader2, MailCheck } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import Button from '@/components/Button';
import NazadNaSajt from '@/components/NazadNaSajt';
// Brend paleta (blok `body:has(.nalog-strana)`); ostala pravila su pod `.fs-c`.
import '@/components/sajt/fs-c.css';

/**
 * Zaboravljena lozinka (20.11.2026.): polaznica upiše email i Supabase joj
 * pošalje link za novu lozinku. Link vodi na `/nova-lozinka` (šablon mejla
 * „Reset Password" u Supabase-u, `{{ .SiteURL }}/nova-lozinka?token_hash=…`).
 *
 * Poruka posle slanja je ista i kad nalog sa tom adresom ne postoji
 * (Supabase tada ništa ne šalje, a odgovor je isti), da se preko ove strane
 * ne može proveriti ko ima nalog.
 */
export default function ZaboravljenaLozinkaPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [poslato, setPoslato] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      const { error: greska } = await supabase.auth.resetPasswordForEmail(email.trim());
      if (greska) {
        setError(
          greska.status === 429
            ? 'Link je već poslat pre manje od minut. Sačekajte malo pa pokušajte ponovo.'
            : 'Slanje nije uspelo. Pokušajte ponovo za nekoliko minuta.',
        );
      } else {
        setPoslato(true);
      }
    } catch {
      setError('Došlo je do neočekivane greške. Pokušajte ponovo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="nalog-strana bg-cream-50 min-h-screen flex flex-col items-center justify-center px-4 py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="max-w-md w-full rounded-2xl shadow-warm bg-cream-50 border border-sand-200 p-8 md:p-10"
      >
        <div className="text-center mb-6">
          <Link href="/" className="inline-block p-2 -m-2">
            <Image src="/logo/logo-zlatni.png" alt="Dragana Jović, početna" width={44} height={44} className="h-11 w-11 object-contain" priority />
          </Link>
        </div>

        {poslato ? (
          <div className="text-center" role="status">
            <MailCheck className="w-10 h-10 mx-auto mb-4 text-navy-500" aria-hidden="true" />
            <h1 className="font-heading text-2xl md:text-3xl font-bold text-charcoal mb-4">Proverite email</h1>
            <p className="text-charcoal-500 leading-relaxed">
              Ako postoji nalog sa adresom <span className="font-semibold text-charcoal break-all">{email.trim()}</span>,
              poslali smo link za novu lozinku. Link važi sat vremena.
            </p>
            <p className="mt-4 text-sm text-charcoal-500">
              Ne vidite mejl? Pogledajte i folder za neželjenu poštu (Spam ili Promocije).
            </p>
          </div>
        ) : (
          <>
            <h1 className="font-heading text-2xl md:text-3xl font-bold text-charcoal text-center mb-3">
              Zaboravljena lozinka
            </h1>
            <p className="text-center text-charcoal-500 mb-8">
              Upišite email adresu sa kojom ste se registrovali i poslaćemo vam link za novu lozinku.
            </p>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm text-center"
              >
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-charcoal-500 mb-1.5">
                  Email adresa
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-charcoal-500/50" />
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="vas@email.com"
                    required
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-sand-300 bg-white text-charcoal placeholder:text-charcoal-500/40 focus:border-navy-500 focus:ring-2 focus:ring-navy-500/20 outline-none transition-all duration-200"
                  />
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                disabled={isSubmitting}
                icon={isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : undefined}
              >
                {isSubmitting ? 'Slanje...' : 'Pošalji link'}
              </Button>
            </form>
          </>
        )}

        <p className="mt-8 text-center text-sm text-charcoal-500">
          Setili ste se lozinke?{' '}
          <Link href="/login" className="font-semibold text-navy-600 hover:text-navy-700 transition-colors">
            Prijavite se
          </Link>
        </p>
      </motion.div>

      <NazadNaSajt />
    </div>
  );
}
