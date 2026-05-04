import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  linkTo: string;
  buttonText?: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  icon,
  title,
  description,
  linkTo,
  buttonText,
}) => {
  return (
    <div className="rounded-2xl bg-cream-100 p-1.5 shadow-card hover:shadow-card-hover transition-all duration-500 ease-out-expo h-full">
      <div className="rounded-xl bg-cream-50 p-6 md:p-8 h-full flex flex-col">
        <div className="w-12 h-12 rounded-xl bg-navy-50 flex items-center justify-center text-navy-500 mb-5">
          {icon}
        </div>

        <h3 className="text-lg font-heading font-semibold text-charcoal mb-3">
          {title}
        </h3>

        <p className="text-sm text-charcoal-500 leading-relaxed flex-grow">
          {description}
        </p>

        <Link
          href={linkTo}
          className="text-navy-500 font-heading font-medium text-sm inline-flex items-center gap-1.5 mt-5 hover:gap-2.5 transition-all duration-300 ease-out-expo"
        >
          {buttonText || 'Saznajte Više'}
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
};

export default ServiceCard;
