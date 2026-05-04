'use client';

import React, { Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mail, Lock, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import Button from '@/components/Button';

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const redirectTo = searchParams.get('redirect') || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const result = await login(email, password);
      if (result.success) {
        router.replace(redirectTo);
      } else {
        setError(result.error || 'Došlo je do greške prilikom prijave.');
      }
    } catch {
      setError('Došlo je do neočekivane greške. Pokušajte ponovo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-cream-50 min-h-screen flex items-center justify-center px-4 py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="max-w-md w-full rounded-2xl shadow-warm bg-cream-50 border border-sand-200 p-8 md:p-10"
      >
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <span className="font-heading text-2xl font-bold text-charcoal tracking-tight">
              ptPLAN
            </span>
          </Link>
        </div>

        <h1 className="font-heading text-2xl md:text-3xl font-bold text-charcoal text-center mb-8">
          Prijavite se
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
                placeholder="Vaša lozinka"
                required
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-sand-300 bg-white text-charcoal placeholder:text-charcoal-500/40 focus:border-navy-500 focus:ring-2 focus:ring-navy-500/20 outline-none transition-all duration-200"
              />
            </div>
          </div>

          <div className="text-right">
            <button
              type="button"
              className="text-sm text-navy-600 hover:text-navy-700 font-medium transition-colors"
            >
              Zaboravili ste lozinku?
            </button>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            disabled={isSubmitting}
            icon={isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : undefined}
          >
            {isSubmitting ? 'Prijavljivanje...' : 'Prijava'}
          </Button>
        </form>

        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 h-px bg-sand-200" />
          <span className="text-sm text-charcoal-500/60 font-medium">ili</span>
          <div className="flex-1 h-px bg-sand-200" />
        </div>

        <div className="space-y-3">
          <button
            disabled
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-sand-200 bg-sand-50 text-charcoal-400 text-sm font-body cursor-not-allowed opacity-60"
          >
            <svg className="w-4 h-4 opacity-50" viewBox="0 0 24 24" fill="none">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Google prijava — uskoro
          </button>

          <button
            disabled
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-sand-200 bg-sand-50 text-charcoal-400 text-sm font-body cursor-not-allowed opacity-60"
          >
            <svg className="w-4 h-4 opacity-50" viewBox="0 0 24 24" fill="#1877F2">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            Facebook prijava — uskoro
          </button>
        </div>

        <p className="mt-8 text-center text-sm text-charcoal-500">
          Nemate nalog?{' '}
          <Link
            href="/signup"
            className="font-semibold text-navy-600 hover:text-navy-700 transition-colors"
          >
            Registrujte se
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
