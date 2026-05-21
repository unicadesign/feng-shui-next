'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, CheckCircle, Loader2 } from 'lucide-react';
import { scrollReveal, viewportOnce } from '@/lib/animations';
import type { HomeContent } from '@/types/content';

interface NewsletterSignupProps {
  content: HomeContent['newsletter'];
}

const NewsletterSignup: React.FC<NewsletterSignupProps> = ({ content }) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === 'loading') return;
    setStatus('loading');
    setError('');
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Greška. Pokušajte ponovo.');
        setStatus('error');
        return;
      }
      setStatus('success');
      setEmail('');
    } catch {
      setError('Greška u mreži. Pokušajte ponovo.');
      setStatus('error');
    }
  };

  return (
    <section className="bg-cream-100 py-16 md:py-20">
      <motion.div
        className="max-w-3xl mx-auto px-6 lg:px-8 text-center"
        variants={scrollReveal}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
      >
        <span className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-navy-50 text-navy-500 mb-5">
          <Mail size={22} />
        </span>
        <h2 className="text-3xl md:text-4xl font-heading font-semibold tracking-tight leading-[1.05] text-charcoal mb-4">
          {content.title}
        </h2>
        <p className="text-charcoal-500 font-body leading-relaxed mb-8 max-w-[55ch] mx-auto">
          {content.subtitle}
        </p>

        {status === 'success' ? (
          <div className="flex items-center justify-center gap-2 text-green-600 font-body font-medium">
            <CheckCircle size={20} />
            <span>{content.successMessage}</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={content.placeholder}
              className="flex-1 rounded-full border border-sand-300 bg-white px-5 py-3 text-sm font-body text-charcoal placeholder:text-charcoal-500/50 focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-500 transition-colors"
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-navy-500 text-white px-7 py-3 text-sm font-heading font-semibold hover:bg-navy-600 transition-all duration-300 ease-out-expo active:scale-[0.98] disabled:opacity-60"
            >
              {status === 'loading' && <Loader2 size={16} className="animate-spin" />}
              {content.buttonText}
            </button>
          </form>
        )}
        {status === 'error' && (
          <p className="mt-3 text-sm font-body text-red-600">{error}</p>
        )}
      </motion.div>
    </section>
  );
};

export default NewsletterSignup;
