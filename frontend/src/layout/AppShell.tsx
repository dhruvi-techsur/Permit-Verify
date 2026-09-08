import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export function AppShell() {
  return (
    // Full viewport layout: sidebar fixed left, content scrollable right
    <div className="flex h-screen overflow-hidden bg-surface-page">
      <Sidebar />

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />

        {/* Page content — max-w-content mx-auto per UX-Mockup */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-content mx-auto px-xl py-xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
