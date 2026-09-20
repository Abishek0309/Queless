/**
 * Storage helpers for persisting 1-click guest ticket IDs and sessions
 */

const GUEST_TICKET_KEY = 'queueless_active_ticket';
const GUEST_ID_KEY = 'queueless_guest_uuid';

export const storage = {
  getActiveTicketId(): string | null {
    return localStorage.getItem(GUEST_TICKET_KEY);
  },

  setActiveTicketId(ticketId: string) {
    localStorage.setItem(GUEST_TICKET_KEY, ticketId);
  },

  clearActiveTicketId() {
    localStorage.removeItem(GUEST_TICKET_KEY);
  },

  getOrCreateGuestUUID(): string {
    let uuid = localStorage.getItem(GUEST_ID_KEY);
    if (!uuid) {
      uuid = 'guest_' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
      localStorage.setItem(GUEST_ID_KEY, uuid);
    }
    return uuid;
  },
};
