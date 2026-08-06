import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FileText, Plus, Users, List, ClipboardList, Settings, LogOut } from 'lucide-react';
import { useAuthStore } from '../store/auth.store';

interface NavItem {
  to: string;
  label: string;
  icon: React.ReactNode;
  roles?: ('applicant' | 'reviewer' | 'admin')[];
}

const navItems: NavItem[] = [
  // All roles
  { to: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="h-4 w-4" /> },
  // Applicant
  { to: '/applications', label: 'My Applications', icon: <FileText className="h-4 w-4" />, roles: ['applicant'] },
  { to: '/applications/new', label: 'New Permit', icon: <Plus className="h-4 w-4" />, roles: ['applicant'] },
  // Reviewer
  { to: '/review/queue', label: 'Review Queue', icon: <List className="h-4 w-4" />, roles: ['reviewer'] },
  // Admin
  { to: '/admin/applications', label: 'All Applications', icon: <ClipboardList className="h-4 w-4" />, roles: ['admin'] },
  { to: '/admin/users', label: 'User Management', icon: <Users className="h-4 w-4" />, roles: ['admin'] },
  { to: '/admin/audit-log', label: 'Audit Log', icon: <List className="h-4 w-4" />, roles: ['admin'] },
];

function getRoleLabel(role: string): string {
  const labels: Record<string, string> = {
    applicant: 'Applicant',
    reviewer: 'Reviewer',
    admin: 'Admin',
  };
  return labels[role] || role;
}

function getInitials(fullName: string): string {
  return fullName
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export function Sidebar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const visibleItems = navItems.filter(
    (item) => !item.roles || (user && item.roles.includes(user.role)),
  );

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    // Sidebar: 256px fixed left, from UX-Mockup Application Shell Layout
    <aside className="w-sidebar flex-shrink-0 h-screen bg-surface-subtle border-r border-surface-border flex flex-col">
      {/* Logo */}
      <div className="px-lg py-xl flex items-center gap-sm">
        <span className="text-heading-md font-bold text-brand-primary">◈</span>
        <span className="text-heading-sm font-bold text-text-primary">PermitFlow</span>
      </div>

      <div className="border-t border-surface-border" />

      {/* Navigation */}
      <nav className="flex-1 px-sm py-md overflow-y-auto" aria-label="Main navigation">
        <ul className="flex flex-col gap-1">
          {visibleItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  [
                    'flex items-center gap-sm px-md py-sm rounded-md text-body font-medium transition-colors duration-hover',
                    isActive
                      ? 'bg-brand-primary-light text-brand-primary font-semibold border-l-2 border-brand-primary'
                      : 'text-text-secondary hover:bg-surface-border',
                  ].join(' ')
                }
              >
                {item.icon}
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* User section — bottom of sidebar per UX-Mockup */}
      <div className="border-t border-surface-border px-sm py-md flex flex-col gap-1">
        {user && (
          <div className="px-md py-sm flex items-center gap-sm">
            {/* Avatar with initials */}
            <div
              className="h-8 w-8 rounded-full bg-brand-primary flex items-center justify-center text-caption font-medium text-text-inverse flex-shrink-0"
              aria-hidden
            >
              {getInitials(user.fullName)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-body-sm font-medium text-text-primary truncate">{user.fullName}</p>
              <p className="text-caption text-text-tertiary">{getRoleLabel(user.role)}</p>
            </div>
          </div>
        )}

        {/* Settings link — /settings → Sidebar (UX-Mockup Navigation Map) */}
        <NavLink
          to="/settings"
          className="flex items-center gap-sm px-md py-sm rounded-md text-body font-medium text-text-secondary hover:bg-surface-border transition-colors duration-hover"
        >
          <Settings className="h-4 w-4" />
          Settings
        </NavLink>

        {/* Logout — AUTH-03: POST /auth/logout on click */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-sm px-md py-sm rounded-md text-body font-medium text-text-secondary hover:bg-surface-border transition-colors duration-hover w-full text-left"
        >
          <LogOut className="h-4 w-4" />
          Log out
        </button>
      </div>
    </aside>
  );
}
