import React from 'react';

interface AuthCardProps {
  children: React.ReactNode;
}

export function AuthCard({ children }: AuthCardProps) {
  return (
    <div className="min-h-screen bg-surface-page flex flex-col items-center justify-center px-lg">
      {/* Logo */}
      <div className="mb-xl flex items-center gap-2">
        <span className="text-heading-md font-bold text-brand-primary">◈</span>
        <span className="text-heading-md font-bold text-text-primary">PermitFlow</span>
      </div>

      {/* Card */}
      <div className="w-full max-w-md bg-surface-base rounded-lg shadow-md p-xl border border-surface-border">
        {children}
      </div>

      {/* Footer */}
      <p className="mt-xl text-caption text-text-tertiary">
        © {new Date().getFullYear()} City Permitting Office
      </p>
    </div>
  );
}
