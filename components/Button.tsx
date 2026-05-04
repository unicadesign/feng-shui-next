import React from 'react';
import Link from 'next/link';

interface ButtonProps {
  children: React.ReactNode;
  to?: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  fullWidth?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  microcopy?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  to,
  onClick,
  variant = 'primary',
  size = 'md',
  className = '',
  type = 'button',
  fullWidth = false,
  disabled = false,
  icon,
  microcopy,
}) => {
  const baseStyles =
    'inline-flex items-center justify-center rounded-full font-heading font-semibold transition-all duration-300 ease-out-expo focus:outline-none focus-visible:ring-2 focus-visible:ring-navy-500 focus-visible:ring-offset-2 active:scale-[0.98] active:translate-y-[0.5px]';

  const variants = {
    primary:
      'bg-navy-500 text-white hover:bg-navy-600 active:bg-navy-700',
    secondary:
      'bg-gold-500 text-white hover:bg-gold-600 active:bg-gold-700',
    outline:
      'border-2 border-navy-500 text-navy-600 hover:bg-navy-50 active:bg-navy-100',
    ghost:
      'text-navy-600 hover:bg-navy-50 active:bg-navy-100',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-8 py-4 text-base',
  };

  const width = fullWidth ? 'w-full' : '';
  const disabledStyles = disabled
    ? 'opacity-50 cursor-not-allowed pointer-events-none'
    : '';

  const buttonClasses = `${baseStyles} ${variants[variant]} ${sizes[size]} ${width} ${disabledStyles} ${className}`;

  const content = (
    <>
      {children}
      {icon && (
        <span className="w-7 h-7 rounded-full bg-white/20 ml-2 flex items-center justify-center">
          {icon}
        </span>
      )}
    </>
  );

  const micro = microcopy ? (
    <p className="text-sm font-body font-normal text-charcoal-500 mt-1.5">{microcopy}</p>
  ) : null;

  if (to) {
    if (disabled) {
      return (
        <div className={fullWidth ? 'w-full' : 'inline-block'}>
          <span className={buttonClasses} aria-disabled="true">
            {content}
          </span>
          {micro}
        </div>
      );
    }
    return (
      <div className={fullWidth ? 'w-full' : 'inline-block'}>
        <Link href={to} className={buttonClasses}>
          {content}
        </Link>
        {micro}
      </div>
    );
  }

  return (
    <div className={fullWidth ? 'w-full' : 'inline-block'}>
      <button
        type={type}
        onClick={onClick}
        className={buttonClasses}
        disabled={disabled}
      >
        {content}
      </button>
      {micro}
    </div>
  );
};

export default Button;
