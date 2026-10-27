import React, { useState, useEffect } from 'react';
import { Heart, ShieldAlert, UserCheck, Trash2, ArrowRight } from 'lucide-react';
import { store } from '../../mock/store';
import { api } from '../../services/api';
import { ListingCard } from '../../components/listing/ListingCard';
import type { Listing, UserRole } from '../../types';

interface FavoritesPageProps {
  onOpenListingDetail: (listing: Listing) => void;
}

export const FavoritesPage: React.FC<FavoritesPageProps> = ({ onOpenListingDetail }) => {
  const [favorites, setFavorites] = useState<Listing[]>(store.getFavoritesList());
  const [currentRole, setCurrentRole] = useState<UserRole>(store.getCurrentRole());

  useEffect(() => {
    const refreshFavs = async () => {
      if (api.getToken()) {
        try {
          const apiFavs = await api.getFavorites();
          if (apiFavs && apiFavs.length > 0) {
            setFavorites(apiFavs);
            return;
          }
        } catch (e) {}
      }
      setFavorites(store.getFavoritesList());
      setCurrentRole(store.getCurrentRole());
    };
    refreshFavs();
    window.addEventListener('storage', refreshFavs);
    return () => window.removeEventListener('storage', refreshFavs);
  }, []);

  const handleClearAll = () => {
    favorites.forEach(listing => store.toggleFavorite(listing.id));
    setFavorites([]);
    alert('All favorites cleared.');
  };

  return (
    <div className="pt-24 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Auth Awareness Notice for Guest / Unauthenticated users */}
      {currentRole === 'GUEST' && (
        <div className="bg-amber-soft/20 border border-orange-500/30 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-navy-900">
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-5 h-5 text-orange-500 shrink-0" />
            <div>
              <div className="text-sm font-bold">Browsing Favorites in Guest Mode</div>
              <div className="text-xs text-navy-700">Favorites are saved locally in your browser. Switch role or log in to sync across devices.</div>
            </div>
          </div>
          <button
            onClick={() => {
              store.setRole('USER');
              setCurrentRole('USER');
            }}
            className="px-4 py-2 bg-navy-900 text-white text-xs font-bold rounded-xl hover:bg-navy-800 transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer"
          >
            <UserCheck className="w-3.5 h-3.5 text-orange-500" />
            <span>Switch to Verified User</span>
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-orange-500/15 flex items-center justify-center text-orange-500">
            <Heart className="w-6 h-6 fill-orange-500" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-navy-900 tracking-tight">Saved Verified Listings</h1>
            <p className="text-xs text-navy-700 mt-0.5">
              {favorites.length} saved property, vehicle & device listing{favorites.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {favorites.length > 0 && (
          <button
            onClick={handleClearAll}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-cream-50 border border-navy-900/10 rounded-xl text-xs font-bold text-navy-700 hover:text-red-600 hover:border-red-300 transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4 text-red-500" />
            <span>Clear All Saved</span>
          </button>
        )}
      </div>

      {/* Listings Grid */}
      {favorites.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map(listing => (
            <ListingCard
              key={listing.id}
              listing={listing}
              onOpenListing={onOpenListingDetail}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border border-navy-900/10 shadow-trust space-y-4 max-w-md mx-auto">
          <div className="w-16 h-16 bg-cream-200 text-gray-400 rounded-full flex items-center justify-center mx-auto">
            <Heart className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-extrabold text-navy-900">No Saved Listings Yet</h3>
          <p className="text-xs text-navy-700 leading-relaxed">
            Click the heart icon on any verified property, vehicle, or mobile listing to save it here for quick access.
          </p>
          <a
            href="#search"
            onClick={(e) => {
              e.preventDefault();
              window.location.hash = '#search';
            }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 text-white font-bold text-xs rounded-xl shadow-orange-glow hover:bg-orange-600 transition-all cursor-pointer"
          >
            <span>Explore Verified Listings</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      )}
    </div>
  );
};

