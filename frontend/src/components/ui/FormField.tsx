import React from 'react';

interface FormFieldProps {
  label: string;
  htmlFor: string;
  error?: string;
  helper?: string;
  required?: boolean;
  children: React.ReactNode;
}

export function FormField({ label, htmlFor, error, helper, required, children }: FormFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-label font-medium text-text-secondary">
        {label}
        {required && <span className="text-feedback-error ml-1" aria-hidden>*</span>}
      </label>
      {children}
      {error && (
        <p className="text-body-sm text-feedback-error flex items-center gap-1" role="alert">
          <span aria-hidden>✗</span> {error}
        </p>
      )}
      {!error && helper && (
        <p className="text-body-sm text-text-tertiary">{helper}</p>
      )}
    </div>
  );
}
