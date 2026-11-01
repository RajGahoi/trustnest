import React, { useState } from 'react';
import { X, HelpCircle, ChevronDown, ChevronUp, ShieldCheck, AlertCircle } from 'lucide-react';
import { LEGAL_DISCLAIMER_TEXT } from '../../domain/india/rera';

interface HelpCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenTicket: () => void;
}

export const HelpCenterModal: React.FC<HelpCenterModalProps> = ({
  isOpen,
  onClose,
  onOpenTicket
}) => {
  const [activeTab, setActiveTab] = useState<'FAQS' | 'GUIDELINES' | 'RERA' | 'POLICIES'>('FAQS');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  if (!isOpen) return null;

  const FAQS = [
    {
      q: 'How does TrustNest calculate a property Trust Score?',
      a: 'The TrustNest 5-Dimension Engine audits every listing across Identity (20 pts), Legal Documents (20 pts), Location & GPS Accuracy (20 pts), Media & EXIF Authenticity (20 pts), and Price/Fraud Anomaly Scan (20 pts). Scores 80+ receive Platinum/Gold verified promotion.'
    },
    {
      q: 'Why are contact reveals limited for free accounts?',
      a: 'To safeguard verified property owners from aggressive telemarketing, broker scrapers, and bot harassment, contact numbers are revealed through an audited quota system. Buyers receive 3 free reveals and can upgrade to an unlimited pass anytime.'
    },
    {
      q: 'Does TrustNest verify RERA registration for projects?',
      a: 'Yes. Where a listing represents a commercial or residential development project subject to state RERA acts, the developer or seller must provide their registered RERA ID, which is validated against state portals (e.g. UP RERA, HRERA, MahaRERA).'
    },
    {
      q: 'How do I mark my property as Sold or Rented?',
      a: 'Log in to your Seller or Vendor Dashboard, open My Listings, and click the Status dropdown to transition the listing to "Sold" or "Rented". This immediately pauses enquiries and archives the listing.'
    },
    {
      q: 'What is the refund policy for featured listing promotions?',
      a: 'If a listing is rejected by Trust Moderators due to invalid title documents within 48 hours of payment, a 100% automatic refund is credited to the original payment instrument.'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/75 backdrop-blur-md">
      <div className="bg-cream-50 w-full max-w-3xl rounded-3xl p-6 sm:p-8 border border-navy-900/15 shadow-2xl relative max-h-[90vh] flex flex-col text-navy-900">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-cream-200 text-navy-900 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-xs font-extrabold text-orange-500 uppercase tracking-wider mb-1">
          <HelpCircle className="w-4 h-4" />
          TrustNest Knowledge Base & Help Centre
        </div>

        <h3 className="text-xl sm:text-2xl font-extrabold text-navy-900 mb-4">
          Support, Safety & Marketplace Guidelines
        </h3>

        {/* Tab switcher */}
        <div className="flex border-b border-navy-900/10 gap-2 pb-2 text-xs font-bold overflow-x-auto">
          {[
            { id: 'FAQS', label: 'Frequently Asked Questions' },
            { id: 'GUIDELINES', label: 'Listing Guidelines' },
            { id: 'RERA', label: 'RERA & Legal Notice' },
            { id: 'POLICIES', label: 'Platform Policies & Refunds' }
          ].map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-navy-900 text-white shadow'
                  : 'bg-white text-navy-700 hover:bg-cream-200 border border-navy-900/10'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content area */}
        <div className="flex-1 overflow-y-auto mt-4 space-y-4 pr-1 text-xs">
          {activeTab === 'FAQS' && (
            <div className="space-y-3">
              {FAQS.map((faq, i) => {
                const isExpanded = expandedFaq === i;
                return (
                  <div
                    key={i}
                    className="p-4 bg-white rounded-2xl border border-navy-900/10 shadow-sm cursor-pointer transition-colors hover:border-orange-500/30"
                    onClick={() => setExpandedFaq(isExpanded ? null : i)}
                  >
                    <div className="flex items-center justify-between font-extrabold text-sm text-navy-900">
                      <span>{faq.q}</span>
                      {isExpanded ? <ChevronUp className="w-4 h-4 text-orange-500" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                    </div>
                    {isExpanded && (
                      <p className="mt-2 text-navy-700 leading-relaxed font-normal text-xs pt-2 border-t border-navy-900/5">
                        {faq.a}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === 'GUIDELINES' && (
            <div className="space-y-3">
              <div className="p-4 bg-white rounded-2xl border border-navy-900/10 space-y-2">
                <h4 className="font-extrabold text-sm text-navy-900 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-trust-green" />
                  Listing Do\'s:
                </h4>
                <ul className="list-disc pl-5 space-y-1 text-navy-700">
                  <li>Upload clear, high-resolution original photos taken at the physical property site.</li>
                  <li>Provide verifiable ownership documents: Registered Sale Deed, Mutation certificate, or Khata extract.</li>
                  <li>State the exact super built-up and carpet area using standard Indian area units (Sq. Ft. or Gaj).</li>
                  <li>Specify accurate RERA project registration numbers for newly developed apartments or plots.</li>
                </ul>
              </div>

              <div className="p-4 bg-red-50/50 rounded-2xl border border-red-200 space-y-2">
                <h4 className="font-extrabold text-sm text-red-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600" />
                  Listing Don\'ts (Will result in immediate suspension):
                </h4>
                <ul className="list-disc pl-5 space-y-1 text-red-800">
                  <li>Posting artificial bait-and-switch pricing significantly below market value.</li>
                  <li>Using watermarked stock images or copying photographs from competing portals.</li>
                  <li>Submitting false identity documents or forged electricity bills.</li>
                  <li>Repeatedly publishing identical duplicate listings across multiple categories.</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'RERA' && (
            <div className="p-5 bg-white rounded-2xl border border-navy-900/10 space-y-3">
              <h4 className="font-extrabold text-sm text-navy-900">
                Understanding RERA (Real Estate Regulatory Authority)
              </h4>
              <p className="text-navy-700 leading-relaxed">
                The Real Estate (Regulation and Development) Act, 2016 protects homebuyers and promotes transparency.
                On TrustNest, builder projects must display active registration numbers that can be cross-verified on the official state portals.
              </p>
              <div className="p-3 bg-amber-soft/20 rounded-xl border border-orange-500/20 text-navy-800 font-medium">
                {LEGAL_DISCLAIMER_TEXT}
              </div>
            </div>
          )}

          {activeTab === 'POLICIES' && (
            <div className="p-5 bg-white rounded-2xl border border-navy-900/10 space-y-3">
              <h4 className="font-extrabold text-sm text-navy-900">
                Terms of Service & Refund Guarantees
              </h4>
              <div className="space-y-2 text-navy-700 leading-relaxed">
                <p>
                  <strong>1. Fair Use Policy:</strong> All subscription plans are subject to reasonable fair-use limits. Automated scraping, contact harvesting, or reselling of contact numbers is strictly forbidden and results in immediate account termination.
                </p>
                <p>
                  <strong>2. Refund Terms:</strong> Paid featured boosts and buyer passes are non-refundable once contact reveals are utilized, except in cases where a seller account is confirmed to be fraudulent by Trust Moderators.
                </p>
                <p>
                  <strong>3. GST Invoices:</strong> All transactions include 18% Goods & Services Tax (CGST 9% + SGST 9%) under SAC code 998314. Digital invoices are accessible in your dashboard immediately upon checkout.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Support CTA */}
        <div className="pt-4 border-t border-navy-900/10 flex items-center justify-between">
          <span className="text-xs text-navy-700">Can\'t find what you need?</span>
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenTicket();
            }}
            className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-extrabold shadow-orange-glow transition-all cursor-pointer"
          >
            Raise Support Ticket
          </button>
        </div>
      </div>
    </div>
  );
};
