import React from 'react';
import { Loader2 } from 'lucide-react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'icon';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  loading?: boolean;
  children?: React.ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  // From UX-Mockup Component Patterns — Button Variants
  primary: 'bg-brand-primary text-text-inverse hover:bg-brand-primary-hover active:bg-brand-primary-active shadow-sm font-medium',
  secondary: 'bg-surface-base border border-border-default text-text-secondary hover:bg-surface-subtle shadow-sm font-medium',
  ghost: 'bg-transparent text-brand-primary hover:bg-brand-primary-light font-medium',
  danger: 'bg-feedback-error text-text-inverse hover:bg-red-700 font-medium',
  icon: 'h-9 w-9 flex items-center justify-center bg-transparent hover:bg-surface-subtle text-text-secondary',
};

export function Button({
  variant = 'primary',
  loading = false,
  disabled,
  children,
  className = '',
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;
  return (
    <button
      disabled={isDisabled}
      className={[
        'inline-flex items-center justify-center gap-2 rounded-md text-body transition-colors duration-hover ease-smooth',
        variant !== 'icon' ? 'h-10 px-4' : '',
        variantClasses[variant],
        isDisabled ? 'opacity-50 cursor-not-allowed' : '',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus focus-visible:ring-offset-1',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
      {loading && variant !== 'icon' ? <span>{children}</span> : children}
    </button>
  );
}
