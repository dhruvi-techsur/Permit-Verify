import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  showPasswordToggle?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ error, showPasswordToggle, type, className = '', ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    const inputType = showPasswordToggle
      ? showPassword ? 'text' : 'password'
      : type;

    return (
      <div className="relative flex items-center">
        <input
          ref={ref}
          type={inputType}
          className={[
            // Base styles from UX-Mockup Form Input pattern
            'w-full h-10 px-3 rounded-sm text-body text-text-primary bg-surface-subtle border',
            'placeholder:text-text-tertiary',
            'transition-colors duration-hover',
            // Error state
            error
              ? 'border-border-error focus-visible:ring-0'
              : 'border-surface-muted focus-visible:ring-2 focus-visible:ring-border-focus focus-visible:border-transparent',
            // Disabled state
            'disabled:bg-surface-subtle disabled:text-text-disabled disabled:cursor-not-allowed',
            // Focus styles
            'outline-none',
            showPasswordToggle ? 'pr-10' : '',
            className,
          ]
            .filter(Boolean)
            .join(' ')}
          {...props}
        />
        {showPasswordToggle && (
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            // 44×44px touch target per UX-Mockup Screen-00 interaction notes
            className="absolute right-0 h-10 w-10 flex items-center justify-center text-text-tertiary hover:text-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus rounded-sm"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';
