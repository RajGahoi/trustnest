import React from 'react';
import { ShieldCheck, ArrowLeft, Lock, CheckCircle2 } from 'lucide-react';

interface PrivacyPageProps {
  onNavigate: (route: string) => void;
}

export const PrivacyPage: React.FC<PrivacyPageProps> = ({ onNavigate }) => {
  return (
    <div className="pt-24 pb-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
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
          DPDP Act 2023 & ISO 27001 Compliant
        </span>
      </div>

      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 text-orange-600 text-xs font-bold">
          <Lock className="w-3.5 h-3.5" />
          <span>Statutory Data Privacy & Governance</span>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-black text-navy-950 tracking-tight">
          TrustNest Privacy Policy
        </h1>
        <p className="text-xs sm:text-sm text-gray-500">
          Last revised: October 2026 • Effective across all TrustNest marketplace platforms
        </p>
      </div>

      {/* Main Legal Content Cards */}
      <div className="space-y-6 text-sm text-gray-700 leading-relaxed">
        {/* Section 1 */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
              1
            </div>
            <h2 className="font-display text-xl font-bold text-navy-950">
              Commitment to Data Privacy & Protection
            </h2>
          </div>
          <p>
            TrustNest Real Estate Technologies Private Limited (&ldquo;TrustNest&rdquo;, &ldquo;we&rdquo;, &ldquo;our&rdquo;) operates an anti-fraud, verified real estate discovery and transaction platform. We are dedicated to safeguarding the personal identity, financial credentials, and property documents entrusted to us by buyers, tenants, owners, and certified developers under the Digital Personal Data Protection (DPDP) Act, 2023 and Information Technology Act, 2000.
          </p>
        </div>

        {/* Section 2 */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
              2
            </div>
            <h2 className="font-display text-xl font-bold text-navy-950">
              Information We Collect & Verification Telemetry
            </h2>
          </div>
          <p>
            To eliminate fake listings, duplicate brokers, and fraudulent deeds, we collect only necessary data for lawful verification:
          </p>
          <ul className="space-y-2 list-disc pl-5 text-gray-600">
            <li><strong>Identity Verification:</strong> Aadhaar (masked last 4 digits only via UIDAI offline XML), PAN verification with NSDL/Income Tax database. Raw biometric data is never collected or stored.</li>
            <li><strong>Ownership & Property Checks:</strong> Sub-registrar deed scans, RERA registration certificates, mutation receipts, and municipal tax challans.</li>
            <li><strong>On-Site Telemetry:</strong> GPS coordinates collected at the time of property photography to certify true physical location.</li>
            <li><strong>Contact Details:</strong> Verified phone numbers and email addresses protected by virtual contact masking.</li>
          </ul>
        </div>

        {/* Section 3 */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
              3
            </div>
            <h2 className="font-display text-xl font-bold text-navy-950">
              Document Watermarking & Anti-Scraping Security
            </h2>
          </div>
          <p>
            Every property document uploaded to TrustNest automatically undergoes algorithmic watermarking:
          </p>
          <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-2 text-xs">
            <div className="flex items-center gap-2 text-emerald-800 font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Digital Watermark: &ldquo;TrustNest Verification Only — Not for Conveyance or Third Party Use&rdquo;</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-800 font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>AES-256 at-rest encryption on cloud document storage</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-800 font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Strict anti-scraping and IP rate limiting to prevent unauthorized data extraction</span>
            </div>
          </div>
        </div>

        {/* Section 4 */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
              4
            </div>
            <h2 className="font-display text-xl font-bold text-navy-950">
              Virtual Phone Masking & Zero Spam Guarantee
            </h2>
          </div>
          <p>
            Unlike traditional aggregator portals, TrustNest never sells your phone number to telemarketing databases or unverified call centers. Direct phone number reveal requires mutual identity clearance and operates under a finite quota to prevent commercial harassment.
          </p>
        </div>

        {/* Section 5 */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
              5
            </div>
            <h2 className="font-display text-xl font-bold text-navy-950">
              Data Subject Rights & Grievance Redressal
            </h2>
          </div>
          <p>
            Under DPDP Act 2023, you retain full rights to:
          </p>
          <ul className="space-y-1.5 list-disc pl-5 text-gray-600">
            <li>Request a full machine-readable export of all data associated with your profile.</li>
            <li>Request complete erasure or anonymization of your KYC tokens upon closing your account.</li>
            <li>Withdraw marketing or analytics consent at any time.</li>
          </ul>

          <div className="p-4 bg-orange-50 border border-orange-200 rounded-2xl text-xs space-y-1 mt-4">
            <p className="font-bold text-navy-950">Statutory Grievance Redressal Officer:</p>
            <p className="text-gray-700">Mr. Anand Vardhan, Data Protection Officer</p>
            <p className="text-gray-700">Email: <a href="mailto:privacy@trustnest.in" className="text-orange-600 font-bold underline">privacy@trustnest.in</a></p>
            <p className="text-gray-700">Address: TrustNest Tower, Cyber City, Phase 2, Gurugram, Haryana - 122002</p>
            <p className="text-gray-500 text-[11px] mt-1">Acknowledgment within 24 hours; statutory resolution within 15 days.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
