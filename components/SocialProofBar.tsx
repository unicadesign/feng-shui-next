'use client';

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface CounterItemProps {
  number: string;
  label: string;
}

const CounterItem: React.FC<CounterItemProps> = ({ number, label }) => (
  <div className="text-center">
    <span className="text-2xl md:text-3xl font-heading font-bold text-cream-50">{number}</span>
    <span className="block text-sm text-sand-300 mt-1">{label}</span>
  </div>
);

const SocialProofBar = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      className="bg-charcoal py-8"
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : {}}
      transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
    >
      <div className="max-w-[1400px] mx-auto px-6 flex justify-center gap-12 md:gap-20">
        <CounterItem number="1000+" label="Projekata" />
        <CounterItem number="25+" label="Godina iskustva" />
        <CounterItem number="180+" label="Radionica" />
      </div>
    </motion.div>
  );
};

export default SocialProofBar;
