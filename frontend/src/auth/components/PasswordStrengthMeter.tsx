import React, { useMemo } from 'react';

interface PasswordStrengthMeterProps {
  password: string;
}

function getStrength(password: string): { score: number; label: string; colorClass: string } {
  if (!password) return { score: 0, label: '', colorClass: '' };

  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  const levels = [
    { score: 1, label: 'Weak', colorClass: 'text-feedback-error' },
    { score: 2, label: 'Fair', colorClass: 'text-orange-500' },
    { score: 3, label: 'Good', colorClass: 'text-amber-500' },
    { score: 4, label: 'Strong', colorClass: 'text-feedback-success' },
    { score: 5, label: 'Secure', colorClass: 'text-feedback-success' },
  ];

  return levels[Math.min(score, 5) - 1] || { score: 0, label: '', colorClass: '' };
}

export function PasswordStrengthMeter({ password }: PasswordStrengthMeterProps) {
  const strength = useMemo(() => getStrength(password), [password]);

  if (!password) return null;

  return (
    <div className="flex items-center gap-sm mt-xs" aria-live="polite">
      {/* 5 dots from Screen-01 spec */}
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((dot) => (
          <span
            key={dot}
            className={[
              'h-2 w-2 rounded-full',
              dot <= strength.score ? strength.colorClass.replace('text-', 'bg-') : 'bg-surface-muted',
            ].join(' ')}
          />
        ))}
      </div>
      <span className={['text-body-sm', strength.colorClass].join(' ')}>
        {strength.label}
      </span>
    </div>
  );
}
