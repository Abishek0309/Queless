import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Button } from '@/shared/components/Button';
import {
  Printer,
  Copy,
  Check,
  Info,
  Layers,
  QrCode,
  Palette,
  Layout,
  Download,
  Wifi,
  Sliders
} from 'lucide-react';

export const AdminQRPosterGeneratorView: React.FC = () => {
  const [businessName, setBusinessName] = useState('City Dental & Care');
  const [tagline, setTagline] = useState('Skip the Waiting Room. Scan & Track Your Turn.');
  const [avgServiceTime, setAvgServiceTime] = useState('15');
  const [copied, setCopied] = useState(false);

  // Customization Options (Item 5: Fills empty space with high-value controls)
  const [themeColor, setThemeColor] = useState<'indigo' | 'emerald' | 'slate' | 'amber'>('indigo');
  const [posterFormat, setPosterFormat] = useState<'tent' | 'standing' | 'compact'>('tent');
  const [showInstructions, setShowInstructions] = useState(true);
  const [showAvgTime, setShowAvgTime] = useState(true);
  const [wifiText, setWifiText] = useState('Guest_WiFi_Free');

  const joinUrl = 'https://queueless.app/join/city-dental-care';

  const themeTokens = {
    indigo: {
      gradient: 'from-primary to-indigo-500',
      badgeBg: 'bg-indigo-50 text-indigo-700',
      accentText: 'text-indigo-600',
      borderDashed: 'border-indigo-200',
      qrBg: 'from-indigo-50/60 to-surface-container-low',
      stepNum: 'bg-primary text-white',
    },
    emerald: {
      gradient: 'from-emerald-600 to-teal-500',
      badgeBg: 'bg-emerald-50 text-emerald-800',
      accentText: 'text-emerald-700',
      borderDashed: 'border-emerald-200',
      qrBg: 'from-emerald-50/60 to-surface-container-low',
      stepNum: 'bg-emerald-600 text-white',
    },
    slate: {
      gradient: 'from-slate-900 to-slate-700',
      badgeBg: 'bg-slate-100 text-slate-800',
      accentText: 'text-slate-800',
      borderDashed: 'border-slate-300',
      qrBg: 'from-slate-100 to-surface-container-low',
      stepNum: 'bg-slate-900 text-white',
    },
    amber: {
      gradient: 'from-amber-500 to-orange-500',
      badgeBg: 'bg-amber-50 text-amber-900',
      accentText: 'text-amber-700',
      borderDashed: 'border-amber-200',
      qrBg: 'from-amber-50/60 to-surface-container-low',
      stepNum: 'bg-amber-600 text-white',
    },
  }[themeColor];

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
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Editor Settings (5 cols - Fully enriched to balance height) */}
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

            {/* Poster Theme Selector */}
            <div className="pt-1">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-indigo-500" />
                <span>Poster Color Accent</span>
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: 'indigo', label: 'Indigo', bg: 'bg-indigo-600' },
                  { id: 'emerald', label: 'Emerald', bg: 'bg-emerald-600' },
                  { id: 'slate', label: 'Slate', bg: 'bg-slate-900' },
                  { id: 'amber', label: 'Amber', bg: 'bg-amber-500' },
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setThemeColor(t.id as typeof themeColor)}
                    className={`p-2 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                      themeColor === t.id
                        ? 'border-primary ring-2 ring-primary/20 bg-slate-50 font-bold text-slate-900'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <span className={`w-3 h-3 rounded-full ${t.bg}`} />
                    <span>{t.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Feature Toggles */}
            <div className="pt-2 border-t border-slate-100 space-y-2.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-indigo-500" />
                <span>Poster Elements</span>
              </label>

              <label className="flex items-center gap-2.5 text-xs font-medium text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showInstructions}
                  onChange={(e) => setShowInstructions(e.target.checked)}
                  className="rounded border-slate-300 text-primary focus:ring-primary w-4 h-4"
                />
                <span>Show Step-by-Step Scan Instructions (1-2-3)</span>
              </label>

              <label className="flex items-center gap-2.5 text-xs font-medium text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showAvgTime}
                  onChange={(e) => setShowAvgTime(e.target.checked)}
                  className="rounded border-slate-300 text-primary focus:ring-primary w-4 h-4"
                />
                <span>Display Average Service Time</span>
              </label>
            </div>

            {/* How Customers Join Guide Box */}
            <div className="pt-2">
              <div className="bg-indigo-50/80 p-3.5 rounded-2xl border border-indigo-100 space-y-1.5 text-xs text-indigo-900">
                <p className="font-bold flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-indigo-600" />
                  <span>Poster Setup Recommendation:</span>
                </p>
                <p className="text-indigo-800/90 text-[11px] leading-relaxed">
                  Print on standard A4 paper or acrylic table tents. Position near the entrance for 100% walk-in visibility.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Live Printable Poster Preview (7 cols) */}
        <div className="lg:col-span-7 flex justify-center">
          <div
            id="printable-poster"
            className="w-full max-w-md bg-white border-2 border-slate-200 rounded-3xl p-8 shadow-2xl space-y-6 text-center print:border-none print:shadow-none print:max-w-none print:w-full transition-all duration-300"
          >
            {/* Poster Header */}
            <div className="space-y-2">
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${themeTokens.gradient} text-white flex items-center justify-center mx-auto shadow-md`}>
                <Layers className="w-7 h-7" />
              </div>
              <p className={`text-[11px] font-bold ${themeTokens.accentText} uppercase tracking-widest`}>Welcome to</p>
              <h2 className="font-display font-extrabold text-3xl text-slate-900">{businessName}</h2>
              <p className="text-sm font-semibold text-slate-600 max-w-xs mx-auto">{tagline}</p>
            </div>

            {/* QR Code Container */}
            <div className={`relative p-6 bg-gradient-to-b ${themeTokens.qrBg} rounded-3xl border-2 border-dashed ${themeTokens.borderDashed} inline-block shadow-inner`}>
              <div className="bg-white p-4 rounded-2xl shadow-elevated inline-block">
                <QRCodeSVG
                  value={joinUrl}
                  size={200}
                  level="H"
                  includeMargin={true}
                />
              </div>
              <p className="font-mono text-xs font-bold text-slate-800 mt-3">{joinUrl}</p>
            </div>

            {/* 3 Steps Instructions Box */}
            {showInstructions && (
              <div className="grid grid-cols-3 gap-2 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center">
                <div>
                  <span className={`w-6 h-6 rounded-full ${themeTokens.stepNum} font-bold text-xs flex items-center justify-center mx-auto mb-1`}>
                    1
                  </span>
                  <p className="text-[10px] font-bold text-slate-800">Scan QR</p>
                  <p className="text-[9px] text-slate-500">With phone</p>
                </div>
                <div>
                  <span className={`w-6 h-6 rounded-full ${themeTokens.stepNum} font-bold text-xs flex items-center justify-center mx-auto mb-1`}>
                    2
                  </span>
                  <p className="text-[10px] font-bold text-slate-800">Get Ticket</p>
                  <p className="text-[9px] text-slate-500">1-click join</p>
                </div>
                <div>
                  <span className={`w-6 h-6 rounded-full ${themeTokens.stepNum} font-bold text-xs flex items-center justify-center mx-auto mb-1`}>
                    3
                  </span>
                  <p className="text-[10px] font-bold text-slate-800">Relax</p>
                  <p className="text-[9px] text-slate-500">We alert you</p>
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-medium">
              <span>{showAvgTime ? `Avg service: ~${avgServiceTime} min` : 'Digital Virtual Queue'}</span>
              <span className="font-bold text-slate-700">Powered by QueueLess</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
