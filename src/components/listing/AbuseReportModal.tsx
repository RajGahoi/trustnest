import React, { useState } from 'react';
import { X, ShieldAlert, AlertTriangle, CheckCircle2 } from 'lucide-react';
import type { Listing } from '../../types';
import { store } from '../../mock/store';

interface AbuseReportModalProps {
  listing: Listing;
  onClose: () => void;
  onReportSuccess: () => void;
}

export const AbuseReportModal: React.FC<AbuseReportModalProps> = ({
  listing,
  onClose,
  onReportSuccess
}) => {
  const [reason, setReason] = useState<string>('PRICE_BAIT');
  const [description, setDescription] = useState('');
  const [reporterEmail, setReporterEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    store.createAbuseReport({
      listingId: listing.id,
      listingTitle: listing.title,
      reporterEmail: reporterEmail || 'anonymous@trustnest.in',
      reason: reason as any,
      description: description || 'Reported via Listing Detail Modal'
    });

    setIsSubmitting(false);
    setSubmitted(true);
    setTimeout(() => {
      onReportSuccess();
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/75 backdrop-blur-md">
      <div className="bg-cream-50 w-full max-w-md rounded-3xl p-6 border border-navy-900/15 shadow-2xl relative text-navy-900">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-cream-200 text-navy-900 cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-red-600 font-extrabold text-xs uppercase tracking-wider mb-1">
          <ShieldAlert className="w-4 h-4" />
          Fraud & Abuse Escalation
        </div>

        <h3 className="text-xl font-extrabold text-navy-900 mb-1">
          Report This Listing
        </h3>
        <p className="text-xs text-navy-700 mb-4 line-clamp-1">
          Listing: <span className="font-bold">{listing.title}</span>
        </p>

        {submitted ? (
          <div className="py-8 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-trust-green mx-auto" />
            <h4 className="font-extrabold text-base text-navy-900">Report Logged for Investigation</h4>
            <p className="text-xs text-navy-700">
              Our Trust & Moderation team has received this report and will audit seller proof documents and pricing models.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-navy-900 mb-1">Select Primary Violation</label>
              <select
                value={reason}
                onChange={e => setReason(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-navy-900/15 rounded-xl text-xs font-bold text-navy-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="PRICE_BAIT">Unrealistic / Bait & Switch Price</option>
                <option value="FAKE_PROPERTY">Fake Property / Unverified Ownership</option>
                <option value="DUPLICATE">Duplicate Listing Posted Multiple Times</option>
                <option value="UNREACHABLE">Unreachable Seller / Wrong Phone Number</option>
                <option value="COPYRIGHT_IMAGE">Stolen / Stock Photos without License</option>
                <option value="OTHER">Other Compliance / Harassment Issue</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-navy-900 mb-1">Details & Evidence</label>
              <textarea
                required
                rows={3}
                placeholder="Explain why this listing violates trust guidelines (e.g. seller quoted ₹90 Lakh on call but listed for ₹45 Lakh)..."
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-navy-900/15 rounded-xl text-xs font-medium text-navy-900 focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-navy-900 mb-1">Your Email (for investigation updates)</label>
              <input
                type="email"
                required
                placeholder="yourname@gmail.com"
                value={reporterEmail}
                onChange={e => setReporterEmail(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-navy-900/15 rounded-xl text-xs font-medium text-navy-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-cream-200 hover:bg-cream-300 text-navy-900 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-extrabold shadow-md transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Submit Violation Report</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
