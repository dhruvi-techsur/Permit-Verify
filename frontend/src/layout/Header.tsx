import React, { useState } from 'react';
import { Bell, ChevronDown, Settings, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth.store';

interface HeaderProps {
  title?: string;
}

function getInitials(fullName: string): string {
  return fullName
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export function Header({ title = 'Dashboard' }: HeaderProps) {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    // Header: full width, h-16, sticky top-0 z-30 — from UX-Mockup Application Shell
    <header className="h-header bg-surface-base border-b border-surface-border px-xl flex items-center justify-between sticky top-0 z-30">
      {/* Page title */}
      <h1 className="text-heading-md font-semibold text-text-primary">{title}</h1>

      <div className="flex items-center gap-md">
        {/* Notification bell — Phase 3 feature, placeholder for now */}
        <button
          className="relative h-9 w-9 flex items-center justify-center rounded-md text-text-secondary hover:bg-surface-subtle transition-colors"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
        </button>

        {/* Avatar menu — from UX-Mockup Header Detail */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="flex items-center gap-sm rounded-md px-sm py-xs hover:bg-surface-subtle transition-colors"
            aria-label="User menu"
            aria-expanded={menuOpen}
          >
            <div className="h-8 w-8 rounded-full bg-brand-primary flex items-center justify-center text-caption font-medium text-text-inverse">
              {user ? getInitials(user.fullName) : '?'}
            </div>
            <ChevronDown className="h-4 w-4 text-text-tertiary" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-full mt-xs w-48 bg-surface-base rounded-lg shadow-md border border-surface-border py-xs z-50">
              {user && (
                <div className="px-md py-sm border-b border-surface-border mb-xs">
                  <p className="text-body-sm font-medium text-text-primary">{user.fullName}</p>
                  <p className="text-caption text-text-tertiary capitalize">{user.role}</p>
                </div>
              )}
              <button
                onClick={() => { navigate('/settings'); setMenuOpen(false); }}
                className="w-full flex items-center gap-sm px-md py-sm text-body text-text-secondary hover:bg-surface-subtle transition-colors"
              >
                <Settings className="h-4 w-4" />
                Settings
              </button>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-sm px-md py-sm text-body text-text-secondary hover:bg-surface-subtle transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
