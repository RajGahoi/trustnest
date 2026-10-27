import React from 'react';
import { UserCheck, FileCheck, MapPinCheck, ShieldCheck } from 'lucide-react';

export const VerificationTimeline: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'Owner Identity',
      icon: UserCheck,
      desc: 'Seller & organization identity cross-referenced with official Aadhaar, PAN or GST records.'
    },
    {
      num: '02',
      title: 'Document Legal Review',
      icon: FileCheck,
      desc: 'Title deeds, ownership certificates, tax receipts & invoices audited for authenticity.'
    },
    {
      num: '03',
      title: 'GPS & Media Scan',
      icon: MapPinCheck,
      desc: 'On-site coordinate matching and AI visual scanner detecting recycled/manipulated photos.'
    },
    {
      num: '04',
      title: 'Verified Badge Issued',
      icon: ShieldCheck,
      desc: 'Composite 0-100 Trust Score assigned. Only listings passing threshold go live.'
    }
  ];

  return (
    <div className="w-full bg-cream-50 rounded-3xl p-8 border border-navy-900/10 shadow-trust relative overflow-hidden">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-amber-soft/40 text-navy-900 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
          The Verification Journey
        </div>
        <h3 className="text-3xl md:text-4xl font-extrabold text-navy-900 tracking-tight">
          Verified. Every Step.
        </h3>
        <p className="text-navy-700 text-sm md:text-base mt-2">
          Every property, vehicle, and listing passes through a rigorous four-phase verification pipeline before reaching buyers.
        </p>
      </div>

      {/* Timeline Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
        {steps.map((step, idx) => {
          const IconComponent = step.icon;
          return (
            <div
              key={step.num}
              className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-navy-900/10 hover:border-orange-500/50 hover:shadow-lg transition-all duration-300 group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl font-extrabold text-orange-500 font-mono tracking-tighter">
                    {step.num}
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-navy-900 text-cream-50 flex items-center justify-center group-hover:bg-orange-500 group-hover:text-white transition-colors">
                    <IconComponent className="w-5 h-5" />
                  </div>
                </div>

                <h4 className="text-lg font-bold text-navy-900 mb-2 group-hover:text-orange-600 transition-colors">
                  {step.title}
                </h4>

                <p className="text-xs text-navy-700 leading-relaxed">
                  {step.desc}
                </p>
              </div>

              {idx < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-20 pointer-events-none">
                  <div className="w-6 h-0.5 bg-orange-500/40" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
