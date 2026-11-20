'use client';

import React, { Suspense, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Lock, Loader2, CheckCircle2, LinkIcon } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import Button from '@/components/Button';
import NazadNaSajt from '@/components/NazadNaSajt';
// Brend paleta (blok `body:has(.nalog-strana)`); ostala pravila su pod `.fs-c`.
import '@/components/sajt/fs-c.css';

export default function NovaLozinkaPage() {
  return (
    <Suspense fallback={null}>
      <NovaLozinka />
    </Suspense>
  );
}

const poljeClasses =
  'w-full pl-11 pr-4 py-3 rounded-xl border border-sand-300 bg-white text-charcoal placeholder:text-charcoal-500/40 focus:border-navy-500 focus:ring-2 focus:ring-navy-500/20 outline-none transition-all duration-200';

/**
 * Nova lozinka (20.11.2026.), strana na koju vodi link iz mejla:
 * `/nova-lozinka?token_hash=…&type=recovery`.
 *
 * Link se ne troši pri otvaranju strane, nego tek na „Sačuvaj lozinku":
 * neki programi za poštu (npr. Outlook) sami otvore svaki link iz mejla da
 * ga provere, i da se link trošio na otvaranje, polaznici bi stigao već
 * iskorišćen. `verifyOtp` sa `token_hash` radi i kad se link otvori na
 * drugom uređaju od onog na kom je tražen.
 *
 * Dužina i poklapanje se proveravaju pre nego što se link iskoristi, a ako
 * je link iskorišćen pa čuvanje lozinke ne uspe, ponovni pokušaj ide samo
 * na čuvanje (polaznica je tada već prijavljena).
 */
function NovaLozinka() {
  const searchParams = useSearchParams();
  const tokenHash = searchParams.get('token_hash');
  const linkIspravan = !!tokenHash && searchParams.get('type') === 'recovery';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [potvrdjeno, setPotvrdjeno] = useState(false);
  const [linkIstekao, setLinkIstekao] = useState(false);
  const [gotovo, setGotovo] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password.length < 6) {
      setError('Lozinka mora imati najmanje 6 karaktera.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Lozinke se ne poklapaju.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (!potvrdjeno) {
        const { error: greska } = await supabase.auth.verifyOtp({ type: 'recovery', token_hash: tokenHash! });
        if (greska) {
          setLinkIstekao(true);
          return;
        }
        setPotvrdjeno(true);
      }
      const { error: greska } = await supabase.auth.updateUser({ password });
      if (greska) {
        setError(
          greska.code === 'same_password'
            ? 'Nova lozinka mora biti drugačija od stare.'
            : greska.code === 'weak_password'
              ? 'Lozinka mora imati najmanje 6 karaktera.'
              : 'Čuvanje lozinke nije uspelo. Pokušajte ponovo.',
        );
        return;
      }
      setGotovo(true);
    } catch {
      setError('Došlo je do neočekivane greške. Pokušajte ponovo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  let sadrzaj: React.ReactNode;
  if (gotovo) {
    sadrzaj = (
      <div className="text-center" role="status">
        <CheckCircle2 className="w-10 h-10 mx-auto mb-4 text-navy-500" aria-hidden="true" />
        <h1 className="font-heading text-2xl md:text-3xl font-bold text-charcoal mb-4">Lozinka je promenjena</h1>
        <p className="text-charcoal-500 mb-8">Prijavljeni ste i od sada se prijavljujete novom lozinkom.</p>
        <Button to="/dashboard" variant="primary" size="lg" fullWidth>
          Moji kursevi
        </Button>
      </div>
    );
  } else if (!linkIspravan || linkIstekao) {
    sadrzaj = (
      <div className="text-center">
        <LinkIcon className="w-10 h-10 mx-auto mb-4 text-charcoal-400" aria-hidden="true" />
        <h1 className="font-heading text-2xl md:text-3xl font-bold text-charcoal mb-4">
          {linkIstekao ? 'Link je istekao' : 'Link nije potpun'}
        </h1>
        <p className="text-charcoal-500 mb-8">
          {linkIstekao
            ? 'Link za novu lozinku važi sat vremena i može da se iskoristi samo jednom. Zatražite novi link.'
            : 'Otvorite link iz mejla ceo, ili zatražite novi.'}
        </p>
        <Button to="/zaboravljena-lozinka" variant="primary" size="lg" fullWidth>
          Zatraži novi link
        </Button>
      </div>
    );
  } else {
    sadrzaj = (
      <>
        <h1 className="font-heading text-2xl md:text-3xl font-bold text-charcoal text-center mb-3">Nova lozinka</h1>
        <p className="text-center text-charcoal-500 mb-8">Upišite novu lozinku za svoj nalog.</p>

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
            <label htmlFor="password" className="block text-sm font-medium text-charcoal-500 mb-1.5">
              Nova lozinka
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-charcoal-500/50" />
              <input
                id="password"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Najmanje 6 karaktera"
                required
                className={poljeClasses}
              />
            </div>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-charcoal-500 mb-1.5">
              Ponovite lozinku
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-charcoal-500/50" />
              <input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Ponovite novu lozinku"
                required
                className={poljeClasses}
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
            {isSubmitting ? 'Čuvanje...' : 'Sačuvaj lozinku'}
          </Button>
        </form>
      </>
    );
  }

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
        {sadrzaj}
      </motion.div>

      <NazadNaSajt />
    </div>
  );
}
