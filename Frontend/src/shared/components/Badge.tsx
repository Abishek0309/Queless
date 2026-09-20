import React from 'react';
import { TicketStatus, QueueStatus } from '@/core/types';

interface BadgeProps {
  status: TicketStatus | QueueStatus | string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Badge: React.FC<BadgeProps> = ({ status, className = '', size = 'md' }) => {
  let colorStyles = 'bg-surface-container-high text-on-surface';
  let dotColor = 'bg-outline';

  switch (status) {
    case 'OPEN':
    case 'SERVING':
    case 'COMPLETED':
      colorStyles = 'bg-emerald-50 text-emerald-800 border border-emerald-200/80';
      dotColor = 'bg-emerald-500';
      break;
    case 'CALLED':
      colorStyles = 'bg-indigo-50 text-indigo-800 border border-indigo-200/80 animate-pulse';
      dotColor = 'bg-indigo-600 animate-ping';
      break;
    case 'WAITING':
    case 'ALMOST_READY':
      colorStyles = 'bg-amber-50 text-amber-900 border border-amber-200/80';
      dotColor = 'bg-amber-500';
      break;
    case 'PAUSED':
    case 'SKIPPED':
      colorStyles = 'bg-orange-50 text-orange-800 border border-orange-200/80';
      dotColor = 'bg-orange-500';
      break;
    case 'CLOSED':
    case 'CANCELLED':
    case 'EXPIRED':
      colorStyles = 'bg-rose-50 text-rose-800 border border-rose-200/80';
      dotColor = 'bg-rose-500';
      break;
  }

  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3.5 py-1.5 font-semibold',
  }[size];

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full ${sizeStyles} ${colorStyles} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
      {status}
    </span>
  );
};
