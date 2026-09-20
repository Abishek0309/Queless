export type UserRole = 'CUSTOMER' | 'STAFF' | 'ADMIN';

export type BusinessCategory =
  | 'Clinics & Healthcare'
  | 'Salons & Spas'
  | 'Repair & Service Centers'
  | 'Restaurants & Dining'
  | 'Banking & Finance'
  | 'Education & Colleges'
  | 'Public Offices & Services'
  | 'Other';

export type QueueStatus = 'OPEN' | 'PAUSED' | 'CLOSED';

export type TicketStatus =
  | 'WAITING'
  | 'CALLED'
  | 'SERVING'
  | 'COMPLETED'
  | 'SKIPPED'
  | 'CANCELLED'
  | 'EXPIRED';

export type AlertState = 'NORMAL' | 'ALMOST_READY' | 'CALLED_NOW' | 'MISSED';

/**
 * Global Standard API Response Envelope
 */
export interface ApiResponse<T = unknown> {
  status: 'success' | 'error' | string;
  message: string;
  content: T;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  business_id?: string | null;
  created_at: string;
}

export interface Business {
  id: string;
  name: string;
  slug: string;
  category: BusinessCategory;
  description: string;
  address: string;
  phone?: string;
  opening_time: string;
  closing_time: string;
  average_service_time: number; // in minutes
  is_open: boolean;
  distance_km?: number;
  created_at: string;
}

export interface BusinessSummary extends Business {
  currently_serving: string;
  people_waiting: number;
  estimated_wait_minutes: number;
}

export interface Queue {
  id: string;
  business_id: string;
  name: string;
  status: QueueStatus;
  average_service_time: number;
  max_capacity: number;
  pause_reason?: string;
  created_at: string;
}

export interface QueueLiveState extends Queue {
  currently_serving_ticket: string | null;
  currently_serving_started_at: string | null;
  people_waiting: number;
  estimated_wait_minutes: number;
}

export interface BusinessDetail extends Business {
  active_queues: QueueLiveState[];
}

export interface Ticket {
  id: string;
  queue_id: string;
  ticket_number: number;
  ticket_code: string;
  customer_name: string;
  phone?: string;
  service_type?: string;
  status: TicketStatus;
  guest_token?: string;
  joined_at: string;
  called_at?: string | null;
  completed_at?: string | null;
}

export interface LiveTicketState extends Ticket {
  business_name: string;
  queue_name: string;
  currently_serving: string | null;
  people_ahead: number;
  estimated_wait_minutes: number;
  progress_percent: number;
  counter_or_station?: string | null;
  alert_state: AlertState;
}

export interface WorkstationState {
  queue: Queue;
  active_ticket: Ticket | null;
  active_service_duration_seconds: number;
  waiting_tickets: Ticket[];
  skipped_tickets: Ticket[];
  today_stats: {
    customers_served_today: number;
    average_wait_minutes: number;
    active_waitlist_count: number;
  };
}

export interface TVDisplayResponse {
  business_name: string;
  queue_name: string;
  currently_serving: {
    ticket_code: string;
    customer_display_name: string;
    station: string;
  } | null;
  upcoming_tickets: Array<{
    ticket_code: string;
    customer_display_name: string;
    estimated_wait_minutes: number;
  }>;
  qr_code_url: string;
}

export interface HourlyTrafficData {
  hour_label: string;
  customers_served: number;
  average_wait_min: number;
}

export interface ServiceBreakdownData {
  service_name: string;
  count: number;
  percentage: number;
}

export interface AnalyticsReport {
  total_customers_served: number;
  average_wait_time_minutes: number;
  average_service_time_minutes: number;
  peak_hour_range: string;
  abandonment_rate_percent: number;
  hourly_traffic: HourlyTrafficData[];
  service_breakdown: ServiceBreakdownData[];
}
