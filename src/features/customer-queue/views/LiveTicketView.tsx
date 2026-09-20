import React from 'react';
import { useLiveTicketViewModel } from '../viewmodels/useLiveTicketViewModel';
import { Badge } from '@/shared/components/Badge';
import { Button } from '@/shared/components/Button';
import { Modal } from '@/shared/components/Modal';
import { Users, Clock, Bell, Volume2, ArrowLeft, AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const LiveTicketView: React.FC = () => {
  const vm = useLiveTicketViewModel();

  if (vm.isLoading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!vm.ticket || vm.ticket.status === 'CANCELLED') {
    return (
      <div className="max-w-md mx-auto my-12 p-6 bg-white rounded-3xl border border-slate-200 text-center shadow-card space-y-4">
        <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
          <TicketIcon className="w-7 h-7" />
        </div>
        <h2 className="font-display font-bold text-xl text-slate-900">No Active Ticket Found</h2>
        <p className="text-xs text-slate-500 max-w-xs mx-auto">
          You are currently not in any virtual queue. Explore open businesses to get a ticket.
        </p>
        <Link to="/">
          <Button variant="primary" size="md" className="w-full mt-3 font-semibold">
            Browse Queues
          </Button>
        </Link>
      </div>
    );
  }

  const { ticket } = vm;
  const isCalled = ticket.status === 'CALLED' || ticket.alert_state === 'CALLED_NOW';
  const isAlmostReady = ticket.alert_state === 'ALMOST_READY' || ticket.people_ahead === 1;

  return (
    <div className="min-h-screen bg-surface px-4 py-6 sm:py-10 max-w-md mx-auto space-y-5">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white px-3 py-1.5 rounded-xl border border-slate-200/80 shadow-subtle"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Explore</span>
        </Link>
        <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-semibold border border-emerald-200/70">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-live-dot" />
          <span>Live Sync</span>
        </div>
      </div>

      {/* Business Info Header */}
      <div className="text-center space-y-1">
        <span className="text-[11px] font-bold text-indigo-600 tracking-wider uppercase">Virtual Queue Ticket</span>
        <h1 className="font-display font-bold text-2xl text-slate-900">{ticket.business_name}</h1>
        <p className="text-xs text-slate-500 font-medium">{ticket.queue_name}</p>
      </div>

      {/* Urgent Callout Alert Banner */}
      {isCalled ? (
        <div className="bg-emerald-500 text-white p-4 rounded-2xl shadow-elevated border border-emerald-400 animate-bounce-subtle space-y-2 text-center">
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5 text-yellow-200" />
            <span className="font-display font-extrabold text-base tracking-wide">IT'S YOUR TURN!</span>
          </div>
          <p className="text-xs text-emerald-50 font-medium">
            Please proceed immediately to <strong className="underline">{ticket.counter_or_station || 'Counter 2'}</strong>.
          </p>
        </div>
      ) : isAlmostReady ? (
        <div className="bg-amber-500 text-slate-950 p-3.5 rounded-2xl shadow-card border border-amber-400 space-y-1 text-center">
          <div className="flex items-center justify-center gap-1.5 font-bold text-xs uppercase tracking-wider">
            <AlertCircle className="w-4 h-4" />
            <span>Almost Ready — Next Up!</span>
          </div>
          <p className="text-[11px] font-medium opacity-90">
            Only 1 person ahead of you. Please make your way toward the counter.
          </p>
        </div>
      ) : null}

      {/* Hero Ticket Card */}
      <div className="relative bg-white rounded-3xl border border-slate-200/90 shadow-elevated p-6 space-y-6 text-center overflow-hidden">
        <div className="space-y-1">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Your Queue Number</p>
          <div className="font-display font-extrabold text-6xl text-slate-900 tabular-nums tracking-tight">
            {ticket.ticket_code}
          </div>
          <p className="text-xs font-semibold text-slate-600">{ticket.customer_name}</p>
          {ticket.service_type && (
            <span className="inline-block text-[11px] font-medium text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full">
              {ticket.service_type}
            </span>
          )}
        </div>

        {/* 2-Column Sub Stats Grid */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 text-center">
            <p className="text-[10px] text-slate-400 font-bold uppercase flex items-center justify-center gap-1 mb-1">
              <Users className="w-3 h-3 text-slate-400" />
              <span>People Ahead</span>
            </p>
            <p className="font-display font-extrabold text-2xl text-slate-800 tabular-nums">
              {isCalled ? '0' : ticket.people_ahead}
            </p>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 text-center">
            <p className="text-[10px] text-slate-400 font-bold uppercase flex items-center justify-center gap-1 mb-1">
              <Clock className="w-3 h-3 text-slate-400" />
              <span>Est. Waiting</span>
            </p>
            <p className="font-display font-extrabold text-2xl text-indigo-600 tabular-nums">
              {isCalled ? 'Now' : `~${ticket.estimated_wait_minutes}m`}
            </p>
          </div>
        </div>

        {/* Dynamic Serving vs You Progress Track */}
        <div className="space-y-2 pt-2 text-left">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-emerald-700 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Serving: {ticket.currently_serving || '#21'}
            </span>
            <span className="text-indigo-700 font-bold">You ({ticket.ticket_code})</span>
          </div>

          <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden p-0.5">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                isCalled
                  ? 'bg-emerald-500 w-full'
                  : isAlmostReady
                  ? 'bg-amber-500'
                  : 'bg-primary'
              }`}
              style={{ width: isCalled ? '100%' : `${ticket.progress_percent}%` }}
            />
          </div>
        </div>

        {/* Status Pill */}
        <div className="pt-2">
          <Badge status={ticket.status} size="lg" />
        </div>
      </div>

      {/* Audio test & notification buttons */}
      <div className="flex items-center justify-between gap-3 px-2">
        <button
          onClick={vm.handleTestSound}
          className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-white rounded-xl border border-slate-200/80 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-subtle"
        >
          <Volume2 className="w-3.5 h-3.5 text-indigo-600" />
          <span>Test Alert Chime</span>
        </button>

        <button
          onClick={() => vm.setShowLeaveConfirm(true)}
          className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-rose-600 hover:bg-rose-50 rounded-xl text-xs font-semibold transition"
        >
          <span>Leave Queue</span>
        </button>
      </div>

      {/* Leave Queue Confirmation Modal */}
      <Modal
        isOpen={vm.showLeaveConfirm}
        onClose={() => vm.setShowLeaveConfirm(false)}
        title="Leave Virtual Queue?"
      >
        <div className="space-y-4 text-center">
          <p className="text-sm text-slate-600">
            If you leave, your ticket <strong className="text-slate-900">{ticket.ticket_code}</strong> will be cancelled and you will lose your spot in line.
          </p>
          <div className="flex items-center justify-end gap-2 pt-2">
            <Button
              variant="outline"
              size="md"
              onClick={() => vm.setShowLeaveConfirm(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              size="md"
              onClick={vm.handleLeaveQueue}
            >
              Yes, Leave Queue
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

function TicketIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
      <path d="M13 5v2" />
      <path d="M13 17v2" />
      <path d="M13 11v2" />
    </svg>
  );
}
