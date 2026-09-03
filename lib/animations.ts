import { Variants } from 'framer-motion';

/* Koriste ih pregled kursa i lekcija (components/course). Ostale varijante
   (staggerContainer, staggerItem, scrollRevealDelayed, fadeInScale) su
   obrisane pri prelasku na novi dizajn 09.2026.: koristile su ih samo stare
   javne strane. */
export const scrollReveal: Variants = {
  hidden: {
    opacity: 0,
    y: 48,
    filter: 'blur(8px)',
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.8,
      ease: [0.32, 0.72, 0, 1],
    },
  },
};

export const viewportOnce = {
  once: true,
  margin: '-80px',
};
