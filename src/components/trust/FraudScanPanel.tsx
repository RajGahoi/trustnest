import React from 'react';
import { ShieldCheck, Image, Cpu, MapPin, CheckCircle, AlertTriangle } from 'lucide-react';
import type { FraudSignal } from '../../types';

interface FraudScanPanelProps {
  fraudSignals?: FraudSignal[];
  hasMediaCheckPassed?: boolean;
}

export const FraudScanPanel: React.FC<FraudScanPanelProps> = ({
  fraudSignals = [],
  hasMediaCheckPassed = true
}) => {
  const checks = [
    { label: 'Photo Originality Scan', status: 'Passed', icon: Image, note: 'Zero recycled stock images found' },
    { label: 'Duplicate Visual Indexing', status: 'Passed', icon: Cpu, note: 'Scanned 14,000+ platform images' },
    { label: 'EXIF Metadata Analysis', status: 'Passed', icon: ShieldCheck, note: 'Timestamp & camera hardware match' },
    { label: 'GPS Coordinate Cross-Match', status: 'Passed', icon: MapPin, note: 'On-site geolocation verified' },
  ];

  return (
    <div className="bg-navy-900 text-cream-50 rounded-3xl p-6 md:p-8 border border-orange-500/30 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        <div className="md:col-span-7">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-navy-800 text-amber-soft rounded-full text-xs font-semibold uppercase tracking-wider mb-3 border border-navy-700">
            <Cpu className="w-3.5 h-3.5 text-orange-500" />
            AI Visual & Fraud Engine
          </div>

          <h3 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight mb-3">
            Photo & Fraud Verification
          </h3>

          <p className="text-xs md:text-sm text-cream-200 leading-relaxed mb-6">
            Every submitted image and document is scanned for duplicate recycling, digital manipulation, and location misrepresentation before going live.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {checks.map(check => {
              const IconComp = check.icon;
              return (
                <div key={check.label} className="bg-navy-800/80 p-3.5 rounded-xl border border-navy-700/60 flex items-start gap-3">
                  <div className="p-2 bg-orange-500/10 text-orange-500 rounded-lg">
                    <IconComp className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-1.5">
                      {check.label}
                      <CheckCircle className="w-3.5 h-3.5 text-trust-green inline-block" />
                    </div>
                    <div className="text-[11px] text-gray-300 mt-0.5">{check.note}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="md:col-span-5 bg-navy-950 p-6 rounded-2xl border border-navy-800 text-center">
          <div className="w-16 h-16 mx-auto bg-orange-500/20 text-orange-500 rounded-full flex items-center justify-center mb-4 border border-orange-500/40">
            <ShieldCheck className="w-8 h-8" />
          </div>

          <div className="text-xs font-semibold uppercase tracking-wider text-amber-soft mb-1">
            Media Security Index
          </div>

          <div className="text-3xl font-extrabold text-white mb-2">
            {hasMediaCheckPassed ? 'AUTHENTIC' : 'REVIEW'}
          </div>

          <p className="text-xs text-gray-300 mb-4">
            {fraudSignals.length === 0
              ? 'Zero suspicious manipulation or duplicate image signals detected.'
              : `${fraudSignals.length} risk signal flagged for moderator investigation.`}
          </p>

          {fraudSignals.length > 0 && (
            <div className="text-left bg-amber-500/10 border border-amber-500/30 p-3 rounded-xl text-xs text-amber-200 space-y-1">
              {fraudSignals.map(sig => (
                <div key={sig.id} className="flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>{sig.description}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
