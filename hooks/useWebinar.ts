'use client';

import { useContext } from 'react';
import { WebinarContext } from '@/context/WebinarContext';

export const useWebinar = () => {
  const context = useContext(WebinarContext);
  if (!context) {
    throw new Error('useWebinar must be used within WebinarProvider');
  }
  return context;
};
