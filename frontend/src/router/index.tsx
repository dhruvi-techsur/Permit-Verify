import React, { useEffect } from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth.store';
import { ProtectedRoute } from './ProtectedRoute';
import { RoleRoute } from './RoleRoute';
import { AppShell } from '../layout/AppShell';
import LoginPage from '../auth/LoginPage';
import RegisterPage from '../auth/RegisterPage';
import ForgotPasswordPage from '../auth/ForgotPasswordPage';
import ResetPasswordPage from '../auth/ResetPasswordPage';
import { DashboardPage } from '../pages/DashboardPage';

// Lazy load future-phase pages as placeholders
const router = createBrowserRouter([
  // Public routes (unauthenticated)
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },
  { path: '/forgot-password', element: <ForgotPasswordPage /> },
  { path: '/reset-password', element: <ResetPasswordPage /> },

  // Protected routes (requires auth)
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppShell />,
        children: [
          // Applicant routes
          { path: '/dashboard', element: <DashboardPage /> },

          // Reviewer-only routes (Phase 3)
          {
            element: <RoleRoute allowedRoles={['reviewer', 'admin']} />,
            children: [
              { path: '/review/queue', element: <DashboardPage /> }, // placeholder
            ],
          },

          // Admin-only routes (Phase 5)
          {
            element: <RoleRoute allowedRoles={['admin']} />,
            children: [
              { path: '/admin/dashboard', element: <DashboardPage /> }, // placeholder
              { path: '/admin/applications', element: <DashboardPage /> }, // placeholder
              { path: '/admin/users', element: <DashboardPage /> }, // placeholder
              { path: '/admin/audit-log', element: <DashboardPage /> }, // placeholder
            ],
          },
        ],
      },
    ],
  },

  // Default redirect
  { path: '/', element: <Navigate to="/login" replace /> },
  { path: '*', element: <Navigate to="/login" replace /> },
]);

export function Router() {
  const initialize = useAuthStore((s) => s.initialize);

  useEffect(() => {
    initialize();
  }, [initialize]);

  return <RouterProvider router={router} />;
}
