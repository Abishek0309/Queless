import { useState, useEffect, useCallback } from 'react';
import { LiveTicketState } from '@/core/types';
import { apiClient } from '@/core/api/client';
import { soundEffects } from '@/core/utils/audio';
import confetti from 'canvas-confetti';

export function useLiveTicketViewModel() {
  const [ticket, setTicket] = useState<LiveTicketState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasNotifiedCalled, setHasNotifiedCalled] = useState(false);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);

  const fetchTicket = useCallback(async () => {
    try {
      const data = await apiClient.getLiveTicket();
      setTicket(data);

      // Trigger celebration on CALLED
      if ((data.status === 'CALLED' || data.alert_state === 'CALLED_NOW') && !hasNotifiedCalled) {
        setHasNotifiedCalled(true);
        soundEffects.playCalledChime();
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
    } finally {
      setIsLoading(false);
    }
  }, [hasNotifiedCalled]);

  useEffect(() => {
    fetchTicket();
    const unsubscribe = apiClient.subscribe(fetchTicket);
    return () => unsubscribe();
  }, [fetchTicket]);

  const handleLeaveQueue = async () => {
    if (!ticket) return;
    await apiClient.leaveQueue(ticket.id);
    setShowLeaveConfirm(false);
    await fetchTicket();
  };

  const handleTestSound = () => {
    soundEffects.playCalledChime();
  };

  return {
    ticket,
    isLoading,
    showLeaveConfirm,
    setShowLeaveConfirm,
    handleLeaveQueue,
    handleTestSound,
  };
}
