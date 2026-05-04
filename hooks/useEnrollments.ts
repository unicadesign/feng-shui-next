'use client';

import { useContext } from 'react';
import { EnrollmentContext } from '@/context/EnrollmentContext';

export const useEnrollments = () => {
  const context = useContext(EnrollmentContext);
  if (!context) {
    throw new Error('useEnrollments must be used within EnrollmentProvider');
  }
  return context;
};
