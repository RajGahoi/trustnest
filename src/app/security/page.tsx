import React from 'react';
import { 
  ShieldCheck, 
  ArrowLeft, 
  MapPin, 
  FileCheck2, 
  ScanEye, 
  Database, 
  Cpu, 
  KeyRound,
  AlertCircle
} from 'lucide-react';

interface SecurityPageProps {
  onNavigate: (route: string) => void;
}

export const SecurityPage: React.FC<SecurityPageProps> = ({ onNavigate }) => {
  return (
    <div className="pt-24 pb-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      {/* Back button */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => onNavigate('home')}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-gray-700 hover:text-orange-500 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>

        <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          Bank-Grade 256-Bit SSL & SOC-2 Certified
        </span>
      </div>

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
          <ShieldCheck className="w-7 h-7 stroke-[2.2]" />
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-navy-950 tracking-tight">
          TrustNest Security Architecture
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
          How we eliminate fake brokers, stolen photographs, duplicate listings, and document fraud across Indian real estate.
        </p>
      </div>

      {/* 5 Pillars of Verification Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          {
            icon: KeyRound,
            step: '01',
            title: 'Identity Verification',
            badge: 'UIDAI & NSDL API',
            desc: 'Aadhaar offline XML tokenization & PAN verification with income tax records. Biometrics are never captured; user identities are validated against real national identity databases.'
          },
          {
            icon: FileCheck2,
            step: '02',
            title: 'Title Deed Review',
            badge: 'Sub-Registrar Matching',
            desc: 'Ownership chain check, mutation receipts, and circle rate validation. Every property agreement undergoes legal index review to confirm registered ownership.'
          },
          {
            icon: MapPin,
            step: '03',
            title: 'GPS Location Audit',
            badge: 'Within 50m Geo-Fence',
            desc: 'On-site photo capture telemetry coordinates verified against claimed municipal plot address. Guarantees that the photograph was taken at the physical location.'
          },
          {
            icon: ScanEye,
            step: '04',
            title: 'AI Media Originality Scan',
            badge: 'Perceptual Hash Check',
            desc: 'Deep inspection of EXIF metadata, lens markers, and perceptual hash comparison against 20 million internet images to detect stock photos and stolen catalog renders.'
          },
          {
            icon: Cpu,
            step: '05',
            title: 'Fraud Signal Engine',
            badge: 'Real-Time Heuristics',
            desc: 'Continuous behavioral analysis evaluating price-to-circle-rate variance, IP geolocation anomalies, and duplicate phone numbers across broker rings.'
          },
          {
            icon: Database,
            step: '06',
            title: 'Encrypted Vault & Watermarking',
            badge: 'AES-256 Cloud Vault',
            desc: 'All uploaded title documents are encrypted at rest with AES-256 and stamped with permanent cryptographic watermarks to prevent unlawful third-party conveyance.'
          }
        ].map(pillar => {
          const Icon = pillar.icon;
          return (
            <div
              key={pillar.title}
              className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-orange-500">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="font-mono text-xs font-black text-gray-400">
                    {pillar.step}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md inline-block mb-1">
                    {pillar.badge}
                  </span>
                  <h3 className="font-bold text-base text-navy-950">
                    {pillar.title}
                  </h3>
                  <p className="text-xs text-gray-600 mt-1.5 leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Security Infrastructure Specs */}
      <div className="bg-navy-950 text-white rounded-3xl p-6 sm:p-10 border border-white/10 shadow-xl space-y-6">
        <div>
          <span className="text-xs font-bold text-orange-400 uppercase tracking-widest block mb-1">
            Enterprise Infrastructure
          </span>
          <h2 className="font-display text-2xl font-bold">
            Zero-Trust System Boundaries & Encryption Standards
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-white/10 border border-white/10">
            <span className="text-gray-400 block mb-1">Transport Security</span>
            <strong className="text-sm font-mono text-white block">TLS 1.3 / HTTPS Strict</strong>
            <p className="text-[11px] text-gray-300 mt-1">HSTS preload, PFS ciphers</p>
          </div>
          <div className="p-4 rounded-2xl bg-white/10 border border-white/10">
            <span className="text-gray-400 block mb-1">Data at Rest</span>
            <strong className="text-sm font-mono text-white block">AES-256-GCM</strong>
            <p className="text-[11px] text-gray-300 mt-1">Envelope encryption with AWS KMS</p>
          </div>
          <div className="p-4 rounded-2xl bg-white/10 border border-white/10">
            <span className="text-gray-400 block mb-1">Authentication</span>
            <strong className="text-sm font-mono text-white block">RBAC & JWT Tokens</strong>
            <p className="text-[11px] text-gray-300 mt-1">Multi-factor & biometric touch</p>
          </div>
          <div className="p-4 rounded-2xl bg-white/10 border border-white/10">
            <span className="text-gray-400 block mb-1">Compliance</span>
            <strong className="text-sm font-mono text-white block">DPDP & ISO 27001</strong>
            <p className="text-[11px] text-gray-300 mt-1">Annual third-party CERT-In audit</p>
          </div>
        </div>
      </div>

      {/* Vulnerability Disclosure CTA */}
      <div className="p-6 rounded-3xl bg-orange-50 border border-orange-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-sm text-navy-950 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-orange-600" />
            <span>Responsible Vulnerability Disclosure Program</span>
          </h3>
          <p className="text-xs text-gray-600 mt-0.5">
            Security researchers who report potential vulnerabilities in good faith are eligible for bounty recognition.
          </p>
        </div>

        <a
          href="mailto:security@trustnest.in"
          className="px-5 py-2.5 bg-navy-900 hover:bg-navy-800 text-white font-bold text-xs rounded-xl transition-colors shrink-0 text-center"
        >
          Report Security Issue
        </a>
      </div>
    </div>
  );
};
