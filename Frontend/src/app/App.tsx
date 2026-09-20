import React from 'react';
import { BrowserRouter, useLocation } from 'react-router-dom';
import { Navbar } from '@/shared/components/Navbar';
import { AppRoutes } from './routes';

const AppLayout: React.FC = () => {
  const location = useLocation();
  const isTVKiosk = location.pathname === '/tv-display';

  return (
    <div className="min-h-screen flex flex-col bg-surface text-on-surface">
      {!isTVKiosk && <Navbar />}
      <main className="flex-1">
        <AppRoutes />
      </main>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
};
