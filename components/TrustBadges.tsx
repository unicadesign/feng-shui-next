import React from 'react';
import { Shield, Users, Award, Star } from 'lucide-react';

interface TrustBadgesProps {
  variant?: 'light' | 'dark';
  className?: string;
}

const TrustBadges: React.FC<TrustBadgesProps> = ({ variant = 'light', className = '' }) => {
  const textColor = variant === 'dark' ? 'text-cream-100' : 'text-charcoal-500';
  const iconColor = variant === 'dark' ? 'text-navy-300' : 'text-navy-500';

  const badges = [
    { icon: Shield, label: 'Sigurna transakcija' },
    { icon: Users, label: '1000+ projekata' },
    { icon: Award, label: 'Sertifikovani majstor' },
    { icon: Star, label: '25+ godina iskustva' },
  ];

  return (
    <div className={`flex flex-wrap items-center justify-center gap-6 md:gap-8 ${className}`}>
      {badges.map(({ icon: Icon, label }) => (
        <div key={label} className="flex items-center gap-2">
          <Icon size={14} className={iconColor} />
          <span className={`text-xs font-medium ${textColor}`}>{label}</span>
        </div>
      ))}
    </div>
  );
};

export default TrustBadges;
