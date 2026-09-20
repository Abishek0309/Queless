import { useState, useEffect, useCallback, useRef } from 'react';
import { WorkstationState } from '@/core/types';
import { apiClient } from '@/core/api/client';
import { soundEffects } from '@/core/utils/audio';

export function useStaffWorkstationViewModel() {
  const [workstation, setWorkstation] = useState<WorkstationState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCallingNext, setIsCallingNext] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const timerRef = useRef<number | null>(null);

  const fetchWorkstation = useCallback(async () => {
    try {
      const data = await apiClient.getWorkstation('q1-dental-main');
      setWorkstation(data);
      if (data.active_ticket && data.active_ticket.called_at) {
        const diff = Math.floor((Date.now() - new Date(data.active_ticket.called_at).getTime()) / 1000);
        setElapsedSeconds(Math.max(0, diff));
      } else {
        setElapsedSeconds(0);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWorkstation();
    const unsubscribe = apiClient.subscribe(fetchWorkstation);
    return () => unsubscribe();
  }, [fetchWorkstation]);

  // Live timer for active customer
  useEffect(() => {
    if (workstation?.active_ticket) {
      timerRef.current = window.setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      setElapsedSeconds(0);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [workstation?.active_ticket]);

  const handleCallNext = async () => {
    if (!workstation) return;
    setIsCallingNext(true);
    try {
      await apiClient.callNextCustomer(workstation.queue.id);
      soundEffects.playCalledChime();
      await fetchWorkstation();
    } finally {
      setIsCallingNext(false);
    }
  };

  const handleCompleteCurrent = async () => {
    if (!workstation?.active_ticket) return;
    await apiClient.completeCurrentTicket(workstation.active_ticket.id);
    await fetchWorkstation();
  };

  const handleSkipCurrent = async () => {
    if (!workstation?.active_ticket) return;
    await apiClient.skipCurrentTicket(workstation.active_ticket.id);
    await fetchWorkstation();
  };

  const handleRecallAlert = () => {
    soundEffects.playCalledChime();
  };

  const handleTogglePause = async () => {
    if (!workstation) return;
    const nextStatus = workstation.queue.status === 'OPEN' ? 'PAUSED' : 'OPEN';
    await apiClient.toggleQueueStatus(workstation.queue.id, nextStatus);
    await fetchWorkstation();
  };

  return {
    workstation,
    isLoading,
    isCallingNext,
    elapsedSeconds,
    handleCallNext,
    handleCompleteCurrent,
    handleSkipCurrent,
    handleRecallAlert,
    handleTogglePause,
  };
}
