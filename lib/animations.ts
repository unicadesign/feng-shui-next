import { Variants } from 'framer-motion';

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

export const scrollRevealDelayed: Variants = {
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
      delay: 0.15,
    },
  },
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.32, 0.72, 0, 1],
    },
  },
};

export const fadeInScale: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.32, 0.72, 0, 1],
    },
  },
};

export const viewportOnce = {
  once: true,
  margin: '-80px',
};
