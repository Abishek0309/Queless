import React from 'react';
import { useBusinessSearchViewModel } from '../viewmodels/useBusinessSearchViewModel';
import { Search, MapPin, Users, Clock, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { Badge } from '@/shared/components/Badge';
import { Button } from '@/shared/components/Button';
import { JoinQueueModal } from '@/features/customer-queue/views/JoinQueueModal';

export const BusinessDiscoveryView: React.FC = () => {
  const vm = useBusinessSearchViewModel();

  return (
    <div className="min-h-screen bg-surface pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 px-4 sm:px-6 lg:px-8 border-b border-slate-200/60 bg-gradient-to-b from-surface-container-low/80 to-surface">
        <div className="max-w-4xl mx-auto text-center space-y-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span>Zero physical waiting — Virtual queues with live tracking</span>
          </div>

          <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight text-slate-900 leading-[1.15]">
            Stop waiting in line. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-indigo-500">
              Know when it's your turn.
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
            Join digital queues remotely for clinics, salons, and repair centers. Track your live position and arrive right when you are called.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto pt-4">
            <div className="relative flex items-center bg-white rounded-2xl shadow-elevated border border-slate-200/80 p-2 focus-within:ring-2 focus-within:ring-primary focus-within:border-transparent transition-all">
              <Search className="w-5 h-5 text-slate-400 ml-3 shrink-0" />
              <input
                type="text"
                placeholder="Search by clinic, salon, doctor, or address..."
                value={vm.searchQuery}
                onChange={(e) => vm.setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 text-sm text-slate-900 bg-transparent focus:outline-none placeholder:text-slate-400 font-medium"
              />
              <Button size="sm" variant="primary" className="shrink-0 px-5">
                Search
              </Button>
            </div>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-3">
            {vm.categories.map((cat) => {
              const isSelected = vm.selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => vm.setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    isSelected
                      ? 'bg-primary text-white shadow-sm scale-105'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/60'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Discovery Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold font-display text-slate-900">Available Queues Near You</h2>
            <p className="text-xs text-slate-500">Live updating estimated wait times</p>
          </div>
          <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
            {vm.businesses.length} Places Open
          </span>
        </div>

        {vm.isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-64 bg-slate-100 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : vm.businesses.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200/80 p-8 max-w-md mx-auto">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-800 text-base">No businesses found</h3>
            <p className="text-xs text-slate-500 mt-1">Try searching with a different keyword or category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vm.businesses.map((biz) => (
              <div
                key={biz.id}
                className="group relative bg-white rounded-2xl border border-slate-200/70 p-5 shadow-subtle hover:shadow-elevated transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  {/* Top Category & Status */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full">
                      {biz.category}
                    </span>
                    <Badge status={biz.is_open ? 'OPEN' : 'CLOSED'} size="sm" />
                  </div>

                  {/* Business Name & Address */}
                  <h3 className="font-display font-bold text-lg text-slate-900 group-hover:text-primary transition-colors">
                    {biz.name}
                  </h3>
                  <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{biz.address}</span>
                    {biz.distance_km && <span className="text-indigo-600 font-semibold">• {biz.distance_km} km</span>}
                  </p>
                  <p className="text-xs text-slate-600 mt-3 line-clamp-2">{biz.description}</p>
                </div>

                {/* Queue Stats Card */}
                <div className="mt-5 pt-4 border-t border-slate-100">
                  <div className="grid grid-cols-3 gap-2 bg-slate-50/80 p-3 rounded-xl border border-slate-100 mb-4 text-center">
                    <div>
                      <p className="text-[10px] text-slate-500 font-medium uppercase">Serving</p>
                      <p className="font-display font-bold text-sm text-emerald-700">{biz.currently_serving}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 font-medium uppercase">Waiting</p>
                      <p className="font-display font-bold text-sm text-slate-800 flex items-center justify-center gap-1">
                        <Users className="w-3 h-3 text-slate-400" />
                        <span>{biz.people_waiting}</span>
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 font-medium uppercase">Est. Wait</p>
                      <p className="font-display font-bold text-sm text-indigo-600 flex items-center justify-center gap-1">
                        <Clock className="w-3 h-3 text-indigo-400" />
                        <span>~{biz.estimated_wait_minutes}m</span>
                      </p>
                    </div>
                  </div>

                  {/* Action Button */}
                  <Button
                    variant="primary"
                    size="md"
                    className="w-full font-semibold"
                    disabled={!biz.is_open}
                    onClick={() => vm.setSelectedBusinessForJoin(biz)}
                  >
                    <span>{biz.is_open ? 'Join Queue' : 'Queue Closed'}</span>
                    {biz.is_open && <ArrowRight className="w-4 h-4 ml-1" />}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Frictionless 1-Click Join Modal */}
      {vm.selectedBusinessForJoin && (
        <JoinQueueModal
          business={vm.selectedBusinessForJoin}
          isOpen={Boolean(vm.selectedBusinessForJoin)}
          onClose={() => vm.setSelectedBusinessForJoin(null)}
        />
      )}

      {/* Trust & Value Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-3xl p-8 sm:p-10 shadow-elevated flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-800">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>100% Free & No Registration Required for Guests</span>
            </div>
            <h3 className="font-display font-bold text-2xl sm:text-3xl">Are you a business owner?</h3>
            <p className="text-slate-300 text-sm">
              Generate QR codes, eliminate waiting room crowds, and manage live queues in minutes.
            </p>
          </div>
          <Button
            size="lg"
            variant="success"
            className="shrink-0 font-bold px-8 shadow-glow-emerald"
            onClick={() => (window.location.href = '/admin/qr')}
          >
            Create Your Digital Queue
          </Button>
        </div>
      </section>
    </div>
  );
};
