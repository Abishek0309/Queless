import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Button } from '@/shared/components/Button';
import { Printer, Copy, Check, Sparkles, Layers, QrCode } from 'lucide-react';

export const AdminQRPosterGeneratorView: React.FC = () => {
  const [businessName, setBusinessName] = useState('City Dental & Care');
  const [tagline, setTagline] = useState('Skip the Waiting Room. Scan & Track Your Turn.');
  const [avgServiceTime, setAvgServiceTime] = useState('15');
  const [copied, setCopied] = useState(false);

  const joinUrl = 'https://queueless.app/join/city-dental-care';

  const handleCopyLink = () => {
    navigator.clipboard.writeText(joinUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-surface px-4 sm:px-6 lg:px-8 py-10 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-3xl text-slate-900">QR Code Poster Designer</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Generate and print high-resolution QR posters for your clinic entrance, salon desk, or reception.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="md" onClick={handleCopyLink} className="font-semibold">
            {copied ? <Check className="w-4 h-4 mr-1.5 text-emerald-600" /> : <Copy className="w-4 h-4 mr-1.5" />}
            <span>{copied ? 'Link Copied!' : 'Copy Direct Link'}</span>
          </Button>

          <Button variant="primary" size="md" onClick={handlePrint} className="font-bold shadow-glow-primary">
            <Printer className="w-4 h-4 mr-1.5" />
            <span>Print A4 Poster</span>
          </Button>
        </div>
      </div>

      {/* Grid: Editor Left, Live Poster Preview Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Editor Settings (5 cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200/90 shadow-subtle space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <QrCode className="w-5 h-5 text-primary" />
            <h3 className="font-display font-bold text-lg text-slate-900">Poster Customization</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Business / Clinic Name
              </label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-300 text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-primary font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Poster Headline / Call to Action
              </label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-300 text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-primary font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Average Service Time per Customer (Mins)
              </label>
              <input
                type="number"
                value={avgServiceTime}
                onChange={(e) => setAvgServiceTime(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-300 text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-primary font-medium"
              />
            </div>

            <div className="pt-2">
              <div className="bg-indigo-50/80 p-3.5 rounded-2xl border border-indigo-100 space-y-1.5 text-xs text-indigo-900">
                <p className="font-bold flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <span>How Customers Join:</span>
                </p>
                <ol className="list-decimal list-inside space-y-1 text-indigo-800/90">
                  <li>Scan QR code with any smartphone camera.</li>
                  <li>Enter their name (1-click guest ticket).</li>
                  <li>Walk around freely and get alerted when called!</li>
                </ol>
              </div>
            </div>
          </div>
        </div>

        {/* Live Printable Poster Preview (7 cols) */}
        <div className="lg:col-span-7 flex justify-center">
          <div
            id="printable-poster"
            className="w-full max-w-md bg-white border-2 border-slate-200 rounded-3xl p-8 shadow-2xl space-y-6 text-center print:border-none print:shadow-none print:max-w-none print:w-full"
          >
            {/* Poster Header */}
            <div className="space-y-2">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-primary to-indigo-500 text-white flex items-center justify-center mx-auto shadow-glow-primary">
                <Layers className="w-7 h-7" />
              </div>
              <p className="text-[11px] font-bold text-indigo-600 uppercase tracking-widest">Welcome to</p>
              <h2 className="font-display font-extrabold text-3xl text-slate-900">{businessName}</h2>
              <p className="text-sm font-semibold text-slate-600 max-w-xs mx-auto">{tagline}</p>
            </div>

            {/* QR Code Container */}
            <div className="relative p-6 bg-gradient-to-b from-indigo-50/50 to-surface-container-low rounded-3xl border-2 border-dashed border-indigo-200 inline-block shadow-inner">
              <div className="bg-white p-4 rounded-2xl shadow-elevated inline-block">
                <QRCodeSVG
                  value={joinUrl}
                  size={200}
                  level="H"
                  includeMargin={true}
                />
              </div>
              <p className="font-mono text-xs font-bold text-indigo-900 mt-3">{joinUrl}</p>
            </div>

            {/* 3 Steps Instructions Box */}
            <div className="grid grid-cols-3 gap-2 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center">
              <div>
                <span className="w-6 h-6 rounded-full bg-primary text-white font-bold text-xs flex items-center justify-center mx-auto mb-1">
                  1
                </span>
                <p className="text-[10px] font-bold text-slate-800">Scan QR</p>
                <p className="text-[9px] text-slate-500">With phone</p>
              </div>
              <div>
                <span className="w-6 h-6 rounded-full bg-primary text-white font-bold text-xs flex items-center justify-center mx-auto mb-1">
                  2
                </span>
                <p className="text-[10px] font-bold text-slate-800">Get Ticket</p>
                <p className="text-[9px] text-slate-500">1-click join</p>
              </div>
              <div>
                <span className="w-6 h-6 rounded-full bg-primary text-white font-bold text-xs flex items-center justify-center mx-auto mb-1">
                  3
                </span>
                <p className="text-[10px] font-bold text-slate-800">Relax</p>
                <p className="text-[9px] text-slate-500">We alert you</p>
              </div>
            </div>

            {/* Footer */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-medium">
              <span>Avg service: ~{avgServiceTime} min</span>
              <span className="font-bold text-slate-700">Powered by QueueLess</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
