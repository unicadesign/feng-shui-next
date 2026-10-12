'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Loader2, Check } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import Image from 'next/image';
import Button from '@/components/Button';
import NazadNaSajt from '@/components/NazadNaSajt';
// Brend paleta (blok `body:has(.nalog-strana)`); ostala pravila su pod `.fs-c`.
import '@/components/sajt/fs-c.css';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { signup } = useAuth();
  const router = useRouter();

  const validateForm = (): string | null => {
    if (!name.trim()) {
      return 'Ime je obavezno.';
    }
    if (!email.trim()) {
      return 'Email adresa je obavezna.';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return 'Unesite validnu email adresu.';
    }
    if (password.length < 6) {
      return 'Lozinka mora imati najmanje 6 karaktera.';
    }
    if (password !== confirmPassword) {
      return 'Lozinke se ne poklapaju.';
    }
    if (!acceptTerms) {
      return 'Morate prihvatiti uslove korišćenja.';
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await signup(name, email, password);
      if (result.success) {
        router.replace('/dashboard');
      } else {
        setError(result.error || 'Došlo je do greške prilikom registracije.');
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
        {/* Znak umesto starog natpisa (12.10.2026.), isti kao u zaglavlju sajta. */}
        <div className="text-center mb-6">
          <Link href="/" className="inline-block p-2 -m-2">
            <Image src="/logo/logo-zlatni.png" alt="Dragana Jović, početna" width={44} height={44} className="h-11 w-11 object-contain" priority />
          </Link>
        </div>

        <h1 className="font-heading text-2xl md:text-3xl font-bold text-charcoal text-center mb-8">
          Kreirajte nalog
        </h1>

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
            <label htmlFor="name" className="block text-sm font-medium text-charcoal-500 mb-1.5">
              Ime
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-charcoal-500/50" />
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Vaše ime i prezime"
                required
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-sand-300 bg-white text-charcoal placeholder:text-charcoal-500/40 focus:border-navy-500 focus:ring-2 focus:ring-navy-500/20 outline-none transition-all duration-200"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-charcoal-500 mb-1.5">
              Email adresa
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-charcoal-500/50" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="vas@email.com"
                required
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-sand-300 bg-white text-charcoal placeholder:text-charcoal-500/40 focus:border-navy-500 focus:ring-2 focus:ring-navy-500/20 outline-none transition-all duration-200"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-charcoal-500 mb-1.5">
              Lozinka
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-charcoal-500/50" />
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Najmanje 6 karaktera"
                required
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-sand-300 bg-white text-charcoal placeholder:text-charcoal-500/40 focus:border-navy-500 focus:ring-2 focus:ring-navy-500/20 outline-none transition-all duration-200"
              />
            </div>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-charcoal-500 mb-1.5">
              Potvrdite lozinku
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-charcoal-500/50" />
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Ponovite lozinku"
                required
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-sand-300 bg-white text-charcoal placeholder:text-charcoal-500/40 focus:border-navy-500 focus:ring-2 focus:ring-navy-500/20 outline-none transition-all duration-200"
              />
            </div>
          </div>

          <div className="flex items-start gap-3">
            <button
              type="button"
              onClick={() => setAcceptTerms(!acceptTerms)}
              className={`mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
                acceptTerms
                  ? 'bg-navy-500 border-navy-500'
                  : 'border-sand-300 bg-white hover:border-navy-500/50'
              }`}
            >
              {acceptTerms && <Check className="w-3.5 h-3.5 text-white" />}
            </button>
            <label
              onClick={() => setAcceptTerms(!acceptTerms)}
              className="text-sm text-charcoal-500 cursor-pointer select-none"
            >
              Prihvatam{' '}
              <span className="text-navy-600 font-medium hover:text-navy-700 transition-colors">
                uslove korišćenja
              </span>
            </label>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            disabled={isSubmitting}
            icon={isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : undefined}
          >
            {isSubmitting ? 'Registracija...' : 'Registrujte se'}
          </Button>
        </form>


        <p className="mt-8 text-center text-sm text-charcoal-500">
          Već imate nalog?{' '}
          <Link
            href="/login"
            className="font-semibold text-navy-600 hover:text-navy-700 transition-colors"
          >
            Prijavite se
          </Link>
        </p>
      </motion.div>

      <NazadNaSajt />
    </div>
  );
}
