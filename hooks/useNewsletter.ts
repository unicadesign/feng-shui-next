'use client';

import { useContext } from 'react';
import { NewsletterContext } from '@/context/NewsletterContext';

export const useNewsletter = () => {
  const context = useContext(NewsletterContext);
  if (!context) {
    throw new Error('useNewsletter must be used within NewsletterProvider');
  }
  return context;
};
