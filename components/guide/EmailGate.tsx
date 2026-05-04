'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';
import { scrollReveal, viewportOnce } from '@/lib/animations';

interface EmailGateProps {
  onUnlock?: () => void;
  title?: string;
  subtitle?: string;
  buttonText?: string;
}

const EmailGate: React.FC<EmailGateProps> = ({
  onUnlock,
  title = 'Otključajte kompletan vodič',
  subtitle = 'Unesite vaše ime i email da pristupite svim poglavljima, interaktivnom testu i bonus video sadržaju.',
  buttonText = 'Otključajte vodič',
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    const data = {
      name: name.trim(),
      email: email.trim(),
      unlockedAt: new Date().toISOString(),
    };
    localStorage.setItem('ptplan_guide_unlocked', JSON.stringify(data));
    onUnlock?.();
  };

  return (
    <motion.div
      variants={scrollReveal}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      className="max-w-lg mx-auto"
    >
      <div className="rounded-2xl shadow-warm bg-cream-50 border border-sand-200 p-8">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-navy-50 mx-auto mb-6">
          <Lock size={20} className="text-navy-500" />
        </div>

        <h3 className="text-2xl md:text-3xl font-heading font-semibold text-charcoal text-center mb-3">
          {title}
        </h3>
        <p className="text-charcoal-500 text-center leading-relaxed mb-8 max-w-md mx-auto">
          {subtitle}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="gate-name" className="block text-sm font-medium text-charcoal-500 mb-1.5 font-body">
              Ime
            </label>
            <input
              id="gate-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Vaše ime"
              className="w-full rounded-xl border border-sand-200 bg-white px-4 py-3 text-charcoal placeholder:text-charcoal-300 focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-transparent transition-all font-body"
            />
          </div>

          <div>
            <label htmlFor="gate-email" className="block text-sm font-medium text-charcoal-500 mb-1.5 font-body">
              Email
            </label>
            <input
              id="gate-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="vaš@email.com"
              className="w-full rounded-xl border border-sand-200 bg-white px-4 py-3 text-charcoal placeholder:text-charcoal-300 focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-transparent transition-all font-body"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-full bg-navy-500 text-white py-3.5 font-heading font-semibold text-base hover:bg-navy-600 active:bg-navy-700 transition-all duration-300 ease-out-expo focus:outline-none focus-visible:ring-2 focus-visible:ring-navy-500 focus-visible:ring-offset-2 active:scale-[0.98]"
          >
            {buttonText}
          </button>
        </form>
      </div>
    </motion.div>
  );
};

export default EmailGate;
