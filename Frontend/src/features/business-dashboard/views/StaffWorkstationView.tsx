import React from 'react';
import { useStaffWorkstationViewModel } from '../viewmodels/useStaffWorkstationViewModel';
import { Badge } from '@/shared/components/Badge';
import { Button } from '@/shared/components/Button';
import { formatSecondsToTimer, formatTimeString } from '@/core/utils/time';
import {
  Users,
  Clock,
  Play,
  Pause,
  Volume2,
  CheckCircle,
  SkipForward,
  UserCheck,
  Phone,
  Timer
} from 'lucide-react';

export const StaffWorkstationView: React.FC = () => {
  const vm = useStaffWorkstationViewModel();

  if (vm.isLoading || !vm.workstation) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const { workstation } = vm;
  const isPaused = workstation.queue.status === 'PAUSED';
  const hasActiveCustomer = Boolean(workstation.active_ticket);
  const nextUp = workstation.waiting_tickets[0];

  return (
    <div className="min-h-screen bg-surface px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto space-y-6">
      {/* Top Header & Queue Quick Switch */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-subtle">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display font-bold text-2xl text-slate-900">Staff Workstation</h1>
            <Badge status={workstation.queue.status} size="md" />
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Active Queue: <strong className="text-slate-800">{workstation.queue.name}</strong> • Station: <strong>Counter 2</strong>
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant={isPaused ? 'success' : 'secondary'}
            size="sm"
            onClick={vm.handleTogglePause}
            className="font-semibold"
          >
            {isPaused ? <Play className="w-4 h-4 mr-1.5" /> : <Pause className="w-4 h-4 mr-1.5" />}
            <span>{isPaused ? 'Resume Queue' : 'Pause Queue'}</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => (window.location.href = '/tv-display')}
            className="font-semibold"
          >
            <span>Open TV Screen</span>
          </Button>
        </div>
      </div>

      {/* Top KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-subtle flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Served Today</p>
            <p className="font-display font-bold text-2xl text-slate-900 mt-1">
              {workstation.today_stats.customers_served_today}
            </p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <UserCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-subtle flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Avg Wait Time</p>
            <p className="font-display font-bold text-2xl text-slate-900 mt-1">
              ~{workstation.today_stats.average_wait_minutes} mins
            </p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-subtle flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Waitlist</p>
            <p className="font-display font-bold text-2xl text-slate-900 mt-1">
              {workstation.waiting_tickets.length} people
            </p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Command Center: 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Active Customer Spotlight (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-elevated p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Current Station</span>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-live-dot" />
                Active Counter
              </span>
            </div>

            {hasActiveCustomer ? (
              <div className="space-y-6">
                <div className="text-center space-y-1">
                  <p className="text-xs font-semibold text-slate-400 uppercase">Now Serving</p>
                  <div className="font-display font-extrabold text-6xl text-slate-900 tabular-nums">
                    {workstation.active_ticket?.ticket_code}
                  </div>
                  <h3 className="font-bold text-lg text-slate-800">{workstation.active_ticket?.customer_name}</h3>
                  <p className="text-xs text-indigo-600 font-medium">{workstation.active_ticket?.service_type}</p>
                  {workstation.active_ticket?.phone && (
                    <p className="text-xs text-slate-400 flex items-center justify-center gap-1 mt-1">
                      <Phone className="w-3 h-3" />
                      <span>{workstation.active_ticket.phone}</span>
                    </p>
                  )}
                </div>

                {/* Service Timer */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Timer className="w-5 h-5 text-indigo-600 animate-spin-slow" />
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Service Time</p>
                      <p className="font-display font-extrabold text-xl text-slate-900 tabular-nums">
                        {formatSecondsToTimer(vm.elapsedSeconds)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={vm.handleRecallAlert}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition shadow-subtle"
                  >
                    <Volume2 className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Recall Chime</span>
                  </button>
                </div>

                {/* Active Controls */}
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="success"
                    size="lg"
                    onClick={vm.handleCompleteCurrent}
                    className="font-bold shadow-glow-emerald"
                  >
                    <CheckCircle className="w-5 h-5 mr-1.5" />
                    <span>Complete</span>
                  </Button>

                  <Button
                    variant="secondary"
                    size="lg"
                    onClick={vm.handleSkipCurrent}
                    className="font-bold text-orange-700 hover:bg-orange-50 border-orange-200"
                  >
                    <SkipForward className="w-5 h-5 mr-1.5" />
                    <span>Hold / Skip</span>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-10 space-y-3">
                <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-base">Station is Idle</h3>
                  <p className="text-xs text-slate-500">Call the next waiting customer to begin service.</p>
                </div>
              </div>
            )}

            {/* Huge CALL NEXT CUSTOMER Button */}
            <div className="pt-2 border-t border-slate-100">
              <Button
                variant="primary"
                size="xl"
                className="w-full font-extrabold text-base shadow-glow-primary tracking-wide"
                disabled={isPaused || workstation.waiting_tickets.length === 0}
                isLoading={vm.isCallingNext}
                onClick={vm.handleCallNext}
              >
                <Play className="w-5 h-5 mr-2 fill-current" />
                <span>
                  {nextUp ? `CALL NEXT: ${nextUp.ticket_code} (${nextUp.customer_name})` : 'NO CUSTOMERS IN QUEUE'}
                </span>
              </Button>
            </div>
          </div>
        </div>

        {/* Right Column: Live Waiting Table (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/90 shadow-subtle p-6 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-display font-bold text-lg text-slate-900">Live Waiting List</h3>
                <p className="text-xs text-slate-500">Ordered by arrival time</p>
              </div>
              <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full">
                {workstation.waiting_tickets.length} in Line
              </span>
            </div>

            {/* List */}
            {workstation.waiting_tickets.length === 0 ? (
              <div className="text-center py-16 space-y-2">
                <p className="text-sm font-semibold text-slate-500">No customers currently waiting.</p>
                <p className="text-xs text-slate-400">New arrivals will show up here in real time.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 mt-2">
                {workstation.waiting_tickets.map((t, idx) => (
                  <div
                    key={t.id}
                    className={`py-3.5 px-3 flex items-center justify-between rounded-xl transition ${
                      idx === 0 ? 'bg-indigo-50/50 border border-indigo-100/60' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center font-display font-extrabold text-sm tabular-nums ${
                          idx === 0 ? 'bg-primary text-white shadow-sm' : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {t.ticket_code}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-sm text-slate-900">{t.customer_name}</p>
                          {idx === 0 && (
                            <span className="text-[10px] font-bold text-indigo-700 bg-indigo-100/80 px-2 py-0.5 rounded-md">
                              NEXT
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500">{t.service_type || 'General Consultation'}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-xs font-semibold text-slate-700 flex items-center justify-end gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>~{idx * 15 + 5}m wait</span>
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">{formatTimeString(t.joined_at)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Skipped / On Hold Customers footer section */}
          {workstation.skipped_tickets.length > 0 && (
            <div className="pt-4 border-t border-slate-100">
              <p className="text-xs font-bold text-slate-400 uppercase mb-2">On Hold / Skipped (Grace Window)</p>
              <div className="space-y-1.5">
                {workstation.skipped_tickets.map((st) => (
                  <div
                    key={st.id}
                    className="p-2.5 bg-orange-50/60 border border-orange-100 rounded-xl flex items-center justify-between text-xs"
                  >
                    <span className="font-bold text-orange-900">{st.ticket_code} — {st.customer_name}</span>
                    <button
                      onClick={vm.handleCallNext}
                      className="text-[11px] font-semibold text-orange-700 hover:text-orange-900 bg-white px-2.5 py-1 rounded-lg border border-orange-200 shadow-subtle"
                    >
                      Recall Now
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
