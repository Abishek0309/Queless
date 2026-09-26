import React, { useState, useEffect } from 'react';
import { apiClient } from '@/core/api/client';
import { AnalyticsReport, HourlyTrafficData } from '@/core/types';
import { Skeleton } from '@/shared/components/Skeleton';
import {
  Users,
  Clock,
  TrendingUp,
  Lightbulb,
  AlertCircle,
  Activity
} from 'lucide-react';

export const AnalyticsInsightsView: React.FC = () => {
  const [data, setData] = useState<AnalyticsReport | null>(null);
  const [period, setPeriod] = useState<'today' | '7d' | '30d'>('today');
  const [chartMode, setChartMode] = useState<'wave' | 'line'>('wave');
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    const timer = setTimeout(async () => {
      try {
        const report = await apiClient.getAnalytics('b1-city-dental');
        if (isMounted) {
          if (period === '7d') {
            setData({
              ...report,
              total_customers_served: 542,
              average_wait_time_minutes: 16,
              abandonment_rate_percent: 2.8,
              hourly_traffic: [
                { hour_label: 'Mon', customers_served: 68, average_wait_min: 14 },
                { hour_label: 'Tue', customers_served: 82, average_wait_min: 18 },
                { hour_label: 'Wed', customers_served: 95, average_wait_min: 22 },
                { hour_label: 'Thu', customers_served: 76, average_wait_min: 15 },
                { hour_label: 'Fri', customers_served: 110, average_wait_min: 25 },
                { hour_label: 'Sat', customers_served: 85, average_wait_min: 19 },
                { hour_label: 'Sun', customers_served: 26, average_wait_min: 8 },
              ],
            });
          } else if (period === '30d') {
            setData({
              ...report,
              total_customers_served: 2310,
              average_wait_time_minutes: 19,
              abandonment_rate_percent: 3.1,
              hourly_traffic: [
                { hour_label: 'W1', customers_served: 490, average_wait_min: 16 },
                { hour_label: 'W2', customers_served: 580, average_wait_min: 21 },
                { hour_label: 'W3', customers_served: 620, average_wait_min: 24 },
                { hour_label: 'W4', customers_served: 620, average_wait_min: 18 },
              ],
            });
          } else {
            setData(report);
          }
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }, 320); // Smooth skeleton shimmer wave during transitions

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [period]);

  const trafficData: HourlyTrafficData[] = data?.hourly_traffic || [];
  const maxVal = trafficData.length > 0 ? Math.max(...trafficData.map((d) => d.customers_served), 1) : 20;

  // SVG Wave Curve Coordinate Generator
  const svgWidth = 680;
  const svgHeight = 220;
  const padding = { top: 25, bottom: 35, left: 35, right: 35 };

  const plotWidth = svgWidth - padding.left - padding.right;
  const plotHeight = svgHeight - padding.top - padding.bottom;

  const points = trafficData.map((d, i) => {
    const x = padding.left + (i / Math.max(trafficData.length - 1, 1)) * plotWidth;
    const y = padding.top + (1 - d.customers_served / maxVal) * plotHeight;
    return { x, y, data: d, index: i };
  });

  // Calculate smooth cubic Bezier spline
  const generateSplinePath = (pts: { x: number; y: number }[]) => {
    if (pts.length === 0) return '';
    if (pts.length === 1) return `M ${pts[0].x},${pts[0].y}`;

    let path = `M ${pts[0].x.toFixed(1)},${pts[0].y.toFixed(1)}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i === 0 ? 0 : i - 1];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[i + 2 < pts.length ? i + 2 : i + 1];

      const cp1x = p1.x + (p2.x - p0.x) / 5.5;
      const cp1y = p1.y + (p2.y - p0.y) / 5.5;
      const cp2x = p2.x - (p3.x - p1.x) / 5.5;
      const cp2y = p2.y - (p3.y - p1.y) / 5.5;

      path += ` C ${cp1x.toFixed(1)},${cp1y.toFixed(1)} ${cp2x.toFixed(1)},${cp2y.toFixed(1)} ${p2.x.toFixed(1)},${p2.y.toFixed(1)}`;
    }
    return path;
  };

  const linePath = generateSplinePath(points);
  const areaPath =
    points.length > 0
      ? `${linePath} L ${points[points.length - 1].x.toFixed(1)},${(svgHeight - padding.bottom).toFixed(1)} L ${points[0].x.toFixed(1)},${(svgHeight - padding.bottom).toFixed(1)} Z`
      : '';

  const activeHoverPoint = hoveredIndex !== null && points[hoveredIndex] ? points[hoveredIndex] : null;

  return (
    <div className="min-h-screen bg-surface px-4 sm:px-6 lg:px-8 py-10 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display font-bold text-3xl text-slate-900">Queue Analytics & Insights</h1>
            <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100 flex items-center gap-1.5">
              <Activity className="w-3 h-3 text-indigo-500" />
              Live Telemetry
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time throughput, wait patterns, and hourly traffic velocity.
          </p>
        </div>

        {/* Date Filter Tabs */}
        <div className="flex items-center gap-1 bg-slate-100/90 p-1.5 rounded-2xl border border-slate-200/80 shadow-subtle">
          {(['today', '7d', '30d'] as const).map((p) => (
            <button
              key={p}
              onClick={() => {
                if (period !== p) {
                  setHoveredIndex(null);
                  setPeriod(p);
                }
              }}
              className={`px-4 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all duration-200 ${
                period === p
                  ? 'bg-white text-slate-900 shadow-sm font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {p === 'today' ? 'Today' : p === '7d' ? 'Last 7 Days' : 'This Month'}
            </button>
          ))}
        </div>
      </div>

      {/* 4 Summary KPI Cards with Shimmer Wave Support */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-subtle flex items-center justify-between transition hover:shadow-elevated">
          <div className="space-y-1.5 w-full mr-2">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {period === 'today' ? 'Served Today' : period === '7d' ? 'Served (7 Days)' : 'Served (30 Days)'}
            </p>
            {isLoading || !data ? (
              <Skeleton className="h-8 w-24 rounded-lg my-1" />
            ) : (
              <p className="font-display font-black text-3xl text-slate-900 tabular-nums">
                {data.total_customers_served}
              </p>
            )}
            <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> +14% vs previous
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-subtle flex items-center justify-between transition hover:shadow-elevated">
          <div className="space-y-1.5 w-full mr-2">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Avg Wait Time</p>
            {isLoading || !data ? (
              <Skeleton className="h-8 w-20 rounded-lg my-1" />
            ) : (
              <p className="font-display font-black text-3xl text-indigo-600 tabular-nums">
                ~{data.average_wait_time_minutes}m
              </p>
            )}
            <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> -3m faster today
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        {/* Card 3 (Clean Trend Icon replacing glitter) */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-subtle flex items-center justify-between transition hover:shadow-elevated">
          <div className="space-y-1.5 w-full mr-2">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Peak Traffic Hours</p>
            {isLoading || !data ? (
              <Skeleton className="h-8 w-32 rounded-lg my-1" />
            ) : (
              <p className="font-display font-bold text-xl text-slate-900">
                {data.peak_hour_range}
              </p>
            )}
            <span className="text-[11px] font-semibold text-amber-600 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> +28% volume surge
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Activity className="w-6 h-6" />
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-subtle flex items-center justify-between transition hover:shadow-elevated">
          <div className="space-y-1.5 w-full mr-2">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Abandonment Rate</p>
            {isLoading || !data ? (
              <Skeleton className="h-8 w-16 rounded-lg my-1" />
            ) : (
              <p className="font-display font-black text-3xl text-slate-900 tabular-nums">
                {data.abandonment_rate_percent}%
              </p>
            )}
            <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> Low (Industry avg: 12%)
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
            <AlertCircle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Lively SVG Wave & Spline Line Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-subtle space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-bold text-lg text-slate-900">Queue Throughput Velocity</h3>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
                  Wave Analytics
                </span>
              </div>
              <p className="text-xs text-slate-500">Live smoothed distribution of patient completions over time</p>
            </div>

            {/* Mode Controls */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
                <button
                  onClick={() => setChartMode('wave')}
                  className={`px-3 py-1 rounded-lg transition ${
                    chartMode === 'wave'
                      ? 'bg-white text-indigo-600 shadow-sm font-bold'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Wave Area
                </button>
                <button
                  onClick={() => setChartMode('line')}
                  className={`px-3 py-1 rounded-lg transition ${
                    chartMode === 'line'
                      ? 'bg-white text-indigo-600 shadow-sm font-bold'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Line Spline
                </button>
              </div>
            </div>
          </div>

          {isLoading || !data ? (
            <div className="h-64 flex flex-col justify-between pt-6 px-4">
              <Skeleton className="h-44 w-full rounded-2xl" />
              <div className="flex justify-between pt-2">
                {[1, 2, 3, 4, 5, 6, 7].map((n) => (
                  <Skeleton key={n} className="h-3 w-8 rounded" />
                ))}
              </div>
            </div>
          ) : (
            <div className="relative pt-2 select-none">
              {/* Active Floating Tooltip */}
              {activeHoverPoint && (
                <div
                  className="absolute z-20 pointer-events-none transition-all duration-150 bg-slate-900/95 backdrop-blur text-white text-xs p-3 rounded-2xl shadow-elevated border border-slate-700 space-y-1"
                  style={{
                    left: `${Math.min(Math.max(activeHoverPoint.x - 70, 10), svgWidth - 170)}px`,
                    top: `${Math.max(activeHoverPoint.y - 85, 0)}px`,
                  }}
                >
                  <div className="flex items-center justify-between gap-3 text-[11px] text-slate-400 font-semibold border-b border-slate-800 pb-1">
                    <span>{activeHoverPoint.data.hour_label} Interval</span>
                    <span className="text-emerald-400 font-bold">Active</span>
                  </div>
                  <div className="flex items-center gap-2 pt-0.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-400 ring-2 ring-indigo-400/30" />
                    <span className="font-bold text-sm text-white">
                      {activeHoverPoint.data.customers_served} Served
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    Average wait: <strong className="text-white">~{activeHoverPoint.data.average_wait_min} mins</strong>
                  </p>
                </div>
              )}

              {/* Lively Smooth SVG Wave / Spline Graphic */}
              <div className="w-full overflow-hidden">
                <svg
                  viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                  className="w-full h-64 overflow-visible"
                >
                  <defs>
                    {/* Area Wave Gradient */}
                    <linearGradient id="waveGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.38" />
                      <stop offset="50%" stopColor="#6366f1" stopOpacity="0.15" />
                      <stop offset="100%" stopColor="#a5b4fc" stopOpacity="0.0" />
                    </linearGradient>

                    {/* Glowing Stroke Gradient */}
                    <linearGradient id="strokeGradient" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#4f46e5" />
                      <stop offset="50%" stopColor="#6366f1" />
                      <stop offset="100%" stopColor="#10b981" />
                    </linearGradient>

                    {/* Glow filter */}
                    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="3" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                  </defs>

                  {/* Horizontal Grid lines */}
                  {[0, 0.33, 0.66, 1].map((ratio, idx) => {
                    const y = padding.top + ratio * plotHeight;
                    const value = Math.round(maxVal * (1 - ratio));
                    return (
                      <g key={idx}>
                        <line
                          x1={padding.left}
                          y1={y}
                          x2={svgWidth - padding.right}
                          y2={y}
                          stroke="#f1f5f9"
                          strokeWidth="1.5"
                          strokeDasharray="4 4"
                        />
                        <text
                          x={padding.left - 8}
                          y={y + 3}
                          textAnchor="end"
                          className="text-[10px] fill-slate-400 font-semibold"
                        >
                          {value}
                        </text>
                      </g>
                    );
                  })}

                  {/* Wave Area Fill (Only in Wave Mode) */}
                  {chartMode === 'wave' && (
                    <path
                      d={areaPath}
                      fill="url(#waveGradient)"
                      className="transition-all duration-500 ease-out"
                    />
                  )}

                  {/* Smooth Continuous Spline Curve Stroke */}
                  <path
                    d={linePath}
                    fill="none"
                    stroke="url(#strokeGradient)"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="transition-all duration-500 ease-out drop-shadow-sm"
                  />

                  {/* Hover Crosshair Vertical Line */}
                  {activeHoverPoint && (
                    <line
                      x1={activeHoverPoint.x}
                      y1={padding.top}
                      x2={activeHoverPoint.x}
                      y2={svgHeight - padding.bottom}
                      stroke="#818cf8"
                      strokeWidth="1.5"
                      strokeDasharray="3 3"
                    />
                  )}

                  {/* Interactive Nodes along the Wave Curve */}
                  {points.map((pt) => {
                    const isHovered = hoveredIndex === pt.index;
                    return (
                      <g
                        key={pt.index}
                        className="cursor-pointer group"
                        onMouseEnter={() => setHoveredIndex(pt.index)}
                        onMouseLeave={() => setHoveredIndex(null)}
                      >
                        {/* Invisible large hover hit area */}
                        <circle cx={pt.x} cy={pt.y} r="18" fill="transparent" />

                        {/* Outer pulsating ring when hovered */}
                        {isHovered && (
                          <circle
                            cx={pt.x}
                            cy={pt.y}
                            r="9"
                            fill="#6366f1"
                            opacity="0.25"
                            className="animate-ping"
                          />
                        )}

                        {/* Node circle */}
                        <circle
                          cx={pt.x}
                          cy={pt.y}
                          r={isHovered ? 6 : 4}
                          fill="#ffffff"
                          stroke={isHovered ? '#10b981' : '#4f46e5'}
                          strokeWidth={isHovered ? 3 : 2.5}
                          className="transition-all duration-200 shadow-sm"
                        />

                        {/* X-axis label */}
                        <text
                          x={pt.x}
                          y={svgHeight - 10}
                          textAnchor="middle"
                          className={`text-[11px] font-semibold transition-colors ${
                            isHovered ? 'fill-indigo-600 font-bold' : 'fill-slate-500'
                          }`}
                        >
                          {pt.data.hour_label}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>

              {/* Bottom Quick Legend & Live Pacing */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-1 rounded-full bg-gradient-to-r from-primary to-emerald-400" />
                    <span>Smoothed Velocity Curve</span>
                  </span>
                  <span className="flex items-center gap-1.5 text-slate-400">
                    <span className="w-2 h-2 rounded-full border border-slate-300" />
                    <span>Hourly Waypoints</span>
                  </span>
                </div>
                <div className="font-semibold text-slate-700 flex items-center gap-1">
                  <span>Current Peak:</span>
                  <span className="text-primary font-bold">11:00 AM (22/hr)</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Service Type Breakdown */}
        <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-slate-200/90 shadow-subtle space-y-5 flex flex-col justify-between">
          <div>
            <h3 className="font-display font-bold text-lg text-slate-900">Service Breakdown</h3>
            <p className="text-xs text-slate-500">Popular queue distribution</p>

            {isLoading || !data ? (
              <div className="space-y-4 pt-4">
                {[1, 2, 3, 4].map((n) => (
                  <div key={n} className="space-y-2">
                    <div className="flex justify-between">
                      <Skeleton className="h-3 w-28" />
                      <Skeleton className="h-3 w-12" />
                    </div>
                    <Skeleton className="h-2 w-full rounded-full" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4 pt-4">
                {data.service_breakdown.map((item) => (
                  <div key={item.service_name} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                      <span className="truncate pr-2">{item.service_name}</span>
                      <span className="font-bold text-slate-900 shrink-0">
                        {item.percentage}% ({item.count})
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-indigo-400 rounded-full transition-all duration-500"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Realistic Operational Insight Card (Clean Lightbulb icon) */}
          <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100/80 text-xs text-indigo-900 space-y-1">
            <p className="font-bold flex items-center gap-1.5">
              <Lightbulb className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>Throughput Optimization</span>
            </p>
            <p className="text-indigo-800/80 text-[11px] leading-relaxed">
              Consultation queues peak at 11 AM. Setting up a dedicated fast-track counter during peak hours reduces average patient wait time by ~35%.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
