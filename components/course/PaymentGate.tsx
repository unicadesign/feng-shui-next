'use client';

import React from 'react';
import { Lock, Clock } from 'lucide-react';
import Button from '@/components/Button';

interface PaymentGateProps {
  type: 'payment' | 'time';
  availableDate?: string;
}

const PaymentGate: React.FC<PaymentGateProps> = ({ type, availableDate }) => {
  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center bg-cream-50/80 backdrop-blur-sm rounded-2xl">
      <div className="text-center max-w-md px-8 py-12">
        {type === 'payment' ? (
          <>
            <div className="w-16 h-16 rounded-full bg-sand-200 flex items-center justify-center mx-auto mb-6">
              <Lock className="w-8 h-8 text-charcoal-500" />
            </div>
            <h3 className="font-heading text-xl text-charcoal mb-3">
              Lekcija nije dostupna
            </h3>
            <p className="text-charcoal-500 mb-6">
              Ova lekcija nije dostupna. Molimo izvršite uplatu za nastavak.
            </p>
            <Button
              variant="primary"
              onClick={() => alert('PayPal integracija u pripremi.')}
            >
              Platite
            </Button>
          </>
        ) : (
          <>
            <div className="w-16 h-16 rounded-full bg-navy-50 flex items-center justify-center mx-auto mb-6">
              <Clock className="w-8 h-8 text-navy-500" />
            </div>
            <h3 className="font-heading text-xl text-charcoal mb-3">
              Uskoro dostupno
            </h3>
            <p className="text-charcoal-500">
              Ova lekcija će biti dostupna{' '}
              <span className="font-medium text-charcoal">
                {availableDate || 'uskoro'}
              </span>
              .
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentGate;
