import React from 'react';

type AlertVariant = 'error' | 'success' | 'warning' | 'info';

interface AlertProps {
  variant: AlertVariant;
  children: React.ReactNode;
  className?: string;
}

const alertStyles: Record<AlertVariant, string> = {
  error: 'bg-feedback-error-bg border-l-4 border-feedback-error text-feedback-error',
  success: 'bg-feedback-success-bg border-l-4 border-feedback-success text-feedback-success',
  warning: 'bg-feedback-warning-bg border-l-4 border-feedback-warning text-feedback-warning',
  info: 'bg-brand-primary-light border-l-4 border-brand-primary text-brand-primary',
};

const alertIcons: Record<AlertVariant, string> = {
  error: '✗',
  success: '✓',
  warning: '⚠',
  info: 'ℹ',
};

export function Alert({ variant, children, className = '' }: AlertProps) {
  return (
    <div
      role="alert"
      className={['rounded-md p-4 flex items-start gap-3', alertStyles[variant], className].join(' ')}
    >
      <span className="flex-shrink-0 font-bold" aria-hidden>
        {alertIcons[variant]}
      </span>
      <div className="text-body">{children}</div>
    </div>
  );
}
