import React from 'react';
import { ArrowLeft, FileText, CheckCircle2, Scale } from 'lucide-react';

interface TermsPageProps {
  onNavigate: (route: string) => void;
}

export const TermsPage: React.FC<TermsPageProps> = ({ onNavigate }) => {
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

        <span className="text-xs font-extrabold text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full flex items-center gap-1.5">
          <Scale className="w-4 h-4 text-blue-600" />
          RERA & IT Act 2000 Compliant
        </span>
      </div>

      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 text-xs font-bold">
          <FileText className="w-3.5 h-3.5" />
          <span>Marketplace & Verification Agreement</span>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-black text-navy-950 tracking-tight">
          Terms of Verification & Use
        </h1>
        <p className="text-xs sm:text-sm text-gray-500">
          Last updated: October 2026 • Applies to all users, advertisers, and partner banks
        </p>
      </div>

      {/* Main Content Cards */}
      <div className="space-y-6 text-sm text-gray-700 leading-relaxed">
        {/* Section 1 */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
              1
            </div>
            <h2 className="font-display text-xl font-bold text-navy-950">
              The TrustNest Verified Standard
            </h2>
          </div>
          <p>
            By accessing or listing properties on TrustNest, you agree to adhere to our Verified Standard. All listings must represent real, legally existing immovable properties located in India. Uploading fictitious listings, bait-and-switch pricing, stock 3D renders masquerading as actual photos, or duplicate broker repostings without written owner authorization is strictly prohibited.
          </p>
        </div>

        {/* Section 2 */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
              2
            </div>
            <h2 className="font-display text-xl font-bold text-navy-950">
              RERA Compliance & Builder Disclosures
            </h2>
          </div>
          <p>
            In accordance with Real Estate (Regulation and Development) Act, 2016 (RERA):
          </p>
          <ul className="space-y-2 list-disc pl-5 text-gray-600">
            <li>Any commercial or residential project with land area exceeding 500 sq. meters or more than 8 apartments must display a valid, verifiable state RERA registration certificate.</li>
            <li>Promoters must disclose the designated RERA bank collection account, registered project completion date, and official regulatory portal URL.</li>
            <li>TrustNest reserves the right to unpublish any project immediately upon notice of state RERA suspension or revocation.</li>
          </ul>
        </div>

        {/* Section 3 */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
              3
            </div>
            <h2 className="font-display text-xl font-bold text-navy-950">
              Seller & Broker Declarations
            </h2>
          </div>
          <p>
            When submitting a listing on TrustNest, the seller or certified dealer warrants that:
          </p>
          <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-2 text-xs">
            <div className="flex items-center gap-2 text-navy-900 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>They hold clear title or an active, unrevoked Mandate Agreement from the registered titleholder.</span>
            </div>
            <div className="flex items-center gap-2 text-navy-900 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>The quoted price accurately reflects the asking consideration without hidden extortionate brokerage.</span>
            </div>
            <div className="flex items-center gap-2 text-navy-900 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Photographs and walkthrough videos represent the actual property premises in its current state.</span>
            </div>
          </div>
        </div>

        {/* Section 4 */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
              4
            </div>
            <h2 className="font-display text-xl font-bold text-navy-950">
              Platform Neutrality & Independent Legal Due Diligence
            </h2>
          </div>
          <p>
            While TrustNest conducts rigorous multi-point verification (Aadhaar KYC, PAN validation, GPS auditing, and title deed scan verification), prospective purchasers and lessees are advised to perform independent physical inspections and engage certified legal counsel to inspect original sub-registrar encumbrance certificates prior to remitting earnest money.
          </p>
        </div>

        {/* Section 5 */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
              5
            </div>
            <h2 className="font-display text-xl font-bold text-navy-950">
              Jurisdiction & Governing Law
            </h2>
          </div>
          <p>
            These terms are governed by the laws of India. Any legal dispute, arbitration, or statutory claim arising from portal usage shall be subject to the exclusive jurisdiction of the competent courts in Gurugram / New Delhi.
          </p>
        </div>
      </div>
    </div>
  );
};
