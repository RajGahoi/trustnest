import React, { useState } from 'react';
import { ShieldCheck, Phone, MessageSquare, Star, CheckCircle, Lock } from 'lucide-react';
import type { Listing } from '../../types';
import { store } from '../../mock/store';
import { api } from '../../services/api';

interface SellerCardProps {
  listing: Listing;
  onOpenChat?: () => void;
}

export const SellerCard: React.FC<SellerCardProps> = ({ listing, onOpenChat }) => {
  const [phoneRevealed, setPhoneRevealed] = useState(false);
  const [showLeadModal, setShowLeadModal] = useState(false);

  // Form states
  const [buyerName, setBuyerName] = useState('');
  const [buyerPhone, setBuyerPhone] = useState('');
  const [leadSuccess, setLeadSuccess] = useState(false);

  const handleRevealPhone = () => {
    setPhoneRevealed(true);
    api.createLead({
      listingId: listing.id,
      buyerName: 'Verified Guest',
      buyerPhone: '+91 99999 88888',
      buyerEmail: 'guest@trustnest.in',
      message: 'Revealed seller contact phone',
      channel: 'CALL_INTENT'
    }).catch(() => {
      store.createLead(
        listing.id,
        'Verified Guest',
        '+91 99999 88888',
        'guest@trustnest.in',
        'Revealed seller contact phone',
        'CALL_INTENT'
      );
    });
  };

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!buyerName || !buyerPhone) return;

    api.createLead({
      listingId: listing.id,
      buyerName,
      buyerPhone,
      buyerEmail: 'buyer@trustnest.in',
      message: 'Enquired via Seller Card form',
      channel: 'CHAT'
    }).catch(() => {
      store.createLead(
        listing.id,
        buyerName,
        buyerPhone,
        'buyer@trustnest.in',
        'Enquired via Seller Card form',
        'CHAT'
      );
    });

    setLeadSuccess(true);
    setTimeout(() => {
      setShowLeadModal(false);
      setLeadSuccess(false);
    }, 2000);
  };

  return (
    <div className="bg-cream-50 rounded-3xl p-6 border border-navy-900/10 shadow-trust text-navy-900">
      <div className="flex items-start justify-between gap-4 pb-4 border-b border-navy-900/10">
        <div className="flex items-center gap-3">
          <img
            src={listing.sellerAvatar}
            alt={listing.sellerName}
            className="w-14 h-14 rounded-2xl object-cover border-2 border-orange-500/40 shadow-sm"
          />
          <div>
            <div className="flex items-center gap-1.5 font-bold text-lg text-navy-900">
              <span>{listing.sellerName}</span>
              {listing.sellerVerified && (
                <CheckCircle className="w-4 h-4 text-trust-green fill-trust-green/20" />
              )}
            </div>

            <div className="flex items-center gap-2 text-xs text-navy-700 font-medium mt-0.5">
              <span className="px-2 py-0.5 bg-navy-900 text-cream-50 rounded-full font-bold uppercase tracking-wider text-[10px]">
                {listing.sellerType}
              </span>
              <span className="flex items-center gap-1 text-orange-500 font-semibold">
                <Star className="w-3.5 h-3.5 fill-orange-500" />
                {listing.sellerRating} (Verified Seller)
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="py-4 space-y-3">
        <div className="flex items-center justify-between text-xs text-navy-700 bg-white/70 p-3 rounded-xl border border-navy-900/5">
          <span className="flex items-center gap-2 font-medium">
            <ShieldCheck className="w-4 h-4 text-trust-green" />
            Identity & Documents
          </span>
          <span className="text-trust-green font-bold uppercase tracking-wider">Aadhaar/PAN Verified</span>
        </div>

        {/* Contact buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
          {phoneRevealed ? (
            <a
              href={`tel:${listing.sellerPhone}`}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-trust-green text-white font-bold rounded-2xl text-sm shadow-md hover:bg-emerald-600 transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span>{listing.sellerPhone}</span>
            </a>
          ) : (
            <button
              type="button"
              onClick={handleRevealPhone}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-navy-900 text-cream-50 font-bold rounded-2xl text-sm shadow-md hover:bg-navy-800 transition-colors cursor-pointer"
            >
              <Lock className="w-4 h-4 text-orange-500" />
              <span>Reveal Contact</span>
            </button>
          )}

          <button
            type="button"
            onClick={onOpenChat || (() => setShowLeadModal(true))}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-orange-500 text-white font-bold rounded-2xl text-sm shadow-orange-glow hover:bg-orange-600 transition-colors cursor-pointer"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Send Message</span>
          </button>
        </div>
      </div>

      {/* Enquiry Modal */}
      {showLeadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-md">
          <div className="bg-cream-50 w-full max-w-md rounded-3xl p-6 border border-navy-900/10 shadow-trust relative">
            <h3 className="text-xl font-bold text-navy-900 mb-1">Contact Verified Seller</h3>
            <p className="text-xs text-navy-700 mb-4">
              Your details will be protected and securely transmitted to {listing.sellerName}.
            </p>

            {leadSuccess ? (
              <div className="p-4 bg-trust-green/10 text-trust-green rounded-2xl font-bold text-center text-sm border border-trust-green/30">
                Enquiry sent! The seller will reach out shortly.
              </div>
            ) : (
              <form onSubmit={handleLeadSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-navy-900 mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    value={buyerName}
                    onChange={e => setBuyerName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full px-3.5 py-2.5 bg-white border border-navy-900/15 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-navy-900 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={buyerPhone}
                    onChange={e => setBuyerPhone(e.target.value)}
                    placeholder="+91 Mobile number"
                    className="w-full px-3.5 py-2.5 bg-white border border-navy-900/15 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowLeadModal(false)}
                    className="w-1/2 py-2.5 bg-cream-200 text-navy-900 font-bold rounded-xl text-xs hover:bg-cream-300 active:bg-cream-400 cursor-pointer transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="w-1/2 py-2.5 bg-orange-500 text-white font-bold rounded-xl text-xs shadow-md hover:bg-orange-600 active:bg-orange-700 cursor-pointer transition-colors"
                  >
                    Submit Enquiry
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
