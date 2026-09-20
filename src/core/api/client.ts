import {
  ApiResponse,
  BusinessSummary,
  BusinessDetail,
  LiveTicketState,
  WorkstationState,
  AnalyticsReport,
  Ticket
} from '../types';
import {
  MOCK_BUSINESSES,
  MOCK_BUSINESS_DETAILS,
  MOCK_LIVE_TICKET,
  MOCK_WORKSTATION,
  MOCK_ANALYTICS
} from './mockData';
import { soundEffects } from '../utils/audio';

// State management for in-memory live simulation
let liveWorkstation = { ...MOCK_WORKSTATION };
let liveTicket = { ...MOCK_LIVE_TICKET };
let listeners: Array<() => void> = [];

function notifySubscribers() {
  listeners.forEach((fn) => fn());
}

/**
 * Standard Envelope Helper
 */
export function createApiResponse<T>(content: T, message: string = 'Operation successful', status: string = 'success'): ApiResponse<T> {
  return {
    status,
    message,
    content,
  };
}

export const apiClient = {
  subscribe(fn: () => void) {
    listeners.push(fn);
    return () => {
      listeners = listeners.filter((l) => l !== fn);
    };
  },

  /**
   * Helper to execute requests and unwrap standard { status, message, content } response envelope
   */
  async handleResponse<T>(promise: Promise<ApiResponse<T>>): Promise<T> {
    const response = await promise;
    if (response.status === 'error') {
      throw new Error(response.message || 'API request failed');
    }
    return response.content;
  },

  // ============================================================
  // BUSINESSES
  // ============================================================
  async getBusinessesEnvelope(query?: string, category?: string): Promise<ApiResponse<BusinessSummary[]>> {
    await new Promise((r) => setTimeout(r, 150));
    let list = [...MOCK_BUSINESSES];
    if (category && category !== 'All') {
      list = list.filter((b) => b.category === category);
    }
    if (query) {
      const q = query.toLowerCase();
      list = list.filter((b) => b.name.toLowerCase().includes(q) || b.address.toLowerCase().includes(q));
    }
    return createApiResponse(list, 'Businesses retrieved successfully');
  },

  async getBusinesses(query?: string, category?: string): Promise<BusinessSummary[]> {
    return (await this.getBusinessesEnvelope(query, category)).content;
  },

  async getBusinessBySlugEnvelope(slug: string): Promise<ApiResponse<BusinessDetail>> {
    await new Promise((r) => setTimeout(r, 150));
    const detail = MOCK_BUSINESS_DETAILS[slug] || {
      ...MOCK_BUSINESSES[0],
      slug,
      active_queues: MOCK_BUSINESS_DETAILS['city-dental-care'].active_queues,
    };
    return createApiResponse(detail, 'Business details retrieved successfully');
  },

  async getBusinessBySlug(slug: string): Promise<BusinessDetail> {
    return (await this.getBusinessBySlugEnvelope(slug)).content;
  },

  // ============================================================
  // CUSTOMER TICKETS
  // ============================================================
  async joinQueueEnvelope(queueId: string, customerName: string, phone?: string, serviceType?: string): Promise<ApiResponse<LiveTicketState>> {
    await new Promise((r) => setTimeout(r, 300));
    const newNumber = liveWorkstation.waiting_tickets.length > 0 
      ? liveWorkstation.waiting_tickets[liveWorkstation.waiting_tickets.length - 1].ticket_number + 1
      : 30;

    const newTicket: Ticket = {
      id: `ticket_${newNumber}`,
      queue_id: queueId,
      ticket_number: newNumber,
      ticket_code: `#${newNumber}`,
      customer_name: customerName,
      phone: phone || undefined,
      service_type: serviceType || 'General Consultation',
      status: 'WAITING',
      joined_at: new Date().toISOString(),
    };

    liveWorkstation.waiting_tickets.push(newTicket);
    liveWorkstation.today_stats.active_waitlist_count = liveWorkstation.waiting_tickets.length;

    liveTicket = {
      ...newTicket,
      business_name: 'City Dental & Care',
      queue_name: 'General Consultation & Cleaning',
      currently_serving: liveWorkstation.active_ticket?.ticket_code || '#21',
      people_ahead: liveWorkstation.waiting_tickets.length - 1,
      estimated_wait_minutes: Math.max(5, (liveWorkstation.waiting_tickets.length - 1) * 15),
      progress_percent: 10,
      alert_state: 'NORMAL',
      counter_or_station: 'Counter 2',
    };

    soundEffects.playSuccessChime();
    notifySubscribers();
    return createApiResponse(liveTicket, 'Queue joined successfully! Ticket generated.');
  },

  async joinQueue(queueId: string, customerName: string, phone?: string, serviceType?: string): Promise<LiveTicketState> {
    return (await this.joinQueueEnvelope(queueId, customerName, phone, serviceType)).content;
  },

  async getLiveTicketEnvelope(ticketId?: string): Promise<ApiResponse<LiveTicketState>> {
    await new Promise((r) => setTimeout(r, 100));
    return createApiResponse({ ...liveTicket }, 'Live ticket state fetched');
  },

  async getLiveTicket(ticketId?: string): Promise<LiveTicketState> {
    return (await this.getLiveTicketEnvelope(ticketId)).content;
  },

  async leaveQueueEnvelope(ticketId: string): Promise<ApiResponse<{ cancelled: boolean }>> {
    await new Promise((r) => setTimeout(r, 200));
    liveTicket.status = 'CANCELLED';
    liveWorkstation.waiting_tickets = liveWorkstation.waiting_tickets.filter((t) => t.id !== ticketId);
    liveWorkstation.today_stats.active_waitlist_count = liveWorkstation.waiting_tickets.length;
    notifySubscribers();
    return createApiResponse({ cancelled: true }, 'Successfully left the queue.');
  },

  async leaveQueue(ticketId: string): Promise<void> {
    await this.leaveQueueEnvelope(ticketId);
  },

  // ============================================================
  // STAFF WORKSTATION
  // ============================================================
  async getWorkstationEnvelope(queueId: string): Promise<ApiResponse<WorkstationState>> {
    await new Promise((r) => setTimeout(r, 100));
    return createApiResponse({ ...liveWorkstation }, 'Workstation state loaded');
  },

  async getWorkstation(queueId: string): Promise<WorkstationState> {
    return (await this.getWorkstationEnvelope(queueId)).content;
  },

  async callNextCustomerEnvelope(queueId: string): Promise<ApiResponse<Ticket | null>> {
    await new Promise((r) => setTimeout(r, 200));
    if (liveWorkstation.waiting_tickets.length === 0) {
      return createApiResponse(null, 'No customers currently waiting in queue');
    }

    const nextTicket = liveWorkstation.waiting_tickets.shift()!;
    nextTicket.status = 'SERVING';
    nextTicket.called_at = new Date().toISOString();

    liveWorkstation.active_ticket = nextTicket;
    liveWorkstation.active_service_duration_seconds = 0;
    liveWorkstation.today_stats.active_waitlist_count = liveWorkstation.waiting_tickets.length;

    // Update customer live ticket if this is the customer's ticket
    if (liveTicket.id === nextTicket.id) {
      liveTicket.status = 'CALLED';
      liveTicket.alert_state = 'CALLED_NOW';
      liveTicket.people_ahead = 0;
      liveTicket.estimated_wait_minutes = 0;
      liveTicket.progress_percent = 100;
      soundEffects.playCalledChime();
    } else {
      liveTicket.currently_serving = nextTicket.ticket_code;
      liveTicket.people_ahead = Math.max(0, liveTicket.ticket_number - nextTicket.ticket_number);
      liveTicket.estimated_wait_minutes = liveTicket.people_ahead * 15;
      liveTicket.progress_percent = Math.min(95, Math.max(10, 100 - (liveTicket.people_ahead * 12)));
      
      if (liveTicket.people_ahead === 1) {
        liveTicket.alert_state = 'ALMOST_READY';
        soundEffects.playWarningBeep();
      }
    }

    notifySubscribers();
    return createApiResponse(nextTicket, `Now serving ticket ${nextTicket.ticket_code}`);
  },

  async callNextCustomer(queueId: string): Promise<Ticket | null> {
    return (await this.callNextCustomerEnvelope(queueId)).content;
  },

  async completeCurrentTicketEnvelope(ticketId: string): Promise<ApiResponse<{ completed: boolean }>> {
    await new Promise((r) => setTimeout(r, 150));
    if (liveWorkstation.active_ticket?.id === ticketId) {
      liveWorkstation.active_ticket.status = 'COMPLETED';
      liveWorkstation.active_ticket.completed_at = new Date().toISOString();
      liveWorkstation.today_stats.customers_served_today += 1;
      liveWorkstation.active_ticket = null;
      liveWorkstation.active_service_duration_seconds = 0;
    }
    if (liveTicket.id === ticketId) {
      liveTicket.status = 'COMPLETED';
    }
    soundEffects.playSuccessChime();
    notifySubscribers();
    return createApiResponse({ completed: true }, 'Customer marked as completed');
  },

  async completeCurrentTicket(ticketId: string): Promise<void> {
    await this.completeCurrentTicketEnvelope(ticketId);
  },

  async skipCurrentTicketEnvelope(ticketId: string): Promise<ApiResponse<{ skipped: boolean }>> {
    await new Promise((r) => setTimeout(r, 150));
    if (liveWorkstation.active_ticket?.id === ticketId) {
      const skipped = { ...liveWorkstation.active_ticket, status: 'SKIPPED' as const };
      liveWorkstation.skipped_tickets.push(skipped);
      liveWorkstation.active_ticket = null;
      liveWorkstation.active_service_duration_seconds = 0;
    }
    if (liveTicket.id === ticketId) {
      liveTicket.status = 'SKIPPED';
    }
    notifySubscribers();
    return createApiResponse({ skipped: true }, 'Customer placed on hold for 5 minutes');
  },

  async skipCurrentTicket(ticketId: string): Promise<void> {
    await this.skipCurrentTicketEnvelope(ticketId);
  },

  async toggleQueueStatusEnvelope(queueId: string, newStatus: 'OPEN' | 'PAUSED' | 'CLOSED'): Promise<ApiResponse<{ status: string }>> {
    await new Promise((r) => setTimeout(r, 150));
    liveWorkstation.queue.status = newStatus;
    notifySubscribers();
    return createApiResponse({ status: newStatus }, `Queue status updated to ${newStatus}`);
  },

  async toggleQueueStatus(queueId: string, newStatus: 'OPEN' | 'PAUSED' | 'CLOSED'): Promise<void> {
    await this.toggleQueueStatusEnvelope(queueId, newStatus);
  },

  // ============================================================
  // ANALYTICS
  // ============================================================
  async getAnalyticsEnvelope(businessId: string): Promise<ApiResponse<AnalyticsReport>> {
    await new Promise((r) => setTimeout(r, 200));
    return createApiResponse({ ...MOCK_ANALYTICS }, 'Analytics report generated');
  },

  async getAnalytics(businessId: string): Promise<AnalyticsReport> {
    return (await this.getAnalyticsEnvelope(businessId)).content;
  }
};
