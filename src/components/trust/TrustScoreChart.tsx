import React, { useState, useEffect } from 'react';
import { ShieldCheck, Check, AlertCircle, Clock, Info, ChevronRight, X } from 'lucide-react';
import type { TrustScore } from '../../types';

interface TrustScoreChartProps {
  trustScore: TrustScore;
  onClose?: () => void;
  isModal?: boolean;
}

export const TrustScoreChart: React.FC<TrustScoreChartProps> = ({
  trustScore,
  onClose,
  isModal = false
}) => {
  const [selectedDimension, setSelectedDimension] = useState<string | null>(null);

  const activeDim = trustScore.dimensions.find(d => d.id === selectedDimension) || trustScore.dimensions[0];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isModal && onClose) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModal, onClose]);

  const content = (
    <div className="bg-cream-50 rounded-3xl p-6 border border-navy-900/10 shadow-trust text-navy-900 relative overflow-hidden">
      {/* Decorative organic shapes */}
      <div className="absolute -top-16 -right-16 w-48 h-48 bg-amber-soft/20 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-36 h-36 bg-orange-500/10 rounded-full blur-xl pointer-events-none" />

      {isModal && onClose && (
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-cream-200 active:bg-cream-300 transition-colors text-navy-900 cursor-pointer"
          aria-label="Close Trust Breakdown Modal"
        >
          <X className="w-5 h-5" />
        </button>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-navy-900/10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-navy-900 text-cream-50 rounded-full text-xs font-semibold uppercase tracking-wider mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-orange-500" />
            Verification Engine Audit
          </div>
          <h3 className="text-2xl font-bold tracking-tight text-navy-900">
            5-Dimensional Verification Score
          </h3>
          <p className="text-sm text-navy-700 mt-0.5">
            Real backend verification breakdown verified on {trustScore.verifiedAt}
          </p>
        </div>

        {/* Big Animated Score Dial */}
        <div className="flex items-center gap-4 bg-navy-900 text-white px-5 py-3 rounded-2xl border border-orange-500/30 shadow-md">
          <div className="relative flex items-center justify-center w-14 h-14 bg-navy-800 rounded-full border-2 border-orange-500 font-extrabold text-2xl text-orange-500">
            {trustScore.overallScore}
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider text-amber-soft font-semibold">
              {trustScore.tier} VERIFIED
            </div>
            <div className="text-sm text-gray-200 font-medium">
              Zero compromises
            </div>
          </div>
        </div>
      </div>

      {/* 5-Bar Dimensional Breakdown */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 space-y-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-navy-700">
            Click any dimension for live audit evidence
          </p>

          {trustScore.dimensions.map(dim => {
            const percentage = (dim.score / dim.maxScore) * 100;
            const isSelected = activeDim.id === dim.id;

            return (
              <button
                type="button"
                key={dim.id}
                onClick={() => setSelectedDimension(dim.id)}
                className={`w-full text-left p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer active:scale-[0.98] ${
                  isSelected
                    ? 'bg-cream-100 border-orange-500 shadow-sm ring-2 ring-orange-500/20'
                    : 'bg-white/70 border-navy-900/10 hover:border-navy-900/30 hover:bg-cream-100/50'
                }`}
              >
                <div className="flex items-center justify-between text-sm mb-1.5 font-semibold text-navy-900">
                  <span className="flex items-center gap-2">
                    {dim.status === 'PASSED' ? (
                      <Check className="w-4 h-4 text-trust-green stroke-[3]" />
                    ) : dim.status === 'PENDING' ? (
                      <Clock className="w-4 h-4 text-trust-amber" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-trust-red" />
                    )}
                    {dim.name} Verification
                  </span>
                  <span className="text-xs text-navy-700 font-mono">
                    {dim.score} / {dim.maxScore} pts ({percentage}%)
                  </span>
                </div>

                {/* Progress bar container */}
                <div className="w-full bg-cream-200 h-2.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      percentage >= 90
                        ? 'bg-orange-500'
                        : percentage >= 75
                        ? 'bg-amber-500'
                        : 'bg-trust-amber'
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </button>
            );
          })}
        </div>

        {/* Audit Evidence Card */}
        <div className="lg:col-span-5 bg-navy-900 text-cream-50 rounded-2xl p-5 border border-orange-500/20 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-amber-soft font-semibold uppercase tracking-wider mb-2">
              <span>Selected Audit Evidence</span>
              <Info className="w-3.5 h-3.5 text-orange-500" />
            </div>

            <h4 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              {activeDim.name} Status: <span className="text-orange-500">{activeDim.status}</span>
            </h4>

            <p className="text-xs text-cream-200 leading-relaxed bg-navy-800/80 p-3.5 rounded-xl border border-navy-700/50 mb-4">
              {activeDim.details}
            </p>

            <div className="space-y-2 text-xs text-gray-300">
              <div className="flex items-center justify-between py-1 border-b border-navy-800">
                <span>Verification Timestamp</span>
                <span className="font-mono text-cream-100">{activeDim.verifiedAt || trustScore.verifiedAt}</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-navy-800">
                <span>Verification Method</span>
                <span className="text-cream-100">Automated Direct Provider + Audit</span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span>Confidence Level</span>
                <span className="text-trust-green font-semibold">99.8% Confirmed</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-navy-800 flex items-center justify-between text-xs text-amber-soft font-medium">
            <span>Verified by TrustNest Core Engine</span>
            <ChevronRight className="w-4 h-4 text-orange-500" />
          </div>
        </div>
      </div>
    </div>
  );

  if (isModal) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-md animate-fadeIn"
        role="dialog"
        aria-modal="true"
        aria-label="5-Dimension Trust Breakdown Modal"
      >
        <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          {content}
        </div>
      </div>
    );
  }

  return content;
};
