import React from 'react';
import { useLiveTicketViewModel } from '../viewmodels/useLiveTicketViewModel';
import { Badge } from '@/shared/components/Badge';
import { Button } from '@/shared/components/Button';
import { Modal } from '@/shared/components/Modal';
import { Skeleton } from '@/shared/components/Skeleton';
import { formatWaitTime } from '@/core/utils/time';
import {
  Users,
  Clock,
  Volume2,
  ArrowLeft,
  AlertCircle,
  BellRing,
  CheckCircle2,
  Zap,
  Ticket as TicketIcon
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const LiveTicketView: React.FC = () => {
  const vm = useLiveTicketViewModel();

  if (vm.isLoading) {
    return (
      <div className="min-h-screen bg-surface px-4 py-6 sm:py-10 max-w-md mx-auto space-y-5">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-28 rounded-xl" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
        <div className="space-y-2 text-center pt-2">
          <Skeleton className="h-3 w-32 mx-auto rounded" />
          <Skeleton className="h-7 w-48 mx-auto rounded-xl" />
          <Skeleton className="h-3 w-36 mx-auto rounded" />
        </div>
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 space-y-5 text-center shadow-subtle">
          <Skeleton className="h-6 w-44 mx-auto rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-3 w-28 mx-auto rounded" />
            <Skeleton className="h-16 w-36 mx-auto rounded-2xl" />
            <Skeleton className="h-4 w-28 mx-auto rounded" />
          </div>
          <div className="grid grid-cols-2 gap-3 pt-2">
            <Skeleton className="h-20 rounded-2xl" />
            <Skeleton className="h-20 rounded-2xl" />
          </div>
          <Skeleton className="h-3 w-full rounded-full" />
          <Skeleton className="h-8 w-24 mx-auto rounded-full" />
        </div>
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

  // Dynamic color palette based on queue size (Item 2)
  const isTop20 = ticket.people_ahead <= 20;
  const isModerate = ticket.people_ahead > 20 && ticket.people_ahead <= 50;

  // Visual style tokens based on queue size
  const queueTheme = isCalled
    ? {
        accentText: 'text-emerald-600',
        cardBorder: 'border-emerald-300 ring-4 ring-emerald-500/10 shadow-glow-emerald',
        badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        progressBar: 'bg-emerald-500',
        statusPill: '⚡ IT\'S YOUR TURN!',
        pillIcon: BellRing,
      }
    : isTop20
    ? {
        accentText: 'text-emerald-600',
        cardBorder: 'border-emerald-200 shadow-sm hover:border-emerald-300',
        badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        progressBar: 'bg-gradient-to-r from-emerald-400 to-emerald-600',
        statusPill: '🟢 Top 20 in Line • Fast Moving Queue',
        pillIcon: Zap,
      }
    : isModerate
    ? {
        accentText: 'text-amber-600',
        cardBorder: 'border-amber-200 shadow-sm hover:border-amber-300',
        badgeBg: 'bg-amber-50 text-amber-900 border-amber-200',
        progressBar: 'bg-gradient-to-r from-amber-400 to-amber-600',
        statusPill: '🟡 Moderate Queue (20–50 ahead)',
        pillIcon: Clock,
      }
    : {
        accentText: 'text-indigo-600',
        cardBorder: 'border-indigo-200 shadow-sm hover:border-indigo-300',
        badgeBg: 'bg-indigo-50 text-indigo-800 border-indigo-200',
        progressBar: 'bg-gradient-to-r from-indigo-500 to-primary',
        statusPill: '🟣 High Volume Queue (50+ ahead)',
        pillIcon: Users,
      };

  const StatusIcon = queueTheme.pillIcon;

  return (
    <div className="min-h-screen bg-surface px-4 py-6 sm:py-10 max-w-md mx-auto space-y-5">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white px-3 py-1.5 rounded-xl border border-slate-200/80 shadow-subtle transition"
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
            <BellRing className="w-5 h-5 text-yellow-200" />
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

      {/* Hero Ticket Card with Dynamic Queue Color Theme */}
      <div className={`relative bg-white rounded-3xl border ${queueTheme.cardBorder} p-6 space-y-6 text-center overflow-hidden transition-all duration-300`}>
        {/* Dynamic Queue Tier Pill */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${queueTheme.badgeBg}">
          <StatusIcon className="w-3.5 h-3.5" />
          <span>{queueTheme.statusPill}</span>
        </div>

        <div className="space-y-1">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Your Queue Number</p>
          <div className={`font-display font-extrabold text-6xl tabular-nums tracking-tight ${queueTheme.accentText}`}>
            {ticket.ticket_code}
          </div>
          <p className="text-xs font-semibold text-slate-700">{ticket.customer_name}</p>
          {ticket.service_type && (
            <span className="inline-block text-[11px] font-medium text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full mt-1">
              {ticket.service_type}
            </span>
          )}
        </div>

        {/* 2-Column Sub Stats Grid */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="bg-slate-50/90 p-3.5 rounded-2xl border border-slate-100 text-center">
            <p className="text-[10px] text-slate-400 font-bold uppercase flex items-center justify-center gap-1 mb-1">
              <Users className="w-3 h-3 text-slate-400" />
              <span>People Ahead</span>
            </p>
            <p className={`font-display font-extrabold text-2xl tabular-nums ${queueTheme.accentText}`}>
              {isCalled ? '0' : ticket.people_ahead}
            </p>
          </div>

          <div className="bg-slate-50/90 p-3.5 rounded-2xl border border-slate-100 text-center">
            <p className="text-[10px] text-slate-400 font-bold uppercase flex items-center justify-center gap-1 mb-1">
              <Clock className="w-3 h-3 text-slate-400" />
              <span>Est. Waiting</span>
            </p>
            {/* Formatted in HH:MM pattern once >= 60 min */}
            <p className={`font-display font-extrabold text-2xl tabular-nums ${queueTheme.accentText}`}>
              {isCalled ? 'Now' : formatWaitTime(ticket.estimated_wait_minutes)}
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
            <span className="text-slate-800 font-bold">You ({ticket.ticket_code})</span>
          </div>

          <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden p-0.5">
            <div
              className={`h-full rounded-full transition-all duration-700 ${queueTheme.progressBar}`}
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
