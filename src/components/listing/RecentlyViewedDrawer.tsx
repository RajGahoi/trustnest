import React from 'react';
import { Clock, Trash2, X, ShieldCheck } from 'lucide-react';
import type { Listing } from '../../types';
import { store } from '../../mock/store';

interface RecentlyViewedDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenListingDetail: (listing: Listing) => void;
}

export const RecentlyViewedDrawer: React.FC<RecentlyViewedDrawerProps> = ({
  isOpen,
  onClose,
  onOpenListingDetail
}) => {
  if (!isOpen) return null;

  const recentListings = store.getRecentlyViewed();

  const handleClear = () => {
    store.clearRecentlyViewed();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-navy-950/60 backdrop-blur-sm">
      <div className="bg-cream-50 w-full max-w-md h-full shadow-2xl p-6 border-l border-navy-900/15 flex flex-col text-navy-900 animate-in slide-in-from-right duration-200">
        <div className="flex items-center justify-between pb-4 border-b border-navy-900/10">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-orange-500" />
            <h3 className="font-extrabold text-base text-navy-900">
              Recently Viewed ({recentListings.length})
            </h3>
          </div>
          <div className="flex items-center gap-2">
            {recentListings.length > 0 && (
              <button
                type="button"
                onClick={handleClear}
                className="text-xs text-red-600 hover:text-red-700 font-bold flex items-center gap-1 cursor-pointer"
                title="Clear browsing history"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear History</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-cream-200 text-navy-900 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto mt-4 space-y-3 pr-1">
          {recentListings.length > 0 ? (
            recentListings.map(l => (
              <div
                key={l.id}
                onClick={() => {
                  onClose();
                  onOpenListingDetail(l);
                }}
                className="p-3 bg-white rounded-2xl border border-navy-900/10 shadow-sm hover:border-orange-500/40 transition-all cursor-pointer flex items-center gap-3"
              >
                <img
                  src={l.images[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=200&q=80'}
                  alt={l.title}
                  className="w-16 h-16 rounded-xl object-cover border border-navy-900/10 flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1 text-[10px] text-trust-green font-extrabold uppercase">
                    <ShieldCheck className="w-3 h-3" />
                    <span>Score {l.trustScore.overallScore}</span>
                  </div>
                  <h4 className="font-extrabold text-xs text-navy-900 truncate mt-0.5">{l.title}</h4>
                  <p className="text-[11px] text-navy-700 truncate">{l.location.locality}, {l.location.city}</p>
                  <span className="font-extrabold text-xs text-orange-600 block mt-1">{l.formattedPrice}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="py-12 text-center text-xs text-gray-500">
              No recently viewed properties. Browse the marketplace and listings you open will appear here!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
