'use client';

import { useContext } from 'react';
import { InquiryContext } from '@/context/InquiryContext';

export const useInquiries = () => {
  const context = useContext(InquiryContext);
  if (!context) {
    throw new Error('useInquiries must be used within InquiryProvider');
  }
  return context;
};
