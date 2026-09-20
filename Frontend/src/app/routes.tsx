import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { BusinessDiscoveryView } from '@/features/business-discovery/views/BusinessDiscoveryView';
import { LiveTicketView } from '@/features/customer-queue/views/LiveTicketView';
import { StaffWorkstationView } from '@/features/business-dashboard/views/StaffWorkstationView';
import { TVKioskDisplayView } from '@/features/business-dashboard/views/TVKioskDisplayView';
import { AdminQRPosterGeneratorView } from '@/features/business-dashboard/views/AdminQRPosterGeneratorView';
import { AnalyticsInsightsView } from '@/features/business-dashboard/views/AnalyticsInsightsView';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Customer Routes */}
      <Route path="/" element={<BusinessDiscoveryView />} />
      <Route path="/ticket" element={<LiveTicketView />} />
      <Route path="/join/:slug" element={<BusinessDiscoveryView />} />

      {/* Business & Staff Dashboard Routes */}
      <Route path="/workstation" element={<StaffWorkstationView />} />
      <Route path="/tv-display" element={<TVKioskDisplayView />} />
      <Route path="/admin/qr" element={<AdminQRPosterGeneratorView />} />
      <Route path="/analytics" element={<AnalyticsInsightsView />} />
    </Routes>
  );
};
