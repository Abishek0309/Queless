import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BusinessSummary } from '@/core/types';
import { Modal } from '@/shared/components/Modal';
import { Button } from '@/shared/components/Button';
import { apiClient } from '@/core/api/client';
import { storage } from '@/core/utils/storage';
import { Ticket, Users, Clock, Sparkles } from 'lucide-react';

interface JoinQueueModalProps {
  business: BusinessSummary;
  isOpen: boolean;
  onClose: () => void;
}

export const JoinQueueModal: React.FC<JoinQueueModalProps> = ({
  business,
  isOpen,
  onClose,
}) => {
  const navigate = useNavigate();
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [serviceType, setServiceType] = useState('General Consultation');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim()) {
      setError('Please enter your full name');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      const ticket = await apiClient.joinQueue('q1-dental-main', customerName, phone, serviceType);
      storage.setActiveTicketId(ticket.id);
      onClose();
      navigate('/ticket');
    } catch {
      setError('Failed to join queue. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Join Digital Queue">
      <div className="space-y-4">
        {/* Business summary pill */}
        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 flex items-center justify-between">
          <div>
            <h4 className="font-bold text-sm text-slate-900">{business.name}</h4>
            <p className="text-xs text-slate-500">{business.address}</p>
          </div>
          <div className="text-right">
            <span className="text-xs font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-md">
              Now: {business.currently_serving}
            </span>
            <p className="text-[11px] text-slate-500 mt-0.5">~{business.estimated_wait_minutes}m wait</p>
          </div>
        </div>

        {/* 1-Click Guest Guarantee Banner */}
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-indigo-50/80 border border-indigo-100 text-indigo-800 text-xs font-medium">
          <Sparkles className="w-4 h-4 text-indigo-500 shrink-0" />
          <span>No password required! Your ticket will stay saved in this browser.</span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 pt-2">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Your Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Alex Johnson"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Phone Number <span className="text-slate-400 font-normal">(Optional for SMS alerts)</span>
            </label>
            <input
              type="tel"
              placeholder="e.g. +1 555-0199"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Select Service
            </label>
            <select
              value={serviceType}
              onChange={(e) => setServiceType(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary font-medium"
            >
              <option value="General Consultation">General Consultation / Checkup</option>
              <option value="Dental Cleaning">Dental Cleaning & Polish</option>
              <option value="Urgent Treatment">Urgent Treatment</option>
              <option value="Follow-up Visit">Follow-up Visit</option>
            </select>
          </div>

          {error && (
            <p className="text-xs font-semibold text-rose-600 bg-rose-50 p-2.5 rounded-lg border border-rose-200">
              {error}
            </p>
          )}

          <div className="pt-3">
            <Button
              type="submit"
              variant="success"
              size="lg"
              className="w-full font-bold shadow-glow-emerald"
              isLoading={isSubmitting}
            >
              <Ticket className="w-5 h-5 mr-2" />
              <span>Get My Live Queue Ticket</span>
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
