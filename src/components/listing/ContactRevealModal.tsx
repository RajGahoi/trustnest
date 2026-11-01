import React, { useState } from 'react';
import { Phone, Unlock, ShieldCheck, Sparkles, AlertCircle } from 'lucide-react';
import type { Listing } from '../../types';
import { store } from '../../mock/store';
import { api } from '../../services/api';

interface ContactRevealModalProps {
  listing: Listing;
  isOpen: boolean;
  onClose: () => void;
  onOpenSubscriptionModal: () => void;
}

export const ContactRevealModal: React.FC<ContactRevealModalProps> = ({
  listing,
  isOpen,
  onClose,
  onOpenSubscriptionModal
}) => {
  const [revealed, setRevealed] = useState(false);
  const revealsLeft = store.getContactRevealsRemaining();

  if (!isOpen) return null;

  const handleReveal = () => {
    if (revealsLeft <= 0) {
      onOpenSubscriptionModal();
      return;
    }

    const success = store.decrementContactReveal();
    if (success) {
      setRevealed(true);
      // Capture lead intent
      api.createLead({
        listingId: listing.id,
        buyerName: 'Verified Member',
        buyerPhone: '+91 98765 43210',
        buyerEmail: 'member@trustnest.in',
        message: 'Direct Seller Contact Number Revealed',
        channel: 'CALL_INTENT'
      }).catch(() => {
        store.createLead(
          listing.id,
          'Verified Member',
          '+91 98765 43210',
          'member@trustnest.in',
          'Direct Seller Contact Number Revealed',
          'CALL_INTENT'
        );
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-md">
      <div className="bg-cream-50 w-full max-w-md rounded-3xl p-6 border border-navy-900/15 shadow-2xl relative text-navy-900">
        <div className="flex items-center gap-2 text-orange-500 font-extrabold text-xs uppercase tracking-wider mb-1">
          <ShieldCheck className="w-4 h-4 text-trust-green" />
          Protected Contact Reveal
        </div>

        <h3 className="text-xl font-extrabold text-navy-900 mb-2">
          Seller Contact Information
        </h3>

        <div className="p-3.5 bg-white rounded-2xl border border-navy-900/10 shadow-sm flex items-center gap-3 mb-4">
          <img
            src={listing.sellerAvatar}
            alt={listing.sellerName}
            className="w-12 h-12 rounded-xl object-cover border border-orange-500/30"
          />
          <div>
            <div className="font-extrabold text-sm text-navy-900">{listing.sellerName}</div>
            <div className="text-xs text-navy-700">{listing.sellerType} · Rating: {listing.sellerRating} ★</div>
          </div>
        </div>

        {revealed ? (
          <div className="space-y-4 text-center py-2 animate-in fade-in duration-200">
            <div className="p-4 bg-trust-green/10 border border-trust-green/30 rounded-2xl">
              <span className="text-xs text-navy-700 font-semibold block mb-1">Verified Direct Phone:</span>
              <a
                href={`tel:${listing.sellerPhone}`}
                className="text-xl font-extrabold text-navy-900 hover:text-orange-500 transition-colors flex items-center justify-center gap-2"
              >
                <Phone className="w-5 h-5 text-trust-green" />
                <span>{listing.sellerPhone}</span>
              </a>
              <span className="text-[10px] text-gray-500 mt-1 block">Click number to initiate phone call</span>
            </div>

            <div className="text-xs text-navy-700">
              Free reveals remaining this month: <span className="font-bold text-orange-600">{revealsLeft}</span>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-full py-2.5 bg-navy-900 text-white font-bold rounded-xl text-xs hover:bg-navy-800 transition-colors cursor-pointer"
            >
              Done
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-3.5 bg-amber-soft/30 border border-orange-500/20 rounded-2xl text-xs text-navy-800">
              <div className="flex items-center justify-between font-bold mb-1">
                <span>Account Reveal Allowance:</span>
                <span className="px-2 py-0.5 bg-orange-500 text-white rounded-full text-[10px]">
                  {revealsLeft} remaining
                </span>
              </div>
              <p className="text-[11px] text-navy-700">
                To protect property owners from spam scrapers and unauthorized commercial telemarketing, contact reveals are tracked.
              </p>
            </div>

            {revealsLeft > 0 ? (
              <button
                type="button"
                onClick={handleReveal}
                className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs rounded-xl shadow-orange-glow transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Unlock className="w-4 h-4" />
                <span>Reveal Phone Number (Uses 1 Allowance)</span>
              </button>
            ) : (
              <div className="space-y-2">
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>You have used all free contact reveals for your account.</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenSubscriptionModal();
                  }}
                  className="w-full py-3 bg-navy-900 hover:bg-navy-800 text-white font-extrabold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-orange-400" />
                  <span>Upgrade to Buyer Pass (Unlimited Reveals)</span>
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={onClose}
              className="w-full py-2 bg-cream-200 hover:bg-cream-300 text-navy-900 font-bold rounded-xl text-xs transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
