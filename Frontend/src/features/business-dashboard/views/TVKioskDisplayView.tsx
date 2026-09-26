import React, { useState, useEffect } from 'react';
import { apiClient } from '@/core/api/client';
import { WorkstationState } from '@/core/types';
import { QRCodeSVG } from 'qrcode.react';
import { Skeleton } from '@/shared/components/Skeleton';
import {
  Users,
  Clock,
  Maximize2,
  Minimize2,
  Smartphone,
  Volume2,
  MapPin,
  CheckCircle2,
  Activity,
  ArrowRight
} from 'lucide-react';
import { soundEffects } from '@/core/utils/audio';

export const TVKioskDisplayView: React.FC = () => {
  const [workstation, setWorkstation] = useState<WorkstationState | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const data = await apiClient.getWorkstation('q1-dental-main');
      setWorkstation(data);
    };
    fetchData();
    const unsub = apiClient.subscribe(fetchData);
    return () => unsub();
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  if (!workstation) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between p-6 sm:p-10 font-sans">
        <header className="flex items-center justify-between pb-6 border-b border-slate-800">
          <div className="flex items-center gap-3.5">
            <Skeleton className="w-12 h-12 rounded-2xl bg-slate-800/80" />
            <div className="space-y-2">
              <Skeleton className="h-7 w-48 rounded-lg bg-slate-800/80" />
              <Skeleton className="h-4 w-64 rounded bg-slate-800/80" />
            </div>
          </div>
          <Skeleton className="h-10 w-28 rounded-2xl bg-slate-800/80" />
        </header>
        <main className="grid grid-cols-1 lg:grid-cols-12 gap-8 my-auto py-6">
          <div className="lg:col-span-7 bg-slate-900/80 rounded-3xl border border-slate-800 p-8 sm:p-10 space-y-6">
            <Skeleton className="h-6 w-36 rounded-full bg-slate-800/80" />
            <Skeleton className="h-28 w-44 mx-auto rounded-3xl bg-slate-800/80" />
            <Skeleton className="h-16 w-full rounded-2xl bg-slate-800/80" />
          </div>
          <div className="lg:col-span-5 bg-slate-900/80 rounded-3xl border border-slate-800 p-8 space-y-4">
            <Skeleton className="h-6 w-36 rounded-lg bg-slate-800/80" />
            <div className="space-y-3 pt-2">
              {[1, 2, 3, 4].map((n) => (
                <Skeleton key={n} className="h-16 rounded-2xl bg-slate-800/80" />
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  const activeTicket = workstation.active_ticket;
  const upcoming = workstation.waiting_tickets.slice(0, 4) || [];

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between p-6 sm:p-10 font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Header Bar */}
      <header className="flex items-center justify-between pb-6 border-b border-slate-800">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary to-indigo-500 flex items-center justify-center font-display font-black text-2xl shadow-glow-primary">
            Q
          </div>
          <div>
            <h1 className="font-display font-extrabold text-2xl tracking-tight">City Dental & Care</h1>
            <p className="text-xs text-slate-400 font-medium">Main Consultation Queue • Live TV Display</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="bg-slate-900/90 border border-slate-800 px-5 py-2 rounded-2xl font-mono font-bold text-xl text-indigo-400 tabular-nums shadow-inner">
            {currentTime}
          </div>
          <button
            onClick={() => soundEffects.playCalledChime()}
            title="Test Chime"
            className="p-3 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-2xl text-slate-300 transition hover:text-white"
          >
            <Volume2 className="w-5 h-5" />
          </button>
          <button
            onClick={toggleFullscreen}
            className="p-3 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-2xl text-slate-300 transition hover:text-white"
          >
            {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Main Kiosk Content (2-Columns) */}
      <main className="grid grid-cols-1 lg:grid-cols-12 gap-8 my-auto py-6">
        {/* Left 60%: NOW SERVING Box with Ambient Live Telemetry (Item 4) */}
        <div className="lg:col-span-7 bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/70 rounded-3xl border border-indigo-500/30 p-8 sm:p-10 shadow-2xl flex flex-col justify-between relative overflow-hidden space-y-6">
          <div className="absolute top-0 right-0 w-80 h-80 bg-primary/20 rounded-full blur-3xl pointer-events-none" />

          {/* Top Status & Audio Signal */}
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold tracking-wider uppercase">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              NOW SERVING
            </div>

            {/* Audio Signal Equalizer Wave */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-400">
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-[11px] font-medium text-slate-300">Live Station Active</span>
              <div className="flex items-end gap-0.5 h-4 ml-1">
                <span className="w-1 bg-emerald-400 rounded-full animate-equalizer-1" />
                <span className="w-1 bg-emerald-400 rounded-full animate-equalizer-2" />
                <span className="w-1 bg-emerald-400 rounded-full animate-equalizer-3" />
                <span className="w-1 bg-emerald-400 rounded-full animate-equalizer-4" />
              </div>
            </div>
          </div>

          {/* Hero Serving Number */}
          <div className="space-y-2">
            <div className="font-display font-black text-7xl sm:text-9xl text-white tracking-tighter tabular-nums text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-100 to-indigo-300">
              {activeTicket?.ticket_code || '---'}
            </div>
            <p className="font-display font-bold text-2xl sm:text-4xl text-slate-100">
              {activeTicket?.customer_name || 'Waiting for next customer...'}
            </p>
            <p className="text-sm sm:text-base text-indigo-300 font-medium">
              {activeTicket?.service_type || 'Station Ready'}
            </p>
          </div>

          {/* Ambient Visual Telemetry & Direction Card (Item 4: Fills Empty Space Elegantly) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
            <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-300 shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Room Waypoint</p>
                <p className="text-sm font-bold text-white">Room B • 1st Floor</p>
                <p className="text-[11px] text-slate-400">Consultation Wing</p>
              </div>
            </div>

            <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-300 shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Est. Duration</p>
                <p className="text-sm font-bold text-white">~12 to 15 mins</p>
                <p className="text-[11px] text-slate-400">Target consultation pace</p>
              </div>
            </div>
          </div>

          {/* Bottom Destination Banner */}
          <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Please Proceed To</p>
              <p className="font-display font-extrabold text-2xl text-emerald-400 flex items-center gap-2">
                <span>Counter 2 (Room B)</span>
                <ArrowRight className="w-5 h-5 text-emerald-400" />
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Status</p>
              <span className="text-xs font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-3 py-1 rounded-full inline-block mt-1">
                Active In Service
              </span>
            </div>
          </div>
        </div>

        {/* Right 40%: Upcoming Tickets List */}
        <div className="lg:col-span-5 bg-slate-900/80 rounded-3xl border border-slate-800 p-6 sm:p-8 flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
              <h2 className="font-display font-bold text-xl text-slate-200 flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-400" />
                <span>Next in Line</span>
              </h2>
              <span className="text-xs font-bold text-indigo-400 bg-indigo-950/80 border border-indigo-800 px-3 py-1 rounded-full">
                {upcoming.length} Upcoming
              </span>
            </div>

            {upcoming.length === 0 ? (
              <p className="text-sm text-slate-500 py-10 text-center">No other customers waiting in line.</p>
            ) : (
              <div className="space-y-3">
                {upcoming.map((item, idx) => (
                  <div
                    key={item.id}
                    className={`p-4 rounded-2xl border flex items-center justify-between transition ${
                      idx === 0
                        ? 'bg-indigo-900/40 border-indigo-500/50 text-white shadow-sm'
                        : 'bg-slate-950/50 border-slate-800/80 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center font-display font-black text-xl tabular-nums ${
                          idx === 0 ? 'bg-primary text-white shadow-glow-primary' : 'bg-slate-800 text-slate-200'
                        }`}
                      >
                        {item.ticket_code}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-base text-white">{item.customer_name}</p>
                          {idx === 0 && (
                            <span className="text-[10px] font-extrabold text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded-md border border-amber-800">
                              NEXT UP
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400">{item.service_type || 'General Consultation'}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-bold text-indigo-300 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>~{idx * 15 + 5}m</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Scan to Join QR Box */}
          <div className="pt-5 border-t border-slate-800 flex items-center gap-4 bg-slate-950/60 p-4 rounded-2xl border border-slate-800/60">
            <div className="bg-white p-2 rounded-xl shrink-0">
              <QRCodeSVG value="https://queueless.app/join/city-dental-care" size={70} />
            </div>
            <div>
              <p className="font-bold text-sm text-slate-100 flex items-center gap-1.5">
                <Smartphone className="w-4 h-4 text-emerald-400" />
                <span>Scan to Join on Mobile</span>
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                No app needed. Scan with your phone camera to track your spot.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Notice */}
      <footer className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
        <p>QueueLess Live Waiting Room Display System</p>
        <p className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-live-dot" />
          <span>Live WebSocket Connected</span>
        </p>
      </footer>
    </div>
  );
};
