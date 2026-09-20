import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Layers, Ticket, Tv, BarChart3, QrCode } from 'lucide-react';

export const Navbar: React.FC = () => {
  const location = useLocation();

  const links = [
    { to: '/', label: 'Explore Queues', icon: Layers },
    { to: '/ticket', label: 'Live Ticket', icon: Ticket, highlight: true },
    { to: '/workstation', label: 'Staff Workstation', icon: Layers },
    { to: '/tv-display', label: 'TV Kiosk', icon: Tv },
    { to: '/admin/qr', label: 'QR Poster', icon: QrCode },
    { to: '/analytics', label: 'Analytics', icon: BarChart3 },
  ];

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-200/60 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-indigo-500 flex items-center justify-center text-white shadow-glow-primary group-hover:scale-105 transition-transform">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-display font-extrabold text-xl tracking-tight text-slate-900">QueueLess</span>
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-live-dot" />
            </div>
            <p className="text-[10px] text-slate-500 font-medium tracking-wide uppercase">Virtual Queue Platform</p>
          </div>
        </Link>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200/60">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-white text-primary shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                } ${link.highlight && !isActive ? 'text-indigo-600' : ''}`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-primary' : 'text-slate-400'}`} />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Mobile Quick Action */}
        <div className="flex items-center gap-2">
          <Link
            to="/ticket"
            className="flex md:hidden items-center gap-1.5 px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-semibold shadow-sm"
          >
            <Ticket className="w-4 h-4" />
            <span>Ticket</span>
          </Link>
          <Link
            to="/workstation"
            className="hidden sm:inline-flex items-center justify-center px-4 py-2 bg-slate-900 text-white hover:bg-slate-800 rounded-xl text-xs font-semibold transition shadow-sm"
          >
            Staff Login
          </Link>
        </div>
      </div>
    </header>
  );
};
