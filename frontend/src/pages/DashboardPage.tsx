import React from 'react';
import { useAuthStore } from '../store/auth.store';
import { Skeleton } from '../components/ui/Skeleton';

export function DashboardPage() {
  const user = useAuthStore((s) => s.user);

  if (!user) {
    // Skeleton screen while user loads (UX-03)
    return (
      <div className="flex flex-col gap-xl">
        <Skeleton variant="title" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
          <Skeleton variant="card" />
          <Skeleton variant="card" />
          <Skeleton variant="card" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-xl">
      <div>
        <h2 className="text-heading-xl font-bold text-text-primary">
          Welcome back, {user.fullName.split(' ')[0]}
        </h2>
        <p className="text-body text-text-tertiary mt-xs">
          {user.role === 'applicant' && 'Your permit applications and status updates'}
          {user.role === 'reviewer' && 'Applications awaiting your review'}
          {user.role === 'admin' && 'System overview and user management'}
        </p>
      </div>

      {/* Placeholder cards — replaced by Phase 4 dashboard implementation */}
      <div className="bg-surface-base rounded-lg shadow-card border border-surface-border p-xl text-center">
        <p className="text-body text-text-tertiary">
          Dashboard content coming in Phase 4.
        </p>
        <p className="text-body-sm text-text-disabled mt-xs">
          Auth is working! Role: <strong>{user.role}</strong>
        </p>
      </div>
    </div>
  );
}
