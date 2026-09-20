import React, { useState, useEffect } from 'react';
import { apiClient } from '@/core/api/client';
import { AnalyticsReport } from '@/core/types';
import { Users, Clock, TrendingUp, Sparkles, AlertCircle, BarChart3 } from 'lucide-react';

export const AnalyticsInsightsView: React.FC = () => {
  const [data, setData] = useState<AnalyticsReport | null>(null);
  const [period, setPeriod] = useState<'today' | '7d' | '30d'>('today');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setIsLoading(true);
      try {
        const report = await apiClient.getAnalytics('b1-city-dental');
        setData(report);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAnalytics();
  }, [period]);

  if (isLoading || !data) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const maxCustomers = Math.max(...data.hourly_traffic.map((h) => h.customers_served), 1);

  return (
    <div className="min-h-screen bg-surface px-4 sm:px-6 lg:px-8 py-10 max-w-7xl mx-auto space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display font-bold text-3xl text-slate-900">Queue Analytics & Insights</h1>
            <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full">
              Live Telemetry
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Analyze customer wait times, peak traffic hours, and staff throughput.
          </p>
        </div>

        {/* Date Filter Tabs */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200/80">
          {(['today', '7d', '30d'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold capitalize transition ${
                period === p
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {p === 'today' ? 'Today' : p === '7d' ? 'Last 7 Days' : 'This Month'}
            </button>
          ))}
        </div>
      </div>

      {/* 4 Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-subtle flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Served Today</p>
            <p className="font-display font-black text-3xl text-slate-900 mt-1.5 tabular-nums">
              {data.total_customers_served}
            </p>
            <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" /> +14% vs yesterday
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-subtle flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Avg Wait Time</p>
            <p className="font-display font-black text-3xl text-indigo-600 mt-1.5 tabular-nums">
              ~{data.average_wait_time_minutes}m
            </p>
            <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" /> -3m faster today
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-subtle flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Peak Traffic Hours</p>
            <p className="font-display font-bold text-xl text-slate-900 mt-1.5">
              {data.peak_hour_range}
            </p>
            <span className="text-[11px] font-semibold text-amber-600 flex items-center gap-1 mt-1">
              <Sparkles className="w-3 h-3" /> Max queue length
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <BarChart3 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-subtle flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Abandonment Rate</p>
            <p className="font-display font-black text-3xl text-slate-900 mt-1.5 tabular-nums">
              {data.abandonment_rate_percent}%
            </p>
            <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1 mt-1">
              <AlertCircle className="w-3 h-3" /> Industry avg: 12%
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-600 flex items-center justify-center">
            <AlertCircle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Hourly Traffic Chart (Pure Tailwind CSS Bar Chart) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-subtle space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display font-bold text-lg text-slate-900">Customers Served per Hour</h3>
              <p className="text-xs text-slate-500">Hourly throughput and wait times</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-slate-600">
                <span className="w-3 h-3 rounded-md bg-primary" /> Served Volume
              </span>
            </div>
          </div>

          <div className="h-64 flex items-end justify-between gap-3 pt-6 px-2 border-b border-slate-100">
            {data.hourly_traffic.map((hour) => {
              const heightPercent = (hour.customers_served / maxCustomers) * 100;
              return (
                <div key={hour.hour_label} className="flex-1 flex flex-col items-center gap-2 group relative">
                  {/* Tooltip on hover */}
                  <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg pointer-events-none shadow-elevated whitespace-nowrap z-10">
                    {hour.customers_served} served (~{hour.average_wait_min}m wait)
                  </div>

                  <div className="w-full bg-slate-100 rounded-t-xl h-48 flex items-end p-1">
                    <div
                      className="w-full rounded-lg bg-gradient-to-t from-primary to-indigo-400 group-hover:to-indigo-300 transition-all duration-300 shadow-sm"
                      style={{ height: `${Math.max(10, heightPercent)}%` }}
                    />
                  </div>
                  <span className="text-[11px] font-semibold text-slate-500">{hour.hour_label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Service Type Breakdown (4 cols) */}
        <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-slate-200/90 shadow-subtle space-y-5">
          <h3 className="font-display font-bold text-lg text-slate-900">Service Breakdown</h3>
          <p className="text-xs text-slate-500 -mt-3">Popular queue requests</p>

          <div className="space-y-4 pt-2">
            {data.service_breakdown.map((item) => (
              <div key={item.service_name} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                  <span>{item.service_name}</span>
                  <span className="font-bold text-slate-900">{item.percentage}% ({item.count})</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-500"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100/80 text-xs text-indigo-900">
            <p className="font-bold">Optimization Tip:</p>
            <p className="text-indigo-800/80 mt-0.5">
              Consultation queues peak at 11 AM. Consider dedicating a 2nd staff counter during peak hours.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
